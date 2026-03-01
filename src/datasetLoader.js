// ─── Dataset Loader — Real Weather API + CSV Fallback ─────────────────────────
// Primary: Open-Meteo (free, no API key, real-time)
// Fallback: CSV historical data

import { findDistrictInfo, getCurrentSeason } from './cropDatabase';

// WMO weather code → readable condition
function wmoToCondition(code) {
  if (code === 0) return "Sunny";
  if (code <= 2) return "Partly Cloudy";
  if (code <= 3) return "Cloudy";
  if (code <= 49) return "Foggy";
  if (code <= 55) return "Drizzle";
  if (code <= 65) return "Rainy";
  if (code <= 77) return "Heavy Rain";
  if (code <= 82) return "Heavy Rain";
  if (code <= 99) return "Thunderstorm";
  return "Partly Cloudy";
}

// ─── REAL WEATHER from Open-Meteo ─────────────────────────────────────────────
export async function fetchRealWeather(district, stateName = '') {
  const districtInfo = findDistrictInfo(stateName, district);
  if (!districtInfo) return null;

  const { lat, lon } = districtInfo;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=Asia/Kolkata&forecast_days=7`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo API error: ${res.status}`);
  const data = await res.json();

  const currentWeather = {
    District: district,
    Date: new Date().toISOString().split('T')[0],
    Temperature_Max_C: parseFloat(data.daily.temperature_2m_max[0].toFixed(1)),
    Temperature_Min_C: parseFloat(data.daily.temperature_2m_min[0].toFixed(1)),
    Temperature_Avg_C: parseFloat(((data.daily.temperature_2m_max[0] + data.daily.temperature_2m_min[0]) / 2).toFixed(1)),
    Humidity_Percent: data.current.relative_humidity_2m,
    Rainfall_mm: parseFloat(data.current.precipitation.toFixed(1)),
    Wind_Speed_kmh: parseFloat(data.current.wind_speed_10m.toFixed(1)),
    Weather_Condition: wmoToCondition(data.current.weather_code),
    Season: getCurrentSeason(),
    isRealTime: true,
    fetchedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  };

  // Build 7-day forecast
  const forecast = data.daily.temperature_2m_max.map((maxTemp, i) => ({
    District: district,
    Date: data.daily.time[i],
    Temperature_Max_C: parseFloat(maxTemp.toFixed(1)),
    Temperature_Min_C: parseFloat(data.daily.temperature_2m_min[i].toFixed(1)),
    Temperature_Avg_C: parseFloat(((maxTemp + data.daily.temperature_2m_min[i]) / 2).toFixed(1)),
    Humidity_Percent: currentWeather.Humidity_Percent, // API doesn't give daily humidity in free tier
    Rainfall_mm: parseFloat(data.daily.precipitation_sum[i].toFixed(1)),
    Wind_Speed_kmh: currentWeather.Wind_Speed_kmh,
    Weather_Condition: wmoToCondition(data.daily.weather_code[i]),
    Season: getCurrentSeason()
  }));

  return { currentWeather, forecast };
}

// ─── LOAD CSV DATASET (fallback / historical context) ──────────────────────────
export async function loadWeatherDataset() {
  try {
    const response = await fetch('/west_bengal_weather_clean.csv');
    if (!response.ok) throw new Error(`Failed to load dataset: ${response.status}`);
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.warn('CSV load failed, will use real-time API only:', error);
    return [];
  }
}

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  const numericFields = new Set(['Latitude','Longitude','Temperature_Max_C','Temperature_Min_C','Temperature_Avg_C','Humidity_Percent','Rainfall_mm','Wind_Speed_kmh']);
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length !== headers.length) continue;
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = numericFields.has(h) ? (parseFloat(values[idx]) || 0) : values[idx];
    });
    data.push(row);
  }
  return data;
}

// ─── GET CURRENT WEATHER — tries real API first, falls back to CSV ─────────────
export async function getCurrentWeatherForDistrict(dataset, district, stateName = '') {
  try {
    const result = await fetchRealWeather(district, stateName);
    if (result) return result.currentWeather;
  } catch (e) {
    console.warn('Real-time weather fetch failed, using CSV data:', e.message);
  }

  // CSV fallback
  if (!dataset || !district) return null;
  const districtData = dataset.filter(e => e.District === district);
  if (!districtData.length) return null;
  const sorted = [...districtData].sort((a, b) => new Date(b.Date) - new Date(a.Date));
  return { ...sorted[0], isRealTime: false, fetchedAt: null };
}

