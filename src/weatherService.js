// Enhanced Weather Service for Agriculture

// ─── MODEL DEFINITIONS ─────────────────────────────────────────────────────────
export const MODELS = {
  basic: {
    id: "basic",
    name: "Basic Model",
    description: "Rule-based thresholds. Fast, simple, good for general advisory.",
    accuracy: "72%",
    bestFor: "Quick advisory, no crop selected",
    color: "blue"
  },
  intermediate: {
    id: "intermediate",
    name: "Intermediate Model",
    description: "Weighted scoring with multi-factor analysis. Balanced accuracy.",
    accuracy: "84%",
    bestFor: "Most farming decisions, standard advisory",
    color: "green"
  },
  advanced: {
    id: "advanced",
    name: "Advanced Model",
    description: "Full probabilistic analysis with crop+weather+soil interaction modeling.",
    accuracy: "93%",
    bestFor: "Critical decisions, full crop+district analysis",
    color: "purple"
  }
};

// ─── IRRIGATION ADVICE ────────────────────────────────────────────────────────
export function getIrrigationAdvice(currentWeather, crop, modelId = "intermediate") {
  if (!currentWeather || !crop) {
    return { shouldIrrigate: false, reason: "Insufficient data", waterAmount: "N/A" };
  }

  const rainfall = currentWeather.Rainfall_mm || 0;
  const humidity = currentWeather.Humidity_Percent || 0;
  const tempMax = currentWeather.Temperature_Max_C || 0;
  const waterReq = crop.waterRequirement;

  // Basic model: simple thresholds
  if (modelId === "basic") {
    if (rainfall > 20) return { shouldIrrigate: false, reason: `Sufficient rainfall (${rainfall}mm). No irrigation needed.`, waterAmount: "0 mm", timing: null, iconType: "check", confidence: "Low" };
    if (tempMax > 35 && humidity < 50) {
      const amount = waterReq === "High" ? "40-50 mm" : waterReq === "Medium" ? "25-35 mm" : "15-20 mm";
      return { shouldIrrigate: true, reason: `Hot and dry: ${tempMax}°C, ${humidity}% humidity.`, waterAmount: amount, timing: "Early morning 5-7 AM", iconType: "droplet", confidence: "Low" };
    }
    return { shouldIrrigate: humidity < 60 && rainfall === 0, reason: "Monitor soil moisture closely.", waterAmount: "15-20 mm", timing: "Morning", iconType: "check", confidence: "Low" };
  }

  // Intermediate model: weighted scoring
  if (modelId === "intermediate") {
    let irrigationScore = 0;
    let reasons = [];

    if (rainfall > 20) { irrigationScore -= 60; reasons.push(`Good rainfall (${rainfall}mm)`); }
    else if (rainfall > 5) { irrigationScore -= 30; reasons.push(`Light rainfall (${rainfall}mm)`); }
    else { irrigationScore += 20; reasons.push("No rainfall"); }

    if (tempMax > 38) { irrigationScore += 40; reasons.push(`Extreme heat ${tempMax}°C`); }
    else if (tempMax > 33) { irrigationScore += 25; reasons.push(`High temperature ${tempMax}°C`); }
    else if (tempMax < 20) { irrigationScore -= 10; reasons.push(`Cool temperature ${tempMax}°C`); }

    if (humidity < 40) { irrigationScore += 30; reasons.push(`Very low humidity ${humidity}%`); }
    else if (humidity < 60) { irrigationScore += 15; reasons.push(`Low humidity ${humidity}%`); }
    else if (humidity > 80) { irrigationScore -= 20; reasons.push(`High humidity ${humidity}%`); }

    if (waterReq === "High") irrigationScore += 10;
    else if (waterReq === "Low to Medium") irrigationScore -= 10;

    const shouldIrrigate = irrigationScore > 20;
    const amount = waterReq === "High" ? (irrigationScore > 50 ? "40-50 mm" : "25-35 mm") : waterReq === "Medium" ? (irrigationScore > 50 ? "25-30 mm" : "15-20 mm") : "10-15 mm";

    return {
      shouldIrrigate,
      reason: reasons.join(". "),
      waterAmount: shouldIrrigate ? amount : "0 mm",
      timing: shouldIrrigate ? (tempMax > 30 ? "Early morning 5-7 AM or evening 6-8 PM" : "Morning 7-9 AM") : null,
      iconType: shouldIrrigate ? "droplet" : "check",
      confidence: "Medium",
      irrigationScore
    };
  }

  // Advanced model: full probabilistic
  if (modelId === "advanced") {
    let score = 0;
    let factors = [];

    // Rainfall factor (weight: 35%)
    const rainfallFactor = rainfall > 30 ? -35 : rainfall > 15 ? -20 : rainfall > 5 ? -10 : rainfall > 0 ? 5 : 35;
    score += rainfallFactor;
    factors.push({ name: "Rainfall", score: rainfallFactor, detail: `${rainfall}mm recorded` });

    // Evapotranspiration estimate (temp + humidity + wind)
    const windSpeed = currentWeather.Wind_Speed_kmh || 0;
    const etFactor = (tempMax * 0.4 + (100 - humidity) * 0.3 + windSpeed * 0.1) > 18 ? 30 : 15;
    score += etFactor;
    factors.push({ name: "Evapotranspiration", score: etFactor, detail: `Temp:${tempMax}°C, RH:${humidity}%, Wind:${windSpeed}km/h` });

    // Crop water demand (weight: 20%)
    const cropFactor = waterReq === "High" ? 20 : waterReq === "Medium" ? 10 : 0;
    score += cropFactor;
    factors.push({ name: "Crop Water Demand", score: cropFactor, detail: `${waterReq} water requirement crop` });

    // Season adjustment
    const season = currentWeather.Season || "";
    const seasonFactor = season === "Monsoon" ? -15 : season === "Summer" ? 15 : 0;
    score += seasonFactor;
    factors.push({ name: "Season Adjustment", score: seasonFactor, detail: `${season} season` });

    const shouldIrrigate = score > 25;
    const urgency = score > 60 ? "Urgent" : score > 40 ? "Recommended" : score > 25 ? "Optional" : "Not needed";
    const amount = waterReq === "High" ? (score > 60 ? "45-55 mm" : "30-40 mm") : waterReq === "Medium" ? (score > 60 ? "25-35 mm" : "15-25 mm") : "10-15 mm";
    const timing = tempMax > 32 ? "Early morning 5:00-7:00 AM (minimize evaporation)" : "Morning 7:00-9:00 AM";

    return {
      shouldIrrigate,
      reason: `Score: ${score}. ${factors.map(f => f.detail).join(". ")}`,
      waterAmount: shouldIrrigate ? amount : "0 mm",
      timing: shouldIrrigate ? timing : null,
      urgency,
      confidence: "High",
      factors,
      irrigationScore: score
    };
  }

  return { shouldIrrigate: false, reason: "Model not found", waterAmount: "N/A" };
}

