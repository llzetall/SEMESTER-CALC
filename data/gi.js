export const GI = {
  id: "gi",
  name: "Génie Industriel (Licence)",
  semesters: {
    s1: { title: "L1 Génie Industriel — Semestre 1", modules: [] },
    s2: { title: "L1 Génie Industriel — Semestre 2", modules: [] },

    s3: {
      title: "L2 Génie Industriel — Semestre 3",
      modules: [
        { name: "Mathématiques 3", coef: 2, mode: "td_exam" },
        { name: "Gestion industrielle", coef: 3, mode: "td_exam" },
        { name: "Électronique fondamentale 1", coef: 2, mode: "td_exam" },
        { name: "Électrotechnique fondamentale 1", coef: 2, mode: "td_exam" },
        { name: "Probabilités et statistiques", coef: 2, mode: "td_exam" },
        { name: "Informatique 3", coef: 1, mode: "exam" },
        { name: "TP Électronique et électrotechnique", coef: 1, mode: "tp" },
        { name: "Dessin technique", coef: 1, mode: "tp" },
        { name: "État de l’art du GI", coef: 1, mode: "exam" },
        { name: "Énergies et environnement", coef: 1, mode: "exam" },
        { name: "Anglais technique", coef: 1, mode: "exam" }
      ]
    },

    s4: {
  title: "L2 Génie Industriel — Semestre 4",
  modules: [
    // UE Fondamentale
    { name: "Mécanique", coef: 3, mode: "td_exam" }, // 40% CC / 60% Exam
    { name: "Logique combinatoire et séquentielle", coef: 2, mode: "td_exam" }, // CC shown + Exam column (kept td_exam)

    // UE Fondamentale
    { name: "Méthodes numériques", coef: 2, mode: "td_exam" }, // 40/60
    { name: "Recherche opérationnelle", coef: 2, mode: "td_exam" }, // 40/60

    // UE Méthodologique
    { name: "Management de projet", coef: 2, mode: "td_exam" }, // 40/60
    { name: "TP Logique combinatoire et séquentielle", coef: 1, mode: "tp" }, // 100% CC
    { name: "TP Recherche opérationnelle", coef: 1, mode: "tp" }, // 100% CC
    { name: "TP Méthodes numériques", coef: 1, mode: "tp" }, // 100% CC

    // UE Découverte
    { name: "Économie de l’entreprise", coef: 1, mode: "exam" }, // 100% Exam
    { name: "Droit de l’entreprise", coef: 1, mode: "exam" }, // 100% Exam

    // UE Transversale
    { name: "Techniques d’expression, d’information et de communication", coef: 1, mode: "exam" } // 100% Exam
  ]
},

    s5: { title: "L3 Génie Industriel — Semestre 5", modules: [] },
    s6: { title: "L3 Génie Industriel — Semestre 6", modules: [] }
  }
};

/* (keep your master exports below if you still want them here) */
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
  name: "Master — Sécurité et sûreté de fonctionnement",
  semesters: {
    s1: { title: "Master Sécurité & sûreté — Semestre 1", modules: [] },
    s2: { title: "Master Sécurité & sûreté — Semestre 2", modules: [] },
    s3: { title: "Master Sécurité & sûreté — Semestre 3", modules: [] }
  }
};
