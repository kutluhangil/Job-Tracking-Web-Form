import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { useLanguage } from '../lib/i18n';

// ── Word Cycler with visible scramble ─────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
const rand = (arr: string) => arr[Math.floor(Math.random() * arr.length)];

function useWordCycler(
    words: string[],
    scrambleDuration = 4000,
    pauseDuration = 3000,
    frameInterval = 80   // ms between character updates — lower = faster
) {
    const [display, setDisplay] = useState(words[0]);
    const stateRef = useRef({
        wordIndex: 0,
        phase: 'scramble' as 'scramble' | 'pause',
        startTime: 0,
        lastFrameTime: 0,
    });
    const rafRef = useRef<number>(0);

    useEffect(() => {
        stateRef.current = { wordIndex: 0, phase: 'scramble', startTime: 0, lastFrameTime: 0 };

        const animate = (timestamp: number) => {
            const s = stateRef.current;
            if (!s.startTime) s.startTime = timestamp;
            const elapsed = timestamp - s.startTime;
            const target = words[s.wordIndex];

            if (s.phase === 'scramble') {
                // Throttle: only update display every `frameInterval` ms
                if (timestamp - s.lastFrameTime >= frameInterval) {
                    s.lastFrameTime = timestamp;
                    const progress = Math.min(elapsed / scrambleDuration, 1);
                    // Characters resolve from LEFT → RIGHT as time passes
                    const resolved = Math.floor(progress * target.length);
                    setDisplay(
                        target.split('').map((ch, i) => {
                            if (ch === ' ') return ' ';
                            if (i < resolved) return ch;   // locked in
                            return rand(CHARS);             // still scrambling
                        }).join('')
                    );
                }
                if (elapsed >= scrambleDuration) {
                    setDisplay(target);                     // snap to final
                    s.phase = 'pause';
                    s.startTime = timestamp;
                }
            } else {
                // During pause just hold — move to next word when done
                if (elapsed >= pauseDuration) {
                    s.wordIndex = (s.wordIndex + 1) % words.length;
                    s.phase = 'scramble';
                    s.startTime = timestamp;
                    s.lastFrameTime = 0;
                }
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [words, scrambleDuration, pauseDuration, frameInterval]);

    return display;
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

// ── Main component ──────────────────────────────────────────────────
const LandingPage = () => {
    const navigate = useNavigate();
    const { t, lang } = useLanguage();
    const [activeStep, setActiveStep] = useState(0);
    const heroRef = useRef<HTMLDivElement>(null);

    // Cycling words after 'Kariyerini' / 'Own Your'
    const trWords = ['Yönet.', 'Geliştir.', 'Düzenle.', 'Başlat.', 'Planla.', 'Takip Et.', 'Güçlendir.', 'Keşfet.', 'Hedefle.', 'İlerle.'];
    const enWords = ['Career.', 'Future.', 'Journey.', 'Growth.', 'Success.', 'Goals.', 'Path.', 'Story.', 'Strategy.', 'Ambition.'];
    const wordList = lang === 'tr' ? trWords : enWords;
    const scrambledText = useWordCycler(wordList, 4000, 3000, 80);
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

                    {/* Headline line 2 — scramble animation */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}>
                        <h1 className="font-black tracking-[-0.04em] leading-[0.92] mb-6 sm:mb-8"
                            style={{
                                fontSize: 'clamp(52px, 10vw, 112px)',
                                background: accent,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontVariantNumeric: 'tabular-nums',
                                display: 'block',
                                minWidth: '4ch',
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

                    {/* Dashboard preview card */}
                    <motion.div initial={{ opacity: 0, y: 48, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1.0, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="mt-16 sm:mt-20 w-full max-w-[800px] rounded-[24px] overflow-hidden"
                        style={{ border: `1px solid ${border}`, background: '#fff', boxShadow: '0 24px 80px rgba(0,0,0,0.08)' }}>
                        {/* Browser bar */}
                        <div className="flex items-center gap-2 px-4 sm:px-5 py-3" style={{ background: '#f5f2ee', borderBottom: `1px solid ${border}` }}>
                            <div className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
                            <div className="w-3 h-3 rounded-full bg-[#febc2e]/70" />
                            <div className="w-3 h-3 rounded-full bg-[#28c840]/70" />
                            <div className="ml-3 flex-1 max-w-[200px] h-5 rounded-lg px-3 flex items-center" style={{ background: bone2 }}>
                                <span className="text-[10px] font-medium" style={{ color: inkFaint }}>nextstep.app/dashboard</span>
                            </div>
                        </div>
                        {/* Dashboard content */}
                        <div className="p-4 sm:p-6" style={{ background: '#faf9f6' }}>
                            {/* Gradient greeting */}
                            <div className="rounded-2xl p-4 sm:p-5 mb-4" style={{ background: accent }}>
                                <div className="text-[10px] font-bold tracking-widest text-white/60 mb-1">{new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                                <div className="text-xl font-extrabold text-white">Merhaba, Kutluhan 👋</div>
                            </div>
                            {/* Stat cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                                {[
                                    { n: '24', l: 'Toplam', c: '#f97316' },
                                    { n: '7', l: 'Bu Ay', c: '#a855f7' },
                                    { n: '5', l: 'Süreçte', c: '#ec4899' },
                                    { n: '2', l: 'Olumlu', c: '#22c55e' },
                                ].map(s => (
                                    <div key={s.l} className="rounded-2xl p-3 sm:p-4" style={{ background: '#fff', border: `1px solid ${border}` }}>
                                        <div className="text-lg sm:text-2xl font-black" style={{ color: s.c }}>{s.n}</div>
                                        <div className="text-[10px] font-medium mt-0.5" style={{ color: inkFaint }}>{s.l}</div>
                                    </div>
                                ))}
                            </div>
                            {/* Recent row */}
                            <div className="rounded-2xl p-3 sm:p-4" style={{ background: '#fff', border: `1px solid ${border}` }}>
                                <div className="text-xs font-bold mb-3" style={{ color: ink }}>Son Hareketler</div>
                                {[
                                    { c: 'Apple', p: 'iOS Developer', s: 'Görüşme', col: '#a855f7' },
                                    { c: 'Spotify', p: 'Frontend Eng.', s: 'Süreçte', col: '#f97316' },
                                    { c: 'Notion', p: 'Product Design', s: 'Teklif', col: '#22c55e' },
                                ].map(r => (
                                    <div key={r.c} className="flex items-center gap-3 py-1.5" style={{ borderBottom: `1px solid ${border}` }}>
                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: r.col + '18', color: r.col }}>{r.c[0]}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-semibold truncate" style={{ color: ink }}>{r.c}</div>
                                            <div className="text-[10px] truncate" style={{ color: inkFaint }}>{r.p}</div>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0" style={{ background: r.col + '18', color: r.col }}>{r.s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
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
