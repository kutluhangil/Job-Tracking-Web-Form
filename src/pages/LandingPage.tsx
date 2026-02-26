import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { useLanguage } from '../lib/i18n';

// ── Word Cycler — reliable setInterval approach ───────────────
const CHARS = 'ABCDEFGHKLMNPRSTUVYZ0123456789#@!%&';
const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)];

// Word lists outside component — stable references, never recreated
const TR_WORDS = ['Yönet.', 'Geliştir.', 'Düzenle.', 'Başlat.', 'Planla.', 'Takip Et.', 'Güçlendir.', 'Keşfet.', 'Hedefle.', 'İlerle.'];
const EN_WORDS = ['Career.', 'Future.', 'Journey.', 'Growth.', 'Success.', 'Goals.', 'Path.', 'Story.', 'Strategy.', 'Ambition.'];

function useWordCycler(words: string[]) {
    const [display, setDisplay] = useState(words[0]);
    const [opacity, setOpacity] = useState(1);
    const wordsRef = useRef(words);
    wordsRef.current = words;

    useEffect(() => {
        const SCRAMBLE_MS = 1800;  // 1.8s scramble
        const PAUSE_MS = 900;   // 0.9s hold
        const FADE_MS = 250;   // fade-out before switch
        const TICK_MS = 50;    // 20fps — smooth

        let wordIndex = 0;
        let phase: 'scramble' | 'pause' = 'scramble';
        let phaseStart = Date.now();
        let fading = false;

        const tick = () => {
            const now = Date.now();
            const elapsed = now - phaseStart;
            const target = wordsRef.current[wordIndex];

            if (phase === 'scramble') {
                // Fade in during first FADE_MS
                const fadeInProgress = Math.min(elapsed / FADE_MS, 1);
                if (elapsed < FADE_MS) setOpacity(fadeInProgress);
                else if (fading) { setOpacity(1); fading = false; }

                const progress = Math.min(elapsed / SCRAMBLE_MS, 1);
                const resolved = Math.floor(progress * target.length);
                setDisplay(
                    target.split('').map((ch, i) => {
                        if (ch === ' ') return '\u00a0'; // non-breaking space
                        if (i < resolved) return ch;
                        return rand();
                    }).join('')
                );
                if (elapsed >= SCRAMBLE_MS) {
                    setDisplay(target);
                    setOpacity(1);
                    phase = 'pause';
                    phaseStart = now;
                }
            } else {
                // Near end of pause: fade out
                if (elapsed >= PAUSE_MS - FADE_MS && !fading) {
                    fading = true;
                }
                if (fading) {
                    const fadeProgress = Math.min((elapsed - (PAUSE_MS - FADE_MS)) / FADE_MS, 1);
                    setOpacity(1 - fadeProgress);
                }
                if (elapsed >= PAUSE_MS) {
                    wordIndex = (wordIndex + 1) % wordsRef.current.length;
                    phase = 'scramble';
                    phaseStart = now;
                }
            }
        };

        const id = setInterval(tick, TICK_MS);
        return () => clearInterval(id);
    }, []);

    return { display, opacity };
}

// ── Intersection-based reveal ───────────────────────────────────────
const useInView = (threshold = 0.15) => {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
};

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
    const { ref, inView } = useInView();
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}>
            {children}
        </motion.div>
    );
};

// ── FeatureShowcase: interactive stacked window cards ─────────────
interface ShowcaseProps {
    bone2: string; border: string; ink: string; inkFaint: string; accent: string; lang: string;
}

