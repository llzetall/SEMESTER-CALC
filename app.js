const { jsPDF } = window.jspdf;

/* =========================
   STATE
========================= */
let currentLang = "fr";
let currentPreset = "default";

/* =========================
   DOM
========================= */
const container = document.getElementById("modules");
const resultEl = document.getElementById("result");
const titleInput = document.getElementById("semesterTitle");

/* =========================
   PRESETS
========================= */
const GI_MODULES = [
  { name: "Mathématiques 3", coef: 2, type: "td_exam" },
  { name: "Gestion industrielle", coef: 3, type: "td_exam" },
  { name: "Électronique fondamentale 1", coef: 2, type: "td_exam" },
  { name: "Électrotechnique fondamentale 1", coef: 2, type: "td_exam" },
  { name: "Probabilités et statistiques", coef: 2, type: "td_exam" },
  { name: "Informatique 3", coef: 1, type: "exam" },
  { name: "TP Électronique & Électrotechnique", coef: 1, type: "tp" },
  { name: "Dessin technique", coef: 1, type: "tp" },
  { name: "État de l’art du GI", coef: 1, type: "exam" },
  { name: "Énergies et environnement", coef: 1, type: "exam" },
  { name: "Anglais technique", coef: 1, type: "exam" }
];

/* =========================
   INIT
========================= */
window.onload = () => loadDefault();

/* =========================
   BUTTONS
========================= */
document.getElementById("btn-default").onclick = loadDefault;
document.getElementById("btn-gi").onclick = loadGI;

document.getElementById("btn-add-custom").onclick = () =>
  addModule({ name: "", coef: 1, type: "td_exam" });

document.getElementById("btn-calc").onclick = calculate;
document.getElementById("btn-pdf").onclick = exportPDF;
document.getElementById("btn-lang").onclick = toggleLanguage;

document.getElementById("btn-insta").onclick = () =>
  window.open("https://www.instagram.com/wassiti_/", "_blank");

document.getElementById("btn-works").onclick = () =>
  window.open("https://wassiti.netlify.app/ai", "_blank");

/* =========================
   PRESET LOADERS
========================= */
function loadDefault() {
  currentPreset = "default";
  container.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    addModule({ name: "", coef: 1, type: "td_exam" });
  }

  titleInput.value = currentLang === "ar" ? "السداسي" : "Semester";
  setActivePreset("default");
  calculate();
}

function loadGI() {
  currentPreset = "gi";
  container.innerHTML = "";

  GI_MODULES.forEach(m => addModule(m));

  titleInput.value = "L2 Génie Industriel – Semestre 3";
  setActivePreset("gi");
  calculate();
}

/* =========================
   ACTIVE PRESET UI
========================= */
function setActivePreset(type) {
  document.querySelectorAll(".preset-btn").forEach(b =>
    b.classList.remove("active")
  );

  document
    .getElementById(type === "gi" ? "btn-gi" : "btn-default")
    .classList.add("active");
}

/* =========================
   MODULE CREATION
========================= */
function addModule(m) {
  const div = document.createElement("div");
  div.className = "module";
  div.dataset.type = m.type;

  div.innerHTML = `
    <input class="mod-name" value="${m.name || ""}" placeholder="">
    <input class="coef" type="number" min="1" value="${m.coef || 1}">
    <select class="mode-select">
      <option value="td_exam">TD + Exam</option>
      <option value="exam">Exam</option>
      <option value="tp">TP</option>
    </select>
    <div class="inputs"></div>
    <div class="mod-result">0.00</div>
    <button class="remove">✖</button>
  `;

  container.appendChild(div);

  const select = div.querySelector(".mode-select");
  select.value = m.type;
  select.onchange = () => {
    div.dataset.type = select.value;
    renderInputs(div);
    calculate();
  };

  div.querySelector(".remove").onclick = () => {
    div.remove();
    calculate();
  };

  updatePlaceholders(div);
  renderInputs(div);
}

