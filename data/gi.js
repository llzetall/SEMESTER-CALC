/* =========================
   GI (LICENCE)
========================= */
export const GI = {
  id: "gi",
  name: "Génie Industriel (Licence)",
  semesters: {
    s1: { title: "GI — Semestre 1", modules: [] },
    s2: { title: "GI — Semestre 2", modules: [] },
    s3: {
      title: "L2 Génie Industriel – Semestre 3",
      modules: [
        { name: "Mathématiques 3", coef: 2, mode: "td_exam" },
        { name: "Gestion industrielle", coef: 3, mode: "td_exam" },
        { name: "Électronique fondamentale 1", coef: 2, mode: "td_exam" },
        { name: "Électrotechnique fondamentale 1", coef: 2, mode: "td_exam" },
        { name: "Probabilités et statistiques", coef: 2, mode: "td_exam" },
        { name: "Informatique 3", coef: 1, mode: "exam" },
        { name: "TP Électronique & Électrotechnique", coef: 1, mode: "tp" },
        { name: "Dessin technique", coef: 1, mode: "tp" },
        { name: "État de l’art du GI", coef: 1, mode: "exam" },
        { name: "Énergies et environnement", coef: 1, mode: "exam" },
        { name: "Anglais technique", coef: 1, mode: "exam" }
      ]
    },
    s4: { title: "GI — Semestre 4", modules: [] },
    s5: { title: "GI — Semestre 5", modules: [] },
    s6: { title: "GI — Semestre 6", modules: [] }
  }
};

/* =========================
   GI MASTERS (in same file)
========================= */
export const MASTER_CHAINES_LOGISTIQUES = {
  id: "mcl",
  name: "Master — Chaînes logistiques",
  semesters: {
    s1: { title: "Master Chaînes logistiques — Semestre 1", modules: [] },
    s2: { title: "Master Chaînes logistiques — Semestre 2", modules: [] },
    s3: { title: "Master Chaînes logistiques — Semestre 3", modules: [] }
  }
};

export const MASTER_ING_PRODUCTION = {
  id: "mip",
  name: "Master — Ingénierie de la production",
  semesters: {
    s1: { title: "Master Ingénierie de la production — Semestre 1", modules: [] },
    s2: { title: "Master Ingénierie de la production — Semestre 2", modules: [] },
    s3: { title: "Master Ingénierie de la production — Semestre 3", modules: [] }
  }
};

export const MASTER_ING_SYSTEMES = {
  id: "mis",
  name: "Master — Ingénierie des systèmes",
  semesters: {
    s1: { title: "Master Ingénierie des systèmes — Semestre 1", modules: [] },
    s2: { title: "Master Ingénierie des systèmes — Semestre 2", modules: [] },
    s3: { title: "Master Ingénierie des systèmes — Semestre 3", modules: [] }
  }
};

export const MASTER_MGMT_ING = {
  id: "mmi",
  name: "Master — Management de l’ingénierie",
  semesters: {
    s1: { title: "Master Management de l’ingénierie — Semestre 1", modules: [] },
    s2: { title: "Master Management de l’ingénierie — Semestre 2", modules: [] },
    s3: { title: "Master Management de l’ingénierie — Semestre 3", modules: [] }
  }
};

export const MASTER_SECURITE_SURETE = {
  id: "mssf",
  name: "Master — Sécurité et sureté de fonctionnement",
  semesters: {
    s1: { title: "Master Sécurité & sureté — Semestre 1", modules: [] },
    s2: { title: "Master Sécurité & sureté — Semestre 2", modules: [] },
    s3: { title: "Master Sécurité & sureté — Semestre 3", modules: [] }
  }
};
