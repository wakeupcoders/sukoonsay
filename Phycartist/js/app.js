/**
 * SAKOONSAY - Spiritual Sanctuary & Chakra Wellness
 * Interactive Engine: 7 Chakras, Web Audio Synthesizer, Sacred Diya, Quiz & Status Badges
 */

document.addEventListener('DOMContentLoaded', () => {
  initChakraSystem();
  initSoundEngine();
  initVirtualDiya();
  initQuizSystem();
  initLiveTempleStatus();
  initModalsAndToasts();
  initMobileNav();
});

/* ==========================================================================
   1. 7 CHAKRAS KNOWLEDGE BASE & INTERACTIVE EXPLORER
   ========================================================================== */
const chakraData = [
  {
    id: 'root',
    number: 1,
    name: 'Root Chakra',
    sanskrit: 'Mūlādhāra (मूलाधार)',
    location: 'Base of Spine & Pelvic Floor',
    color: '#C0392B',
    element: 'Earth (Prithvi)',
    mantra: 'LAM',
    frequency: '396 Hz',
    freqNum: 396,
    gemstone: 'Red Jasper, Hematite & Garnet',
    affirmation: 'I am securely grounded, deeply safe, protected, and rooted in Mother Earth.',
    description: 'Muladhara forms the spiritual foundation of the entire chakra system. When balanced, it instills unshakeable stability, eliminates existential fears, and gives you physical vitality to walk through life with deep calm confidence.',
    signsOfBalance: 'Feeling grounded, financially secure, physically strong, calm amidst life storms.',
    healingPractice: 'Barefoot earthing, Tree Pose (Vrikshasana), chanting LAM with sacred red focus.'
  },
  {
    id: 'sacral',
    number: 2,
    name: 'Sacral Chakra',
    sanskrit: 'Svādhiṣṭhāna (स्वाधिष्ठान)',
    location: 'Lower Abdomen below Navel',
    color: '#E65100',
    element: 'Water (Jala)',
    mantra: 'VAM',
    frequency: '417 Hz',
    freqNum: 417,
    gemstone: 'Carnelian, Orange Calcite & Amber',
    affirmation: 'I embrace flow, emotional vitality, sacred joy, and divine creative expression.',
    description: 'Svadhisthana governs fluid emotional currents, creative inspiration, and intimacy. A balanced sacral chakra removes guilt and emotional stiffness, allowing pure joy and boundless artistic creative flow to enter your sanctuary.',
    signsOfBalance: 'Playful creativity, harmonious relationships, emotional adaptability, pleasure in life.',
    healingPractice: 'Water hydration rituals, hip-opening asanas (Baddha Konasana), chanting VAM.'
  },
  {
    id: 'solar',
    number: 3,
    name: 'Solar Plexus Chakra',
    sanskrit: 'Maṇipūra (मणिपूर)',
    location: 'Upper Abdomen / Solar Plexus',
    color: '#D4AF37',
    element: 'Fire (Agni)',
    mantra: 'RAM',
    frequency: '528 Hz',
    freqNum: 528,
    gemstone: 'Citrine, Pyrite & Tiger\'s Eye',
    affirmation: 'I stand in radiant personal power, sovereign purpose, and divine inner light.',
    description: 'Manipura is the inner sun of your being. It fuels your digestion of food, experiences, and destiny. Balancing Manipura dissolves imposter anxiety and transforms hesitation into luminous, virtuous authority.',
    signsOfBalance: 'Warm self-worth, disciplined focus, healthy digestion, inspiring confidence.',
    healingPractice: 'Sun salutations (Surya Namaskar), Kapalabhati breathwork, golden candle meditation.'
  },
  {
    id: 'heart',
    number: 4,
    name: 'Heart Chakra',
    sanskrit: 'Anāhata (अनाहत)',
    location: 'Center of Chest',
    color: '#2E7D32',
    element: 'Air (Vayu)',
    mantra: 'YAM',
    frequency: '639 Hz',
    freqNum: 639,
    gemstone: 'Rose Quartz, Green Jade & Emerald',
    affirmation: 'I live with an open heart; love, forgiveness, and compassion radiate through me.',
    description: 'Anahata is the divine bridge linking physical earthly chakras to spiritual celestial realms. It holds unconditional divine love (Prema) and deep forgiveness that dissolves resentment and grief.',
    signsOfBalance: 'Deep empathy, generous spirit, self-acceptance, boundless capacity to love.',
    healingPractice: 'Loving-kindness meditation, Pranayama (Anulom Vilom), heart-opening backbends.'
  },
  {
    id: 'throat',
    number: 5,
    name: 'Throat Chakra',
    sanskrit: 'Viśuddha (विशुद्ध)',
    location: 'Throat & Vocal Center',
    color: '#1E88E5',
    element: 'Space / Ether (Akasha)',
    mantra: 'HAM',
    frequency: '741 Hz',
    freqNum: 741,
    gemstone: 'Turquoise, Aquamarine & Sodalite',
    affirmation: 'I speak my highest spiritual truth with serenity, clarity, and compassionate grace.',
    description: 'Vishuddha is the vessel of authentic vibration, sacred chants, and truthful communication. When open, your voice carries healing resonance, inspiring everyone around you without fear of judgment.',
    signsOfBalance: 'Eloquent expression, active empathetic listening, truthful integrity, clear singing.',
    healingPractice: 'Vedic mantra chanting, neck release stretches, silent contemplative walks.'
  },
  {
    id: 'thirdeye',
    number: 6,
    name: 'Third Eye Chakra',
    sanskrit: 'Ājñā (आज्ञा)',
    location: 'Space Between Eyebrows (Bhrumadhya)',
    color: '#4A306D',
    element: 'Light (Prakasha)',
    mantra: 'OM',
    frequency: '852 Hz',
    freqNum: 852,
    gemstone: 'Amethyst, Lapis Lazuli & Fluorite',
    affirmation: 'I trust my sacred intuition; divine clarity guides my sight and choices.',
    description: 'Ajna is the spiritual eye of inner vision, discernment, and higher wisdom. Beyond duality and illusions, an awakened Third Eye allows you to perceive synchronicities and inner spiritual truths.',
    signsOfBalance: 'Vivid intuition, foresight, mental calmness, transcendent spiritual dreams.',
    healingPractice: 'Trataka (gazing at a sacred ghee diya), chanting sacred OM, mindful contemplation.'
  },
  {
    id: 'crown',
    number: 7,
    name: 'Crown Chakra',
    sanskrit: 'Sahasrāra (सहस्रार)',
    location: 'Crown of the Head',
    color: '#2E1A47',
    element: 'Cosmic Consciousness (Brahman)',
    mantra: 'SO-HAM / SILENCE',
    frequency: '963 Hz',
    freqNum: 963,
    gemstone: 'Clear Quartz, Selenite & Diamond',
    affirmation: 'I am one with cosmic infinity, transcendental peace, and supreme grace.',
    description: 'Sahasrara represents thousand-petaled lotus blooming into cosmic unity. Transcending the physical ego, it brings unshakeable bliss (Ananda), spiritual oneness, and communion with the divine source.',
    signsOfBalance: 'Profound peace, detachment from worldly anxiety, spiritual bliss, unity with all beings.',
    healingPractice: 'Silent meditation, surrender prayer (Ishvara Pranidhana), mindful gratitude.'
  }
];

