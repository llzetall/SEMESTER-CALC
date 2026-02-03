import {
  GI,
  MASTER_CHAINES_LOGISTIQUES,
  MASTER_ING_PRODUCTION,
  MASTER_ING_SYSTEMES,
  MASTER_MGMT_ING,
  MASTER_SECURITE_SURETE
} from "./gi.js";

import { AUTOMATIQUE_L3 } from "./automatique.js";

export const SPECIALTIES = [
  { id: "gi",   name: "Génie Industriel (Licence)", data: GI },

  { id: "auto", name: "Automatique (L3)", data: AUTOMATIQUE_L3 },

  { id: "mcl",  name: "Master — Chaînes logistiques", data: MASTER_CHAINES_LOGISTIQUES },
  { id: "mip",  name: "Master — Ingénierie de la production", data: MASTER_ING_PRODUCTION },
  { id: "mis",  name: "Master — Ingénierie des systèmes", data: MASTER_ING_SYSTEMES },
  { id: "mmi",  name: "Master — Management de l’ingénierie", data: MASTER_MGMT_ING },
  { id: "mssf", name: "Master — Sécurité et sureté de fonctionnement", data: MASTER_SECURITE_SURETE }
];