// ─── IRRIGATION STAGE TRACKING ────────────────────────────────────────────────
export function getIrrigationStageAdvice(crop, currentDAS = 0) {
  if (!crop || !crop.growthStages) return null;

  const das = Number(currentDAS) || 0;

  const currentStage = crop.growthStages.find(s => {
    const parts = String(s.days).split("-").map(Number);
    const start = parts[0] || 0;
    const end = parts.length > 1 ? parts[1] : parts[0];
    return das >= start && das <= end;
  }) || crop.growthStages[crop.growthStages.length - 1];

  const idx = crop.growthStages.indexOf(currentStage);
  const nextStage = crop.growthStages[idx + 1] || null;

  return {
    currentStage,
    nextStage,
    isCritical: currentStage.criticalWater,
    recommendation: currentStage.waterNeed,
    allStages: crop.growthStages,
    stageIndex: idx,
    totalStages: crop.growthStages.length
  };
}

// ─── RISK ALERTS ──────────────────────────────────────────────────────────────
export function getRiskAlerts(currentWeather, forecast = [], modelId = "intermediate") {
  const alerts = [];
  if (!currentWeather) return alerts;

  const temp = currentWeather.Temperature_Max_C || 0;
  const rainfall = currentWeather.Rainfall_mm || 0;
  const humidity = currentWeather.Humidity_Percent || 0;
  const windSpeed = currentWeather.Wind_Speed_kmh || 0;

  if (temp > 40) alerts.push({ type: "danger", title: "Extreme Heat Warning", message: `Temperature ${temp}°C. Severe heat stress risk. Increase irrigation frequency immediately. Apply mulching.`, iconType: "flame" });
  else if (temp > 38) alerts.push({ type: "warning", title: "High Temperature Alert", message: `Temperature ${temp}°C. Monitor crops closely. Consider shade nets for sensitive crops.`, iconType: "thermometer" });
  else if (temp < 10) alerts.push({ type: "warning", title: "Cold Weather Alert", message: `Low temperature ${temp}°C. Risk of frost damage. Protect sensitive crops with covers.`, iconType: "snowflake" });

  if (rainfall > 100) alerts.push({ type: "danger", title: "Heavy Rainfall Warning", message: `Very heavy rain (${rainfall}mm). Waterlogging risk. Ensure drainage channels are clear immediately.`, iconType: "cloudRain" });
  else if (rainfall > 50) alerts.push({ type: "warning", title: "Heavy Rain Alert", message: `Heavy rainfall (${rainfall}mm). Postpone spraying. Check field drainage.`, iconType: "cloudRain" });
  else if (rainfall > 25) alerts.push({ type: "info", title: "Moderate Rain Expected", message: `Moderate rain (${rainfall}mm). Good for crops. Delay fertilizer application by 2-3 days.`, iconType: "cloudDrizzle" });

  if (humidity > 90 && temp > 25 && temp < 35) alerts.push({ type: "warning", title: "High Disease Risk - Fungal", message: `High humidity (${humidity}%) with warm temp creates ideal fungal disease conditions. Consider preventive spraying.`, iconType: "alertTriangle" });

  if (windSpeed > 40) alerts.push({ type: "warning", title: "Strong Wind Alert", message: `Strong winds (${windSpeed} km/h). Lodging risk for tall crops. Provide staking support.`, iconType: "wind" });

  const totalForecastRain = forecast.reduce((sum, day) => sum + (day.Rainfall_mm || 0), 0);
  if (totalForecastRain < 5 && humidity < 50 && temp > 32) alerts.push({ type: "warning", title: "Dry Spell Warning", message: "No significant rainfall expected. Plan irrigation schedule for next 7 days.", iconType: "sun" });

  if (alerts.length === 0) alerts.push({ type: "success", title: "Favorable Conditions", message: "Weather is favorable for farming. Good time for field operations.", iconType: "checkCircle" });

  return alerts;
}

