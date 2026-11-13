/**
 * Sukoonsay - Unified Sacred & Clinical Sanctuary
 * Vanilla JavaScript (Bootstrap 5 Compatible)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. PRELOADER HANDLING
  const preloader = document.getElementById('unifiedPreloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 600);
    }, 900);
  }

  // 2. WEB AUDIO API - 432 HZ SOLFEGGIO & SACRED BELLS
  let audioCtx = null;
  let chimesActive = false;
  let chimeInterval = null;

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

  function playTone(freq, duration, type = 'sine') {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('AudioContext user gesture required');
    }
  }

  function playSacredBell() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const baseFreq = 432; // Sacred Healing Solfeggio frequency

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
      console.warn('AudioContext user gesture required');
    }
  }

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

  // Audio button listeners
  document.querySelectorAll('.audio-chime-toggle').forEach(btn => {
    btn.addEventListener('click', toggleAmbientChimes);
  });
  document.querySelectorAll('.ring-bell-btn').forEach(btn => {
    btn.addEventListener('click', playSacredBell);
  });

  // 3. MOBILE OFFCANVAS DRAWER
  const mobileToggle = document.getElementById('mobileToggleBtn');
  const mobileDrawer = document.getElementById('mobileSidebarDrawer');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  function openMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.add('drawer-open');
    if (sidebarBackdrop) sidebarBackdrop.style.display = 'block';
    if (mobileToggle) mobileToggle.classList.add('open');
    playTone(528, 0.15);
  }

  function closeMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.remove('drawer-open');
    if (sidebarBackdrop) sidebarBackdrop.style.display = 'none';
    if (mobileToggle) mobileToggle.classList.remove('open');
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (mobileDrawer && mobileDrawer.classList.contains('drawer-open')) {
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

  // 4. CORE HUMAN CRISIS STRESS PROBLEMS DATA & TABS
  const stressProblems = {
    relationship: {
      category: 'Heart & Relationships',
      icon: 'fa-solid fa-heart-crack',
      title: 'Relationship Grief, Heartbreak & Marital Disputes',
      subtitle: 'Healing broken trust, emotional detachment, fear of abandonment, and recurring conflicts.',
      bgGradient: 'linear-gradient(135deg, rgba(192, 57, 43, 0.08) 0%, rgba(212, 175, 55, 0.12) 100%)',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="100%" height="100%">
        <defs>
          <linearGradient id="relBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FBE5F5"/><stop offset="100%" stop-color="#F0EAF8"/></linearGradient>
          <radialGradient id="relGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#C0392B" stop-opacity="0.3"/><stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/></radialGradient>
        </defs>
        <rect width="320" height="200" rx="16" fill="url(#relBg)"/>
        <circle cx="160" cy="95" r="70" fill="url(#relGlow)"/>
        <ellipse cx="100" cy="130" rx="28" ry="12" fill="#C0392B" opacity="0.85" transform="rotate(-30 100 130)"/>
        <ellipse cx="220" cy="130" rx="28" ry="12" fill="#D4AF37" opacity="0.85" transform="rotate(30 220 130)"/>
        <path d="M160 115 C160 115 135 95 135 80 A17 17 0 0 1 160 75 A17 17 0 0 1 185 80 C185 95 160 115 160 115Z" fill="#C0392B"/>
        <circle cx="160" cy="78" r="4" fill="#FFFFFF" opacity="0.6"/>
        <line x1="160" y1="40" x2="160" y2="55" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <line x1="195" y1="52" x2="185" y2="62" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <line x1="125" y1="52" x2="135" y2="62" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <rect x="80" y="168" width="160" height="22" rx="11" fill="#FFFFFF" opacity="0.9"/>
        <text x="160" y="183" text-anchor="middle" font-family="'Plus Jakarta Sans',sans-serif" font-size="9" font-weight="700" fill="#2E1A47" letter-spacing="1">ANAHATA HEART HEALING</text>
      </svg>`,
      symptoms: [
        'Persistent ache in the chest, overwhelming sadness after conflict or breakup',
        'Fear of emotional vulnerability, jealousy, or chronic communication breakdown',
        'Over-analyzing texts, past conversations, and constant fear of losing partner'
      ],
      clinicalTitle: 'Psychiatric & EFT Therapy',
      clinicalPoints: [
        'Emotionally Focused Therapy (EFT) to decode underlying attachment wounds',
        'Cognitive defusion techniques to stop obsessive replaying of emotional pain',
        'Non-violent communication frameworks and healthy boundaries counseling'
      ],
      spiritualTitle: 'Anahata (Heart Chakra) Healing',
      spiritualPoints: [
        '4th Chakra Rose Quartz energy cleansing to dissolve emotional blockages',
        'Kshama (Divine Forgiveness) prayer to release karmic cords of resentment',
        'Radha-Krishna divine love contemplation for inner unconditional wholeness'
      ],
      mantra: 'ॐ मणये नमः (Om Hrim Namah - Anahata Heart Resonance)',
      mantraMeaning: 'I surrender my wounded heart to divine grace; love flows freely and heals my soul.',
      affirmation: 'My heart is strong, whole, and worthy of peaceful, tender, unconditional love.'
    },
    work: {
      category: 'Career & Burnout',
      icon: 'fa-solid fa-briefcase',
      title: 'Job Burnout, Workplace Pressure & Career Paralysis',
      subtitle: 'Overcoming mental exhaustion, imposter syndrome, toxic workplace stress, and anxiety over deadlines.',
      bgGradient: 'linear-gradient(135deg, rgba(230, 81, 0, 0.08) 0%, rgba(212, 175, 55, 0.12) 100%)',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="100%" height="100%">
        <defs>
          <linearGradient id="workBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FBE5F5"/><stop offset="100%" stop-color="#E5EBFA"/></linearGradient>
          <radialGradient id="sunRay" cx="50%" cy="45%" r="50%"><stop offset="0%" stop-color="#FF9800" stop-opacity="0.5"/><stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/></radialGradient>
        </defs>
        <rect width="320" height="200" rx="16" fill="url(#workBg)"/>
        <circle cx="160" cy="88" r="65" fill="url(#sunRay)"/>
        <circle cx="160" cy="88" r="38" fill="#FF9800" opacity="0.9"/>
        <circle cx="160" cy="88" r="28" fill="#FFD700" opacity="0.95"/>
        <circle cx="160" cy="88" r="16" fill="#FFFFFF" opacity="0.9"/>
        <line x1="160" y1="38" x2="160" y2="52" stroke="#FF9800" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
        <line x1="160" y1="124" x2="160" y2="138" stroke="#FF9800" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
        <line x1="110" y1="88" x2="124" y2="88" stroke="#FF9800" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
        <line x1="196" y1="88" x2="210" y2="88" stroke="#FF9800" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
        <rect x="80" y="168" width="160" height="22" rx="11" fill="#FFFFFF" opacity="0.9"/>
        <text x="160" y="183" text-anchor="middle" font-family="'Plus Jakarta Sans',sans-serif" font-size="9" font-weight="700" fill="#2E1A47" letter-spacing="1">KARMA YOGA & FOCUS RESET</text>
      </svg>`,
      symptoms: [
        'Waking up with dread on Monday mornings, chronic brain fog and fatigue',
        'Feeling like whatever you do is never enough, fear of being fired or evaluated',
        'Zero energy left for personal life after long working hours'
      ],
      clinicalTitle: 'Burnout & Neuro-Reset Protocol',
      clinicalPoints: [
        'Vagus nerve somatic down-regulation to switch off the chronic fight-or-flight state',
        'Work-life boundary structuring and cognitive restructuring of perfectionism',
        'Clinical attention recovery protocols to rebuild neurotransmitter balance'
      ],
      spiritualTitle: 'Karma Yoga & Solar Plexus Empowerment',
      spiritualPoints: [
        'Manipura Chakra (3rd Chakra) meditation to restore inner courage and stamina',
        'Bhagavad Gita Nishkama Karma: Dedicating actions without anxiety over fruits',
        'Sacred temple incense and Gayatri chanting at sunrise to clear mental fatigue'
      ],
      mantra: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन (Bhagavad Gita 2.47)',
      mantraMeaning: 'You have a right to your sacred duty, but never to the anxious obsession with its fruits.',
      affirmation: 'I am not defined by my productivity. I work with calm dedication and rest with deep reverence.'
    },
    finance: {
      category: 'Financial Fear & Scarcity',
      icon: 'fa-solid fa-coins',
      title: 'Financial Anxiety, Business Crisis & Scarcity Panic',
      subtitle: 'Liberating your mind from suffocating economic dread, debts, loss of stability, and fear of tomorrow.',
      bgGradient: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 152, 0, 0.08) 100%)',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="100%" height="100%">
        <defs>
          <linearGradient id="finBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#E5EBFA"/><stop offset="100%" stop-color="#FBE5F5"/></linearGradient>
          <radialGradient id="lotusGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#D4AF37" stop-opacity="0.4"/><stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/></radialGradient>
        </defs>
        <rect width="320" height="200" rx="16" fill="url(#finBg)"/>
        <circle cx="160" cy="95" r="70" fill="url(#lotusGlow)"/>
        <ellipse cx="160" cy="118" rx="45" ry="18" fill="#D4AF37" opacity="0.4"/>
        <circle cx="105" cy="145" r="12" fill="#D4AF37" opacity="0.9"/>
        <text x="105" y="150" text-anchor="middle" font-family="serif" font-size="13" fill="#180D26" font-weight="700">₹</text>
        <circle cx="215" cy="145" r="12" fill="#D4AF37" opacity="0.9"/>
        <text x="215" y="150" text-anchor="middle" font-family="serif" font-size="13" fill="#180D26" font-weight="700">₹</text>
        <rect x="80" y="168" width="160" height="22" rx="11" fill="#FFFFFF" opacity="0.9"/>
        <text x="160" y="183" text-anchor="middle" font-family="'Plus Jakarta Sans',sans-serif" font-size="9" font-weight="700" fill="#2E1A47" letter-spacing="1">LAKSHMI ABUNDANCE RITUAL</text>
      </svg>`,
      symptoms: [
        'Panic attacks triggered by checking bank balances, bills, or market downturns',
        'Obsessive scarcity thoughts: "What if I end up broke and homeless?"',
        'Physical tension in shoulders and jaw caused by continuous survival mode'
      ],
      clinicalTitle: 'Rational Crisis Desensitization',
      clinicalPoints: [
        'Catastrophic thinking interruption using evidence-based CBT reality-testing',
        'Somatic grounding to discharge physiological adrenaline before financial planning',
        'Action-oriented priority mapping to restore locus of control'
      ],
      spiritualTitle: 'Muladhara Grounding & Lakshmi Abundance',
      spiritualPoints: [
        'Root Chakra (Muladhara) earth connection to anchor deep survival security',
        'Mahalakshmi Ashtakam chanting to shift vibration from fear to sacred abundance',
        'Kanakadhara stotram frequencies to attract clarity, opportunity, and calm wisdom'
      ],
      mantra: 'ॐ श्रीं ह्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मांक दारिद्र्य नाशय प्रचुर धन देहि क्लीं ह्रीं श्रीं ॐ',
      mantraMeaning: 'May the universal light dissolve the illusion of scarcity and bless my home with peaceful abundance.',
      affirmation: 'The universe provides for me in seen and unseen ways. I make calm, wise decisions with confidence.'
    },
    overthinking: {
      category: 'Mind & Panic',
      icon: 'fa-solid fa-brain',
      title: 'Chronic Overthinking, 3 AM Anxiety & Panic Attacks',
      subtitle: 'Stopping the mental rollercoaster of worst-case scenarios, rapid heart rate, and sleepless nights.',
      bgGradient: 'linear-gradient(135deg, rgba(74, 48, 109, 0.1) 0%, rgba(229, 235, 250, 0.12) 100%)',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="100%" height="100%">
        <defs>
          <linearGradient id="overBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#2E1A47" stop-opacity="0.08"/><stop offset="100%" stop-color="#E5EBFA"/></linearGradient>
          <radialGradient id="moonAura" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="#D4AF37" stop-opacity="0.35"/><stop offset="100%" stop-color="#4A306D" stop-opacity="0"/></radialGradient>
        </defs>
        <rect width="320" height="200" rx="16" fill="#F5F0FF"/>
        <circle cx="160" cy="88" r="65" fill="url(#moonAura)"/>
        <path d="M130 138 C130 110 140 92 160 85 C180 92 190 110 190 138 Z" fill="#2E1A47" opacity="0.85"/>
        <ellipse cx="160" cy="82" rx="22" ry="12" fill="#D4AF37" opacity="0.9"/>
        <circle cx="160" cy="82" r="5" fill="#4A306D"/>
        <rect x="80" y="168" width="160" height="22" rx="11" fill="#FFFFFF" opacity="0.9"/>
        <text x="160" y="183" text-anchor="middle" font-family="'Plus Jakarta Sans',sans-serif" font-size="9" font-weight="700" fill="#2E1A47" letter-spacing="1">AJNA CHAKRA STILLNESS</text>
      </svg>`,
      symptoms: [
        'Lying awake with a racing mind, heart pounding without any physical danger',
        'Endless "What If?" loops and intrusive catastrophic thoughts that won\'t stop',
        'Feeling disconnected from your physical body (derealization or vertigo)'
      ],
      clinicalTitle: 'Clinical Anxiety & Somatic Grounding',
      clinicalPoints: [
        '5-4-3-2-1 Sensory Activation & physiological sigh breath resets',
        'Psychiatric evaluation for neurochemical support when anxiety is debilitating',
        'Exposure and Response Prevention (ERP) to conquer phantom health phobias'
      ],
      spiritualTitle: '432 Hz Solfeggio & Om Chanting',
      spiritualPoints: [
        'Ajna (Third Eye) & Sahasrara (Crown Chakra) calming with sacred sandalwood chandan',
        '108 repetitions of Maha Mrityunjaya Mantra for profound mental liberation',
        'Vedic temple bell resonation to instantly shatter obsessive thought patterns'
      ],
      mantra: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् | उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ||',
      mantraMeaning: 'We meditate on the three-eyed Lord who nourishes all beings. May He liberate us from anxiety and fear.',
      affirmation: 'My thoughts are like passing clouds. I am the boundless, peaceful sky behind them.'
    },
    family: {
      category: 'Family & Parental',
      icon: 'fa-solid fa-people-roof',
      title: 'Family Conflicts, Generational Trauma & Elder Guilt',
      subtitle: 'Navigating deep familial expectations, guilt trips, parental pressure, and household friction.',
      bgGradient: 'linear-gradient(135deg, rgba(179, 134, 27, 0.08) 0%, rgba(240, 234, 248, 0.12) 100%)',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="100%" height="100%">
        <defs>
          <linearGradient id="famBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FBE5F5"/><stop offset="100%" stop-color="#FFF8E1"/></linearGradient>
          <radialGradient id="famGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#D4AF37" stop-opacity="0.3"/><stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/></radialGradient>
        </defs>
        <rect width="320" height="200" rx="16" fill="url(#famBg)"/>
        <circle cx="160" cy="90" r="65" fill="url(#famGlow)"/>
        <polygon points="160,42 210,80 110,80" fill="#D4AF37" opacity="0.9"/>
        <rect x="118" y="78" width="84" height="68" rx="4" fill="#FFFFFF" opacity="0.9"/>
        <rect x="148" y="108" width="24" height="38" rx="12" fill="#2E1A47" opacity="0.8"/>
        <rect x="80" y="168" width="160" height="22" rx="11" fill="#FFFFFF" opacity="0.9"/>
        <text x="160" y="183" text-anchor="middle" font-family="'Plus Jakarta Sans',sans-serif" font-size="9" font-weight="700" fill="#2E1A47" letter-spacing="1">GRIHA SHANTI RITUAL</text>
      </svg>`,
      symptoms: [
        'Feeling suffocated by familial criticism, comparison with relatives, or emotional guilt',
        'Dreading family gatherings, walking on eggshells around parents or in-laws',
        'Carrying the unpaid emotional burden of taking care of everyone except yourself'
      ],
      clinicalTitle: 'Systemic Family Therapy',
      clinicalPoints: [
        'Differentiation of self: Learning to love your family without absorbing their anxiety',
        'Assertive communication strategies to decline unreasonable demands with grace',
        'Unpacking generational trauma patterns so you stop repeating them with children'
      ],
      spiritualTitle: 'Pitra Shanti & Griha Shanti Rituals',
      spiritualPoints: [
        'Griha Shanti Havan to clear negative energetic residues in the living space',
        'Pitra Tarpan prayer to heal ancestral lineages and invoke elders\' true blessings',
        'Lighting a ghee diya with camphor in the northeastern sanctuary corner'
      ],
      mantra: 'ॐ सह नाववतु | सह नौ भुनक्तु | सह वीर्यं करवावहै | तेजस्वि नावधीतमस्तु मा विद्विषावहै ||',
      mantraMeaning: 'May we be protected together; may we be nourished together; may there be no disharmony between us.',
      affirmation: 'I release the urge to please everyone. I honor my family with love and honor my boundaries with dignity.'
    },
    existential: {
      category: 'Soul & Purpose',
      icon: 'fa-solid fa-om',
      title: 'Existential Emptiness, Mid-Life Crisis & Grief of Loss',
      subtitle: 'Re-discovering why you are here when life feels meaningless, dry, mechanical, or grief-shattered.',
      bgGradient: 'linear-gradient(135deg, rgba(46, 26, 71, 0.1) 0%, rgba(251, 229, 245, 0.15) 100%)',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="100%" height="100%">
        <defs>
          <linearGradient id="exBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#180D26"/><stop offset="60%" stop-color="#2E1A47"/><stop offset="100%" stop-color="#4A306D"/></linearGradient>
          <radialGradient id="exGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#D4AF37" stop-opacity="0.5"/><stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/></radialGradient>
        </defs>
        <rect width="320" height="200" rx="16" fill="url(#exBg)"/>
        <circle cx="160" cy="88" r="60" fill="url(#exGlow)"/>
        <text x="160" y="108" text-anchor="middle" font-family="serif" font-size="68" fill="#D4AF37" opacity="0.9" font-weight="400">ॐ</text>
        <rect x="80" y="168" width="160" height="22" rx="11" fill="rgba(212,175,55,0.2)" stroke="#D4AF37" stroke-width="1"/>
        <text x="160" y="183" text-anchor="middle" font-family="'Plus Jakarta Sans',sans-serif" font-size="9" font-weight="700" fill="#D4AF37" letter-spacing="1">ADVAITA VEDANTA LIBERATION</text>
      </svg>`,
      symptoms: [
        'Feeling completely hollow inside even when everything looks fine from the outside',
        'Numbness after losing a parent, partner, or lifelong dream',
        'Asking "What is the point of all this running around?" every single day'
      ],
      clinicalTitle: 'Viktor Frankl Logotherapy',
      clinicalPoints: [
        'Existential psychotherapeutic meaning-mapping and value realignment',
        'Complicated grief processing through structured memory integration',
        'Rebuilding emotional resilience and neuroplastic openness to new purpose'
      ],
      spiritualTitle: 'Advaita Vedanta & Atma Darshan',
      spiritualPoints: [
        'Understanding your eternal soul nature beyond physical temporary roles',
        'Deep contemplation on Moksha (spiritual liberation) and soul karma',
        'Sacred temple darshan, holy Ganga jal purification, and silence retreat'
      ],
      mantra: 'असतो मा सद्गमय | तमसो मा ज्योतिर्गमय | मृत्योर्मा अमृतं गमय ||',
      mantraMeaning: 'Lead me from falsehood to truth; lead me from darkness to divine light; lead me from mortality to immortality.',
      affirmation: 'My soul has a sacred purpose. Even through darkness, a profound transformation is blossoming within me.'
    }
  };

  function selectProblem(id) {
    const prob = stressProblems[id];
    if (!prob) return;

    // Update active pill button
    document.querySelectorAll('.problem-pill-btn').forEach(btn => {
      if (btn.getAttribute('data-problem') === id) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const card = document.getElementById('problemDetailCard');
    if (card) {
      card.style.background = prob.bgGradient;
    }

    const iconOrb = document.getElementById('problemIconOrb');
    if (iconOrb) {
      iconOrb.innerHTML = `<i class="${prob.icon}"></i>`;
    }

    const catBadge = document.getElementById('problemCatBadge');
    if (catBadge) catBadge.textContent = prob.category;

    const title = document.getElementById('problemTitle');
    if (title) title.textContent = prob.title;

    const subtitle = document.getElementById('problemSubtitle');
    if (subtitle) subtitle.textContent = prob.subtitle;

    const svgWrap = document.getElementById('problemSvgWrap');
    if (svgWrap) svgWrap.innerHTML = prob.svg;

    // Symptoms
    const symptomsGrid = document.getElementById('problemSymptomsGrid');
    if (symptomsGrid) {
      symptomsGrid.innerHTML = prob.symptoms.map(s => `
        <div class="symptom-tag">
          <i class="fa-solid fa-bolt-lightning text-saffron"></i> ${s}
        </div>
      `).join('');
    }

    // Clinical
    const clinicalTitle = document.getElementById('clinicalTitle');
    if (clinicalTitle) clinicalTitle.textContent = prob.clinicalTitle;
    const clinicalPoints = document.getElementById('clinicalPoints');
    if (clinicalPoints) {
      clinicalPoints.innerHTML = prob.clinicalPoints.map(p => `
        <li><i class="fa-solid fa-check-double text-purple"></i> ${p}</li>
      `).join('');
    }

    // Spiritual
    const spiritualTitle = document.getElementById('spiritualTitle');
    if (spiritualTitle) spiritualTitle.textContent = prob.spiritualTitle;
    const spiritualPoints = document.getElementById('spiritualPoints');
    if (spiritualPoints) {
      spiritualPoints.innerHTML = prob.spiritualPoints.map(p => `
        <li><i class="fa-solid fa-om text-gold"></i> ${p}</li>
      `).join('');
    }

    // Mantra & Affirmation
    const mantraSanskrit = document.getElementById('mantraSanskrit');
    if (mantraSanskrit) mantraSanskrit.textContent = prob.mantra;
    const mantraTrans = document.getElementById('mantraTrans');
    if (mantraTrans) mantraTrans.textContent = prob.mantraMeaning;
    const affirmationText = document.getElementById('affirmationText');
    if (affirmationText) affirmationText.textContent = `"${prob.affirmation}"`;

    playTone(528, 0.15);
  }

  // Pill click handlers
  document.querySelectorAll('.problem-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const probId = btn.getAttribute('data-problem');
      if (probId) selectProblem(probId);
    });
  });

  // Footer problem quick links
  document.querySelectorAll('[data-select-problem]').forEach(link => {
    link.addEventListener('click', (e) => {
      const probId = link.getAttribute('data-select-problem');
      if (probId) {
        selectProblem(probId);
      }
    });
  });

  // 5. INNER PEACE QUOTIENT (IPQ) CALCULATOR
  const rangeSleep = document.getElementById('rangeSleep');
  const rangeOverthinking = document.getElementById('rangeOverthinking');
  const rangeRelationship = document.getElementById('rangeRelationship');
  const rangePurpose = document.getElementById('rangePurpose');

  const valSleep = document.getElementById('valSleep');
  const valOverthinking = document.getElementById('valOverthinking');
  const valRelationship = document.getElementById('valRelationship');
  const valPurpose = document.getElementById('valPurpose');

  const circleDial = document.getElementById('circleDial');
  const scoreNumber = document.getElementById('scoreNumber');
  const diagnosisContainer = document.getElementById('diagnosisContainer');
  const calcCta = document.getElementById('calcCta');

  function calculatePeaceScore() {
    if (!rangeSleep || !rangeOverthinking || !rangeRelationship || !rangePurpose) return;

    const sleep = parseInt(rangeSleep.value) || 3;
    const overthinking = parseInt(rangeOverthinking.value) || 4;
    const relationship = parseInt(rangeRelationship.value) || 3;
    const purpose = parseInt(rangePurpose.value) || 4;

    if (valSleep) valSleep.textContent = `${sleep} / 5`;
    if (valOverthinking) valOverthinking.textContent = `${overthinking} / 5`;
    if (valRelationship) valRelationship.textContent = `${relationship} / 5`;
    if (valPurpose) valPurpose.textContent = `${purpose} / 5`;

    const score = Math.round(((sleep + overthinking + relationship + purpose) / 20) * 100);

    if (circleDial) {
      circleDial.style.setProperty('--score-deg', `${score * 3.6}deg`);
    }
    if (scoreNumber) {
      scoreNumber.textContent = `${score}%`;
    }

    if (diagnosisContainer) {
      if (score >= 80) {
        diagnosisContainer.innerHTML = `
          <span class="diagnosis-badge high-peace">🕊️ High Serenity & Resonance</span>
          <p>Your nervous system and spirit are in beautiful harmony. Maintain this balance with daily temple chimes and mindfulness.</p>
        `;
      } else if (score >= 50) {
        diagnosisContainer.innerHTML = `
          <span class="diagnosis-badge moderate-peace">⚖️ Moderate Strain & Fatigue</span>
          <p>Daily demands are wearing down your reserves. We recommend combining 1-on-1 counseling with 432 Hz evening sound baths.</p>
        `;
      } else {
        diagnosisContainer.innerHTML = `
          <span class="diagnosis-badge critical-peace">🚨 High Turmoil & Overwhelm</span>
          <p>Your mind is in urgent need of professional grounding. Enter our Clinical Sanctuary immediately for a doctor assessment.</p>
        `;
      }
    }

    if (calcCta) {
      if (score < 60) {
        calcCta.innerHTML = `
          <a href="Phycartist/index.html" class="btn-royal-purple btn-sm w-100">
            <i class="fa-solid fa-brain"></i> Book Clinical Therapy Session
          </a>
        `;
      } else {
        calcCta.innerHTML = `
          <a href="Spritual/index.html" class="btn-saffron btn-sm w-100">
            <i class="fa-solid fa-om"></i> Light Temple Diya for Continued Grace
          </a>
        `;
      }
    }
  }

  [rangeSleep, rangeOverthinking, rangeRelationship, rangePurpose].forEach(input => {
    if (input) {
      input.addEventListener('input', calculatePeaceScore);
    }
  });

  // Initial calculation
  calculatePeaceScore();
});

