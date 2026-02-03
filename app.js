import { DEFAULTS } from "./data/defaults.js";
import { GI } from "./data/gi.js";
import { SPECIALTIES } from "./data/specialties.js";

const { jsPDF } = window.jspdf;

/* =========================
   STATE
========================= */
let lang = "fr";
let currentPreset = "default";     // "default" | "gi" | specialty id
let currentSemesterKey = null;     // e.g. "s3"
let lastAvg = 0;

/* =========================
   STORAGE
========================= */
const STORAGE_KEY = "semester_calc_state_v1";

/* =========================
   I18N (UI)
========================= */
const T = {
  fr: {
    titleDefault: DEFAULTS.titleFR,
    avg: "Moyenne : ",
    matiere: "Matière",
    coef: "Coef",
    mode: "Mode",
    notes: "Notes & Coefficients",
    result: "Résultat",
    moduleName: "Nom du module",
    td: "TD /20",
    exam: "Exam /20",
    tp: "TP /20",
    specTitle: "Specialties",
    specSearch: "Search specialty...",
    specEmpty: "Specialty not added yet",
    back: "← Retour"
  },
  en: {
    titleDefault: DEFAULTS.titleEN,
    avg: "Average : ",
    matiere: "Module",
    coef: "Coef",
    mode: "Mode",
    notes: "Grades & Weights",
    result: "Result",
    moduleName: "Module name",
    td: "TD /20",
    exam: "Exam /20",
    tp: "TP /20",
    specTitle: "Specialties",
    specSearch: "Search specialty...",
    specEmpty: "Specialty not added yet",
    back: "← Back"
  },
  ar: {
    titleDefault: DEFAULTS.titleAR,
    avg: "المعدل : ",
    matiere: "المقياس",
    coef: "المعامل",
    mode: "النمط",
    notes: "النقاط و الأوزان",
    result: "النتيجة",
    moduleName: "اسم المقياس",
    td: "أعمال موجهة /20",
    exam: "امتحان /20",
    tp: "أشغال تطبيقية /20",
    specTitle: "التخصصات",
    specSearch: "ابحث عن تخصص...",
    specEmpty: "التخصص غير مضاف بعد",
    back: "← رجوع"
  }
};

/* =========================
   PDF (FR/EN only)
========================= */
const PDFT = {
  fr: {
    titleFallback: "Semestre",
    colModule: "Matière",
    colCoef: "Coef",
    colNote: "Note",
    colStatus: "Résultat",
    passed: "Validé",
    resit: "Rattrapage",
    avg: "Moyenne",
    semesterStatus: "Semestre",
    credit: "Made by Dahmani"
  },
  en: {
    titleFallback: "Semester",
    colModule: "Module",
    colCoef: "Coef",
    colNote: "Grade",
    colStatus: "Status",
    passed: "Passed",
    resit: "Resit",
    avg: "Average",
    semesterStatus: "Semester",
    credit: "Made by Dahmani"
  }
};

/* =========================
   DOM
========================= */
const modulesWrap = document.getElementById("modules");
const resultEl = document.getElementById("result");
const titleInput = document.getElementById("semesterTitle");

const btnDefault = document.getElementById("btn-default");
const btnGI = document.getElementById("btn-gi");
const giMenu = document.getElementById("gi-menu");

const btnSpecialties = document.getElementById("btn-specialties");
const btnAdd = document.getElementById("btn-add-custom");
const btnPdf = document.getElementById("btn-pdf");
const btnLang = document.getElementById("btn-lang");

const btnInsta = document.getElementById("btn-insta");
const btnWorks = document.getElementById("btn-works");

const hMatiere = document.getElementById("h-matiere");
const hCoef = document.getElementById("h-coef");
const hMode = document.getElementById("h-mode");
const hNotes = document.getElementById("h-notes");
const hResult = document.getElementById("h-result");

/* Modal */
const modal = document.getElementById("spec-modal");
const modalClose = document.getElementById("spec-close");
const specTitle = document.getElementById("spec-title");
const specSearch = document.getElementById("spec-search");
const specList = document.getElementById("spec-list");
const specEmpty = document.getElementById("spec-empty");