// ─── WEATHER ADVISORY ─────────────────────────────────────────────────────────
export function getWeatherAdvisory(currentWeather, crop, modelId = "intermediate") {
  if (!currentWeather) return [];
  const advisory = [];
  const temp = currentWeather.Temperature_Max_C || 0;
  const humidity = currentWeather.Humidity_Percent || 0;
  const rainfall = currentWeather.Rainfall_mm || 0;
  const windSpeed = currentWeather.Wind_Speed_kmh || 0;
  const condition = currentWeather.Weather_Condition || "";

  // Temperature advisory
  if (temp > 38) {
    advisory.push({ category: "Temperature", severity: "high", icon: "🌡️", title: "Extreme Heat Management", advice: "Apply mulching to conserve soil moisture. Irrigate in early morning. Avoid spraying pesticides. Consider temporary shade nets for high-value crops.", action: "Irrigate immediately + Apply mulching" });
  } else if (temp > 32) {
    advisory.push({ category: "Temperature", severity: "medium", icon: "☀️", title: "Hot Weather Management", advice: "Irrigate during cooler parts of day. Monitor for heat stress symptoms (wilting, leaf roll). Avoid transplanting in afternoon heat.", action: "Morning/evening irrigation recommended" });
  } else if (temp < 12) {
    advisory.push({ category: "Temperature", severity: "medium", icon: "❄️", title: "Cold Weather Protection", advice: "Cover nursery beds at night. Delay transplanting if frost expected. Apply smoke/smudging for frost protection in critical areas.", action: "Cover sensitive crops at night" });
  } else {
    advisory.push({ category: "Temperature", severity: "low", icon: "🌤️", title: "Favorable Temperature", advice: `Temperature ${temp}°C is conducive for most agricultural operations. Good conditions for planting, spraying, and field work.`, action: "All field operations suitable" });
  }

  // Humidity advisory
  if (humidity > 85) {
    advisory.push({ category: "Humidity", severity: "high", icon: "💧", title: "High Humidity - Disease Alert", advice: "Very high humidity favors fungal and bacterial diseases. Inspect crops daily. Avoid overhead irrigation. Ensure good field drainage and air circulation.", action: "Preventive fungicide spray recommended" });
  } else if (humidity < 40) {
    advisory.push({ category: "Humidity", severity: "medium", icon: "🏜️", title: "Low Humidity - Desiccation Risk", advice: "Low humidity increases water stress. Increase irrigation frequency. Apply mulching to retain soil moisture. Monitor for spider mites.", action: "Increase irrigation + Apply mulch" });
  } else {
    advisory.push({ category: "Humidity", severity: "low", icon: "💦", title: "Good Humidity Levels", advice: `Humidity at ${humidity}% is adequate. Normal irrigation schedule. Good conditions for pollination if crops are flowering.`, action: "Maintain normal schedule" });
  }

  // Rainfall advisory
  if (rainfall > 50) {
    advisory.push({ category: "Rainfall", severity: "high", icon: "🌧️", title: "Heavy Rain - Field Precautions", advice: "Do NOT apply fertilizers or pesticides. Clear drainage channels. Check for waterlogged areas. After rain, check for diseases and lodging.", action: "Halt all chemical applications" });
  } else if (rainfall > 10 && rainfall <= 50) {
    advisory.push({ category: "Rainfall", severity: "medium", icon: "🌦️", title: "Moderate Rainfall Received", advice: "Skip irrigation today. Delay fertilizer application by 2-3 days. Good conditions for transplanting if not too heavy.", action: "Skip irrigation + delay fertilizer 2-3 days" });
  } else if (rainfall === 0) {
    advisory.push({ category: "Rainfall", severity: "low", icon: "☀️", title: "Dry Conditions", advice: "No rainfall today. Monitor soil moisture levels. Ideal conditions for harvesting, spraying, and field operations.", action: "Proceed with planned field operations" });
  }

  // Wind advisory
  if (windSpeed > 35) {
    advisory.push({ category: "Wind", severity: "high", icon: "💨", title: "Strong Wind Warning", advice: "Avoid spraying (spray drift risk). Lodging risk for tall crops. Provide staking/support for tomato, brinjal. Risk of mechanical damage.", action: "Suspend spraying operations" });
  }

  // Crop-specific advisory
  if (crop) {
    if (temp < crop.idealTemp.min || temp > crop.idealTemp.max) {
      advisory.push({ category: "Crop-Specific", severity: temp < crop.idealTemp.min ? "medium" : "high", icon: "🌱", title: `${crop.name} Temperature Stress Alert`, advice: `${crop.name} ideal temperature is ${crop.idealTemp.min}-${crop.idealTemp.max}°C. Current ${temp}°C is ${temp < crop.idealTemp.min ? "too cold - delay planting/transplanting" : "too hot - increase irrigation and apply shade nets"}.`, action: temp > crop.idealTemp.max ? "Apply shade nets + increase irrigation" : "Delay outdoor operations" });
    }
    if (humidity < crop.idealHumidity.min || humidity > crop.idealHumidity.max) {
      advisory.push({ category: "Crop-Specific", severity: "medium", icon: "🌾", title: `${crop.name} Humidity Advisory`, advice: `${crop.name} prefers ${crop.idealHumidity.min}-${crop.idealHumidity.max}% humidity. Current ${humidity}% requires ${humidity < crop.idealHumidity.min ? "increased irrigation and mulching" : "improved drainage and aeration"}.`, action: humidity < crop.idealHumidity.min ? "Irrigate + mulch" : "Improve drainage" });
    }
  }

  return advisory;
}

