<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <title>Lead Hunter Pro | Link Engine</title>
    <style>
        :root { --primary: #3b82f6; --bg: #0f172a; --card: #1e293b; --text: #f8fafc; }
        body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', sans-serif; padding: 20px; }
        .container { max-width: 1100px; margin: auto; }
        .header { text-align: center; padding: 20px; background: linear-gradient(135deg, #1e40af, #3b82f6); border-radius: 12px; margin-bottom: 20px; }
        .search-box { background: var(--card); padding: 25px; border-radius: 12px; border: 1px solid #334155; display: grid; grid-template-columns: 2fr 2fr 1fr; gap: 15px; }
        input { padding: 12px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white; outline: none; }
        button { background: #10b981; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; }
        button:hover { background: #059669; }
        
        table { width: 100%; border-collapse: collapse; margin-top: 20px; background: var(--card); border-radius: 10px; overflow: hidden; }
        th { background: #334155; color: #3b82f6; padding: 15px; text-align: left; }
        td { padding: 15px; border-bottom: 1px solid #334155; font-size: 14px; }
        
        .btn-link { display: inline-block; padding: 6px 12px; margin: 2px; border-radius: 5px; text-decoration: none; font-size: 12px; font-weight: bold; }
        .blue { background: #2563eb; color: white; }
        .purple { background: #8b5cf6; color: white; }
        .orange { background: #f59e0b; color: white; }
        .download-area { margin-top: 20px; text-align: right; }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>🚀 Lead Hunter Pro</h1>
        <p>কোম্পানি ও পার্সন প্রোফাইল লিঙ্ক জেনারেটর</p>
    </div>

    <div class="search-box">
        <input type="text" id="compName" placeholder="কোম্পানির নাম (যেমন: Tesla)">
        <input type="text" id="jobTitle" placeholder="পজিশন (যেমন: Marketing Manager)">
        <button onclick="generateLeads()">জেনারেশন শুরু করুন</button>
    </div>

    <table>
        <thead>
            <tr>
                <th>কোম্পানি</th>
                <th>টার্গেট পজিশন</th>
                <th>কোম্পানি তথ্য লিঙ্ক</th>
                <th>পার্সন প্রোফাইল লিঙ্ক</th>
            </tr>
        </thead>
        <tbody id="leadTable">
            </tbody>
    </table>

    <div class="download-area">
        <button onclick="downloadCSV()" style="background: #4b5563;">📥 এক্সেল ফাইল ডাউনলোড (CSV)</button>
    </div>
</div>

<script>
    function generateLeads() {
        const company = document.getElementById('compName').value;
        const title = document.getElementById('jobTitle').value;

        if(!company || !title) { alert("দয়া করে নাম এবং পজিশন দুটোই দিন"); return; }

        const table = document.getElementById('leadTable');
        const row = table.insertRow(0);

        // ১. কোম্পানির অফিসিয়াল ওয়েবসাইট ও কন্টাক্ট লিঙ্ক জেনারেটর
        const webLink = `https://www.google.com/search?q=${company}+official+website+contact+phone`;
        
        // ২. টার্গেটেড পার্সনের প্রোফাইল লিঙ্ক (LinkedIn Deep Search)
        const personLink = `https://www.google.com/search?q=site:linkedin.com/in+"${title}"+"${company}"`;
        
        // ৩. কোম্পানির ইমেইল ফরম্যাট খোঁজার লিঙ্ক
        const emailPattern = `https://www.google.com/search?q="${company}"+email+format+OR+"@${company.toLowerCase().replace(/\s/g, '')}.com"`;

        row.innerHTML = `
            <td><b>${company}</b></td>
            <td>${title}</td>
            <td>
                <a href="${webLink}" target="_blank" class="btn-link blue">🌐 Website/Info</a>
            </td>
            <td>
                <a href="${personLink}" target="_blank" class="btn-link purple">👤 LinkedIn Profile</a>
                <a href="${emailPattern}" target="_blank" class="btn-link orange">📧 Email Hunter</a>
            </td>
        `;
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
        a.download = "Leads_Worksheet.csv";
        a.click();
    }
</script>

</body>
</html>
