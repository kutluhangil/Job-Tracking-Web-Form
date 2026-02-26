import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

// ── Scroll-reveal hook ──────────────────────────────────────────────
const useInView = (threshold = 0.2) => {
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
    const { ref, inView } = useInView(0.15);
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
};

// ── Feature card data ──────────────────────────────────────────────
const features = [
    {
        emoji: '📊',
        title: 'Akıllı Analiz',
        description: 'Her başvurunun sizi finale ne kadar yaklaştırdığını anlayın. CV versiyonları, mülakat oranları ve platform başarısı tek ekranda.',
        color: 'from-indigo-50 to-blue-50',
        accent: 'text-indigo-600',
        border: 'border-indigo-100',
    },
    {
        emoji: '⚡',
        title: 'Sıfır Karmaşa',
        description: 'Excel tablolarına veda edin. Hızlı kayıt formu, tek tıkla iş ilanına ulaşım, tüm geçmişiniz bir arada.',
        color: 'from-amber-50 to-orange-50',
        accent: 'text-amber-600',
        border: 'border-amber-100',
    },
    {
        emoji: '🎯',
        title: 'Motivasyon Takibi',
        description: 'Hangi motivasyon mektuplarının işe yaradığını ölçün. Sistematik verilerle bir sonraki başvurunuzu güçlendirin.',
        color: 'from-emerald-50 to-teal-50',
        accent: 'text-emerald-600',
        border: 'border-emerald-100',
    },
    {
        emoji: '📈',
        title: 'Platform Karşılaştırması',
        description: 'LinkedIn, Kariyer.net veya doğrudan başvuru — hangisi daha çok dönüş getiriyor? Veriler yanıtlıyor.',
        color: 'from-pink-50 to-rose-50',
        accent: 'text-rose-600',
        border: 'border-rose-100',
    },
    {
        emoji: '🔒',
        title: 'Gizlilik Önce',
        description: 'Tüm verileriniz yalnızca sizin tarayıcınızda saklanır. Sunucuya gönderilmez. Tamamen sizin.',
        color: 'from-sky-50 to-cyan-50',
        accent: 'text-sky-600',
        border: 'border-sky-100',
    },
    {
        emoji: '📥',
        title: 'Dışa Aktarma',
        description: 'JSON veya Excel olarak tüm geçmişinizi indirin. Kariyer danışmanınıza kolayca gönderin.',
        color: 'from-violet-50 to-indigo-50',
        accent: 'text-violet-600',
        border: 'border-violet-100',
    },
];

const stats = [
    { value: '∞', label: 'Başvuru takip', desc: 'Sınırsız' },
    { value: '6', label: 'Analiz widgetı', desc: 'Dashboard\'da' },
    { value: '0', label: 'Sunucu', desc: 'Bulut yok, yerel' },
    { value: '100%', label: 'Ücretsiz', desc: 'Her zaman' },
];

const howItWorks = [
    { step: '01', title: 'Kayıt Ol', desc: 'Saniyeler içinde hesap oluşturun. Kart bilgisi gerekmez.' },
    { step: '02', title: 'Başvuru Ekle', desc: 'Firma, pozisyon, tarih ve platform bilgilerini girin.' },
    { step: '03', title: 'Takip Et', desc: 'Dashboard\'dan anlık durum, analiz ve önerilerle süreci yönetin.' },
    { step: '04', title: 'Geliş', desc: 'Hangi strateji işe yarıyor? Veriler sizi rehberliğinde kariyer hedefine ulaşın.' },
];