/* =========================
   Specialties modal view state
========================= */
let specView = { mode: "list", selected: null };

/* =========================
   INIT
========================= */
initGIMenu();
wireEvents();

// restore localStorage if exists
const restored = restoreState();
applyLanguageUI();

if (!restored) {
  // Default first (until user chooses)
  loadDefault();
} else {
  calculateLive();
}

/* =========================
   THROTTLED SAVE
========================= */
let saveTimer = null;
function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(saveState, 250);
}

/* =========================
   EVENTS
========================= */
function wireEvents() {
  btnDefault.onclick = () => { loadDefault(); scheduleSave(); };

  btnGI.onclick = () => giMenu.classList.toggle("hidden");

  document.addEventListener("click", (e) => {
    const inside = e.target.closest(".dropdown");
    if (!inside) giMenu.classList.add("hidden");
  });

  btnAdd.onclick = () => {
    addModuleRow({ name: "", coef: 1, mode: "td_exam" });
    calculateLive();
    scheduleSave();
  };

  btnPdf.onclick = exportPDF;

  btnLang.onclick = () => {
    lang = lang === "fr" ? "ar" : lang === "ar" ? "en" : "fr";
    document.body.dir = lang === "ar" ? "rtl" : "ltr";
    applyLanguageUI();
    if (currentPreset === "default") titleInput.value = T[lang].titleDefault;
    calculateLive();
    scheduleSave();
  };

  titleInput.addEventListener("input", scheduleSave);

  btnSpecialties.onclick = openSpecialties;
  modalClose.onclick = closeSpecialties;
  modal.onclick = (e) => { if (e.target === modal) closeSpecialties(); };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSpecialties();
  });

  specSearch.oninput = renderSpecialtiesList;

  btnInsta.onclick = () => window.open("https://www.instagram.com/wassiti_/", "_blank");
  btnWorks.onclick = () => window.open("https://wassiti.netlify.app/ai", "_blank");
}

/* =========================
   GI MENU (S1-S6)
========================= */
function initGIMenu() {
  giMenu.innerHTML = "";
  const keys = Object.keys(GI.semesters); // s1..s6
  keys.forEach(k => {
    const item = document.createElement("div");
    item.className = "dropdown-item";
    item.textContent = GI.semesters[k].title || `GI ${k.toUpperCase()}`;
    item.onclick = () => {
      loadPreset(GI, k);
      giMenu.classList.add("hidden");
      scheduleSave();
    };
    giMenu.appendChild(item);
  });
}

/* =========================
   SPECIALTIES MODAL
========================= */
function openSpecialties() {
  specSearch.value = "";
  specView = { mode: "list", selected: null };
  modal.classList.remove("hidden");
  renderSpecialtiesList();
}

function closeSpecialties() {
  modal.classList.add("hidden");
}

function renderSpecialtiesList() {
  const q = specSearch.value.trim().toLowerCase();
  specList.innerHTML = "";

  // Semesters screen
  if (specView.mode === "semesters" && specView.selected) {
    const back = document.createElement("div");
    back.className = "modal-item";
    back.textContent = T[lang].back;
    back.onclick = () => {
      specView = { mode: "list", selected: null };
      renderSpecialtiesList();
    };
    specList.appendChild(back);

    const semKeys = Object.keys(specView.selected.data.semesters || {});
    if (semKeys.length === 0) {
      specEmpty.classList.remove("hidden");
      return;
    }
    specEmpty.classList.add("hidden");

    semKeys.forEach(k => {
      const sem = specView.selected.data.semesters[k];
      const item = document.createElement("div");
      item.className = "modal-item";
      item.textContent = sem?.title || `${specView.selected.name} — ${k.toUpperCase()}`;
      item.onclick = () => {
        loadPreset(specView.selected.data, k);
        closeSpecialties();
        scheduleSave();
      };
      specList.appendChild(item);
    });

    return;
  }

  // Normal specialties list
  const list = SPECIALTIES.filter(s => s.name.toLowerCase().includes(q));

  if (list.length === 0) {
    specEmpty.classList.remove("hidden");
    return;
  }
  specEmpty.classList.add("hidden");

  list.forEach(sp => {
    const item = document.createElement("div");
    item.className = "modal-item";
    item.textContent = sp.name;
    item.onclick = () => {
      specView = { mode: "semesters", selected: sp };
      renderSpecialtiesList();
    };
    specList.appendChild(item);
  });
}

