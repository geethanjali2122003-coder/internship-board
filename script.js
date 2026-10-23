const cardsEl = document.getElementById("cards");
const searchEl = document.getElementById("search");
const domainEl = document.getElementById("domain");
const statusEl = document.getElementById("status");

let internships = [];

async function loadData() {
  try {
    const res = await fetch("internships.json");
    if (!res.ok) throw new Error("Load failed");
    const data = await res.json();
    internships = data.internships;
    fillDomains();
    render();
  } catch (error) {
    cardsEl.innerHTML = "";
    statusEl.textContent = "Could not load internships. Please try again later.";
  }
}

function fillDomains() {
  const domains = [...new Set(internships.map(item => item.domain))];
  domains.forEach(domain => {
    const option = document.createElement("option");
    option.value = domain;
    option.textContent = domain;
    domainEl.appendChild(option);
  });
}

function createCard(item) {
  const skills = item.skills.map(s => `<li>${s}</li>`).join("");
  return `
    <article class="card">
      <h2>${item.title}</h2>
      <p class="domain">${item.domain}</p>
      <p>${item.mode} · ${item.location}</p>
      <ul class="skills" aria-label="Skills">${skills}</ul>
      <p class="openings">${item.openings} opening${item.openings > 1 ? "s" : ""}</p>
      <button type="button" aria-label="Apply for ${item.title}">Apply</button>
    </article>
  `;
}

function render() {
  const query = searchEl.value.trim().toLowerCase();
  const domain = domainEl.value;

  const filtered = internships.filter(item => {
    const matchesDomain = domain === "all" || item.domain === domain;
    const text = (item.title + " " + item.skills.join(" ")).toLowerCase();
    return matchesDomain && text.includes(query);
  });

  if (filtered.length === 0) {
    cardsEl.innerHTML = "";
    statusEl.textContent = "No internships match your search. Try a different keyword or domain.";
    return;
  }

  statusEl.textContent = `${filtered.length} internship${filtered.length > 1 ? "s" : ""} found`;
  cardsEl.innerHTML = filtered.map(createCard).join("");
}

searchEl.addEventListener("input", render);
domainEl.addEventListener("change", render);

loadData();