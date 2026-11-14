/**
 * Sukoon Temple (Spritual Sanctum)
 * Full-Featured Vedic Engine, Panchang, Live Status & Timezone Sync
 * Pure Vanilla JavaScript & Bootstrap 5 Compatible
 */

// =========================================================================
// 1. GLOBAL COUNTRY & TIMEZONE CATALOG (18 Devotee Nations)
// =========================================================================
const ALL_COUNTRIES = [
  { code: 'IN', name: 'India', hindi: 'भारत (तीर्थ धाम)', flag: '🇮🇳', tz: 'Asia/Kolkata', tzName: 'IST (UTC+5:30)', phone: '+91', currency: '₹' },
  { code: 'US-NY', name: 'USA (Eastern - NY)', hindi: 'अमेरिका (न्यूयॉर्क)', flag: '🇺🇸', tz: 'America/New_York', tzName: 'EST / EDT (UTC-5 / -4)', phone: '+1', currency: '$' },
  { code: 'US-CHI', name: 'USA (Central - Chicago)', hindi: 'अमेरिका (शिकागो)', flag: '🇺🇸', tz: 'America/Chicago', tzName: 'CST / CDT (UTC-6 / -5)', phone: '+1', currency: '$' },
  { code: 'US-LA', name: 'USA (Pacific - LA)', hindi: 'अमेरिका (लॉस एंजेलिस)', flag: '🇺🇸', tz: 'America/Los_Angeles', tzName: 'PST / PDT (UTC-8 / -7)', phone: '+1', currency: '$' },
  { code: 'GB', name: 'United Kingdom (London)', hindi: 'यूनाइटेड किंगडम (लंदन)', flag: '🇬🇧', tz: 'Europe/London', tzName: 'GMT / BST (UTC+0 / +1)', phone: '+44', currency: '£' },
  { code: 'CA-TOR', name: 'Canada (Toronto)', hindi: 'कनाडा (टोरंटो)', flag: '🇨🇦', tz: 'America/Toronto', tzName: 'EST / EDT (UTC-5 / -4)', phone: '+1', currency: 'C$' },
  { code: 'CA-VAN', name: 'Canada (Vancouver)', hindi: 'कनाडा (वैंकूवर)', flag: '🇨🇦', tz: 'America/Vancouver', tzName: 'PST / PDT (UTC-8 / -7)', phone: '+1', currency: 'C$' },
  { code: 'AU-SYD', name: 'Australia (Sydney)', hindi: 'ऑस्ट्रेलिया (सिडनी)', flag: '🇦🇺', tz: 'Australia/Sydney', tzName: 'AEST / AEDT (UTC+10 / +11)', phone: '+61', currency: 'A$' },
  { code: 'AU-PER', name: 'Australia (Perth)', hindi: 'ऑस्ट्रेलिया (पर्थ)', flag: '🇦🇺', tz: 'Australia/Perth', tzName: 'AWST (UTC+8)', phone: '+61', currency: 'A$' },
  { code: 'AE', name: 'United Arab Emirates (Dubai)', hindi: 'संयुक्त अरब अमीरात (दुबई)', flag: '🇦🇪', tz: 'Asia/Dubai', tzName: 'GST (UTC+4)', phone: '+971', currency: 'AED' },
  { code: 'SG', name: 'Singapore', hindi: 'सिंगापुर', flag: '🇸🇬', tz: 'Asia/Singapore', tzName: 'SGT (UTC+8)', phone: '+65', currency: 'S$' },
  { code: 'MY', name: 'Malaysia (Kuala Lumpur)', hindi: 'मलेशिया', flag: '🇲🇾', tz: 'Asia/Kuala_Lumpur', tzName: 'MYT (UTC+8)', phone: '+60', currency: 'RM' },
  { code: 'MU', name: 'Mauritius (Port Louis)', hindi: 'मॉरीशस', flag: '🇲🇺', tz: 'Indian/Mauritius', tzName: 'MUT (UTC+4)', phone: '+230', currency: 'Rs' },
  { code: 'NZ', name: 'New Zealand (Auckland)', hindi: 'न्यूजीलैंड (ऑकलैंड)', flag: '🇳🇿', tz: 'Pacific/Auckland', tzName: 'NZST / NZDT (UTC+12 / +13)', phone: '+64', currency: 'NZ$' },
  { code: 'ZA', name: 'South Africa (Johannesburg)', hindi: 'दक्षिण अफ्रीका', flag: '🇿🇦', tz: 'Africa/Johannesburg', tzName: 'SAST (UTC+2)', phone: '+27', currency: 'R' },
  { code: 'FJ', name: 'Fiji (Suva)', hindi: 'फ़िजी', flag: '🇫🇯', tz: 'Pacific/Fiji', tzName: 'FJT (UTC+12)', phone: '+679', currency: 'FJ$' },
  { code: 'DE', name: 'Germany (Berlin / Frankfurt)', hindi: 'जर्मनी', flag: '🇩🇪', tz: 'Europe/Berlin', tzName: 'CET / CEST (UTC+1 / +2)', phone: '+49', currency: '€' }
];

let selectedCountryCode = localStorage.getItem('sukoon_country') || 'IN';

function getSelectedCountry() {
  return ALL_COUNTRIES.find(c => c.code === selectedCountryCode) || ALL_COUNTRIES[0];
}

function setSelectedCountry(code) {
  selectedCountryCode = code;
  localStorage.setItem('sukoon_country', code);
  window.dispatchEvent(new CustomEvent('countryChanged', { detail: getSelectedCountry() }));
}

// Convert IST "06:15 AM" or "11:45 AM - 12:35 PM" into Devotee Country Local Time
function convertIstTimeToLocal(istTimeStr, targetCountry) {
  if (!targetCountry || targetCountry.code === 'IN') return istTimeStr;
  try {
    const parts = istTimeStr.split('-').map(s => s.trim());
    const converted = parts.map(part => {
      const match = part.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return part;
      let hr = parseInt(match[1], 10);
      const min = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && hr < 12) hr += 12;
      if (ampm === 'AM' && hr === 12) hr = 0;

      // Construct a Date object in IST
      const now = new Date();
      // IST offset is +05:30 = 330 minutes
      const istDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hr - 5, min - 30));
      return istDate.toLocaleTimeString('en-US', {
        timeZone: targetCountry.tz,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    });
    return converted.join(' - ');
  } catch (e) {
    return istTimeStr;
  }
}

// =========================================================================
// 2. ASTRONOMICAL VEDIC PANCHANG ENGINE (Works across 2020 - 2045)
// =========================================================================
const HINDU_MONTHS = [
  { en: 'Chaitra', hi: 'चैत्र' },
  { en: 'Vaishakha', hi: 'वैशाख' },
  { en: 'Jyeshtha', hi: 'ज्येष्ठ' },
  { en: 'Ashadha', hi: 'आषाढ़' },
  { en: 'Shravana', hi: 'श्रावण' },
  { en: 'Bhadrapada', hi: 'भाद्रपद' },
  { en: 'Ashwina', hi: 'अश्विन' },
  { en: 'Kartika', hi: 'कार्तिक' },
  { en: 'Margashirsha', hi: 'मार्गशीर्ष' },
  { en: 'Pausha', hi: 'पौष' },
  { en: 'Magha', hi: 'माघ' },
  { en: 'Phalguna', hi: 'फाल्गुन' }
];

