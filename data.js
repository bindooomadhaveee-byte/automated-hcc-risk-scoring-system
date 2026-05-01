/* ============================================================
   HCC Risk Scoring System — Data Layer (data.js)
   CMS-HCC Model v28 RAF weights & patient data
   ============================================================ */

// ── HCC CATEGORY DEFINITIONS (CMS-HCC v28 subset) ──────────────
const HCC_CATEGORIES = {
  "HCC 1":   { desc: "HIV/AIDS",                         raf: 0.309 },
  "HCC 8":   { desc: "Metastatic cancer",                raf: 1.030 },
  "HCC 9":   { desc: "Lung & other severe cancers",      raf: 0.658 },
  "HCC 10":  { desc: "Lymphatic, head/neck cancers",     raf: 0.658 },
  "HCC 11":  { desc: "Colorectal, bladder, other cancers",raf: 0.300 },
  "HCC 12":  { desc: "Breast, prostate, other cancers",  raf: 0.152 },
  "HCC 17":  { desc: "Diabetes with acute complications",raf: 0.318 },
  "HCC 18":  { desc: "Diabetes with chronic complications",raf: 0.302},
  "HCC 19":  { desc: "Diabetes without complications",   raf: 0.118 },
  "HCC 21":  { desc: "Protein-calorie malnutrition",     raf: 0.455 },
  "HCC 22":  { desc: "Morbid obesity",                   raf: 0.267 },
  "HCC 23":  { desc: "Other significant endocrine disorders",raf:0.202},
  "HCC 27":  { desc: "End-stage liver disease",          raf: 0.946 },
  "HCC 28":  { desc: "Cirrhosis of liver",               raf: 0.418 },
  "HCC 33":  { desc: "Inflammatory bowel disease",       raf: 0.302 },
  "HCC 40":  { desc: "Rheumatoid arthritis/inflammatory",raf: 0.421 },
  "HCC 46":  { desc: "Severe hematological disorders",   raf: 0.534 },
  "HCC 47":  { desc: "Disorders of immunity",            raf: 0.422 },
  "HCC 54":  { desc: "Drug/alcohol psychosis",           raf: 0.379 },
  "HCC 55":  { desc: "Drug/alcohol dependence",          raf: 0.309 },
  "HCC 57":  { desc: "Schizophrenia",                    raf: 0.421 },
  "HCC 58":  { desc: "Major depressive, bipolar disorders",raf:0.344 },
  "HCC 59":  { desc: "Major depression, unspecified",    raf: 0.309 },
  "HCC 70":  { desc: "Quadriplegia",                     raf: 1.343 },
  "HCC 71":  { desc: "Paraplegia",                       raf: 0.816 },
  "HCC 72":  { desc: "Spinal cord disorders/injuries",   raf: 0.532 },
  "HCC 74":  { desc: "Cerebral palsy",                   raf: 0.318 },
  "HCC 75":  { desc: "Polyneuropathy",                   raf: 0.288 },
  "HCC 76":  { desc: "Muscular dystrophy",               raf: 0.462 },
  "HCC 77":  { desc: "Multiple sclerosis",               raf: 0.532 },
  "HCC 78":  { desc: "Parkinsons/huntingtons disease",   raf: 0.706 },
  "HCC 79":  { desc: "Seizure disorders/convulsions",    raf: 0.254 },
  "HCC 80":  { desc: "Coma, brain compression/anoxic damage",raf:0.535},
  "HCC 82":  { desc: "Respirator dependence/tracheostomy",raf:1.514 },
  "HCC 83":  { desc: "Respiratory arrest",               raf: 1.056 },
  "HCC 84":  { desc: "Cardiorespiratory failure",        raf: 0.540 },
  "HCC 85":  { desc: "Heart failure",                    raf: 0.331 },
  "HCC 86":  { desc: "Acute myocardial infarction",      raf: 0.263 },
  "HCC 87":  { desc: "Unstable angina",                  raf: 0.171 },
  "HCC 88":  { desc: "Angina pectoris",                  raf: 0.126 },
  "HCC 96":  { desc: "Specified heart arrhythmias",      raf: 0.265 },
  "HCC 100": { desc: "Hemiplegia/hemiparesis",           raf: 0.673 },
  "HCC 101": { desc: "Cerebral hemorrhage",              raf: 0.418 },
  "HCC 104": { desc: "Monoplegia, other paralytic syndromes",raf:0.431},
  "HCC 106": { desc: "Atherosclerosis of arteries",      raf: 0.288 },
  "HCC 107": { desc: "Vascular disease with complications",raf:0.421},
  "HCC 108": { desc: "Vascular disease",                 raf: 0.288 },
  "HCC 110": { desc: "Cystic fibrosis",                  raf: 0.534 },
  "HCC 111": { desc: "COPD",                             raf: 0.352 },
  "HCC 112": { desc: "Fibrosis of lung/other chronic lung", raf:0.254},
  "HCC 114": { desc: "Aspiration and specified bacterial pneumonias",raf:0.534},
  "HCC 134": { desc: "Dialysis status",                  raf: 0.443 },
  "HCC 135": { desc: "Acute renal failure",              raf: 0.435 },
  "HCC 136": { desc: "Chronic kidney disease, Stage 5",  raf: 0.289 },
  "HCC 137": { desc: "Chronic kidney disease, Stages 3-4",raf:0.201 },
  "HCC 138": { desc: "Chronic kidney disease, Stage 1-2",raf:0.083 },
  "HCC 157": { desc: "Pressure ulcers of skin, Stage III/IV",raf:0.534},
  "HCC 158": { desc: "Pressure ulcers of skin, Stage I or II",raf:0.263},
  "HCC 161": { desc: "Chronic ulcer of skin, except pressure",raf:0.531},
  "HCC 164": { desc: "Severe skin burn or condition",    raf: 0.440 },
  "HCC 166": { desc: "Severe head injury",               raf: 0.514 },
  "HCC 167": { desc: "Major head injury",                raf: 0.243 },
  "HCC 169": { desc: "Vertebral fractures without spinal cord injury",raf:0.309},
  "HCC 170": { desc: "Hip fracture/dislocation",         raf: 0.421 },
  "HCC 173": { desc: "Traumatic amputations and complications",raf:0.421},
  "HCC 176": { desc: "Complications of specified implanted device",raf:0.348}
};