// ── Main Component ─────────────────────────────────────────────────
const LandingPage = () => {
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setActiveStep(s => (s + 1) % howItWorks.length), 2800);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative min-h-screen w-full bg-[#f8f8fa] text-[#1d1d1f] selection:bg-indigo-200 selection:text-indigo-900 overflow-x-hidden">
            <Navbar />

            {/* ══════════════════════════════════════════════════════
                HERO — Apple-style full-viewport, parallax
            ══════════════════════════════════════════════════════ */}
            <section ref={heroRef} className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center">
                {/* Soft gradient aura */}
                <div className="pointer-events-none absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
                    <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)' }} />
                    <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)' }} />
                </div>

                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 flex flex-col items-center max-w-[900px] pt-24">
                    {/* Eyebrow badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-600 tracking-wide"
                    >
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        Kariyer Takip Platformu
                    </motion.div>

                    {/* Main heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                        className="text-[clamp(48px,8vw,96px)] font-extrabold leading-[1.0] tracking-[-0.03em] text-[#1d1d1f] mb-6"
                    >
                        Geleceğini<br />
                        <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-400 bg-clip-text text-transparent" style={{ backgroundSize: '200% auto', animation: 'gradientFlow 4s ease infinite' }}>
                            Yönet.
                        </span>
                    </motion.h1>

                    {/* Sub-heading */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
                        className="max-w-2xl text-[clamp(18px,2.5vw,26px)] leading-relaxed text-black/50 font-medium mb-12"
                    >
                        İş başvurularınızı takip edin, analiz edin ve stratejinizi verilerle geliştirin.
                    </motion.p>

                    {/* CTA buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
                        className="flex flex-col sm:flex-row items-center gap-4"
                    >
                        <button
                            onClick={() => navigate('/login')}
                            className="rounded-full bg-[#1d1d1f] px-8 py-4 text-base font-bold text-white transition-all hover:bg-black hover:scale-[1.03] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] relative overflow-hidden group"
                        >
                            <span className="relative z-10">Ücretsiz Başla</span>
                            <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                        <button
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className="rounded-full border border-black/15 bg-white px-8 py-4 text-base font-semibold text-black/70 transition-all hover:border-black/30 hover:bg-black/5 hover:scale-[1.01]"
                        >
                            Nasıl Çalışır? ↓
                        </button>
                    </motion.div>

                    {/* App preview / dashboard mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 48, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1, delay: 0.65, ease: 'easeOut' }}
                        className="mt-20 w-full max-w-[900px] rounded-[28px] bg-white border border-black/8 shadow-[0_32px_80px_rgba(0,0,0,0.12)] overflow-hidden"
                    >
                        {/* Browser chrome */}
                        <div className="flex items-center gap-2 px-5 py-3.5 bg-[#f5f5f7] border-b border-black/5">
                            <div className="w-3 h-3 rounded-full bg-rose-400/70" />
                            <div className="w-3 h-3 rounded-full bg-amber-400/70" />
                            <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
                            <div className="mx-4 flex-1 max-w-[280px] h-6 rounded-lg bg-black/5 flex items-center px-3">
                                <span className="text-[10px] text-black/30 font-medium">nextstep.app/dashboard</span>
                            </div>
                        </div>
                        {/* Dashboard UI mockup */}
                        <div className="p-6 bg-[#f8f8fa]">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-black/30 mb-1">GENEL BAKIŞ</div>
                                    <div className="text-2xl font-bold text-[#1d1d1f]">Merhaba, Kutluhan 👋</div>
                                </div>
                                <div className="w-20 h-8 rounded-full bg-black/5 animate-pulse" />
                            </div>
                            <div className="grid grid-cols-4 gap-3 mb-5">
                                {[
                                    { n: '24', l: 'Toplam', c: 'from-indigo-500 to-blue-600' },
                                    { n: '7', l: 'Bu Ay', c: 'from-sky-400 to-cyan-600' },
                                    { n: '5', l: 'Süreçte', c: 'from-amber-400 to-orange-500' },
                                    { n: '2', l: 'Olumlu', c: 'from-emerald-400 to-teal-600' },
                                ].map(s => (
                                    <div key={s.l} className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm">
                                        <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${s.c} flex items-center justify-center text-white text-xs font-bold mb-2`}>{s.n}</div>
                                        <div className="text-xl font-bold text-[#1d1d1f]">{s.n}</div>
                                        <div className="text-[10px] font-medium text-black/40 mt-0.5">{s.l}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
                                <div className="text-sm font-bold text-[#1d1d1f] mb-3">Son Hareketler</div>
                                <div className="space-y-2">
                                    {[
                                        { co: 'Apple', pos: 'iOS Developer', s: 'Görüşme', c: 'bg-sky-50 text-sky-700 border-sky-100' },
                                        { co: 'Spotify', pos: 'Frontend Engineer', s: 'Süreçte', c: 'bg-blue-50 text-blue-700 border-blue-100' },
                                        { co: 'Notion', pos: 'Product Design', s: 'Teklif', c: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                                    ].map(r => (
                                        <div key={r.co} className="flex items-center gap-3 py-2 border-b border-black/5 last:border-0">
                                            <div className="w-7 h-7 rounded-lg bg-black/5 flex-shrink-0 flex items-center justify-center text-xs font-bold text-black/40">{r.co[0]}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-xs text-[#1d1d1f]">{r.co}</div>
                                                <div className="text-[10px] text-black/40">{r.pos}</div>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${r.c}`}>{r.s}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <p className="text-xs font-semibold text-black/25 uppercase tracking-widest">Keşfet</p>
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-5 h-8 rounded-full border-2 border-black/15 flex items-start justify-center pt-1.5"
                    >
                        <div className="w-1 h-1.5 rounded-full bg-black/30" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ══════════════════════════════════════════════════════
                STATS STRIP
            ══════════════════════════════════════════════════════ */}
            <section className="border-y border-black/5 bg-white py-12 px-6">
                <div className="mx-auto max-w-[1100px]">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((s, i) => (
                            <Reveal key={s.label} delay={i * 0.08}>
                                <div className="text-center">
                                    <div className="text-4xl md:text-5xl font-black tracking-tighter text-[#1d1d1f] mb-1">{s.value}</div>
                                    <div className="text-sm font-bold text-black/70">{s.label}</div>
                                    <div className="text-xs text-black/40 mt-0.5">{s.desc}</div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                FEATURES GRID — Apple-style card grid
            ══════════════════════════════════════════════════════ */}
            <section id="features" className="py-28 px-6">
                <div className="mx-auto max-w-[1100px]">
                    <Reveal>
                        <div className="text-center mb-16">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/40 mb-3">Özellikler</p>
                            <h2 className="text-[clamp(32px,5vw,52px)] font-extrabold tracking-tight text-[#1d1d1f] leading-tight mb-4">
                                İhtiyacınız olan her şey,<br />tek yerde.
                            </h2>
                            <p className="text-lg text-black/50 max-w-xl mx-auto leading-relaxed">
                                Binlerce saat kaybettiren Excel tablolarından kurtulun.
                            </p>
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((f, i) => (
                            <Reveal key={f.title} delay={i * 0.07}>
                                <div className={`h-full rounded-3xl bg-gradient-to-br ${f.color} border ${f.border} p-7 transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] cursor-default`}>
                                    <div className={`text-4xl mb-5`}>{f.emoji}</div>
                                    <h3 className={`text-lg font-bold ${f.accent} mb-2`}>{f.title}</h3>
                                    <p className="text-sm text-black/60 leading-relaxed">{f.description}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                HOW IT WORKS — Step-by-step with animation
            ══════════════════════════════════════════════════════ */}
            <section className="bg-white border-y border-black/5 py-28 px-6">
                <div className="mx-auto max-w-[1100px]">
                    <Reveal>
                        <div className="text-center mb-16">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/40 mb-3">Nasıl Çalışır</p>
                            <h2 className="text-[clamp(32px,5vw,52px)] font-extrabold tracking-tight text-[#1d1d1f] leading-tight">
                                4 adımda<br />kariyer kontrolü.
                            </h2>
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {howItWorks.map((s, i) => (
                            <Reveal key={s.step} delay={i * 0.1}>
                                <motion.div
                                    animate={activeStep === i ? { scale: 1.03, y: -4 } : { scale: 1, y: 0 }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                    className={`rounded-3xl p-7 border transition-all ${activeStep === i ? 'bg-gradient-to-br from-indigo-500 to-blue-600 border-transparent text-white shadow-[0_16px_48px_rgba(99,102,241,0.3)]' : 'bg-[#f8f8fa] border-black/5'}`}
                                >
                                    <div className={`text-4xl font-black tracking-tighter mb-4 ${activeStep === i ? 'text-white/30' : 'text-black/10'}`}>{s.step}</div>
                                    <div className={`text-lg font-bold mb-2 ${activeStep === i ? 'text-white' : 'text-[#1d1d1f]'}`}>{s.title}</div>
                                    <p className={`text-sm leading-relaxed ${activeStep === i ? 'text-white/75' : 'text-black/50'}`}>{s.desc}</p>
                                </motion.div>
                            </Reveal>
                        ))}
                    </div>

                    {/* Step progress dots */}
                    <div className="flex justify-center gap-2 mt-10">
                        {howItWorks.map((_, i) => (
                            <button key={i} onClick={() => setActiveStep(i)}
                                className={`transition-all rounded-full ${activeStep === i ? 'w-8 h-2 bg-indigo-600' : 'w-2 h-2 bg-black/15 hover:bg-black/30'}`} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                TESTIMONIAL / INSIGHT SECTION
            ══════════════════════════════════════════════════════ */}
            <section className="py-28 px-6">
                <div className="mx-auto max-w-[1100px]">
                    <Reveal>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/40 mb-4">Neden NextStep?</p>
                                <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight text-[#1d1d1f] leading-tight mb-6">
                                    Strateji olmadan<br />başvuru, şans oyunu.
                                </h2>
                                <p className="text-base text-black/55 leading-relaxed mb-8">
                                    Ortalama iş arayan 127 başvuru gönderiyor. Bunların %90'ını hatırlamıyor.
                                    NextStep, hangisinin nerede olduğunu, hangisinin işe yaradığını ve bir sonraki adımın ne olması gerektiğini net gösterir.
                                </p>
                                <button onClick={() => navigate('/login')}
                                    className="rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 px-8 py-4 text-sm font-bold text-white transition-all hover:shadow-[0_8px_32px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 hover:scale-[1.02]">
                                    Hemen Dene →
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { n: '%67', t: 'Takip eden aday', d: 'daha fazla 2. görüşmeye geçer' },
                                    { n: '127', t: 'Ortalama başvuru', d: 'iş aramada — çoğu takipsiz' },
                                    { n: '3x', t: 'Motivasyon etkisi', d: 'yazılı başvurularda dönüş' },
                                    { n: '14gün', t: 'Ortalama yanıt', d: 'takip etmezsen unutulur' },
                                ].map(card => (
                                    <div key={card.n} className="bg-white rounded-3xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-6">
                                        <div className="text-3xl font-black tracking-tight text-[#1d1d1f] mb-1">{card.n}</div>
                                        <div className="text-sm font-bold text-black/70 mb-1">{card.t}</div>
                                        <div className="text-xs text-black/40 leading-relaxed">{card.d}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                CTA — Full width centered gradient card
            ══════════════════════════════════════════════════════ */}
            <section className="px-4 sm:px-6 mb-32 md:mb-48">
                <div className="mx-auto max-w-[1100px]">
                    <Reveal>
                        <div
                            className="w-full text-center rounded-[32px] p-14 md:p-24 text-white relative overflow-hidden shadow-2xl"
                            style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)' }}
                        >
                            <div className="absolute inset-0 bg-white/5 mix-blend-overlay pointer-events-none" />
                            <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/8 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white/8 rounded-full blur-3xl pointer-events-none" />
                            <div className="relative z-10">
                                <h2 className="mb-5 text-white font-extrabold leading-tight tracking-tight text-[clamp(28px,5vw,48px)]">
                                    Başvuruya Hazır Mısın?
                                </h2>
                                <p className="mx-auto mb-10 max-w-lg text-lg text-white/85 leading-relaxed">
                                    Saniyeler içinde hesabınızı oluşturun ve NextStep ile kariyerinizi şekillendirin.
                                </p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-base font-bold text-indigo-700 transition-all hover:scale-[1.04] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,255,255,0.35)]"
                                >
                                    Ücretsiz Başla
                                </button>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                FOOTER
            ══════════════════════════════════════════════════════ */}
            <footer className="border-t border-black/5 py-12 px-6">
                <div className="mx-auto max-w-[1100px] flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow">
                            <span className="text-white font-bold text-xs">N</span>
                        </div>
                        <span className="font-bold text-[#1d1d1f] tracking-tight">NextStep</span>
                    </div>
                    <p className="text-xs font-medium text-black/35 text-center">
                        Bu site Kutluhan Gül tarafından iş başvurularını takip etmeyi kolaylaştırmak için geliştirilmiştir.
                    </p>
                    <p className="text-xs text-black/30">© 2026 NextStep</p>
                </div>
            </footer>

            {/* ── Global animation keyframes ─ */}
            <style>{`
                @keyframes gradientFlow {
                    0% { background-position: 0% center; }
                    50% { background-position: 100% center; }
                    100% { background-position: 0% center; }
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