let activeChakra = chakraData[0];

function initChakraSystem() {
  const navContainer = document.getElementById('chakraNavList');
  if (!navContainer) return;

  navContainer.innerHTML = '';

  chakraData.forEach((chakra, index) => {
    const btn = document.createElement('button');
    btn.className = `chakra-nav-btn ${index === 0 ? 'active' : ''}`;
    btn.style.setProperty('--chakra-color', chakra.color);
    btn.setAttribute('data-id', chakra.id);
    btn.setAttribute('aria-label', `${chakra.name} details`);

    btn.innerHTML = `
      <div class="chakra-symbol-icon" style="background: ${chakra.color}; box-shadow: 0 0 12px ${chakra.color}55;">
        <span class="chakra-icon-num">${chakra.number}</span>
        <span class="chakra-icon-om">ॐ</span>
      </div>
      <div class="chakra-nav-meta">
        <div class="chakra-nav-name">${chakra.name}</div>
        <div class="chakra-nav-sanskrit">${chakra.sanskrit.split('(')[0].trim()}</div>
      </div>
      <div class="chakra-nav-location">
        <i class="fa-solid fa-chevron-right" style="color: ${chakra.color}"></i>
      </div>
    `;

    btn.addEventListener('click', () => {
      document.querySelectorAll('.chakra-nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderChakraCard(chakra);
      playChakraSound(chakra.freqNum);
      // On mobile, scroll the selected pill into center view
      scrollChakraPillIntoView(chakra.id);
    });

    navContainer.appendChild(btn);
  });

  renderChakraCard(chakraData[0]);
}

function renderChakraCard(chakra) {
  activeChakra = chakra;
  const card = document.getElementById('chakraDisplayCard');
  if (!card) return;

  card.innerHTML = `
    <div class="chakra-display-header">
      <div class="chakra-display-title-wrap">
        <div class="chakra-big-badge" style="background: ${chakra.color}; color: ${chakra.color}">
          <i class="fa-solid fa-om" style="color: #fff"></i>
        </div>
        <div>
          <h3 class="chakra-display-name">${chakra.name}</h3>
          <p class="chakra-display-sanskrit">${chakra.sanskrit}</p>
        </div>
      </div>
      <div class="chakra-freq-badge">
        <div class="chakra-freq-label">Sacred Solfeggio</div>
        <div class="chakra-freq-val" style="color: ${chakra.color}">${chakra.frequency}</div>
      </div>
    </div>

    <p class="chakra-description">${chakra.description}</p>

    <div class="chakra-specs-grid">
      <div class="chakra-spec-box">
        <div class="chakra-spec-label"><i class="fa-solid fa-location-dot"></i> Sacred Center</div>
        <div class="chakra-spec-val">${chakra.location}</div>
      </div>
      <div class="chakra-spec-box">
        <div class="chakra-spec-label"><i class="fa-solid fa-seedling"></i> Element</div>
        <div class="chakra-spec-val">${chakra.element}</div>
      </div>
      <div class="chakra-spec-box">
        <div class="chakra-spec-label"><i class="fa-solid fa-music"></i> Seed Mantra (Bija)</div>
        <div class="chakra-spec-val" style="color: #D4AF37;">"${chakra.mantra}"</div>
      </div>
      <div class="chakra-spec-box">
        <div class="chakra-spec-label"><i class="fa-solid fa-gem"></i> Healing Crystal</div>
        <div class="chakra-spec-val">${chakra.gemstone}</div>
      </div>
    </div>

    <div class="chakra-affirmation">
      <strong><i class="fa-solid fa-sparkles"></i> Daily Sacred Affirmation</strong>
      "${chakra.affirmation}"
    </div>

    <div class="chakra-action-bar">
      <button class="btn btn-primary" id="playChakraToneBtn" style="background: linear-gradient(135deg, ${chakra.color} 0%, #D4AF37 100%)">
        <i class="fa-solid fa-bell"></i> Resonate Tone (${chakra.frequency})
      </button>
      <button class="btn btn-glass" onclick="chantChakraMantra('${chakra.name}', '${chakra.mantra}', ${chakra.freqNum})">
        <i class="fa-solid fa-om"></i> Chant "${chakra.mantra}" Mantra
      </button>
    </div>
  `;

  document.getElementById('playChakraToneBtn')?.addEventListener('click', () => {
    playChakraSound(chakra.freqNum);
    showBlessingToast(`Resonating ${chakra.name} with sacred ${chakra.frequency} vibration.`);
  });
}

/* ==========================================================================
   2. SACRED WEB AUDIO CONTINUOUS MEDITATION SOUND ENGINE
   Harmonically tuned 432 Hz & 528 Hz continuous drone + Tibetan bells
   Plays continuously until seeker toggles it off!
   ========================================================================== */
let audioCtx = null;
let isAmbientPlaying = false;
let ambientNodes = [];
let ambientTimer = null;
let masterAmbientGain = null;

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

/**
 * Creates rich acoustic Tibetan singing bowl resonance
 */
function playSingingBowlTone(baseFreq = 432, duration = 4.0, volume = 0.4) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Bronze bowl harmonic partial ratios
    const partials = [1, 2.76, 4.75, 5.4];
    const gains = [volume, volume * 0.45, volume * 0.25, volume * 0.1];

    partials.forEach((ratio, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(baseFreq * ratio, now);
      osc.detune.setValueAtTime((Math.random() - 0.5) * 6, now);

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(gains[i], now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    });
  } catch (e) {
    console.warn('Audio blocked or not permitted', e);
  }
}