const NAKSHATRAS = [
  { name: 'Ashwini', hindi: 'अश्विनी' }, { name: 'Bharani', hindi: 'भरणी' }, { name: 'Krittika', hindi: 'कृत्तिका' },
  { name: 'Rohini', hindi: 'रोहिणी' }, { name: 'Mrigashira', hindi: 'मृगशिरा' }, { name: 'Ardra', hindi: 'आर्द्रा' },
  { name: 'Punarvasu', hindi: 'पुनर्वसु' }, { name: 'Pushya', hindi: 'पुष्य' }, { name: 'Ashlesha', hindi: 'आश्लेषा' },
  { name: 'Magha', hindi: 'मघा' }, { name: 'Purva Phalguni', hindi: 'पूर्वाफाल्गुनी' }, { name: 'Uttara Phalguni', hindi: 'उत्तराफाल्गुनी' },
  { name: 'Hasta', hindi: 'हस्त' }, { name: 'Chitra', hindi: 'चित्रा' }, { name: 'Swati', hindi: 'स्वाति' },
  { name: 'Vishakha', hindi: 'विशाखा' }, { name: 'Anuradha', hindi: 'अनुराधा' }, { name: 'Jyeshtha', hindi: 'ज्येष्ठा' },
  { name: 'Mula', hindi: 'मूल' }, { name: 'Purva Ashadha', hindi: 'पूर्वाषाढ़ा' }, { name: 'Uttara Ashadha', hindi: 'उत्तराषाढ़ा' },
  { name: 'Shravana', hindi: 'श्रवण' }, { name: 'Dhanishta', hindi: 'धनिष्ठा' }, { name: 'Shatabhisha', hindi: 'शतभिषा' },
  { name: 'Purva Bhadrapada', hindi: 'पूर्वभाद्रपद' }, { name: 'Uttara Bhadrapada', hindi: 'उत्तरभाद्रपद' }, { name: 'Revati', hindi: 'रेवती' }
];

