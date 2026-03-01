// ─── Recommendation Engine ────────────────────────────────────────────────────
import { crops } from './cropDatabase';

// ─── CROP RECOMMENDATIONS ─────────────────────────────────────────────────────
export function getCropRecommendations(currentWeather, currentSeason, modelId = "intermediate") {
  if (!currentWeather) return { suitable: [], caution: [], notRecommended: [] };
  const temp     = currentWeather.Temperature_Max_C || 0;
  const humidity = currentWeather.Humidity_Percent  || 0;
  const suitable = [], caution = [], notRecommended = [];

  Object.values(crops).forEach(crop => {
    const { idealTemp, idealHumidity, season } = crop;
    const seasonMatch      = season.includes(currentSeason);
    const tempSuitable     = temp >= idealTemp.min && temp <= idealTemp.max;
    const tempMargin       = temp >= idealTemp.min - 3 && temp <= idealTemp.max + 3;
    const humiditySuitable = humidity >= idealHumidity.min && humidity <= idealHumidity.max;
    const humidityMargin   = humidity >= idealHumidity.min - 10 && humidity <= idealHumidity.max + 10;

    if (seasonMatch && tempSuitable && humiditySuitable) {
      suitable.push({ ...crop, reason: `Perfect conditions — Temp ${temp}°C and humidity ${humidity}% are ideal.`, confidence: "high" });
    } else if (seasonMatch && tempMargin && humidityMargin) {
      const issues = [];
      if (!tempSuitable) issues.push(`Temp ${temp}°C slightly off (ideal: ${idealTemp.min}-${idealTemp.max}°C)`);
      if (!humiditySuitable) issues.push(`Humidity ${humidity}% slightly off (ideal: ${idealHumidity.min}-${idealHumidity.max}%)`);
      caution.push({ ...crop, reason: `Acceptable with care: ${issues.join('; ')}.`, confidence: "medium" });
    } else {
      const reason = !seasonMatch
        ? `Not suitable for ${currentSeason} season. Best in: ${season.join(', ')}.`
        : !tempMargin
          ? `Temperature ${temp}°C is outside range (${idealTemp.min}-${idealTemp.max}°C).`
          : `Humidity ${humidity}% is outside ideal range (${idealHumidity.min}-${idealHumidity.max}%).`;
      notRecommended.push({ ...crop, reason, confidence: "low" });
    }
  });

  return { suitable, caution, notRecommended };
}

// ─── DISEASE RISK PREDICTION ──────────────────────────────────────────────────
export function predictDiseaseRisks(currentWeather, crop, modelId = "intermediate") {
  if (!currentWeather || !crop || !crop.diseases) return [];
  const temp     = currentWeather.Temperature_Max_C || 0;
  const humidity = currentWeather.Humidity_Percent  || 0;
  const rainfall = currentWeather.Rainfall_mm       || 0;
  const diseaseRisks = [];

  crop.diseases.forEach(disease => {
    const { riskConditions } = disease;
    let riskLevel = 0;
    const reasons = [];

    if (riskConditions.temperature) {
      const { min = 0, max = 100 } = riskConditions.temperature;
      if (temp >= min && temp <= max) { riskLevel += 30; reasons.push(`Temp ${temp}°C is in disease-favorable range (${min}-${max}°C)`); }
    }
    if (riskConditions.humidity && humidity >= riskConditions.humidity.min) {
      riskLevel += 40;
      reasons.push(`Humidity ${humidity}% favors disease spread`);
    }
    if (riskConditions.rainfall) {
      const rc = riskConditions.rainfall.toLowerCase();
      if (rc.includes('heavy') && rainfall > 50)        { riskLevel += 30; reasons.push(`Heavy rain ${rainfall}mm increases risk`); }
      else if (rc.includes('moderate') && rainfall > 20){ riskLevel += 25; reasons.push(`Moderate rain ${rainfall}mm favors infection`); }
      else if (rc.includes('continuous') && rainfall > 10){ riskLevel += 20; reasons.push(`Continuous rainfall extends leaf wetness`); }
    }
    if (modelId === "advanced" && riskLevel > 0) riskLevel = Math.min(100, riskLevel * 1.2);

    const riskCategory = riskLevel >= 70 ? 'high' : riskLevel >= 40 ? 'medium' : 'low';
    if (riskLevel >= 25) {
      diseaseRisks.push({ ...disease, riskLevel: riskCategory, riskScore: riskLevel, reasons, currentConditions: { temp, humidity, rainfall } });
    }
  });

  return diseaseRisks.sort((a, b) => b.riskScore - a.riskScore);
}

