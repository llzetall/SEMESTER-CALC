export const AUTOMATIQUE_L3 = {
  id: "auto",
  name: "Automatique (Licence)",
  semesters: {
    s5: {
      title: "L3 Automatique — Semestre 5",
      modules: [
        // Exam 1.00
        { name: "Anglais en automatique", coef: 1, mode: "exam" },
        { name: "Énergies renouvelables — production et stockage", coef: 1, mode: "exam" },
        { name: "Modélisation et identification des systèmes", coef: 1, mode: "exam" },
        { name: "Normes et certification", coef: 1, mode: "exam" },
        { name: "Programmation en C++", coef: 1, mode: "exam" },

        // CA 0.40 / Exam 0.60
        { name: "Commande des systèmes linéaires", coef: 2, mode: "td_exam" },
        { name: "Électronique de puissance", coef: 2, mode: "td_exam" },
        { name: "Microprocesseurs et microcontrôleurs", coef: 3, mode: "td_exam" },

        // TP = CA 1.00
        { name: "TP Commande des systèmes linéaires", coef: 1, mode: "tp" },
        { name: "TP Électronique de puissance", coef: 1, mode: "tp" },
        { name: "TP Microprocesseurs et microcontrôleurs", coef: 1, mode: "tp" },
        { name: "TP Modélisation et identification des systèmes", coef: 1, mode: "tp" },
        { name: "TP Programmation en C++", coef: 1, mode: "tp" }
      ]
    }
  }
};
