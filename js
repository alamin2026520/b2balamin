const form = document.getElementById('leadForm');
const statusDiv = document.getElementById('status');
const outputTable = document.getElementById('outputTable').querySelector('tbody');
const downloadBtn = document.getElementById('downloadCSV');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const companyName = document.getElementById('companyName').value;
    const targetPosition = document.getElementById('targetPosition').value;

    statusDiv.innerText = "Processing...";

    const res = await fetch('http://localhost:5000/fetch_lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, targetPosition })
    });

    const data = await res.json();
    statusDiv.innerText = "Done";

    // Clear table
    outputTable.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.companyName}</td>
            <td>${row.companyWebsite}</td>
            <td>${row.companyEmail}</td>
            <td>${row.companyAddress}</td>
            <td>${row.personName}</td>
            <td>${row.position}</td>
            <td>${row.linkedinURL}</td>
        `;
        outputTable.appendChild(tr);
    });
});

// CSV Download
downloadBtn.addEventListener('click', () => {
    let csv = 'Company Name,Company Website,Company Email,Company Address,Person Name,Position,LinkedIn URL\n';
    outputTable.querySelectorAll('tr').forEach(tr => {
        const row = Array.from(tr.querySelectorAll('td')).map(td => td.innerText);
        csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
});