const TITHI_NAMES = ['', 'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima'];
const TITHI_HINDI = ['', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा'];

const RAHU_KAAL_BY_DAY = [
  '04:30 PM - 06:00 PM', // Sun
  '07:30 AM - 09:00 AM', // Mon
  '03:00 PM - 04:30 PM', // Tue
  '12:00 PM - 01:30 PM', // Wed
  '01:30 PM - 03:00 PM', // Thu
  '10:30 AM - 12:00 PM', // Fri
  '09:00 AM - 10:30 AM'  // Sat
];

const EKADASHI_NAMES = {
  'Chaitra': { 'Shukla': 'कामदा एकादशी (Kamada)', 'Krishna': 'वरूथिनी एकादशी (Varuthini)' },
  'Vaishakha': { 'Shukla': 'मोहिनी एकादशी (Mohini)', 'Krishna': 'अपरा एकादशी (Apara)' },
  'Jyeshtha': { 'Shukla': 'निर्जला महा एकादशी (Nirjala)', 'Krishna': 'योगिनी एकादशी (Yogini)' },
  'Ashadha': { 'Shukla': 'देवशयनी एकादशी (Devshayani)', 'Krishna': 'कामिका एकादशी (Kamika)' },
  'Shravana': { 'Shukla': 'पुत्रदा एकादशी (Shravana Putrada)', 'Krishna': 'अजा एकादशी (Aja)' },
  'Bhadrapada': { 'Shukla': 'परिवर्तिनी एकादशी (Parsva)', 'Krishna': 'इन्दिरा एकादशी (Indira)' },
  'Ashwina': { 'Shukla': 'पापांकुशा एकादशी (Papankusha)', 'Krishna': 'रमा एकादशी (Rama)' },
  'Kartika': { 'Shukla': 'देवउठनी प्रबोधिनी एकादशी (Dev Uthani)', 'Krishna': 'उत्पन्ना एकादशी (Utpanna)' },
  'Margashirsha': { 'Shukla': 'मोक्षदा एकादशी व गीता जयंती (Mokshada)', 'Krishna': 'सफला एकादशी (Saphala)' },
  'Pausha': { 'Shukla': 'पौष पुत्रदा एकादशी (Putrada)', 'Krishna': 'षटतिला एकादशी (Shattila)' },
  'Magha': { 'Shukla': 'जया एकादशी (Jaya)', 'Krishna': 'विजया एकादशी (Vijaya)' },
  'Phalguna': { 'Shukla': 'आमलकी एकादशी (Amalaki)', 'Krishna': 'पापमोचिनी एकादशी (Papmochani)' }
};

function calculatePanchangForDate(date, isCurrentMonth, todayDate) {
  const day = date.getDate();
  const month = date.getMonth(); // 0 - 11
  const year = date.getFullYear();

  const isToday = isCurrentMonth &&
    todayDate.getDate() === day &&
    todayDate.getMonth() === month &&
    todayDate.getFullYear() === year;

  // Julian Date Calculation
  const timeMs = Date.UTC(year, month, day, 6, 0, 0);
  const jd = timeMs / 86400000.0 + 2440587.5;
  const dFromJ2000 = jd - 2451545.0;

  const sunMean = (280.460 + 0.9856474 * dFromJ2000) % 360;
  const moonMean = (218.316 + 13.176396 * dFromJ2000) % 360;
  const sunLong = (sunMean + 360) % 360;
  const moonLong = (moonMean + 360) % 360;
  const elongation = (moonLong - sunLong + 360) % 360;

  const tithiIndex = Math.floor(elongation / 12) + 1; // 1 to 30

  let paksha = 'Shukla';
  let pakshaHindi = 'शुक्ल पक्ष';
  let tithiNumber = tithiIndex;
  let tithiName = '';
  let tithiHindi = '';

  if (tithiIndex <= 15) {
    paksha = 'Shukla';
    pakshaHindi = 'शुक्ल पक्ष';
    tithiNumber = tithiIndex;
    tithiName = TITHI_NAMES[tithiIndex] || 'Pratipada';
    tithiHindi = TITHI_HINDI[tithiIndex] || 'प्रतिपदा';
  } else {
    paksha = 'Krishna';
    pakshaHindi = 'कृष्ण पक्ष';
    tithiNumber = tithiIndex - 15;
    if (tithiNumber === 15) {
      tithiName = 'Amavasya';
      tithiHindi = 'अमावस्या';
    } else {
      tithiName = TITHI_NAMES[tithiNumber] || 'Pratipada';
      tithiHindi = TITHI_HINDI[tithiNumber] || 'प्रतिपदा';
    }
  }

  const isPurnima = paksha === 'Shukla' && tithiNumber === 15;
  const isAmavasya = paksha === 'Krishna' && tithiNumber === 15;
  const isEkadashi = tithiNumber === 11;
  const isPradosh = tithiNumber === 13;
  const isChaturthi = tithiNumber === 4;
  const isSankranti = (month === 0 && (day === 14 || day === 15));

  // Nakshatra (27 total, 13.3333° each)
  const nakshatraIndex = Math.floor(moonLong / (360 / 27));
  const nakshatra = NAKSHATRAS[(nakshatraIndex + 27) % 27] || NAKSHATRAS[0];

  // Hindu Lunar Month
  const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000);
  const masaIndex = Math.floor(((dayOfYear + 285) % 365) / 30.4375);
  const hinduMonth = HINDU_MONTHS[masaIndex % 12];

  // Vikram Samvat
  const vikramSamvat = (month > 2 || (month === 2 && day >= 22)) ? year + 57 : year + 56;

  // Festivals Detection
  const festivals = [];

  if (isEkadashi) {
    const ekName = (EKADASHI_NAMES[hinduMonth.en] && EKADASHI_NAMES[hinduMonth.en][paksha]) || 'एकादशी व्रत (Ekadashi Vrat)';
    festivals.push({
      name: ekName,
      hindiName: `🪷 ${ekName}`,
      type: 'ekadashi',
      color: '#2E7D32',
      icon: '🪷',
      significance: 'Dedicated to Lord Vishnu. Fosters physical detoxification, neural serenity, and spiritual purification.'
    });
  }

  if (isPurnima) {
    festivals.push({
      name: `${hinduMonth.en} Purnima`,
      hindiName: `🌕 ${hinduMonth.hi} पूर्णिमा (Satyanarayan Vrat)`,
      type: 'purnima',
      color: '#B3861B',
      icon: '🌕',
      significance: 'Full moon day auspicious for Shri Satyanarayan Puja, holy river dips in the Ganges, and Lakshmi Aradhana.'
    });
  }

  if (isAmavasya) {
    festivals.push({
      name: `${hinduMonth.en} Amavasya`,
      hindiName: `🌑 ${hinduMonth.hi} अमावस्या (Pitru Tarpan)`,
      type: 'amavasya',
      color: '#37474F',
      icon: '🌑',
      significance: 'New moon night dedicated to ancestral Tila Tarpan, feeding cows and birds, and seeking Pitru blessings.'
    });
  }

  if (isPradosh) {
    festivals.push({
      name: `${paksha} Pradosh Vrat`,
      hindiName: `🔱 प्रदोष व्रत (${pakshaHindi})`,
      type: 'pradosh',
      color: '#4A306D',
      icon: '🔱',
      significance: 'Twilight Shiva puja window for dissolving karmic burdens, anxiety, and bringing peace to home.'
    });
  }

  // Major Annual Festivals
  if (isSankranti) {
    festivals.push({
      name: 'Makar Sankranti',
      hindiName: 'मकर संक्रांति (उत्तरायण महापर्व)',
      type: 'major',
      color: '#E65100',
      icon: '🪁',
      significance: 'Sun enters Capricorn (Makara Rashi) marking the start of auspicious Uttarayana and harvest celebrations.'
    });
  }

  if (hinduMonth.en === 'Phalguna') {
    if (paksha === 'Krishna' && (tithiNumber === 13 || tithiNumber === 14)) {
      festivals.push({
        name: 'Maha Shivratri',
        hindiName: 'महाशिवरात्रि महापर्व (शिव-पार्वती कल्याणम्)',
        type: 'major',
        color: '#1A237E',
        icon: '🔱',
        significance: 'Cosmic night of Lord Shiva and Goddess Parvati; all-night Shiva Lingam abhishekam with Belpatra, milk, and chanting.'
      });
    } else if (paksha === 'Shukla' && tithiNumber === 15) {
      festivals.push({
        name: 'Holika Dahan',
        hindiName: 'होलिका दहन (भक्त प्रह्लाद विजय)',
        type: 'major',
        color: '#D81B60',
        icon: '🔥',
        significance: 'Sacred bonfire celebrating triumph of divine faith over evil and demoness Holika.'
      });
    }
  } else if (hinduMonth.en === 'Chaitra') {
    if (paksha === 'Shukla' && tithiNumber === 1) {
      festivals.push({
        name: 'Chaitra Navratri & Hindu New Year',
        hindiName: 'चैत्र नवरात्रि प्रारम्भ (नव संवत्सर)',
        type: 'major',
        color: '#C0392B',
        icon: '🚩',
        significance: 'First day of Vikram Samvat and commencement of 9 sacred days of Navratri Goddess invocation.'
      });
    } else if (paksha === 'Shukla' && tithiNumber === 9) {
      festivals.push({
        name: 'Ram Navami',
        hindiName: 'श्री राम नवमी (मर्यादा पुरुषोत्तम प्राकट्य)',
        type: 'major',
        color: '#D4AF37',
        icon: '🏹',
        significance: 'Celebration of Lord Rama appearance with Ramcharitmanas path and grand noon aarti.'
      });
    }
  } else if (hinduMonth.en === 'Shravana') {
    if (paksha === 'Shukla' && tithiNumber === 15) {
      festivals.push({
        name: 'Raksha Bandhan',
        hindiName: 'रक्षाबंधन महापर्व (श्रावणी पूर्णिमा)',
        type: 'major',
        color: '#E65100',
        icon: '🪢',
        significance: 'Sacred thread ceremony celebrating brother-sister protection and Shravani Upakarma.'
      });
    }
  } else if (hinduMonth.en === 'Bhadrapada') {
    if (paksha === 'Krishna' && tithiNumber === 8) {
      festivals.push({
        name: 'Krishna Janmashtami',
        hindiName: 'श्री कृष्ण जन्माष्टमी (मथुरा प्राकट्य)',
        type: 'major',
        color: '#1565C0',
        icon: '🦚',
        significance: 'Midnight appearance of Lord Krishna with 108 bhog offerings, Makhan Handi, and joyful bhajans.'
      });
    } else if (paksha === 'Shukla' && tithiNumber === 4) {
      festivals.push({
        name: 'Ganesh Chaturthi',
        hindiName: 'श्री गणेश चतुर्थी (विनायक स्थापना)',
        type: 'major',
        color: '#C0392B',
        icon: '🐘',
        significance: 'Installation of Lord Ganesha, remover of all obstacles and giver of spiritual intellect.'
      });
    }
  } else if (hinduMonth.en === 'Ashwina') {
    if (paksha === 'Shukla' && tithiNumber === 10) {
      festivals.push({
        name: 'Dussehra / Vijayadashami',
        hindiName: 'विजयादशमी / दशहरा (अधर्म पर धर्म विजय)',
        type: 'major',
        color: '#D81B60',
        icon: '🏹',
        significance: 'Victory of Lord Rama over Ravana and Goddess Durga over Mahishasura; Shami puja and new ventures.'
      });
    }
  } else if (hinduMonth.en === 'Kartika') {
    if (paksha === 'Krishna' && tithiNumber === 13) {
      festivals.push({
        name: 'Dhanteras',
        hindiName: 'धनतेरस (भगवान धन्वन्तरि व कुबेर पूजा)',
        type: 'major',
        color: '#D4AF37',
        icon: '🪙',
        significance: 'Day of Ayurveda physician Lord Dhanvantari and Lord Kubera; lighting 13 ghee lamps.'
      });
    } else if (paksha === 'Krishna' && tithiNumber === 15) {
      festivals.push({
        name: 'Diwali / Maha Lakshmi Puja',
        hindiName: 'दीपावली महापर्व (श्री महालक्ष्मी पूजन)',
        type: 'major',
        color: '#E65100',
        icon: '🪔',
        significance: 'Grand festival of lights welcoming Lord Rama back to Ayodhya and invoking Goddess Lakshmi & Lord Ganesha.'
      });
    }
  }

  // Muhurat calculations
  const dayOfWeek = date.getDay();
  const rahuKaal = RAHU_KAAL_BY_DAY[dayOfWeek];
  const abhijitMuhurat = '11:45 AM - 12:35 PM';
  const sunrise = '06:15 AM';
  const sunset = '06:18 PM';

  let vratAdvice = 'Light a pure cow ghee diya, chant the Gayatri Mantra, and offer water (Arghya) to Surya Dev.';
  if (isEkadashi) {
    vratAdvice = 'Observe fasting on satvik fruits and warm milk; abstain from grains; chant Vishnu Sahasranama.';
  } else if (isPurnima) {
    vratAdvice = 'Fast until moonrise; prepare pure kheer; organize or listen to Shri Satyanarayan Vrat Katha.';
  } else if (isAmavasya) {
    vratAdvice = 'Perform Tila Tarpan for departed ancestors; feed cows, dogs and birds; donate अन्न (food) to the needy.';
  } else if (isPradosh) {
    vratAdvice = 'Observe twilight fast; offer Belpatra, honey, and raw milk to Shiva Lingam during Pradosh Kaal.';
  }

  return {
    dateObj: date,
    dayNumber: day,
    monthIndex: month,
    year: year,
    isCurrentMonth,
    isToday,
    vikramSamvat,
    hinduMonth: hinduMonth.en,
    hinduMonthHindi: hinduMonth.hi,
    paksha,
    pakshaHindi,
    tithiNumber,
    tithiName,
    tithiHindi,
    nakshatra: nakshatra.name,
    nakshatraHindi: nakshatra.hindi,
    yoga: 'Shubha Yoga',
    karana: 'Bava Karana',
    isPurnima,
    isAmavasya,
    isEkadashi,
    isPradosh,
    isSankranti,
    festivals,
    sunrise,
    sunset,
    abhijitMuhurat,
    rahuKaal,
    vratAdvice
  };
}

