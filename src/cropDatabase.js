// ─── CROP DATABASE — West Bengal Agriculture ─────────────────────────────────
// 15 crops: Rice, Potato, Jute, Wheat, Mustard, Tea, Onion, Tomato,
//           Brinjal, Mango, Lychee, Sugarcane, Betel Leaf, Banana, Maize

export const crops = {

  Rice: {
    name: "Rice (Dhan)",
    nameBn: "ধান",
    idealTemp: { min: 20, max: 35 },
    idealHumidity: { min: 60, max: 85 },
    season: ["Monsoon", "Summer"],
    waterRequirement: "High",
    icon: "🌾",
    color: "#f59e0b",
    growthDuration: 130,
    growthStages: [
      { stage: "Nursery",            days: "0-25",    criticalWater: true,  waterNeed: "Keep soil moist, 2-3 cm water" },
      { stage: "Transplanting",      days: "25-35",   criticalWater: true,  waterNeed: "2-5 cm standing water" },
      { stage: "Tillering",          days: "35-65",   criticalWater: true,  waterNeed: "5 cm standing water" },
      { stage: "Panicle Initiation", days: "65-80",   criticalWater: true,  waterNeed: "5-7 cm standing water" },
      { stage: "Heading/Flowering",  days: "80-95",   criticalWater: true,  waterNeed: "5 cm standing water" },
      { stage: "Grain Filling",      days: "95-115",  criticalWater: false, waterNeed: "Alternate wet-dry cycles" },
      { stage: "Maturity",           days: "115-130", criticalWater: false, waterNeed: "Drain 10-15 days before harvest" }
    ],
    npkSchedule: [
      { stage: "Basal (Before Transplanting)", daysAfterSowing: 0,  N: 30, P: 30, K: 30, costPerKg: { N: 12, P: 26, K: 17 }, method: "Broadcast and incorporate before transplanting", tips: "Apply DAP for P & MOP for K. Mix well with soil." },
      { stage: "Active Tillering",             daysAfterSowing: 22, N: 40, P: 0,  K: 0,  costPerKg: { N: 12, P: 0,  K: 0  }, method: "Top dress with Urea after draining field",         tips: "Drain water 1 day before, apply urea, re-flood after 2 days." },
      { stage: "Panicle Initiation",           daysAfterSowing: 47, N: 30, P: 0,  K: 20, costPerKg: { N: 12, P: 0,  K: 17 }, method: "Top dress Urea + MOP",                              tips: "K improves grain quality and lodging resistance." }
    ],
    soilAdjustments: {
      lowpH:    "Apply lime (2 t/ha) 2-3 weeks before transplanting if pH < 5.5",
      highpH:   "Use ammonium sulfate instead of urea",
      sandysoil:"Increase N application frequency; avoid large single doses",
      claysoil: "Ensure drainage to prevent waterlogging-related N loss"
    },
    marketData: {
      MSP: 2183,
      currentPrice: { min: 1900, max: 2400 },
      bestSellMonths: ["November", "December", "January"],
      majorMarkets: ["Burdwan", "Midnapore", "Bankura", "Murshidabad"],
      demandTrend: "Stable",
      exportPotential: "High"
    },
    yieldPerHectare: 4.5,
    diseases: [
      { name: "Bacterial Leaf Blight", riskConditions: { humidity: { min: 75 }, temperature: { min: 28, max: 32 }, rainfall: "moderate to heavy" }, symptoms: "Yellow to white lesions on leaf blades starting from tips", prevention: ["Spray Streptocycline (100ppm) + Copper oxychloride", "Maintain proper drainage", "Avoid excess nitrogen", "Use resistant varieties like Swarna Sub-1"], treatment: "Spray Streptocycline 0.5g + Copper oxychloride 2.5g per liter", severity: "high" },
      { name: "Brown Spot",            riskConditions: { humidity: { min: 80 }, temperature: { min: 25, max: 30 } },                                  symptoms: "Brown circular spots with yellow halo on leaves",          prevention: ["Apply Mancozeb @ 2.5 kg/ha", "Balanced NPK fertilization", "Remove infected debris"],                                                                                    treatment: "Spray Mancozeb 75WP @ 2g/liter",                            severity: "medium" },
      { name: "Blast Disease",         riskConditions: { humidity: { min: 90 }, temperature: { min: 22, max: 28 }, rainfall: "continuous" },           symptoms: "Diamond-shaped gray lesions with brown border on leaves",   prevention: ["Spray Tricyclazole 75WP @ 0.6g/liter", "Use resistant varieties", "Avoid excess nitrogen"],                                                                             treatment: "Tricyclazole 75WP @ 300g/ha at first symptom",              severity: "high" }
    ],
    pests: [
      { name: "Brown Plant Hopper", weatherTrigger: { humidity: { min: 80 }, temp: { min: 25, max: 32 } },            symptoms: "Hopper burn - circular dried patches; yellowing from base", control: ["Spray Buprofezin 25SC @ 1ml/liter", "Drain field 3-4 days", "Use pheromone traps"],                  severity: "high" },
      { name: "Stem Borer",         weatherTrigger: { humidity: { min: 70 }, temp: { min: 26, max: 34 } },            symptoms: "Dead hearts at vegetative; white ears at grain stage",      control: ["Apply Chlorpyrifos granules @ 10 kg/ha", "Release Trichogramma parasitoids"],                       severity: "high" },
      { name: "Leaf Folder",        weatherTrigger: { humidity: { min: 75 }, temp: { min: 25, max: 30 }, rainfall: true }, symptoms: "Longitudinally folded leaves with transparent streaks",     control: ["Spray Chlorpyrifos 20EC @ 2ml/liter", "Clip tips of folded leaves to kill larvae"],               severity: "medium" }
    ]
  },

  Potato: {
    name: "Potato (Aloo)",
    nameBn: "আলু",
    idealTemp: { min: 15, max: 25 },
    idealHumidity: { min: 50, max: 70 },
    season: ["Winter"],
    waterRequirement: "Medium",
    icon: "🥔",
    color: "#d97706",
    growthDuration: 110,
    growthStages: [
      { stage: "Planting",        days: "0-15",   criticalWater: true,  waterNeed: "Pre-planting irrigation; light irrigation at planting" },
      { stage: "Vegetative",      days: "15-45",  criticalWater: false, waterNeed: "Irrigate every 8-10 days" },
      { stage: "Tuber Initiation",days: "45-60",  criticalWater: true,  waterNeed: "Critical: irrigate every 5-6 days" },
      { stage: "Tuber Bulking",   days: "60-90",  criticalWater: true,  waterNeed: "Most critical: irrigate every 5 days" },
      { stage: "Maturation",      days: "90-110", criticalWater: false, waterNeed: "Reduce irrigation; stop 10 days before harvest" }
    ],
    npkSchedule: [
      { stage: "Basal (At Planting)", daysAfterSowing: 0,  N: 60, P: 80, K: 100, costPerKg: { N: 12, P: 26, K: 17 }, method: "Apply in furrows before planting",           tips: "High K requirement for good tuber quality." },
      { stage: "Earthing Up",         daysAfterSowing: 27, N: 60, P: 0,  K: 50,  costPerKg: { N: 12, P: 0,  K: 17 }, method: "Side dress during earthing up operation",    tips: "Earth up properly to prevent greening of tubers." }
    ],
    soilAdjustments: { lowpH: "Optimal pH 5.2-6.0. Slight acidity prevents common scab", highpH: "Acidify soil with sulfur to prevent scab disease", sandysoil: "Add organic matter; increase irrigation frequency significantly", claysoil: "Improve drainage with raised beds; add sand and compost" },
    marketData: { MSP: null, currentPrice: { min: 800, max: 1800 }, bestSellMonths: ["March", "April"], majorMarkets: ["Hooghly", "Bardhaman", "Medinipur", "Cooch Behar"], demandTrend: "High", exportPotential: "Medium" },
    yieldPerHectare: 20,
    diseases: [
      { name: "Late Blight",  riskConditions: { humidity: { min: 80 }, temperature: { min: 18, max: 22 }, rainfall: "moderate to heavy" }, symptoms: "Water-soaked dark brown lesions with white mold on underside", prevention: ["Spray Mancozeb 75WP @ 2.5 kg/ha preventively", "Ensure proper drainage", "Use certified disease-free seeds"], treatment: "Metalaxyl + Mancozeb (Ridomil Gold) @ 2.5g/liter at first symptom", severity: "high" },
      { name: "Early Blight", riskConditions: { humidity: { min: 70 }, temperature: { min: 24, max: 29 } },                                symptoms: "Dark brown concentric ring spots on older leaves",                 prevention: ["Apply Chlorothalonil 75WP @ 2g/liter", "Remove infected leaves", "Crop rotation"],                                         treatment: "Chlorothalonil 75WP @ 2kg/ha spray",                                severity: "medium" }
    ],
    pests: [
      { name: "Aphids (Virus Vector)", weatherTrigger: { humidity: { min: 50, max: 70 }, temp: { min: 15, max: 22 } }, symptoms: "Curled leaves, sticky honeydew, yellowing; spreads leaf roll virus", control: ["Spray Imidacloprid 17.8SL @ 0.5ml/liter", "Use reflective mulch", "Remove heavily infested plants"], severity: "high" }
    ]
  },

  Jute: {
    name: "Jute (Pat)",
    nameBn: "পাট",
    idealTemp: { min: 24, max: 37 },
    idealHumidity: { min: 70, max: 90 },
    season: ["Summer", "Monsoon"],
    waterRequirement: "High",
    icon: "🌿",
    color: "#65a30d",
    growthDuration: 120,
    growthStages: [
      { stage: "Germination",      days: "0-10",    criticalWater: true,  waterNeed: "Adequate soil moisture for germination" },
      { stage: "Seedling",         days: "10-30",   criticalWater: true,  waterNeed: "Light irrigation if no rain" },
      { stage: "Vegetative Growth",days: "30-80",   criticalWater: false, waterNeed: "Monsoon rain usually sufficient" },
      { stage: "Fiber Development",days: "80-100",  criticalWater: false, waterNeed: "Reduce irrigation; needs dry period" },
      { stage: "Harvest",          days: "100-120", criticalWater: false, waterNeed: "Harvest before seed setting for best fiber" }
    ],
    npkSchedule: [
      { stage: "Basal",              daysAfterSowing: 0,  N: 30, P: 15, K: 15, costPerKg: { N: 12, P: 26, K: 17 }, method: "Broadcast before sowing and mix into soil",             tips: "Apply 5 t/ha FYM additionally." },
      { stage: "Top Dress (30 DAS)", daysAfterSowing: 30, N: 30, P: 0,  K: 15, costPerKg: { N: 12, P: 0,  K: 17 }, method: "Top dress during thinning/weeding operation",           tips: "Combined with thinning operation for efficiency." }
    ],
    soilAdjustments: { lowpH: "Apply lime if pH below 5.5; jute prefers pH 5.5-6.5", highpH: "Use organic matter to lower pH gradually", sandysoil: "Add compost; jute prefers loamy soils", claysoil: "Improve drainage channels; jute is sensitive to waterlogging" },
    marketData: { MSP: 5050, currentPrice: { min: 4500, max: 6000 }, bestSellMonths: ["October", "November", "December"], majorMarkets: ["Barrackpore", "Naihati", "Rishra", "Murshidabad"], demandTrend: "Increasing (eco-friendly packaging)", exportPotential: "Very High" },
    yieldPerHectare: 2.5,
    diseases: [
      { name: "Stem Rot",    riskConditions: { humidity: { min: 85 }, temperature: { min: 30, max: 35 }, rainfall: "heavy" }, symptoms: "Water-soaked lesions on stem; white fungal growth at base",        prevention: ["Spray Carbendazim 50WP @ 1g/liter", "Ensure proper drainage", "Crop rotation"], treatment: "Carbendazim 50WP @ 500g/ha at base of plants", severity: "high" },
      { name: "Anthracnose", riskConditions: { humidity: { min: 80 }, temperature: { min: 25, max: 30 } },                   symptoms: "Dark sunken lesions on leaves and stems; premature leaf drop", prevention: ["Apply Mancozeb 75WP @ 2g/liter", "Remove infected parts", "Proper spacing"],      treatment: "Mancozeb 75WP spray at first sign",           severity: "medium" }
    ],
    pests: [
      { name: "Jute Semilooper", weatherTrigger: { humidity: { min: 75 }, temp: { min: 28, max: 35 } }, symptoms: "Defoliation; caterpillars feeding on leaves from edges inward", control: ["Spray Quinalphos 25EC @ 2ml/liter", "Release Braconid parasitoids", "Light traps at night"], severity: "high" }
    ]
  },

  Wheat: {
    name: "Wheat (Gom)",
    nameBn: "গম",
    idealTemp: { min: 12, max: 25 },
    idealHumidity: { min: 40, max: 60 },
    season: ["Winter"],
    waterRequirement: "Medium",
    icon: "🌾",
    color: "#b45309",
    growthDuration: 130,
    growthStages: [
      { stage: "Germination",          days: "0-7",     criticalWater: true,  waterNeed: "Pre-sowing irrigation; keep moist" },
      { stage: "Crown Root Initiation",days: "20-25",   criticalWater: true,  waterNeed: "Most Critical: 5-6 cm irrigation" },
      { stage: "Tillering",            days: "25-45",   criticalWater: false, waterNeed: "Light irrigation @ 40-45 days if needed" },
      { stage: "Jointing",             days: "65-70",   criticalWater: true,  waterNeed: "Critical: irrigate at jointing stage" },
      { stage: "Heading/Flowering",    days: "85-90",   criticalWater: true,  waterNeed: "Critical: irrigate at heading" },
      { stage: "Grain Filling (Milky)",days: "100-110", criticalWater: true,  waterNeed: "Critical: irrigate at milky stage" },
      { stage: "Maturity",             days: "120-130", criticalWater: false, waterNeed: "Stop irrigation 2 weeks before harvest" }
    ],
    npkSchedule: [
      { stage: "Basal (At Sowing)",            daysAfterSowing: 0,  N: 60, P: 60, K: 40, costPerKg: { N: 12, P: 26, K: 17 }, method: "Drill with seed or broadcast before sowing",          tips: "Apply full P and K at sowing. Use DAP for combined N and P." },
      { stage: "Crown Root Initiation (CRI)",  daysAfterSowing: 21, N: 60, P: 0,  K: 0,  costPerKg: { N: 12, P: 0,  K: 0  }, method: "Top dress Urea after first irrigation",               tips: "Apply immediately after first irrigation for best uptake efficiency." }
    ],
    soilAdjustments: { lowpH: "Apply lime to raise pH to 6.0-7.5", highpH: "Use ammonium sulfate; add organic matter to buffer pH", sandysoil: "Increase irrigation frequency; split N into more doses", claysoil: "Deep plowing before sowing; ensure good drainage channels" },
    marketData: { MSP: 2275, currentPrice: { min: 2100, max: 2600 }, bestSellMonths: ["May", "June"], majorMarkets: ["Bardhaman", "Murshidabad", "Malda", "Nadia"], demandTrend: "Stable", exportPotential: "Medium" },
    yieldPerHectare: 3.2,
    diseases: [
      { name: "Yellow Rust",    riskConditions: { humidity: { min: 70 }, temperature: { min: 10, max: 18 } }, symptoms: "Yellow/orange powdery stripes along leaf veins",              prevention: ["Spray Propiconazole 25EC @ 1ml/liter", "Use resistant varieties like HD-2967"],  treatment: "Propiconazole 25EC @ 500ml/ha", severity: "high" },
      { name: "Powdery Mildew", riskConditions: { humidity: { min: 75 }, temperature: { min: 18, max: 22 } }, symptoms: "White powdery growth on upper leaf surface and stems",         prevention: ["Apply Sulfur 80WP @ 2.5 kg/ha", "Avoid excessive nitrogen"],                    treatment: "Wettable Sulfur 80WP @ 3g/liter",  severity: "medium" }
    ],
    pests: [
      { name: "Aphids", weatherTrigger: { humidity: { min: 55, max: 75 }, temp: { min: 15, max: 22 } }, symptoms: "Yellowing, honeydew secretion, ant activity on plants", control: ["Spray Imidacloprid 17.8SL @ 0.5ml/liter", "Use yellow sticky traps in field"], severity: "medium" }
    ]
  },

  Mustard: {
    name: "Mustard (Sarso)",
    nameBn: "সরষে",
    idealTemp: { min: 10, max: 25 },
    idealHumidity: { min: 40, max: 65 },
    season: ["Winter"],
    waterRequirement: "Low to Medium",
    icon: "🌼",
    color: "#eab308",
    growthDuration: 110,
    growthStages: [
      { stage: "Germination",   days: "0-7",    criticalWater: true,  waterNeed: "Pre-sowing irrigation essential" },
      { stage: "Rosette",       days: "7-25",   criticalWater: false, waterNeed: "Light irrigation if no rain" },
      { stage: "Branching",     days: "35-40",  criticalWater: true,  waterNeed: "Critical: first irrigation at branching" },
      { stage: "Flowering",     days: "50-65",  criticalWater: true,  waterNeed: "Critical: irrigate before & during flowering" },
      { stage: "Pod Formation", days: "60-80",  criticalWater: true,  waterNeed: "Critical: irrigation at pod filling stage" },
      { stage: "Maturity",      days: "90-110", criticalWater: false, waterNeed: "Stop irrigation 2-3 weeks before harvest" }
    ],
    npkSchedule: [
      { stage: "Basal (At Sowing)", daysAfterSowing: 0,  N: 40, P: 40, K: 40, costPerKg: { N: 12, P: 26, K: 17 }, method: "Broadcast and incorporate before sowing", tips: "Apply Sulfur @ 20 kg/ha additionally. Mustard is sulfur-hungry." },
      { stage: "Top Dressing",      daysAfterSowing: 27, N: 40, P: 0,  K: 0,  costPerKg: { N: 12, P: 0,  K: 0  }, method: "Broadcast after first irrigation",        tips: "Apply at rosette to vegetative stage for maximum yield benefit." }
    ],
    soilAdjustments: { lowpH: "Apply lime; mustard prefers pH 6.0-7.0", highpH: "Add organic matter; use gypsum to improve soil structure", sandysoil: "Add organic manure @ 5 t/ha; increase irrigation frequency", claysoil: "Ensure drainage; mustard doesn't tolerate waterlogging" },
    marketData: { MSP: 5650, currentPrice: { min: 5000, max: 7000 }, bestSellMonths: ["April", "May"], majorMarkets: ["Alipurduar", "Cooch Behar", "Jalpaiguri", "Malda"], demandTrend: "Strong (edible oil demand rising)", exportPotential: "High" },
    yieldPerHectare: 1.2,
    diseases: [
      { name: "White Rust",      riskConditions: { humidity: { min: 75 }, temperature: { min: 15, max: 20 } }, symptoms: "White blister pustules on leaves and stems; deformed flower stalks", prevention: ["Spray Metalaxyl 8% + Mancozeb 64% @ 2.5g/liter", "Crop rotation", "Remove infected plants early"], treatment: "Ridomil Gold @ 2.5g/liter spray", severity: "medium" },
      { name: "Alternaria Blight",riskConditions: { humidity: { min: 70 }, temperature: { min: 20, max: 25 } }, symptoms: "Dark brown spots with concentric rings on leaves and pods",            prevention: ["Apply Mancozeb 75WP @ 2g/liter", "Crop rotation", "Treat seeds with Thiram @ 3g/kg"],             treatment: "Mancozeb 75WP @ 2.5 kg/ha at 50% flowering", severity: "medium" }
    ],
    pests: [
      { name: "Mustard Aphid", weatherTrigger: { humidity: { min: 55, max: 70 }, temp: { min: 12, max: 20 } }, symptoms: "Dense colonies on growing tips and pods; stunted growth, honeydew", control: ["Spray Imidacloprid 17.8SL @ 0.3ml/liter", "Yellow sticky traps", "Neem oil 5% spray"], severity: "high" }
    ]
  },

  Tea: {
    name: "Tea (Cha)",
    nameBn: "চা",
    idealTemp: { min: 15, max: 30 },
    idealHumidity: { min: 70, max: 90 },
    season: ["Summer", "Monsoon", "Post-Monsoon"],
    waterRequirement: "High",
    icon: "🍵",
    color: "#15803d",
    growthDuration: 365,
    growthStages: [
      { stage: "Dormant (Winter)",    days: "0-60",    criticalWater: false, waterNeed: "Minimal irrigation; rely on morning dew" },
      { stage: "First Flush (Spring)",days: "60-120",  criticalWater: true,  waterNeed: "Regular irrigation 50-60mm/week if dry" },
      { stage: "Second Flush (Summer)",days:"120-210", criticalWater: true,  waterNeed: "Critical: 100-150mm/month needed" },
      { stage: "Monsoon Flush",       days: "210-270", criticalWater: false, waterNeed: "Natural rainfall usually sufficient" },
      { stage: "Autumn Flush",        days: "270-330", criticalWater: true,  waterNeed: "Irrigation needed if post-monsoon dry" },
      { stage: "Pre-dormancy",        days: "330-365", criticalWater: false, waterNeed: "Reduce water to harden shoots" }
    ],
    npkSchedule: [
      { stage: "Pre-flush (Spring)",  daysAfterSowing: 60,  N: 50, P: 20, K: 25, costPerKg: { N: 12, P: 26, K: 17 }, method: "Broadcast around drip circle, 30cm from stem", tips: "Apply before first flush begins. Use slow-release formulations." },
      { stage: "Summer Application",  daysAfterSowing: 150, N: 50, P: 0,  K: 25, costPerKg: { N: 12, P: 0,  K: 17 }, method: "Foliar spray + soil application",              tips: "Split into 2 applications for better uptake in acidic soil." },
      { stage: "Post-monsoon",        daysAfterSowing: 280, N: 30, P: 15, K: 20, costPerKg: { N: 12, P: 26, K: 17 }, method: "Soil application with mulching",                tips: "Mulch after application to conserve moisture and reduce leaching." }
    ],
    soilAdjustments: { lowpH: "Tea thrives at pH 4.5-5.5. Acidic soil is ideal. Do not lime.", highpH: "Acidify with sulfur @ 300-500 kg/ha. Add organic matter.", sandysoil: "Mulch heavily; increase irrigation frequency to prevent drought stress", claysoil: "Drainage critical for tea. Install field drains. Raised bed planting." },
    marketData: { MSP: null, currentPrice: { min: 120, max: 450 }, bestSellMonths: ["April", "May", "June", "October"], majorMarkets: ["Siliguri Tea Auction", "Kolkata Tea Auction", "Jalpaiguri", "Darjeeling"], demandTrend: "Strong (premium Darjeeling demand global)", exportPotential: "Very High" },
    yieldPerHectare: 2.0,
    diseases: [
      { name: "Blister Blight",  riskConditions: { humidity: { min: 85 }, temperature: { min: 15, max: 22 }, rainfall: "continuous" }, symptoms: "Small circular transparent spots on young leaves becoming blisters", prevention: ["Spray Copper oxychloride 50WP @ 3g/liter every 10 days", "Prune and improve air circulation", "Avoid overhead irrigation"], treatment: "Hexaconazole 5SC @ 1ml/liter spray", severity: "high" },
      { name: "Red Root Rot",    riskConditions: { humidity: { min: 80 }, temperature: { min: 25, max: 30 }, rainfall: "heavy" },       symptoms: "Wilting, yellowing; red colored mycelium on roots",                 prevention: ["Improve soil drainage", "Apply Trichoderma @ 5 kg/ha", "Remove and burn infected bushes"],                              treatment: "Drench with Copper oxychloride 3g/liter around root zone", severity: "high" }
    ],
    pests: [
      { name: "Tea Mosquito Bug",  weatherTrigger: { humidity: { min: 80 }, temp: { min: 20, max: 30 } },            symptoms: "Brown spots on leaves and shoots; distorted young leaves",  control: ["Spray Cypermethrin 25EC @ 1ml/liter", "Remove weeds from surroundings", "Early morning inspection"], severity: "high" },
      { name: "Red Spider Mite",   weatherTrigger: { humidity: { min: 40, max: 65 }, temp: { min: 25, max: 35 } },   symptoms: "Bronze/rust colored patches on leaves; webbing underneath", control: ["Spray Dicofol 18.5EC @ 2ml/liter", "Increase irrigation to raise humidity", "Neem oil 5% spray"],  severity: "high" }
    ]
  },

  Onion: {
    name: "Onion (Pyaz)",
    nameBn: "পেঁয়াজ",
    idealTemp: { min: 13, max: 28 },
    idealHumidity: { min: 50, max: 70 },
    season: ["Winter", "Summer"],
    waterRequirement: "Medium",
    icon: "🧅",
    color: "#a855f7",
    growthDuration: 120,
    growthStages: [
      { stage: "Nursery",       days: "0-30",   criticalWater: true,  waterNeed: "Daily light watering in nursery beds" },
      { stage: "Transplanting", days: "30-45",  criticalWater: true,  waterNeed: "Daily irrigation for 10 days after transplant" },
      { stage: "Vegetative",    days: "45-75",  criticalWater: false, waterNeed: "Irrigate every 7-10 days" },
      { stage: "Bulb Formation",days: "75-105", criticalWater: true,  waterNeed: "Critical: irrigate every 5-7 days for bulb sizing" },
      { stage: "Maturity",      days: "105-120",criticalWater: false, waterNeed: "Stop irrigation 10-15 days before harvest" }
    ],
    npkSchedule: [
      { stage: "Basal (Transplanting)", daysAfterSowing: 0,  N: 50, P: 50, K: 50, costPerKg: { N: 12, P: 26, K: 17 }, method: "Mix into soil 2 weeks before transplanting",         tips: "Apply well-rotten FYM @ 20 t/ha before planting." },
      { stage: "First Top Dress",        daysAfterSowing: 30, N: 40, P: 0,  K: 30, costPerKg: { N: 12, P: 0,  K: 17 }, method: "Side dress near root zone",                          tips: "K critical for bulb development and shelf life." },
      { stage: "Second Top Dress",       daysAfterSowing: 60, N: 20, P: 0,  K: 20, costPerKg: { N: 12, P: 0,  K: 17 }, method: "Soil application before irrigation",                 tips: "Stop N application 30 days before harvest to prevent excessive foliage." }
    ],
    soilAdjustments: { lowpH: "Lime to pH 6.0-7.0; onion prefers near-neutral soil", highpH: "Use organic matter; sulfur @ 200 kg/ha to lower pH gradually", sandysoil: "Add organic matter; increase irrigation frequency", claysoil: "Raised beds; good drainage to prevent bulb rot" },
    marketData: { MSP: null, currentPrice: { min: 1200, max: 4000 }, bestSellMonths: ["March", "April", "May"], majorMarkets: ["Siliguri", "Howrah Market", "Bardhaman", "Kolkata"], demandTrend: "Very High (year-round)", exportPotential: "High" },
    yieldPerHectare: 18,
    diseases: [
      { name: "Purple Blotch",   riskConditions: { humidity: { min: 75 }, temperature: { min: 20, max: 28 } }, symptoms: "Purple colored spots on leaves and bulb scale", prevention: ["Spray Mancozeb + Iprodione", "Avoid overhead irrigation", "Proper plant spacing"], treatment: "Iprodione 50WP @ 2g/liter spray", severity: "high" },
      { name: "Downy Mildew",    riskConditions: { humidity: { min: 80 }, temperature: { min: 15, max: 22 }, rainfall: "moderate to heavy" }, symptoms: "Pale green patches on leaves turning violet-purple", prevention: ["Spray Metalaxyl + Mancozeb", "Crop rotation every 3 years", "Resistant varieties"], treatment: "Ridomil Gold @ 2.5g/liter spray", severity: "medium" }
    ],
    pests: [
      { name: "Thrips", weatherTrigger: { humidity: { min: 45, max: 65 }, temp: { min: 20, max: 32 } }, symptoms: "Silver streaks on leaves; severe infestation causes leaf distortion", control: ["Spray Imidacloprid 17.8SL @ 0.5ml/liter", "Blue sticky traps @ 15/acre", "Neem oil 5%"], severity: "high" }
    ]
  },

  Tomato: {
    name: "Tomato (Tamato)",
    nameBn: "টমেটো",
    idealTemp: { min: 18, max: 30 },
    idealHumidity: { min: 50, max: 75 },
    season: ["Winter", "Summer"],
    waterRequirement: "Medium",
    icon: "🍅",
    color: "#dc2626",
    growthDuration: 120,
    growthStages: [
      { stage: "Nursery",        days: "0-25",   criticalWater: true,  waterNeed: "Daily light watering in nursery" },
      { stage: "Transplanting",  days: "25-35",  criticalWater: true,  waterNeed: "Daily irrigation for 7 days" },
      { stage: "Vegetative",     days: "35-65",  criticalWater: false, waterNeed: "Irrigate every 5-7 days" },
      { stage: "Flowering",      days: "65-80",  criticalWater: true,  waterNeed: "Critical: avoid water stress at flowering" },
      { stage: "Fruit Development",days:"80-110",criticalWater: true,  waterNeed: "Regular irrigation; drip preferred" },
      { stage: "Ripening",       days: "110-120",criticalWater: false, waterNeed: "Reduce irrigation for quality fruit" }
    ],
    npkSchedule: [
      { stage: "Basal (Transplanting)", daysAfterSowing: 0,  N: 50, P: 60, K: 50, costPerKg: { N: 12, P: 26, K: 17 }, method: "Mix into soil before transplanting",   tips: "Add 15-20 t/ha vermicompost for best results." },
      { stage: "First Top Dress",        daysAfterSowing: 30, N: 40, P: 0,  K: 40, costPerKg: { N: 12, P: 0,  K: 17 }, method: "Side dress near root zone",           tips: "K improves fruit quality, color, and shelf life." },
      { stage: "Fruit Set Top Dress",    daysAfterSowing: 65, N: 25, P: 0,  K: 30, costPerKg: { N: 12, P: 0,  K: 17 }, method: "Fertigation or band application",     tips: "Critical for fruit sizing and preventing blossom drop." }
    ],
    soilAdjustments: { lowpH: "Lime to pH 6.0-6.8 for tomato", highpH: "Add organic matter and sulfur", sandysoil: "High organic matter; frequent light irrigation", claysoil: "Raised beds with good drainage; stake plants" },
    marketData: { MSP: null, currentPrice: { min: 1500, max: 6000 }, bestSellMonths: ["December", "January", "February"], majorMarkets: ["Koley Market Kolkata", "Siliguri", "Howrah", "Bardhaman"], demandTrend: "Very High", exportPotential: "Medium" },
    yieldPerHectare: 25,
    diseases: [
      { name: "Early Blight",         riskConditions: { humidity: { min: 70 }, temperature: { min: 24, max: 30 } },                          symptoms: "Dark brown concentric ring spots on older leaves; collar rot", prevention: ["Spray Mancozeb 75WP @ 2g/liter every 10 days", "Remove lower infected leaves", "Avoid overhead irrigation"], treatment: "Chlorothalonil 75WP @ 2g/liter spray", severity: "high" },
      { name: "Damping Off (Nursery)", riskConditions: { humidity: { min: 85 }, temperature: { min: 22, max: 28 }, rainfall: "heavy" },        symptoms: "Seedling collapse at soil surface; brown water-soaked stem base",     prevention: ["Treat seeds with Thiram @ 3g/kg", "Sterilized nursery soil", "Avoid overwatering nursery"], treatment: "Drench nursery with Copper oxychloride 3g/liter", severity: "high" }
    ],
    pests: [
      { name: "Whitefly (Virus Vector)", weatherTrigger: { humidity: { min: 60, max: 80 }, temp: { min: 22, max: 32 } }, symptoms: "Yellowing, silver patches; spreads Tomato Yellow Leaf Curl Virus", control: ["Spray Imidacloprid 17.8SL @ 0.5ml/liter", "Yellow sticky traps @ 10/acre", "Remove virus-infected plants"], severity: "high" },
      { name: "Fruit Borer",            weatherTrigger: { humidity: { min: 65 }, temp: { min: 25, max: 35 } },            symptoms: "Holes in fruits; frass visible; fruits rot after entry",              control: ["Spray Chlorpyrifos 20EC @ 2ml/liter", "Install pheromone traps", "Remove and destroy infested fruits daily"], severity: "high" }
    ]
  },

  Brinjal: {
    name: "Brinjal (Begun)",
    nameBn: "বেগুন",
    idealTemp: { min: 20, max: 32 },
    idealHumidity: { min: 55, max: 75 },
    season: ["Summer", "Winter"],
    waterRequirement: "Medium",
    icon: "🍆",
    color: "#7e22ce",
    growthDuration: 120,
    growthStages: [
      { stage: "Nursery",        days: "0-25",  criticalWater: true,  waterNeed: "Daily light watering in nursery" },
      { stage: "Transplanting",  days: "25-40", criticalWater: true,  waterNeed: "Daily irrigation first 7 days" },
      { stage: "Vegetative",     days: "40-70", criticalWater: false, waterNeed: "Irrigate every 5-7 days" },
      { stage: "Flowering",      days: "70-85", criticalWater: true,  waterNeed: "Critical: no water stress at flowering" },
      { stage: "Fruiting",       days: "85-120",criticalWater: true,  waterNeed: "Regular watering for continuous cropping" }
    ],
    npkSchedule: [
      { stage: "Basal",         daysAfterSowing: 0,  N: 50, P: 50, K: 50, costPerKg: { N: 12, P: 26, K: 17 }, method: "Mix into soil before transplanting", tips: "Add vermicompost @ 5 t/ha. Brinjal responds well to organic manures." },
      { stage: "Top Dress 1",   daysAfterSowing: 30, N: 40, P: 0,  K: 30, costPerKg: { N: 12, P: 0,  K: 17 }, method: "Side dress at first flowering",     tips: "K improves fruit firmness and reduces insect damage." },
      { stage: "Top Dress 2",   daysAfterSowing: 65, N: 25, P: 0,  K: 25, costPerKg: { N: 12, P: 0,  K: 17 }, method: "Band application near drip zone",   tips: "Continue regular monitoring for Brinjal Shoot and Fruit Borer." }
    ],
    soilAdjustments: { lowpH: "Lime to pH 5.8-6.5", highpH: "Add sulfur and organic compost", sandysoil: "Frequent irrigation; heavy organic amendment", claysoil: "Raised beds; excellent drainage required" },
    marketData: { MSP: null, currentPrice: { min: 1000, max: 3500 }, bestSellMonths: ["November", "December", "January", "February"], majorMarkets: ["Howrah Market", "Koley Market", "Bardhaman", "Nadia"], demandTrend: "High (year-round)", exportPotential: "Low" },
    yieldPerHectare: 20,
    diseases: [
      { name: "Phomopsis Blight", riskConditions: { humidity: { min: 75 }, temperature: { min: 22, max: 28 } }, symptoms: "Dark brown circular spots on leaves; stem cankers near soil", prevention: ["Spray Carbendazim 50WP @ 1g/liter", "Crop rotation", "Destroy infected plant debris"], treatment: "Carbendazim + Mancozeb mixture spray", severity: "medium" }
    ],
    pests: [
      { name: "Shoot & Fruit Borer", weatherTrigger: { humidity: { min: 65 }, temp: { min: 25, max: 35 } }, symptoms: "Wilting shoot tips; holes in fruits; frass visible", control: ["Spray Chlorpyrifos 20EC @ 2ml/liter", "Install pheromone traps @ 15/ha", "Remove and destroy infested shoots and fruits daily", "Release Trichogramma egg parasitoids"], severity: "high" }
    ]
  },

  Mango: {
    name: "Mango (Aam)",
    nameBn: "আম",
    idealTemp: { min: 24, max: 38 },
    idealHumidity: { min: 50, max: 70 },
    season: ["Summer"],
    waterRequirement: "Low to Medium",
    icon: "🥭",
    color: "#f97316",
    growthDuration: 365,
    growthStages: [
      { stage: "Dormant (Post-harvest)", days: "0-90",    criticalWater: false, waterNeed: "Minimal water; allow slight stress to induce flowering" },
      { stage: "Flowering",              days: "90-120",  criticalWater: true,  waterNeed: "Avoid irrigation at full bloom; irrigate before and after" },
      { stage: "Fruit Set",              days: "120-150", criticalWater: true,  waterNeed: "Critical: irrigate every 10 days to prevent fruit drop" },
      { stage: "Fruit Development",      days: "150-240", criticalWater: true,  waterNeed: "Irrigate every 10-15 days for fruit sizing" },
      { stage: "Ripening & Harvest",     days: "240-270", criticalWater: false, waterNeed: "Stop irrigation 2-3 weeks before harvest for better taste" }
    ],
    npkSchedule: [
      { stage: "Pre-flowering (October)",daysAfterSowing: 0,   N: 40, P: 30, K: 40, costPerKg: { N: 12, P: 26, K: 17 }, method: "Apply in ring trenches around drip circle", tips: "Apply before first rains. Deep watering after application." },
      { stage: "Fruit Set (Feb-March)",  daysAfterSowing: 120, N: 30, P: 0,  K: 30, costPerKg: { N: 12, P: 0,  K: 17 }, method: "Soil application + foliar spray of boron",  tips: "Boron @ 0.2% foliar spray reduces fruit drop significantly." }
    ],
    soilAdjustments: { lowpH: "Lime to pH 5.5-7.0 range preferred by mango", highpH: "Deep soil mixing with organic matter; gypsum application", sandysoil: "Heavy mulching around tree base; basin irrigation", claysoil: "Ensure drainage; mound planting to prevent root suffocation" },
    marketData: { MSP: null, currentPrice: { min: 3000, max: 12000 }, bestSellMonths: ["May", "June", "July"], majorMarkets: ["Malda (Fazli Mango)", "Murshidabad", "Howrah", "Nadia"], demandTrend: "Very High (Malda Fazli world-famous)", exportPotential: "Very High" },
    yieldPerHectare: 10,
    diseases: [
      { name: "Powdery Mildew",   riskConditions: { humidity: { min: 70 }, temperature: { min: 22, max: 30 } }, symptoms: "White powdery coating on inflorescence and young leaves", prevention: ["Spray Wettable Sulfur 80WP @ 3g/liter at bud burst", "Two more sprays at 15-day intervals", "Improve air circulation"], treatment: "Hexaconazole 5SC @ 1ml/liter at first appearance", severity: "high" },
      { name: "Anthracnose",      riskConditions: { humidity: { min: 80 }, temperature: { min: 24, max: 30 }, rainfall: "moderate to heavy" }, symptoms: "Dark brown spots on fruits, leaves, and flowers; premature fruit drop", prevention: ["Spray Carbendazim 50WP @ 1g/liter", "Copper oxychloride during flowering", "Post-harvest hot water treatment"], treatment: "Carbendazim 50WP @ 500g/ha spray", severity: "high" }
    ],
    pests: [
      { name: "Mango Hopper",    weatherTrigger: { humidity: { min: 70 }, temp: { min: 22, max: 32 } }, symptoms: "Yellowing of flowers; honey dew secretion; sooty mold development", control: ["Spray Imidacloprid 17.8SL @ 0.5ml/liter at bud break", "Two more sprays at 15-day intervals", "Light traps at night"], severity: "high" },
      { name: "Fruit Fly",       weatherTrigger: { humidity: { min: 60 }, temp: { min: 26, max: 35 } }, symptoms: "Puncture marks on fruit; maggots inside fruit; premature drop",    control: ["Methyl Eugenol traps @ 5/acre", "Bag individual fruits with newspaper", "Spray Malathion 50EC @ 2ml/liter bait spray"], severity: "high" }
    ]
  },

  Sugarcane: {
    name: "Sugarcane (Aakh)",
    nameBn: "আখ",
    idealTemp: { min: 20, max: 38 },
    idealHumidity: { min: 60, max: 80 },
    season: ["Summer", "Monsoon"],
    waterRequirement: "High",
    icon: "🌿",
    color: "#16a34a",
    growthDuration: 330,
    growthStages: [
      { stage: "Germination",    days: "0-30",    criticalWater: true,  waterNeed: "Irrigate every 7 days; maintain soil moisture" },
      { stage: "Tillering",      days: "30-90",   criticalWater: true,  waterNeed: "Irrigate every 10-12 days; critical for ratoon" },
      { stage: "Grand Growth",   days: "90-210",  criticalWater: true,  waterNeed: "Maximum demand: irrigate every 10 days, 75-100mm" },
      { stage: "Maturation",     days: "210-300", criticalWater: false, waterNeed: "Reduce irrigation to increase sugar content" },
      { stage: "Pre-harvest",    days: "300-330", criticalWater: false, waterNeed: "Stop irrigation 30 days before harvest" }
    ],
    npkSchedule: [
      { stage: "Basal (At Planting)", daysAfterSowing: 0,   N: 50,  P: 60, K: 60, costPerKg: { N: 12, P: 26, K: 17 }, method: "Apply in furrows at planting", tips: "Apply FYM @ 25 t/ha before planting for best response." },
      { stage: "Top Dress 1",         daysAfterSowing: 45,  N: 100, P: 0,  K: 60, costPerKg: { N: 12, P: 0,  K: 17 }, method: "Side dress at tillering",     tips: "Earthing up immediately after application." },
      { stage: "Top Dress 2",         daysAfterSowing: 120, N: 100, P: 0,  K: 40, costPerKg: { N: 12, P: 0,  K: 17 }, method: "Broadcast at grand growth",   tips: "Irrigate immediately after for best absorption." }
    ],
    soilAdjustments: { lowpH: "Apply lime; sugarcane prefers pH 6.5-7.5", highpH: "Gypsum application @ 5 t/ha for saline-alkaline soils", sandysoil: "Frequent irrigation; high organic matter needed", claysoil: "Ensure drainage; sugarcane sensitive to waterlogging" },
    marketData: { MSP: 340, currentPrice: { min: 300, max: 380 }, bestSellMonths: ["November", "December", "January", "February"], majorMarkets: ["Nadia Sugar Mills", "Murshidabad", "Jalpaiguri", "Cooch Behar"], demandTrend: "Stable (government procurement)", exportPotential: "Low" },
    yieldPerHectare: 65,
    diseases: [
      { name: "Red Rot", riskConditions: { humidity: { min: 80 }, temperature: { min: 28, max: 35 }, rainfall: "heavy" }, symptoms: "Red discoloration inside stalks; rotting from inside out", prevention: ["Use disease-free setts", "Hot water treatment @ 52°C for 30 min", "Spray Carbendazim 50WP @ 1g/liter"], treatment: "Remove and burn infected plants; drench with Carbendazim", severity: "high" }
    ],
    pests: [
      { name: "Top Shoot Borer", weatherTrigger: { humidity: { min: 70 }, temp: { min: 25, max: 35 } }, symptoms: "Dead heart at young stage; bored internodes later", control: ["Release Trichogramma @ 50,000/ha", "Apply Chlorpyrifos granules @ 15 kg/ha", "Remove and destroy infested shoots"], severity: "high" }
    ]
  },

  Banana: {
    name: "Banana (Kola)",
    nameBn: "কলা",
    idealTemp: { min: 20, max: 35 },
    idealHumidity: { min: 70, max: 85 },
    season: ["Summer", "Monsoon"],
    waterRequirement: "High",
    icon: "🍌",
    color: "#ca8a04",
    growthDuration: 365,
    growthStages: [
      { stage: "Sucker Establishment", days: "0-60",    criticalWater: true,  waterNeed: "Irrigate every 5-7 days; 40-50mm per irrigation" },
      { stage: "Vegetative Growth",    days: "60-210",  criticalWater: true,  waterNeed: "Irrigate every 7-10 days; 50-75mm per irrigation" },
      { stage: "Flowering",            days: "210-240", criticalWater: true,  waterNeed: "Critical: no water stress; irrigate every 5 days" },
      { stage: "Bunch Development",    days: "240-300", criticalWater: true,  waterNeed: "Critical: heavy irrigation for bunch weight" },
      { stage: "Ripening",             days: "300-365", criticalWater: false, waterNeed: "Reduce irrigation; bunch bagging recommended" }
    ],
    npkSchedule: [
      { stage: "At Planting",     daysAfterSowing: 0,   N: 40,  P: 40, K: 60,  costPerKg: { N: 12, P: 26, K: 17 }, method: "Apply in planting pit",          tips: "Add 10 kg FYM per pit at planting. Banana is heavy K feeder." },
      { stage: "2 Months",        daysAfterSowing: 60,  N: 60,  P: 20, K: 100, costPerKg: { N: 12, P: 26, K: 17 }, method: "Ring application around plant",  tips: "Mulch after application with dry leaves/grass." },
      { stage: "4 Months",        daysAfterSowing: 120, N: 60,  P: 0,  K: 100, costPerKg: { N: 12, P: 0,  K: 17 }, method: "Ring application + irrigation",  tips: "High K need for bunch development. Use K2SO4 for quality." }
    ],
    soilAdjustments: { lowpH: "Lime to pH 6.0-7.0; banana prefers near-neutral", highpH: "Add organic matter; use acidifying fertilizers", sandysoil: "Heavy mulching; frequent irrigation with high organic matter", claysoil: "Mound planting; excellent drainage critical to prevent Panama wilt" },
    marketData: { MSP: null, currentPrice: { min: 800, max: 2500 }, bestSellMonths: ["March", "April", "October", "November"], majorMarkets: ["Howrah Market", "Murshidabad", "Nadia", "South 24 Parganas"], demandTrend: "High (year-round)", exportPotential: "Medium" },
    yieldPerHectare: 35,
    diseases: [
      { name: "Panama Wilt (Fusarium)", riskConditions: { humidity: { min: 75 }, temperature: { min: 26, max: 32 }, rainfall: "heavy" }, symptoms: "Yellowing of outer leaves starting from margin; internal discoloration of stem", prevention: ["Use resistant varieties (Nendran, Grand Naine)", "Soil treatment with Trichoderma @ 5 kg/ha", "Avoid replanting in infected soil for 3+ years"], treatment: "No chemical cure. Remove and burn infected plants. Trichoderma soil drench.", severity: "high" }
    ],
    pests: [
      { name: "Banana Weevil", weatherTrigger: { humidity: { min: 75 }, temp: { min: 25, max: 35 } }, symptoms: "Tunneling in corm; yellowing, wilting, plant fall", control: ["Apply Chlorpyrifos granules @ 30 kg/ha", "Use pseudostem traps", "Remove dry leaves and sheaths regularly"], severity: "high" }
    ]
  },

  Maize: {
    name: "Maize (Bhutta)",
    nameBn: "ভুট্টা",
    idealTemp: { min: 18, max: 32 },
    idealHumidity: { min: 50, max: 70 },
    season: ["Summer", "Monsoon"],
    waterRequirement: "Medium",
    icon: "🌽",
    color: "#f59e0b",
    growthDuration: 100,
    growthStages: [
      { stage: "Germination",  days: "0-10",  criticalWater: true,  waterNeed: "Light irrigation to maintain moisture for germination" },
      { stage: "Seedling",     days: "10-25", criticalWater: false, waterNeed: "Irrigate every 10 days if no rain" },
      { stage: "Vegetative",   days: "25-50", criticalWater: false, waterNeed: "Irrigate every 8-10 days" },
      { stage: "Tasseling",    days: "50-65", criticalWater: true,  waterNeed: "Critical: no water stress at tasseling/silking" },
      { stage: "Grain Filling",days: "65-90", criticalWater: true,  waterNeed: "Critical: irrigate every 7-8 days" },
      { stage: "Maturity",     days: "90-100",criticalWater: false, waterNeed: "Reduce irrigation; allow cobs to dry" }
    ],
    npkSchedule: [
      { stage: "Basal (At Sowing)", daysAfterSowing: 0,  N: 60, P: 60, K: 40, costPerKg: { N: 12, P: 26, K: 17 }, method: "Apply in furrows at sowing", tips: "Apply all P, K at basal. Zinc sulfate @ 25 kg/ha for zinc-deficient soils." },
      { stage: "Top Dress (Knee-high)", daysAfterSowing: 30, N: 60, P: 0, K: 0, costPerKg: { N: 12, P: 0, K: 0 }, method: "Side dress when plants are knee-high", tips: "Critical timing for maximum yield response to N." },
      { stage: "Top Dress (Tasseling)", daysAfterSowing: 50, N: 30, P: 0, K: 0, costPerKg: { N: 12, P: 0, K: 0 }, method: "Broadcast before irrigation", tips: "Improves grain filling and reduces empty cobs." }
    ],
    soilAdjustments: { lowpH: "Lime to pH 6.0-7.0; maize sensitive to soil acidity", highpH: "Add organic matter; use acidifying fertilizers like ammonium sulfate", sandysoil: "High organic matter; split N into 3 doses", claysoil: "Deep plowing; raised bed sowing for better drainage" },
    marketData: { MSP: 2090, currentPrice: { min: 1800, max: 2500 }, bestSellMonths: ["August", "September", "October"], majorMarkets: ["Bardhaman", "Purulia", "Bankura", "Jalpaiguri"], demandTrend: "Growing (poultry feed demand)", exportPotential: "Medium" },
    yieldPerHectare: 5,
    diseases: [
      { name: "Turcicum Blight", riskConditions: { humidity: { min: 75 }, temperature: { min: 20, max: 28 } }, symptoms: "Long cigar-shaped grayish-green lesions on leaves", prevention: ["Spray Mancozeb 75WP @ 2g/liter", "Use resistant hybrids", "Crop rotation with legumes"], treatment: "Propiconazole 25EC @ 1ml/liter spray", severity: "medium" }
    ],
    pests: [
      { name: "Fall Armyworm", weatherTrigger: { humidity: { min: 65 }, temp: { min: 25, max: 35 } }, symptoms: "Feeding damage on whorls; pin holes on leaves; frass in whorls", control: ["Spray Chlorpyrifos 20EC @ 2ml/liter into whorl", "Emamectin benzoate 5SG @ 0.4g/liter", "Neem oil 5% spray preventively", "Pheromone traps @ 10/acre"], severity: "high" }
    ]
  },

  Lychee: {
    name: "Lychee (Litchi)",
    nameBn: "লিচু",
    idealTemp: { min: 22, max: 35 },
    idealHumidity: { min: 60, max: 80 },
    season: ["Summer"],
    waterRequirement: "Medium",
    icon: "🍒",
    color: "#e11d48",
    growthDuration: 365,
    growthStages: [
      { stage: "Post-harvest Rest",    days: "0-90",    criticalWater: false, waterNeed: "Minimal; slight stress encourages next season flowering" },
      { stage: "Flowering",            days: "90-120",  criticalWater: true,  waterNeed: "No irrigation at full bloom. Irrigate before and after." },
      { stage: "Fruit Development",    days: "120-180", criticalWater: true,  waterNeed: "Critical: irrigate every 10-12 days for fruit sizing" },
      { stage: "Harvest",              days: "180-210", criticalWater: false, waterNeed: "Reduce water 2-3 weeks before harvest for sweetness" }
    ],
    npkSchedule: [
      { stage: "Pre-flowering (Feb)",  daysAfterSowing: 0,   N: 40, P: 30, K: 40, costPerKg: { N: 12, P: 26, K: 17 }, method: "Ring application around drip zone", tips: "Add 10-15 kg FYM per tree annually." },
      { stage: "Post-harvest (July)",  daysAfterSowing: 210, N: 30, P: 20, K: 30, costPerKg: { N: 12, P: 26, K: 17 }, method: "Soil application with irrigation",   tips: "Post-harvest fertilization builds reserves for next season." }
    ],
    soilAdjustments: { lowpH: "Lychee prefers pH 5.5-7.0. Slight acidity is fine.", highpH: "Add sulfur and organic matter to acidify", sandysoil: "Heavy mulching; basin irrigation method", claysoil: "Mound planting; drainage channels essential" },
    marketData: { MSP: null, currentPrice: { min: 5000, max: 20000 }, bestSellMonths: ["May", "June"], majorMarkets: ["Murshidabad", "Malda", "Nadia", "Kolkata"], demandTrend: "High (premium fruit, limited season)", exportPotential: "High" },
    yieldPerHectare: 8,
    diseases: [
      { name: "Anthracnose", riskConditions: { humidity: { min: 80 }, temperature: { min: 24, max: 30 }, rainfall: "moderate to heavy" }, symptoms: "Brown spots on fruits; premature drop; twig dieback", prevention: ["Spray Carbendazim 50WP @ 1g/liter at fruit set", "Two more sprays at 15-day intervals", "Post-harvest dip treatment"], treatment: "Carbendazim + Copper oxychloride combined spray", severity: "high" }
    ],
    pests: [
      { name: "Lychee Mite", weatherTrigger: { humidity: { min: 55, max: 75 }, temp: { min: 25, max: 35 } }, symptoms: "Russet or hairy blisters on leaves; reduced fruit quality", control: ["Spray Dicofol 18.5EC @ 2ml/liter", "Sulfur 80WP @ 3g/liter at bud burst", "Prune infested branches"], severity: "medium" }
    ]
  }
};