function playChakraSound(frequency) {
  playSingingBowlTone(frequency, 4.5, 0.45);
}

/**
 * Starts continuous, soothing, mind-freshening temple meditation ambiance
 * Features: 108 Hz Sacred Om drone, 432 Hz healing overtone, gentle binaural alpha wave,
 * and periodic crystal bell chimes.
 */
function startContinuousAmbientSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Master gain node for smooth fade in/out
  masterAmbientGain = ctx.createGain();
  masterAmbientGain.gain.setValueAtTime(0.001, now);
  masterAmbientGain.gain.exponentialRampToValueAtTime(0.28, now + 2.5);
  masterAmbientGain.connect(ctx.destination);

  // 1. Root Om Meditation Drone (108 Hz + 108.35 Hz for 0.35 Hz calming alpha wave)
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const droneGain1 = ctx.createGain();
  const droneGain2 = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(108, now); // Sacred 108 Hz Om vibration
  droneGain1.gain.setValueAtTime(0.18, now);

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(108.35, now); // Binaural relaxation beat
  droneGain2.gain.setValueAtTime(0.16, now);

  osc1.connect(droneGain1);
  osc2.connect(droneGain2);
  droneGain1.connect(masterAmbientGain);
  droneGain2.connect(masterAmbientGain);

  // 2. Harmonic 432 Hz & 216 Hz Tanpura resonance
  const oscHarmonic = ctx.createOscillator();
  const oscHarmonicGain = ctx.createGain();
  oscHarmonic.type = 'triangle';
  oscHarmonic.frequency.setValueAtTime(216, now);
  oscHarmonicGain.gain.setValueAtTime(0.06, now);
  oscHarmonic.connect(oscHarmonicGain);
  oscHarmonicGain.connect(masterAmbientGain);

  const oscHigh = ctx.createOscillator();
  const oscHighGain = ctx.createGain();
  oscHigh.type = 'sine';
  oscHigh.frequency.setValueAtTime(432, now); // 432 Hz pure healing
  oscHighGain.gain.setValueAtTime(0.04, now);
  oscHigh.connect(oscHighGain);
  oscHighGain.connect(masterAmbientGain);

  // 3. Subtle breathing LFO modulation (inhale / exhale pace ~ 8 sec cycle)
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(0.125, now);
  lfoGain.gain.setValueAtTime(0.05, now);
  lfo.connect(lfoGain);
  lfoGain.connect(masterAmbientGain.gain);

  osc1.start(now);
  osc2.start(now);
  oscHarmonic.start(now);
  oscHigh.start(now);
  lfo.start(now);

  ambientNodes = [osc1, osc2, oscHarmonic, oscHigh, lfo, droneGain1, droneGain2, oscHarmonicGain, oscHighGain, lfoGain];

  // Immediate peaceful opening chime
  playSingingBowlTone(432, 6.0, 0.4);

  // Periodic serene Tibetan singing bowl chimes every 8.5 seconds
  const chimesScale = [432, 528, 648, 720, 864];
  let chimeIndex = 0;
  ambientTimer = setInterval(() => {
    if (!isAmbientPlaying) return;
    const freq = chimesScale[chimeIndex % chimesScale.length];
    chimeIndex++;
    playSingingBowlTone(freq, 5.5, 0.28);
  }, 8500);
}

