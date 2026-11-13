/**
 * Sukoon Temple (Spritual Sanctum)
 * Vanilla JavaScript (Bootstrap 5 Compatible)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. TEMPLE PRELOADER
  const preloader = document.getElementById('templePreloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 600);
    }, 900);
  }

  // 2. LIVE CLOCK & SANCTUM STATUS
  function updateTempleClock() {
    const now = new Date();
    const istOptions = { timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const istTimeString = now.toLocaleTimeString('en-US', istOptions);

    const clockEl = document.getElementById('sanctumLiveClock');
    if (clockEl) {
      clockEl.textContent = `IST ${istTimeString}`;
    }
  }
  updateTempleClock();
  setInterval(updateTempleClock, 1000);

  // 3. WEB AUDIO 432 HZ SACRED BELL
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
      console.warn('AudioContext requires user gesture');
    }
  }

  // 4. DAILY SACRED WISDOM & NEURO-INSIGHT DATA & LOGIC
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
          setTimeout(() => {
            copyToast.style.display = 'none';
          }, 2500);
        }
      });
    });
  }

  // 5. SACRED BELL QUICK BUTTONS
  document.querySelectorAll('.trigger-sacred-bell').forEach(btn => {
    btn.addEventListener('click', playSacredBell);
  });

  // 6. BOOKING MODAL FORM SUBMIT
  const bookingForm = document.getElementById('templeBookingForm');
  const bookingSuccessAlert = document.getElementById('bookingSuccessAlert');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playSacredBell();
      if (bookingSuccessAlert) {
        bookingSuccessAlert.style.display = 'block';
        setTimeout(() => {
          bookingSuccessAlert.style.display = 'none';
          const modalEl = document.getElementById('bookingModal');
          if (modalEl && window.bootstrap) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
          }
          bookingForm.reset();
        }, 2200);
      }
    });
  }
});

