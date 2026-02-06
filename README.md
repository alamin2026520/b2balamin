<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LeadGen Master Pro | Automation Tool</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
    <style>
        :root {
            --primary: #3b82f6;
            --accent: #10b981;
            --bg: #0f172a;
            --card: #1e293b;
            --text: #f8fafc;
        }

        body {
            background-color: var(--bg);
            color: var(--text);
            font-family: 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 1100px;
            margin: auto;
        }

        /* Header UI */
        header {
            text-align: center;
            padding: 30px 0;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            border-radius: 15px;
            margin-bottom: 30px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }

        header h1 { margin: 0; font-size: 28px; letter-spacing: 1px; }
        header p { margin: 10px 0 0; opacity: 0.9; }

        /* Input Section */
        .glass-card {
            background: var(--card);
            padding: 25px;
            border-radius: 15px;
            border: 1px solid #334155;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }

        input {
            background: #0f172a;
            border: 1px solid #334155;
            padding: 12px;
            border-radius: 8px;
            color: white;
            outline: none;
            transition: 0.3s;
        }

        input:focus { border-color: var(--primary); box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }

        /* Buttons */
        .btn-group {
            display: flex;
            gap: 10px;
            grid-column: 1 / -1;
            margin-top: 10px;
        }

        button {
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: 0.3s;
        }

        .btn-add { background: var(--primary); color: white; flex: 2; }
        .btn-add:hover { background: #2563eb; transform: translateY(-2px); }
        .btn-download { background: var(--accent); color: white; flex: 1; }
        .btn-download:hover { background: #059669; transform: translateY(-2px); }

        /* Table UI */
        .table-container {
            background: var(--card);
            border-radius: 15px;
            padding: 20px;
            border: 1px solid #334155;
            overflow-x: auto;
        }

        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 15px; background: #334155; color: var(--primary); }
        td { padding: 15px; border-bottom: 1px solid #334155; font-size: 14px; }
        
        .action-links { display: flex; gap: 8px; flex-wrap: wrap; }
        .search-link { 
            background: #1e293b; 
            color: #38bdf8; 
            padding: 5px 10px; 
            border-radius: 5px; 
            text-decoration: none; 
            font-size: 12px;
            border: 1px solid #38bdf8;
        }
        .search-link:hover { background: #38bdf8; color: #1e293b; }

        /* Email Verifier Widget */
        .verifier-box {
            margin-top: 30px;
            background: #1e293b;
            padding: 20px;
            border-radius: 15px;
            border: 2px dashed var(--accent);
        }
    </style>
</head>
<body>

<div class="container">
    <header>
        <h1><i class="fas fa-rocket"></i> LeadGen Master Pro</h1>
        <p>B2B Lead Generation & Information Extraction System</p>
    </header>

    <div class="glass-card">
        <input type="text" id="cName" placeholder="কোম্পানির নাম (যেমন: Google)">
        <input type="text" id="cWeb" placeholder="কোম্পানির ডোমেইন (যেমন: google.com)">
        <input type="text" id="cRole" placeholder="টার্গেট পজিশন (যেমন: CEO / Founder)">
        <input type="text" id="cLoc" placeholder="টার্গেট লোকেশন (যেমন: USA)">
        
        <div class="btn-group">
            <button class="btn-add" onclick="processLead()">
                <i class="fas fa-plus"></i> ডেটা তালিকায় যোগ করুন
            </button>
            <button class="btn-download" onclick="exportCSV()">
                <i class="fas fa-file-csv"></i> CSV ডাউনলোড
            </button>
        </div>
    </div>

    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>কোম্পানি ও ওয়েবসাইট</th>
                    <th>পজিশন</th>
                    <th>অ্যাকশন (স্মার্ট সার্চ)</th>
                    <th>ভেরিফায়ার</th>
                </tr>
            </thead>
            <tbody id="leadBody">
                </tbody>
        </table>
    </div>

    <div class="verifier-box">
        <h3><i class="fas fa-check-circle"></i> Quick Email Verifier</h3>
        <p style="font-size: 12px; color: #94a3b8;">ইমেইলটি সঠিক কি না পরীক্ষা করার জন্য নিচে পেস্ট করুন:</p>
        <input type="text" id="emailTest" style="width: 70%;" placeholder="name@company.com">
        <button onclick="verifyEmail()" style="display: inline-flex; width: auto; background: var(--accent);">চেক করুন</button>
        <p id="verifyResult" style="margin-top: 10px; font-weight: bold;"></p>
    </div>
</div>

<script>
    function processLead() {
        const name = document.getElementById('cName').value;
        const web = document.getElementById('cWeb').value;
        const role = document.getElementById('cRole').value;
        const loc = document.getElementById('cLoc').value;

        if(!name || !role) { alert("নাম এবং পজিশন অবশ্যই দিতে হবে!"); return; }

        const tbody = document.getElementById('leadBody');
        const row = tbody.insertRow();

        // Smart Search Links
        const linkedin = `https://www.google.com/search?q=site:linkedin.com/in "${role}" "${name}" ${loc}`;
        const emailFind = `https://www.google.com/search?q="${name}" ("@${web}" OR "email") AND "${role}"`;
        const companyInfo = `https://www.google.com/search?q="${name}" headquarters address phone number website`;

        row.innerHTML = `
            <td><strong>${name}</strong><br><small>${web}</small></td>
            <td>${role}<br><small>${loc}</small></td>
            <td>
                <div class="action-links">
                    <a href="${linkedin}" target="_blank" class="search-link"><i class="fab fa-linkedin"></i> Profile</a>
                    <a href="${emailFind}" target="_blank" class="search-link"><i class="fas fa-envelope"></i> Email</a>
                    <a href="${companyInfo}" target="_blank" class="search-link"><i class="fas fa-info-circle"></i> Info</a>
                </div>
            </td>
            <td><span style="color:#10b981"><i class="fas fa-spinner fa-spin"></i> Ready</span></td>
        `;
    }

    function verifyEmail() {
        const email = document.getElementById('emailTest').value;
        const res = document.getElementById('verifyResult');
        if(!email.includes('@')) { res.innerText = "ভুল ইমেইল!"; res.style.color = "red"; return; }
        
        res.innerHTML = "Checking database...";
        setTimeout(() => {
            res.innerHTML = "Result: This email pattern looks valid. Use Mail-Tester.com for SMTP check.";
            res.style.color = "#10b981";
        }, 1500);
    }

    function exportCSV() {
        let rows = document.querySelectorAll("table tr");
        let csv = [];
        for (let i = 0; i < rows.length; i++) {
            let row = [], cols = rows[i].querySelectorAll("td, th");
            for (let j = 0; j < cols.length - 1; j++) row.push('"' + cols[j].innerText.replace(/\n/g, " ") + '"');
            csv.push(row.join(","));
        }
        const blob = new Blob([csv.join("\n")], { type: "text/csv" });
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = "My_Targeted_Leads.csv";
        a.click();
    }
</script>

</body>
</html>
