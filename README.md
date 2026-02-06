<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <title>Lead Genius Pro | AI Fixed</title>
    <style>
        :root { --primary: #3b82f6; --bg: #0f172a; --card: #1e293b; --text: #f8fafc; }
        body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', sans-serif; padding: 20px; }
        .container { max-width: 1000px; margin: auto; }
        .setup-box { background: #1e40af; padding: 15px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #3b82f6; }
        input { padding: 12px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white; outline: none; }
        .save-btn { background: #10b981; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; }
        .input-box { background: var(--card); padding: 25px; border-radius: 15px; display: flex; gap: 10px; margin-bottom: 20px; border: 1px solid #334155; }
        .action-btn { background: var(--primary); color: white; border: none; padding: 12px 25px; border-radius: 8px; cursor: pointer; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; background: var(--card); border-radius: 10px; overflow: hidden; margin-top: 20px; }
        th, td { padding: 15px; border-bottom: 1px solid #334155; text-align: left; }
        th { background: #334155; color: var(--primary); }
        .loader { display: none; text-align: center; color: #f59e0b; padding: 20px; font-weight: bold; }
    </style>
</head>
<body>

<div class="container">
    <div class="setup-box">
        <label>🔑 API Key: </label>
        <input type="password" id="apiKeyInput" placeholder="AIzaSyAyechkQ2c5muIfkJtar8v8v4-iE9E8-EM">
        <button class="save-btn" onclick="saveApiKey()">Save Key</button>
        <span id="saveStatus" style="font-size:12px; margin-left:10px;"></span>
    </div>

    <div class="input-box">
        <input type="text" id="company" style="flex:2" placeholder="কোম্পানির নাম">
        <input type="text" id="role" style="flex:1" placeholder="পজিশন (যেমন: CEO)">
        <button class="action-btn" onclick="getAILeads()">🚀 লিড বের করো</button>
    </div>

    <div id="loader" class="loader">⚙️ AI ডাটা জেনারেট করছে... একটু অপেক্ষা করুন...</div>

    <table id="leadTable">
        <thead>
            <tr>
                <th>কোম্পানি ও সাইট</th>
                <th>ব্যক্তি ও পজিশন</th>
                <th>ইমেইল ও ফোন</th>
                <th>অফিস ঠিকানা</th>
            </tr>
        </thead>
        <tbody id="tableBody"></tbody>
    </table>
    <br>
    <button onclick="downloadCSV()" style="width:100%; padding:15px; background:#6366f1; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:bold;">📥 CSV ডাউনলোড</button>
</div>

<script>
    window.onload = () => {
        const saved = localStorage.getItem('AIzaSyAyechkQ2c5muIfkJtar8v8v4-iE9E8-EM');
        if(saved) {
            document.getElementById('apiKeyInput').value = saved;
            document.getElementById('saveStatus').innerText = "✅ সেভ আছে";
        }
    };

    function saveApiKey() {
        const k = document.getElementById('apiKeyInput').value.trim();
        if(k) {
            localStorage.setItem('gemini_api_key', k);
            document.getElementById('saveStatus').innerText = "✅ সফলভাবে সেভ হয়েছে!";
            document.getElementById('saveStatus').style.color = "#10b981";
        }
    }

    async function getAILeads() {
        const key = localStorage.getItem('AIzaSyAyechkQ2c5muIfkJtar8v8v4-iE9E8-EM');
        const company = document.getElementById('company').value.trim();
        const role = document.getElementById('role').value.trim();

        if(!key) { alert("AIzaSyAyechkQ2c5muIfkJtar8v8v4-iE9E8-EM!"); return; }
        if(!company || !role) { alert("সবগুলো ঘর পূরণ করুন!"); return; }

        document.getElementById('loader').style.display = 'block';

        // প্রম্পট আরও ক্লিয়ার করা হয়েছে
        const prompt = `Return a JSON array of lead for company "${company}" and role "${role}". 
        Include fields: company, web, name, role, email, phone, addr. 
        Only return the raw JSON code block. Example: [{"company":"..","web":"..","name":"..","role":"..","email":"..","phone":"..","addr":".."}]`;

        try {
            // ভার্সন v1 এবং মডেল gemini-1.5-flash ব্যবহার করা হয়েছে যা এখন স্টেবল
            const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`;
            
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const data = await res.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }

            let responseText = data.candidates[0].content.parts[0].text;
            
            // JSON ক্লিনিং যাতে ব্যাকটিক বা অন্য টেক্সট থাকলেও কাজ করে
            const match = responseText.match(/\[[\s\S]*\]/);
            if (!match) throw new Error("AI সঠিক ডাটা ফরম্যাট দিতে পারেনি। আবার চেষ্টা করুন।");
            
            const cleanData = JSON.parse(match[0]);

            const tbody = document.getElementById('tableBody');
            cleanData.forEach(item => {
                const row = tbody.insertRow(0);
                row.innerHTML = `
                    <td><b>${item.company}</b><br><small><a href="${item.web.startsWith('http') ? item.web : 'https://'+item.web}" target="_blank" style="color:#3b82f6;">${item.web}</a></small></td>
                    <td><b>${item.name}</b><br><small>${item.role}</small></td>
                    <td>${item.email}<br>${item.phone}</td>
                    <td>${item.addr}</td>
                `;
            });

        } catch (e) {
            console.error("Error Detail:", e);
            alert("ভুল হয়েছে: " + e.message);
        } finally {
            document.getElementById('loader').style.display = 'none';
        }
    }

    function downloadCSV() {
        let csv = ["Company,Website,Name,Role,Email,Phone,Address"];
        document.querySelectorAll("#tableBody tr").forEach(row => {
            let cols = Array.from(row.querySelectorAll("td")).map(c => `"${c.innerText.replace(/\n/g, ' ')}"`).join(",");
            csv.push(cols);
        });
        const blob = new Blob([csv.join("\n")], { type: "text/csv" });
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = "Leads_Data.csv";
        a.click();
    }
</script>

</body>
</html>