function generatePanchangMonth(year, monthIndex) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayIndex = new Date(year, monthIndex, 1).getDay(); // 0 = Sun
  const today = new Date();

  const result = [];

  // Previous month padding
  const prevMonthDays = new Date(year, monthIndex, 0).getDate();
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    const d = new Date(year, monthIndex - 1, dayNum);
    result.push(calculatePanchangForDate(d, false, today));
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, monthIndex, day);
    result.push(calculatePanchangForDate(d, true, today));
  }

  // Next month padding to complete 35 or 42 cells
  const remaining = (7 - (result.length % 7)) % 7;
  for (let nextDay = 1; nextDay <= remaining; nextDay++) {
    const d = new Date(year, monthIndex + 1, nextDay);
    result.push(calculatePanchangForDate(d, false, today));
  }

  return result;
}

// =========================================================================
// 3. WEB AUDIO 432 HZ SACRED BELL
// =========================================================================
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSacredBell() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const baseFreq = 432;

    const partials = [
      { freq: baseFreq, gain: 0.35, decay: 4.5 },
      { freq: baseFreq * 1.5, gain: 0.18, decay: 3.8 },
      { freq: baseFreq * 2.0, gain: 0.12, decay: 3.0 },
      { freq: baseFreq * 2.76, gain: 0.08, decay: 2.5 }
    ];

    partials.forEach(p => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.freq, now);
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(p.gain, now + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + p.decay + 0.1);
    });
  } catch (e) {
    console.warn('Audio gesture required');
  }
}

// =========================================================================
// 4. REAL-TIME AARTI SCHEDULE & SANCTUM STATUS TRACKER
// =========================================================================
const AARTI_SCHEDULE = [
  { name: 'Suprabhatam & Gates Open', time: '05:30 AM', hr: 5, min: 30, desc: 'Awakening prayers and conch blowing' },
  { name: 'Mangala Aarti (Ghee Lamp)', time: '06:00 AM', hr: 6, min: 0, desc: 'First sacred flame offering of the day' },
  { name: 'Morning Archana & Abhishek', time: '08:30 AM', hr: 8, min: 30, desc: 'Panchamrit holy bath for the deities' },
  { name: 'Rajbhog Aarti & Bhog Offering', time: '12:00 PM', hr: 12, min: 0, desc: 'Consecrated midday sweet bhog offering' },
  { name: 'Sanctum Shayan (Afternoon Rest)', time: '12:30 PM', hr: 12, min: 30, desc: 'Gates closed for afternoon deity rest' },
  { name: 'Utthapan & Evening Reopening', time: '04:30 PM', hr: 16, min: 30, desc: 'Evening sanctum gates reopen for devotees' },
  { name: 'Maha Sandhya Aarti (Ganga Flame)', time: '06:45 PM', hr: 18, min: 45, desc: 'Grand evening flame & damru resonance' },
  { name: 'Shayan Aarti & Gates Rest', time: '09:00 PM', hr: 21, min: 0, desc: 'Closing night prayers and divine slumber' }
];

function getSanctumStatus() {
  const now = new Date();
  // Get current hour, min, and sec in IST (UTC+5:30)
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istDate = new Date(utc + (3600000 * 5.5));
  const curHr = istDate.getHours();
  const curMin = istDate.getMinutes();
  const curSec = istDate.getSeconds();
  const nowTotalSeconds = curHr * 3600 + curMin * 60 + curSec;

  // Morning Darshan: 05:30 (330m) to 12:30 (750m)
  // Evening Darshan: 16:30 (990m) to 21:30 (1290m)
  const totalMin = curHr * 60 + curMin;
  const isMorningOpen = (totalMin >= 330 && totalMin < 750);
  const isEveningOpen = (totalMin >= 990 && totalMin < 1290);
  const isOpen = isMorningOpen || isEveningOpen;

  let statusText = 'CLOSED FOR VISHRAM';
  let badgeClass = 'bg-secondary';
  if (isOpen) {
    statusText = isMorningOpen ? 'OPEN NOW • Pratah Kaal' : 'OPEN NOW • Sandhya Kaal';
    badgeClass = 'bg-success';
  }

  // Find next upcoming event in exact seconds
  let nextEvent = AARTI_SCHEDULE[0];
  let minDiffSec = 999999;
  for (const item of AARTI_SCHEDULE) {
    const itemSec = item.hr * 3600 + item.min * 60;
    let diffSec = itemSec - nowTotalSeconds;
    if (diffSec <= 0) diffSec += 86400; // Next day
    if (diffSec < minDiffSec) {
      minDiffSec = diffSec;
      nextEvent = item;
    }
  }

  const hoursLeft = Math.floor(minDiffSec / 3600);
  const minsLeft = Math.floor((minDiffSec % 3600) / 60);
  const secsLeft = minDiffSec % 60;
  const countdownStr = `${String(hoursLeft).padStart(2, '0')}:${String(minsLeft).padStart(2, '0')}:${String(secsLeft).padStart(2, '0')}`;

  return {
    isOpen,
    statusText,
    badgeClass,
    nextEvent,
    countdownStr,
    istTimeString: istDate.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
}
}