/* =========================
   INPUTS
========================= */
function renderInputs(div) {
  const type = div.dataset.type;
  const inputs = div.querySelector(".inputs");

  if (type === "td_exam") {
    inputs.innerHTML = `
      <input class="td" type="number" min="0" max="20" placeholder="TD /20">
      <input class="exam" type="number" min="0" max="20" placeholder="Exam /20">
    `;
  } else if (type === "tp") {
    inputs.innerHTML = `<input class="tp" type="number" min="0" max="20" placeholder="TP /20">`;
  } else {
    inputs.innerHTML = `<input class="exam" type="number" min="0" max="20" placeholder="Exam /20">`;
  }

  inputs.querySelectorAll("input").forEach(i => (i.oninput = calculate));
}

/* =========================
   CALCULATION (DZ)
========================= */
function calculate() {
  let total = 0;
  let coefSum = 0;

  document.querySelectorAll(".module").forEach(div => {
    const coef = +div.querySelector(".coef").value || 0;
    const type = div.dataset.type;
    let note = 0;

    if (type === "td_exam") {
      note =
        0.4 * (+div.querySelector(".td")?.value || 0) +
        0.6 * (+div.querySelector(".exam")?.value || 0);
    } else if (type === "tp") {
      note = +div.querySelector(".tp")?.value || 0;
    } else {
      note = +div.querySelector(".exam")?.value || 0;
    }

    div.querySelector(".mod-result").textContent = note.toFixed(2);
    total += note * coef;
    coefSum += coef;
  });

  const moyenne = coefSum ? (total / coefSum).toFixed(2) : "0.00";
  resultEl.textContent =
    (currentLang === "ar" ? "المعدل : " : "Moyenne : ") + moyenne;
}

/* =========================
   LANGUAGE (UI ONLY)
========================= */
function toggleLanguage() {
  currentLang = currentLang === "fr" ? "ar" : "fr";
  document.body.dir = currentLang === "ar" ? "rtl" : "ltr";

  if (currentPreset === "default") {
    titleInput.value = currentLang === "ar" ? "السداسي" : "Semester";
  }

  calculate();
  document.querySelectorAll(".module").forEach(updatePlaceholders);
}

function updatePlaceholders(div) {
  div.querySelector(".mod-name").placeholder =
    currentLang === "ar" ? "اسم المقياس" : "Module name";
}

/* =========================
   PDF EXPORT (FRENCH SAFE)
========================= */
function exportPDF() {
  const doc = new jsPDF("p", "mm", "a4");

  /* 🔒 PDF TITLE = USER INPUT (FRENCH ONLY) */
  let title = titleInput.value || "Semester";
  title = title.replace(/[\u0600-\u06FF]/g, ""); // remove Arabic safely

  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(title, 105, y, { align: "center" });

  y += 10;
  doc.line(20, y, 190, y);
  y += 12;

  doc.setFontSize(11);
  doc.text("Matière", 20, y);
  doc.text("Coef", 120, y, { align: "center" });
  doc.text("Note", 145, y, { align: "center" });
  doc.text("Résultat", 175, y, { align: "center" });

  y += 6;
  doc.line(20, y, 190, y);
  y += 8;

  document.querySelectorAll(".module").forEach(m => {
    if (y > 265) {
      doc.addPage();
      y = 20;
    }

    doc.text(m.querySelector(".mod-name").value || "—", 20, y);
    doc.text(m.querySelector(".coef").value, 120, y, { align: "center" });
    doc.text(m.querySelector(".mod-result").textContent, 145, y, { align: "center" });
    doc.text(
      parseFloat(m.querySelector(".mod-result").textContent) >= 10
        ? "Validé"
        : "Rattrapage",
      175,
      y,
      { align: "center" }
    );

    y += 7;
  });

  y += 10;
  doc.line(20, y, 190, y);
  y += 14;

  const moyenneValue = resultEl.textContent.split(":")[1] || "0.00";
  doc.setFontSize(15);
  doc.text("Moyenne : " + moyenneValue.trim(), 105, y, { align: "center" });

  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("Made by Dahmani", 105, y, { align: "center" });

  doc.save("moyenne-semestre.pdf");
}
