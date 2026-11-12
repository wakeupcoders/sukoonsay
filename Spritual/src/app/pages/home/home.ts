import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TempleDataService } from '../../services/temple.service';
import { CountryTimezoneService } from '../../services/country-timezone.service';
import { TempleService, PanchangDay } from '../../models/temple.models';

interface HeroSlide {
  image: string;
  sanskritMotto: string;
  title: string;
  subtitle: string;
  highlightBadge: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly templeService = inject(TempleDataService);
  readonly countryTzService = inject(CountryTimezoneService);

  readonly liveStatus = this.templeService.liveStatus;
  readonly services = this.templeService.services;
  readonly selectedCountry = this.countryTzService.selectedCountry;

  // Hero Slides
  readonly slides: HeroSlide[] = [
    {
      image: 'assets/images/hero-temple.jpg',
      sanskritMotto: '॥ आत्मनः प्रशान्तौ सर्वस्य शान्तिः ॥',
      title: 'Welcome to Sakoon Temple',
      subtitle: 'A Sacred Haven of Divine Peace, Authentic Vedic Rituals & Spiritual Solace',
      highlightBadge: 'Spiritual Sanctuary',
      primaryCtaText: 'Book Puja / Darshan',
      primaryCtaLink: '/booking',
      secondaryCtaText: 'Explore Panchang',
      secondaryCtaLink: '/calendar'
    },
    {
      image: 'assets/images/havan.jpg',
      sanskritMotto: '॥ ॐ पावका नः सरस्वती वाजेभिर्वाजिनीवती ॥',
      title: 'Sacred Vedic Havan & Yagya',
      subtitle: 'Maha Mrityunjaya, Gayatri & Navagraha fire ceremonies by learned Vedic priests for purification and health.',
      highlightBadge: 'Divine Fire Rites',
      primaryCtaText: 'Explore Havan Vidhi',
      primaryCtaLink: '/services/vedic-havan-yagya',
      secondaryCtaText: 'Schedule Ceremony',
      secondaryCtaLink: '/booking'
    },
    {
      image: 'assets/images/kundali.jpg',
      sanskritMotto: '॥ ज्योतिषामपि तज्ज्योतिस्तमसः परमुच्यते ॥',
      title: 'Kundali & Jyotish Paramarsh',
      subtitle: 'Accurate Janampatri horoscope reading, planetary dosha remedies, and career-marriage guidance.',
      highlightBadge: 'Vedanga Jyotisha',
      primaryCtaText: 'Kundali Guidance',
      primaryCtaLink: '/services/kundali-jyotish',
      secondaryCtaText: 'Book Jyotish Slot',
      secondaryCtaLink: '/booking'
    },
    {
      image: 'assets/images/tarot.jpg',
      sanskritMotto: '॥ ब्रह्माण्डं चेतसा युक्ता ॥',
      title: 'Tarot Card Predictions',
      subtitle: 'Intuitive cosmic symbology and meditative spiritual readings for clarity, decisions, and inner balance.',
      highlightBadge: 'Intuitive Divination',
      primaryCtaText: 'Tarot Readings',
      primaryCtaLink: '/services/tarot-prediction',
      secondaryCtaText: 'Book 1-on-1 Session',
      secondaryCtaLink: '/booking'
    },
    {
      image: 'assets/images/sanctum.jpg',
      sanskritMotto: '॥ मन्दिरं शान्तिनिलयं पावनं मोक्षसाधनम् ॥',
      title: 'Inner Sanctum Darshan',
      subtitle: 'Immerse your soul in meditative stillness, fragrant temple dhoop, brass bells resonance, and sacred aartis.',
      highlightBadge: 'Tranquil Darshan',
      primaryCtaText: 'View Aarti Schedule',
      primaryCtaLink: '/timings',
      secondaryCtaText: 'About Temple',
      secondaryCtaLink: '/about'
    }
  ];

  readonly currentSlideIndex = signal(0);
  private slideInterval: any;

  // Today's Panchang Highlight
  readonly todayPanchang = signal<PanchangDay | null>(null);

