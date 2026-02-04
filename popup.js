document.getElementById("start").onclick = () => {
  const companies = document.getElementById("companies").value.split("\n");
  const title = document.getElementById("title").value;
  const count = document.getElementById("count").value;

  chrome.runtime.sendMessage({
    action: "run",
    companies,
    title,
    count
  });

  alert("Scraping started. CSV will download.");
};