function stopContinuousAmbientSound() {
  if (ambientTimer) {
    clearInterval(ambientTimer);
    ambientTimer = null;
  }

  if (masterAmbientGain && audioCtx) {
    const now = audioCtx.currentTime;
    try {
      masterAmbientGain.gain.setValueAtTime(masterAmbientGain.gain.value, now);
      masterAmbientGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    } catch (e) {}

    setTimeout(() => {
      ambientNodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch (e) {}
      });
      ambientNodes = [];
    }, 1300);
  }
}

window.toggleContinuousAmbientSound = function(forcePlay = null) {
  getAudioContext();
  const nextState = forcePlay !== null ? forcePlay : !isAmbientPlaying;

  if (nextState) {
    if (isAmbientPlaying) return; // already playing
    isAmbientPlaying = true;
    startContinuousAmbientSound();
    updateAmbientUI(true);
    showBlessingToast('🌸 Continuous Temple Meditation Sound Active (108 Hz + 432 Hz). Breathe peacefully.');
  } else {
    isAmbientPlaying = false;
    stopContinuousAmbientSound();
    updateAmbientUI(false);
    showBlessingToast('Temple meditation sound paused.');
  }
};

function updateAmbientUI(isPlaying) {
  const btn = document.getElementById('ambientSoundBtn');
  const textEl = document.getElementById('ambientSoundText');
  const drawerBtn = document.getElementById('drawerAmbientSoundBtn');
  const drawerText = document.getElementById('drawerAmbientSoundText');

  if (btn) {
    if (isPlaying) {
      btn.classList.add('playing');
      if (textEl) textEl.textContent = 'Temple Chimes: ON';
    } else {
      btn.classList.remove('playing');
      if (textEl) textEl.textContent = 'Temple Chimes';
    }
  }

  if (drawerBtn) {
    if (isPlaying) {
      drawerBtn.classList.add('playing');
      if (drawerText) drawerText.textContent = 'Temple Chimes: ON';
    } else {
      drawerBtn.classList.remove('playing');
      if (drawerText) drawerText.textContent = 'Temple Chimes: OFF';
    }
  }
}

function initSoundEngine() {
  const ambientToggle = document.getElementById('ambientSoundBtn');
  if (ambientToggle) {
    ambientToggle.addEventListener('click', () => {
      window.toggleContinuousAmbientSound();
    });
  }

  const drawerAmbientToggle = document.getElementById('drawerAmbientSoundBtn');
  if (drawerAmbientToggle) {
    drawerAmbientToggle.addEventListener('click', () => {
      window.toggleContinuousAmbientSound();
    });
  }

  // Sound bath explore buttons in offerings
  const soundBathChimeBtn = document.getElementById('soundBathChimeBtn');
  if (soundBathChimeBtn) {
    soundBathChimeBtn.addEventListener('click', () => {
      playSingingBowlTone(528, 5.5, 0.5);
      showBlessingToast('528 Hz Miraculous DNA & Heart Solfeggio Resonating.');
    });
  }
}

/* ==========================================================================
   3. VIRTUAL SACRED BRASS DIYA & SOLFEGGIO TUNER (Interactive Sanctuary Altar)
   ========================================================================== */