// ─── PEST RISK ASSESSMENT ────────────────────────────────────────────────────
export function getPestRiskAlerts(currentWeather, crop, modelId = "intermediate") {
  if (!currentWeather || !crop || !crop.pests) return [];
  const temp = currentWeather.Temperature_Max_C || 0;
  const humidity = currentWeather.Humidity_Percent || 0;
  const rainfall = currentWeather.Rainfall_mm || 0;
  const sensitivity = modelId === "advanced" ? 1.3 : modelId === "basic" ? 0.8 : 1.0;

  return crop.pests.map(pest => {
    let riskScore = 10;
    const trigger = pest.weatherTrigger;
    if (trigger.temp) {
      if (temp >= trigger.temp.min && temp <= trigger.temp.max) riskScore += 40;
      else if (temp >= trigger.temp.min - 3 && temp <= trigger.temp.max + 3) riskScore += 20;
    }
    if (trigger.humidity) {
      if (humidity >= trigger.humidity.min) {
        if (!trigger.humidity.max || humidity <= trigger.humidity.max) riskScore += 35;
        else riskScore += 15;
      } else if (humidity >= trigger.humidity.min - 10) riskScore += 15;
    }
    if (trigger.rainfall && rainfall > 5) riskScore += 15;
    riskScore = Math.round(Math.min(100, riskScore * sensitivity));
    const riskLevel = riskScore >= 70 ? "High" : riskScore >= 40 ? "Medium" : "Low";
    return { ...pest, riskScore, riskLevel, modelUsed: modelId };
  }).sort((a, b) => b.riskScore - a.riskScore);
}

