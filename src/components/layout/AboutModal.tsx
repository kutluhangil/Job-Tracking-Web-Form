import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Linkedin, Mail, CheckCircle2 } from 'lucide-react';

// Assuming spiderman.svg is in the icons folder like NEXT.svg
import SpidermanIcon from '../Icons/spiderman.svg';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

// Minimal bone-white design constants matching LandingPage
const BONE = '#faf9f6';
const BONE_MUTED = '#f0ede8';
const INK = '#1a1a1a';
const BORDER = 'rgba(26, 26, 26, 0.08)';

const FONT_SANS = '-apple-system, "SF Pro Display", "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
const FONT_MONO = '"SF Mono", "JetBrains Mono", "Fira Code", monospace';

// Animated typing text
const FadeText = ({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) => {
    return (
        <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className={className}
        >
            {text}
        </motion.p>
    );
};

// Simple HTML-like Code line for Tech Stack
const TagLine = ({ tag, text, delay = 0 }: { tag: string; text: string; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.5, ease: 'easeOut' }}
        style={{ fontFamily: FONT_MONO, fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}
    >
        <span style={{ color: '#0ea5e9', fontWeight: 500 }}>&lt;{tag}&gt;</span>
        <span style={{ color: INK, fontWeight: 500 }}>{text}</span>
        <span style={{ color: '#0ea5e9', fontWeight: 500 }}>&lt;/{tag}&gt;</span>
    </motion.div>
);

export const AboutModal = ({ isOpen, onClose }: Props) => {
    // ESC listener
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop: Clean glass blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed', inset: 0,
                            background: 'rgba(250, 249, 246, 0.6)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            zIndex: 200,
                        }}
                    />

                    {/* Modal Wrapper */}
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 201, pointerEvents: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '20px', fontFamily: FONT_SANS
                    }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                            transition={{ duration: 0.6, type: 'spring', bounce: 0, damping: 25, stiffness: 200 }}
                            style={{
                                pointerEvents: 'auto',
                                width: '100%',
                                maxWidth: '840px',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                background: BONE,
                                borderRadius: '32px',
                                // Light, elegant Apple shadow
                                boxShadow: '0 40px 100px -20px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)',
                                border: '1px solid ' + BORDER,
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative'
                            }}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                style={{
                                    position: 'absolute', top: '24px', right: '24px', zIndex: 10,
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    background: BONE_MUTED, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: INK, border: 'none', cursor: 'pointer', transition: 'background 0.2s',
                                    opacity: 0.6,
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                            >
                                <X size={18} strokeWidth={2} />
                            </button>

                            <div style={{ padding: '48px', display: 'flex', flexDirection: 'column', gap: '48px' }}>

                                {/* ── Header / Intro ── */}
                                <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                                    {/* Spiderman SVG Avatar */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        style={{
                                            width: '100px', height: '100px', flexShrink: 0,
                                            borderRadius: '24px',
                                            background: '#ffffff',
                                            border: `1px solid ${BORDER}`,
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <img src={SpidermanIcon} alt="Spider-Man" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </motion.div>

                                    <div style={{ flex: 1, minWidth: '240px' }}>
                                        <motion.h2
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
                                            style={{
                                                fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em',
                                                margin: '0 0 16px 0', color: INK,
                                                display: 'flex', alignItems: 'center', gap: '8px'
                                            }}
                                        >
                                            <span style={{ opacity: 0.4, fontWeight: 500, fontFamily: FONT_MONO, fontSize: '20px' }}>##</span>
                                            👤 Hakkımda
                                        </motion.h2>

                                        <div style={{ fontSize: '16px', lineHeight: 1.6, color: INK, opacity: 0.8, display: 'flex', flexDirection: 'column', gap: '12px', fontWeight: 400 }}>
                                            <FadeText text="Merhaba, ben Kutluhan." delay={0.2} />
                                            <FadeText text="Yazılım geliştirmeyi öğrenirken iş başvurularımı sistemli takip edebilmek için NextStep’i geliştirdim." delay={0.4} />
                                            <FadeText text="Bu proje sadece bir takip aracı değil; disiplin, analiz ve gelişim sürecimin bir yansıması." delay={0.6} />
                                        </div>
                                    </div>
                                </div>


                                {/* ── Two Column Content ── */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>

                                    {/* Left: Code Block & Notes */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                                        {/* Tech Stack Code Block (Minimal Light Version) */}
                                        <div style={{
                                            background: '#ffffff', border: `1px solid ${BORDER}`,
                                            borderRadius: '20px', padding: '24px',
                                            boxShadow: '0 12px 32px rgba(0,0,0,0.03)'
                                        }}>
                                            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57', opacity: 0.8 }} />
                                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e', opacity: 0.8 }} />
                                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840', opacity: 0.8 }} />
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <TagLine tag="stack" text="" delay={0.8} />
                                                <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: `1px solid ${BONE_MUTED}`, margin: '4px 0 4px 10px' }}>
                                                    <TagLine tag="frontend" text="React + Vite" delay={0.9} />
                                                    <TagLine tag="backend" text="Firebase" delay={1.0} />
                                                    <TagLine tag="database" text="Firestore" delay={1.1} />
                                                    <TagLine tag="ui" text="Tailwind + Motion" delay={1.2} />
                                                </div>
                                                <TagLine tag="stack" text="" delay={1.3} />
                                            </div>
                                        </div>

                                        {/* Minimal Notes List */}
                                        <div>
                                            <div style={{ fontSize: '11px', fontWeight: 600, color: INK, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                                                Kazanımlar
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {[
                                                    "Motivasyon",
                                                    "Sistematik düşünme",
                                                    "Süreç analizi",
                                                    "Gelişim takibi"
                                                ].map((note, i) => (
                                                    <motion.div
                                                        key={note}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 1.4 + (i * 0.1), duration: 0.5 }}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: INK, fontWeight: 500 }}
                                                    >
                                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: INK, opacity: 0.2 }} />
                                                        <span>{note}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Insights & Links */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                                        {/* Insight Panels */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {[
                                                { title: 'Why I built this', desc: 'Gerçek bir problemi çözmek için yola çıktım. Bu araç, pratik bir ihtiyacın ve kişisel motivasyonun kodlanmış halidir.' },
                                                { title: 'Connection matters', desc: 'Sadece kod yazmak yetmez, iletişim kurabilmek de önemli. Bu yüzden beni GitHub ve LinkedIn üzerinden inceleyebilirsiniz.' },
                                                { title: 'Choosing the stack', desc: 'Kullanılan teknolojiler modern web standartlarını, performansı ve ölçeklenebilirliği sağlamak için özel olarak seçildi.' },
                                                { title: 'Professional setup', desc: 'Kurulum talimatları ve dokümantasyon, koda duyduğum saygının ve ciddiyetin bir göstergesidir.' },
                                            ].map((item, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 + (i * 0.15), duration: 0.5 }}
                                                    style={{
                                                        background: '#ffffff',
                                                        border: `1px solid ${BORDER}`,
                                                        borderRadius: '16px',
                                                        padding: '20px',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                        <CheckCircle2 size={16} strokeWidth={2.5} style={{ color: INK, opacity: 0.4 }} />
                                                        <div style={{ fontSize: '13px', fontWeight: 600, color: INK, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.title}</div>
                                                    </div>
                                                    <div style={{ fontSize: '14px', color: INK, opacity: 0.7, lineHeight: 1.5 }}>
                                                        {item.desc}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                    </div>
                                </div>

                                {/* Premium Link Buttons Array */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.6 }}
                                    style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px', paddingTop: '32px', borderTop: `1px solid ${BORDER}` }}
                                >
                                    <a href="https://github.com/kutluhangil" target="_blank" rel="noopener noreferrer"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            padding: '12px 24px', borderRadius: '100px',
                                            background: INK, color: '#fff', fontSize: '14px', fontWeight: 600,
                                            boxShadow: '0 8px 24px rgba(26,26,26,0.2)',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,26,26,0.3)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,26,26,0.2)'; }}
                                        >
                                            <Github size={18} /><span>GitHub</span>
                                        </div>
                                    </a>

                                    <a href="https://www.linkedin.com/in/kutluhangil/" target="_blank" rel="noopener noreferrer"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            padding: '12px 24px', borderRadius: '100px',
                                            background: '#0A66C2', color: '#fff', fontSize: '14px', fontWeight: 600,
                                            boxShadow: '0 8px 24px rgba(10,102,194,0.3)',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(10,102,194,0.4)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(10,102,194,0.3)'; }}
                                        >
                                            <Linkedin size={18} /><span>LinkedIn</span>
                                        </div>
                                    </a>

                                    <a href="mailto:kutluhangil@gmail.com"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            padding: '12px 24px', borderRadius: '100px',
                                            background: '#fff', border: `1px solid ${BORDER}`, color: INK, fontSize: '14px', fontWeight: 600,
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.04)'; }}
                                        >
                                            <Mail size={18} /><span>İletişime Geç</span>
                                        </div>
                                    </a>
                                </motion.div>

                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