const SCREENS = [
    {
        url: 'nextstep.app/dashboard',
        label: { tr: 'Dashboard', en: 'Dashboard' },
        desc: { tr: 'Anlık özet, istatistikler ve son başvurular', en: 'Live stats, summary, and recent applications' },
        offset: { x: 0, y: 0, rotate: 0 },
        content: (border: string, inkFaint: string) => (
            <div className="p-4" style={{ background: '#faf9f6' }}>
                <div className="rounded-xl p-3 mb-3" style={{ background: 'linear-gradient(135deg, #f97316, #a855f7)' }}>
                    <div className="text-[9px] text-white/60 mb-0.5">27 Şubat Cuma</div>
                    <div className="text-sm font-bold text-white">Merhaba, Kutluhan 👋</div>
                </div>
                <div className="grid grid-cols-4 gap-1.5 mb-3">
                    {[{ n: '24', l: 'Toplam', c: '#f97316' }, { n: '7', l: 'Bu Ay', c: '#a855f7' }, { n: '5', l: 'Süreçte', c: '#ec4899' }, { n: '2', l: 'Olumlu', c: '#22c55e' }].map(s => (
                        <div key={s.l} className="rounded-xl p-2" style={{ background: '#fff', border: `1px solid ${border}` }}>
                            <div className="text-sm font-black" style={{ color: s.c }}>{s.n}</div>
                            <div className="text-[8px]" style={{ color: inkFaint }}>{s.l}</div>
                        </div>
                    ))}
                </div>
                {[{ c: 'Apple', s: 'Görüşme', col: '#a855f7' }, { c: 'Spotify', s: 'Süreçte', col: '#f97316' }, { c: 'Notion', s: 'Teklif', col: '#22c55e' }].map(r => (
                    <div key={r.c} className="flex items-center justify-between py-1" style={{ borderBottom: `1px solid ${border}` }}>
                        <span className="text-[9px] font-medium" style={{ color: '#1a1a1a' }}>{r.c}</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: r.col + '18', color: r.col }}>{r.s}</span>
                    </div>
                ))}
            </div>
        ),
    },
    {
        url: 'nextstep.app/applications',
        label: { tr: 'Başvurular', en: 'Applications' },
        desc: { tr: 'Tüm başvuruları listele, filtrele ve dışa aktar', en: 'List, filter and export all applications' },
        offset: { x: 32, y: 16, rotate: 2.5 },
        content: (border: string, inkFaint: string) => (
            <div className="p-3" style={{ background: '#faf9f6' }}>
                <div className="flex gap-2 mb-2">
                    <div className="flex-1 h-6 rounded-lg" style={{ background: '#fff', border: `1px solid ${border}` }} />
                    <div className="h-6 px-2 rounded-lg flex items-center" style={{ background: '#fff', border: `1px solid ${border}` }}>
                        <span className="text-[8px]" style={{ color: inkFaint }}>Filtrele</span>
                    </div>
                </div>
                {['Apple / iOS Dev', 'Spotify / Frontend', 'Google / PM', 'Meta / Design', 'Tesla / Backend'].map((row, i) => (
                    <div key={row} className="flex items-center justify-between py-1.5" style={{ borderBottom: `1px solid ${border}` }}>
                        <span className="text-[9px] font-medium" style={{ color: '#1a1a1a' }}>{row}</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: ['#a855f718', '#f9731618', '#22c55e18', '#ec489918', '#3b82f618'][i], color: ['#a855f7', '#f97316', '#22c55e', '#ec4899', '#3b82f6'][i] }}>
                            {['Görüşme', 'Süreçte', 'Teklif', 'Beklemede', 'Red'][i]}
                        </span>
                    </div>
                ))}
            </div>
        ),
    },
    {
        url: 'nextstep.app/analytics',
        label: { tr: 'Analiz', en: 'Analytics' },
        desc: { tr: 'Platform, durum ve CV versiyon istatistikleri', en: 'Platform, status and CV version analytics' },
        offset: { x: -28, y: 24, rotate: -2 },
        content: (border: string, inkFaint: string) => (
            <div className="p-4" style={{ background: '#faf9f6' }}>
                <div className="text-[10px] font-bold mb-3" style={{ color: '#1a1a1a' }}>Platform Dağılımı</div>
                {[{ l: 'LinkedIn', v: 72, c: '#0077b5' }, { l: 'Kariyer.net', v: 48, c: '#f97316' }, { l: 'Indeed', v: 31, c: '#2557a7' }, { l: 'Doğrudan', v: 18, c: '#a855f7' }].map(b => (
                    <div key={b.l} className="mb-2">
                        <div className="flex justify-between text-[8px] mb-0.5">
                            <span style={{ color: inkFaint }}>{b.l}</span>
                            <span style={{ color: '#1a1a1a' }}>{b.v}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ background: border }}>
                            <div className="h-2 rounded-full" style={{ width: `${b.v}%`, background: b.c }} />
                        </div>
                    </div>
                ))}
                <div className="mt-3 text-[10px] font-bold mb-2" style={{ color: '#1a1a1a' }}>CV Versiyonları</div>
                <div className="flex gap-1.5">
                    {[{ l: 'v1', v: 8, c: '#a855f7' }, { l: 'v2', v: 14, c: '#f97316' }, { l: 'v3', v: 6, c: '#22c55e' }].map(p => (
                        <div key={p.l} className="flex-1 rounded-xl p-2 text-center" style={{ background: '#fff', border: `1px solid ${border}` }}>
                            <div className="text-sm font-black" style={{ color: p.c }}>{p.v}</div>
                            <div className="text-[7px]" style={{ color: inkFaint }}>{p.l}</div>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        url: 'nextstep.app/add',
        label: { tr: 'Başvuru Ekle', en: 'Add Application' },
        desc: { tr: 'Hızlı form ile yeni başvuru kaydet', en: 'Log a new application with the quick form' },
        offset: { x: 24, y: 32, rotate: 1.5 },
        content: (border: string, inkFaint: string) => (
            <div className="p-4" style={{ background: '#faf9f6' }}>
                {[
                    { l: 'Firma Adı', ph: 'Apple Inc.' },
                    { l: 'Pozisyon', ph: 'Senior iOS Developer' },
                    { l: 'İlan Linki', ph: 'linkedin.com/jobs/...' },
                ].map(f => (
                    <div key={f.l} className="mb-2">
                        <div className="text-[8px] font-bold mb-0.5" style={{ color: inkFaint }}>{f.l}</div>
                        <div className="w-full h-6 rounded-lg px-2 flex items-center" style={{ background: '#fff', border: `1px solid ${border}` }}>
                            <span className="text-[8px]" style={{ color: '#c4bfb9' }}>{f.ph}</span>
                        </div>
                    </div>
                ))}
                <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                        <div className="text-[8px] font-bold mb-0.5" style={{ color: inkFaint }}>Tarih</div>
                        <div className="h-6 rounded-lg" style={{ background: '#fff', border: `1px solid ${border}` }} />
                    </div>
                    <div>
                        <div className="text-[8px] font-bold mb-0.5" style={{ color: inkFaint }}>Durum</div>
                        <div className="h-6 rounded-lg" style={{ background: '#fff', border: `1px solid ${border}` }} />
                    </div>
                </div>
                <button className="w-full mt-3 py-2 rounded-xl text-[9px] font-bold text-white" style={{ background: 'linear-gradient(135deg,#f97316,#a855f7)' }}>
                    Başvuruyu Kaydet
                </button>
            </div>
        ),
    },
    {
        url: 'nextstep.app/cv',
        label: { tr: 'CV Analizi', en: 'CV Analysis' },
        desc: { tr: 'ATS skoru, bölüm analizi ve Gemini önerileri', en: 'ATS scoring, section analysis and Gemini tips' },
        offset: { x: -16, y: 40, rotate: -1 },
        content: (border: string, inkFaint: string) => (
            <div className="p-4" style={{ background: '#faf9f6' }}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-14 h-14 flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
                            <circle cx="18" cy="18" r="15" fill="none" stroke={border} strokeWidth="3" />
                            <circle cx="18" cy="18" r="15" fill="none" stroke="url(#g1)" strokeWidth="3"
                                strokeDasharray="94.2" strokeDashoffset="23.5" strokeLinecap="round" />
                            <defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#a855f7" /></linearGradient></defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center rotate-90">
                            <span className="text-[11px] font-black" style={{ color: '#f97316' }}>75</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-[9px] font-bold" style={{ color: '#1a1a1a' }}>ATS Skoru</div>
                        <div className="text-[8px]" style={{ color: inkFaint }}>İyi — birkaç iyileştirme önerisi var</div>
                    </div>
                </div>
                {['Deneyim', 'Beceriler', 'Eğitim', 'İletişim'].map((s, i) => (
                    <div key={s} className="flex items-center gap-2 mb-1.5">
                        <span className="text-[8px] w-14 flex-shrink-0" style={{ color: inkFaint }}>{s}</span>
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: border }}>
                            <div className="h-1.5 rounded-full" style={{ width: `${[90, 75, 60, 85][i]}%`, background: 'linear-gradient(90deg,#f97316,#a855f7)' }} />
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
];

const FeatureShowcase = React.memo(({ bone2, border, ink, inkFaint, accent, lang }: ShowcaseProps) => {
    const [active, setActive] = useState(0);
    const [hovered, setHovered] = useState<number | null>(null);
    const total = SCREENS.length;

    return (
        <div className="mt-16 sm:mt-24 w-full dash-enter" style={{ maxWidth: 720, margin: '5rem auto 0' }}>
            {/* Stacked window cards */}
            <div className="relative" style={{ height: 420 }}>
                {SCREENS.map((screen, idx) => {
                    const isActive = idx === active;
                    const isHovered = hovered === idx;
                    // z ordering: active on top, others behind
                    const zIndex = isActive ? 50 : isHovered ? 40 : (total - Math.abs(idx - active)) * 5;
                    // Offset each card so they peek out
                    const offsetX = isActive ? 0 : screen.offset.x * 0.5;
                    const offsetY = isActive ? 0 : 16 + idx * 8;
                    const rotate = isActive ? 0 : screen.offset.rotate;
                    const scale = isActive ? 1 : isHovered ? 0.97 : 0.93 - idx * 0.01;

                    return (
                        <div key={screen.url}
                            onClick={() => setActive((active + 1) % total)}
                            onMouseEnter={() => setHovered(idx)}
                            onMouseLeave={() => setHovered(null)}
                            style={{
                                position: 'absolute', inset: 0,
                                transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg) scale(${scale})`,
                                zIndex,
                                cursor: 'pointer',
                                transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, z-index 0s',
                                borderRadius: 20,
                                overflow: 'hidden',
                                border: `1px solid ${isActive ? '#d0ccc6' : border}`,
                                background: '#fff',
                                boxShadow: isActive
                                    ? '0 32px 80px rgba(0,0,0,0.14)'
                                    : isHovered
                                        ? '0 16px 48px rgba(0,0,0,0.12)'
                                        : '0 4px 20px rgba(0,0,0,0.06)',
                            }}>
                            {/* Browser chrome */}
                            <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ background: '#f5f2ee', borderBottom: `1px solid ${border}` }}>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/70" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/70" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]/70" />
                                <div className="ml-2 flex-1 max-w-[180px] h-4 rounded px-2 flex items-center" style={{ background: bone2 }}>
                                    <span className="text-[8px]" style={{ color: inkFaint }}>{screen.url}</span>
                                </div>
                            </div>
                            {/* Card content */}
                            {screen.content(border, inkFaint)}
                        </div>
                    );
                })}
            </div>

            {/* Label + description */}
            <div className="mt-6 text-center">
                <div className="flex justify-center gap-2 mb-4">
                    {SCREENS.map((_, i) => (
                        <button key={i} onClick={() => setActive(i)}
                            className="rounded-full transition-all duration-300"
                            style={{
                                width: active === i ? 28 : 8,
                                height: 8,
                                background: active === i ? (accent as string) : border,
                            }} />
                    ))}
                </div>
                <div className="text-base font-bold mb-1" style={{ color: ink }}>
                    {lang === 'tr' ? SCREENS[active].label.tr : SCREENS[active].label.en}
                </div>
                <p className="text-sm" style={{ color: inkFaint }}>
                    {lang === 'tr' ? SCREENS[active].desc.tr : SCREENS[active].desc.en}
                </p>
                <p className="text-xs mt-2" style={{ color: inkFaint }}>
                    {lang === 'tr' ? '← Karta tıklayarak geçiş yap →' : '← Click to cycle through screens →'}
                </p>
            </div>
        </div>
    );
});
FeatureShowcase.displayName = 'FeatureShowcase';

// ── Main component ──────────────────────────────────────────────────
const LandingPage = () => {
    const navigate = useNavigate();
    const { t, lang } = useLanguage();
    const [activeStep, setActiveStep] = useState(0);
    const heroRef = useRef<HTMLDivElement>(null);

    // Cycling words — lists are defined outside component (stable references)
    const wordList = lang === 'tr' ? TR_WORDS : EN_WORDS;
    const { display: scrambledText, opacity: scrambleOpacity } = useWordCycler(wordList);
    const scrambleLine1 = lang === 'tr' ? 'Kariyerini' : 'Own Your';

    const steps = lang === 'tr'
        ? [
            { step: '01', title: 'Kayıt Ol', desc: 'Saniyeler içinde ücretsiz hesap oluşturun.' },
            { step: '02', title: 'Başvuru Ekle', desc: 'Firma, pozisyon, tarih ve platform bilgilerini girin.' },
            { step: '03', title: 'Takip Et', desc: 'Dashboard ile anlık durum ve analizleri görün.' },
            { step: '04', title: 'Geliş', desc: 'Verilerle hangi stratejinin işe yaradığını öğrenin.' },
        ]
        : [
            { step: '01', title: 'Sign Up', desc: 'Create a free account in seconds.' },
            { step: '02', title: 'Log Applications', desc: 'Enter company, role, date and platform.' },
            { step: '03', title: 'Track Progress', desc: 'See real-time status from your dashboard.' },
            { step: '04', title: 'Improve', desc: 'Use data to figure out what actually works.' },
        ];

    const feats = lang === 'tr'
        ? [
            { e: '📊', t: 'Akıllı Analiz', d: 'CV versiyonları, mülakat oranları ve platform başarısı tek ekranda.' },
            { e: '⚡', t: 'Sıfır Karmaşa', d: 'Excel tablolarına veda edin. Hızlı kayıt, tüm geçmişiniz bir arada.' },
            { e: '🎯', t: 'Motivasyon Takibi', d: 'Hangi yazıların işe yaradığını ölçün.' },
            { e: '📈', t: 'Platform Karşılaştırması', d: 'Hangi platform daha çok dönüş getiriyor?' },
            { e: '🔒', t: 'Gizlilik Önce', d: 'Verileriniz yalnızca sizin hesabınızda.' },
            { e: '📥', t: 'Dışa Aktarma', d: 'Excel ve PDF olarak tüm geçmişi indirin.' },
        ]
        : [
            { e: '📊', t: 'Smart Analytics', d: 'CV versions, interview rates, platform success in one view.' },
            { e: '⚡', t: 'Zero Chaos', d: 'Goodbye spreadsheets. Quick log, full history in one place.' },
            { e: '🎯', t: 'Motivation Tracking', d: 'Measure which cover letters actually work.' },
            { e: '📈', t: 'Platform Comparison', d: 'Which platform drives more responses?' },
            { e: '🔒', t: 'Privacy First', d: 'Data stored in your account only.' },
            { e: '📥', t: 'Export', d: 'Download full history as Excel or PDF.' },
        ];

    useEffect(() => {
        const t = setInterval(() => setActiveStep(s => (s + 1) % 4), 3000);
        return () => clearInterval(t);
    }, []);

    // ── Tokens ──────────────────────────────────────────────────────
    const bone = '#faf9f6';
    const bone2 = '#f0ede8';
    const border = '#e2ded8';
    const ink = '#1a1a1a';
    const inkMid = '#6b6560';
    const inkFaint = '#a8a39d';
    const accent = 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #a855f7 100%)';

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden" style={{
            background: bone,
            color: ink,
            fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
        }}>
            <Navbar />

            {/* ── HERO ──────────────────────────────────────────── */}
            <section ref={heroRef} className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-5 overflow-hidden">
                {/* Subtle radial on bone */}
                <div className="pointer-events-none absolute inset-0"
                    style={{ background: `radial-gradient(ellipse 70% 50% at 50% 40%, rgba(249,115,22,0.06) 0%, transparent 70%)` }} />

                <div className="relative z-10 max-w-[960px] pt-32 pb-16 flex flex-col items-center">
                    {/* Badge */}
                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-widest uppercase"
                        style={{ background: bone2, border: `1px solid ${border}`, color: inkMid }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#f97316' }} />
                        {t('landing.badge')}
                    </motion.div>

                    {/* Subtitle above */}
                    <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-sm sm:text-base font-semibold mb-4 tracking-wide"
                        style={{ color: inkMid }}>
                        {lang === 'tr' ? 'İş Başvuru Takip Platformu' : 'Job Application Tracker'}
                    </motion.p>

                    {/* Headline line 1 — static */}
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15 }}>
                        <h1 className="font-black tracking-[-0.04em] leading-[0.92]"
                            style={{ fontSize: 'clamp(52px, 10vw, 112px)', color: ink }}>
                            {scrambleLine1}
                        </h1>
                    </motion.div>

                    {/* Headline line 2 — scramble with fade */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}>
                        <h1
                            style={{
                                fontSize: 'clamp(52px, 10vw, 112px)',
                                fontWeight: 900,
                                letterSpacing: '-0.04em',
                                lineHeight: 0.92,
                                marginBottom: 'clamp(24px, 3vw, 32px)',
                                background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #a855f7 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                display: 'block',
                                // 🔒 Prevent layout reflow: lock dimensions to widest word
                                whiteSpace: 'nowrap',
                                minWidth: '10ch',
                                opacity: scrambleOpacity,
                                transition: 'opacity 0.25s ease',
                            }}>
                            {scrambledText}
                        </h1>
                    </motion.div>

                    {/* Sub */}
                    <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
                        className="max-w-lg text-base sm:text-lg leading-relaxed font-medium mb-10 sm:mb-14"
                        style={{ color: inkMid }}>
                        {t('landing.sub')}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}
                        className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <button onClick={() => navigate('/login')}
                            className="w-full sm:w-auto rounded-full px-10 py-4 text-base font-bold text-white transition-all hover:scale-[1.03] hover:shadow-[0_8px_32px_rgba(249,115,22,0.3)]"
                            style={{ background: accent }}>
                            {t('landing.cta')}
                        </button>
                        <button onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto rounded-full px-10 py-4 text-base font-semibold transition-all hover:bg-black/5"
                            style={{ border: `1.5px solid ${border}`, color: inkMid }}>
                            {t('landing.howBtn')} ↓
                        </button>
                    </motion.div>

                    {/* ── INTERACTIVE FEATURE SHOWCASE ── */}
                    <FeatureShowcase bone2={bone2} border={border} ink={ink} inkFaint={inkFaint} accent={accent} lang={lang} />
                </div>
            </section>

            {/* ── STATS ─────────────────────────────────────────── */}
            <section style={{ background: bone2, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }} className="py-12 sm:py-16 px-5">
                <div className="mx-auto max-w-[1100px]">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12">
                        {[
                            { v: '∞', l: t('landing.statsUnlimited'), s: t('landing.statsUnlimitedSub') },
                            { v: '6', l: t('landing.statsWidgets'), s: t('landing.statsWidgetsSub') },
                            { v: '0', l: t('landing.statsServer'), s: t('landing.statsServerSub') },
                            { v: '%100', l: t('landing.statsFree'), s: t('landing.statsFreeSub') },
                        ].map((s, i) => (
                            <Reveal key={s.l} delay={i * 0.08}>
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-black tracking-tighter mb-1" style={{
                                        background: accent,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}>{s.v}</div>
                                    <div className="text-sm font-bold" style={{ color: ink }}>{s.l}</div>
                                    <div className="text-xs mt-0.5" style={{ color: inkFaint }}>{s.s}</div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES ──────────────────────────────────────── */}
            <section id="features" className="py-24 sm:py-32 px-5" style={{ background: bone }}>
                <div className="mx-auto max-w-[1100px]">
                    <Reveal>
                        <div className="text-center mb-16 sm:mb-20">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#f97316' }}>{t('landing.featuresLabel')}</p>
                            <h2 className="font-black tracking-[-0.03em] leading-tight mb-4" style={{ fontSize: 'clamp(28px,5vw,54px)', color: ink }}>
                                {t('landing.featuresTitle')}
                            </h2>
                            <p className="text-base max-w-xl mx-auto" style={{ color: inkMid }}>{t('landing.featuresSub')}</p>
                        </div>
                    </Reveal>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {feats.map((f, i) => (
                            <Reveal key={f.t} delay={i * 0.07}>
                                <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 h-full transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] cursor-default"
                                    style={{ background: '#fff', border: `1px solid ${border}` }}>
                                    <div className="text-3xl mb-4">{f.e}</div>
                                    <h3 className="text-base font-bold mb-2" style={{ color: ink }}>{f.t}</h3>
                                    <p className="text-sm leading-relaxed" style={{ color: inkMid }}>{f.d}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ──────────────────────────────────── */}
            <section id="how" style={{ background: bone2, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }} className="py-24 sm:py-32 px-5">
                <div className="mx-auto max-w-[1100px]">
                    <Reveal>
                        <div className="text-center mb-16 sm:mb-20">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#a855f7' }}>{t('landing.howLabel')}</p>
                            <h2 className="font-black tracking-[-0.03em] leading-tight" style={{ fontSize: 'clamp(28px,5vw,54px)', color: ink }}>
                                {t('landing.howTitle')}
                            </h2>
                        </div>
                    </Reveal>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {steps.map((s, i) => (
                            <Reveal key={s.step} delay={i * 0.1}>
                                <motion.div animate={activeStep === i ? { scale: 1.04, y: -6 } : { scale: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 h-full cursor-default transition-shadow"
                                    style={activeStep === i
                                        ? { background: accent as unknown as string, border: 'none', boxShadow: '0 12px 40px rgba(249,115,22,0.2)' }
                                        : { background: '#fff', border: `1px solid ${border}` }
                                    }>
                                    <div className="text-4xl font-black mb-4" style={{ color: activeStep === i ? 'rgba(255,255,255,0.22)' : border }}>{s.step}</div>
                                    <div className="text-base font-bold mb-2" style={{ color: activeStep === i ? '#fff' : ink }}>{s.title}</div>
                                    <p className="text-sm leading-relaxed" style={{ color: activeStep === i ? 'rgba(255,255,255,0.75)' : inkMid }}>{s.desc}</p>
                                </motion.div>
                            </Reveal>
                        ))}
                    </div>
                    <div className="flex justify-center gap-2 mt-10">
                        {steps.map((_, i) => (
                            <button key={i} onClick={() => setActiveStep(i)}
                                className="rounded-full transition-all"
                                style={{ width: activeStep === i ? 28 : 8, height: 8, background: activeStep === i ? '#f97316' : border }} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ───────────────────────────────────────────── */}
            <section className="px-4 sm:px-6 py-20 sm:py-28" style={{ background: bone }}>
                <div className="mx-auto max-w-[960px]">
                    <Reveal>
                        <div className="relative text-center rounded-[28px] sm:rounded-[40px] p-12 sm:p-20 overflow-hidden"
                            style={{ background: accent as unknown as string, boxShadow: '0 24px 80px rgba(249,115,22,0.2)' }}>
                            <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.08)' }} />
                            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.06)' }} />
                            <div className="relative z-10">
                                <h2 className="font-black leading-tight tracking-tight text-white mb-4" style={{ fontSize: 'clamp(24px,4vw,48px)' }}>
                                    {t('landing.ctaTitle')}
                                </h2>
                                <p className="mx-auto mb-10 max-w-md text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                    {t('landing.ctaSub')}
                                </p>
                                <button onClick={() => navigate('/login')}
                                    className="rounded-full bg-white px-12 py-4 text-base font-bold transition-all hover:scale-[1.05] hover:-translate-y-0.5"
                                    style={{ color: '#f97316' }}>
                                    {t('landing.ctaBtn')}
                                </button>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ── FOOTER ────────────────────────────────────────── */}
            <footer style={{ borderTop: `1px solid ${border}`, background: bone2 }} className="py-8 sm:py-10 px-5">
                <div className="mx-auto max-w-[1100px] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: accent as unknown as string }}>
                            <span className="text-white font-bold text-xs">N</span>
                        </div>
                        <span className="font-bold tracking-tight" style={{ color: ink }}>NextStep</span>
                    </div>
                    <p className="text-xs" style={{ color: inkFaint }}>
                        {lang === 'tr' ? 'Kutluhan Gül tarafından iş başvurularını takip etmek için.' : 'Built by Kutluhan Gül for smarter job tracking.'}
                    </p>
                    <p className="text-xs" style={{ color: inkFaint }}>© 2026 NextStep</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
