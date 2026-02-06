<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <title>AI Lead Genius | Powered by Gemini</title>
    <style>
        :root { --primary: #3b82f6; --bg: #0f172a; --card: #1e293b; --text: #f8fafc; }
        body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', sans-serif; padding: 20px; }
        .container { max-width: 1000px; margin: auto; }
        .setup-box { background: #1e40af; padding: 15px; border-radius: 10px; margin-bottom: 20px; }
        .input-box { background: var(--card); padding: 25px; border-radius: 15px; display: flex; gap: 10px; margin-bottom: 20px; }
        input { flex: 1; padding: 12px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white; }
        button { background: #10b981; color: white; border: none; padding: 12px 25px; border-radius: 8px; cursor: pointer; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; background: var(--card); border-radius: 10px; overflow: hidden; }
        th, td { padding: 15px; border-bottom: 1px solid #334155; text-align: left; }
        th { background: #334155; color: var(--primary); }
        .loader { display: none; text-align: center; color: #f59e0b; margin: 10px; }
    </style>
</head>
<body>

<div class="container">
    <div class="setup-box">
        <label>AIzaSyDLFs8mwx9W5_twBQh2l-VGKl9aBsBFeSQ </label>
        <input type="password" id="apiKey" placeholder="এখানে API Key পেস্ট করুন">
    </div>

    <div class="input-box">
        <input type="text" id="company" placeholder="কোম্পানির নাম (যেমন: Microsoft)">
        <input type="text" id="role" placeholder="টার্গেট পজিশন (যেমন: HR Manager)">
        <button onclick="getAILeads()">AI দিয়ে লিড বের করো</button>
    </div>

    <div id="loader" class="loader">🔍 AI তথ্য খুঁজছে... কয়েক সেকেন্ড সময় দিন...</div>

    <table id="leadTable">
        <thead>
            <tr>
                <th>কোম্পানি ও ওয়েবসাইট</th>
                <th>টার্গেট ব্যক্তি</th>
                <th>ইমেইল/ফোন</th>
                <th>অ্যাড্রেস</th>
            </tr>
        </thead>
        <tbody id="tableBody"></tbody>
    </table>
    <br>
    <button style="background: #6366f1;" onclick="downloadCSV()">CSV ডাউনলোড করুন</button>
</div>

<script>
    async function getAILeads() {
        const apiKey = document.getElementById('apiKey').value;
        const company = document.getElementById('company').value;
        const role = document.getElementById('role').value;

        if (!apiKey || !company || !role) { alert("সবগুলো ঘর পূরণ করুন!"); return; }

        document.getElementById('loader').style.display = 'block';

        const prompt = `Find details for lead generation. Company: ${company}, Target Role: ${role}. 
        Return only a JSON array with: company_name, website, person_name, person_role, email_pattern, phone, address. 
        Example format: [{"company_name": "...", "website": "...", "person_name": "...", "person_role": "...", "email_pattern": "...", "phone": "...", "address": "..."}]`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;
            const cleanData = JSON.parse(text.substring(text.indexOf('['), text.lastIndexOf(']') + 1));

            const tbody = document.getElementById('tableBody');
            cleanData.forEach(item => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td><b>${item.company_name}</b><br><small>${item.website}</small></td>
                    <td><b>${item.person_name}</b><br><small>${item.person_role}</small></td>
                    <td>${item.email_pattern}<br>${item.phone}</td>
                    <td>${item.address}</td>
                `;
            });
        } catch (error) {
            console.error(error);
            alert("তথ্য খুঁজে পাওয়া যায়নি বা API Key ভুল।");
        }
        document.getElementById('loader').style.display = 'none';
    }

    function downloadCSV() {
        let rows = document.querySelectorAll("table tr");
        let csv = [];
        for (let i = 0; i < rows.length; i++) {
            let row = [], cols = rows[i].querySelectorAll("td, th");
            for (let j = 0; j < cols.length; j++) row.push('"' + cols[j].innerText + '"');
            csv.push(row.join(","));
        }
        const blob = new Blob([csv.join("\n")], { type: "text/csv" });
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = "AI_Leads.csv";
        a.click();
    }
</script>

</body>
</html>