// ─── ALL INDIA STATES & DISTRICTS ──────────────────────────────────────────
export const indianStates = {
  "West Bengal": [
    { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
    { name: "Howrah", lat: 22.5958, lon: 88.2636 },
    { name: "Hooghly", lat: 22.9089, lon: 88.3967 },
    { name: "North 24 Parganas", lat: 22.6157, lon: 88.4332 },
    { name: "South 24 Parganas", lat: 22.1602, lon: 88.4373 },
    { name: "Nadia", lat: 23.4709, lon: 88.5564 },
    { name: "Murshidabad", lat: 24.1833, lon: 88.2833 },
    { name: "Bardhaman East", lat: 23.2324, lon: 87.8615 },
    { name: "Bardhaman West", lat: 23.5522, lon: 87.3784 },
    { name: "Birbhum", lat: 23.8404, lon: 87.6186 },
    { name: "Malda", lat: 25.0096, lon: 88.1413 },
    { name: "Uttar Dinajpur", lat: 25.6220, lon: 88.1413 },
    { name: "Dakshin Dinajpur", lat: 25.2195, lon: 88.7749 },
    { name: "Jalpaiguri", lat: 26.5263, lon: 88.7184 },
    { name: "Darjeeling", lat: 27.0410, lon: 88.2663 },
    { name: "Alipurduar", lat: 26.4911, lon: 89.5276 },
    { name: "Cooch Behar", lat: 26.3240, lon: 89.4450 },
    { name: "Bankura", lat: 23.2324, lon: 87.0696 },
    { name: "Purulia", lat: 23.3321, lon: 86.3616 },
    { name: "Paschim Medinipur", lat: 22.4291, lon: 87.3219 },
    { name: "Purba Medinipur", lat: 22.0209, lon: 87.7698 },
    { name: "Jhargram", lat: 22.4534, lon: 86.9851 },
    { name: "Kalimpong", lat: 27.0594, lon: 88.4686 }
  ],
  "Punjab": [
    { name: "Amritsar", lat: 31.6340, lon: 74.8723 },
    { name: "Ludhiana", lat: 30.9010, lon: 75.8573 },
    { name: "Jalandhar", lat: 31.3260, lon: 75.5762 },
    { name: "Patiala", lat: 30.3398, lon: 76.3869 },
    { name: "Bathinda", lat: 30.2110, lon: 74.9455 },
    { name: "Mohali", lat: 30.7046, lon: 76.7179 },
    { name: "Hoshiarpur", lat: 31.5143, lon: 75.9115 },
    { name: "Gurdaspur", lat: 32.0399, lon: 75.4011 },
    { name: "Fatehgarh Sahib", lat: 30.6480, lon: 76.3925 },
    { name: "Sangrur", lat: 30.2433, lon: 75.8442 },
    { name: "Moga", lat: 30.8163, lon: 75.1737 },
    { name: "Firozpur", lat: 30.9255, lon: 74.6101 }
  ],
  "Haryana": [
    { name: "Gurugram", lat: 28.4595, lon: 77.0266 },
    { name: "Faridabad", lat: 28.4089, lon: 77.3178 },
    { name: "Ambala", lat: 30.3782, lon: 76.7767 },
    { name: "Karnal", lat: 29.6857, lon: 76.9905 },
    { name: "Hisar", lat: 29.1492, lon: 75.7217 },
    { name: "Rohtak", lat: 28.8955, lon: 76.6066 },
    { name: "Panipat", lat: 29.3909, lon: 76.9635 },
    { name: "Sonipat", lat: 28.9931, lon: 77.0151 },
    { name: "Sirsa", lat: 29.5330, lon: 75.0268 },
    { name: "Jhajjar", lat: 28.6081, lon: 76.6551 }
  ],
  "Uttar Pradesh": [
    { name: "Lucknow", lat: 26.8467, lon: 80.9462 },
    { name: "Kanpur", lat: 26.4499, lon: 80.3319 },
    { name: "Agra", lat: 27.1767, lon: 78.0081 },
    { name: "Varanasi", lat: 25.3176, lon: 82.9739 },
    { name: "Allahabad", lat: 25.4358, lon: 81.8463 },
    { name: "Meerut", lat: 28.9845, lon: 77.7064 },
    { name: "Aligarh", lat: 27.8974, lon: 78.0880 },
    { name: "Bareilly", lat: 28.3670, lon: 79.4304 },
    { name: "Mathura", lat: 27.4924, lon: 77.6737 },
    { name: "Gorakhpur", lat: 26.7606, lon: 83.3732 },
    { name: "Moradabad", lat: 28.8386, lon: 78.7733 },
    { name: "Saharanpur", lat: 29.9640, lon: 77.5460 }
  ],
  "Maharashtra": [
    { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
    { name: "Pune", lat: 18.5204, lon: 73.8567 },
    { name: "Nagpur", lat: 21.1458, lon: 79.0882 },
    { name: "Nashik", lat: 19.9975, lon: 73.7898 },
    { name: "Aurangabad", lat: 19.8762, lon: 75.3433 },
    { name: "Solapur", lat: 17.6805, lon: 75.9064 },
    { name: "Kolhapur", lat: 16.7050, lon: 74.2433 },
    { name: "Amravati", lat: 20.9333, lon: 77.7500 },
    { name: "Sangli", lat: 16.8524, lon: 74.5815 },
    { name: "Satara", lat: 17.6805, lon: 74.0183 },
    { name: "Latur", lat: 18.4088, lon: 76.5604 },
    { name: "Jalgaon", lat: 21.0077, lon: 75.5626 }
  ],
  "Karnataka": [
    { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
    { name: "Mysuru", lat: 12.2958, lon: 76.6394 },
    { name: "Hubli", lat: 15.3647, lon: 75.1240 },
    { name: "Belagavi", lat: 15.8497, lon: 74.4977 },
    { name: "Mangaluru", lat: 12.9141, lon: 74.8560 },
    { name: "Davangere", lat: 14.4644, lon: 75.9218 },
    { name: "Ballari", lat: 15.1394, lon: 76.9214 },
    { name: "Tumkur", lat: 13.3409, lon: 77.1010 },
    { name: "Shivamogga", lat: 13.9299, lon: 75.5681 },
    { name: "Raichur", lat: 16.2120, lon: 77.3439 },
    { name: "Hassan", lat: 13.0033, lon: 76.1004 },
    { name: "Kalaburagi", lat: 17.3297, lon: 76.8343 }
  ],
  "Tamil Nadu": [
    { name: "Chennai", lat: 13.0827, lon: 80.2707 },
    { name: "Coimbatore", lat: 11.0168, lon: 76.9558 },
    { name: "Madurai", lat: 9.9252, lon: 78.1198 },
    { name: "Tiruchirappalli", lat: 10.7905, lon: 78.7047 },
    { name: "Salem", lat: 11.6643, lon: 78.1460 },
    { name: "Tirunelveli", lat: 8.7139, lon: 77.7567 },
    { name: "Vellore", lat: 12.9165, lon: 79.1325 },
    { name: "Erode", lat: 11.3410, lon: 77.7172 },
    { name: "Thoothukudi", lat: 8.7642, lon: 78.1348 },
    { name: "Dindigul", lat: 10.3624, lon: 77.9695 },
    { name: "Thanjavur", lat: 10.7870, lon: 79.1378 },
    { name: "Cuddalore", lat: 11.7480, lon: 79.7714 }
  ],
  "Andhra Pradesh": [
    { name: "Visakhapatnam", lat: 17.6868, lon: 83.2185 },
    { name: "Vijayawada", lat: 16.5062, lon: 80.6480 },
    { name: "Guntur", lat: 16.3067, lon: 80.4365 },
    { name: "Nellore", lat: 14.4426, lon: 79.9865 },
    { name: "Kurnool", lat: 15.8281, lon: 78.0373 },
    { name: "Rajahmundry", lat: 17.0005, lon: 81.8040 },
    { name: "Tirupati", lat: 13.6288, lon: 79.4192 },
    { name: "Kadapa", lat: 14.4673, lon: 78.8242 },
    { name: "Anantapur", lat: 14.6819, lon: 77.6006 },
    { name: "Eluru", lat: 16.7107, lon: 81.0952 }
  ],
  "Telangana": [
    { name: "Hyderabad", lat: 17.3850, lon: 78.4867 },
    { name: "Warangal", lat: 17.9784, lon: 79.5941 },
    { name: "Nizamabad", lat: 18.6725, lon: 78.0940 },
    { name: "Karimnagar", lat: 18.4386, lon: 79.1288 },
    { name: "Khammam", lat: 17.2473, lon: 80.1514 },
    { name: "Mahbubnagar", lat: 16.7488, lon: 77.9836 },
    { name: "Nalgonda", lat: 17.0575, lon: 79.2671 },
    { name: "Adilabad", lat: 19.6640, lon: 78.5320 }
  ],
  "Gujarat": [
    { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
    { name: "Surat", lat: 21.1702, lon: 72.8311 },
    { name: "Vadodara", lat: 22.3072, lon: 73.1812 },
    { name: "Rajkot", lat: 22.3039, lon: 70.8022 },
    { name: "Bhavnagar", lat: 21.7645, lon: 72.1519 },
    { name: "Jamnagar", lat: 22.4707, lon: 70.0577 },
    { name: "Gandhinagar", lat: 23.2156, lon: 72.6369 },
    { name: "Junagadh", lat: 21.5222, lon: 70.4579 },
    { name: "Anand", lat: 22.5645, lon: 72.9289 },
    { name: "Mehsana", lat: 23.5880, lon: 72.3693 }
  ],
  "Rajasthan": [
    { name: "Jaipur", lat: 26.9124, lon: 75.7873 },
    { name: "Jodhpur", lat: 26.2389, lon: 73.0243 },
    { name: "Udaipur", lat: 24.5854, lon: 73.7125 },
    { name: "Kota", lat: 25.2138, lon: 75.8648 },
    { name: "Bikaner", lat: 28.0229, lon: 73.3119 },
    { name: "Ajmer", lat: 26.4499, lon: 74.6399 },
    { name: "Bharatpur", lat: 27.2152, lon: 77.5030 },
    { name: "Alwar", lat: 27.5530, lon: 76.6346 },
    { name: "Sikar", lat: 27.6094, lon: 75.1399 },
    { name: "Sri Ganganagar", lat: 29.9038, lon: 73.8772 }
  ],
  "Madhya Pradesh": [
    { name: "Bhopal", lat: 23.2599, lon: 77.4126 },
    { name: "Indore", lat: 22.7196, lon: 75.8577 },
    { name: "Jabalpur", lat: 23.1815, lon: 79.9864 },
    { name: "Gwalior", lat: 26.2183, lon: 78.1828 },
    { name: "Ujjain", lat: 23.1793, lon: 75.7849 },
    { name: "Sagar", lat: 23.8388, lon: 78.7378 },
    { name: "Ratlam", lat: 23.3315, lon: 75.0367 },
    { name: "Satna", lat: 24.5733, lon: 80.8322 },
    { name: "Rewa", lat: 24.5362, lon: 81.2963 },
    { name: "Dewas", lat: 22.9623, lon: 76.0508 }
  ],
  "Bihar": [
    { name: "Patna", lat: 25.5941, lon: 85.1376 },
    { name: "Gaya", lat: 24.7914, lon: 85.0002 },
    { name: "Muzaffarpur", lat: 26.1209, lon: 85.3647 },
    { name: "Bhagalpur", lat: 25.2425, lon: 86.9842 },
    { name: "Darbhanga", lat: 26.1542, lon: 85.8918 },
    { name: "Purnia", lat: 25.7771, lon: 87.4753 },
    { name: "Araria", lat: 26.1474, lon: 87.4734 },
    { name: "Samastipur", lat: 25.8636, lon: 85.7787 },
    { name: "Begusarai", lat: 25.4182, lon: 86.1272 },
    { name: "Sitamarhi", lat: 26.5912, lon: 85.4792 }
  ],
  "Odisha": [
    { name: "Bhubaneswar", lat: 20.2961, lon: 85.8245 },
    { name: "Cuttack", lat: 20.4625, lon: 85.8830 },
    { name: "Rourkela", lat: 22.2604, lon: 84.8536 },
    { name: "Brahmapur", lat: 19.3150, lon: 84.7941 },
    { name: "Sambalpur", lat: 21.4669, lon: 83.9812 },
    { name: "Puri", lat: 19.8135, lon: 85.8312 },
    { name: "Balasore", lat: 21.4927, lon: 86.9337 },
    { name: "Koraput", lat: 18.8130, lon: 82.7110 },
    { name: "Kendujhar", lat: 21.6286, lon: 85.5816 },
    { name: "Sundargarh", lat: 22.1173, lon: 84.0333 }
  ],
  "Assam": [
    { name: "Guwahati", lat: 26.1445, lon: 91.7362 },
    { name: "Dibrugarh", lat: 27.4728, lon: 94.9120 },
    { name: "Jorhat", lat: 26.7509, lon: 94.2037 },
    { name: "Silchar", lat: 24.8333, lon: 92.7789 },
    { name: "Tezpur", lat: 26.6338, lon: 92.7926 },
    { name: "Nagaon", lat: 26.3480, lon: 92.6840 },
    { name: "Barpeta", lat: 26.3219, lon: 91.0052 },
    { name: "Tinsukia", lat: 27.4894, lon: 95.3640 }
  ],
  "Kerala": [
    { name: "Thiruvananthapuram", lat: 8.5241, lon: 76.9366 },
    { name: "Kochi", lat: 9.9312, lon: 76.2673 },
    { name: "Kozhikode", lat: 11.2588, lon: 75.7804 },
    { name: "Thrissur", lat: 10.5276, lon: 76.2144 },
    { name: "Kollam", lat: 8.8932, lon: 76.6141 },
    { name: "Kannur", lat: 11.8745, lon: 75.3704 },
    { name: "Palakkad", lat: 10.7867, lon: 76.6548 },
    { name: "Malappuram", lat: 11.0510, lon: 76.0711 },
    { name: "Idukki", lat: 9.9189, lon: 77.1025 },
    { name: "Wayanad", lat: 11.6854, lon: 76.1320 }
  ],
  "Himachal Pradesh": [
    { name: "Shimla", lat: 31.1048, lon: 77.1734 },
    { name: "Manali", lat: 32.2432, lon: 77.1892 },
    { name: "Dharamshala", lat: 32.2190, lon: 76.3234 },
    { name: "Solan", lat: 30.9045, lon: 77.0967 },
    { name: "Mandi", lat: 31.7086, lon: 76.9317 },
    { name: "Kullu", lat: 31.9579, lon: 77.1095 },
    { name: "Bilaspur", lat: 31.3380, lon: 76.7606 },
    { name: "Una", lat: 31.4685, lon: 76.2708 }
  ],
  "Uttarakhand": [
    { name: "Dehradun", lat: 30.3165, lon: 78.0322 },
    { name: "Haridwar", lat: 29.9457, lon: 78.1642 },
    { name: "Roorkee", lat: 29.8543, lon: 77.8880 },
    { name: "Haldwani", lat: 29.2183, lon: 79.5130 },
    { name: "Rudrapur", lat: 28.9845, lon: 79.3968 },
    { name: "Nainital", lat: 29.3803, lon: 79.4636 },
    { name: "Almora", lat: 29.5971, lon: 79.6591 },
    { name: "Pithoragarh", lat: 29.5828, lon: 80.2181 }
  ],
  "Jharkhand": [
    { name: "Ranchi", lat: 23.3441, lon: 85.3096 },
    { name: "Jamshedpur", lat: 22.8046, lon: 86.2029 },
    { name: "Dhanbad", lat: 23.7957, lon: 86.4304 },
    { name: "Bokaro", lat: 23.6693, lon: 86.1511 },
    { name: "Deoghar", lat: 24.4853, lon: 86.6950 },
    { name: "Hazaribagh", lat: 23.9925, lon: 85.3639 },
    { name: "Giridih", lat: 24.1855, lon: 86.3046 }
  ],
  "Chhattisgarh": [
    { name: "Raipur", lat: 21.2514, lon: 81.6296 },
    { name: "Bilaspur", lat: 22.0796, lon: 82.1391 },
    { name: "Bhilai", lat: 21.2090, lon: 81.3780 },
    { name: "Korba", lat: 22.3595, lon: 82.7501 },
    { name: "Durg", lat: 21.1904, lon: 81.2849 },
    { name: "Rajnandgaon", lat: 21.0974, lon: 81.0330 },
    { name: "Jagdalpur", lat: 19.0724, lon: 82.0321 }
  ]
};

// Helper: get all districts for a state
export function getDistrictsByState(stateName) {
  return indianStates[stateName] || [];
}

// Helper: get sorted state names
export function getAllStates() {
  return Object.keys(indianStates).sort();
}

// Helper: find district info (lat/lon) anywhere in India
export function findDistrictInfo(stateName, districtName) {
  const districts = indianStates[stateName] || [];
  return districts.find(d => d.name === districtName) || null;
}

// State-based soil type suggestions
export const stateSoilMap = {
  "West Bengal":       ["alluvial", "laterite", "coastal_saline", "sub_himalayan"],
  "Punjab":            ["alluvial", "sandy"],
  "Haryana":           ["alluvial", "sandy"],
  "Uttar Pradesh":     ["alluvial", "clay"],
  "Maharashtra":       ["laterite", "clay", "alluvial"],
  "Karnataka":         ["laterite", "alluvial", "clay"],
  "Tamil Nadu":        ["alluvial", "laterite", "coastal_saline"],
  "Andhra Pradesh":    ["alluvial", "laterite", "coastal_saline"],
  "Telangana":         ["laterite", "alluvial", "clay"],
  "Gujarat":           ["sandy", "alluvial", "coastal_saline"],
  "Rajasthan":         ["sandy", "alluvial"],
  "Madhya Pradesh":    ["alluvial", "laterite", "clay"],
  "Bihar":             ["alluvial", "clay"],
  "Odisha":            ["alluvial", "laterite", "coastal_saline"],
  "Assam":             ["alluvial", "sub_himalayan"],
  "Kerala":            ["laterite", "coastal_saline", "alluvial"],
  "Himachal Pradesh":  ["sub_himalayan", "alluvial"],
  "Uttarakhand":       ["sub_himalayan", "alluvial"],
  "Jharkhand":         ["laterite", "alluvial"],
  "Chhattisgarh":      ["alluvial", "laterite", "clay"]
};

export function getSuggestedSoilTypes(stateName) {
  const suggestedIds = stateSoilMap[stateName] || ["alluvial"];
  return soilTypes.filter(s => suggestedIds.includes(s.id));
}
export function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "Summer";
  if (month >= 6 && month <= 9) return "Monsoon";
  if (month >= 10 && month <= 11) return "Post-Monsoon";
  return "Winter";
}

// Soil types for West Bengal
export const soilTypes = [
  { id: "alluvial",        label: "Alluvial (Most districts)",             labelBn: "পলি মাটি" },
  { id: "laterite",        label: "Red Laterite (Bankura, Purulia, WM)",   labelBn: "ল্যাটেরাইট মাটি" },
  { id: "coastal_saline",  label: "Coastal Saline (S24P, Sundarban)",      labelBn: "লোনা মাটি" },
  { id: "sub_himalayan",   label: "Sub-Himalayan Terai (Darjeeling area)", labelBn: "তরাই মাটি" },
  { id: "sandy",           label: "Sandy Loam (river banks)",              labelBn: "বালুকাময় মাটি" },
  { id: "clay",            label: "Heavy Clay (waterlogged areas)",        labelBn: "এঁটেল মাটি" },
];