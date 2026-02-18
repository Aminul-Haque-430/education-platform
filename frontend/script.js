let data = [];
const categoryMap = { all: "all", paragraphs: "Paragraphs", applications: "Applications", stories: "Stories" };

// DOM
const allBtn = document.getElementById("allBtn");
const paragraphBtn = document.getElementById("paragraphBtn");
const applicationBtn = document.getElementById("applicationBtn");
const storiesBtn = document.getElementById("storiesBtn");
const searchInput = document.getElementById("searchInput");
const cardsContainer = document.getElementById("cardsContainer");
const sidebar = document.getElementById("sidebar");
const toggleSidebar = document.getElementById("toggleSidebar");
const spinner = document.getElementById("spinner");

const buttons = [allBtn, paragraphBtn, applicationBtn, storiesBtn];

// Fetch data
async function fetchData() {
  spinner.style.display = "block";
  try {
    const res = await fetch("http://localhost:5000/api/content"); // Replace with live backend URL when deployed
    data = await res.json();
    spinner.style.display = "none";
    updateCounts();
    filterData("all");
  } catch (err) {
    spinner.textContent = "Error loading data";
    console.error(err);
  }
}

// Render
function renderContent(items) {
  if (!items.length) {
    cardsContainer.innerHTML = "<p>No matching content found.</p>";
    return;
  }
  cardsContainer.innerHTML = items.map(item => `
    <div class="card">
      <h3>${item.title}</h3>
      <p>${item.content}</p>
      <small>${item.date}</small>
      <button onclick="deleteCard('${item.title}')">Delete</button>
      <button onclick="editCard('${item.title}')">Edit</button>
    </div>
  `).join("");
}

// Update sidebar counts
function updateCounts() {
  document.getElementById("allCount").textContent = data.length;
  document.getElementById("paragraphCount").textContent = data.filter(i => i.category==="Paragraphs").length;
  document.getElementById("applicationCount").textContent = data.filter(i => i.category==="Applications").length;
  document.getElementById("storiesCount").textContent = data.filter(i => i.category==="Stories").length;
}

// Filter
function filterData(category="all") {
  let filtered = data;
  if(category !== "all") filtered = filtered.filter(i => i.category===categoryMap[category]);
  const term = searchInput.value.toLowerCase();
  if(term) filtered = filtered.filter(i => i.title.toLowerCase().includes(term) || i.content.toLowerCase().includes(term));
  renderContent(filtered);
}

// Delete/Edit demo
function deleteCard(title) {
  alert(`Delete clicked for ${title}`);
}
function editCard(title) {
  const newText = prompt("Edit content:");
  if(newText) alert(`Edit clicked for ${title} → ${newText}`);
}

// Event listeners
buttons.forEach(btn => btn.addEventListener("click", () => {
  buttons.forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  filterData(btn.dataset.category);
}));
searchInput.addEventListener("input", ()=>filterData("all"));
toggleSidebar.addEventListener("click", ()=>sidebar.classList.toggle("show"));

// Init
fetchData();
