import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area
} from 'recharts';

// Weather icons (react-icons/wi)
import {
  WiDaySunny, WiCloud, WiCloudy, WiRain, WiThunderstorm, WiDayRainMix,
  WiDayCloudy, WiHumidity, WiStrongWind, WiRaindrop
} from 'react-icons/wi';

// FontAwesome v4 — guaranteed available
import {
  FaThermometerHalf, FaTint, FaWind, FaCloudRain, FaSeedling,
  FaExclamationTriangle, FaCheckCircle, FaFire, FaSnowflake, FaSun,
  FaCloudSun, FaCloudShowersHeavy, FaLeaf, FaRecycle, FaClock,
  FaFlask, FaChartLine, FaMapMarkerAlt, FaBug, FaShoppingCart,
  FaFileAlt, FaTools, FaTractor, FaWater, FaRupeeSign,
  FaCalendarAlt, FaBroadcastTower, FaSync, FaWhatsapp,
  FaThermometerEmpty, FaChevronDown, FaGlobeAsia, FaChartBar
} from 'react-icons/fa';

// Bootstrap Icons — wide availability, great for data dashboards
import {
  BsThermometerHigh, BsDropletFill,
  BsCloudRainHeavyFill, BsSpeedometer2,
  BsGraphUpArrow, BsCalendar2CheckFill,
  BsGeoAltFill, BsArrowRepeat, BsTranslate,
  BsCloudSunFill,
  BsCheck2Circle, BsActivity
} from 'react-icons/bs';

// Material Design — reliable, commonly installed
import { MdWarning, MdDashboard, MdLanguage, MdWaterDrop, MdSpeed } from 'react-icons/md';

// Game Icons — farm/agriculture specific
import { GiWheat, GiWateringCan, GiFarmTractor } from 'react-icons/gi';
const GiSoilLayers = FaLeaf; // GiSoilLayers not in this version

// Safe aliases — map missing package icons to available equivalents
const HiOutlineBeaker             = FaFlask;
const HiOutlineBug                = FaBug;
const HiOutlineChartBarSquare     = FaChartBar;
const HiOutlineDocumentChartBar   = FaFileAlt;
const HiOutlineShoppingBag        = FaShoppingCart;
const HiOutlineWrenchScrewdriver  = FaTools;
const LuActivity                  = BsActivity;

import {
  loadWeatherDataset,
  getCurrentWeatherForDistrict,
  getWeatherForecastForDistrict
} from './datasetLoader';
import { crops, getAllStates, getDistrictsByState, getCurrentSeason, soilTypes, getSuggestedSoilTypes } from './cropDatabase';
import {
  MODELS,
  getIrrigationAdvice,
  getIrrigationStageAdvice,
  getRiskAlerts,
  getWeatherAdvisory,
  getPestRiskAlerts,
  getMarketIntelligence,
  getFertilizerRecommendation,
  getWeatherIconType
} from './weatherService';
import {
  getCropRecommendations,
  predictDiseaseRisks,
  getPreventiveMeasures,
  calculateFarmHealthScore,
  getSustainabilityTips,
  calculateYieldEstimation
} from './recommendationEngine';