// =========================================================================
// 5. DOM INITIALIZATION & PAGE HOOKS
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Temple Preloader - Fast, Graceful, Responsive Fade Out
  const preloader = document.getElementById('templePreloader');
  if (preloader) {
    let preloaderDismissed = false;
    const hidePreloader = () => {
      if (preloaderDismissed) return;
      preloaderDismissed = true;
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 550);
    };

    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 350);
    } else {
      window.addEventListener('load', () => setTimeout(hidePreloader, 350));
      setTimeout(hidePreloader, 1200); // Fail-safe fallback
    }
  }

  // 2. Real-time Live Clock & Status Tick
  function updateAllClocks() {
    const status = getSanctumStatus();
    const clockEl = document.getElementById('sanctumLiveClock');
    if (clockEl) {
      clockEl.textContent = `IST ${status.istTimeString}`;
    }
    const clockEl2 = document.getElementById('sanctumLiveClock2');
    if (clockEl2) {
      clockEl2.textContent = `IST ${status.istTimeString}`;
    }
    const drawerClockEl = document.getElementById('drawerSanctumClock');
    if (drawerClockEl) {
      drawerClockEl.textContent = `Ropar Punjab IST ${status.istTimeString}`;
    }

    const liveStatusBadge = document.getElementById('liveStatusBadge');
    if (liveStatusBadge) {
      if (liveStatusBadge.classList.contains('badge') || liveStatusBadge.classList.contains('rounded-pill')) {
        liveStatusBadge.className = status.isOpen 
          ? 'badge bg-success px-3 py-2 fw-semibold rounded-pill d-inline-flex align-items-center gap-2' 
          : 'badge bg-secondary px-3 py-2 fw-semibold rounded-pill d-inline-flex align-items-center gap-2';
        liveStatusBadge.innerHTML = status.isOpen 
          ? '<span class="pulse-dot-green" style="display:inline-block;"></span> OPEN NOW • Pratah Kaal Darshan' 
          : '<span class="pulse-dot-orange" style="display:inline-block;"></span> SHAYAN REST • Closed';
      } else {
        liveStatusBadge.className = status.isOpen ? 'pulse-dot-green' : 'pulse-dot-orange';
      }
    }

    const liveStatusText = document.getElementById('liveStatusText');
    if (liveStatusText) {
      liveStatusText.textContent = status.isOpen ? 'OPEN NOW • Pratah Kaal Darshan' : 'SHAYAN REST • Closed';
    }

    const aartiCountdownEl = document.getElementById('aartiCountdown');
    if (aartiCountdownEl) {
      aartiCountdownEl.textContent = status.countdownStr;
    }

    const country = getSelectedCountry();

    const nextAartiNameEl = document.getElementById('nextAartiName');
    if (nextAartiNameEl) {
      nextAartiNameEl.textContent = status.nextEvent.name;
    }

    const nextAartiLocalEl = document.getElementById('nextAartiLocalTime');
    if (nextAartiLocalEl) {
      nextAartiLocalEl.textContent = `(${status.nextEvent.time} IST)`;
    }

    // Devotee Country Clock (Pure Monospace Tabular Format)
    const countryClockEl = document.getElementById('devoteeCountryClock');
    if (countryClockEl) {
      const now = new Date();
      try {
        const localStr = now.toLocaleTimeString('en-US', { timeZone: country.tz, hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        countryClockEl.textContent = localStr;
      } catch(e) {}
    }

    const countrySubEl = document.getElementById('devoteeCountrySub');
    if (countrySubEl) {
      countrySubEl.textContent = `${country.name} (${country.tzName})`;
    }
  }

  function initAllCountryDropdowns() {
    const dropdownIds = ['heroCountrySelect', 'drawerCountrySelect', 'calCountrySelect', 'timingsCountrySelect'];
    const curCountry = getSelectedCountry();

    dropdownIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      el.innerHTML = ALL_COUNTRIES.map(c => `
        <option value="${c.code}" ${c.code === curCountry.code ? 'selected' : ''}>
          ${c.flag} ${c.name} (${c.tzName})
        </option>
      `).join('');

      el.value = curCountry.code;

      el.addEventListener('change', function() {
        setSelectedCountry(this.value);
        dropdownIds.forEach(otherId => {
          const otherEl = document.getElementById(otherId);
          if (otherEl && otherEl !== this) {
            otherEl.value = this.value;
          }
        });
        updateAllClocks();
      });
    });
  }

  initAllCountryDropdowns();
  window.addEventListener('countryChanged', () => {
    updateAllClocks();
  });

  updateAllClocks();
  setInterval(updateAllClocks, 1000);

  
  // Hero Slider (Original Angular 5-Slide Experience)
  function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slider-section .slide-item');
    const dots = document.querySelectorAll('.hero-slider-section .dot-indicator');
    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');
    if (!slides.length) return;

    let currentIndex = 0;
    let autoPlayTimer = null;

    function showSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;

      slides.forEach((slide, i) => {
        slide.classList.toggle('active-slide', i === currentIndex);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active-dot', i === currentIndex);
      });
    }

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    function prevSlide() {
      showSlide(currentIndex - 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, 6000);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        startAutoPlay();
      });
    }

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = parseInt(dot.getAttribute('data-slide') || '0', 10);
        showSlide(idx);
        startAutoPlay();
      });
    });

    const sliderWrapper = document.querySelector('.hero-slider-section .slider-wrapper');
    if (sliderWrapper) {
      sliderWrapper.addEventListener('mouseenter', stopAutoPlay);
      sliderWrapper.addEventListener('mouseleave', startAutoPlay);

      let touchStartX = 0;
      sliderWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
      }, { passive: true });

      sliderWrapper.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 45) {
          nextSlide();
        } else if (touchEndX - touchStartX > 45) {
          prevSlide();
        }
        startAutoPlay();
      }, { passive: true });
    }

    startAutoPlay();
  }

  initHeroSlider();

  // 3. Sacred Bell Quick Triggers & 432 Hz Solfeggio Chimes
  let chimesActive = false;
  let chimeInterval = null;

  function toggleAmbientChimes() {
    chimesActive = !chimesActive;
    const audioBtns = document.querySelectorAll('.audio-chime-toggle');
    const audioBars = document.querySelectorAll('.audio-bars');

    if (chimesActive) {
      getAudioContext();
      playSacredBell();
      chimeInterval = setInterval(() => {
        if (chimesActive) playSacredBell();
      }, 8000);

      audioBtns.forEach(btn => {
        btn.classList.add('active');
        const label = btn.querySelector('.tb-btn-label');
        if (label) label.textContent = '432Hz ▶';
      });
      audioBars.forEach(bar => bar.classList.add('playing'));
    } else {
      if (chimeInterval) {
        clearInterval(chimeInterval);
        chimeInterval = null;
      }
      audioBtns.forEach(btn => {
        btn.classList.remove('active');
        const label = btn.querySelector('.tb-btn-label');
        if (label) label.textContent = '432Hz';
      });
      audioBars.forEach(bar => bar.classList.remove('playing'));
    }
  }

  document.querySelectorAll('.trigger-sacred-bell, .ring-bell-btn').forEach(btn => {
    btn.addEventListener('click', playSacredBell);
  });
  document.querySelectorAll('.audio-chime-toggle').forEach(btn => {
    btn.addEventListener('click', toggleAmbientChimes);
  });

  // 3b. Mobile Off-Canvas Sidebar / Drawer
  const mobileToggle = document.getElementById('mobileToggleBtn');
  const mobileDrawer = document.getElementById('mobileSidebarDrawer');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  function openMobileMenu() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('drawer-open');
      mobileDrawer.classList.add('open');
    }
    if (sidebarBackdrop) sidebarBackdrop.style.display = 'block';
    if (mobileToggle) {
      mobileToggle.classList.add('open');
      mobileToggle.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('drawer-open');
      mobileDrawer.classList.remove('open');
    }
    if (sidebarBackdrop) sidebarBackdrop.style.display = 'none';
    if (mobileToggle) {
      mobileToggle.classList.remove('open');
      mobileToggle.classList.remove('active');
    }
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (mobileDrawer && (mobileDrawer.classList.contains('drawer-open') || mobileDrawer.classList.contains('open'))) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileMenu);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // 3c. Active Nav Link Detection (Page & In-Page Sections)
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.hdr-navbar .nav-item');
  let matchedCurrentPage = false;

  navItems.forEach(item => {
    const href = item.getAttribute('href') || '';
    const cleanHref = href.split('#')[0];
    if (cleanHref && currentPath.endsWith(cleanHref)) {
      item.classList.add('active-link');
      matchedCurrentPage = true;
    }
  });

  // If on index or root, track section scroll
  if (!matchedCurrentPage || currentPath.endsWith('index.html') || currentPath.endsWith('/Spritual/') || currentPath.endsWith('/Spritual')) {
    const trackedSecs = document.querySelectorAll('section[id], header[id]');
    function trackSanctumScroll() {
      const scrollPos = window.scrollY + 130;
      let curId = '';
      trackedSecs.forEach(sec => {
        if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
          curId = '#' + sec.id;
        }
      });
      if (curId) {
        navItems.forEach(item => {
          const href = item.getAttribute('href') || '';
          if (href === curId || href.endsWith(curId)) {
            navItems.forEach(i => i.classList.remove('active-link'));
            item.classList.add('active-link');
          }
        });
      }
    }
    window.addEventListener('scroll', trackSanctumScroll, { passive: true });
    trackSanctumScroll();
  }

  // 4. PANCHANG CALENDAR CONTROLLER (Runs when on calendar.html)
  const calendarContainer = document.getElementById('panchangCalendarApp');
  if (calendarContainer) {
    initPanchangCalendar();
  }

  // 5. LIVE DARSHAN CONTROLLER (Runs when on live.html)
  const prayerWallForm = document.getElementById('prayerWallForm');
  if (prayerWallForm) {
    initLiveDarshanPage();
  }

  // 6. DAILY SACRED WISDOM RANDOMIZER
  initSacredWisdomWidget();
});