/* =========================
   LANGUAGE UI APPLY
========================= */
function applyLanguageUI() {
  btnLang.textContent = `🌍 ${lang.toUpperCase()}`;

  hMatiere.textContent = T[lang].matiere;
  hCoef.textContent = T[lang].coef;
  hMode.textContent = T[lang].mode;
  hNotes.textContent = T[lang].notes;
  hResult.textContent = T[lang].result;

  specTitle.textContent = T[lang].specTitle;
  specSearch.placeholder = T[lang].specSearch;
  specEmpty.textContent = T[lang].specEmpty;

  document.querySelectorAll(".module-row").forEach(updateRowPlaceholders);
}

/* =========================
   LOADERS
========================= */
function loadDefault() {
  currentPreset = "default";
  currentSemesterKey = null;
  modulesWrap.innerHTML = "";
  titleInput.value = T[lang].titleDefault;

  DEFAULTS.rows.forEach(r => addModuleRow(r));
  setActivePreset("default");

  calculateLive();
}

function loadPreset(specialtyObj, semesterKey) {
  currentPreset = specialtyObj.id || "preset";
  currentSemesterKey = semesterKey || null;

  modulesWrap.innerHTML = "";

  const sem = specialtyObj.semesters?.[semesterKey];
  const title = sem?.title || T[lang].titleDefault;
  titleInput.value = title;

  const modules = sem?.modules || [];
  if (modules.length === 0) DEFAULTS.rows.forEach(r => addModuleRow(r));
  else modules.forEach(m => addModuleRow(m));

  setActivePreset(specialtyObj.id === "gi" ? "gi" : "default");
  calculateLive();
}

function setActivePreset(type) {
  document.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("active"));
  if (type === "gi") btnGI.classList.add("active");
  if (type === "default") btnDefault.classList.add("active");
}

/* =========================
   ROW
========================= */
function addModuleRow(m) {
  const row = document.createElement("div");
  row.className = "module module-row";
  row.dataset.mode = m.mode || "td_exam";

  row.innerHTML = `
    <input class="mod-name" value="${escapeHtml(m.name || "")}" placeholder="">
    <input class="coef" type="number" min="1" value="${m.coef ?? 1}">
    <select class="mode-select">
      <option value="td_exam">TD + Exam</option>
      <option value="exam">Exam</option>
      <option value="tp">TP</option>
    </select>

    <div class="inputs"></div>

    <div class="mod-result fail">0.00</div>
    <button class="remove-btn" title="Remove">✕</button>
  `;

  modulesWrap.appendChild(row);

  const modeSelect = row.querySelector(".mode-select");
  modeSelect.value = row.dataset.mode;

  modeSelect.onchange = () => {
    row.dataset.mode = modeSelect.value;
    renderInputs(row);
    calculateLive();
    scheduleSave();
  };

  row.querySelector(".remove-btn").onclick = () => {
    row.remove();
    calculateLive();
    scheduleSave();
  };

  row.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("input", () => { calculateLive(); scheduleSave(); });
    el.addEventListener("change", () => { calculateLive(); scheduleSave(); });
  });

  renderInputs(row);
  updateRowPlaceholders(row);
}

