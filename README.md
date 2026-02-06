<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <title>AI Lead Genius | API Auto-Save</title>
    <style>
        :root { --primary: #3b82f6; --bg: #0f172a; --card: #1e293b; --text: #f8fafc; }
        body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', sans-serif; padding: 20px; }
        .container { max-width: 1000px; margin: auto; }
        
        /* API Setup UI */
        .setup-box { background: #1e40af; padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #3b82f6; }
        .setup-box input { padding: 10px; border-radius: 6px; border: none; width: 300px; margin-right: 10px; }
        .save-btn { background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; }
        
        .input-box { background: var(--card); padding: 25px; border-radius: 15px; display: flex; gap: 10px; margin-bottom: 20px; border: 1px solid #334155; }
        input[type="text"] { flex: 1; padding: 12px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white; }
        
        button.action-btn { background: var(--primary); color: white; border: none; padding: 12px 25px; border-radius: 8px; cursor: pointer; font-weight: bold; }
        
        table { width: 100%; border-collapse: collapse; background: var(--card); border-radius: 10px; overflow: hidden; margin-top: 20px; }
        th, td { padding: 15px; border-bottom: 1px solid #334155; text-align: left; }
        th { background: #334155; color: var(--primary); }
        
        .loader { display: none; text-align: center; color: #f59e0b; padding: 20px; font-weight: bold; }
        .status-msg { font-size: 12px; color: #10b981; margin-top: 5px; display: block; }
    </style>
</head>
<body>

<div class="container">
    <div class="setup-box" id="apiSection">
        <label>⚙️ Gemini API Key সেটআপ: </label>
        <input type="password" id="apiKeyInput" placeholder="এখানে আপনার API Key দিন">
        <button class="save-btn" onclick="saveApiKey()">Save Key</button>
        <span id="saveStatus" class="status-msg" style="color: white; display:none;">✅ সেভ হয়েছে!</span>
    </div>

    <div class="input-box">
        <input type="text" id="company" placeholder="কোম্পানির নাম (e.g. Google)">
        <input type="text" id="role" placeholder="টার্গেট পজিশন (e.g. HR Manager)">
        <button class="action-btn" onclick="getAILeads()">🚀 লিড বের করো</button>
    </div>

    <div id="loader" class="loader">🔍 AI ইন্টারনেটে ডাটা খুঁজছে... একটু অপেক্ষা করুন...</div>

    <table id="leadTable">
        <thead>
            <tr>
                <th>কোম্পানি ও ওয়েবসাইট</th>
                <th>টার্গেট ব্যক্তি ও পজিশন</th>
                <th>ইমেইল ও ফোন</th>
                <th>অফিসের ঠিকানা</th>
            </tr>
        </thead>
        <tbody id="tableBody"></tbody>
    </table>
    
    <br>
    <button style="background: #6366f1; width: 100%; padding: 15px; border-radius: 10px; color: white; border: none; cursor: pointer; font-weight: bold;" onclick="downloadCSV()">📥 এক্সেল ফাইল (CSV) ডাউনলোড করুন</button>
</div>

<script>
    // সাইট লোড হওয়ার সময় আগের সেভ করা API Key আছে কি না দেখা
    window.onload = function() {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
            document.getElementById('apiKeyInput').value = savedKey;
            document.getElementById('saveStatus').style.display = 'inline';
            document.getElementById('saveStatus').innerText = "✅ সেভ করা API Key ব্যবহার হচ্ছে";
        }
    };

    // API Key ব্রাউজারে সেভ করার ফাংশন
    function saveApiKey() {
        const key = document.getElementById('apiKeyInput').value;
        if (key) {
            localStorage.setItem('gemini_api_key', key);
            document.getElementById('saveStatus').style.display = 'inline';
            document.getElementById('saveStatus').innerText = "✅ Key সফলভাবে সেভ হয়েছে!";
            setTimeout(() => { document.getElementById('saveStatus').style.color = "white"; }, 2000);
        } else {
            alert("দয়া করে আগে Key লিখুন!");
        }
    }

    async function getAILeads() {
        const apiKey = localStorage.getItem('gemini_api_key') || document.getElementById('apiKeyInput').value;
        const company = document.getElementById('company').value;
        const role = document.getElementById('role').value;

        if (!apiKey) { alert("দয়া করে API Key সেভ করুন!"); return; }
        if (!company || !role) { alert("কোম্পানি এবং পজিশন দুটোই দিন!"); return; }

        document.getElementById('loader').style.display = 'block';

        const prompt = `Find professional lead details. Company: ${company}, Target Role: ${role}. 
        Provide: Official website, Name of person in this role, Email pattern (like name@company.com), Phone (office), and Office Address.
        Return ONLY a JSON array. Format: [{"company_name": "...", "website": "...", "person_name": "...", "person_role": "...", "email": "...", "phone": "...", "address": "..."}]`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const data = await response.json();
            const textResponse = data.candidates[0].content.parts[0].text;
            
            // JSON ক্লিনিং
            const jsonStart = textResponse.indexOf('[');
            const jsonEnd = textResponse.lastIndexOf(']') + 1;
            const cleanData = JSON.parse(textResponse.substring(jsonStart, jsonEnd));

            const tbody = document.getElementById('tableBody');
            cleanData.forEach(item => {
                const row = tbody.insertRow(0); // নতুন ডাটা উপরে দেখাবে
                row.innerHTML = `
                    <td><b>${item.company_name}</b><br><small><a href="${item.website}" target="_blank" style="color:#3b82f6;">${item.website}</a></small></td>
                    <td><b>${item.person_name}</b><br><small>${item.person_role}</small></td>
                    <td>${item.email}<br>${item.phone}</td>
                    <td>${item.address}</td>
                `;
            });
        } catch (error) {
            console.error(error);
            alert("AI তথ্য খুঁজে পায়নি। API Key সঠিক আছে কি না চেক করুন।");
        }
        document.getElementById('loader').style.display = 'none';
    }

    function downloadCSV() {
        let csv = ["Company,Website,Name,Role,Email,Phone,Address"];
        let rows = document.querySelectorAll("#tableBody tr");
        rows.forEach(row => {
            let cols = row.querySelectorAll("td");
            let rowData = Array.from(cols).map(c => `"${c.innerText.replace(/\n/g, ' ')}"`).join(",");
            csv.push(rowData);
        });
        const blob = new Blob([csv.join("\n")], { type: "text/csv" });
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = "Leads_AI_Report.csv";
        a.click();
    }
</script>

</body>
</html>