// ─── 10 INDIAN LANGUAGES ──────────────────────────────────────────────────────
const LANG_META = [
  { code: 'en', label: 'English',   native: 'English',   script: 'Latin',     region: 'National' },
  { code: 'bn', label: 'Bengali',   native: 'বাংলা',      script: 'Bengali',   region: 'West Bengal' },
  { code: 'hi', label: 'Hindi',     native: 'हिन्दी',      script: 'Devanagari',region: 'North India' },
  { code: 'te', label: 'Telugu',    native: 'తెలుగు',     script: 'Telugu',    region: 'Andhra / Telangana' },
  { code: 'mr', label: 'Marathi',   native: 'मराठी',      script: 'Devanagari',region: 'Maharashtra' },
  { code: 'ta', label: 'Tamil',     native: 'தமிழ்',      script: 'Tamil',     region: 'Tamil Nadu' },
  { code: 'gu', label: 'Gujarati',  native: 'ગુજરાતી',   script: 'Gujarati',  region: 'Gujarat' },
  { code: 'kn', label: 'Kannada',   native: 'ಕನ್ನಡ',     script: 'Kannada',   region: 'Karnataka' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം',    script: 'Malayalam', region: 'Kerala' },
  { code: 'pa', label: 'Punjabi',   native: 'ਪੰਜਾਬੀ',    script: 'Gurmukhi',  region: 'Punjab' },
  { code: 'or', label: 'Odia',      native: 'ଓଡ଼ିଆ',      script: 'Odia',      region: 'Odisha' },
];

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  en: {
    title: "Weather Prediction for Sustainable E-Agriculture",
    subtitle: "Smart Agriculture Weather Intelligence System",
    selectDistrict: "Select District", selectCrop: "Select Crop",
    selectSoil: "Select Soil Type", fieldSize: "Field Size",
    sowingDate: "Sowing Date", overview: "Overview", fertilizer: "Fertilizer",
    pest: "Pest & Disease", irrigation: "Irrigation", advisory: "Weather Advisory",
    market: "Market", report: "Full Report", yieldCalc: "Yield Calculator",
    loading: "Loading weather data...", realtime: "Live Weather",
    historical: "Historical Data", daysAfterSowing: "Days After Sowing",
    farmHealth: "Farm Health Score", noDistrict: "Select a district to begin",
    noCrop: "Select a crop to unlock full analysis",
    highlysuitable: "Highly Suitable", withCaution: "With Caution",
    notRecommended: "Not Recommended", irrigateNow: "Irrigation Recommended",
    noIrrigate: "No Irrigation Needed Today", currentWeather: "Current Weather",
    forecast: "7-Day Forecast", currentStage: "Current Growth Stage",
    irrigationSchedule: "Irrigation Schedule", season: "Season",
    humidity: "Humidity", rainfall: "Rainfall", windSpeed: "Wind",
    maxTemp: "Max Temp", minTemp: "Min", avgTemp: "Avg Temp",
    condition: "Sky", estRevenue: "Estimated Revenue", estYield: "Estimated Yield",
    liveLabel: "Live", step1: "Step 1: District", step2: "Step 2: Crop",
    step3: "Step 3: Configure", language: "Language",
    shareWhatsApp: "Share on WhatsApp", histAvg: "yr avg",
    anomalyAbove: "above avg", anomalyBelow: "below avg",
  },
  bn: {
    title: "কৃষিমিত্র — স্মার্ট কৃষি পরামর্শ",
    subtitle: "পশ্চিমবঙ্গ কৃষি আবহাওয়া তথ্য ব্যবস্থা",
    selectDistrict: "জেলা বেছে নিন", selectCrop: "ফসল বেছে নিন",
    selectSoil: "মাটির ধরন বেছে নিন", fieldSize: "জমির পরিমাণ",
    sowingDate: "বপনের তারিখ", overview: "সংক্ষিপ্ত", fertilizer: "সার",
    pest: "রোগ ও পোকা", irrigation: "সেচ", advisory: "আবহাওয়া পরামর্শ",
    market: "বাজার", report: "সম্পূর্ণ রিপোর্ট", yieldCalc: "ফলন হিসাব",
    loading: "আবহাওয়ার তথ্য লোড হচ্ছে...", realtime: "লাইভ",
    historical: "ঐতিহাসিক", daysAfterSowing: "বপনের পর দিন",
    farmHealth: "খামারের স্বাস্থ্য", noDistrict: "শুরু করতে জেলা বেছে নিন",
    noCrop: "বিশ্লেষণের জন্য ফসল বেছে নিন",
    highlysuitable: "অত্যন্ত উপযুক্ত", withCaution: "সতর্কতার সাথে",
    notRecommended: "উপযুক্ত নয়", irrigateNow: "সেচ প্রয়োজন",
    noIrrigate: "আজ সেচ দরকার নেই", currentWeather: "বর্তমান আবহাওয়া",
    forecast: "৭ দিনের পূর্বাভাস", currentStage: "বর্তমান পর্যায়",
    irrigationSchedule: "সেচ সময়সূচি", season: "ঋতু",
    humidity: "আর্দ্রতা", rainfall: "বৃষ্টি", windSpeed: "বায়ু",
    maxTemp: "সর্বোচ্চ", minTemp: "সর্বনিম্ন", avgTemp: "গড় তাপ",
    condition: "আকাশ", estRevenue: "আনুমানিক আয়", estYield: "আনুমানিক ফলন",
    liveLabel: "লাইভ", step1: "ধাপ ১: জেলা", step2: "ধাপ ২: ফসল",
    step3: "ধাপ ৩: বিন্যাস", language: "ভাষা",
    shareWhatsApp: "হোয়াটসঅ্যাপে শেয়ার", histAvg: "বছর গড়",
    anomalyAbove: "গড়ের উপরে", anomalyBelow: "গড়ের নিচে",
  },
  hi: {
    title: "कृषिमित्र — स्मार्ट कृषि सलाह",
    subtitle: "पश्चिम बंगाल कृषि मौसम विज्ञान प्रणाली",
    selectDistrict: "जिला चुनें", selectCrop: "फसल चुनें",
    selectSoil: "मिट्टी का प्रकार", fieldSize: "खेत का आकार",
    sowingDate: "बुवाई तिथि", overview: "अवलोकन", fertilizer: "उर्वरक",
    pest: "कीट-रोग", irrigation: "सिंचाई", advisory: "मौसम सलाह",
    market: "बाजार", report: "पूर्ण रिपोर्ट", yieldCalc: "उपज कैलकुलेटर",
    loading: "मौसम डेटा लोड हो रहा है...", realtime: "लाइव",
    historical: "ऐतिहासिक", daysAfterSowing: "बुवाई के बाद के दिन",
    farmHealth: "खेत स्वास्थ्य", noDistrict: "शुरू करने के लिए जिला चुनें",
    noCrop: "पूर्ण विश्लेषण के लिए फसल चुनें",
    highlysuitable: "अत्यंत उपयुक्त", withCaution: "सावधानी से",
    notRecommended: "उपयुक्त नहीं", irrigateNow: "सिंचाई करें",
    noIrrigate: "आज सिंचाई की जरूरत नहीं", currentWeather: "वर्तमान मौसम",
    forecast: "7 दिन का पूर्वानुमान", currentStage: "वर्तमान विकास चरण",
    irrigationSchedule: "सिंचाई कार्यक्रम", season: "मौसम",
    humidity: "आर्द्रता", rainfall: "वर्षा", windSpeed: "हवा",
    maxTemp: "अधिकतम", minTemp: "न्यूनतम", avgTemp: "औसत तापमान",
    condition: "आकाश", estRevenue: "अनुमानित आय", estYield: "अनुमानित उपज",
    liveLabel: "लाइव", step1: "चरण 1: जिला", step2: "चरण 2: फसल",
    step3: "चरण 3: सेटअप", language: "भाषा",
    shareWhatsApp: "WhatsApp पर शेयर करें", histAvg: "वर्ष औसत",
    anomalyAbove: "औसत से ऊपर", anomalyBelow: "औसत से नीचे",
  },
  te: {
    title: "కృషిమిత్ర — స్మార్ట్ వ్యవసాయ సలహా",
    subtitle: "పశ్చిమ బెంగాల్ వ్యవసాయ వాతావరణ వ్యవస్థ",
    selectDistrict: "జిల్లా ఎంచుకోండి", selectCrop: "పంట ఎంచుకోండి",
    selectSoil: "నేల రకం", fieldSize: "పొలం పరిమాణం",
    sowingDate: "విత్తిన తేదీ", overview: "అవలోకనం", fertilizer: "ఎరువు",
    pest: "తెగులు-చీడ", irrigation: "నీటిపారుదల", advisory: "వాతావరణ సలహా",
    market: "మార్కెట్", report: "పూర్తి నివేదిక", yieldCalc: "దిగుబడి లెక్కింపు",
    loading: "వాతావరణ డేటా లోడ్ అవుతోంది...", realtime: "లైవ్",
    historical: "చారిత్రక", daysAfterSowing: "విత్తిన తర్వాత రోజులు",
    farmHealth: "పొలం ఆరోగ్యం", noDistrict: "ప్రారంభించడానికి జిల్లా ఎంచుకోండి",
    noCrop: "సంపూర్ణ విశ్లేషణకు పంట ఎంచుకోండి",
    highlysuitable: "అత్యంత అనుకూలం", withCaution: "జాగ్రత్తగా",
    notRecommended: "అనుకూలం కాదు", irrigateNow: "నీరు పెట్టండి",
    noIrrigate: "ఈరోజు నీరు అవసరం లేదు", currentWeather: "ప్రస్తుత వాతావరణం",
    forecast: "7 రోజుల అంచనా", currentStage: "ప్రస్తుత వృద్ధి దశ",
    irrigationSchedule: "నీటిపారుదల షెడ్యూల్", season: "సీజన్",
    humidity: "తేమ", rainfall: "వర్షపాతం", windSpeed: "గాలి",
    maxTemp: "గరిష్ట", minTemp: "కనిష్ట", avgTemp: "సగటు ఉష్ణోగ్రత",
    condition: "ఆకాశం", estRevenue: "అంచనా ఆదాయం", estYield: "అంచనా దిగుబడి",
    liveLabel: "లైవ్", step1: "దశ 1: జిల్లా", step2: "దశ 2: పంట",
    step3: "దశ 3: సెటప్", language: "భాష",
    shareWhatsApp: "WhatsApp లో పంచుకోండి", histAvg: "సం. సగటు",
    anomalyAbove: "సగటు కంటే ఎక్కువ", anomalyBelow: "సగటు కంటే తక్కువ",
  },
  mr: {
    title: "कृषीमित्र — स्मार्ट शेती सल्ला",
    subtitle: "पश्चिम बंगाल कृषी हवामान विज्ञान प्रणाली",
    selectDistrict: "जिल्हा निवडा", selectCrop: "पीक निवडा",
    selectSoil: "मातीचा प्रकार", fieldSize: "शेताचा आकार",
    sowingDate: "पेरणी तारीख", overview: "आढावा", fertilizer: "खत",
    pest: "कीड-रोग", irrigation: "सिंचन", advisory: "हवामान सल्ला",
    market: "बाजार", report: "संपूर्ण अहवाल", yieldCalc: "उत्पन्न कॅल्क्युलेटर",
    loading: "हवामान डेटा लोड होत आहे...", realtime: "थेट",
    historical: "ऐतिहासिक", daysAfterSowing: "पेरणीनंतरचे दिवस",
    farmHealth: "शेत आरोग्य", noDistrict: "सुरू करण्यासाठी जिल्हा निवडा",
    noCrop: "पूर्ण विश्लेषणासाठी पीक निवडा",
    highlysuitable: "अत्यंत योग्य", withCaution: "सावधानीने",
    notRecommended: "योग्य नाही", irrigateNow: "सिंचन करा",
    noIrrigate: "आज सिंचनाची गरज नाही", currentWeather: "सद्य हवामान",
    forecast: "७ दिवसांचा अंदाज", currentStage: "सद्य वाढीचा टप्पा",
    irrigationSchedule: "सिंचन वेळापत्रक", season: "हंगाम",
    humidity: "आर्द्रता", rainfall: "पाऊस", windSpeed: "वारा",
    maxTemp: "कमाल", minTemp: "किमान", avgTemp: "सरासरी तापमान",
    condition: "आकाश", estRevenue: "अंदाजे उत्पन्न", estYield: "अंदाजे उत्पादन",
    liveLabel: "थेट", step1: "पायरी 1: जिल्हा", step2: "पायरी 2: पीक",
    step3: "पायरी 3: सेटअप", language: "भाषा",
    shareWhatsApp: "WhatsApp वर शेअर करा", histAvg: "वर्ष सरासरी",
    anomalyAbove: "सरासरीपेक्षा जास्त", anomalyBelow: "सरासरीपेक्षा कमी",
  },
  ta: {
    title: "கிருஷிமித்ரா — நுண்ணிய வேளாண் ஆலோசனை",
    subtitle: "மேற்கு வங்கம் வேளாண் வானிலை அமைப்பு",
    selectDistrict: "மாவட்டம் தேர்ந்தெடுக்கவும்", selectCrop: "பயிர் தேர்ந்தெடுக்கவும்",
    selectSoil: "மண் வகை", fieldSize: "வயல் அளவு",
    sowingDate: "விதைப்பு தேதி", overview: "கண்ணோட்டம்", fertilizer: "உரம்",
    pest: "பூச்சி-நோய்", irrigation: "நீர்ப்பாசனம்", advisory: "வானிலை ஆலோசனை",
    market: "சந்தை", report: "முழு அறிக்கை", yieldCalc: "விளைச்சல் கணக்கீடு",
    loading: "வானிலை தரவு ஏற்றப்படுகிறது...", realtime: "நேரடி",
    historical: "வரலாற்று", daysAfterSowing: "விதைப்புக்குப் பிறகு நாட்கள்",
    farmHealth: "பண்ணை ஆரோக்கியம்", noDistrict: "தொடங்க மாவட்டம் தேர்ந்தெடுக்கவும்",
    noCrop: "முழு பகுப்பாய்விற்கு பயிர் தேர்ந்தெடுக்கவும்",
    highlysuitable: "மிகவும் ஏற்றது", withCaution: "கவனமாக",
    notRecommended: "ஏற்றதல்ல", irrigateNow: "நீர் பாய்ச்சுங்கள்",
    noIrrigate: "இன்று நீர்ப்பாசனம் தேவையில்லை", currentWeather: "தற்போதைய வானிலை",
    forecast: "7 நாள் முன்னறிவிப்பு", currentStage: "தற்போதைய வளர்ச்சி நிலை",
    irrigationSchedule: "நீர்ப்பாசன அட்டவணை", season: "பருவம்",
    humidity: "ஈரப்பதம்", rainfall: "மழைப்பொழிவு", windSpeed: "காற்று",
    maxTemp: "அதிக", minTemp: "குறைந்த", avgTemp: "சராசரி வெப்பம்",
    condition: "வானம்", estRevenue: "மதிப்பிடப்பட்ட வருமானம்", estYield: "மதிப்பிடப்பட்ட விளைச்சல்",
    liveLabel: "நேரடி", step1: "படி 1: மாவட்டம்", step2: "படி 2: பயிர்",
    step3: "படி 3: அமைவு", language: "மொழி",
    shareWhatsApp: "WhatsApp-ல் பகிரவும்", histAvg: "ஆண்டு சராசரி",
    anomalyAbove: "சராசரிக்கு மேல்", anomalyBelow: "சராசரிக்கு கீழ்",
  },
  gu: {
    title: "કૃષિમિત્ર — સ્માર્ટ ખેતી સલાહ",
    subtitle: "પશ્ચિમ બંગાળ કૃષિ હવામાન વ્યવસ્થા",
    selectDistrict: "જિલ્લો પસંદ કરો", selectCrop: "પાક પસંદ કરો",
    selectSoil: "જમીનનો પ્રકાર", fieldSize: "ખેતરનું કદ",
    sowingDate: "વાવણી તારીખ", overview: "ઝાંખી", fertilizer: "ખાતર",
    pest: "જીવાત-રોગ", irrigation: "સિંચાઈ", advisory: "હવામાન સલાહ",
    market: "બજાર", report: "સંપૂર્ણ અહેવાલ", yieldCalc: "ઉપજ ગણતરી",
    loading: "હવામાન ડેટા લોડ થઈ રહ્યો છે...", realtime: "લાઇવ",
    historical: "ઐતિહાસિક", daysAfterSowing: "વાવ્યા પછીના દિવસો",
    farmHealth: "ખેત આરોગ્ય", noDistrict: "શરૂ કરવા જિલ્લો પસંદ કરો",
    noCrop: "સંપૂર્ણ વિશ્લેષણ માટે પાક પસંદ કરો",
    highlysuitable: "અત્યંત યોગ્ય", withCaution: "સાવધાની સાથે",
    notRecommended: "યોગ્ય નથી", irrigateNow: "સિંચાઈ કરો",
    noIrrigate: "આજે સિંચાઈ જરૂરી નથી", currentWeather: "વર્તમાન હવામાન",
    forecast: "7 દિવસની આગાહી", currentStage: "વર્તમાન વૃદ્ધિ તબક્કો",
    irrigationSchedule: "સિંચાઈ સમયપત્રક", season: "ઋતુ",
    humidity: "ભેજ", rainfall: "વરસાદ", windSpeed: "પવન",
    maxTemp: "મહત્તમ", minTemp: "ન્યૂનતમ", avgTemp: "સરેરાશ તાપ",
    condition: "આકાશ", estRevenue: "અંદાજ આવક", estYield: "અંદાજ ઉપજ",
    liveLabel: "લાઇવ", step1: "પગલું 1: જિલ્લો", step2: "પગલું 2: પાક",
    step3: "પગલું 3: સેટઅપ", language: "ભાષા",
    shareWhatsApp: "WhatsApp પર શેર કરો", histAvg: "વ. સરેરાશ",
    anomalyAbove: "સરેરાશ કરતાં વધારે", anomalyBelow: "સરેરાશ કરતાં ઓછો",
  },
  kn: {
    title: "ಕೃಷಿಮಿತ್ರ — ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಲಹೆ",
    subtitle: "ಪಶ್ಚಿಮ ಬಂಗಾಳ ಕೃಷಿ ಹವಾಮಾನ ವ್ಯವಸ್ಥೆ",
    selectDistrict: "ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ", selectCrop: "ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ",
    selectSoil: "ಮಣ್ಣಿನ ವಿಧ", fieldSize: "ಜಮೀನಿನ ಗಾತ್ರ",
    sowingDate: "ಬಿತ್ತನೆ ದಿನಾಂಕ", overview: "ಅವಲೋಕನ", fertilizer: "ಗೊಬ್ಬರ",
    pest: "ಕೀಟ-ರೋಗ", irrigation: "ನೀರಾವರಿ", advisory: "ಹವಾಮಾನ ಸಲಹೆ",
    market: "ಮಾರುಕಟ್ಟೆ", report: "ಸಂಪೂರ್ಣ ವರದಿ", yieldCalc: "ಇಳುವರಿ ಲೆಕ್ಕ",
    loading: "ಹವಾಮಾನ ಡೇಟಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ...", realtime: "ನೇರ",
    historical: "ಐತಿಹಾಸಿಕ", daysAfterSowing: "ಬಿತ್ತನೆ ನಂತರದ ದಿನಗಳು",
    farmHealth: "ಜಮೀನು ಆರೋಗ್ಯ", noDistrict: "ಪ್ರಾರಂಭಿಸಲು ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ",
    noCrop: "ಸಂಪೂರ್ಣ ವಿಶ್ಲೇಷಣೆಗೆ ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ",
    highlysuitable: "ಹೆಚ್ಚು ಸೂಕ್ತ", withCaution: "ಎಚ್ಚರಿಕೆಯಿಂದ",
    notRecommended: "ಸೂಕ್ತವಲ್ಲ", irrigateNow: "ನೀರು ಹಾಕಿ",
    noIrrigate: "ಇಂದು ನೀರಾವರಿ ಬೇಡ", currentWeather: "ಪ್ರಸ್ತುತ ಹವಾಮಾನ",
    forecast: "7 ದಿನಗಳ ಮುನ್ಸೂಚನೆ", currentStage: "ಪ್ರಸ್ತುತ ಬೆಳವಣಿಗೆ ಹಂತ",
    irrigationSchedule: "ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ", season: "ಸೀಸನ್",
    humidity: "ಆರ್ದ್ರತೆ", rainfall: "ಮಳೆ", windSpeed: "ಗಾಳಿ",
    maxTemp: "ಗರಿಷ್ಠ", minTemp: "ಕನಿಷ್ಠ", avgTemp: "ಸರಾಸರಿ ಉಷ್ಣತೆ",
    condition: "ಆಕಾಶ", estRevenue: "ಅಂದಾಜು ಆದಾಯ", estYield: "ಅಂದಾಜು ಇಳುವರಿ",
    liveLabel: "ನೇರ", step1: "ಹಂತ 1: ಜಿಲ್ಲೆ", step2: "ಹಂತ 2: ಬೆಳೆ",
    step3: "ಹಂತ 3: ಸೆಟಪ್", language: "ಭಾಷೆ",
    shareWhatsApp: "WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ", histAvg: "ವ. ಸರಾಸರಿ",
    anomalyAbove: "ಸರಾಸರಿಗಿಂತ ಹೆಚ್ಚು", anomalyBelow: "ಸರಾಸರಿಗಿಂತ ಕಡಿಮೆ",
  },
  ml: {
    title: "കൃഷിമിത്ര — സ്മാർട്ട് കൃഷി ഉപദേശം",
    subtitle: "പശ്ചിമ ബംഗാൾ കൃഷി കാലാവസ്ഥ വ്യവസ്ഥ",
    selectDistrict: "ജില്ല തിരഞ്ഞെടുക്കുക", selectCrop: "വിള തിരഞ്ഞെടുക്കുക",
    selectSoil: "മണ്ണിന്റെ തരം", fieldSize: "പാടത്തിന്റെ വലിപ്പം",
    sowingDate: "വിതയ്ക്കൽ തീയതി", overview: "അവലോകനം", fertilizer: "വളം",
    pest: "കീട-രോഗം", irrigation: "ജലസേചനം", advisory: "കാലാവസ്ഥ ഉപദേശം",
    market: "വിപണി", report: "പൂർണ്ണ റിപ്പോർട്ട്", yieldCalc: "വിളവ് കണക്കുകൂട്ടൽ",
    loading: "കാലാവസ്ഥ ഡാറ്റ ലോഡ് ആകുന്നു...", realtime: "തത്സമയം",
    historical: "ചരിത്രപരം", daysAfterSowing: "വിതയ്ക്കലിന് ശേഷമുള്ള ദിവസങ്ങൾ",
    farmHealth: "കൃഷിയിടം ആരോഗ്യം", noDistrict: "ആരംഭിക്കാൻ ജില്ല തിരഞ്ഞെടുക്കുക",
    noCrop: "പൂർണ്ണ വിശകലനത്തിന് വിള തിരഞ്ഞെടുക്കുക",
    highlysuitable: "വളരെ അനുയോജ്യം", withCaution: "ശ്രദ്ധയോടെ",
    notRecommended: "അനുയോജ്യമല്ല", irrigateNow: "ജലസേചനം ചെയ്യുക",
    noIrrigate: "ഇന്ന് ജലസേചനം ആവശ്യമില്ല", currentWeather: "നിലവിലെ കാലാവസ്ഥ",
    forecast: "7 ദിവസത്തെ പ്രവചനം", currentStage: "നിലവിലെ വളർച്ചാ ഘട്ടം",
    irrigationSchedule: "ജലസേചന ഷെഡ്യൂൾ", season: "ഋതു",
    humidity: "ആർദ്രത", rainfall: "മഴ", windSpeed: "കാറ്റ്",
    maxTemp: "പരമാവധി", minTemp: "കുറഞ്ഞത്", avgTemp: "ശരാശരി ഊഷ്മാവ്",
    condition: "ആകാശം", estRevenue: "കണക്കാക്കിയ വരുമാനം", estYield: "കണക്കാക്കിയ വിളവ്",
    liveLabel: "തത്സമയം", step1: "ഘട്ടം 1: ജില്ല", step2: "ഘട്ടം 2: വിള",
    step3: "ഘട്ടം 3: ക്രമീകരണം", language: "ഭാഷ",
    shareWhatsApp: "WhatsApp-ൽ പങ്കിടുക", histAvg: "വർഷ ശരാശരി",
    anomalyAbove: "ശരാശരിയേക്കാൾ കൂടുതൽ", anomalyBelow: "ശരാശരിയേക്കാൾ കുറവ്",
  },
  pa: {
    title: "ਕ੍ਰਿਸ਼ੀਮਿੱਤਰ — ਸਮਾਰਟ ਖੇਤੀ ਸਲਾਹ",
    subtitle: "ਪੱਛਮੀ ਬੰਗਾਲ ਖੇਤੀ ਮੌਸਮ ਵਿਗਿਆਨ ਪ੍ਰਣਾਲੀ",
    selectDistrict: "ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ", selectCrop: "ਫਸਲ ਚੁਣੋ",
    selectSoil: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ", fieldSize: "ਖੇਤ ਦਾ ਆਕਾਰ",
    sowingDate: "ਬੀਜਾਈ ਤਾਰੀਖ", overview: "ਝਲਕ", fertilizer: "ਖਾਦ",
    pest: "ਕੀੜੇ-ਰੋਗ", irrigation: "ਸਿੰਚਾਈ", advisory: "ਮੌਸਮ ਸਲਾਹ",
    market: "ਮੰਡੀ", report: "ਪੂਰੀ ਰਿਪੋਰਟ", yieldCalc: "ਝਾੜ ਗਣਨਾ",
    loading: "ਮੌਸਮ ਡੇਟਾ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...", realtime: "ਲਾਈਵ",
    historical: "ਇਤਿਹਾਸਕ", daysAfterSowing: "ਬੀਜਾਈ ਤੋਂ ਬਾਅਦ ਦੇ ਦਿਨ",
    farmHealth: "ਖੇਤ ਸਿਹਤ", noDistrict: "ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ",
    noCrop: "ਪੂਰੇ ਵਿਸ਼ਲੇਸ਼ਣ ਲਈ ਫਸਲ ਚੁਣੋ",
    highlysuitable: "ਬਹੁਤ ਢੁਕਵਾਂ", withCaution: "ਸਾਵਧਾਨੀ ਨਾਲ",
    notRecommended: "ਢੁਕਵਾਂ ਨਹੀਂ", irrigateNow: "ਸਿੰਚਾਈ ਕਰੋ",
    noIrrigate: "ਅੱਜ ਸਿੰਚਾਈ ਦੀ ਲੋੜ ਨਹੀਂ", currentWeather: "ਮੌਜੂਦਾ ਮੌਸਮ",
    forecast: "7 ਦਿਨਾਂ ਦੀ ਭਵਿੱਖਬਾਣੀ", currentStage: "ਮੌਜੂਦਾ ਵਿਕਾਸ ਪੜਾਅ",
    irrigationSchedule: "ਸਿੰਚਾਈ ਸਮਾਂ-ਸਾਰਣੀ", season: "ਮੌਸਮ",
    humidity: "ਨਮੀ", rainfall: "ਵਰਖਾ", windSpeed: "ਹਵਾ",
    maxTemp: "ਵੱਧ ਤੋਂ ਵੱਧ", minTemp: "ਘੱਟੋ ਘੱਟ", avgTemp: "ਔਸਤ ਤਾਪਮਾਨ",
    condition: "ਅਸਮਾਨ", estRevenue: "ਅਨੁਮਾਨਿਤ ਆਮਦਨ", estYield: "ਅਨੁਮਾਨਿਤ ਝਾੜ",
    liveLabel: "ਲਾਈਵ", step1: "ਕਦਮ 1: ਜ਼ਿਲ੍ਹਾ", step2: "ਕਦਮ 2: ਫਸਲ",
    step3: "ਕਦਮ 3: ਸੈੱਟਅੱਪ", language: "ਭਾਸ਼ਾ",
    shareWhatsApp: "WhatsApp 'ਤੇ ਸਾਂਝਾ ਕਰੋ", histAvg: "ਸਾਲ ਔਸਤ",
    anomalyAbove: "ਔਸਤ ਤੋਂ ਵੱਧ", anomalyBelow: "ਔਸਤ ਤੋਂ ਘੱਟ",
  },
  or: {
    title: "କୃଷିମିତ୍ର — ସ୍ମାର୍ଟ କୃଷି ପରାମର୍ଶ",
    subtitle: "ପଶ୍ଚିମ ବଙ୍ଗ କୃଷି ପାଣିପାଗ ସୂଚନା ବ୍ୟବସ୍ଥା",
    selectDistrict: "ଜିଲ୍ଲା ବାଛନ୍ତୁ", selectCrop: "ଫସଲ ବାଛନ୍ତୁ",
    selectSoil: "ମାଟି ପ୍ରକାର", fieldSize: "ଜମି ଆକାର",
    sowingDate: "ବୁଣା ତାରିଖ", overview: "ସଂକ୍ଷିପ୍ତ", fertilizer: "ସାର",
    pest: "ପୋକ-ରୋଗ", irrigation: "ଜଳସେଚନ", advisory: "ପାଣିପାଗ ପରାମର୍ଶ",
    market: "ବଜାର", report: "ସଂପୂର୍ଣ ରିପୋର୍ଟ", yieldCalc: "ଅମଳ ହିସାବ",
    loading: "ପାଣିପାଗ ଡାଟା ଲୋଡ ହେଉଛି...", realtime: "ସିଧା",
    historical: "ଐତିହାସିକ", daysAfterSowing: "ବୁଣିବା ପରେ ଦିନ",
    farmHealth: "ଖେତ ସ୍ୱାସ୍ଥ୍ୟ", noDistrict: "ଆରମ୍ଭ ପାଇଁ ଜିଲ୍ଲା ବାଛନ୍ତୁ",
    noCrop: "ସଂପୂର୍ଣ ବିଶ୍ଳେଷଣ ପାଇଁ ଫସଲ ବାଛନ୍ତୁ",
    highlysuitable: "ଅତ୍ୟନ୍ତ ଉପଯୁକ୍ତ", withCaution: "ସାବଧାନ",
    notRecommended: "ଉପଯୁକ୍ତ ନୁହେଁ", irrigateNow: "ଜଳ ଦିଅନ୍ତୁ",
    noIrrigate: "ଆଜି ଜଳ ଦରକାର ନାହିଁ", currentWeather: "ବର୍ତ୍ତମାନ ପାଣିପାଗ",
    forecast: "୭ ଦିନ ପୂର୍ବାଭାସ", currentStage: "ବର୍ତ୍ତମାନ ବୃଦ୍ଧି ପର୍ଯ୍ୟାୟ",
    irrigationSchedule: "ଜଳସେଚନ ସୂଚୀ", season: "ଋତୁ",
    humidity: "ଆର୍ଦ୍ରତା", rainfall: "ବର୍ଷା", windSpeed: "ପବନ",
    maxTemp: "ସର୍ବୋଚ୍ଚ", minTemp: "ସର୍ବନିମ୍ନ", avgTemp: "ଔସତ ତାପ",
    condition: "ଆକାଶ", estRevenue: "ଆନୁମାନିକ ଆୟ", estYield: "ଆନୁମାନିକ ଅମଳ",
    liveLabel: "ସିଧା", step1: "ପଦକ୍ଷେପ ୧: ଜିଲ୍ଲା", step2: "ପଦକ୍ଷେପ ୨: ଫସଲ",
    step3: "ପଦକ୍ଷେପ ୩: ସ୍ଥାପନ", language: "ଭାଷା",
    shareWhatsApp: "WhatsApp ରେ ଶେୟାର", histAvg: "ବର୍ଷ ହାରାହାରି",
    anomalyAbove: "ହାରାହାରିରୁ ଅଧିକ", anomalyBelow: "ହାରାହାରିରୁ କମ",
  },
};