// =========================================================================
// 6. PANCHANG CALENDAR INTERACTIVE UI CONTROLLER
// =========================================================================
function initPanchangCalendar() {
  let viewYear = new Date().getFullYear();
  let viewMonth = new Date().getMonth(); // 0 - 11
  let activeFilter = 'all';
  let selectedDayData = null;

  const MONTH_NAMES = [
    { en: 'January', hi: 'जनवरी' }, { en: 'February', hi: 'फरवरी' }, { en: 'March', hi: 'मार्च' },
    { en: 'April', hi: 'अप्रैल' }, { en: 'May', hi: 'मई' }, { en: 'June', hi: 'जून' },
    { en: 'July', hi: 'जुलाई' }, { en: 'August', hi: 'अगस्त' }, { en: 'September', hi: 'सितंबर' },
    { en: 'October', hi: 'अक्टूबर' }, { en: 'November', hi: 'नवंबर' }, { en: 'December', hi: 'दिसंबर' }
  ];

  // Country Selector Population
  const countrySelect = document.getElementById('calCountrySelect');
  if (countrySelect) {
    countrySelect.innerHTML = ALL_COUNTRIES.map(c => `
      <option value="${c.code}" ${c.code === selectedCountryCode ? 'selected' : ''}>
        ${c.flag} ${c.name} (${c.tzName})
      </option>
    `).join('');

    countrySelect.addEventListener('change', (e) => {
      setSelectedCountry(e.target.value);
      renderCalendar();
      if (selectedDayData) renderDayInspector(selectedDayData);
    });
  }

  // Year Dropdown Population (2020 - 2045)
  const yearSelect = document.getElementById('calYearSelect');
  if (yearSelect) {
    let yearOptions = '';
    for (let y = 2020; y <= 2045; y++) {
      yearOptions += `<option value="${y}" ${y === viewYear ? 'selected' : ''}>${y}</option>`;
    }
    yearSelect.innerHTML = yearOptions;
    yearSelect.addEventListener('change', (e) => {
      viewYear = parseInt(e.target.value, 10);
      renderCalendar();
    });
  }

  // Month Dropdown Population
  const monthSelect = document.getElementById('calMonthSelect');
  if (monthSelect) {
    monthSelect.innerHTML = MONTH_NAMES.map((m, idx) => `
      <option value="${idx}" ${idx === viewMonth ? 'selected' : ''}>${m.en} (${m.hi})</option>
    `).join('');
    monthSelect.addEventListener('change', (e) => {
      viewMonth = parseInt(e.target.value, 10);
      renderCalendar();
    });
  }

  // Navigation Buttons
  document.getElementById('calPrevYearBtn')?.addEventListener('click', () => {
    viewYear--;
    if (yearSelect) yearSelect.value = viewYear;
    renderCalendar();
  });

  document.getElementById('calNextYearBtn')?.addEventListener('click', () => {
    viewYear++;
    if (yearSelect) yearSelect.value = viewYear;
    renderCalendar();
  });

  document.getElementById('calPrevMonthBtn')?.addEventListener('click', () => {
    if (viewMonth === 0) {
      viewMonth = 11;
      viewYear--;
      if (yearSelect) yearSelect.value = viewYear;
    } else {
      viewMonth--;
    }
    if (monthSelect) monthSelect.value = viewMonth;
    renderCalendar();
  });

  document.getElementById('calNextMonthBtn')?.addEventListener('click', () => {
    if (viewMonth === 11) {
      viewMonth = 0;
      viewYear++;
      if (yearSelect) yearSelect.value = viewYear;
    } else {
      viewMonth++;
    }
    if (monthSelect) monthSelect.value = viewMonth;
    renderCalendar();
  });

  document.getElementById('calJumpTodayBtn')?.addEventListener('click', () => {
    const today = new Date();
    viewYear = today.getFullYear();
    viewMonth = today.getMonth();
    if (yearSelect) yearSelect.value = viewYear;
    if (monthSelect) monthSelect.value = viewMonth;
    renderCalendar();
  });

  // Filter Pills Click Handler
  document.querySelectorAll('.filter-pill[data-filter]').forEach(pill => {
    pill.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-pill[data-filter]').forEach(p => p.classList.remove('active-pill'));
      pill.classList.add('active-pill');
      activeFilter = pill.getAttribute('data-filter');
      renderCalendar();
    });
  });

  // Main Render Function
  function renderCalendar() {
    const days = generatePanchangMonth(viewYear, viewMonth);
    const country = getSelectedCountry();

    // Update Header Titles
    const monthObj = MONTH_NAMES[viewMonth];
    const sampleDay = days.find(d => d.isCurrentMonth);
    const samvat = sampleDay ? sampleDay.vikramSamvat : (viewMonth >= 3 ? viewYear + 57 : viewYear + 56);
    const hinduMonth = sampleDay ? sampleDay.hinduMonthHindi : 'माह';

    const samvatEl = document.getElementById('calSamvatBadge');
    if (samvatEl) samvatEl.textContent = `विक्रम संवत ${samvat} • ${hinduMonth} मास`;

    const headingEl = document.getElementById('calCurrentMonthHeading');
    if (headingEl) headingEl.textContent = `${monthObj.en} ${viewYear}`;

    const hindiSubEl = document.getElementById('calMonthHindiSub');
    if (hindiSubEl) hindiSubEl.textContent = `${monthObj.hi} ${viewYear}`;

    // Update Country Notice
    const countryNoticeEl = document.getElementById('calCountryNotice');
    if (countryNoticeEl) {
      countryNoticeEl.innerHTML = `Devotee Zone: <strong>${country.flag} ${country.name} (${country.tzName})</strong>`;
    }

    // Grid Rendering
    const gridEl = document.getElementById('calendarDaysGrid');
    if (!gridEl) return;

    gridEl.innerHTML = '';

    days.forEach(day => {
      // Check Filter
      let matchesFilter = true;
      if (activeFilter === 'festivals') {
        matchesFilter = day.festivals.some(f => f.type === 'major' || f.type === 'fest');
      } else if (activeFilter === 'ekadashi') {
        matchesFilter = day.isEkadashi;
      } else if (activeFilter === 'purnima-amavasya') {
        matchesFilter = day.isPurnima || day.isAmavasya;
      }

      const cell = document.createElement('div');
      cell.className = `calendar-day-cell ${day.isCurrentMonth ? '' : 'other-month'} ${day.isToday ? 'is-today' : ''}`;
      if (!matchesFilter && activeFilter !== 'all') {
        cell.style.opacity = '0.25';
      }

      let badgesHtml = '';
      if (day.isEkadashi) badgesHtml += `<span class="badge-mini badge-ekadashi">🪷 एकादशी</span>`;
      if (day.isPurnima) badgesHtml += `<span class="badge-mini badge-purnima">🌕 पूर्णिमा</span>`;
      if (day.isAmavasya) badgesHtml += `<span class="badge-mini badge-amavasya">🌑 अमावस्या</span>`;

      day.festivals.forEach(f => {
        if (f.type === 'major') {
          badgesHtml += `<span class="badge-mini badge-fest" title="${f.name}">${f.icon} ${f.name.slice(0, 14)}</span>`;
        }
      });

      const pakshaAbbr = day.paksha === 'Shukla' ? 'शु.' : 'कृ.';

      cell.innerHTML = `
        <div class="cell-top-meta">
          <div class="tithi-desi-group">
            <span class="tithi-desi-name">${day.tithiHindi}</span>
            <span class="paksha-desi-abbr">${pakshaAbbr}</span>
          </div>
          <span class="gregorian-date-num">${day.dayNumber}</span>
        </div>
        <div class="cell-badges-wrap">
          ${badgesHtml}
        </div>
        <div class="cell-bottom-bar">
          <span class="nakshatra-foot-text">${day.nakshatraHindi}</span>
        </div>
      `;

      cell.addEventListener('click', () => {
        document.querySelectorAll('.calendar-day-cell').forEach(c => c.classList.remove('is-selected'));
        cell.classList.add('is-selected');
        selectedDayData = day;
        renderDayInspector(day);
        playSacredBell();
      });

      gridEl.appendChild(cell);

      // Auto-select today
      if (day.isToday && !selectedDayData) {
        selectedDayData = day;
        cell.classList.add('is-selected');
        renderDayInspector(day);
      }
    });

    // Render Major Festivals List Below
    renderMajorEventsList(days);
  }

  function renderDayInspector(day) {
    const inspectorEl = document.getElementById('panchangDayInspector');
    if (!inspectorEl) return;

    inspectorEl.style.display = 'block';

    const country = getSelectedCountry();
    const localSunrise = convertIstTimeToLocal(day.sunrise, country);
    const localSunset = convertIstTimeToLocal(day.sunset, country);
    const localAbhijit = convertIstTimeToLocal(day.abhijitMuhurat, country);
    const localRahu = convertIstTimeToLocal(day.rahuKaal, country);

    const monthName = MONTH_NAMES[day.monthIndex].en;

    let festivalsDetailHtml = '';
    if (day.festivals.length > 0) {
      festivalsDetailHtml = `
        <div class="inspector-festivals-list">
          <h4 class="fest-list-heading">Sacred Observances &amp; Festivals on this Day:</h4>
          ${day.festivals.map(f => `
            <div class="fest-detail-box">
              <div class="fest-title-row">
                <span class="fest-icon-lg">${f.icon}</span>
                <div>
                  <div class="fest-hi-name">${f.hindiName}</div>
                  <div class="fest-en-name">${f.name}</div>
                </div>
              </div>
              <p class="fest-significance-text">${f.significance}</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    inspectorEl.innerHTML = `
      <div class="inspector-header">
        <div class="inspector-date-display">
          <div class="inspector-large-num">${day.dayNumber}</div>
          <div>
            <div class="inspector-en-date">${monthName} ${day.dayNumber}, ${day.year}</div>
            <div class="inspector-hi-tithi">${day.pakshaHindi} • ${day.tithiHindi} (${day.tithiName})</div>
            <div class="inspector-samvat-tag">विक्रम संवत ${day.vikramSamvat} • ${day.hinduMonthHindi} (${day.hinduMonth}) मास</div>
          </div>
        </div>
        <div class="inspector-actions">
          <a href="booking.html" class="btn btn-sm" style="background: linear-gradient(135deg, #E65100 0%, #D4AF37 100%); color: #fff; font-weight: 700; border-radius: 20px; padding: 8px 20px;">
            <i class="fa-solid fa-calendar-check me-1"></i> Book Puja on this Tithi
          </a>
        </div>
      </div>

      <div class="inspector-grid">
        <div class="inspector-metric-card">
          <span class="metric-icon">⭐</span>
          <div class="metric-content">
            <span class="metric-label">Nakshatra</span>
            <span class="metric-val">${day.nakshatraHindi} (${day.nakshatra})</span>
            <span class="metric-sub">Vedic Lunar Mansion</span>
          </div>
        </div>

        <div class="inspector-metric-card">
          <span class="metric-icon">☀️</span>
          <div class="metric-content">
            <span class="metric-label">Surya Timings</span>
            <span class="metric-val">Sunrise: ${day.sunrise} • Sunset: ${day.sunset} (IST)</span>
            ${country.code !== 'IN' ? `<span class="metric-local-tag">In ${country.name}: Sunrise ~ ${localSunrise}</span>` : ''}
          </div>
        </div>

        <div class="inspector-metric-card">
          <span class="metric-icon">🕉️</span>
          <div class="metric-content">
            <span class="metric-label">Shubh Abhijit Muhurat</span>
            <span class="metric-val shubh-text">${day.abhijitMuhurat} (IST)</span>
            ${country.code !== 'IN' ? `<span class="metric-local-tag shubh-tag">In ${country.name}: ${localAbhijit}</span>` : ''}
            <span class="metric-sub">Most auspicious window for new beginnings</span>
          </div>
        </div>

        <div class="inspector-metric-card">
          <span class="metric-icon">⚠️</span>
          <div class="metric-content">
            <span class="metric-label">Rahu Kaal (Inauspicious)</span>
            <span class="metric-val rahu-text">${day.rahuKaal} (IST)</span>
            ${country.code !== 'IN' ? `<span class="metric-local-tag rahu-tag">In ${country.name}: ${localRahu}</span>` : ''}
            <span class="metric-sub">Avoid initiating important tasks</span>
          </div>
        </div>

        <div class="inspector-metric-card">
          <span class="metric-icon">🪷</span>
          <div class="metric-content">
            <span class="metric-label">Yoga &amp; Karana</span>
            <span class="metric-val">${day.yoga}</span>
            <span class="metric-sub">${day.karana}</span>
          </div>
        </div>
      </div>

      ${festivalsDetailHtml}

      <div class="inspector-advice-box">
        <span class="advice-icon">🪔</span>
        <div>
          <strong>Daily Vedic Sadhana Guidance:</strong>
          <p>${day.vratAdvice}</p>
        </div>
      </div>
    `;

    // Smooth scroll into view on mobile
    if (window.innerWidth < 768) {
      inspectorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function renderMajorEventsList(days) {
    const listEl = document.getElementById('calMajorEventsGrid');
    if (!listEl) return;

    const events = [];
    days.forEach(d => {
      if (d.isCurrentMonth && d.festivals.length > 0) {
        d.festivals.forEach(f => {
          events.push({ day: d, festival: f });
        });
      }
    });

    if (events.length === 0) {
      listEl.innerHTML = `<p class="text-muted">No major annual festivals fall in this specific month, but daily Ekadashi, Pradosh, Purnima, and Amavasya rituals proceed as per Panchang.</p>`;
      return;
    }

    listEl.innerHTML = events.map(item => `
      <div class="event-summary-item" data-day="${item.day.dayNumber}">
        <div class="event-date-chip">
          <span class="chip-day">${item.day.dayNumber}</span>
          <span class="chip-month">${MONTH_NAMES[viewMonth].en.slice(0, 3)}</span>
        </div>
        <div class="event-meta">
          <div class="event-title">
            <span>${item.festival.icon}</span>
            <strong>${item.festival.hindiName}</strong>
          </div>
          <div class="event-sub">${item.festival.name} • ${item.day.tithiHindi}</div>
        </div>
        <span class="event-view-link">View Details →</span>
      </div>
    `).join('');

    listEl.querySelectorAll('.event-summary-item').forEach(itemEl => {
      itemEl.addEventListener('click', () => {
        const dNum = parseInt(itemEl.getAttribute('data-day'), 10);
        const match = days.find(d => d.isCurrentMonth && d.dayNumber === dNum);
        if (match) {
          selectedDayData = match;
          renderDayInspector(match);
          playSacredBell();
        }
      });
    });
  }

  renderCalendar();
}

// =========================================================================
// 7. LIVE DARSHAN & DEVOTEE PRAYER WALL CONTROLLER (live.html)
// =========================================================================
function initLiveDarshanPage() {
  const form = document.getElementById('prayerWallForm');
  const wallContainer = document.getElementById('devoteePrayersList');
  if (!form || !wallContainer) return;

  const defaultPrayers = [
    { name: 'Aarav & Meera Sharma', city: 'London, UK', prayer: 'Praying for family peace, good health for grandparents, and mental tranquility.', time: '10 mins ago' },
    { name: 'Rajeshwari Patel', city: 'Ahmedabad, Gujarat', prayer: 'Seeking Mahadev and Maa Ganga blessings for children higher education and happiness.', time: '25 mins ago' },
    { name: 'Dr. Vivek Sengupta', city: 'Toronto, Canada', prayer: 'Offering humble pranam at the sanctum for healing all suffering souls and universal peace.', time: '40 mins ago' }
  ];

  let storedPrayers = [];
  try {
    storedPrayers = JSON.parse(localStorage.getItem('sukoon_prayer_wall') || '[]');
  } catch (e) {
    storedPrayers = [];
  }

  const allPrayers = [...storedPrayers, ...defaultPrayers];

  function renderPrayers() {
    wallContainer.innerHTML = allPrayers.slice(0, 10).map(p => `
      <div class="p-3 mb-2 rounded-3 bg-white border shadow-sm">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <strong style="color: #2E1A47;"><i class="fa-solid fa-om text-warning me-1"></i> ${p.name}</strong>
          <small class="text-muted">${p.city} • ${p.time}</small>
        </div>
        <p class="mb-0 text-secondary" style="font-size: 0.9rem;">${p.prayer}</p>
      </div>
    `).join('');
  }

  renderPrayers();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('prayerDevoteeName');
    const cityInput = document.getElementById('prayerDevoteeCity');
    const msgInput = document.getElementById('prayerDevoteeMsg');
    const toast = document.getElementById('prayerSuccessToast');

    if (!nameInput || !msgInput) return;

    const newPrayer = {
      name: nameInput.value.trim() || 'Devotee',
      city: cityInput?.value.trim() || 'Sacred Devotee',
      prayer: msgInput.value.trim(),
      time: 'Just now'
    };

    allPrayers.unshift(newPrayer);
    storedPrayers.unshift(newPrayer);
    try {
      localStorage.setItem('sukoon_prayer_wall', JSON.stringify(storedPrayers));
    } catch (e) {}

    renderPrayers();
    playSacredBell();

    if (toast) {
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 4000);
    }

    form.reset();
  });
}