function renderInputs(row) {
  const mode = row.dataset.mode;
  const inputs = row.querySelector(".inputs");

  // max=100 but not shown (placeholder stays /20)
  if (mode === "td_exam") {
    inputs.innerHTML = `
      <div class="line">
        <input class="td" type="number" min="0" max="100" inputmode="decimal" placeholder="">
        <span class="mul">×</span>
        <input class="tdW weight" type="number" step="0.01" value="0.4" placeholder="0.4">
      </div>
      <div class="line">
        <input class="exam" type="number" min="0" max="100" inputmode="decimal" placeholder="">
        <span class="mul">×</span>
        <input class="examW weight" type="number" step="0.01" value="0.6" placeholder="0.6">
      </div>
    `;
  } else if (mode === "tp") {
    inputs.innerHTML = `
      <div class="line">
        <input class="tp" type="number" min="0" max="100" inputmode="decimal" placeholder="">
        <span class="mul">×</span>
        <input class="tpW weight" type="number" step="0.01" value="1" placeholder="1">
      </div>
    `;
  } else {
    inputs.innerHTML = `
      <div class="line">
        <input class="exam" type="number" min="0" max="100" inputmode="decimal" placeholder="">
        <span class="mul">×</span>
        <input class="examW weight" type="number" step="0.01" value="1" placeholder="1">
      </div>
    `;
  }

  inputs.querySelectorAll("input").forEach(el => {
    el.addEventListener("input", () => { calculateLive(); scheduleSave(); });
    el.addEventListener("change", () => { calculateLive(); scheduleSave(); });
  });

  updateRowPlaceholders(row);
}

function updateRowPlaceholders(row) {
  row.querySelector(".mod-name").placeholder = T[lang].moduleName;

  const td = row.querySelector(".td");
  if (td) td.placeholder = T[lang].td;

  const exam = row.querySelector(".exam");
  if (exam) exam.placeholder = T[lang].exam;

  const tp = row.querySelector(".tp");
  if (tp) tp.placeholder = T[lang].tp;
}

/* =========================
   CALC
========================= */
function calculateLive() {
  let total = 0;
  let coefSum = 0;

  document.querySelectorAll(".module-row").forEach(row => {
    const coef = +row.querySelector(".coef").value || 0;
    const mode = row.dataset.mode;

    let note = 0;

    if (mode === "td_exam") {
      const td = +row.querySelector(".td")?.value || 0;
      const ex = +row.querySelector(".exam")?.value || 0;
      const tdW = +row.querySelector(".tdW")?.value || 0;
      const exW = +row.querySelector(".examW")?.value || 0;
      note = td * tdW + ex * exW;
    } else if (mode === "tp") {
      const tp = +row.querySelector(".tp")?.value || 0;
      const tpW = +row.querySelector(".tpW")?.value || 1;
      note = tp * tpW;
    } else {
      const ex = +row.querySelector(".exam")?.value || 0;
      const exW = +row.querySelector(".examW")?.value || 1;
      note = ex * exW;
    }

    const res = row.querySelector(".mod-result");
    res.textContent = note.toFixed(2);
    res.classList.toggle("pass", note >= 10);
    res.classList.toggle("fail", note < 10);

    total += note * coef;
    coefSum += coef;
  });

  lastAvg = coefSum ? (total / coefSum) : 0;
  resultEl.textContent = T[lang].avg + lastAvg.toFixed(2);
}

/* =========================
   SAVE / RESTORE
========================= */
function saveState() {
  const rows = [...document.querySelectorAll(".module-row")].map(row => {
    const mode = row.dataset.mode;
    return {
      name: row.querySelector(".mod-name").value || "",
      coef: +row.querySelector(".coef").value || 1,
      mode,
      td: +row.querySelector(".td")?.value || 0,
      exam: +row.querySelector(".exam")?.value || 0,
      tp: +row.querySelector(".tp")?.value || 0,
      tdW: +row.querySelector(".tdW")?.value || 0,
      examW: +row.querySelector(".examW")?.value || 0,
      tpW: +row.querySelector(".tpW")?.value || 1
    };
  });

  const state = {
    v: 1,
    lang,
    currentPreset,
    currentSemesterKey,
    title: titleInput.value || "",
    rows
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_) {}
}