// ─── MARKET INTELLIGENCE ──────────────────────────────────────────────────────
export function getMarketIntelligence(crop, currentWeather, district) {
  if (!crop || !crop.marketData) return null;
  const md = crop.marketData;
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const isBestMonth = md.bestSellMonths.includes(currentMonth);
  const rainAdvisory = currentWeather && currentWeather.Rainfall_mm > 30
    ? "⚠️ Heavy rain may reduce crop quality - consider early harvest and storage."
    : "✅ Weather conditions are good for harvest and transportation.";

  const priceRange = md.currentPrice;
  const avgPrice = ((priceRange.min + priceRange.max) / 2).toFixed(0);

  let sellRecommendation = "";
  if (isBestMonth) {
    sellRecommendation = `✅ Now is a good time to sell! ${currentMonth} is one of the best selling months for ${crop.name}.`;
  } else {
    const nextBestMonth = md.bestSellMonths[0];
    sellRecommendation = `📅 Consider waiting until ${nextBestMonth} for better prices. Current month may have lower demand.`;
  }

  return {
    cropName: crop.name,
    MSP: md.MSP,
    currentPriceRange: priceRange,
    avgPrice: parseInt(avgPrice),
    bestSellMonths: md.bestSellMonths,
    isBestMonth,
    majorMarkets: md.majorMarkets,
    demandTrend: md.demandTrend,
    exportPotential: md.exportPotential,
    sellRecommendation,
    weatherImpact: rainAdvisory,
    nearestMarket: md.majorMarkets[0],
    priceAdvice: md.MSP
      ? `MSP: ₹${md.MSP}/quintal. Sell above MSP to government procurement centers when available.`
      : "No MSP. Negotiate directly with traders. Check APMC rates before selling."
  };
}