function initVirtualDiya() {
  const diyaPedestal = document.getElementById('diyaPedestal');
  const flameGroup = document.getElementById('animatedFlameGroup');
  const countEl = document.getElementById('diyaCounterNum');
  const lightBtn = document.getElementById('lightDiyaBtn');
  const lightBtnText = document.getElementById('lightDiyaBtnText');
  const toggleBtn = document.getElementById('toggleDiyaBtn');
  const toggleIcon = document.getElementById('toggleDiyaIcon');
  const toggleText = document.getElementById('toggleDiyaText');
  const petalsContainer = document.getElementById('petalsShowerContainer');
  const dedicationInput = document.getElementById('diyaDedicationInput');
  const blessingText = document.getElementById('blessingQuoteText');
  const freqChips = document.querySelectorAll('.freq-chip-btn');
  const activeFreqBadge = document.getElementById('activeFreqBadge');

  if (!diyaPedestal || !flameGroup || !countEl) return;

  let currentCount = parseInt(localStorage.getItem('sakoonsay_diya_count') || '14850', 10);
  let isDiyaLit = localStorage.getItem('sakoonsay_diya_lit') !== 'false';
  let activeFreq = 528;

  const dynamicBlessings = [
    'May divine tranquility soothe your anxiety and grant everlasting peace to your heart.',
    'May the sacred flame dissolve worries, fears, and psychological heaviness from your mind.',
    'May peace radiate through your thoughts, nervous system, and home with pure calm.',
    'May the eternal light awaken courage, clarity, and deep emotional balance within you.'
  ];

  function updateDiyaDisplay() {
    countEl.textContent = currentCount.toLocaleString();
    if (isDiyaLit) {
      flameGroup.classList.remove('off');
      if (lightBtnText) lightBtnText.textContent = 'Offer Flower Petals & Re-light';
      if (toggleText) toggleText.textContent = 'Blow Out Flame';
      if (toggleIcon) toggleIcon.className = 'fa-solid fa-eye-slash';
    } else {
      flameGroup.classList.add('off');
      if (lightBtnText) lightBtnText.textContent = 'Light Sacred Diya';
      if (toggleText) toggleText.textContent = 'Kindle Diya';
      if (toggleIcon) toggleIcon.className = 'fa-solid fa-eye';
    }
  }

  function triggerPetalsShower() {
    if (!petalsContainer) return;
    petalsContainer.style.display = 'block';
    petalsContainer.classList.remove('active');
    void petalsContainer.offsetWidth;
    petalsContainer.classList.add('active');
    setTimeout(() => {
      petalsContainer.style.display = 'none';
    }, 4000);
  }

  function lightDiya(withPetals = true) {
    currentCount++;
    isDiyaLit = true;
    localStorage.setItem('sakoonsay_diya_count', currentCount.toString());
    localStorage.setItem('sakoonsay_diya_lit', 'true');
    updateDiyaDisplay();

    // Sound chime with current frequency
    playSingingBowlTone(activeFreq, 4.0, 0.45);

    if (withPetals) {
      triggerPetalsShower();
    }

    const dedication = dedicationInput ? dedicationInput.value.trim() : '';
    if (dedication) {
      showBlessingToast(`✨ Sacred Diya dedicated for: "${dedication}". May divine peace fulfill your prayer.`);
    } else {
      showBlessingToast('✨ Sacred Diya Lit! May divine light illuminate your path and dissolve distress.');
    }
  }

  function toggleDiya() {
    isDiyaLit = !isDiyaLit;
    localStorage.setItem('sakoonsay_diya_lit', isDiyaLit ? 'true' : 'false');
    updateDiyaDisplay();

    if (isDiyaLit) {
      playSingingBowlTone(activeFreq, 3.5, 0.4);
      triggerPetalsShower();
      showBlessingToast('🔥 Sacred Diya rekindled with divine flame.');
    } else {
      showBlessingToast('💨 Flame rested in quiet stillness. Click to rekindle whenever needed.');
    }
  }

  // Event Listeners
  diyaPedestal.addEventListener('click', () => lightDiya(true));
  if (lightBtn) lightBtn.addEventListener('click', () => lightDiya(true));
  if (toggleBtn) toggleBtn.addEventListener('click', toggleDiya);

  // Dedication input live blessing update
  if (dedicationInput && blessingText) {
    dedicationInput.addEventListener('input', () => {
      const val = dedicationInput.value.trim();
      if (val.length > 2) {
        blessingText.textContent = `"Offering dedicated for '${val}': May peace and pure calm envelope this intention."`;
      } else {
        blessingText.textContent = `"${dynamicBlessings[0]}"`;
      }
    });
  }

  // Solfeggio frequency selection
  freqChips.forEach(chip => {
    chip.addEventListener('click', () => {
      freqChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const freq = parseInt(chip.getAttribute('data-freq') || '528', 10);
      const name = chip.getAttribute('data-name') || `${freq} Hz`;
      activeFreq = freq;
      if (activeFreqBadge) activeFreqBadge.textContent = `${name} Selected`;
      playSingingBowlTone(activeFreq, 4.5, 0.45);
      showBlessingToast(`🎵 ${name} Solfeggio Sound Bath Resonating.`);
    });
  });

  updateDiyaDisplay();
}

/* ==========================================================================
   4. CHAKRA BALANCE QUICK SELF-ASSESSMENT QUIZ
   ========================================================================== */
const quizQuestions = [
  {
    q: 'How have your energy and physical vitality felt over recent weeks?',
    options: [
      { text: 'I feel anxious, ungrounded, restless, or fearful about security.', chakraId: 'root' },
      { text: 'I feel emotionally numb, disconnected from creativity and joy.', chakraId: 'sacral' },
      { text: 'I struggle with confidence, hesitation, or digestive stress.', chakraId: 'solar' },
      { text: 'I feel balanced physically but seek deeper spiritual clarity.', chakraId: 'crown' }
    ]
  },
  {
    q: 'When expressing your emotions and relating to loved ones:',
    options: [
      { text: 'I hold onto past hurts and find it difficult to fully forgive.', chakraId: 'heart' },
      { text: 'I fear speaking my real truth and withhold my thoughts.', chakraId: 'throat' },
      { text: 'I feel overwhelmed by overthinking, mental fog, or lack of intuition.', chakraId: 'thirdeye' },
      { text: 'I feel secure and open to experiencing unconditional kindness.', chakraId: 'heart' }
    ]
  },
  {
    q: 'What is your primary spiritual intention at Sakoonsay sanctuary?',
    options: [
      { text: 'Overcome burnout and build rock-solid peace and stability.', chakraId: 'root' },
      { text: 'Awaken artistic inspiration, passion, and flow in my life.', chakraId: 'sacral' },
      { text: 'Achieve supreme mental clarity, meditation depth, and divine connection.', chakraId: 'crown' },
      { text: 'Unlock my inner voice and radiate sovereign confidence.', chakraId: 'solar' }
    ]
  }
];

let currentQuizStep = 0;
const chakraScores = {
  root: 0,
  sacral: 0,
  solar: 0,
  heart: 0,
  throat: 0,
  thirdeye: 0,
  crown: 0
};