function restoreState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const state = JSON.parse(raw);
    if (!state || state.v !== 1) return false;

    if (state.lang === "fr" || state.lang === "ar" || state.lang === "en") {
      lang = state.lang;
      document.body.dir = lang === "ar" ? "rtl" : "ltr";
    }

    if (typeof state.title === "string") titleInput.value = state.title;

    modulesWrap.innerHTML = "";
    (state.rows || []).forEach(r => {
      addModuleRow({
        name: r.name || "",
        coef: r.coef ?? 1,
        mode: r.mode || "td_exam"
      });

      const lastRow = modulesWrap.lastElementChild;

      if (r.mode === "td_exam") {
        lastRow.querySelector(".td").value = r.td ?? 0;
        lastRow.querySelector(".exam").value = r.exam ?? 0;
        lastRow.querySelector(".tdW").value = r.tdW ?? 0.4;
        lastRow.querySelector(".examW").value = r.examW ?? 0.6;
      } else if (r.mode === "tp") {
        lastRow.querySelector(".tp").value = r.tp ?? 0;
        lastRow.querySelector(".tpW").value = r.tpW ?? 1;
      } else {
        lastRow.querySelector(".exam").value = r.exam ?? 0;
        lastRow.querySelector(".examW").value = r.examW ?? 1;
      }
    });

    currentPreset = state.currentPreset || "default";
    currentSemesterKey = state.currentSemesterKey || null;
    setActivePreset(currentPreset === "gi" ? "gi" : "default");

    return true;
  } catch (_) {
    return false;
  }
}

/* =========================
   PDF EXPORT
========================= */
function exportPDF() {
  const pdfLang = lang === "en" ? "en" : "fr";
  const L = PDFT[pdfLang];

  const doc = new jsPDF("p", "mm", "a4");
  let title = (titleInput.value || L.titleFallback).replace(/[\u0600-\u06FF]/g, "");
  if (!title.trim()) title = L.titleFallback;

  let y = 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 105, y, { align: "center" });

  y += 8;
  doc.setDrawColor(120, 90, 170);
  doc.setLineWidth(0.6);
  doc.line(18, y, 192, y);
  y += 10;

  doc.setFontSize(11);
  doc.setTextColor(90, 90, 90);
  doc.text(L.colModule, 18, y);
  doc.text(L.colCoef, 122, y, { align: "center" });
  doc.text(L.colNote, 150, y, { align: "center" });
  doc.text(L.colStatus, 182, y, { align: "center" });

  y += 5;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(18, y, 192, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  document.querySelectorAll(".module-row").forEach(row => {
    if (y > 270) { doc.addPage(); y = 18; }

    const modName = row.querySelector(".mod-name").value || "—";
    const coef = row.querySelector(".coef").value || "1";
    const noteStr = row.querySelector(".mod-result").textContent || "0.00";
    const note = parseFloat(noteStr) || 0;

    const passed = note >= 10;
    const status = passed ? L.passed : L.resit;

    doc.setTextColor(40, 40, 40);
    doc.text(modName, 18, y);

    doc.setTextColor(60, 60, 60);
    doc.text(String(coef), 122, y, { align: "center" });
    doc.text(note.toFixed(2), 150, y, { align: "center" });

    if (passed) doc.setTextColor(0, 170, 120);
    else doc.setTextColor(230, 70, 70);
    doc.text(status, 182, y, { align: "center" });

    y += 7;
  });

  y += 4;
  doc.setDrawColor(120, 90, 170);
  doc.setLineWidth(0.6);
  doc.line(18, y, 192, y);
  y += 10;

  const semPassed = lastAvg >= 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);

  if (semPassed) doc.setTextColor(0, 170, 120);
  else doc.setTextColor(230, 70, 70);

  doc.text(`${L.avg}: ${lastAvg.toFixed(2)}`, 105, y, { align: "center" });
  y += 8;

  doc.setFontSize(12);
  doc.text(`${L.semesterStatus}: ${semPassed ? L.passed : L.resit}`, 105, y, { align: "center" });

  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(140, 140, 140);
  doc.text(L.credit, 105, y, { align: "center" });

  doc.save("semester.pdf");
}

/* =========================
   HELPERS
========================= */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