// ─── PREVENTIVE MEASURES ──────────────────────────────────────────────────────
export function getPreventiveMeasures(diseaseRisks) {
  if (!diseaseRisks || !diseaseRisks.length) {
    return { urgent: [], recommended: [], general: ["Monitor crops regularly", "Maintain field hygiene", "Ensure adequate plant spacing"] };
  }
  const urgent = [], recommended = [];
  diseaseRisks.forEach(disease => {
    disease.prevention.forEach(measure => {
      if (disease.riskLevel === 'high' && disease.severity === 'high')        urgent.push({ measure, disease: disease.name, priority: 'urgent' });
      else if (disease.riskLevel === 'high' || disease.riskLevel === 'medium') recommended.push({ measure, disease: disease.name, priority: 'recommended' });
    });
  });
  const uniqueUrgent      = [...new Map(urgent.map(m => [m.measure, m])).values()];
  const urgentMeasures    = new Set(uniqueUrgent.map(m => m.measure));
  const uniqueRecommended = [...new Map(recommended.filter(m => !urgentMeasures.has(m.measure)).map(m => [m.measure, m])).values()];
  return {
    urgent: uniqueUrgent,
    recommended: uniqueRecommended,
    general: ["Inspect crops for early symptoms", "Remove infected plant parts immediately", "Practice crop rotation"]
  };
}

// ─── FARM HEALTH SCORE ───────────────────────────────────────────────────────
export function calculateFarmHealthScore(currentWeather, crop, diseaseRisks, modelId = "intermediate") {
  if (!currentWeather || !crop) return { score: 50, status: 'Fair', color: 'yellow' };
  let score = 100;
  const temp     = currentWeather.Temperature_Max_C || 0;
  const humidity = currentWeather.Humidity_Percent  || 0;
  const rainfall = currentWeather.Rainfall_mm       || 0;

  if (temp < crop.idealTemp.min - 5 || temp > crop.idealTemp.max + 5)    score -= 20;
  else if (temp < crop.idealTemp.min || temp > crop.idealTemp.max)        score -= 10;

  if (humidity < crop.idealHumidity.min - 15 || humidity > crop.idealHumidity.max + 15) score -= 15;
  else if (humidity < crop.idealHumidity.min || humidity > crop.idealHumidity.max)       score -= 8;

  if (rainfall > 100)                                     score -= 15;
  else if (rainfall === 0 && humidity < 50 && temp > 35) score -= 10;

  if (diseaseRisks) {
    score -= diseaseRisks.filter(d => d.riskLevel === 'high').length   * 15;
    score -= diseaseRisks.filter(d => d.riskLevel === 'medium').length * 8;
  }

  score = Math.max(0, Math.min(100, score));
  return {
    score: Math.round(score),
    status: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor',
    color:  score >= 80 ? 'green'     : score >= 60 ? 'blue' : score >= 40 ? 'yellow' : 'red'
  };
}