// ── ICD-10 TO HCC MAPPINGS ──────────────────────────────────────
const ICD_TO_HCC = {
  // Diabetes
  "E10.9": "HCC 19", "E11.9": "HCC 19", "E11.65": "HCC 18",
  "E11.40": "HCC 18", "E11.41": "HCC 18", "E11.42": "HCC 18",
  "E11.51": "HCC 18", "E11.00": "HCC 17", "E11.01": "HCC 17",
  // Obesity
  "E66.01": "HCC 22", "E66.09": "HCC 22", "E66.9": "HCC 22",
  // Heart
  "I50.9": "HCC 85", "I50.32": "HCC 85", "I50.22": "HCC 85",
  "I50.30": "HCC 85", "I21.9": "HCC 86", "I48.91": "HCC 96",
  "I48.0": "HCC 96", "I25.10": "HCC 88",
  // COPD
  "J44.1": "HCC 111", "J44.0": "HCC 111", "J44.9": "HCC 111",
  "J84.10": "HCC 112",
  // Vascular
  "I73.9": "HCC 108", "I70.209": "HCC 106", "I70.219": "HCC 107",
  // CKD
  "N18.1": "HCC 138", "N18.2": "HCC 138",
  "N18.3": "HCC 137", "N18.4": "HCC 137",
  "N18.5": "HCC 136", "N18.6": "HCC 134",
  "N17.9": "HCC 135",
  // Mental
  "F33.1": "HCC 59", "F33.9": "HCC 59", "F31.9": "HCC 58",
  "F20.9": "HCC 57", "F10.20": "HCC 55", "F11.20": "HCC 55",
  // Arthritis
  "M05.9": "HCC 40", "M06.9": "HCC 40",
  // Cancer
  "C18.9": "HCC 11", "C50.919": "HCC 12", "C61": "HCC 12",
  "C34.10": "HCC 9", "C80.1": "HCC 8",
  // Neuro
  "G35": "HCC 77", "G20": "HCC 78", "G40.909": "HCC 79",
  "G62.9": "HCC 75",
  // Skin
  "L89.313": "HCC 157", "L89.119": "HCC 158",
  // HIV
  "B20": "HCC 1",
  // Liver
  "K74.60": "HCC 28", "K74.69": "HCC 27",
  // Respiratory
  "J96.00": "HCC 84", "J95.00": "HCC 82"
};