function initQuizSystem() {
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const qBox = document.getElementById('quizQuestionBox');
  const resultBox = document.getElementById('quizResultBox');
  if (!qBox || !resultBox) return;

  if (currentQuizStep >= quizQuestions.length) {
    displayQuizResult();
    return;
  }

  qBox.style.display = 'block';
  resultBox.style.display = 'none';

  const currentQ = quizQuestions[currentQuizStep];
  qBox.innerHTML = `
    <div class="quiz-step-indicator">Step ${currentQuizStep + 1} of ${quizQuestions.length}</div>
    <h3 class="quiz-question-title">${currentQ.q}</h3>
    <div class="quiz-options-list">
      ${currentQ.options.map((opt, i) => `
        <button class="quiz-option-btn" data-chakra="${opt.chakraId}">
          <span class="quiz-option-circle"></span>
          <span>${opt.text}</span>
        </button>
      `).join('')}
    </div>
  `;

  document.querySelectorAll('.quiz-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('selected');
      const targetChakra = btn.getAttribute('data-chakra');
      chakraScores[targetChakra] = (chakraScores[targetChakra] || 0) + 1;

      setTimeout(() => {
        currentQuizStep++;
        renderQuizQuestion();
      }, 350);
    });
  });
}

function displayQuizResult() {
  const qBox = document.getElementById('quizQuestionBox');
  const resultBox = document.getElementById('quizResultBox');
  if (!qBox || !resultBox) return;

  qBox.style.display = 'none';
  resultBox.style.display = 'block';

  // Determine top needed chakra
  let highestChakraId = 'heart';
  let maxScore = -1;
  for (const [key, val] of Object.entries(chakraScores)) {
    if (val > maxScore) {
      maxScore = val;
      highestChakraId = key;
    }
  }

  const resultChakra = chakraData.find(c => c.id === highestChakraId) || chakraData[3];

  resultBox.innerHTML = `
    <div class="quiz-result-aura-circle" style="background: ${resultChakra.color}; box-shadow: 0 0 35px ${resultChakra.color}">
      <i class="fa-solid fa-sparkles"></i>
    </div>
    <span class="section-tag"><i class="fa-solid fa-gem"></i> Your Sanctuary Diagnosis</span>
    <h3 style="font-size: 2rem; color: #2E1A47; margin: 0.8rem 0;">Aura Focus: ${resultChakra.name}</h3>
    <p style="font-style: italic; color: #B3861B; font-weight: 600; margin-bottom: 1.25rem;">
      ${resultChakra.sanskrit} • Resonant Frequency: ${resultChakra.frequency}
    </p>
    <p style="max-width: 620px; margin: 0 auto 1.5rem; color: #5C5468; line-height: 1.7;">
      Based on your energy profile, your <strong>${resultChakra.name}</strong> is inviting gentle realignment. ${resultChakra.healingPractice} will bring profound harmony back to your life.
    </p>
    <div style="margin-bottom: 2rem;">
      <span class="badge badge-open"><i class="fa-solid fa-circle-check"></i> Recommended Crystal: ${resultChakra.gemstone}</span>
    </div>
    <div class="quiz-result-actions" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
      <button class="btn btn-primary" onclick="jumpToChakra('${resultChakra.id}')">
        <i class="fa-solid fa-wand-magic-sparkles"></i> Explore ${resultChakra.name} In Detail
      </button>
      <button class="btn btn-glass" onclick="resetQuiz()">
        <i class="fa-solid fa-rotate-left"></i> Retake Self-Assessment
      </button>
    </div>
  `;
}

window.resetQuiz = function() {
  currentQuizStep = 0;
  for (const key of Object.keys(chakraScores)) {
    chakraScores[key] = 0;
  }
  renderQuizQuestion();
};

window.jumpToChakra = function(chakraId) {
  const target = chakraData.find(c => c.id === chakraId);
  if (target) {
    const navBtn = document.querySelector(`.chakra-nav-btn[data-id="${chakraId}"]`);
    if (navBtn) {
      document.querySelectorAll('.chakra-nav-btn').forEach(b => b.classList.remove('active'));
      navBtn.classList.add('active');
    }
    renderChakraCard(target);
    document.getElementById('chakras')?.scrollIntoView({ behavior: 'smooth' });
  }
};

/* ==========================================================================
   5. REAL-TIME TEMPLE TIMINGS & STATUS BADGES
   ========================================================================== */
function initLiveTempleStatus() {
  // Update status badges dynamically based on user's current local hour
  const now = new Date();
  const currentHour = now.getHours();

  const morningBadge = document.getElementById('morningAartiBadge');
  const dhyanaBadge = document.getElementById('dhyanaBadge');
  const eveningBadge = document.getElementById('eveningAartiBadge');
  const soundBathBadge = document.getElementById('soundBathBadge');

  // Morning Mangala Aarti: 05:30 - 08:00
  if (morningBadge) {
    if (currentHour >= 5 && currentHour < 8) {
      setBadge(morningBadge, true, 'Live Now in Sanctum');
    } else {
      setBadge(morningBadge, false, 'Next at 05:30 AM');
    }
  }

  // Silent Dhyanam & Chakra Meditation: 08:00 - 16:00
  if (dhyanaBadge) {
    if (currentHour >= 8 && currentHour < 16) {
      setBadge(dhyanaBadge, true, 'Active Sanctum Hours');
    } else {
      setBadge(dhyanaBadge, false, 'Daily 08:00 AM - 04:00 PM');
    }
  }

  // Sandhya Aarti & Sacred Lamp Darshan: 18:00 - 20:30
  if (eveningBadge) {
    if (currentHour >= 18 && currentHour < 21) {
      setBadge(eveningBadge, true, 'Live Evening Darshan');
    } else {
      setBadge(eveningBadge, false, 'Starts at 06:00 PM');
    }
  }

  // Celestial Sound Bath & Om Chanting: 20:30 - 22:00
  if (soundBathBadge) {
    if (currentHour >= 20 && currentHour < 22) {
      setBadge(soundBathBadge, true, 'Active Healing Session');
    } else {
      setBadge(soundBathBadge, false, 'Nightly at 08:30 PM');
    }
  }
}