// ─── YIELD ESTIMATION ────────────────────────────────────────────────────────
export function calculateYieldEstimation(crop, currentWeather, diseaseRisks, fieldSize, fieldUnit, marketIntel) {
  if (!crop || !currentWeather) return null;

  // Convert field size to hectares
  let hectares = parseFloat(fieldSize) || 1;
  if (fieldUnit === 'bigha')  hectares = hectares * 0.1338;  // 1 bigha (WB) = 0.1338 ha
  if (fieldUnit === 'acre')   hectares = hectares * 0.4047;
  if (fieldUnit === 'katha')  hectares = hectares * 0.00669; // 1 katha (WB) = 0.00669 ha

  const baseYield = crop.yieldPerHectare || 3; // tonnes per hectare

  // Weather adjustment factor
  const temp     = currentWeather.Temperature_Max_C || 0;
  const humidity = currentWeather.Humidity_Percent  || 0;
  const rainfall = currentWeather.Rainfall_mm       || 0;

  let weatherFactor = 1.0;
  if (temp >= crop.idealTemp.min && temp <= crop.idealTemp.max) weatherFactor += 0.1;
  else if (temp < crop.idealTemp.min - 5 || temp > crop.idealTemp.max + 5) weatherFactor -= 0.2;
  else weatherFactor -= 0.05;

  if (humidity >= crop.idealHumidity.min && humidity <= crop.idealHumidity.max) weatherFactor += 0.05;
  else weatherFactor -= 0.05;

  if (rainfall > 100) weatherFactor -= 0.15;

  // Disease factor
  let diseaseFactor = 1.0;
  if (diseaseRisks) {
    diseaseFactor -= diseaseRisks.filter(d => d.riskLevel === 'high').length   * 0.12;
    diseaseFactor -= diseaseRisks.filter(d => d.riskLevel === 'medium').length * 0.06;
  }

  const totalFactor    = Math.max(0.3, Math.min(1.5, weatherFactor * diseaseFactor));
  const estimatedYield = (baseYield * hectares * totalFactor).toFixed(2); // total tonnes
  const pricePerTonne  = marketIntel ? (marketIntel.avgPrice * 10) : (baseYield * 10000); // ₹/tonne from ₹/quintal
  const revenueEstimate = (estimatedYield * pricePerTonne).toFixed(0);

  // Convert hectares back to original unit label
  const areaLabel = fieldUnit === 'bigha'
    ? `${fieldSize} bigha`
    : fieldUnit === 'acre'
      ? `${fieldSize} acre`
      : fieldUnit === 'katha'
        ? `${fieldSize} katha`
        : `${fieldSize} hectare`;

  return {
    fieldSize: parseFloat(fieldSize),
    fieldUnit,
    areaLabel,
    hectares: +hectares.toFixed(3),
    baseYield,
    weatherFactor: +(weatherFactor * 100).toFixed(0),
    diseaseFactor: +(diseaseFactor * 100).toFixed(0),
    totalFactor:   +(totalFactor   * 100).toFixed(0),
    estimatedYield: parseFloat(estimatedYield),
    pricePerTonne:  Math.round(pricePerTonne),
    revenueEstimate: parseInt(revenueEstimate),
    yieldUnit: 'tonnes',
    confidenceNote: totalFactor >= 1.0 ? 'Favourable conditions — good yield expected' : totalFactor >= 0.75 ? 'Moderate conditions — average yield expected' : 'Unfavourable conditions — below-average yield expected'
  };
}

// ─── SUSTAINABILITY TIPS ──────────────────────────────────────────────────────
export function getSustainabilityTips(currentWeather, irrigationAdvice) {
  const tips = [];
  if (!currentWeather) return tips;
  const rainfall = currentWeather.Rainfall_mm       || 0;
  const temp     = currentWeather.Temperature_Max_C || 0;

  if (rainfall > 20)                     tips.push({ category: "Water Conservation", tip: "Collect rainwater for future irrigation. Install rainwater harvesting systems.",              iconType: "droplet" });
  if (!irrigationAdvice?.shouldIrrigate) tips.push({ category: "Water Conservation", tip: "Water saved today! Natural rainfall is meeting crop needs.",                                  iconType: "checkCircle" });
  if (temp > 30)                         tips.push({ category: "Water Conservation", tip: "Irrigate during early morning (5-7 AM) or late evening to minimize evaporation losses.",      iconType: "clock" });
  tips.push({ category: "Organic Farming", tip: "Use neem-based pesticides instead of chemical alternatives for sustainable pest management.", iconType: "leaf" });
  tips.push({ category: "Soil Health",     tip: "Apply compost or vermicompost to improve soil organic matter and water retention.",           iconType: "recycle" });
  tips.push({ category: "Energy",          tip: "Consider solar-powered irrigation pumps to reduce electricity costs and carbon footprint.",   iconType: "sun" });

  return tips;
}