// ── SAMPLE PATIENT DATA ─────────────────────────────────────────
const PATIENTS = [
  {
    id: "P001", mrn: "00412",
    name: "Margaret Thompson", dob: "03/14/1952", age: 72, gender: "F",
    plan: "Medicare Advantage", planYear: 2025,
    lastScored: "Apr 28, 2026",
    raf: 2.34, demoScore: 0.38, chronicScore: 1.62, interactionScore: 0.34,
    risk: "High",
    hccs: ["HCC 18","HCC 85","HCC 108","HCC 22"],
    diagnoses: [
      { icd:"E11.65", hcc:"HCC 18", status:"Confirmed", date:"2026-01-12" },
      { icd:"I50.9",  hcc:"HCC 85", status:"Confirmed", date:"2025-11-08" },
      { icd:"I73.9",  hcc:"HCC 108",status:"Confirmed", date:"2026-02-20" },
      { icd:"E66.01", hcc:"HCC 22", status:"Suspected", date:"2026-03-05" }
    ],
    alerts: [
      "Suspected HCC 22 (Morbid obesity) — confirm with physician documentation",
      "CKD Stage 3 may qualify for HCC 136 — review recent labs",
      "Annual wellness visit overdue — RAF capture at risk"
    ],
    trend: [1.82,1.95,2.01,2.18,2.28,2.34]
  },
  {
    id: "P002", mrn: "00389",
    name: "Robert Chen", dob: "07/02/1957", age: 68, gender: "M",
    plan: "Medicare Advantage", planYear: 2025,
    lastScored: "Apr 25, 2026",
    raf: 1.57, demoScore: 0.32, chronicScore: 0.98, interactionScore: 0.27,
    risk: "Moderate",
    hccs: ["HCC 19","HCC 111","HCC 59"],
    diagnoses: [
      { icd:"E11.9", hcc:"HCC 19",  status:"Confirmed", date:"2025-09-14" },
      { icd:"J44.1", hcc:"HCC 111", status:"Confirmed", date:"2026-01-30" },
      { icd:"F33.1", hcc:"HCC 59",  status:"Confirmed", date:"2025-12-19" }
    ],
    alerts: [
      "Tobacco use disorder not coded — patient is active smoker (HCC 55 applicable)",
      "Consider atrial fibrillation screening — multiple risk factors present"
    ],
    trend: [1.22,1.30,1.38,1.45,1.52,1.57]
  },
  {
    id: "P003", mrn: "00527",
    name: "Dorothy Kumar", dob: "11/19/1944", age: 81, gender: "F",
    plan: "Medicare Advantage", planYear: 2025,
    lastScored: "Apr 29, 2026",
    raf: 2.91, demoScore: 0.52, chronicScore: 2.04, interactionScore: 0.35,
    risk: "High",
    hccs: ["HCC 85","HCC 96","HCC 18","HCC 40"],
    diagnoses: [
      { icd:"I50.32", hcc:"HCC 85", status:"Confirmed", date:"2025-10-22" },
      { icd:"I48.91", hcc:"HCC 96", status:"Confirmed", date:"2026-02-14" },
      { icd:"E11.40", hcc:"HCC 18", status:"Confirmed", date:"2025-08-05" },
      { icd:"M05.9",  hcc:"HCC 40", status:"Confirmed", date:"2026-01-18" }
    ],
    alerts: [
      "Dementia screening recommended — age 81 with multiple comorbidities",
      "Anticoagulation therapy review needed for Afib management",
      "Annual wellness visit completed — RAF fully captured"
    ],
    trend: [2.44,2.55,2.62,2.75,2.85,2.91]
  },
  {
    id: "P004", mrn: "00601",
    name: "James Wilson", dob: "06/30/1966", age: 59, gender: "M",
    plan: "Medicare Advantage", planYear: 2025,
    lastScored: "Apr 20, 2026",
    raf: 0.87, demoScore: 0.28, chronicScore: 0.44, interactionScore: 0.15,
    risk: "Low",
    hccs: ["HCC 19","HCC 22"],
    diagnoses: [
      { icd:"E11.9",  hcc:"HCC 19", status:"Confirmed", date:"2026-03-08" },
      { icd:"E66.9",  hcc:"HCC 22", status:"Suspected", date:"2026-04-01" }
    ],
    alerts: [
      "No CKD coding — diabetes patient with labs indicating Stage 2 CKD",
      "Preventive care visit not yet captured this plan year"
    ],
    trend: [0.71,0.74,0.78,0.80,0.83,0.87]
  },
  {
    id: "P005", mrn: "00714",
    name: "Anita Sharma", dob: "09/25/1948", age: 77, gender: "F",
    plan: "Medicare Advantage", planYear: 2025,
    lastScored: "Apr 22, 2026",
    raf: 1.88, demoScore: 0.44, chronicScore: 1.22, interactionScore: 0.22,
    risk: "High",
    hccs: ["HCC 111","HCC 85","HCC 59"],
    diagnoses: [
      { icd:"J44.0", hcc:"HCC 111", status:"Confirmed", date:"2025-07-12" },
      { icd:"I50.22",hcc:"HCC 85",  status:"Confirmed", date:"2026-02-28" },
      { icd:"F33.9", hcc:"HCC 59",  status:"Confirmed", date:"2025-11-30" }
    ],
    alerts: [
      "Pulmonary hypertension suspected — chest X-ray findings noted",
      "Depression treatment compliance follow-up needed"
    ],
    trend: [1.51,1.60,1.68,1.74,1.82,1.88]
  },
  {
    id: "P006", mrn: "00832",
    name: "Harold Foster", dob: "02/14/1960", age: 65, gender: "M",
    plan: "Medicare Advantage", planYear: 2025,
    lastScored: "Apr 15, 2026",
    raf: 1.12, demoScore: 0.30, chronicScore: 0.68, interactionScore: 0.14,
    risk: "Moderate",
    hccs: ["HCC 19","HCC 96"],
    diagnoses: [
      { icd:"E10.9",  hcc:"HCC 19", status:"Confirmed", date:"2026-01-05" },
      { icd:"I48.91", hcc:"HCC 96", status:"Confirmed", date:"2025-12-01" }
    ],
    alerts: [
      "Diabetes without complications — review for chronic complication upgrades",
      "Lipid panel overdue — cardiovascular risk assessment needed"
    ],
    trend: [0.90,0.95,1.00,1.04,1.08,1.12]
  }
];

