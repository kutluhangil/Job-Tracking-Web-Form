import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Linkedin, Mail } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    lang: 'tr' | 'en';
}

// Individual chalk-typed line with reveal animation
const ChalkLine = ({
    children,
    delay = 0,
    color = '#f5f0d8',
    indent = 0,
}: {
    children: React.ReactNode;
    delay?: number;
    color?: string;
    indent?: number;
}) => (
    <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.35, ease: 'easeOut' }}
        style={{
            color,
            paddingLeft: indent * 20,
            lineHeight: 1.9,
            textShadow: '0 0 8px rgba(255,255,255,0.12)',
        }}
    >
        {children}
    </motion.div>
);

// Syntax-highlight helpers
const Tag = ({ t }: { t: string }) => (
    <span style={{ color: '#fb923c' }}>{t}</span>          // orange — html tags
);
const Attr = ({ t }: { t: string }) => (
    <span style={{ color: '#86efac' }}>{t}</span>          // green — attribute / key
);
const Val = ({ t }: { t: string }) => (
    <span style={{ color: '#e2e8f0' }}>{t}</span>          // white — values
);
const Comment = ({ t }: { t: string }) => (
    <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>{t}</span>
);

export const AboutModal = ({ isOpen, onClose, lang }: Props) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setShow(true), 50);
        } else {
            setShow(false);
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [onClose]);

    const isEn = lang === 'en';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed', inset: 0,
                            background: 'rgba(0,0,0,0.65)',
                            backdropFilter: 'blur(6px)',
                            zIndex: 200,
                        }}
                    />

                    {/* Chalkboard panel */}
                    <motion.div
                        key="board"
                        initial={{ opacity: 0, scale: 0.88, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.88, y: 40 }}
                        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            margin: 'auto',
                            width: '92vw',
                            maxWidth: 900,
                            height: 'fit-content',
                            maxHeight: '92vh',
                            zIndex: 201,
                            overflowY: 'auto',
                            borderRadius: 20,
                            // Chalkboard: dark green + wood frame
                            background: '#1d3d22',
                            boxShadow: `
                                0 0 0 12px #5c3a1e,
                                0 0 0 16px #3a2410,
                                0 40px 120px rgba(0,0,0,0.6)
                            `,
                            // Chalk dust texture via CSS noise
                            backgroundImage: `
                                radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.015) 0%, transparent 60%),
                                radial-gradient(ellipse at 80% 70%, rgba(255,255,255,0.012) 0%, transparent 50%),
                                repeating-linear-gradient(
                                    0deg,
                                    transparent,
                                    transparent 2px,
                                    rgba(255,255,255,0.008) 2px,
                                    rgba(255,255,255,0.008) 4px
                                )
                            `,
                        }}
                    >
                        {/* Close */}
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute', top: 16, right: 16,
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                color: '#f5f0d8',
                                borderRadius: '50%',
                                width: 36, height: 36,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                                zIndex: 10,
                            }}
                        >
                            <X size={18} />
                        </button>

                        <div style={{ padding: '36px 40px 40px', display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>

                            {/* ── LEFT: Spider-Man + social links ── */}
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, duration: 0.5 }}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, minWidth: 160 }}
                            >
                                {/* Spider-Man sticker — emoji art fallback using SVG */}
                                <div style={{
                                    width: 140, height: 140,
                                    borderRadius: '50%',
                                    background: 'radial-gradient(circle at 40% 35%, #dc2626, #7f1d1d)',
                                    border: '4px solid rgba(255,255,255,0.12)',
                                    boxShadow: '0 8px 40px rgba(220,38,38,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 72,
                                    cursor: 'default',
                                    userSelect: 'none',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}>
                                    <img
                                        src="/spiderman-dev.png"
                                        alt="Spider-Man Web Developer"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                        onError={(e) => {
                                            // Fallback if image not found
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            (e.target as HTMLImageElement).parentElement!.innerHTML = '🕷️';
                                        }}
                                    />
                                </div>

                                {/* Name on "chalk" */}
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#f5f0d8', fontFamily: 'monospace', fontWeight: 700, fontSize: 16, textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
                                        Kutluhan Gül
                                    </div>
                                    <div style={{ color: '#86efac', fontFamily: 'monospace', fontSize: 11, marginTop: 2 }}>
                                        {isEn ? 'Full Stack Dev' : 'Full Stack Geliştirici'}
                                    </div>
                                </div>

                                {/* Social links */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                                    {[
                                        { icon: <Github size={14} />, label: 'GitHub', href: 'https://github.com/kutluhangil', color: '#e2e8f0' },
                                        { icon: <Linkedin size={14} />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/kutluhangil/', color: '#60a5fa' },
                                        { icon: <Mail size={14} />, label: 'E-posta', href: 'mailto:kutluhangil@gmail.com', color: '#f97316' },
                                    ].map(link => (
                                        <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 8,
                                                color: link.color,
                                                background: 'rgba(255,255,255,0.06)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: 8,
                                                padding: '7px 12px',
                                                fontFamily: 'monospace',
                                                fontSize: 12,
                                                fontWeight: 600,
                                                textDecoration: 'none',
                                                transition: 'background 0.2s',
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                                        >
                                            {link.icon} {link.label}
                                        </a>
                                    ))}
                                </div>
                            </motion.div>

                            {/* ── RIGHT: Code block on chalkboard ── */}
                            {show && (
                                <div style={{
                                    flex: 1,
                                    fontFamily: '"Courier New", "Consolas", "JetBrains Mono", monospace',
                                    fontSize: 13,
                                    lineHeight: 1,
                                    minWidth: 260,
                                }}>
                                    {/* top chalk tray decoration */}
                                    <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, marginBottom: 20 }} />

                                    <ChalkLine delay={0.1}><Tag t="<about>" /></ChalkLine>
                                    <ChalkLine delay={0.2} indent={1}><Tag t="<developer" /></ChalkLine>
                                    <ChalkLine delay={0.3} indent={2}>
                                        <Attr t={isEn ? 'name' : 'isim'} /><Val t={'="Kutluhan Gül"'} />
                                    </ChalkLine>
                                    <ChalkLine delay={0.4} indent={2}>
                                        <Attr t={isEn ? 'role' : 'rol'} /><Val t={'="Full Stack Developer"'} />
                                    </ChalkLine>
                                    <ChalkLine delay={0.5} indent={1}><Tag t=">" /></ChalkLine>

                                    <ChalkLine delay={0.6} indent={0}>&nbsp;</ChalkLine>

                                    <ChalkLine delay={0.65} indent={2}>
                                        <Comment t={isEn
                                            ? '// why I built this'
                                            : '// neden yaptım'} />
                                    </ChalkLine>
                                    <ChalkLine delay={0.75} indent={2}><Tag t="<story>" /></ChalkLine>
                                    <ChalkLine delay={0.85} indent={3} color="#e2e8f0">
                                        {isEn
                                            ? 'Job hunting = Excel chaos.'
                                            : 'İş başvurusu = Excel kaos.'}
                                    </ChalkLine>
                                    <ChalkLine delay={0.95} indent={3} color="#e2e8f0">
                                        {isEn
                                            ? 'I needed one screen for everything.'
                                            : 'Her şey için tek ekran istedim.'}
                                    </ChalkLine>
                                    <ChalkLine delay={1.05} indent={3} color="#e2e8f0">
                                        {isEn
                                            ? 'So I built it myself.'
                                            : 'Oturup kendim yaptım.'}
                                    </ChalkLine>
                                    <ChalkLine delay={1.15} indent={2}><Tag t="</story>" /></ChalkLine>

                                    <ChalkLine delay={1.2} indent={0}>&nbsp;</ChalkLine>

                                    <ChalkLine delay={1.25} indent={2}>
                                        <Comment t={isEn ? '// stack' : '// teknolojiler'} />
                                    </ChalkLine>
                                    <ChalkLine delay={1.35} indent={2}><Tag t="<stack>" /></ChalkLine>
                                    {[
                                        ['frontend', 'React 18 + TypeScript + Vite'],
                                        ['style', 'Tailwind CSS + Framer Motion'],
                                        ['backend', 'Firebase Auth + Firestore'],
                                        ['ai', 'Google Gemini 1.5 Flash API'],
                                        ['export', 'xlsx + jsPDF + Recharts'],
                                    ].map(([k, v], i) => (
                                        <ChalkLine key={k} delay={1.4 + i * 0.1} indent={3}>
                                            <Attr t={k} /><Val t={`="${v}"`} />
                                        </ChalkLine>
                                    ))}
                                    <ChalkLine delay={1.9} indent={2}><Tag t="</stack>" /></ChalkLine>

                                    <ChalkLine delay={1.95} indent={0}>&nbsp;</ChalkLine>

                                    <ChalkLine delay={2.0} indent={2}>
                                        <Comment t={isEn ? '// hardest part' : '// en zorlu kısım'} />
                                    </ChalkLine>
                                    <ChalkLine delay={2.1} indent={2}><Tag t="<challenge>" /></ChalkLine>
                                    <ChalkLine delay={2.2} indent={3} color="#e2e8f0">
                                        {isEn
                                            ? 'Firestore security rules + real-time'
                                            : 'Firestore güvenlik kuralları + real-time'}
                                    </ChalkLine>
                                    <ChalkLine delay={2.3} indent={3} color="#e2e8f0">
                                        {isEn
                                            ? 'scramble animation without layout shift'
                                            : 'scramble animasyonu layout kaydırmadan'}
                                    </ChalkLine>
                                    <ChalkLine delay={2.4} indent={2}><Tag t="</challenge>" /></ChalkLine>

                                    <ChalkLine delay={2.45} indent={0}>&nbsp;</ChalkLine>

                                    <ChalkLine delay={2.5} indent={1}><Tag t="</developer>" /></ChalkLine>
                                    <ChalkLine delay={2.6}><Tag t="</about>" /></ChalkLine>

                                    {/* blinking cursor */}
                                    <motion.div
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: 2.7 }}
                                        style={{
                                            display: 'inline-block',
                                            width: 9, height: 18,
                                            background: '#f5f0d8',
                                            borderRadius: 1,
                                            marginTop: 8,
                                            marginLeft: 2,
                                            verticalAlign: 'middle',
                                            opacity: 0,
                                        }}
                                    />

                                    {/* bottom chalk tray */}
                                    <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, marginTop: 20 }} />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
