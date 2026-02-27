/***********************
 * GLOBAL STATE
 ***********************/
let data = [];               // API content (Paragraphs, Stories)
let applicationIndex = {};   // Application keyword → HTML file

const categoryMap = {
  all: "all",
  paragraphs: "Paragraphs",
  applications: "Applications",
  stories: "Stories"
};

/***********************
 * DOM ELEMENTS
 ***********************/
const allBtn = document.getElementById("allBtn");
const paragraphBtn = document.getElementById("paragraphBtn");
const applicationBtn = document.getElementById("applicationBtn");
const storiesBtn = document.getElementById("storiesBtn");

const searchInput = document.getElementById("searchInput");
const cardsContainer = document.getElementById("cardsContainer");
const resultDiv = document.getElementById("result");
const sidebar = document.getElementById("sidebar");
const toggleSidebar = document.getElementById("toggleSidebar");
const spinner = document.getElementById("spinner");

const buttons = [allBtn, paragraphBtn, applicationBtn, storiesBtn];

/***********************
 * FETCH DATA
 ***********************/
async function fetchData() {
  spinner.style.display = "block";
  try {
    const res = await fetch("http://localhost:5000/api/content"); // change to live URL later
    data = await res.json();
    spinner.style.display = "none";
    updateCounts();
    filterData("all");
  } catch (err) {
    spinner.textContent = "Error loading data";
    console.error(err);
  }
}

// Fetch application index (static HTML apps)
async function fetchApplicationsIndex() {
  try {
    const res = await fetch("/applications-index");
    applicationIndex = await res.json();
  } catch (err) {
    console.error("Failed to load application index", err);
  }
}

/***********************
 * RENDER FUNCTIONS
 ***********************/
function renderCards(items) {
  resultDiv.innerHTML = ""; // clear application viewer

  if (!items.length) {
    cardsContainer.innerHTML = "<p>No matching content found.</p>";
    return;
  }

  cardsContainer.innerHTML = items.map(item => `
    <div class="card">
      <h3>${item.title}</h3>
      <p>${item.content}</p>
      <small>${item.date || ""}</small>
      <div class="actions">
        <button onclick="deleteCard('${item.title}')">Delete</button>
        <button onclick="editCard('${item.title}')">Edit</button>
      </div>
    </div>
  `).join("");
}

// Render application iframe
function renderApplication(filename) {
  cardsContainer.innerHTML = ""; // clear cards

  const iframe = document.createElement("iframe");
  iframe.src = `/application/${filename}`;
  iframe.style.width = "100%";
  iframe.style.height = "700px";
  iframe.style.border = "1px solid #ccc";

  resultDiv.innerHTML = "";
  resultDiv.appendChild(iframe);
}

/***********************
 * COUNTS
 ***********************/
function updateCounts() {
  document.getElementById("allCount").textContent = data.length;
  document.getElementById("paragraphCount").textContent =
    data.filter(i => i.category === "Paragraphs").length;
  document.getElementById("storiesCount").textContent =
    data.filter(i => i.category === "Stories").length;
  document.getElementById("applicationCount").textContent =
    Object.keys(applicationIndex).length;
}

/***********************
 * FILTER LOGIC
 ***********************/
function filterData(category = "all") {
  const term = searchInput.value.toLowerCase().trim();

  // APPLICATION MODE
  if (category === "applications") {
    cardsContainer.innerHTML = "";
    resultDiv.innerHTML = "";

    if (!term) {
      resultDiv.innerHTML = "<p>Type keywords to search applications.</p>";
      return;
    }

    for (let key in applicationIndex) {
      if (term.includes(key)) {
        renderApplication(applicationIndex[key]);
        return;
      }
    }

    resultDiv.innerHTML = "<p>No matching application found.</p>";
    return;
  }

  // CARD MODE (Paragraphs / Stories / All)
  let filtered = data;

  if (category !== "all") {
    filtered = filtered.filter(i => i.category === categoryMap[category]);
  }

  if (term) {
    filtered = filtered.filter(
      i =>
        i.title.toLowerCase().includes(term) ||
        i.content.toLowerCase().includes(term)
    );
  }

  renderCards(filtered);
}

/***********************
 * DEMO ACTIONS
 ***********************/
function deleteCard(title) {
  alert(`Delete clicked for: ${title}`);
}

function editCard(title) {
  const newText = prompt("Edit content:");
  if (newText) alert(`Edit clicked for ${title}`);
}

/***********************
 * EVENTS
 ***********************/
buttons.forEach(btn =>
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filterData(btn.dataset.category);
  })
);

searchInput.addEventListener("input", () => {
  const activeBtn = document.querySelector(".active");
  filterData(activeBtn ? activeBtn.dataset.category : "all");
});

toggleSidebar.addEventListener("click", () =>
  sidebar.classList.toggle("show")
);

/***********************
 * INIT
 ***********************/
fetchData();
fetchApplicationsIndex();