// ─── GET FORECAST — tries real API first, falls back to CSV ───────────────────
export async function getWeatherForecastForDistrict(dataset, district, days = 7, stateName = '') {
  try {
    const result = await fetchRealWeather(district, stateName);
    if (result) return result.forecast.slice(0, days);
  } catch (e) {
    console.warn('Forecast fetch failed, using CSV data:', e.message);
  }

  // CSV fallback — historical slice (clearly labeled)
  if (!dataset || !district) return [];
  const districtData = dataset.filter(e => e.District === district);
  if (!districtData.length) return [];
  const sorted = [...districtData].sort((a, b) => new Date(b.Date) - new Date(a.Date));
  return sorted.slice(0, days).map(d => ({ ...d, isHistorical: true }));
}

// ─── ENHANCED PREDICTION UTILITIES (uses 5yr CSV as baseline) ────────────────

/**
 * getMonthlyClimateNormals — per-month multi-year averages for a district.
 * Used to detect anomalies and give "better than average / worse than average" predictions.
 */
export function getMonthlyClimateNormals(dataset, district) {
  if (!dataset || !district) return {};
  const rows = dataset.filter(d => d.District === district);
  const normals = {};
  for (let m = 1; m <= 12; m++) {
    const mStr = String(m).padStart(2, '0');
    const mRows = rows.filter(d => d.Date && d.Date.slice(5, 7) === mStr);
    if (!mRows.length) continue;
    const avg = arr => arr.reduce((s, n) => s + n, 0) / arr.length;
    normals[m] = {
      avgTempMax:  +avg(mRows.map(d => d.Temperature_Max_C)).toFixed(1),
      avgTempMin:  +avg(mRows.map(d => d.Temperature_Min_C)).toFixed(1),
      avgTempAvg:  +avg(mRows.map(d => d.Temperature_Avg_C || 0)).toFixed(1),
      avgHumidity: +avg(mRows.map(d => d.Humidity_Percent)).toFixed(1),
      avgRainfall: +avg(mRows.map(d => d.Rainfall_mm)).toFixed(1),
      avgWind:     +avg(mRows.map(d => d.Wind_Speed_kmh)).toFixed(1),
      rainyDaysPct: +(mRows.filter(d => d.Rainfall_mm > 1).length / mRows.length * 100).toFixed(0),
      years:       [...new Set(mRows.map(d => d.Date.slice(0, 4)))].length,
      sampleDays:  mRows.length,
    };
  }
  return normals;
}

/**
 * getSeasonalRainfallTrend — total rainfall per month for the district,
 * useful for showing if this season is wetter/drier than historical.
 */
export function getSeasonalRainfallTrend(dataset, district) {
  if (!dataset || !district) return [];
  const rows    = dataset.filter(d => d.District === district);
  const months  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months.map((name, i) => {
    const mStr  = String(i + 1).padStart(2, '0');
    const mRows = rows.filter(d => d.Date && d.Date.slice(5, 7) === mStr);
    const avg   = arr => arr.length ? arr.reduce((s, n) => s + n, 0) / arr.length : 0;
    return {
      month: name,
      avgRainfall: +avg(mRows.map(d => d.Rainfall_mm)).toFixed(1),
      avgTempMax:  +avg(mRows.map(d => d.Temperature_Max_C)).toFixed(1),
      avgHumidity: +avg(mRows.map(d => d.Humidity_Percent)).toFixed(1),
      rainyDaysPct: mRows.length ? +(mRows.filter(d => d.Rainfall_mm > 1).length / mRows.length * 100).toFixed(0) : 0,
    };
  });
}

/**
 * getExtremeWeatherHistory — count of extreme events per district from CSV.
 * Used to calibrate risk predictions (heat stress days, flood days, etc).
 */
export function getExtremeWeatherHistory(dataset, district) {
  if (!dataset || !district) return null;
  const rows = dataset.filter(d => d.District === district);
  if (!rows.length) return null;
  return {
    heatDays:     rows.filter(d => d.Temperature_Max_C >= 38).length,
    coldDays:     rows.filter(d => d.Temperature_Min_C <= 10).length,
    heavyRainDays:rows.filter(d => d.Rainfall_mm >= 20).length,
    droughtDays:  rows.filter(d => d.Rainfall_mm === 0 && d.Temperature_Max_C >= 35).length,
    highHumDays:  rows.filter(d => d.Humidity_Percent >= 90).length,
    totalDays:    rows.length,
    // percentages
    heatRisk:     +(rows.filter(d => d.Temperature_Max_C >= 38).length / rows.length * 100).toFixed(1),
    floodRisk:    +(rows.filter(d => d.Rainfall_mm >= 20).length / rows.length * 100).toFixed(1),
    humidityRisk: +(rows.filter(d => d.Humidity_Percent >= 90).length / rows.length * 100).toFixed(1),
  };
}