function setBadge(el, isActive, text) {
  if (isActive) {
    el.className = 'badge badge-open';
    el.innerHTML = `<span class="pulse-dot emerald"></span> ${text}`;
  } else {
    el.className = 'badge badge-notice';
    el.innerHTML = `<span class="pulse-dot amber"></span> ${text}`;
  }
}

/* ==========================================================================
   6. SACRED BLESSINGS & MANTRA ACTIONS (NO BOOKING)
   ========================================================================== */
function initModalsAndToasts() {
  // Setup quick header action for lighting diya
  const headerDiyaBtn = document.getElementById('headerDiyaBtn');
  if (headerDiyaBtn) {
    headerDiyaBtn.addEventListener('click', () => {
      const flameGroup = document.getElementById('animatedFlameGroup');
      const counterEl = document.getElementById('diyaCounterNum');
      let currentCount = parseInt(localStorage.getItem('sakoonsay_diya_count') || '14850', 10) + 1;
      localStorage.setItem('sakoonsay_diya_count', currentCount.toString());
      localStorage.setItem('sakoonsay_diya_lit', 'true');
      if (counterEl) counterEl.textContent = currentCount.toLocaleString();
      if (flameGroup) flameGroup.classList.remove('off');

      const petals = document.getElementById('petalsShowerContainer');
      if (petals) {
        petals.style.display = 'block';
        setTimeout(() => { petals.style.display = 'none'; }, 3500);
      }

      playSingingBowlTone(528, 4.0);
      showBlessingToast('✨ Sacred Diya Lit! May divine peace illuminate your heart and home. ॐ');
    });
  }

  // Header quick chime
  const headerChimeBtn = document.getElementById('headerChimeBtn');
  if (headerChimeBtn) {
    headerChimeBtn.addEventListener('click', () => {
      playSingingBowlTone(432, 4.5);
      showBlessingToast('🔔 Sacred Temple Bell (432 Hz Solfeggio) resonated across the sanctuary.');
    });
  }

  // Sanctum Connect & Address Form Submission
  const sanctumConnectForm = document.getElementById('sanctumConnectForm');
  if (sanctumConnectForm) {
    sanctumConnectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('connectName')?.value.trim() || 'Seeker';
      const email = document.getElementById('connectEmail')?.value.trim();
      const address = document.getElementById('connectAddress')?.value.trim();

      playSingingBowlTone(528, 4.5);
      showBlessingToast(`🙏 Pranam ${name}! Your sacred message from ${address} is received. Divine blessings sent to ${email}. ॐ`);
      sanctumConnectForm.reset();
    });
  }

  // Footer Daily Blessing & Address Form Submission
  const footerBlessingForm = document.getElementById('footerBlessingForm');
  if (footerBlessingForm) {
    footerBlessingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('footerEmailInput')?.value.trim();
      const address = document.getElementById('footerAddressInput')?.value.trim();
      const locationText = address ? ` for ${address}` : '';

      playSingingBowlTone(432, 4.0);
      showBlessingToast(`✨ Dhanyawad! Daily sacred blessings registered for ${email}${locationText}. ॐ शान्तिः`);
      footerBlessingForm.reset();
    });
  }
}

window.chantChakraMantra = function(chakraName, mantra, freqNum = 528) {
  playSingingBowlTone(freqNum, 4.5);
  showBlessingToast(`✨ Chanting sacred seed "${mantra}" for ${chakraName}. Feel the energy flowing harmoniously.`);
};

window.sendTempleBlessing = function(intention = 'Universal Peace & Well-being') {
  playSingingBowlTone(528, 4.5);
  showBlessingToast(`🙏 Sacred Sankalpa for "${intention}" offered at the sanctum altar. ॐ शान्तिः`);
};

function showBlessingToast(message) {
  let toast = document.getElementById('blessingToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'blessingToast';
    toast.className = 'toast-blessing';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-om" style="color: #FDE68A; font-size: 1.4rem;"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   7. MOBILE DESIGNER DRAWER NAVIGATION & SMOOTH SCROLL
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const header = document.querySelector('.site-header');

  function openDrawer() {
    toggleBtn?.classList.add('active');
    drawer?.classList.add('open');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent background scrolling while drawer is open
  }

  function closeDrawer() {
    toggleBtn?.classList.remove('active');
    drawer?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (drawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    closeBtn?.addEventListener('click', closeDrawer);
    overlay?.addEventListener('click', closeDrawer);

    // Close when any drawer link is clicked
    document.querySelectorAll('.drawer-link').forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  // Header scroll shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Active nav link tracking on scroll
  const sections = document.querySelectorAll('section[id], aside[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let currentSection = '';
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = '#' + section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active-link');
      if (link.getAttribute('href') === currentSection) {
        link.classList.add('active-link');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* ==========================================================================
   8. MOBILE CHAKRA PILL: AUTO-SCROLL ACTIVE INTO VIEW
   ========================================================================== */
function scrollChakraPillIntoView(chakraId) {
  const navList = document.getElementById('chakraNavList');
  if (!navList) return;
  // Only auto-scroll if horizontal (mobile)
  if (navList.scrollWidth <= navList.clientWidth) return;
  const activeBtn = navList.querySelector(`.chakra-nav-btn[data-id="${chakraId}"]`);
  if (!activeBtn) return;
  const listRect = navList.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();
  const scrollLeft = navList.scrollLeft + btnRect.left - listRect.left - (listRect.width / 2) + (btnRect.width / 2);
  navList.scrollTo({ left: scrollLeft, behavior: 'smooth' });
}

/* ==========================================================================
   9. NEURO-CLINICAL PSYCHIATRY PRELOADER CONTROLLER
   ========================================================================== */
function initPsychiatryPreloader() {
  const preloader = document.getElementById('psychiatryPreloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 600);
    }, 1000);
  });

  // Safety fallback in case window load fired earlier
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 600);
    }
  }, 2200);
}
initPsychiatryPreloader();