// ─── TABS (upgraded icons from multiple icon libraries) ──────────────────────
const TABS = [
  { id: 'overview',    icon: MdDashboard,              requiresCrop: false },
  { id: 'fertilizer',  icon: HiOutlineBeaker,           requiresCrop: true  },
  { id: 'pest',        icon: HiOutlineBug,              requiresCrop: true  },
  { id: 'irrigation',  icon: GiWateringCan,             requiresCrop: true  },
  { id: 'advisory',    icon: BsCloudSunFill,            requiresCrop: false },
  { id: 'market',      icon: HiOutlineShoppingBag,      requiresCrop: true  },
  { id: 'yieldCalc',   icon: HiOutlineChartBarSquare,   requiresCrop: true  },
  { id: 'report',      icon: HiOutlineDocumentChartBar, requiresCrop: true  },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [dataset, setDataset]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError]           = useState(null);
  const [lang, setLang]             = useState('en');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const [selectedState, setSelectedState]       = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCrop, setSelectedCrop]         = useState('');
  const [selectedModel, setSelectedModel]       = useState('intermediate');
  const [selectedSoil, setSelectedSoil]         = useState('alluvial');
  const [activeTab, setActiveTab]               = useState('overview');

  // Sowing date instead of raw DAS
  const [sowingDate, setSowingDate]   = useState('');
  const [cropDAS, setCropDAS]         = useState(30);

  // Yield calculator
  const [fieldSize, setFieldSize]     = useState('1');
  const [fieldUnit, setFieldUnit]     = useState('bigha');

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast]             = useState([]);
  const [currentSeason, setCurrentSeason]   = useState('');
  const [historicalStats, setHistoricalStats] = useState(null);

  const t = T[lang];

  // ── load CSV dataset ──────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const data = await loadWeatherDataset();
        setDataset(data);
        setCurrentSeason(getCurrentSeason());
      } catch (e) {
        setError('Failed to load base data. Please refresh.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── derive DAS from sowing date ────────────────────────────────────────────
  useEffect(() => {
    if (sowingDate) {
      const today  = new Date();
      const sowing = new Date(sowingDate);
      const diff   = Math.floor((today - sowing) / (1000 * 60 * 60 * 24));
      setCropDAS(Math.max(0, Math.min(365, diff)));
    }
  }, [sowingDate]);

  // ── compute multi-year historical baseline for anomaly detection ──────────
  useEffect(() => {
    if (!dataset || !selectedDistrict) { setHistoricalStats(null); return; }
    const curMonth  = new Date().getMonth() + 1;
    const monthStr  = String(curMonth).padStart(2, '0');
    const rows      = dataset.filter(d =>
      d.District === selectedDistrict && d.Date && d.Date.slice(5,7) === monthStr
    );
    if (rows.length < 5) { setHistoricalStats(null); return; }
    const avg = arr => (arr.reduce((s,n) => s+n, 0) / arr.length);
    const nums = k  => rows.map(d => parseFloat(d[k])).filter(n => !isNaN(n));
    const years = [...new Set(rows.map(d => d.Date.slice(0,4)))];
    setHistoricalStats({
      avgTempMax:  +avg(nums('Temperature_Max_C')).toFixed(1),
      avgTempMin:  +avg(nums('Temperature_Min_C')).toFixed(1),
      avgTempAvg:  +avg(nums('Temperature_Avg_C')).toFixed(1),
      avgHumidity: +avg(nums('Humidity_Percent')).toFixed(1),
      avgRainfall: +avg(nums('Rainfall_mm')).toFixed(1),
      avgWind:     +avg(nums('Wind_Speed_kmh')).toFixed(1),
      years:       years.length,
      sampleDays:  rows.length,
    });
  }, [dataset, selectedDistrict]);

  // ── fetch weather when district changes ───────────────────────────────────
  const fetchWeather = useCallback(async (district, state) => {
    if (!district) { setCurrentWeather(null); setForecast([]); return; }
    setWeatherLoading(true);
    try {
      const [weather, fc] = await Promise.all([
        getCurrentWeatherForDistrict(dataset, district, state || selectedState),
        getWeatherForecastForDistrict(dataset, district, 7, state || selectedState)
      ]);
      setCurrentWeather(weather);
      setForecast(fc);
    } catch (e) {
      console.error('Weather fetch error:', e);
    } finally {
      setWeatherLoading(false);
    }
  }, [dataset, selectedState]);

  useEffect(() => {
    if (!loading) fetchWeather(selectedDistrict, selectedState);
  }, [selectedDistrict, selectedState, loading, fetchWeather]);

  // ── derived flags ──────────────────────────────────────────────────────────
  const hasCrop    = !!(selectedCrop && crops[selectedCrop]);
  const hasWeather = !!currentWeather;
  const crop       = hasCrop ? crops[selectedCrop] : null;
  const modelCfg   = MODELS[selectedModel];

  // ── computed data ──────────────────────────────────────────────────────────
  const riskAlerts = useMemo(() => {
    if (!hasWeather) return [];
    return getRiskAlerts(currentWeather, forecast, selectedModel);
  }, [currentWeather, forecast, selectedModel]);

  const cropRecommendations = useMemo(() => {
    if (!hasWeather) return null;
    return getCropRecommendations(currentWeather, currentSeason, selectedModel);
  }, [currentWeather, currentSeason, selectedModel]);

  const irrigationAdvice = useMemo(() => {
    if (!hasWeather || !crop) return null;
    return getIrrigationAdvice(currentWeather, crop, selectedModel);
  }, [currentWeather, crop, selectedModel]);

  const irrigationStages = useMemo(() => {
    if (!crop || !crop.growthStages) return null;
    return getIrrigationStageAdvice(crop, cropDAS);
  }, [crop, cropDAS]);

  const diseaseRisks = useMemo(() => {
    if (!hasWeather || !crop) return [];
    return predictDiseaseRisks(currentWeather, crop, selectedModel);
  }, [currentWeather, crop, selectedModel]);

  const pestRisks = useMemo(() => {
    if (!hasWeather || !crop) return [];
    return getPestRiskAlerts(currentWeather, crop, selectedModel);
  }, [currentWeather, crop, selectedModel]);

  const preventiveMeasures = useMemo(() => getPreventiveMeasures(diseaseRisks), [diseaseRisks]);

  const farmHealthScore = useMemo(() => {
    if (!hasWeather || !crop) return null;
    return calculateFarmHealthScore(currentWeather, crop, diseaseRisks, selectedModel);
  }, [currentWeather, crop, diseaseRisks, selectedModel]);

  const weatherAdvisory = useMemo(() => {
    if (!hasWeather) return [];
    return getWeatherAdvisory(currentWeather, crop, selectedModel);
  }, [currentWeather, crop, selectedModel]);

  const fertilizerRec = useMemo(() => {
    if (!hasWeather || !crop) return null;
    return getFertilizerRecommendation(crop, currentWeather, selectedSoil, selectedModel);
  }, [currentWeather, crop, selectedSoil, selectedModel]);

  const marketIntel = useMemo(() => {
    if (!hasWeather || !crop) return null;
    return getMarketIntelligence(crop, currentWeather, selectedDistrict);
  }, [crop, currentWeather, selectedDistrict]);

  const yieldEstimation = useMemo(() => {
    if (!hasWeather || !crop) return null;
    return calculateYieldEstimation(crop, currentWeather, diseaseRisks, fieldSize, fieldUnit, marketIntel);
  }, [crop, currentWeather, diseaseRisks, fieldSize, fieldUnit, marketIntel]);

  const sustainabilityTips = useMemo(
    () => getSustainabilityTips(currentWeather, irrigationAdvice),
    [currentWeather, irrigationAdvice]
  );

  // ── anomaly detection vs historical baseline ──────────────────────────────
  const weatherAnomalies = useMemo(() => {
    if (!currentWeather || !historicalStats) return [];
    const anomalies = [];
    const tDiff = currentWeather.Temperature_Max_C - historicalStats.avgTempMax;
    const hDiff = currentWeather.Humidity_Percent  - historicalStats.avgHumidity;
    const rDiff = currentWeather.Rainfall_mm       - historicalStats.avgRainfall;
    if (Math.abs(tDiff) > 2.5)
      anomalies.push({ type: 'temp',     diff: tDiff,  val: `${tDiff > 0 ? '+' : ''}${tDiff.toFixed(1)}°C vs avg`, color: tDiff > 0 ? '#ef4444' : '#3b82f6' });
    if (Math.abs(hDiff) > 8)
      anomalies.push({ type: 'humidity', diff: hDiff,  val: `${hDiff > 0 ? '+' : ''}${hDiff.toFixed(0)}% RH vs avg`, color: hDiff > 0 ? '#06b6d4' : '#f59e0b' });
    if (currentWeather.Rainfall_mm > 2 && rDiff > historicalStats.avgRainfall * 0.8)
      anomalies.push({ type: 'rain',     diff: rDiff,  val: `Rain: ${currentWeather.Rainfall_mm}mm (avg ${historicalStats.avgRainfall}mm)`, color: '#8b5cf6' });
    return anomalies;
  }, [currentWeather, historicalStats]);

  // ── icon helpers ───────────────────────────────────────────────────────────
  const WeatherIcon = ({ condition, size = 50 }) => {
    const type = getWeatherIconType(condition);
    const cls  = 'drop-shadow-lg';
    switch (type) {
      case 'sun':          return <WiDaySunny     size={size} className={`text-yellow-300 ${cls}`} />;
      case 'cloud':        return <WiCloudy       size={size} className={`text-gray-300 ${cls}`} />;
      case 'cloudSun':     return <WiCloud        size={size} className={`text-blue-200 ${cls}`} />;
      case 'cloudRain':    return <WiRain         size={size} className={`text-blue-400 ${cls}`} />;
      case 'cloudLightning':return <WiThunderstorm size={size} className={`text-purple-400 ${cls}`} />;
      case 'cloudDrizzle': return <WiDayRainMix   size={size} className={`text-blue-300 ${cls}`} />;
      default:             return <WiDaySunny     size={size} className={`text-yellow-300 ${cls}`} />;
    }
  };

  const AlertIcon = ({ type, size = 22 }) => {
    switch (type) {
      case 'flame':         return <FaFire                size={size} className="text-red-500 animate-pulse" />;
      case 'thermometer':   return <FaThermometerHalf     size={size} className="text-orange-500" />;
      case 'snowflake':     return <FaSnowflake           size={size} className="text-blue-400" />;
      case 'cloudRain':     return <FaCloudShowersHeavy   size={size} className="text-blue-600" />;
      case 'alertTriangle': return <FaExclamationTriangle  size={size} className="text-yellow-500" />;
      case 'wind':          return <FaWind                size={size} className="text-gray-400" />;
      case 'sun':           return <FaSun                 size={size} className="text-yellow-500" />;
      case 'checkCircle':   return <FaCheckCircle         size={size} className="text-green-500" />;
      default:              return <MdWarning             size={size} className="text-yellow-500" />;
    }
  };

  // ── WhatsApp share helper ──────────────────────────────────────────────────
  const shareToWhatsApp = () => {
    if (!currentWeather || !crop) return;
    const text = [
      `🌾 *E-Agriculture Advisory — ${selectedDistrict}*`,
      `📅 ${new Date().toLocaleDateString('en-IN')}`,
      ``,
      `🌡️ Temp: ${currentWeather.Temperature_Max_C}°C | 💧 Humidity: ${currentWeather.Humidity_Percent}%`,
      `🌧️ Rainfall: ${currentWeather.Rainfall_mm}mm | ☁️ ${currentWeather.Weather_Condition}`,
      ``,
      `🌱 Crop: *${selectedCrop}*`,
      farmHealthScore ? `💚 Farm Health: ${farmHealthScore.score}/100 (${farmHealthScore.status})` : '',
      irrigationAdvice ? `💧 Irrigation: ${irrigationAdvice.shouldIrrigate ? `Apply ${irrigationAdvice.waterAmount}` : 'Not needed today'}` : '',
      diseaseRisks.length > 0 ? `⚠️ Disease Risk: ${diseaseRisks[0].name} (${diseaseRisks[0].riskLevel} risk)` : '✅ No significant disease risk',
      marketIntel ? `📈 Market Price: ₹${marketIntel.avgPrice}/quintal` : '',
      yieldEstimation ? `🌾 Est. Yield: ${yieldEstimation.estimatedYield} tonnes | Revenue: ₹${yieldEstimation.revenueEstimate.toLocaleString('en-IN')}` : '',
      ``,
      `_Powered by E-Agriculture Advisory_`
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // ── loading / error states ─────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d2b1f 50%, #0a1628 100%)' }}>
      <div className="text-center">
        <div className="relative mx-auto mb-6 w-20 h-20">
          <div className="animate-spin rounded-full h-20 w-20 border-2 border-transparent border-t-emerald-400 absolute inset-0" />
          <div className="animate-spin rounded-full h-20 w-20 border-2 border-transparent border-r-teal-400 absolute inset-0" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <FaSeedling className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400 text-2xl" />
        </div>
        <p className="text-emerald-300 text-lg font-medium tracking-wide">{t.loading}</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="bg-gray-900 border border-red-800 rounded-2xl p-8 max-w-md text-center">
        <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
        <p className="text-red-400 text-lg font-semibold">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-6 w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-500 transition-all">Reload</button>
      </div>
    </div>
  );

  // ── color helpers ──────────────────────────────────────────────────────────
  const healthColor = farmHealthScore
    ? farmHealthScore.color === 'green'  ? '#10b981'
    : farmHealthScore.color === 'blue'   ? '#3b82f6'
    : farmHealthScore.color === 'yellow' ? '#f59e0b'
    : '#ef4444'
    : '#6b7280';

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen pb-16" style={{ background: 'linear-gradient(160deg, #060e1a 0%, #0b1f12 40%, #071018 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-5">

        {/* ═══ HEADER ═══ */}
        <div className="relative rounded-3xl shadow-2xl z-20" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #0d4f2f 100%)' }}>
          <div className="absolute inset-0 opacity-10 rounded-3xl overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, #34d399, transparent)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, #10b981, transparent)', transform: 'translate(-30%, 30%)' }} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 gap-4">
            <div className="flex items-center gap-5">
              <div className="bg-white bg-opacity-15 backdrop-blur p-4 rounded-2xl border border-white border-opacity-20">
                <GiFarmTractor className="text-emerald-300 text-4xl" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">{t.title}</h1>
                <p className="text-emerald-200 text-sm mt-1 flex items-center gap-2">
                  <FaBroadcastTower className="text-xs animate-pulse" />
                  <span>{t.subtitle}</span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {currentWeather?.isRealTime && (
                    <span className="flex items-center gap-1 text-xs bg-emerald-500 bg-opacity-30 text-emerald-200 px-3 py-1 rounded-full border border-emerald-500 border-opacity-40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {t.liveLabel} — {currentWeather.fetchedAt}
                    </span>
                  )}
                  <span className="text-xs text-emerald-300 opacity-70">
                    {new Date().toLocaleDateString(lang === 'bn' ? 'bn-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                </div>
              </div>
            </div>
            {/* Language dropdown + refresh + WhatsApp */}
            <div className="flex items-center gap-3">
              {/* 11-language selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(v => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white border border-white border-opacity-25 hover:bg-white hover:bg-opacity-10 transition-all"
                >
                  <BsTranslate size={14} />
                  <span className="max-w-20 truncate">{LANG_META.find(l => l.code === lang)?.native || 'Language'}</span>
                  <FaChevronDown size={9} className={`transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
                </button>
                {showLangMenu && (
                  <>
                    {/* invisible backdrop to close on outside click */}
                    <div
                      className="fixed inset-0"
                      style={{ zIndex: 998 }}
                      onClick={() => setShowLangMenu(false)}
                    />
                    <div
                      className="absolute right-0 top-full mt-1.5 rounded-2xl shadow-2xl border border-white border-opacity-10 overflow-hidden"
                      style={{ background: 'linear-gradient(160deg,#0a1f10,#071018)', minWidth: 240, zIndex: 999 }}
                    >
                      <div className="px-3 pt-3 pb-1 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <MdLanguage size={13} className="text-emerald-500" /> {t.language} — India
                      </div>
                      <div className="p-2 grid grid-cols-2 gap-0.5">
                        {LANG_META.map(l => (
                          <button key={l.code}
                            onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                            className={`flex items-start gap-2 px-3 py-2 rounded-xl text-xs transition-all text-left ${lang === l.code ? 'bg-emerald-600 text-white font-bold' : 'text-gray-300'}`}
                            style={{ position: 'relative', zIndex: 999 }}
                          >
                            <div className="min-w-0">
                              <p className="font-semibold leading-none">{l.native}</p>
                              <p className="text-xs opacity-55 mt-0.5 leading-none">{l.label} · {l.region}</p>
                            </div>
                            {lang === l.code && <BsCheck2Circle size={12} className="text-emerald-300 flex-shrink-0 mt-0.5" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              {selectedDistrict && (
                <button
                  onClick={() => fetchWeather(selectedDistrict, selectedState)}
                  disabled={weatherLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-200 border border-emerald-500 border-opacity-40 hover:bg-emerald-500 hover:bg-opacity-20 transition-all disabled:opacity-50"
                >
                  <FaSync className={weatherLoading ? 'animate-spin' : ''} />
                  <span>Refresh</span>
                </button>
              )}
              {hasCrop && (
                <button
                  onClick={shareToWhatsApp}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white border border-green-400 border-opacity-50 hover:bg-green-500 hover:bg-opacity-20 transition-all"
                  style={{ background: 'rgba(22,163,74,0.15)' }}
                >
                  <span>📱</span>
                  <span>WhatsApp</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ═══ CONTROL PANEL ═══ */}
        <div className="rounded-2xl shadow-xl border border-white border-opacity-5 p-6" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>

          {/* Step indicators */}
          <div className="flex flex-wrap gap-3 mb-5">
            {[
              { label: t.step1, done: !!selectedDistrict },
              { label: t.step2, done: hasCrop },
              { label: t.step3, done: true }
            ].map((step, i) => (
              <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${step.done ? 'border-emerald-500 text-emerald-300 bg-emerald-500 bg-opacity-10' : 'border-gray-600 text-gray-500 bg-gray-800 bg-opacity-50'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${step.done ? 'bg-emerald-500 text-white' : 'bg-gray-600 text-gray-400'}`}>{i + 1}</span>
                {step.label}
                {step.done && <FaCheckCircle className="text-emerald-400" size={10} />}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {/* State */}
            <div className="md:col-span-1">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                <FaMapMarkerAlt className="text-emerald-500" /> Select State
              </label>
              <select
                value={selectedState}
                onChange={e => {
                  setSelectedState(e.target.value);
                  setSelectedDistrict('');
                  setSelectedCrop('');
                  setActiveTab('overview');
                  setCurrentWeather(null);
                }}
                className="w-full px-4 py-3 rounded-xl text-sm text-white border border-white border-opacity-10 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <option value="" style={{ background: '#1a2e1a' }}>— Select State —</option>
                {getAllStates().map(s => (
                  <option key={s} value={s} style={{ background: '#1a2e1a' }}>{s}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="md:col-span-1">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                <FaMapMarkerAlt className="text-blue-400" /> {t.selectDistrict}
              </label>
              <select
                value={selectedDistrict}
                onChange={e => { setSelectedDistrict(e.target.value); setActiveTab('overview'); setCurrentWeather(null); }}
                disabled={!selectedState}
                className="w-full px-4 py-3 rounded-xl text-sm text-white border border-white border-opacity-10 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <option value="" style={{ background: '#1a2e1a' }}>— {t.selectDistrict} —</option>
                {getDistrictsByState(selectedState).map(d => (
                  <option key={d.name} value={d.name} style={{ background: '#1a2e1a' }}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Crop */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                <GiWheat className="text-emerald-500" /> {t.selectCrop}
              </label>
              <select
                value={selectedCrop}
                onChange={e => setSelectedCrop(e.target.value)}
                disabled={!selectedDistrict}
                className="w-full px-4 py-3 rounded-xl text-sm text-white border border-white border-opacity-10 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <option value="" style={{ background: '#1a2e1a' }}>— {t.selectCrop} —</option>
                {Object.values(crops).map(c => (
                  <option key={c.name} value={c.name.split(' ')[0]} style={{ background: '#1a2e1a' }}>
                    {c.icon} {lang === 'bn' ? c.nameBn : c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Soil Type */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                <FaLeaf className="text-amber-500" /> {t.selectSoil}
              </label>
              <select
                value={selectedSoil}
                onChange={e => setSelectedSoil(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-white border border-white border-opacity-10 focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                {(getSuggestedSoilTypes(selectedState).length > 0
                  ? getSuggestedSoilTypes(selectedState)
                  : soilTypes
                ).map(s => (
                  <option key={s.id} value={s.id} style={{ background: '#1a2e1a' }}>
                    {lang === 'bn' ? s.labelBn : s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sowing date + Field size + Model */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Sowing date */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                <FaCalendarAlt className="text-blue-400" /> {t.sowingDate}
              </label>
              <input
                type="date"
                value={sowingDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => setSowingDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-white border border-white border-opacity-10 focus:outline-none focus:border-blue-500 transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', colorScheme: 'dark' }}
              />
              {sowingDate && (
                <p className="text-xs text-blue-400 mt-1">{t.daysAfterSowing}: <strong>{cropDAS}</strong></p>
              )}
            </div>

            {/* Field size */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                <FaTractor className="text-yellow-500" /> {t.fieldSize}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0.1" step="0.1"
                  value={fieldSize}
                  onChange={e => setFieldSize(e.target.value)}
                  className="flex-1 px-3 py-3 rounded-xl text-sm text-white border border-white border-opacity-10 focus:outline-none focus:border-yellow-500 transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                />
                <select
                  value={fieldUnit}
                  onChange={e => setFieldUnit(e.target.value)}
                  className="w-28 px-2 py-3 rounded-xl text-xs text-white border border-white border-opacity-10 focus:outline-none focus:border-yellow-500 transition-all cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <option value="bigha" style={{ background: '#1a2e1a' }}>Bigha</option>
                  <option value="acre"  style={{ background: '#1a2e1a' }}>Acre</option>
                  <option value="hectare" style={{ background: '#1a2e1a' }}>Hectare</option>
                  <option value="katha" style={{ background: '#1a2e1a' }}>Katha</option>
                </select>
              </div>
            </div>

            {/* Model */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                <FaChartLine className="text-purple-400" /> Analysis Model
              </label>
              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-white border border-white border-opacity-10 focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                {Object.values(MODELS).map(m => (
                  <option key={m.id} value={m.id} style={{ background: '#1a2e1a' }}>{m.name} — {m.bestFor}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status banner */}
          <div className="mt-4">
            {!selectedDistrict && (
              <div className="flex items-center gap-3 p-3 rounded-xl text-sm text-yellow-300 border border-yellow-800 border-opacity-50" style={{ background: 'rgba(234,179,8,0.08)' }}>
                <FaExclamationTriangle className="text-yellow-500 flex-shrink-0" />
                <span>{t.noDistrict}</span>
              </div>
            )}
            {selectedDistrict && !hasCrop && (
              <div className="flex items-center gap-3 p-3 rounded-xl text-sm text-blue-300 border border-blue-800 border-opacity-50" style={{ background: 'rgba(59,130,246,0.08)' }}>
                <FaCloudSun className="text-blue-400 flex-shrink-0" />
                <span>Weather loaded for <strong className="text-white">{selectedDistrict}</strong>. {t.noCrop}</span>
              </div>
            )}
            {selectedDistrict && hasCrop && (
              <div className="flex items-center gap-3 p-3 rounded-xl text-sm text-emerald-300 border border-emerald-800 border-opacity-50" style={{ background: 'rgba(16,185,129,0.08)' }}>
                <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                <span>Full analysis active: <strong className="text-white">{selectedCrop}</strong> × <strong className="text-white">{selectedDistrict}</strong> × <strong className="text-white">{modelCfg.name}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* ═══ WEATHER LOADING INDICATOR ═══ */}
        {weatherLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-emerald-300">
              <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Fetching live weather...</span>
            </div>
          </div>
        )}

        {/* ═══ TABS ═══ */}
        {hasWeather && !weatherLoading && (
          <div className="rounded-2xl shadow-2xl overflow-hidden border border-white border-opacity-5">

            {/* Tab bar */}
            <div className="flex overflow-x-auto border-b border-white border-opacity-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
              {TABS.map(tab => {
                const Icon   = tab.icon;
                const locked = tab.requiresCrop && !hasCrop;
                const label  = t[tab.id] || tab.id;
                return (
                  <button key={tab.id}
                    onClick={() => !locked && setActiveTab(tab.id)}
                    title={locked ? 'Select a crop to unlock' : label}
                    className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'border-emerald-400 text-emerald-300 bg-white bg-opacity-5'
                        : locked
                          ? 'border-transparent text-gray-600 cursor-not-allowed'
                          : 'border-transparent text-gray-400 hover:text-emerald-300 hover:bg-white hover:bg-opacity-5'
                    }`}>
                    <Icon size={14} />
                    <span>{label}</span>
                    {locked && <span className="text-xs ml-1 opacity-50">🔒</span>}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.02)' }}>

              {/* ══════════════════════════════════════════════════
                  OVERVIEW TAB
              ══════════════════════════════════════════════════ */}
              {activeTab === 'overview' && (
                <div className="space-y-8">

                  {/* ── COMPACT WEATHER ROW ── */}
                  <div className="rounded-2xl overflow-hidden border border-white border-opacity-6"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>

                    {/* Row header */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white border-opacity-5"
                      style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="flex items-center gap-2">
                        <BsCloudSunFill className="text-sky-400" size={13} />
                        <span className="text-xs font-bold text-gray-300">{t.currentWeather} — {selectedDistrict}</span>
                        <span className="text-xs text-gray-600 bg-gray-800 bg-opacity-60 px-2 py-0.5 rounded-md">{currentWeather?.Season}</span>
                        {currentWeather?.isRealTime
                          ? <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{t.realtime} · {currentWeather.fetchedAt}</span>
                          : <span className="text-xs text-gray-600">{t.historical}</span>}
                      </div>
                      {/* Anomaly badges */}
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        {weatherAnomalies.map((a, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full font-semibold border border-white border-opacity-10"
                            style={{ background: a.color + '22', color: a.color }}>
                            {a.val}
                          </span>
                        ))}
                        {historicalStats && (
                          <span className="text-xs px-2 py-0.5 rounded-full text-gray-600 border border-gray-800">
                            {historicalStats.years}yr avg: {historicalStats.avgTempMax}° / {historicalStats.avgHumidity}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Compact inline stat cells — all on ONE row, scrollable */}
                    <div className="flex items-stretch overflow-x-auto divide-x divide-white divide-opacity-5">

                      {/* Sky / Condition */}
                      <div className="flex items-center gap-2.5 px-4 py-2.5 flex-shrink-0 min-w-fit">
                        <WeatherIcon condition={currentWeather.Weather_Condition} size={34} />
                        <div>
                          <p className="text-xs text-gray-500 leading-none mb-0.5">{t.condition}</p>
                          <p className="text-sm font-bold text-white leading-none">{currentWeather.Weather_Condition}</p>
                        </div>
                      </div>

                      {/* Max / Min Temp */}
                      <div className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0">
                        <BsThermometerHigh className="text-red-400 flex-shrink-0" size={18} />
                        <div>
                          <p className="text-xs text-gray-500 leading-none mb-0.5">{t.maxTemp} / {t.minTemp}</p>
                          <p className="text-sm font-black text-red-300 leading-none">
                            {currentWeather.Temperature_Max_C}° <span className="text-xs font-normal text-blue-400">/ {currentWeather.Temperature_Min_C}°C</span>
                          </p>
                          {historicalStats && (
                            <p className="text-xs text-gray-600 leading-none mt-0.5">avg {historicalStats.avgTempMax}°C</p>
                          )}
                        </div>
                      </div>

                      {/* Avg Temp */}
                      <div className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0">
                        <FaThermometerHalf className="text-orange-400 flex-shrink-0" size={16} />
                        <div>
                          <p className="text-xs text-gray-500 leading-none mb-0.5">{t.avgTemp || 'Avg Temp'}</p>
                          <p className="text-sm font-black text-orange-300 leading-none">
                            {currentWeather.Temperature_Avg_C ?? ((currentWeather.Temperature_Max_C + currentWeather.Temperature_Min_C) / 2).toFixed(1)}°C
                          </p>
                        </div>
                      </div>

                      {/* Humidity */}
                      <div className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0">
                        <BsDropletFill className="text-cyan-400 flex-shrink-0" size={15} />
                        <div>
                          <p className="text-xs text-gray-500 leading-none mb-0.5">{t.humidity}</p>
                          <p className="text-sm font-black text-cyan-300 leading-none">{currentWeather.Humidity_Percent}%</p>
                          {historicalStats && (
                            <p className="text-xs text-gray-600 leading-none mt-0.5">avg {historicalStats.avgHumidity}%</p>
                          )}
                        </div>
                      </div>

                      {/* Rainfall */}
                      <div className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0">
                        <BsCloudRainHeavyFill className="text-blue-400 flex-shrink-0" size={15} />
                        <div>
                          <p className="text-xs text-gray-500 leading-none mb-0.5">{t.rainfall}</p>
                          <p className="text-sm font-black text-blue-300 leading-none">{currentWeather.Rainfall_mm} mm</p>
                          {historicalStats && (
                            <p className="text-xs text-gray-600 leading-none mt-0.5">avg {historicalStats.avgRainfall}mm</p>
                          )}
                        </div>
                      </div>

                      {/* Wind */}
                      <div className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0">
                        <FaWind className="text-gray-400 flex-shrink-0" size={14} />
                        <div>
                          <p className="text-xs text-gray-500 leading-none mb-0.5">{t.windSpeed}</p>
                          <p className="text-sm font-black text-gray-300 leading-none">{currentWeather.Wind_Speed_kmh} km/h</p>
                          {historicalStats && (
                            <p className="text-xs text-gray-600 leading-none mt-0.5">avg {historicalStats.avgWind} km/h</p>
                          )}
                        </div>
                      </div>

                      {/* Farm Health — inline if crop selected */}
                      {farmHealthScore && (
                        <div className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0 border-l-2"
                          style={{ borderColor: healthColor + '50' }}>
                          <LuActivity style={{ color: healthColor }} size={16} className="flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500 leading-none mb-0.5">{t.farmHealth}</p>
                            <p className="text-sm font-black leading-none" style={{ color: healthColor }}>{farmHealthScore.score}/100</p>
                            <p className="text-xs text-gray-600 leading-none mt-0.5">{farmHealthScore.status}</p>
                          </div>
                        </div>
                      )}

                      {/* Irrigation quick status — inline if crop selected */}
                      {irrigationAdvice && (
                        <div className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0">
                          <MdWaterDrop
                            size={17}
                            className={`flex-shrink-0 ${irrigationAdvice.shouldIrrigate ? 'text-blue-400 animate-pulse' : 'text-gray-600'}`}
                          />
                          <div>
                            <p className="text-xs text-gray-500 leading-none mb-0.5">Irrigation</p>
                            <p className={`text-sm font-black leading-none ${irrigationAdvice.shouldIrrigate ? 'text-blue-300' : 'text-emerald-400'}`}>
                              {irrigationAdvice.shouldIrrigate ? irrigationAdvice.waterAmount : 'Not needed'}
                            </p>
                            <p className="text-xs text-gray-600 leading-none mt-0.5">{irrigationAdvice.confidence}</p>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Farm Health Score (full card — only if no crop yet to avoid double) */}
                  {farmHealthScore && (
                    <div className="p-5 rounded-2xl border" style={{
                      background: `linear-gradient(135deg, ${healthColor}15, ${healthColor}05)`,
                      borderColor: `${healthColor}40`
                    }}>
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <FaChartLine style={{ color: healthColor }} />
                        {t.farmHealth} — {selectedCrop}
                      </h3>
                      <div className="flex items-center gap-6">
                        <div className="text-7xl font-black" style={{ color: healthColor, textShadow: `0 0 30px ${healthColor}60` }}>
                          {farmHealthScore.score}
                        </div>
                        <div className="flex-1">
                          <p className="text-2xl font-bold text-white">{farmHealthScore.status}</p>
                          <div className="mt-3 bg-gray-800 rounded-full h-3 w-full overflow-hidden">
                            <div className="h-3 rounded-full transition-all duration-1000" style={{ width: `${farmHealthScore.score}%`, background: `linear-gradient(90deg, ${healthColor}, ${healthColor}aa)`, boxShadow: `0 0 10px ${healthColor}80` }} />
                          </div>
                          <p className="text-xs text-gray-400 mt-2">Score based on weather conditions, crop requirements, and disease risk.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Risk Alerts */}
                  {riskAlerts.length > 0 && (
                    <div>
                      <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                        <div className="p-2 rounded-xl animate-pulse" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}><FaExclamationTriangle className="text-white text-xs" /></div>
                        Weather Alerts
                      </h3>
                      <div className="space-y-3">
                        {riskAlerts.map((alert, i) => (
                          <div key={i} className={`p-4 rounded-xl border-l-4 flex items-start gap-3 ${
                            alert.type === 'danger'  ? 'bg-red-950 bg-opacity-50 border-red-500'
                            : alert.type === 'warning' ? 'bg-yellow-950 bg-opacity-50 border-yellow-500'
                            : alert.type === 'info'    ? 'bg-blue-950 bg-opacity-50 border-blue-500'
                            : 'bg-emerald-950 bg-opacity-50 border-emerald-500'}`}>
                            <AlertIcon type={alert.iconType} />
                            <div>
                              <p className="font-bold text-white">{alert.title}</p>
                              <p className="text-sm text-gray-300 mt-0.5">{alert.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 7-Day Forecast Chart */}
                  {forecast.length > 0 && (
                    <div>
                      <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                        <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}><FaChartLine className="text-white text-xs" /></div>
                        {t.forecast}
                        {forecast[0]?.isHistorical && <span className="text-xs text-yellow-500 ml-2">(Historical reference)</span>}
                      </h3>
                      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <ResponsiveContainer width="100%" height={260}>
                          <AreaChart data={[...forecast].reverse()}>
                            <defs>
                              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="Date" tickFormatter={d => new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} stroke="#4b5563" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                            <YAxis yAxisId="left"  stroke="#4b5563" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#4b5563" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                            <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f3f4f6' }} />
                            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
                            <Area yAxisId="left"  type="monotone" dataKey="Temperature_Max_C" stroke="#ef4444" fill="url(#tempGrad)" strokeWidth={2} name="Max Temp (°C)" dot={{ r: 3, fill: '#ef4444' }} />
                            <Line  yAxisId="left"  type="monotone" dataKey="Temperature_Min_C" stroke="#3b82f6" strokeWidth={2} name="Min Temp (°C)" dot={{ r: 3 }} strokeDasharray="4 4" />
                            <Area yAxisId="right" type="monotone" dataKey="Rainfall_mm" stroke="#06b6d4" fill="url(#rainGrad)" strokeWidth={2} name="Rainfall (mm)" dot={{ r: 3, fill: '#06b6d4' }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Crop Suitability */}
                  {cropRecommendations && (
                    <div>
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}><GiWheat className="text-white text-sm" /></div>
                        Crop Suitability for {selectedDistrict} — {currentSeason}
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        {cropRecommendations.suitable.length > 0 && (
                          <div>
                            <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><FaCheckCircle size={10} /> {t.highlysuitable} ({cropRecommendations.suitable.length})</p>
                            <div className="space-y-2">
                              {cropRecommendations.suitable.map((c, i) => (
                                <div key={i} className="p-3 rounded-xl border border-emerald-800 border-opacity-60 hover:border-emerald-500 transition-all" style={{ background: 'rgba(16,185,129,0.08)' }}>
                                  <p className="font-bold text-white text-sm">{c.icon} {c.name}</p>
                                  <p className="text-xs text-gray-400 mt-1">{c.reason}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {cropRecommendations.caution.length > 0 && (
                          <div>
                            <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><MdWarning size={11} /> {t.withCaution} ({cropRecommendations.caution.length})</p>
                            <div className="space-y-2">
                              {cropRecommendations.caution.map((c, i) => (
                                <div key={i} className="p-3 rounded-xl border border-yellow-800 border-opacity-60" style={{ background: 'rgba(245,158,11,0.08)' }}>
                                  <p className="font-bold text-white text-sm">{c.icon} {c.name}</p>
                                  <p className="text-xs text-gray-400 mt-1">{c.reason}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {cropRecommendations.notRecommended.length > 0 && (
                          <div>
                            <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><FaExclamationTriangle size={10} /> {t.notRecommended} ({cropRecommendations.notRecommended.length})</p>
                            <div className="space-y-2">
                              {cropRecommendations.notRecommended.slice(0, 4).map((c, i) => (
                                <div key={i} className="p-3 rounded-xl border border-red-900 border-opacity-60" style={{ background: 'rgba(239,68,68,0.06)' }}>
                                  <p className="font-bold text-white text-sm">{c.icon} {c.name}</p>
                                  <p className="text-xs text-gray-400 mt-1">{c.reason}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Prompt to select crop */}
                  {!hasCrop && (
                    <div className="text-center py-12 rounded-2xl border border-dashed border-emerald-800 border-opacity-50" style={{ background: 'rgba(16,185,129,0.04)' }}>
                      <GiWheat className="text-emerald-800 text-5xl mx-auto mb-3" />
                      <p className="font-bold text-gray-300 text-lg">{t.noCrop}</p>
                      <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
                        Fertilizer schedules • Pest & disease alerts • Irrigation planning • Market prices • Yield estimation
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  FERTILIZER TAB
              ══════════════════════════════════════════════════ */}
              {activeTab === 'fertilizer' && hasCrop && fertilizerRec && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-bold text-white flex items-center gap-3">
                      <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}><FaFlask className="text-white" /></div>
                      Fertilizer Schedule — {selectedCrop}
                    </h2>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-900 text-purple-300 border border-purple-700">
                      Soil: {soilTypes.find(s => s.id === selectedSoil)?.label?.split('(')[0].trim()}
                    </span>
                  </div>

                  {fertilizerRec.weatherAdjustments.length > 0 && (
                    <div className="space-y-2">
                      {fertilizerRec.weatherAdjustments.map((adj, i) => (
                        <div key={i} className={`p-3 rounded-xl border-l-4 text-sm font-medium ${adj.type === 'warning' ? 'bg-orange-950 border-orange-500 text-orange-300' : 'bg-blue-950 border-blue-500 text-blue-300'}`}>
                          {adj.message}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="overflow-x-auto rounded-2xl border border-white border-opacity-8">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background: 'linear-gradient(90deg, #065f46, #064e3b)' }}>
                          <th className="p-3 text-left text-white font-bold">Stage / Timing</th>
                          <th className="p-3 text-center text-emerald-200 text-xs">N (kg/ha)</th>
                          <th className="p-3 text-center text-emerald-200 text-xs">P (kg/ha)</th>
                          <th className="p-3 text-center text-emerald-200 text-xs">K (kg/ha)</th>
                          <th className="p-3 text-center text-emerald-200 text-xs">Cost/ha (₹)</th>
                          <th className="p-3 text-left text-emerald-200 text-xs">Actual Fertilizers</th>
                          <th className="p-3 text-left text-emerald-200 text-xs">Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fertilizerRec.schedule.map((s, i) => (
                          <tr key={i} className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-3 transition-colors" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                            <td className="p-3">
                              <p className="font-semibold text-white">{s.stage}</p>
                              <p className="text-xs text-gray-500">Day {s.daysAfterSowing}</p>
                            </td>
                            <td className="p-3 text-center">
                              {s.N > 0 ? <span className="bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full text-xs font-bold">{s.N}</span> : <span className="text-gray-600">—</span>}
                            </td>
                            <td className="p-3 text-center">
                              {s.P > 0 ? <span className="bg-orange-900 text-orange-300 px-2 py-0.5 rounded-full text-xs font-bold">{s.P}</span> : <span className="text-gray-600">—</span>}
                            </td>
                            <td className="p-3 text-center">
                              {s.K > 0 ? <span className="bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full text-xs font-bold">{s.K}</span> : <span className="text-gray-600">—</span>}
                            </td>
                            <td className="p-3 text-center font-bold text-emerald-400">₹{s.totalCostPerHa?.toLocaleString('en-IN')}</td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1">
                                {s.actualFertilizers?.urea && <span className="bg-blue-900 bg-opacity-60 text-blue-300 text-xs px-2 py-0.5 rounded border border-blue-700">{s.actualFertilizers.urea}</span>}
                                {s.actualFertilizers?.dap  && <span className="bg-orange-900 bg-opacity-60 text-orange-300 text-xs px-2 py-0.5 rounded border border-orange-700">{s.actualFertilizers.dap}</span>}
                                {s.actualFertilizers?.mop  && <span className="bg-purple-900 bg-opacity-60 text-purple-300 text-xs px-2 py-0.5 rounded border border-purple-700">{s.actualFertilizers.mop}</span>}
                              </div>
                            </td>
                            <td className="p-3 text-xs text-gray-400 max-w-xs">{s.method}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: 'linear-gradient(90deg, #065f46, #064e3b)' }}>
                          <td className="p-3 font-bold text-white" colSpan={4}>Total Fertilizer Cost per Hectare</td>
                          <td className="p-3 text-center text-emerald-300 text-lg font-black">₹{fertilizerRec.totalFertilizerCost?.toLocaleString('en-IN')}</td>
                          <td colSpan={2} />
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Tips */}
                  <div className="grid md:grid-cols-2 gap-3">
                    {fertilizerRec.schedule.map((s, i) => (
                      <div key={i} className="p-4 rounded-xl border border-yellow-800 border-opacity-30" style={{ background: 'rgba(245,158,11,0.06)' }}>
                        <p className="font-semibold text-yellow-300 text-sm mb-1">{s.stage} <span className="text-xs text-gray-500">(Day {s.daysAfterSowing})</span></p>
                        <p className="text-xs text-yellow-200 opacity-80">💡 {s.tips}</p>
                      </div>
                    ))}
                  </div>

                  {/* Soil Adjustments */}
                  <div className="p-5 rounded-2xl border border-amber-800 border-opacity-40" style={{ background: 'rgba(217,119,6,0.08)' }}>
                    <h3 className="font-bold text-amber-300 mb-3">🌍 Soil-Based Adjustments</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {Object.entries(fertilizerRec.soilAdjustments).map(([k, v]) => (
                        <div key={k} className="p-3 rounded-xl border border-amber-800 border-opacity-30" style={{ background: 'rgba(0,0,0,0.2)' }}>
                          <p className="text-xs font-bold text-amber-500 uppercase mb-1">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <p className="text-sm text-gray-300">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  PEST & DISEASE TAB
              ══════════════════════════════════════════════════ */}
              {activeTab === 'pest' && hasCrop && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-3">
                    <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #ef4444, #ec4899)' }}><FaBug className="text-white" /></div>
                    Pest & Disease Risk — {selectedCrop} in {selectedDistrict}
                  </h2>

                  <div className="flex flex-wrap gap-4 p-3 rounded-xl text-xs text-gray-400 border border-white border-opacity-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span>🌡️ <strong className="text-white">{currentWeather.Temperature_Max_C}°C</strong></span>
                    <span>💧 <strong className="text-white">{currentWeather.Humidity_Percent}%</strong></span>
                    <span>🌧️ <strong className="text-white">{currentWeather.Rainfall_mm}mm</strong></span>
                    <span>Model: <strong className="text-white">{modelCfg.name}</strong></span>
                  </div>

                  {/* Disease Risks */}
                  <div>
                    <h3 className="font-bold text-white mb-3 text-sm">🦠 Disease Risk Assessment</h3>
                    {diseaseRisks.length > 0 ? (
                      <div className="space-y-4">
                        {diseaseRisks.map((d, i) => (
                          <div key={i} className="p-5 rounded-2xl border" style={{
                            background: d.riskLevel === 'high' ? 'rgba(239,68,68,0.08)' : d.riskLevel === 'medium' ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)',
                            borderColor: d.riskLevel === 'high' ? 'rgba(239,68,68,0.4)' : d.riskLevel === 'medium' ? 'rgba(245,158,11,0.4)' : 'rgba(16,185,129,0.4)'
                          }}>
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="font-bold text-white text-base">{d.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Severity: <span className={d.severity === 'high' ? 'text-red-400 font-semibold' : 'text-yellow-400 font-semibold'}>{d.severity}</span> | Risk score: {Math.round(d.riskScore)}/100</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${d.riskLevel === 'high' ? 'bg-red-900 text-red-300' : d.riskLevel === 'medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-emerald-900 text-emerald-300'}`}>{d.riskLevel}</span>
                            </div>
                            <div className="mb-3 bg-gray-800 rounded-full h-1.5">
                              <div className="h-1.5 rounded-full transition-all" style={{ width: `${Math.min(100, d.riskScore)}%`, background: d.riskLevel === 'high' ? '#ef4444' : d.riskLevel === 'medium' ? '#f59e0b' : '#10b981' }} />
                            </div>
                            <div className="grid md:grid-cols-3 gap-3">
                              {[
                                { label: "SYMPTOMS", text: d.symptoms },
                                { label: "TREATMENT", text: d.treatment || d.prevention[0] },
                                { label: "WHY RISKY NOW", text: d.reasons.join('. ') }
                              ].map((item, j) => (
                                <div key={j} className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                                  <p className="text-xs font-bold text-gray-500 mb-1">{item.label}</p>
                                  <p className="text-sm text-gray-300">{item.text}</p>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                              <p className="text-xs font-bold text-gray-500 mb-2">PREVENTION MEASURES</p>
                              <ul className="space-y-1">
                                {d.prevention.map((p, j) => (
                                  <li key={j} className="text-sm text-gray-300 flex items-start gap-2">
                                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">•</span><span>{p}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl text-center border border-emerald-800" style={{ background: 'rgba(16,185,129,0.06)' }}>
                        <FaCheckCircle className="text-emerald-500 text-4xl mx-auto mb-2" />
                        <p className="text-emerald-300 font-bold">Low Disease Risk</p>
                        <p className="text-gray-400 text-sm mt-1">Current conditions do not significantly trigger disease for {selectedCrop}.</p>
                      </div>
                    )}
                  </div>

                  {/* Pest Risks */}
                  <div>
                    <h3 className="font-bold text-white mb-3 text-sm">🐛 Pest Risk Assessment</h3>
                    {pestRisks.length > 0 ? (
                      <div className="space-y-4">
                        {pestRisks.map((p, i) => (
                          <div key={i} className="p-5 rounded-2xl border" style={{
                            background: 'rgba(249,115,22,0.07)',
                            borderColor: 'rgba(249,115,22,0.35)'
                          }}>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-bold text-white">{p.name}</p>
                                <p className="text-sm text-gray-400 mt-0.5">{p.symptoms}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.riskLevel === 'High' ? 'bg-orange-900 text-orange-300' : 'bg-yellow-900 text-yellow-300'}`}>{p.riskLevel}</span>
                            </div>
                            <div className="mb-3 bg-gray-800 rounded-full h-1.5">
                              <div className="h-1.5 rounded-full" style={{ width: `${p.riskScore}%`, background: p.riskLevel === 'High' ? '#f97316' : '#eab308' }} />
                            </div>
                            <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.25)' }}>
                              <p className="text-xs font-bold text-gray-500 mb-2">CONTROL MEASURES</p>
                              <ul className="space-y-1">
                                {p.control.map((c, j) => (
                                  <li key={j} className="text-sm text-gray-300 flex items-start gap-2">
                                    <span className="text-orange-400 flex-shrink-0">•</span><span>{c}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl text-center border border-emerald-800" style={{ background: 'rgba(16,185,129,0.06)' }}>
                        <FaCheckCircle className="text-emerald-500 text-4xl mx-auto mb-2" />
                        <p className="text-emerald-300 font-bold">Low Pest Risk</p>
                      </div>
                    )}
                  </div>

                  {/* Urgent Action Plan */}
                  {(preventiveMeasures.urgent.length > 0 || preventiveMeasures.recommended.length > 0) && (
                    <div className="p-5 rounded-2xl border border-red-800 border-opacity-50" style={{ background: 'rgba(239,68,68,0.07)' }}>
                      <h3 className="font-bold text-red-300 mb-4">⚡ Immediate Action Plan</h3>
                      {preventiveMeasures.urgent.length > 0 && (
                        <div className="mb-4">
                          <p className="font-semibold text-red-400 mb-2 text-sm">🚨 URGENT — Act within 24 hours:</p>
                          <ul className="space-y-2">
                            {preventiveMeasures.urgent.map((m, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
                                <span className="text-red-500 font-bold flex-shrink-0">!</span>
                                <div><span className="font-semibold text-red-300">{m.disease}:</span> <span className="text-gray-300">{m.measure}</span></div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {preventiveMeasures.recommended.length > 0 && (
                        <div>
                          <p className="font-semibold text-orange-400 mb-2 text-sm">📋 RECOMMENDED — This week:</p>
                          <ul className="space-y-2">
                            {preventiveMeasures.recommended.slice(0, 6).map((m, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
                                <span className="text-orange-400 flex-shrink-0">→</span>
                                <div><span className="font-semibold text-orange-300">{m.disease}:</span> <span className="text-gray-300">{m.measure}</span></div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  IRRIGATION TAB
              ══════════════════════════════════════════════════ */}
              {activeTab === 'irrigation' && hasCrop && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-3">
                    <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}><GiWateringCan className="text-white" /></div>
                    {t.irrigationSchedule} — {selectedCrop}
                  </h2>

                  {/* DAS display */}
                  <div className="p-5 rounded-2xl border border-blue-800 border-opacity-40" style={{ background: 'rgba(59,130,246,0.08)' }}>
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <label className="font-bold text-white">📅 {t.daysAfterSowing}</label>
                      {sowingDate ? (
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-black text-blue-400">{cropDAS}</span>
                          <span className="text-sm text-gray-400">days (sown: {new Date(sowingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <input type="number" min="0" max="365" value={cropDAS}
                            onChange={e => setCropDAS(Math.max(0, Math.min(365, Number(e.target.value))))}
                            className="w-20 px-3 py-2 rounded-xl text-center font-bold text-blue-300 text-lg focus:outline-none border border-blue-700"
                            style={{ background: 'rgba(59,130,246,0.15)', colorScheme: 'dark' }}
                          />
                          <span className="text-gray-400 text-sm">or set Sowing Date above for auto-calculation</span>
                        </div>
                      )}
                    </div>
                    {!sowingDate && (
                      <input type="range" min="0" max="180" value={cropDAS}
                        onChange={e => setCropDAS(Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-500" style={{ background: 'rgba(59,130,246,0.2)' }}
                      />
                    )}
                  </div>

                  {/* Today's Recommendation */}
                  {irrigationAdvice && (
                    <div className="p-6 rounded-2xl border" style={{
                      background: irrigationAdvice.shouldIrrigate ? 'rgba(59,130,246,0.08)' : 'rgba(16,185,129,0.08)',
                      borderColor: irrigationAdvice.shouldIrrigate ? 'rgba(59,130,246,0.4)' : 'rgba(16,185,129,0.4)'
                    }}>
                      <div className="flex items-start gap-4 mb-5">
                        {irrigationAdvice.shouldIrrigate
                          ? <GiWateringCan className="text-blue-400 text-5xl flex-shrink-0 animate-pulse" />
                          : <FaCheckCircle className="text-emerald-500 text-4xl flex-shrink-0 mt-1" />}
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {irrigationAdvice.shouldIrrigate ? `💧 ${t.irrigateNow}` : `✅ ${t.noIrrigate}`}
                          </h3>
                          {irrigationAdvice.urgency && (
                            <span className={`text-xs px-3 py-1 rounded-full font-bold inline-block mt-1 ${
                              irrigationAdvice.urgency === 'Urgent' ? 'bg-red-900 text-red-300'
                              : irrigationAdvice.urgency === 'Recommended' ? 'bg-blue-900 text-blue-300'
                              : 'bg-gray-800 text-gray-400'}`}>{irrigationAdvice.urgency}</span>
                          )}
                          <p className="text-gray-300 mt-2 text-sm">{irrigationAdvice.reason}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Water Amount", value: irrigationAdvice.waterAmount },
                          { label: "Best Time",    value: irrigationAdvice.timing || 'Not required' },
                          { label: "Confidence",   value: irrigationAdvice.confidence + ` (${modelCfg.name})` }
                        ].map((item, i) => (
                          <div key={i} className="p-3 rounded-xl text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                            <p className="text-xs text-gray-500 font-semibold">{item.label}</p>
                            <p className="text-sm font-bold text-white mt-1">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Growth Stage */}
                  {irrigationStages && (
                    <div className="p-5 rounded-2xl border" style={{
                      background: irrigationStages.isCritical ? 'rgba(239,68,68,0.08)' : 'rgba(6,182,212,0.08)',
                      borderColor: irrigationStages.isCritical ? 'rgba(239,68,68,0.4)' : 'rgba(6,182,212,0.4)'
                    }}>
                      <h3 className="font-bold mb-3 flex items-center gap-2 text-white">
                        {irrigationStages.isCritical ? <FaExclamationTriangle className="text-red-400" /> : <FaCheckCircle className="text-cyan-400" />}
                        {t.currentStage} at Day {cropDAS}: <span className={irrigationStages.isCritical ? 'text-red-300' : 'text-cyan-300'}>{irrigationStages.currentStage.stage}</span>
                        {irrigationStages.isCritical && <span className="bg-red-900 text-red-300 text-xs px-2 py-0.5 rounded-full font-bold">⚠️ CRITICAL</span>}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                          <p className="text-xs font-bold text-gray-500 mb-1">WATER REQUIREMENT</p>
                          <p className="text-sm text-white">{irrigationStages.recommendation}</p>
                        </div>
                        {irrigationStages.nextStage && (
                          <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                            <p className="text-xs font-bold text-gray-500 mb-1">NEXT STAGE</p>
                            <p className="text-sm font-semibold text-white">{irrigationStages.nextStage.stage}</p>
                            <p className="text-xs text-gray-400">{irrigationStages.nextStage.waterNeed}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Full Growth Timeline */}
                  {crop?.growthStages && (
                    <div>
                      <h3 className="font-bold text-white mb-3">📋 Full Irrigation Timeline</h3>
                      <div className="overflow-x-auto rounded-2xl border border-white border-opacity-8">
                        <table className="w-full text-sm">
                          <thead>
                            <tr style={{ background: 'linear-gradient(90deg, #1e3a5f, #1e3a3f)' }}>
                              <th className="p-3 text-left text-white">Growth Stage</th>
                              <th className="p-3 text-center text-blue-200 text-xs">Days</th>
                              <th className="p-3 text-center text-blue-200 text-xs">Critical?</th>
                              <th className="p-3 text-left text-blue-200 text-xs">Water Requirement</th>
                            </tr>
                          </thead>
                          <tbody>
                            {crop.growthStages.map((s, i) => {
                              const parts  = s.days.split('-').map(Number);
                              const start  = parts[0] || 0;
                              const end    = parts.length > 1 ? parts[1] : parts[0];
                              const isCurr = cropDAS >= start && cropDAS <= end;
                              return (
                                <tr key={i} className="border-b border-white border-opacity-5 transition-colors" style={{ background: isCurr ? 'rgba(234,179,8,0.12)' : i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                                  <td className="p-3">
                                    <div className="flex items-center gap-2">
                                      {isCurr && <span className="bg-yellow-500 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold shrink-0">◀ DAY {cropDAS}</span>}
                                      <span className={isCurr ? 'text-yellow-300 font-semibold' : 'text-gray-300'}>{s.stage}</span>
                                    </div>
                                  </td>
                                  <td className="p-3 text-center text-gray-400 text-xs">{s.days}</td>
                                  <td className="p-3 text-center">
                                    {s.criticalWater
                                      ? <span className="bg-red-900 text-red-300 text-xs px-2 py-0.5 rounded-full font-bold">⚠️ YES</span>
                                      : <span className="bg-gray-800 text-gray-500 text-xs px-2 py-0.5 rounded-full">No</span>}
                                  </td>
                                  <td className="p-3 text-gray-300 text-sm">{s.waterNeed}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  WEATHER ADVISORY TAB
              ══════════════════════════════════════════════════ */}
              {activeTab === 'advisory' && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold text-white flex items-center gap-3">
                    <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}><FaCloudSun className="text-white" /></div>
                    Weather Advisory — {selectedDistrict}{hasCrop ? ` · ${selectedCrop}` : ''} [{modelCfg.name}]
                  </h2>
                  {weatherAdvisory.length > 0 ? weatherAdvisory.map((adv, i) => (
                    <div key={i} className="p-5 rounded-2xl border" style={{
                      background: adv.severity === 'high' ? 'rgba(239,68,68,0.07)' : adv.severity === 'medium' ? 'rgba(245,158,11,0.07)' : 'rgba(16,185,129,0.07)',
                      borderColor: adv.severity === 'high' ? 'rgba(239,68,68,0.35)' : adv.severity === 'medium' ? 'rgba(245,158,11,0.35)' : 'rgba(16,185,129,0.35)'
                    }}>
                      <div className="flex items-start gap-4">
                        <div className="text-3xl flex-shrink-0">{adv.icon}</div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <p className="font-bold text-white">{adv.title}</p>
                            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{adv.category}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${adv.severity === 'high' ? 'bg-red-900 text-red-300' : adv.severity === 'medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-emerald-900 text-emerald-300'}`}>{adv.severity.toUpperCase()}</span>
                          </div>
                          <p className="text-gray-300 text-sm mb-3">{adv.advice}</p>
                          <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.25)' }}>
                            <p className="text-xs font-bold text-gray-500">✅ ACTION: <span className="font-normal text-gray-300">{adv.action}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center rounded-2xl border border-emerald-800" style={{ background: 'rgba(16,185,129,0.06)' }}>
                      <FaCheckCircle className="text-emerald-500 text-5xl mx-auto mb-3" />
                      <p className="font-bold text-emerald-300">All conditions normal</p>
                    </div>
                  )}

                  {/* Sustainability Tips */}
                  {sustainabilityTips.length > 0 && (
                    <div>
                      <h3 className="font-bold text-white mb-3">🌿 Sustainability Tips</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {sustainabilityTips.map((tip, i) => (
                          <div key={i} className="p-4 rounded-xl border border-emerald-800 border-opacity-30" style={{ background: 'rgba(16,185,129,0.05)' }}>
                            <p className="text-xs font-bold text-emerald-500 uppercase mb-1">{tip.category}</p>
                            <p className="text-sm text-gray-300">{tip.tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  MARKET TAB
              ══════════════════════════════════════════════════ */}
              {activeTab === 'market' && hasCrop && marketIntel && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-3">
                    <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #f97316, #eab308)' }}><FaShoppingCart className="text-white" /></div>
                    Market Intelligence — {selectedCrop}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'MSP (Govt)',  value: marketIntel.MSP ? `₹${marketIntel.MSP}` : 'N/A', color: 'from-emerald-800 to-emerald-900', border: 'border-emerald-700' },
                      { label: 'Min Market', value: `₹${marketIntel.currentPriceRange.min}`, color: 'from-blue-800 to-blue-900', border: 'border-blue-700' },
                      { label: 'Max Market', value: `₹${marketIntel.currentPriceRange.max}`, color: 'from-purple-800 to-purple-900', border: 'border-purple-700' },
                      { label: 'Avg Price',  value: `₹${marketIntel.avgPrice}`, color: 'from-orange-800 to-orange-900', border: 'border-orange-700' },
                    ].map((card, i) => (
                      <div key={i} className={`p-5 bg-gradient-to-br ${card.color} text-white rounded-2xl text-center border ${card.border}`}>
                        <p className="text-xs opacity-70">{card.label}</p>
                        <p className="text-2xl font-black mt-1">{card.value}</p>
                        <p className="text-xs opacity-60">per quintal</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 rounded-2xl border" style={{
                    background: marketIntel.isBestMonth ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                    borderColor: marketIntel.isBestMonth ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)'
                  }}>
                    <h3 className="font-bold text-white mb-2">📈 Selling Recommendation</h3>
                    <p className="text-gray-200 font-medium text-sm">{marketIntel.sellRecommendation}</p>
                    <div className="mt-3 grid md:grid-cols-2 gap-3">
                      {[
                        { label: "Weather Impact on Sale", text: marketIntel.weatherImpact },
                        { label: "MSP / Pricing Advice",   text: marketIntel.priceAdvice }
                      ].map((item, i) => (
                        <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                          <p className="font-bold text-gray-400 text-xs mb-1">{item.label}</p>
                          <p className="text-gray-300 text-sm">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="p-5 rounded-2xl border border-white border-opacity-8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <h3 className="font-bold text-white mb-3">🏪 Major Markets in West Bengal</h3>
                      <div className="space-y-2">
                        {marketIntel.majorMarkets.map((m, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <FaMapMarkerAlt className="text-red-400 flex-shrink-0 text-xs" />
                            <span className="text-sm text-white">{m}</span>
                            {i === 0 && <span className="text-xs bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-full ml-auto">Nearest</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl border border-white border-opacity-8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <h3 className="font-bold text-white mb-3">📅 Best Months to Sell</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {marketIntel.bestSellMonths.map((m, i) => (
                          <span key={i} className="px-3 py-1 bg-emerald-900 text-emerald-300 rounded-full font-semibold text-sm border border-emerald-700">{m}</span>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: "Demand Trend", value: marketIntel.demandTrend },
                          { label: "Export Potential", value: marketIntel.exportPotential }
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between p-2 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <span className="text-gray-400">{item.label}</span>
                            <span className={`font-bold ${item.value.includes('High') || item.value.includes('Very') ? 'text-emerald-400' : 'text-gray-300'}`}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  YIELD CALCULATOR TAB
              ══════════════════════════════════════════════════ */}
              {activeTab === 'yieldCalc' && hasCrop && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-3">
                    <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}><FaRupeeSign className="text-white" /></div>
                    {t.yieldCalc} — {selectedCrop}
                  </h2>

                  {/* Input cards */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl border border-white border-opacity-8 col-span-full md:col-span-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Field Configuration</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-500 font-semibold mb-1 block">{t.fieldSize}</label>
                          <div className="flex gap-2">
                            <input type="number" min="0.1" step="0.1" value={fieldSize} onChange={e => setFieldSize(e.target.value)}
                              className="flex-1 px-3 py-2 rounded-xl text-sm text-white border border-white border-opacity-10 focus:outline-none focus:border-emerald-500"
                              style={{ background: 'rgba(255,255,255,0.06)', colorScheme: 'dark' }}
                            />
                            <select value={fieldUnit} onChange={e => setFieldUnit(e.target.value)}
                              className="w-24 px-2 py-2 rounded-xl text-xs text-white border border-white border-opacity-10 cursor-pointer"
                              style={{ background: 'rgba(255,255,255,0.08)' }}>
                              <option value="bigha" style={{ background: '#1a1a2e' }}>Bigha</option>
                              <option value="acre"  style={{ background: '#1a1a2e' }}>Acre</option>
                              <option value="hectare" style={{ background: '#1a1a2e' }}>Hectare</option>
                              <option value="katha" style={{ background: '#1a1a2e' }}>Katha</option>
                            </select>
                          </div>
                        </div>
                        {yieldEstimation && (
                          <div className="p-3 rounded-xl border border-emerald-800 border-opacity-40" style={{ background: 'rgba(16,185,129,0.06)' }}>
                            <p className="text-xs text-gray-500 mb-1">Area in hectares</p>
                            <p className="text-lg font-bold text-emerald-400">{yieldEstimation.hectares} ha</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Result cards */}
                    {yieldEstimation && (
                      <div className="col-span-full md:col-span-2 grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl text-center border" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))', borderColor: 'rgba(16,185,129,0.4)' }}>
                          <p className="text-xs text-gray-400 font-semibold uppercase">{t.estYield}</p>
                          <p className="text-5xl font-black text-emerald-400 mt-2" style={{ textShadow: '0 0 30px rgba(16,185,129,0.5)' }}>{yieldEstimation.estimatedYield}</p>
                          <p className="text-emerald-300 text-sm mt-1">tonnes from {yieldEstimation.areaLabel}</p>
                        </div>
                        <div className="p-5 rounded-2xl text-center border" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))', borderColor: 'rgba(245,158,11,0.4)' }}>
                          <p className="text-xs text-gray-400 font-semibold uppercase">{t.estRevenue}</p>
                          <p className="text-3xl font-black text-yellow-400 mt-2" style={{ textShadow: '0 0 30px rgba(245,158,11,0.4)' }}>₹{yieldEstimation.revenueEstimate.toLocaleString('en-IN')}</p>
                          <p className="text-yellow-300 text-sm mt-1">@ ₹{yieldEstimation.pricePerTonne.toLocaleString('en-IN')}/tonne</p>
                        </div>
                        <div className="col-span-2 p-4 rounded-2xl border border-white border-opacity-8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Adjustment Factors</h4>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { label: "Base Yield",    value: `${yieldEstimation.baseYield} t/ha`, desc: `${crop.name} average` },
                              { label: "Weather Factor",value: `${yieldEstimation.weatherFactor}%`,  desc: yieldEstimation.weatherFactor >= 100 ? 'Favorable' : 'Adjusted down' },
                              { label: "Disease Factor",value: `${yieldEstimation.diseaseFactor}%`,  desc: yieldEstimation.diseaseFactor >= 100 ? 'No impact' : 'Risk impact' },
                            ].map((item, i) => (
                              <div key={i} className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                <p className="text-xs text-gray-500 font-semibold">{item.label}</p>
                                <p className="text-lg font-bold text-white mt-1">{item.value}</p>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                              </div>
                            ))}
                          </div>
                          <div className={`mt-3 p-3 rounded-xl text-sm ${yieldEstimation.totalFactor >= 100 ? 'bg-emerald-900 bg-opacity-40 text-emerald-300 border border-emerald-800' : 'bg-yellow-900 bg-opacity-30 text-yellow-300 border border-yellow-800'}`}>
                            ℹ️ {yieldEstimation.confidenceNote}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Market comparison */}
                  {marketIntel && yieldEstimation && (
                    <div className="p-5 rounded-2xl border border-white border-opacity-8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <h3 className="font-bold text-white mb-4">📊 Revenue Scenarios</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        {[
                          { label: 'Low Price',   price: marketIntel.currentPriceRange.min, color: 'text-red-400',    bgColor: 'rgba(239,68,68,0.08)',    border: 'rgba(239,68,68,0.3)' },
                          { label: 'Avg Price',   price: marketIntel.avgPrice,              color: 'text-yellow-400', bgColor: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.3)' },
                          { label: 'High Price',  price: marketIntel.currentPriceRange.max, color: 'text-emerald-400',bgColor: 'rgba(16,185,129,0.08)',   border: 'rgba(16,185,129,0.3)' },
                        ].map((scenario, i) => {
                          const revenue = Math.round(yieldEstimation.estimatedYield * scenario.price * 10);
                          return (
                            <div key={i} className="p-4 rounded-2xl border text-center" style={{ background: scenario.bgColor, borderColor: scenario.border }}>
                              <p className="text-xs text-gray-400 font-semibold">{scenario.label}</p>
                              <p className="text-sm text-gray-300">₹{scenario.price}/quintal</p>
                              <p className={`text-2xl font-black mt-2 ${scenario.color}`}>₹{revenue.toLocaleString('en-IN')}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  FULL REPORT TAB
              ══════════════════════════════════════════════════ */}
              {activeTab === 'report' && hasCrop && (
                <div className="space-y-6">
                  {/* Report Header */}
                  <div className="p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, #111827, #1f2937)' }}>
                    <h2 className="text-xl font-bold text-white mb-1">📊 Comprehensive Agricultural Report</h2>
                    <p className="text-gray-400 text-sm">Crop: <strong className="text-white">{selectedCrop}</strong> | District: <strong className="text-white">{selectedDistrict}</strong> | Season: <strong className="text-white">{currentSeason}</strong></p>
                    <p className="text-gray-400 text-sm">Model: <strong className="text-white">{modelCfg.name}</strong> | Field: <strong className="text-white">{fieldSize} {fieldUnit}</strong> | Generated: {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    {currentWeather?.isRealTime && <p className="text-emerald-400 text-xs mt-1">🟢 Live weather data as of {currentWeather.fetchedAt}</p>}
                  </div>

                  {/* Summary Score Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {farmHealthScore && (
                      <div className="p-4 rounded-2xl text-center border" style={{ background: `${healthColor}18`, borderColor: `${healthColor}40` }}>
                        <p className="text-xs font-semibold text-gray-400">Farm Health</p>
                        <p className="text-4xl font-black mt-1" style={{ color: healthColor }}>{farmHealthScore.score}</p>
                        <p className="text-sm font-bold text-white">{farmHealthScore.status}</p>
                      </div>
                    )}
                    {irrigationAdvice && (
                      <div className="p-4 rounded-2xl text-center border" style={{ background: irrigationAdvice.shouldIrrigate ? 'rgba(59,130,246,0.12)' : 'rgba(16,185,129,0.12)', borderColor: irrigationAdvice.shouldIrrigate ? 'rgba(59,130,246,0.4)' : 'rgba(16,185,129,0.4)' }}>
                        <p className="text-xs font-semibold text-gray-400">Irrigation</p>
                        <p className={`text-lg font-black mt-1 ${irrigationAdvice.shouldIrrigate ? 'text-blue-400' : 'text-emerald-400'}`}>{irrigationAdvice.shouldIrrigate ? irrigationAdvice.waterAmount : 'Not Needed'}</p>
                        <p className="text-xs text-gray-400">{irrigationAdvice.confidence}</p>
                      </div>
                    )}
                    <div className="p-4 rounded-2xl text-center border" style={{ background: diseaseRisks.filter(d => d.riskLevel === 'high').length > 0 ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', borderColor: diseaseRisks.filter(d => d.riskLevel === 'high').length > 0 ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)' }}>
                      <p className="text-xs font-semibold text-gray-400">Disease Risks</p>
                      <p className={`text-4xl font-black mt-1 ${diseaseRisks.filter(d => d.riskLevel === 'high').length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{diseaseRisks.length}</p>
                      <p className="text-xs text-gray-400">{diseaseRisks.filter(d => d.riskLevel === 'high').length} high risk</p>
                    </div>
                    {yieldEstimation && (
                      <div className="p-4 rounded-2xl text-center border border-yellow-800 border-opacity-40" style={{ background: 'rgba(245,158,11,0.12)' }}>
                        <p className="text-xs font-semibold text-gray-400">Est. Revenue</p>
                        <p className="text-lg font-black mt-1 text-yellow-400">₹{(yieldEstimation.revenueEstimate / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-gray-400">{yieldEstimation.estimatedYield}t from {yieldEstimation.areaLabel}</p>
                      </div>
                    )}
                  </div>

                  {/* Fertilizer Summary */}
                  {fertilizerRec && (
                    <div className="p-5 rounded-2xl border border-yellow-800 border-opacity-30" style={{ background: 'rgba(245,158,11,0.06)' }}>
                      <h3 className="font-bold text-white mb-2">🌿 Fertilizer Plan Summary</h3>
                      <p className="text-sm text-gray-300 mb-3">{fertilizerRec.schedule.length} application stages · Total: <strong className="text-emerald-400">₹{fertilizerRec.totalFertilizerCost?.toLocaleString('en-IN')}/ha</strong></p>
                      <div className="flex flex-wrap gap-2">
                        {fertilizerRec.schedule.map((s, i) => (
                          <div key={i} className="px-3 py-2 rounded-lg border border-yellow-800 border-opacity-30 text-xs" style={{ background: 'rgba(245,158,11,0.08)' }}>
                            <p className="font-bold text-yellow-300">{s.stage}</p>
                            <p className="text-yellow-600">Day {s.daysAfterSowing} · ₹{s.totalCostPerHa}/ha</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pest & Disease Summary */}
                  <div className="p-5 rounded-2xl border border-red-900 border-opacity-30" style={{ background: 'rgba(239,68,68,0.05)' }}>
                    <h3 className="font-bold text-white mb-3">🦠 Pest & Disease Summary</h3>
                    {diseaseRisks.length === 0 && pestRisks.length === 0
                      ? <p className="text-emerald-400 text-sm">✅ No significant risks under current weather conditions.</p>
                      : (
                        <div className="space-y-2">
                          {[...diseaseRisks, ...pestRisks].map((d, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                              <span className="text-sm text-white">{d.name}</span>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                (d.riskLevel === 'high' || d.riskLevel === 'High')   ? 'bg-red-900 text-red-300'
                                : (d.riskLevel === 'medium' || d.riskLevel === 'Medium') ? 'bg-yellow-900 text-yellow-300'
                                : 'bg-emerald-900 text-emerald-300'}`}>{(d.riskLevel || '').toUpperCase()}</span>
                            </div>
                          ))}
                        </div>
                      )
                    }
                  </div>

                  {/* Market Summary */}
                  {marketIntel && (
                    <div className="p-5 rounded-2xl border border-orange-800 border-opacity-30" style={{ background: 'rgba(249,115,22,0.05)' }}>
                      <h3 className="font-bold text-white mb-2">📈 Market Summary</h3>
                      <p className="text-sm text-gray-300">{marketIntel.sellRecommendation}</p>
                      <div className="flex flex-wrap gap-3 mt-3 text-sm">
                        <span className="text-gray-400">Nearest market: <strong className="text-white">{marketIntel.nearestMarket}</strong></span>
                        <span className="text-gray-400">Avg price: <strong className="text-emerald-400">₹{marketIntel.avgPrice}/quintal</strong></span>
                        <span className="text-gray-400">Demand: <strong className="text-white">{marketIntel.demandTrend}</strong></span>
                      </div>
                    </div>
                  )}

                  {/* Share */}
                  <div className="flex justify-center">
                    <button onClick={shareToWhatsApp} className="flex items-center gap-3 px-8 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105 active:scale-95"
                      style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 4px 20px rgba(34,197,94,0.3)' }}>
                      <span>📱</span>
                      <span>Share Report via WhatsApp</span>
                    </button>
                  </div>

                  <div className="text-center py-2 text-xs text-gray-600">
                    Generated by KrishiMitra — {modelCfg.name} Model · {new Date().toLocaleString('en-IN')}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Empty state */}
        {!hasWeather && !loading && !weatherLoading && (
          <div className="text-center py-20 rounded-2xl border border-white border-opacity-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="w-20 h-20 rounded-full border border-emerald-800 flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
                <FaSeedling className="text-emerald-600 text-3xl" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-400">{t.noDistrict}</p>
            <p className="text-gray-600 mt-2 text-sm max-w-md mx-auto">
              Select your district → crop → model to get started with real-time weather, fertilizer, pest alerts, irrigation, market prices and yield estimation.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-gray-700 text-xs">© 2025 KrishiMitra — West Bengal Smart Agriculture Advisory · Powered by Open-Meteo & Real Data</p>
        </div>
      </div>

      {/* Language menu outside-click overlay */}
    </div>
  );
}