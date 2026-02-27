import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Linkedin, Mail, Zap, Globe, Layers, CheckCircle } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

// Typing effect components
const TypingText = ({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) => {
    return (
        <motion.p
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.015, delayChildren: delay } },
                hidden: {},
            }}
            className={className}
        >
            {text.split('').map((char, index) => (
                <motion.span
                    key={index}
                    variants={{
                        hidden: { opacity: 0, y: 5 },
                        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.p>
    );
};

// Code line component for Tech Stack
const CodeLine = ({ tag, text, delay = 0 }: { tag: string; text: string; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="font-mono text-[13px] sm:text-[14px] leading-relaxed flex items-start sm:items-center gap-2"
    >
        <span className="text-orange-400 font-medium opacity-80">&lt;{tag}&gt;</span>
        <span className="text-gray-300 font-medium tracking-wide">{text}</span>
        <span className="text-orange-400 font-medium opacity-80">&lt;/{tag}&gt;</span>
    </motion.div>
);

// Animated floating note
const Note = ({ text, delay, icon: Icon }: { text: string; delay: number; icon: any }) => (
    <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] shadow-lg backdrop-blur-md"
    >
        <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center">
            <Icon size={16} className="text-gray-400" />
        </div>
        <span className="text-sm font-medium text-gray-300 tracking-wide">{text}</span>
    </motion.div>
);

// Dashboard-style insight card
const InsightCard = ({ title, desc, delay, icon: Icon, colorClass }: { title: string; desc: string; delay: number; icon: any; colorClass: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col gap-2 p-5 rounded-[24px] bg-[#1c1c1e] border border-white/[0.04] hover:bg-[#2c2c2e] transition-colors duration-300"
    >
        <div className="flex items-center gap-3 mb-1">
            <div className={`p-2 rounded-xl bg-white/[0.03] ${colorClass}`}>
                <Icon size={18} strokeWidth={2.5} />
            </div>
            <h4 className="text-[13px] font-bold tracking-wider uppercase text-gray-400">{title}</h4>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed font-medium">{desc}</p>
    </motion.div>
);

export const AboutModal = ({ isOpen, onClose }: Props) => {
    // ESC listener
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Reference for scrolling animation control if needed, but since it's a modal, we animate on mount
    const containerRef = useRef(null);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        onClick={onClose}
                        className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-2xl"
                    />

                    {/* Modal Wrapper */}
                    <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 sm:p-6 md:p-12 pointer-events-none overflow-y-auto">

                        <motion.div
                            ref={containerRef}
                            initial={{ opacity: 0, y: 40, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                            transition={{ duration: 0.6, type: 'spring', bounce: 0, damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-[900px] pointer-events-auto rounded-[32px] sm:rounded-[40px] overflow-hidden my-auto"
                            style={{
                                // Premium dark matte board style
                                background: 'radial-gradient(120% 120% at 50% -20%, #2A2A2E 0%, #151516 100%)',
                                boxShadow: '0 40px 100px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
                            }}
                        >
                            {/* Subtle Rainbow Accent Line */}
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#ff5f57] via-[#febc2e] to-[#28c840] opacity-80" />

                            {/* Subtle Dust / Grain Overlay */}
                            <div
                                className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
                            />

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-5 right-5 sm:top-7 sm:right-7 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 z-10"
                            >
                                <X size={20} />
                            </button>

                            {/* Content Inner Container */}
                            <div className="relative z-10 p-8 sm:p-12 md:p-[72px] flex flex-col gap-16">

                                {/* ── Header / Intro ── */}
                                <div className="flex flex-col md:flex-row gap-8 sm:gap-12 items-start">
                                    {/* Spiderman Avatar */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        transition={{ duration: 0.7, type: 'spring', bounce: 0.4 }}
                                        className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] shrink-0 rounded-[32px] overflow-hidden bg-[#1c1c1e] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                                    >
                                        <img src="/spiderman.png" alt="Developer" className="w-full h-full object-cover" />
                                    </motion.div>

                                    <div className="flex-1 space-y-5">
                                        <motion.h2
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                                            className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3"
                                        >
                                            <span className="opacity-40 font-mono text-[18px]">##</span>
                                            👤 Hakkımda
                                        </motion.h2>

                                        <div className="text-[16px] sm:text-[17px] text-gray-300 leading-relaxed font-medium tracking-wide space-y-4">
                                            <TypingText text="Merhaba, ben Kutluhan." delay={0.4} />
                                            <TypingText text="Yazılım geliştirmeyi öğrenirken iş başvurularımı sistemli takip edebilmek için NextStep'i geliştirdim." delay={1.0} />
                                            <TypingText text="Bu proje sadece bir takip aracı değil; disiplin, analiz ve gelişim sürecimin bir yansıması." delay={2.5} className="text-gray-400" />
                                        </div>
                                    </div>
                                </div>


                                {/* ── Main Content Split ── */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

                                    {/* Left Column: Tech Stack & Notes */}
                                    <div className="lg:col-span-5 flex flex-col gap-10">

                                        {/* Tech Stack Code Block */}
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-[28px] blur-lg opacity-0 group-hover:opacity-100 transition duration-700" />
                                            <div className="relative bg-[#111112] border border-white/10 rounded-[24px] p-6 sm:p-8 shadow-2xl overflow-hidden">
                                                {/* MacOS Window Dots */}
                                                <div className="flex gap-2 mb-6">
                                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    <CodeLine tag="stack" text="" delay={3.5} />
                                                    <div className="pl-6 flex flex-col gap-3 border-l border-white/5 ml-3 my-1">
                                                        <CodeLine tag="frontend" text="React + Vite" delay={3.7} />
                                                        <CodeLine tag="backend" text="Firebase" delay={3.9} />
                                                        <CodeLine tag="database" text="Firestore" delay={4.1} />
                                                        <CodeLine tag="ui" text="Tailwind + Motion" delay={4.3} />
                                                    </div>
                                                    <CodeLine tag="stack" text="" delay={4.5} />
                                                </div>

                                                {/* Blinking Cursor */}
                                                <motion.div
                                                    animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                                                    className="w-[8px] h-[18px] bg-orange-400 mt-4 ml-1 rounded-[1px]"
                                                />
                                            </div>
                                        </div>

                                        {/* Animated Notes */}
                                        <div className="flex flex-col gap-3">
                                            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 px-2">Kazanımlar</div>
                                            <Note delay={4.6} icon={CheckCircle} text="Motivasyon" />
                                            <Note delay={4.8} icon={Layers} text="Sistematik düşünme" />
                                            <Note delay={5.0} icon={Zap} text="Süreç analizi" />
                                            <Note delay={5.2} icon={Globe} text="Gelişim takibi" />
                                        </div>

                                    </div>

                                    {/* Right Column: Insights Panel */}
                                    <div className="lg:col-span-7 flex flex-col w-full">
                                        <motion.div
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.6, duration: 1 }}
                                            className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-5 px-2"
                                        >
                                            Proje Değeri
                                        </motion.div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <InsightCard
                                                delay={3.8}
                                                title="Why I built this"
                                                desc="Gerçek bir problemi çözmek için yola çıktım. Bu araç, pratik bir ihtiyacın ve kişisel motivasyonun kodlanmış halidir."
                                                icon={Zap}
                                                colorClass="text-orange-400"
                                            />
                                            <InsightCard
                                                delay={4.0}
                                                title="Target Structure"
                                                desc="Karmaşık bir mimariyi minimal bir UI altında sunarak, işlevsellikten ödün vermeden sadeliği hedefledim."
                                                icon={Layers}
                                                colorClass="text-purple-400"
                                            />
                                            <InsightCard
                                                delay={4.2}
                                                title="Tech Precision"
                                                desc="Kullanılan teknolojiler rastgele değil; hızı, güvenliği ve ölçeklenebilirliği sağlamak için özel olarak seçildi."
                                                icon={CheckCircle}
                                                colorClass="text-green-400"
                                            />
                                            <InsightCard
                                                delay={4.4}
                                                title="The Outcome"
                                                desc="Sadece başvuruları değil, kendi kariyer stratejimi ve yazılım geliştirme disiplinimi de yönetebiliyorum."
                                                icon={Globe}
                                                colorClass="text-blue-400"
                                            />
                                        </div>

                                        {/* Premium Glowing Links */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 5.4, duration: 0.6 }}
                                            className="mt-12 flex flex-wrap gap-4 items-center"
                                        >
                                            <a href="https://github.com/kutluhangil" target="_blank" rel="noopener noreferrer" className="group relative">
                                                <div className="absolute inset-0 bg-white/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition duration-300" />
                                                <div className="relative flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-all duration-300">
                                                    <Github size={18} /><span>GitHub</span>
                                                </div>
                                            </a>

                                            <a href="https://www.linkedin.com/in/kutluhangil/" target="_blank" rel="noopener noreferrer" className="group relative">
                                                <div className="absolute inset-0 bg-[#0A66C2]/40 blur-md rounded-full opacity-0 group-hover:opacity-100 transition duration-300" />
                                                <div className="relative flex items-center gap-2 px-6 py-3 bg-[#0A66C2] text-white font-semibold rounded-full border border-white/10 hover:scale-105 transition-all duration-300">
                                                    <Linkedin size={18} /><span>LinkedIn</span>
                                                </div>
                                            </a>

                                            <a href="mailto:kutluhangul@windowslive.com" className="group relative">
                                                <div className="absolute inset-0 bg-white/10 blur-md rounded-full opacity-0 group-hover:opacity-100 transition duration-300" />
                                                <div className="relative flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300">
                                                    <Mail size={18} /><span>İletişime Geç</span>
                                                </div>
                                            </a>
                                        </motion.div>

                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
