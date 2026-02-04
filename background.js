chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "run") {
    const rows = [];
    msg.companies.forEach((c, i) => {
      rows.push({
        Company: c,
        Title: msg.title,
        Employee: msg.title + " " + (i+1),
        LinkedIn: "https://linkedin.com/in/example"
      });
    });

    const csv = "Company,Title,Employee,LinkedIn\n" +
      rows.map(r => `${r.Company},${r.Title},${r.Employee},${r.LinkedIn}`).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
      url,
      filename: "leads.csv"
    });
  }
});