/**
 * predictNextWeekConditions — uses same-week historical data across years
 * to generate a probability-weighted "expected" next-week outlook.
 * More honest than fake ML — clearly labeled as historical probability.
 */
export function predictNextWeekConditions(dataset, district) {
  if (!dataset || !district) return null;
  const today   = new Date();
  const month   = today.getMonth() + 1;
  const day     = today.getDate();
  const mStr    = String(month).padStart(2, '0');

  // Get ±7 days window across all years for this district
  const rows = dataset.filter(d => {
    if (d.District !== district || !d.Date) return false;
    const dMonth = parseInt(d.Date.slice(5, 7));
    const dDay   = parseInt(d.Date.slice(8, 10));
    return dMonth === month && Math.abs(dDay - day) <= 7;
  });
  if (rows.length < 5) return null;

  const avg = arr => arr.reduce((s, n) => s + n, 0) / arr.length;
  const conditionCounts = {};
  rows.forEach(d => { conditionCounts[d.Weather_Condition] = (conditionCounts[d.Weather_Condition] || 0) + 1; });
  const likelyCondition = Object.entries(conditionCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const rainyProb = +(rows.filter(d => d.Rainfall_mm > 1).length / rows.length * 100).toFixed(0);

  return {
    expectedTempMax:  +avg(rows.map(d => d.Temperature_Max_C)).toFixed(1),
    expectedTempMin:  +avg(rows.map(d => d.Temperature_Min_C)).toFixed(1),
    expectedHumidity: +avg(rows.map(d => d.Humidity_Percent)).toFixed(1),
    expectedRainfall: +avg(rows.map(d => d.Rainfall_mm)).toFixed(1),
    likelyCondition,
    rainyDayProbability: rainyProb,
    basedOnYears:     [...new Set(rows.map(d => d.Date.slice(0, 4)))].length,
    sampleDays:       rows.length,
    note:             `Based on ${rows.length} historical records (${[...new Set(rows.map(d => d.Date.slice(0, 4)))].length} years) for this week in ${district}`,
  };
}

export function getCurrentWeather(dataset, district) {
  const districtData = (dataset || []).filter(e => e.District === district);
  if (!districtData.length) return null;
  const sorted = [...districtData].sort((a, b) => new Date(b.Date) - new Date(a.Date));
  return sorted[0];
}

export function getWeatherForecast(dataset, district, days = 7) {
  const districtData = (dataset || []).filter(e => e.District === district);
  if (!districtData.length) return [];
  const sorted = [...districtData].sort((a, b) => new Date(b.Date) - new Date(a.Date));
  return sorted.slice(0, days);
}

export function getAvailableDistricts(dataset) {
  if (!dataset) return [];
  return [...new Set(dataset.map(e => e.District))].sort();
}

export function getDateRange(dataset) {
  if (!dataset || !dataset.length) return { start: null, end: null };
  const dates = dataset.map(e => new Date(e.Date));
  return {
    start: new Date(Math.min(...dates)).toISOString().split('T')[0],
    end:   new Date(Math.max(...dates)).toISOString().split('T')[0]
  };
}

export function getWeatherStats(dataset, district, startDate = null, endDate = null) {
  if (!dataset || !district) return null;
  let data = dataset.filter(e => e.District === district);
  if (startDate) data = data.filter(e => new Date(e.Date) >= new Date(startDate));
  if (endDate)   data = data.filter(e => new Date(e.Date) <= new Date(endDate));
  if (!data.length) return null;
  const avg = arr => arr.reduce((s, n) => s + n, 0) / arr.length;
  return {
    count: data.length,
    avgTempMax:    +avg(data.map(d => d.Temperature_Max_C)).toFixed(1),
    avgTempMin:    +avg(data.map(d => d.Temperature_Min_C)).toFixed(1),
    avgHumidity:   +avg(data.map(d => d.Humidity_Percent)).toFixed(1),
    totalRainfall: +data.reduce((s, d) => s + d.Rainfall_mm, 0).toFixed(1),
    avgWindSpeed:  +avg(data.map(d => d.Wind_Speed_kmh)).toFixed(1),
    maxTemp:       Math.max(...data.map(d => d.Temperature_Max_C)),
    minTemp:       Math.min(...data.map(d => d.Temperature_Min_C))
  };
}