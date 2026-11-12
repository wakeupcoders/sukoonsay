import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface StressProblem {
  id: string;
  category: string;
  icon: string;
  illustration: string;
  title: string;
  subtitle: string;
  symptoms: string[];
  clinicalRemedy: {
    title: string;
    points: string[];
  };
  spiritualRemedy: {
    title: string;
    points: string[];
  };
  recommendedPortal: 'psychiatrist' | 'temple' | 'both';
  mantra: string;
  mantraMeaning: string;
  affirmation: string;
  bgGradient: string;
}

interface Testimonial {
  name: string;
  location: string;
  problem: string;
  solution: string;
  quote: string;
  avatarText: string;
  rating: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private sanitizer: DomSanitizer) {}

  // Utility: get illustration SVG content for a problem id
  getProblemIllustration(id: string): string {
    const svgs: Record<string, string> = {
      relationship: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="100%" height="100%">
        <defs>
          <linearGradient id="relBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FBE5F5"/><stop offset="100%" stop-color="#F0EAF8"/></linearGradient>
          <radialGradient id="relGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#C0392B" stop-opacity="0.3"/><stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/></radialGradient>
        </defs>
        <rect width="320" height="200" rx="16" fill="url(#relBg)"/>
        <circle cx="160" cy="95" r="70" fill="url(#relGlow)"/>
        <!-- Two hands reaching -->
        <ellipse cx="100" cy="130" rx="28" ry="12" fill="#C0392B" opacity="0.85" transform="rotate(-30 100 130)"/>
        <ellipse cx="220" cy="130" rx="28" ry="12" fill="#D4AF37" opacity="0.85" transform="rotate(30 220 130)"/>
        <!-- Heart -->
        <path d="M160 115 C160 115 135 95 135 80 A17 17 0 0 1 160 75 A17 17 0 0 1 185 80 C185 95 160 115 160 115Z" fill="#C0392B"/>
        <circle cx="160" cy="78" r="4" fill="#FFFFFF" opacity="0.6"/>
        <!-- Healing rays -->
        <line x1="160" y1="40" x2="160" y2="55" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <line x1="195" y1="52" x2="185" y2="62" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <line x1="125" y1="52" x2="135" y2="62" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <rect x="80" y="168" width="160" height="22" rx="11" fill="#FFFFFF" opacity="0.9"/>
        <text x="160" y="183" text-anchor="middle" font-family="'Plus Jakarta Sans',sans-serif" font-size="9" font-weight="700" fill="#2E1A47" letter-spacing="1">ANAHATA HEART HEALING</text>
      </svg>`,
      work: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="100%" height="100%">
        <defs>
          <linearGradient id="workBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FBE5F5"/><stop offset="100%" stop-color="#E5EBFA"/></linearGradient>
          <radialGradient id="sunRay" cx="50%" cy="45%" r="50%"><stop offset="0%" stop-color="#FF9800" stop-opacity="0.5"/><stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/></radialGradient>
        </defs>
        <rect width="320" height="200" rx="16" fill="url(#workBg)"/>
        <circle cx="160" cy="88" r="65" fill="url(#sunRay)"/>
        <!-- Solar Plexus Sun -->
        <circle cx="160" cy="88" r="38" fill="#FF9800" opacity="0.9"/>
        <circle cx="160" cy="88" r="28" fill="#FFD700" opacity="0.95"/>
        <circle cx="160" cy="88" r="16" fill="#FFFFFF" opacity="0.9"/>
        <!-- Rays -->
        <line x1="160" y1="38" x2="160" y2="52" stroke="#FF9800" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
        <line x1="160" y1="124" x2="160" y2="138" stroke="#FF9800" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
        <line x1="110" y1="88" x2="124" y2="88" stroke="#FF9800" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
        <line x1="196" y1="88" x2="210" y2="88" stroke="#FF9800" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
        <line x1="124" y1="52" x2="134" y2="62" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <line x1="186" y1="114" x2="196" y2="124" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <line x1="124" y1="124" x2="134" y2="114" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <line x1="186" y1="62" x2="196" y2="52" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <!-- Lotus base -->
        <path d="M140 155 C140 145 150 138 160 138 C170 138 180 145 180 155 Z" fill="#D4AF37" opacity="0.7"/>
        <path d="M120 158 C125 148 140 143 160 143 C180 143 195 148 200 158 Z" fill="#E65100" opacity="0.5"/>
        <rect x="80" y="168" width="160" height="22" rx="11" fill="#FFFFFF" opacity="0.9"/>
        <text x="160" y="183" text-anchor="middle" font-family="'Plus Jakarta Sans',sans-serif" font-size="9" font-weight="700" fill="#2E1A47" letter-spacing="1">KARMA YOGA &amp; FOCUS RESET</text>
      </svg>`,
      finance: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="100%" height="100%">
        <defs>
          <linearGradient id="finBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#E5EBFA"/><stop offset="100%" stop-color="#FBE5F5"/></linearGradient>
          <radialGradient id="lotusGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#D4AF37" stop-opacity="0.4"/><stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/></radialGradient>
        </defs>
        <rect width="320" height="200" rx="16" fill="url(#finBg)"/>
        <circle cx="160" cy="95" r="70" fill="url(#lotusGlow)"/>
        <!-- Lakshmi Lotus -->
        <ellipse cx="160" cy="118" rx="45" ry="18" fill="#D4AF37" opacity="0.4"/>
        <path d="M160 55 C155 75 142 85 160 110 C178 85 165 75 160 55Z" fill="#D4AF37" opacity="0.9"/>
        <path d="M160 110 C145 100 128 88 125 73 C135 77 148 90 160 110Z" fill="#B3861B" opacity="0.85"/>
        <path d="M160 110 C175 100 192 88 195 73 C185 77 172 90 160 110Z" fill="#B3861B" opacity="0.85"/>
        <path d="M160 110 C135 110 118 97 115 85 C125 90 143 100 160 110Z" fill="#FF9800" opacity="0.8"/>
        <path d="M160 110 C185 110 202 97 205 85 C195 90 177 100 160 110Z" fill="#FF9800" opacity="0.8"/>
        <circle cx="160" cy="110" r="10" fill="#D4AF37"/>
        <!-- Coins -->
        <circle cx="105" cy="145" r="12" fill="#D4AF37" opacity="0.9"/>
        <text x="105" y="150" text-anchor="middle" font-family="serif" font-size="13" fill="#180D26" font-weight="700">₹</text>
        <circle cx="215" cy="145" r="12" fill="#D4AF37" opacity="0.9"/>
        <text x="215" y="150" text-anchor="middle" font-family="serif" font-size="13" fill="#180D26" font-weight="700">₹</text>
        <circle cx="160" cy="148" r="10" fill="#B3861B" opacity="0.85"/>
        <text x="160" y="153" text-anchor="middle" font-family="serif" font-size="11" fill="#FFFFFF" font-weight="700">₹</text>
        <rect x="80" y="168" width="160" height="22" rx="11" fill="#FFFFFF" opacity="0.9"/>
        <text x="160" y="183" text-anchor="middle" font-family="'Plus Jakarta Sans',sans-serif" font-size="9" font-weight="700" fill="#2E1A47" letter-spacing="1">LAKSHMI ABUNDANCE RITUAL</text>
      </svg>`,
      overthinking: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="100%" height="100%">
        <defs>
          <linearGradient id="overBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#2E1A47" stop-opacity="0.08"/><stop offset="100%" stop-color="#E5EBFA"/></linearGradient>
          <radialGradient id="moonAura" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="#D4AF37" stop-opacity="0.35"/><stop offset="100%" stop-color="#4A306D" stop-opacity="0"/></radialGradient>
        </defs>
        <rect width="320" height="200" rx="16" fill="#F5F0FF"/>
        <circle cx="160" cy="88" r="65" fill="url(#moonAura)"/>
        <!-- Meditating silhouette -->
        <ellipse cx="160" cy="140" rx="38" ry="12" fill="#2E1A47" opacity="0.15"/>
        <path d="M130 138 C130 110 140 92 160 85 C180 92 190 110 190 138 Z" fill="#2E1A47" opacity="0.85"/>
        <!-- Third Eye Ajna -->
        <ellipse cx="160" cy="82" rx="22" ry="12" fill="#D4AF37" opacity="0.9"/>
        <circle cx="160" cy="82" r="8" fill="#FFFFFF"/>
        <circle cx="160" cy="82" r="5" fill="#4A306D"/>
        <circle cx="162" cy="80" r="1.5" fill="#FFFFFF"/>
        <!-- Crown chakra rays -->
        <line x1="160" y1="38" x2="160" y2="52" stroke="#D4AF37" stroke-width="2" stroke-linecap="round"/>
        <line x1="148" y1="41" x2="151" y2="55" stroke="#D4AF37" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="172" y1="41" x2="169" y2="55" stroke="#D4AF37" stroke-width="1.5" stroke-linecap="round"/>
        <!-- Stars -->
        <circle cx="95" cy="65" r="2.5" fill="#D4AF37" opacity="0.9"/>
        <circle cx="225" cy="65" r="2.5" fill="#D4AF37" opacity="0.9"/>
        <circle cx="80" cy="90" r="2" fill="#D4AF37" opacity="0.7"/>
        <circle cx="240" cy="90" r="2" fill="#D4AF37" opacity="0.7"/>
        <circle cx="108" cy="48" r="1.5" fill="#FFFFFF"/>
        <circle cx="212" cy="48" r="1.5" fill="#FFFFFF"/>
        <rect x="80" y="168" width="160" height="22" rx="11" fill="#FFFFFF" opacity="0.9"/>
        <text x="160" y="183" text-anchor="middle" font-family="'Plus Jakarta Sans',sans-serif" font-size="9" font-weight="700" fill="#2E1A47" letter-spacing="1">AJNA CHAKRA STILLNESS</text>
      </svg>`,
      family: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="100%" height="100%">
        <defs>
          <linearGradient id="famBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FBE5F5"/><stop offset="100%" stop-color="#FFF8E1"/></linearGradient>
          <radialGradient id="famGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#D4AF37" stop-opacity="0.3"/><stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/></radialGradient>
        </defs>
        <rect width="320" height="200" rx="16" fill="url(#famBg)"/>
        <circle cx="160" cy="90" r="65" fill="url(#famGlow)"/>
        <!-- Home / temple roof -->
        <polygon points="160,42 210,80 110,80" fill="#D4AF37" opacity="0.9"/>
        <polygon points="160,50 205,82 115,82" fill="#B3861B" opacity="0.5"/>
        <!-- House body -->
        <rect x="118" y="78" width="84" height="68" rx="4" fill="#FFFFFF" opacity="0.9"/>
        <!-- Doorway -->
        <rect x="148" y="108" width="24" height="38" rx="12" fill="#2E1A47" opacity="0.8"/>
        <!-- Diya flame -->
        <circle cx="160" cy="104" r="6" fill="#FF9800" opacity="0.9"/>
        <path d="M160 95 C157 100 160 104 163 100 Z" fill="#D4AF37"/>
        <!-- People silhouettes -->
        <circle cx="130" cy="95" r="8" fill="#2E1A47" opacity="0.7"/>
        <circle cx="190" cy="95" r="8" fill="#4A306D" opacity="0.7"/>
        <!-- Gold dots -->
        <circle cx="88" cy="68" r="3" fill="#D4AF37" opacity="0.8"/>
        <circle cx="232" cy="68" r="3" fill="#D4AF37" opacity="0.8"/>
        <circle cx="75" cy="110" r="2" fill="#D4AF37" opacity="0.6"/>
        <circle cx="245" cy="110" r="2" fill="#D4AF37" opacity="0.6"/>
        <rect x="80" y="168" width="160" height="22" rx="11" fill="#FFFFFF" opacity="0.9"/>
        <text x="160" y="183" text-anchor="middle" font-family="'Plus Jakarta Sans',sans-serif" font-size="9" font-weight="700" fill="#2E1A47" letter-spacing="1">GRIHA SHANTI RITUAL</text>
      </svg>`,
      existential: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="100%" height="100%">
        <defs>
          <linearGradient id="exBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#180D26"/><stop offset="60%" stop-color="#2E1A47"/><stop offset="100%" stop-color="#4A306D"/></linearGradient>
          <radialGradient id="exGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#D4AF37" stop-opacity="0.5"/><stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/></radialGradient>
        </defs>
        <rect width="320" height="200" rx="16" fill="url(#exBg)"/>
        <circle cx="160" cy="88" r="60" fill="url(#exGlow)"/>
        <!-- Om symbol -->
        <text x="160" y="108" text-anchor="middle" font-family="serif" font-size="68" fill="#D4AF37" opacity="0.9" font-weight="400">ॐ</text>
        <!-- Stars/cosmos -->
        <circle cx="70" cy="45" r="2.5" fill="#FFFFFF" opacity="0.9"/>
        <circle cx="250" cy="45" r="2.5" fill="#FFFFFF" opacity="0.9"/>
        <circle cx="55" cy="90" r="2" fill="#D4AF37" opacity="0.8"/>
        <circle cx="265" cy="90" r="2" fill="#D4AF37" opacity="0.8"/>
        <circle cx="90" cy="150" r="1.5" fill="#FFFFFF" opacity="0.6"/>
        <circle cx="230" cy="150" r="1.5" fill="#FFFFFF" opacity="0.6"/>
        <circle cx="105" cy="40" r="1.5" fill="#FFFFFF" opacity="0.5"/>
        <circle cx="215" cy="40" r="1.5" fill="#FFFFFF" opacity="0.5"/>
        <!-- Sacred border lines -->
        <line x1="80" y1="162" x2="240" y2="162" stroke="#D4AF37" stroke-width="1" opacity="0.5"/>
        <rect x="80" y="168" width="160" height="22" rx="11" fill="rgba(212,175,55,0.2)" stroke="#D4AF37" stroke-width="1"/>
        <text x="160" y="183" text-anchor="middle" font-family="'Plus Jakarta Sans',sans-serif" font-size="9" font-weight="700" fill="#D4AF37" letter-spacing="1">ADVAITA VEDANTA LIBERATION</text>
      </svg>`
    };
    return svgs[id] || svgs['relationship'];
  }

  getProblemSafeSvg(id: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.getProblemIllustration(id));
  }

  getShortCategory(id: string): string {
    const map: Record<string, string> = {
      relationship: 'Heart & Love',
      work: 'Career & Job',
      finance: 'Wealth & Fear',
      overthinking: 'Mind & Panic',
      family: 'Family Peace',
      existential: 'Soul & Purpose'
    };
    return map[id] || 'Healing';
  }
  // Web Audio Context for 432 Hz Healing Chime
  private audioCtx: AudioContext | null = null;
  chimesActive = signal<boolean>(false);
  selectedFrequency = signal<number>(432);
  private chimeInterval: any = null;

  // Virtual Diya Lighting
  diyaLit = signal<boolean>(true);
  diyaDedication = signal<string>('World Peace, Relationship Healing & Mental Harmony');
  diyaPetalsActive = signal<boolean>(false);
  diyaCount = signal<number>(12482);
  blessingMessage = signal<string>('May divine light dissolve every doubt and bless your mind with sacred peace.');

  // Solfeggio Frequencies list
  readonly solfeggioFrequencies = [
    { freq: 432, name: '432 Hz', title: 'Deep Peace & Anxiety Relief', chakra: 'Universal Pitch', icon: 'fa-solid fa-water' },
    { freq: 528, name: '528 Hz', title: 'Transformation & Healing', chakra: 'Solar Plexus / DNA', icon: 'fa-solid fa-sun' },
    { freq: 639, name: '639 Hz', title: 'Heart & Relationships', chakra: 'Anahata Chakra', icon: 'fa-solid fa-heart' },
    { freq: 396, name: '396 Hz', title: 'Release Guilt & Fear', chakra: 'Muladhara Root', icon: 'fa-solid fa-shield-halved' },
    { freq: 741, name: '741 Hz', title: 'Intuition & Clarity', chakra: 'Vishuddha & Ajna', icon: 'fa-solid fa-lightbulb' },
    { freq: 852, name: '852 Hz', title: 'Spiritual Awakening', chakra: 'Sahasrara Crown', icon: 'fa-solid fa-eye' }
  ];

  // 7 Chakras Interactive Data
  readonly chakrasList = [
    { name: 'Root (Muladhara)', color: '#C0392B', element: 'Earth', stress: 'Financial panic, fear of survival, insecurity', remedy: 'Grounding therapy, red jasper, Muladhara chanting' },
    { name: 'Sacral (Swadhisthana)', color: '#E65100', element: 'Water', stress: 'Emotional numbness, guilt, intimacy blockage', remedy: 'Creative expression, emotional catharsis, fluid movement' },
    { name: 'Solar Plexus (Manipura)', color: '#FF9800', element: 'Fire', stress: 'Work burnout, low self-worth, control issues', remedy: 'Karma Yoga, assertive boundaries, core somatic breathing' },
    { name: 'Heart (Anahata)', color: '#27AE60', element: 'Air', stress: 'Heartbreak, grief, inability to forgive, loneliness', remedy: 'EFT couples therapy, Rose Quartz meditation, Kshama prayer' },
    { name: 'Throat (Vishuddha)', color: '#2980B9', element: 'Ether', stress: 'Swallowed anger, inability to express truth', remedy: 'Journaling, vocal humming, communication therapy' },
    { name: 'Third Eye (Ajna)', color: '#4A306D', element: 'Light', stress: 'Chronic overthinking, 3 AM anxiety, mental confusion', remedy: '5-4-3-2-1 reset, sandalwood tilak, meditation on stillness' },
    { name: 'Crown (Sahasrara)', color: '#8E44AD', element: 'Cosmos', stress: 'Existential crisis, emptiness, loss of life purpose', remedy: 'Vedic darshan, Logotherapy, silent retreat, atma reflection' }
  ];
  selectedChakraIndex = signal<number>(3); // Default Heart Chakra

  // Peace Meter Calculator State
  sleepScore = signal<number>(3);
  overthinkingScore = signal<number>(4);
  relationshipScore = signal<number>(3);
  purposeScore = signal<number>(4);

  // Computed Peace Index Score (0 to 100)
  peaceScore = computed(() => {
    const raw = (this.sleepScore() + this.overthinkingScore() + this.relationshipScore() + this.purposeScore()) / 20;
    return Math.round(raw * 100);
  });

  // Breathing Exercise State
  breathingActive = signal<boolean>(false);
  breathPhase = signal<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  breathCounter = signal<number>(4);
  breathCycle = signal<number>(1);
  private breathTimer: any = null;

  // Active stress solver tab / filter
  selectedProblemId = signal<string>('relationship');

  // Interactive Navigator State
  userStressType = signal<string>('work');
  userIntensity = signal<string>('high');
  navigatorResultVisible = signal<boolean>(true);

  // Daily Mantra Generator
  dailyMantraIndex = signal<number>(0);
  copiedAlert = signal<boolean>(false);

  // Mobile Responsive Drawer State
  mobileMenuOpen = signal<boolean>(false);

  // Portal links - Configurable server routes or in-page anchors
  psychiatristUrl = '#card-psychiatrist';
  templeUrl = '#card-temple';

  // Preview Modal
  activePreviewModal = signal<'psychiatrist' | 'temple' | null>(null);

  // Stress Problems Data
  readonly stressProblems: StressProblem[] = [
    {
      id: 'relationship',
      category: 'Heart & Relationships',
      icon: 'fa-solid fa-heart-crack',
      illustration: 'assets/images/relationship-harmony.svg',
      title: 'Relationship Grief, Heartbreak & Marital Disputes',
      subtitle: 'Healing broken trust, emotional detachment, fear of abandonment, and recurring conflicts.',
      symptoms: [
        'Persistent ache in the chest, overwhelming sadness after conflict or breakup',
        'Fear of emotional vulnerability, jealousy, or chronic communication breakdown',
        'Over-analyzing texts, past conversations, and constant fear of losing partner'
      ],
      clinicalRemedy: {
        title: 'Psychiatric & EFT Therapy',
        points: [
          'Emotionally Focused Therapy (EFT) to decode underlying attachment wounds',
          'Cognitive defusion techniques to stop obsessive replaying of emotional pain',
          'Non-violent communication frameworks and healthy boundaries counseling'
        ]
      },
      spiritualRemedy: {
        title: 'Anahata (Heart Chakra) Healing',
        points: [
          '4th Chakra Rose Quartz energy cleansing to dissolve emotional blockages',
          'Kshama (Divine Forgiveness) prayer to release karmic cords of resentment',
          'Radha-Krishna divine love contemplation for inner unconditional wholeness'
        ]
      },
      recommendedPortal: 'both',
      mantra: 'ॐ मणये नमः (Om Hrim Namah - Anahata Heart Resonance)',
      mantraMeaning: 'I surrender my wounded heart to divine grace; love flows freely and heals my soul.',
      affirmation: 'My heart is strong, whole, and worthy of peaceful, tender, unconditional love.',
      bgGradient: 'linear-gradient(135deg, rgba(192, 57, 43, 0.08) 0%, rgba(212, 175, 55, 0.12) 100%)'
    },
    {
      id: 'work',
      category: 'Career & Burnout',
      icon: 'fa-solid fa-briefcase',
      illustration: 'assets/images/career-clarity.svg',
      title: 'Job Burnout, Workplace Pressure & Career Paralysis',
      subtitle: 'Overcoming mental exhaustion, imposter syndrome, toxic workplace stress, and anxiety over deadlines.',
      symptoms: [
        'Waking up with dread on Monday mornings, chronic brain fog and fatigue',
        'Feeling like whatever you do is never enough, fear of being fired or evaluated',
        'Zero energy left for personal life after long working hours'
      ],
      clinicalRemedy: {
        title: 'Burnout & Neuro-Reset Protocol',
        points: [
          'Vagus nerve somatic down-regulation to switch off the chronic fight-or-flight state',
          'Work-life boundary structuring and cognitive restructuring of perfectionism',
          'Clinical attention recovery protocols to rebuild neurotransmitter balance'
        ]
      },
      spiritualRemedy: {
        title: 'Karma Yoga & Solar Plexus Empowerment',
        points: [
          'Manipura Chakra (3rd Chakra) meditation to restore inner courage and stamina',
          'Bhagavad Gita Nishkama Karma: Dedicating actions without anxiety over fruits',
          'Sacred temple incense and Gayatri chanting at sunrise to clear mental fatigue'
        ]
      },
      recommendedPortal: 'psychiatrist',
      mantra: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन (Bhagavad Gita 2.47)',
      mantraMeaning: 'You have a right to your sacred duty, but never to the anxious obsession with its fruits.',
      affirmation: 'I am not defined by my productivity. I work with calm dedication and rest with deep reverence.',
      bgGradient: 'linear-gradient(135deg, rgba(230, 81, 0, 0.08) 0%, rgba(212, 175, 55, 0.12) 100%)'
    },
    {
      id: 'finance',
      category: 'Financial Fear & Scarcity',
      icon: 'fa-solid fa-coins',
      illustration: 'assets/images/financial-abundance.svg',
      title: 'Financial Anxiety, Business Crisis & Scarcity Panic',
      subtitle: 'Liberating your mind from suffocating economic dread, debts, loss of stability, and fear of tomorrow.',
      symptoms: [
        'Panic attacks triggered by checking bank balances, bills, or market downturns',
        'Obsessive scarcity thoughts: "What if I end up broke and homeless?"',
        'Physical tension in shoulders and jaw caused by continuous survival mode'
      ],
      clinicalRemedy: {
        title: 'Rational Crisis Desensitization',
        points: [
          'Catastrophic thinking interruption using evidence-based CBT reality-testing',
          'Somatic grounding to discharge physiological adrenaline before financial planning',
          'Action-oriented priority mapping to restore locus of control'
        ]
      },
      spiritualRemedy: {
        title: 'Muladhara Grounding & Lakshmi Abundance',
        points: [
          'Root Chakra (Muladhara) earth connection to anchor deep survival security',
          'Mahalakshmi Ashtakam chanting to shift vibration from fear to sacred abundance',
          'Kanakadhara stotram frequencies to attract clarity, opportunity, and calm wisdom'
        ]
      },
      recommendedPortal: 'temple',
      mantra: 'ॐ श्रीं ह्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मांक दारिद्र्य नाशय प्रचुर धन देहि क्लीं ह्रीं श्रीं ॐ',
      mantraMeaning: 'May the universal light dissolve the illusion of scarcity and bless my home with peaceful abundance.',
      affirmation: 'The universe provides for me in seen and unseen ways. I make calm, wise decisions with confidence.',
      bgGradient: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 152, 0, 0.08) 100%)'
    },
    {
      id: 'overthinking',
      category: 'Mind & Panic',
      icon: 'fa-solid fa-brain',
      illustration: 'assets/images/mind-overthinking-peace.svg',
      title: 'Chronic Overthinking, 3 AM Anxiety & Panic Attacks',
      subtitle: 'Stopping the mental rollercoaster of worst-case scenarios, rapid heart rate, and sleepless nights.',
      symptoms: [
        'Lying awake with a racing mind, heart pounding without any physical danger',
        'Endless "What If?" loops and intrusive catastrophic thoughts that won\'t stop',
        'Feeling disconnected from your physical body (derealization or vertigo)'
      ],
      clinicalRemedy: {
        title: 'Clinical Anxiety & Somatic Grounding',
        points: [
          '5-4-3-2-1 Sensory Activation & physiological sigh breath resets',
          'Psychiatric evaluation for neurochemical support when anxiety is debilitating',
          'Exposure and Response Prevention (ERP) to conquer phantom health phobias'
        ]
      },
      spiritualRemedy: {
        title: '432 Hz Solfeggio & Om Chanting',
        points: [
          'Ajna (Third Eye) & Sahasrara (Crown Chakra) calming with sacred sandalwood chandan',
          '108 repetitions of Maha Mrityunjaya Mantra for profound mental liberation',
          'Vedic temple bell resonation to instantly shatter obsessive thought patterns'
        ]
      },
      recommendedPortal: 'both',
      mantra: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् | उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ||',
      mantraMeaning: 'We meditate on the three-eyed Lord who nourishes all beings. May He liberate us from anxiety and fear.',
      affirmation: 'My thoughts are like passing clouds. I am the boundless, peaceful sky behind them.',
      bgGradient: 'linear-gradient(135deg, rgba(74, 48, 109, 0.1) 0%, rgba(229, 235, 250, 0.12) 100%)'
    },
    {
      id: 'family',
      category: 'Family & Parental',
      icon: 'fa-solid fa-people-roof',
      illustration: 'assets/images/family-harmony.svg',
      title: 'Family Conflicts, Generational Trauma & Elder Guilt',
      subtitle: 'Navigating deep familial expectations, guilt trips, parental pressure, and household friction.',
      symptoms: [
        'Feeling suffocated by familial criticism, comparison with relatives, or emotional guilt',
        'Dreading family gatherings, walking on eggshells around parents or in-laws',
        'Carrying the unpaid emotional burden of taking care of everyone except yourself'
      ],
      clinicalRemedy: {
        title: 'Systemic Family Therapy',
        points: [
          'Differentiation of self: Learning to love your family without absorbing their anxiety',
          'Assertive communication strategies to decline unreasonable demands with grace',
          'Unpacking generational trauma patterns so you stop repeating them with children'
        ]
      },
      spiritualRemedy: {
        title: 'Pitra Shanti & Griha Shanti Rituals',
        points: [
          'Griha Shanti Havan to clear negative energetic residues in the living space',
          'Pitra Tarpan prayer to heal ancestral lineages and invoke elders\' true blessings',
          'Lighting a ghee diya with camphor in the northeastern sanctuary corner'
        ]
      },
      recommendedPortal: 'temple',
      mantra: 'ॐ सह नाववतु | सह नौ भुनक्तु | सह वीर्यं करवावहै | तेजस्वि नावधीतमस्तु मा विद्विषावहै ||',
      mantraMeaning: 'May we be protected together; may we be nourished together; may there be no disharmony between us.',
      affirmation: 'I release the urge to please everyone. I honor my family with love and honor my boundaries with dignity.',
      bgGradient: 'linear-gradient(135deg, rgba(179, 134, 27, 0.08) 0%, rgba(240, 234, 248, 0.12) 100%)'
    },
    {
      id: 'existential',
      category: 'Soul & Purpose',
      icon: 'fa-solid fa-om',
      illustration: 'assets/images/existential-purpose.svg',
      title: 'Existential Emptiness, Mid-Life Crisis & Grief of Loss',
      subtitle: 'Re-discovering why you are here when life feels meaningless, dry, mechanical, or grief-shattered.',
      symptoms: [
        'Feeling completely hollow inside even when everything looks fine from the outside',
        'Numbness after losing a parent, partner, or lifelong dream',
        'Asking "What is the point of all this running around?" every single day'
      ],
      clinicalRemedy: {
        title: 'Viktor Frankl Logotherapy',
        points: [
          'Existential psychotherapeutic meaning-mapping and value realignment',
          'Complicated grief processing through structured memory integration',
          'Rebuilding emotional resilience and neuroplastic openness to new purpose'
        ]
      },
      spiritualRemedy: {
        title: 'Advaita Vedanta & Atma Darshan',
        points: [
          'Understanding your eternal soul nature beyond physical temporary roles',
          'Deep contemplation on Moksha (spiritual liberation) and soul karma',
          'Sacred temple darshan, holy Ganga jal purification, and silence retreat'
        ]
      },
      recommendedPortal: 'both',
      mantra: 'असतो मा सद्गमय | तमसो मा ज्योतिर्गमय | मृत्योर्मा अमृतं गमय ||',
      mantraMeaning: 'Lead me from falsehood to truth; lead me from darkness to divine light; lead me from mortality to immortality.',
      affirmation: 'My soul has a sacred purpose. Even through darkness, a profound transformation is blossoming within me.',
      bgGradient: 'linear-gradient(135deg, rgba(46, 26, 71, 0.1) 0%, rgba(251, 229, 245, 0.15) 100%)'
    }
  ];

  // Daily Mantras & Wisdom Collection
  readonly mantras = [
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
      sanskrit: 'माता शत्रुः पिता वैरी येन बालो न पाठितः',
      english: 'Vidya Dadati Vinayam',
      source: 'Hitopadesha',
      meaning: 'True wisdom imparts humility, humility brings worthiness, and worthiness delivers everlasting peace.',
      psychology: 'Cultivating emotional modesty breaks defensive anxiety and invites healing connection.'
    },
    {
      sanskrit: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः',
      english: 'Sarve Bhavantu Sukhinah',
      source: 'Brihadaranyaka Upanishad',
      meaning: 'May all beings be joyful and prosperous; may all beings be free from illness and distress.',
      psychology: 'Practicing universal metta (loving-kindness) releases oxytocin and counters social anxiety.'
    }
  ];

  // Testimonials
  readonly testimonials: Testimonial[] = [
    {
      name: 'Dr. Rajesh Sharma',
      location: 'New Delhi',
      problem: 'Severe Clinical Burnout & Panic at Work',
      solution: 'Sakoonsay CBT Therapy + 432 Hz Solfeggio',
      quote: 'I was on the verge of quitting my medical career due to crippling panic. Combining Sakoonsay clinical psychiatric therapy with evening temple sound healing gave me back my sanity.',
      avatarText: 'RS',
      rating: 5
    },
    {
      name: 'Ananya Deshmukh',
      location: 'Mumbai',
      problem: 'Devastating Breakup & Insomnia',
      solution: 'Sakoon-Temple Anahata Puja + Psychiatrist Counseling',
      quote: 'I couldn’t sleep for 4 months. The dual approach of Main Sakoonsay—talking to a clinical therapist while also lighting virtual temple diyas and healing my heart chakra—restored my smile.',
      avatarText: 'AD',
      rating: 5
    },
    {
      name: 'Vikram & Priya Singhal',
      location: 'Bengaluru',
      problem: 'Marital Disputes & Financial Panic',
      solution: 'Couples Psychiatric Guidance + Griha Shanti Havan',
      quote: 'We were heading for divorce under heavy debt. This unified platform guided our emotions rationally through therapy, while the sacred rituals brought positive energy back into our home.',
      avatarText: 'VP',
      rating: 5
    }
  ];

  // Current selected problem computed
  currentProblem = computed(() => {
    return this.stressProblems.find(p => p.id === this.selectedProblemId()) || this.stressProblems[0];
  });

  // Current daily mantra computed
  currentMantra = computed(() => {
    return this.mantras[this.dailyMantraIndex()];
  });

  ngOnInit() {
    // Keep ambient state ready
  }

  ngOnDestroy() {
    this.stopChimes();
    this.stopBreathing();
  }

  // Select problem tab
  selectProblem(id: string) {
    this.selectedProblemId.set(id);
    this.playTone(528, 0.15, 'sine');
  }

  // Web Audio 432 Hz Solfeggio & Temple Chimes
  toggleAmbientChimes() {
    if (this.chimesActive()) {
      this.stopChimes();
    } else {
      this.startChimes();
    }
  }

  private startChimes() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.chimesActive.set(true);
      // Play initial welcoming Tibetan bell
      this.playSacredBell();

      // Recurring gentle chime every 8 seconds
      this.chimeInterval = setInterval(() => {
        if (this.chimesActive()) {
          this.playSacredBell();
        }
      }, 8000);
    } catch (e) {
      console.warn('AudioContext not allowed without user gesture', e);
    }
  }

  private stopChimes() {
    this.chimesActive.set(false);
    if (this.chimeInterval) {
      clearInterval(this.chimeInterval);
      this.chimeInterval = null;
    }
  }

  // Play Tibetan Temple Singing Bowl / Bell with overtones
  playSacredBell() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const now = this.audioCtx.currentTime;
    const baseFreq = 432; // Sacred Healing Solfeggio frequency

    // Harmonically rich partials
    const partials = [
      { freq: baseFreq, gain: 0.35, decay: 4.5 },
      { freq: baseFreq * 1.5, gain: 0.18, decay: 3.8 }, // Fifth (648 Hz)
      { freq: baseFreq * 2.0, gain: 0.12, decay: 3.0 }, // Octave (864 Hz)
      { freq: baseFreq * 2.76, gain: 0.08, decay: 2.5 } // Sacred bell overtone
    ];

    partials.forEach(p => {
      const osc = this.audioCtx!.createOscillator();
      const gainNode = this.audioCtx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.freq, now);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(p.gain, now + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx!.destination);

      osc.start(now);
      osc.stop(now + p.decay + 0.1);
    });
  }

  // Soft tone generator
  private playTone(freq: number, duration: number, type: OscillatorType = 'sine') {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Ignored if audio blocked
    }
  }

  // 4-7-8 Breathing Calmer Logic
  toggleBreathing() {
    if (this.breathingActive()) {
      this.stopBreathing();
    } else {
      this.startBreathing();
    }
  }

  private startBreathing() {
    this.breathingActive.set(true);
    this.breathCycle.set(1);
    this.runBreathStep('Inhale', 4);
    this.playTone(432, 0.4);
  }

  private runBreathStep(phase: 'Inhale' | 'Hold' | 'Exhale', seconds: number) {
    if (!this.breathingActive()) return;

    this.breathPhase.set(phase);
    this.breathCounter.set(seconds);

    if (this.breathTimer) {
      clearInterval(this.breathTimer);
    }

    this.breathTimer = setInterval(() => {
      const current = this.breathCounter();
      if (current > 1) {
        this.breathCounter.set(current - 1);
      } else {
        clearInterval(this.breathTimer);
        // Transition to next phase
        if (phase === 'Inhale') {
          this.playTone(528, 0.3);
          this.runBreathStep('Hold', 7);
        } else if (phase === 'Hold') {
          this.playTone(396, 0.3);
          this.runBreathStep('Exhale', 8);
        } else {
          // Completed one cycle
          this.breathCycle.set(this.breathCycle() + 1);
          this.playSacredBell();
          this.runBreathStep('Inhale', 4);
        }
      }
    }, 1000);
  }

  private stopBreathing() {
    this.breathingActive.set(false);
    if (this.breathTimer) {
      clearInterval(this.breathTimer);
      this.breathTimer = null;
    }
  }

  // Mantra Generator
  nextMantra() {
    const next = (this.dailyMantraIndex() + 1) % this.mantras.length;
    this.dailyMantraIndex.set(next);
    this.playSacredBell();
  }

  copyMantra() {
    const text = `"${this.currentMantra().sanskrit}" - ${this.currentMantra().meaning} (From Sakoonsay)`;
    navigator.clipboard.writeText(text).then(() => {
      this.copiedAlert.set(true);
      setTimeout(() => this.copiedAlert.set(false), 2500);
    });
  }

  // Open Preview Modal
  openPreview(portal: 'psychiatrist' | 'temple') {
    this.activePreviewModal.set(portal);
  }

  closePreview() {
    this.activePreviewModal.set(null);
  }

  // Toggle & Light Virtual Diya
  lightDiya() {
    this.diyaLit.set(true);
    this.diyaCount.set(this.diyaCount() + 1);
    this.diyaPetalsActive.set(true);
    this.playSacredBell();
    setTimeout(() => {
      this.diyaPetalsActive.set(false);
    }, 4000);
  }

  toggleDiya() {
    if (this.diyaLit()) {
      this.diyaLit.set(false);
      this.playTone(396, 0.2);
    } else {
      this.lightDiya();
    }
  }

  // Frequency Selection
  selectFrequency(freq: number) {
    this.selectedFrequency.set(freq);
    this.playTone(freq, 0.8, 'sine');
  }

  // Select Chakra
  selectChakra(index: number) {
    this.selectedChakraIndex.set(index);
    const frequencies = [396, 417, 528, 639, 741, 852, 963];
    this.playTone(frequencies[index] || 528, 0.4);
  }

  // Mobile Menu Controls
  toggleMobileMenu() {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
    if (this.mobileMenuOpen()) {
      this.playTone(528, 0.15);
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  navAndClose(elementId: string) {
    this.closeMobileMenu();
    this.scrollTo(elementId);
  }

  // Smooth scroll
  scrollTo(elementId: string) {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

