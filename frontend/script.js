const searchInput = document.getElementById("searchInput");
const resultDiv = document.getElementById("result");

let indexData = {};

fetch("/applications-index")
  .then(res => res.json())
  .then(data => {
    indexData = data;
  });

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();
  resultDiv.innerHTML = "";

  if (!query) return;

  for (const key in indexData) {
    if (query.includes(key) || key.includes(query)) {
      const iframe = document.createElement("iframe");
      iframe.src = `/applications/${indexData[key]}`;
      iframe.style.width = "100%";
      iframe.style.height = "650px";
      iframe.style.border = "1px solid #ccc";

      resultDiv.appendChild(iframe);
      return;
    }
  }

  resultDiv.innerHTML = "<p>No matching application found.</p>";
});