// ── DEMOGRAPHICS RAF TABLE (CMS-HCC v28) ──────────────────────
const DEMO_RAF = {
  male: {
    "0-34":  0.239, "35-44": 0.282, "45-54": 0.310,
    "55-59": 0.328, "60-64": 0.371, "65-69": 0.379,
    "70-74": 0.400, "75-79": 0.421, "80-84": 0.444,
    "85+":   0.467
  },
  female: {
    "0-34":  0.211, "35-44": 0.254, "45-54": 0.295,
    "55-59": 0.316, "60-64": 0.361, "65-69": 0.372,
    "70-74": 0.392, "75-79": 0.416, "80-84": 0.441,
    "85+":   0.468
  }
};

// ── UTILITY FUNCTIONS ───────────────────────────────────────────
function getAgeBand(age) {
  if (age < 35)  return "0-34";
  if (age < 45)  return "35-44";
  if (age < 55)  return "45-54";
  if (age < 60)  return "55-59";
  if (age < 65)  return "60-64";
  if (age < 70)  return "65-69";
  if (age < 75)  return "70-74";
  if (age < 80)  return "75-79";
  if (age < 85)  return "80-84";
  return "85+";
}

function getDemoRaf(age, gender) {
  const band  = getAgeBand(age);
  const table = gender === "M" ? DEMO_RAF.male : DEMO_RAF.female;
  return table[band] || 0.30;
}

function calcRAF(hccList) {
  return hccList.reduce((sum, code) => {
    const cat = HCC_CATEGORIES[code];
    return sum + (cat ? cat.raf : 0);
  }, 0);
}

function getRiskLevel(raf) {
  if (raf >= 2.0) return "High";
  if (raf >= 1.2) return "Moderate";
  return "Low";
}

function mapICD(code) {
  const upper = code.toUpperCase().replace(/\s/g,'');
  return ICD_TO_HCC[upper] || null;
}

function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 }).format(n);
}

function estimateCost(raf) {
  return Math.round(raf * 9800);
}

// ── LOCAL STORAGE HELPERS ───────────────────────────────────────
function savePatients(list) {
  localStorage.setItem('hcc_patients', JSON.stringify(list));
}
function loadPatients() {
  try {
    const raw = localStorage.getItem('hcc_patients');
    return raw ? JSON.parse(raw) : [...PATIENTS];
  } catch { return [...PATIENTS]; }
}
function getPatientById(id) {
  return loadPatients().find(p => p.id === id);
}

// ── TOAST NOTIFICATION ──────────────────────────────────────────
function showToast(msg, duration=2800) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}
