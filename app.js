const { jsPDF } = window.jspdf;

/* =========================
   OFFICIAL MODULES
   ========================= */
const MODULES = [
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

const container = document.getElementById("modules");

/* =========================
   INIT
   ========================= */
window.onload = () => MODULES.forEach(m => addModule(m, true));

document.getElementById("btn-add-custom").onclick = () =>
  addModule({ name: "", coef: 1, type: "td_exam" }, false);

document.getElementById("btn-calc").onclick = calculate;
document.getElementById("btn-pdf").onclick = exportPDF;
document.getElementById("btn-insta").onclick = () =>
  window.open("https://www.instagram.com/wassiti_/", "_blank");

/* =========================
   ADD MODULE
   ========================= */
function addModule(m, official) {
  const div = document.createElement("div");
  div.className = "module";
  div.dataset.type = m.type;

  div.innerHTML = `
    <input class="mod-name" value="${m.name}" placeholder="Nom du module">
    <input class="coef" type="number" min="1" value="${m.coef}">

    <select class="mode-select">
      <option value="td_exam">TD + Exam</option>
      <option value="exam">Exam</option>
      <option value="tp">TP</option>
    </select>

    <div class="inputs"></div>
    <div class="mod-result">—</div>
    <button class="remove">✖</button>
  `;

  container.appendChild(div);

  /* mode selector */
  const select = div.querySelector(".mode-select");
  select.value = m.type;
  select.onchange = () => {
    div.dataset.type = select.value;
    renderInputs(div);
  };

  /* delete button */
  if (official) {
    div.querySelector(".remove").style.opacity = "0";
  } else {
    div.querySelector(".remove").onclick = () => div.remove();
  }

  renderInputs(div);
}

/* =========================
   INPUTS BY MODE
   ========================= */
function renderInputs(div) {
  const type = div.dataset.type;
  const inputs = div.querySelector(".inputs");

  if (type === "td_exam") {
    inputs.innerHTML = `
      <input class="td" type="number" placeholder="TD /20">
      <input class="exam" type="number" placeholder="Exam /20">
    `;
  } else if (type === "tp") {
    inputs.innerHTML = `
      <input class="tp" type="number" placeholder="TP /20">
    `;
  } else {
    inputs.innerHTML = `
      <input class="exam" type="number" placeholder="Exam /20">
    `;
  }
}

/* =========================
   CALCUL MOYENNE
   ========================= */
function calculate() {
  let total = 0;
  let coefSum = 0;

  document.querySelectorAll(".module").forEach(div => {
    const coef = +div.querySelector(".coef").value;
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

    div.querySelector(".mod-result").textContent =
      note ? note.toFixed(2) : "—";

    total += note * coef;
    coefSum += coef;
  });

  const moyenne = coefSum ? (total / coefSum).toFixed(2) : "—";
  document.getElementById("result").textContent =
    (currentLang === "ar" ? "المعدل : " : "Moyenne : ") + moyenne;
}

/* =========================
   PDF EXPORT
   ========================= */
function exportPDF() {
  const doc = new jsPDF("p", "mm", "a4");
  const title = document.getElementById("semesterTitle").value;
  const moyenneText = document.getElementById("result").textContent;

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

  doc.setFont("helvetica", "normal");

  document.querySelectorAll(".module").forEach(m => {
    if (y > 265) {
      doc.addPage();
      y = 20;
    }

    const name = m.querySelector(".mod-name").value;
    const coef = m.querySelector(".coef").value;
    const note = m.querySelector(".mod-result").textContent;

    doc.text(name, 20, y);
    doc.text(coef.toString(), 120, y, { align: "center" });
    doc.text(note, 145, y, { align: "center" });
    doc.text(
      note !== "—" && parseFloat(note) >= 10 ? "Validé" : "Rattrapage",
      175,
      y,
      { align: "center" }
    );

    y += 7;
  });

  y += 12;
  doc.line(20, y, 190, y);

  y += 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(moyenneText, 105, y, { align: "center" });

  y += 8;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(150);
  doc.text("Made by Dahmani", 105, y, { align: "center" });

  doc.save("moyenne-semestre.pdf");
}

/* =========================
   LANGUAGE TOGGLE
   ========================= */
let currentLang = "fr";

const translations = {
  fr: {
    headers: ["Matière", "Coef", "Mode", "Notes", "Résultat"],
    moyenne: "Moyenne : "
  },
  ar: {
    headers: ["المادة", "المعامل", "النمط", "العلامات", "النتيجة"],
    moyenne: "المعدل : "
  }
};

document.getElementById("btn-lang").onclick = toggleLanguage;

function toggleLanguage() {
  currentLang = currentLang === "fr" ? "ar" : "fr";

  document.getElementById("btn-lang").textContent =
    currentLang === "fr" ? "🇩🇿 AR" : "🇫🇷 FR";

  document.querySelectorAll(".modules-header span").forEach((el, i) => {
    el.textContent = translations[currentLang].headers[i];
  });

  document.body.dir = currentLang === "ar" ? "rtl" : "ltr";

  calculate();
}




document.getElementById("btn-works").onclick = () => {
  window.open("https://wassiti.netlify.app/ai", "_blank");
};