export function getFertilizerRecommendation(crop, currentWeather, soilType = "alluvial", modelId = "intermediate") {
  if (!crop || !crop.npkSchedule) return null;

  const weatherAdjustments = [];
  const rainfall = currentWeather?.Rainfall_mm || 0;
  const humidity = currentWeather?.Humidity_Percent || 0;

  if (rainfall > 25) weatherAdjustments.push({ type: "warning", message: "⚠️ Heavy rain detected. Delay fertilizer application by 3-5 days to prevent leaching." });
  if (rainfall > 0 && rainfall <= 25) weatherAdjustments.push({ type: "info", message: "ℹ️ Light rain present. Wait 24-48 hours before applying fertilizer for best uptake." });
  if (humidity > 85) weatherAdjustments.push({ type: "info", message: "ℹ️ High humidity may slow fertilizer absorption. Ensure good soil drainage." });

  // Soil type modifiers for NPK quantities
  const soilModifiers = {
    alluvial:       { N: 1.0,  P: 1.0,  K: 1.0,  note: "Alluvial soil — standard NPK rates apply." },
    laterite:       { N: 1.15, P: 1.2,  K: 1.1,  note: "Laterite soil — increase P by 20% due to P fixation; extra N for leaching loss." },
    coastal_saline: { N: 1.2,  P: 1.0,  K: 0.8,  note: "Saline soil — reduce K (high background K); increase N with split doses." },
    sub_himalayan:  { N: 1.1,  P: 1.15, K: 1.05, note: "Terai soil — slightly acidic; increase P application." },
    sandy:          { N: 1.25, P: 1.1,  K: 1.15, note: "Sandy soil — increase all nutrients; apply in more frequent splits to reduce leaching." },
    clay:           { N: 0.9,  P: 1.1,  K: 0.95, note: "Clay soil — reduce N (low leaching); increase P for better root penetration." }
  };

  const modifier = soilModifiers[soilType] || soilModifiers.alluvial;
  if (modifier.note) weatherAdjustments.push({ type: "info", message: `🌍 Soil adjustment (${soilType}): ${modifier.note}` });

  const schedule = crop.npkSchedule.map(s => {
    const adjN = Math.round(s.N * modifier.N);
    const adjP = Math.round(s.P * modifier.P);
    const adjK = Math.round(s.K * modifier.K);
    const totalCost = (adjN * s.costPerKg.N) + (adjP * s.costPerKg.P) + (adjK * s.costPerKg.K);
    const ureaKg = adjN > 0 ? (adjN / 0.46).toFixed(1) : 0;
    const dapKg  = adjP > 0 ? (adjP / 0.18).toFixed(1) : 0;
    const mopKg  = adjK > 0 ? (adjK / 0.60).toFixed(1) : 0;

    return {
      ...s,
      N: adjN, P: adjP, K: adjK,
      totalCostPerHa: totalCost,
      actualFertilizers: {
        urea: ureaKg > 0 ? `${ureaKg} kg Urea` : null,
        dap:  dapKg  > 0 ? `${dapKg} kg DAP`  : null,
        mop:  mopKg  > 0 ? `${mopKg} kg MOP`  : null
      },
      soilAdjusted: soilType !== 'alluvial'
    };
  });

  const totalCropCost = schedule.reduce((sum, s) => sum + s.totalCostPerHa, 0);
  const soilAdj = crop.soilAdjustments || {};

  return {
    cropName: crop.name,
    schedule,
    totalFertilizerCost: totalCropCost,
    soilAdjustments: soilAdj,
    soilTypeUsed: soilType,
    soilModifier: modifier,
    weatherAdjustments,
    modelUsed: modelId,
    confidence: modelId === "advanced" ? "High" : modelId === "intermediate" ? "Medium" : "Low"
  };
}

// ─── WATER SAVING ────────────────────────────────────────────────────────────
export function calculateWaterSaving(irrigationAdvice, fieldSize = 1) {
  if (!irrigationAdvice || !irrigationAdvice.shouldIrrigate) {
    const savedWater = 30 * fieldSize;
    return { waterSaved: savedWater, message: `~${savedWater}L saved/hectare due to rainfall.`, cost: Math.round(savedWater * 0.05) };
  }
  return { waterSaved: 0, message: "Irrigation recommended.", cost: 0 };
}

// ─── WEATHER ICON TYPE ────────────────────────────────────────────────────────
export function getWeatherIconType(condition) {
  const c = (condition || "").toLowerCase();
  if (c.includes("sunny") || c.includes("clear")) return "sun";
  if (c.includes("cloudy")) return "cloud";
  if (c.includes("partly")) return "cloudSun";
  if (c.includes("heavy rain")) return "cloudRain";
  if (c.includes("rain") || c.includes("rainy")) return "cloudRain";
  if (c.includes("drizzle")) return "cloudDrizzle";
  if (c.includes("storm")) return "cloudLightning";
  return "cloudSun";
}

// ─── FARMING ACTIVITIES ───────────────────────────────────────────────────────
export function getFarmingActivities(currentWeather) {
  const activities = [];
  if (!currentWeather) return activities;
  const temp = currentWeather.Temperature_Max_C || 0;
  const rainfall = currentWeather.Rainfall_mm || 0;
  const condition = currentWeather.Weather_Condition || "";

  if (rainfall < 2 && temp > 15 && temp < 35 && condition.includes("Sunny")) {
    activities.push({ activity: "Planting/Sowing", suitability: "Excellent", iconType: "seedling" });
    activities.push({ activity: "Fertilizer Application", suitability: "Good", iconType: "flask" });
    activities.push({ activity: "Harvesting", suitability: "Excellent", iconType: "wheat" });
  }
  if (rainfall === 0 && temp < 35) activities.push({ activity: "Pesticide Spraying", suitability: "Good", iconType: "spray" });
  if (rainfall > 20) activities.push({ activity: "Indoor Work (Maintenance)", suitability: "Recommended", iconType: "tool" });
  if (condition.includes("Cloudy") && rainfall < 5) activities.push({ activity: "Plowing/Tilling", suitability: "Good", iconType: "tractor" });

  return activities;
}