  ngOnInit(): void {
    this.startSlideTimer();
    this.loadTodayPanchang();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  private startSlideTimer(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide(false);
    }, 5500);
  }

  private resetSlideTimer(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.startSlideTimer();
  }

  nextSlide(manual: boolean = true): void {
    this.currentSlideIndex.update(idx => (idx + 1) % this.slides.length);
    if (manual) {
      this.resetSlideTimer();
    }
  }

  prevSlide(): void {
    this.currentSlideIndex.update(idx => (idx - 1 + this.slides.length) % this.slides.length);
    this.resetSlideTimer();
  }

  setSlide(index: number): void {
    this.currentSlideIndex.set(index);
    this.resetSlideTimer();
  }

  private loadTodayPanchang(): void {
    const cDate = this.countryTzService.getCountryCurrentDate();
    const days = this.templeService.generatePanchangMonth(cDate.year, cDate.month);
    const matched = days.find(d => d.isToday);
    if (matched) {
      this.todayPanchang.set(matched);
    }
  }

  // Daily Sacred Wisdom & Neuro Insight Mantras Collection
  readonly mantras = [
    {
      sanskrit: 'ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥',
      english: 'Om Asato Ma Sadgamaya, Tamaso Ma Jyotirgamaya, Mrityor Ma Amritam Gamaya',
      source: 'Brihadaranyaka Upanishad (1.3.28)',
      meaning: 'Lead me from untruth to eternal truth; lead me from darkness to divine illumination; lead me from mortality to immortality.',
      psychology: 'Cognitive reframing: Directs attention away from cognitive distortion toward objective inner peace and eternal awareness.'
    },
    {
      sanskrit: 'ॐ शान्तिः शान्तिः शान्तिः',
      english: 'Om Shanti, Shanti, Shanti',
      source: 'Upanishadic Invocation',
      meaning: 'May there be peace in the celestial cosmos, peace in nature and environment, and profound peace in mind, body and soul.',
      psychology: 'Calms the sympathetic nervous system, inducing restorative alpha-theta brainwave coherence in under 60 seconds.'
    },
    {
      sanskrit: 'योगः चित्तवृत्ति निरोधः',
      english: 'Yogas Chitta Vritti Nirodha',
      source: 'Patanjali Yoga Sutras (1.2)',
      meaning: 'True spiritual yoga is the stilling and tranquil mastery of the fluctuating whirls and turbulence of the mind.',
      psychology: 'Metacognitive defusion: Disconnects the conscious self from intrusive racing thoughts and rumination.'
    },
    {
      sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
      english: 'Karmanye Vadhikaraste Ma Phaleshu Kadachana',
      source: 'Bhagavad Gita (2.47)',
      meaning: 'You have a sacred right to your dedicated action, but never to the anxious attachment over its fruits.',
      psychology: 'Radical acceptance & locus of control: Dissolves performance anxiety and career paralysis by anchoring in present effort.'
    },
    {
      sanskrit: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः । सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥',
      english: 'Sarve Bhavantu Sukhinah, Sarve Santu Niramayah',
      source: 'Brihadaranyaka Upanishad',
      meaning: 'May all living beings abide in happiness; may all beings be free from illness and distress; may all behold auspiciousness.',
      psychology: 'Universal loving-kindness (Metta): Triggers oxytocin release and downregulates amygdala-driven social anxiety.'
    }
  ];

  readonly currentMantraIndex = signal(0);
  readonly copiedAlert = signal(false);

  nextMantra(): void {
    this.currentMantraIndex.update(idx => (idx + 1) % this.mantras.length);
    this.playSacredBellTone();
  }

  copyMantra(): void {
    const m = this.mantras[this.currentMantraIndex()];
    const text = `"${m.sanskrit}" - ${m.meaning} (From Sakoon Temple)`;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.copiedAlert.set(true);
        setTimeout(() => this.copiedAlert.set(false), 2500);
      });
    }
  }

  private playSacredBellTone(): void {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    } catch {
      // Audio fallback
    }
  }
}