/* ==========================================================================
   10. 4-7-8 PRANAYAMA BREATHING CALMER INTERACTIVE CONTROLLER
   ========================================================================== */
let breathingActive = false;
let breathCycle = 1;
let breathTimer = null;
let breathCounter = 0;

function toggleBreathingExercise() {
  if (breathingActive) {
    stopBreathingExercise();
  } else {
    startBreathingExercise();
  }
}

function startBreathingExercise() {
  breathingActive = true;
  breathCycle = 1;

  const btnText = document.getElementById('breathingBtnText');
  const btnIcon = document.getElementById('breathingBtnIcon');
  const cycleIndicator = document.getElementById('cycleIndicator');
  const cycleBadgeText = document.getElementById('cycleBadgeText');

  if (btnText) btnText.textContent = 'Pause Exercise';
  if (btnIcon) btnIcon.className = 'fa-solid fa-stop';
  if (cycleIndicator) cycleIndicator.style.display = 'flex';
  if (cycleBadgeText) cycleBadgeText.textContent = 'Cycle #' + breathCycle;

  // Sound cue
  if (window.playSolfeggioTone) {
    window.playSolfeggioTone(432, 0.4);
  }

  runBreathingStep('Inhale', 4);
}

function stopBreathingExercise() {
  breathingActive = false;
  if (breathTimer) {
    clearInterval(breathTimer);
    breathTimer = null;
  }

  const ring = document.getElementById('breathRing');
  const phaseText = document.getElementById('breathPhaseText');
  const counterText = document.getElementById('breathCounterText');
  const instructionText = document.getElementById('breathInstructionText');
  const btnText = document.getElementById('breathingBtnText');
  const btnIcon = document.getElementById('breathingBtnIcon');
  const cycleIndicator = document.getElementById('cycleIndicator');

  if (ring) {
    ring.classList.remove('inhale', 'hold', 'exhale');
  }
  if (phaseText) phaseText.textContent = 'Ready';
  if (counterText) counterText.textContent = '4-7-8';
  if (instructionText) instructionText.textContent = 'Click Start to Begin';
  if (btnText) btnText.textContent = 'Start 4-7-8 Breathing';
  if (btnIcon) btnIcon.className = 'fa-solid fa-play';
  if (cycleIndicator) cycleIndicator.style.display = 'none';
}

function runBreathingStep(phase, seconds) {
  if (!breathingActive) return;

  const ring = document.getElementById('breathRing');
  const phaseText = document.getElementById('breathPhaseText');
  const counterText = document.getElementById('breathCounterText');
  const instructionText = document.getElementById('breathInstructionText');
  const cycleBadgeText = document.getElementById('cycleBadgeText');

  if (ring) {
    ring.classList.remove('inhale', 'hold', 'exhale');
    ring.classList.add(phase.toLowerCase());
  }

  if (phaseText) phaseText.textContent = phase;
  if (counterText) counterText.textContent = seconds;

  if (instructionText) {
    if (phase === 'Inhale') {
      instructionText.textContent = 'Breathe in divine light (4s)';
    } else if (phase === 'Hold') {
      instructionText.textContent = 'Hold calm in chest (7s)';
    } else {
      instructionText.textContent = 'Exhale all tension (8s)';
    }
  }

  breathCounter = seconds;
  if (breathTimer) clearInterval(breathTimer);

  breathTimer = setInterval(() => {
    if (!breathingActive) {
      clearInterval(breathTimer);
      return;
    }
    breathCounter--;
    if (counterText) counterText.textContent = breathCounter;

    if (breathCounter <= 0) {
      clearInterval(breathTimer);
      if (phase === 'Inhale') {
        if (window.playSolfeggioTone) window.playSolfeggioTone(528, 0.3);
        runBreathingStep('Hold', 7);
      } else if (phase === 'Hold') {
        if (window.playSolfeggioTone) window.playSolfeggioTone(396, 0.3);
        runBreathingStep('Exhale', 8);
      } else {
        // Completed 1 cycle
        breathCycle++;
        if (cycleBadgeText) cycleBadgeText.textContent = 'Cycle #' + breathCycle;
        if (window.playSolfeggioTone) window.playSolfeggioTone(432, 0.4);
        runBreathingStep('Inhale', 4);
      }
    }
  }, 1000);
}