// =========================================================================
// 8. DAILY SACRED WISDOM WIDGET (HOME & SERVICE PAGES)
// =========================================================================
function initSacredWisdomWidget() {
  const mantras = [
    {
      sanskrit: 'ॐ शान्तिः शान्तिः शान्तिः',
      english: 'Om Shanti, Shanti, Shanti',
      source: 'Upanishadic Invocation',
      meaning: 'May there be peace in the celestial realm, peace in nature, and profound peace in my mind, body and soul.',
      psychology: 'Calms the sympathetic nervous system and induces alpha brainwaves in less than 60 seconds.'
    },
    {
      sanskrit: 'योगः चित्तवृत्ति निरोधः',
      english: 'Yogas Chitta Vritti Nirodha',
      source: 'Patanjali Yoga Sutras 1.2',
      meaning: 'True peace is the gentle stilling of the turbulent fluctuations and whirlpools of the mind.',
      psychology: 'Cognitive metacognition: You are the observer of thoughts, not the thoughts themselves.'
    },
    {
      sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
      english: 'Karmanye Vadhikaraste Ma Phaleshu Kadachana',
      source: 'Bhagavad Gita 2.47',
      meaning: 'You have a right to perform your sacred duty, but not to the anxious obsession with its fruits.',
      psychology: 'Process-oriented cognitive framing shields the prefrontal cortex from chronic performance anxiety.'
    },
    {
      sanskrit: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः',
      english: 'Sarve Bhavantu Sukhinah',
      source: 'Brihadaranyaka Upanishad',
      meaning: 'May all beings be joyful and prosperous; may all beings be free from illness and distress.',
      psychology: 'Practicing universal metta (loving-kindness) releases oxytocin and counters defensive social anxiety.'
    },
    {
      sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्',
      english: 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam',
      source: 'Rigveda 7.59.12 (Maha Mrityunjaya)',
      meaning: 'We meditate on the three-eyed Lord who nourishes all beings. May He liberate us from anxiety, fear and bondage.',
      psychology: 'Rhythmic chanting stimulates the vagal tone, slowing heart rate and activating parasympathetic rest.'
    },
    {
      sanskrit: 'असतो मा सद्गमय तमसो मा ज्योतिर्गमय',
      english: 'Asato Ma Sadgamaya, Tamaso Ma Jyotirgamaya',
      source: 'Pavamana Mantra (Brihadaranyaka)',
      meaning: 'Lead me from falsehood to truth; lead me from darkness to divine light; lead me from mortality to immortality.',
      psychology: 'Existential meaning realignment shifts brain activity away from rumination toward transcendent hope.'
    }
  ];

  let currentMantraIndex = 0;

  function updateMantraDisplay() {
    const item = mantras[currentMantraIndex];
    const sourceEl = document.getElementById('mantraSource');
    const sanskritEl = document.getElementById('mantraSanskrit');
    const englishEl = document.getElementById('mantraEnglish');
    const meaningEl = document.getElementById('mantraMeaning');
    const neuroEl = document.getElementById('mantraNeuro');

    if (sourceEl) sourceEl.innerHTML = `<i class="fa-solid fa-scroll"></i> ${item.source}`;
    if (sanskritEl) sanskritEl.textContent = item.sanskrit;
    if (englishEl) englishEl.textContent = `"${item.english}"`;
    if (meaningEl) meaningEl.textContent = item.meaning;
    if (neuroEl) neuroEl.textContent = item.psychology;
  }

  const nextMantraBtn = document.getElementById('nextMantraBtn');
  if (nextMantraBtn) {
    nextMantraBtn.addEventListener('click', () => {
      currentMantraIndex = (currentMantraIndex + 1) % mantras.length;
      updateMantraDisplay();
      playSacredBell();
    });
  }

  const copyMantraBtn = document.getElementById('copyMantraBtn');
  const copyToast = document.getElementById('copyToast');
  if (copyMantraBtn) {
    copyMantraBtn.addEventListener('click', () => {
      const item = mantras[currentMantraIndex];
      const text = `"${item.sanskrit}" (${item.english}) - ${item.meaning} [Sukoon Temple]`;
      navigator.clipboard.writeText(text).then(() => {
        if (copyToast) {
          copyToast.style.display = 'inline-block';
          setTimeout(() => { copyToast.style.display = 'none'; }, 2500);
        }
      });
    });
  }
}
