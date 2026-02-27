import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Linkedin, Mail, CheckCircle2 } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    lang: 'tr' | 'en';
}

// Helper for the HTML-style typography items
const CodeLine = ({ tag, content, color = '#1a1a1a' }: { tag: string, content: React.ReactNode, color?: string }) => (
    <div style={{ fontFamily: '"SF Mono", "JetBrains Mono", "Fira Code", monospace', fontSize: '13px', lineHeight: 1.6, marginBottom: '6px' }}>
        <span style={{ color: '#a855f7', fontWeight: 600 }}>&lt;{tag}&gt;</span>
        <span style={{ color, marginLeft: '8px', marginRight: '8px' }}>{content}</span>
        <span style={{ color: '#a855f7', fontWeight: 600 }}>&lt;/{tag}&gt;</span>
    </div>
);

export const AboutModal = ({ isOpen, onClose, lang }: Props) => {
    // Escape to close
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
                    {/* Backdrop: Apple glassmorphism style */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed', inset: 0,
                            background: 'rgba(255,255,255,0.4)',
                            backdropFilter: 'blur(20px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(20px)',
                            zIndex: 200,
                        }}
                    />

                    {/* Modal Card */}
                    <div style={{
                        position: 'fixed', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 201, pointerEvents: 'none', padding: '20px'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                            style={{
                                position: 'relative',
                                pointerEvents: 'auto',
                                width: '100%',
                                maxWidth: '720px',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                background: '#ffffff',
                                borderRadius: '32px',
                                // Smooth Apple-like shadow
                                boxShadow: '0 40px 100px -20px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {/* Rainbow Accent Top Border */}
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                                background: 'linear-gradient(90deg, #ff5f57, #febc2e, #28c840, #007aff, #a855f7)',
                                borderTopLeftRadius: '32px', borderTopRightRadius: '32px',
                            }} />

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                style={{
                                    position: 'absolute', top: '16px', right: '16px',
                                    width: '32px', height: '32px',
                                    borderRadius: '50%',
                                    background: '#f5f5f7', // Apple gray
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#86868b', cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    border: 'none',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#e5e5ea'}
                                onMouseLeave={e => e.currentTarget.style.background = '#f5f5f7'}
                            >
                                <X size={16} strokeWidth={2.5} />
                            </button>

                            <div style={{ padding: '48px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

                                {/* Top Section: Avatar & Intro */}
                                <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {/* Spider-Man Avatar */}
                                    <div style={{
                                        width: '120px', height: '120px', flexShrink: 0,
                                        borderRadius: '30px', // Apple squircle logic
                                        overflow: 'hidden',
                                        background: '#f5f5f7',
                                        boxShadow: '0 12px 32px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.05)',
                                    }}>
                                        <img
                                            src="/spiderman-dev.png"
                                            alt="Developer"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>

                                    {/* Greeting */}
                                    <div style={{ flex: 1, minWidth: '240px' }}>
                                        <h2 style={{
                                            fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em',
                                            margin: '0 0 8px 0', color: '#1d1d1f',
                                            display: 'flex', alignItems: 'center', gap: '10px'
                                        }}>
                                            <span style={{
                                                background: 'linear-gradient(135deg, #f97316, #a855f7)',
                                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                            }}>Hello World.</span> 👋
                                        </h2>

                                        <div style={{
                                            fontFamily: '"SF Mono", "JetBrains Mono", "Fira Code", monospace',
                                            fontSize: '14px', lineHeight: 1.6, color: '#515154'
                                        }}>
                                            <span style={{ color: '#22c55e' }}>// Hakkımda</span><br />
                                            {isEn
                                                ? "Hi, I'm Kutluhan. While learning software development, I built this tool to track my own job applications instead of using messy spreadsheets."
                                                : "Merhaba, ben Kutluhan. Yazılım geliştirme öğrenirken iş başvurularımı takip etmek için bu aracı yaptım."
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Link Buttons */}
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    {[
                                        { icon: <Github size={18} />, label: 'GitHub', href: 'https://github.com/kutluhangil', bg: '#1d1d1f', color: '#fff' },
                                        { icon: <Linkedin size={18} />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/kutluhangil/', bg: '#0A66C2', color: '#fff' },
                                        { icon: <Mail size={18} />, label: isEn ? 'Email' : 'E-posta', href: 'mailto:kutluhangil@gmail.com', bg: '#f5f5f7', color: '#1d1d1f' },
                                    ].map(btn => (
                                        <a key={btn.label} href={btn.href} target="_blank" rel="noopener noreferrer"
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                background: btn.bg, color: btn.color,
                                                padding: '10px 20px', borderRadius: '100px',
                                                fontSize: '14px', fontWeight: 600, letterSpacing: '-0.01em',
                                                textDecoration: 'none',
                                                boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.06)';
                                            }}
                                        >
                                            {btn.icon} {btn.label}
                                        </a>
                                    ))}
                                </div>

                                {/* Checklist Section */}
                                <div style={{
                                    background: '#fbfbfd',
                                    borderRadius: '24px',
                                    padding: '32px',
                                    border: '1px solid rgba(0,0,0,0.04)',
                                }}>
                                    <div style={{
                                        fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em',
                                        textTransform: 'uppercase', color: '#86868b', marginBottom: '24px'
                                    }}>
                                        {isEn ? 'Priorities Overview' : 'Neyin Önemi Var?'}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {[
                                            {
                                                title: isEn ? 'Why I built this' : 'Projeyi Neden Yaptım',
                                                tag: 'h1',
                                                desc: isEn ? 'Shows personality and motivation' : 'Seni insan yapar, motivasyonu gösterir.',
                                                badge: isEn ? 'Crucial' : 'Çok Yüksek',
                                                color: '#ff3b30'
                                            },
                                            {
                                                title: 'Links (GitHub, LinkedIn)',
                                                tag: 'a',
                                                desc: isEn ? 'Allows recruiters to reach out' : 'Recruiter\'ın sana ulaşmasını sağlar.',
                                                badge: isEn ? 'High' : 'Yüksek',
                                                color: '#ff9500'
                                            },
                                            {
                                                title: 'Tech Stack',
                                                tag: 'code',
                                                desc: isEn ? 'Shows exactly what you know instantly' : 'Ne bildiğini anında gösterir.',
                                                badge: isEn ? 'High' : 'Yüksek',
                                                color: '#34c759'
                                            },
                                            {
                                                title: isEn ? 'Setup Instructions' : 'Kurulum Talimatları',
                                                tag: 'pre',
                                                desc: isEn ? 'Demonstrates professionalism' : 'Ciddiyeti gösterir.',
                                                badge: isEn ? 'Medium' : 'Orta',
                                                color: '#007aff'
                                            },
                                        ].map((item, i) => (
                                            <div key={i} style={{
                                                display: 'flex', gap: '16px', alignItems: 'flex-start',
                                                paddingBottom: i !== 3 ? '16px' : 0,
                                                borderBottom: i !== 3 ? '1px solid rgba(0,0,0,0.04)' : 'none'
                                            }}>
                                                <div style={{ marginTop: '2px' }}>
                                                    <CheckCircle2 size={20} color={item.color} strokeWidth={2.5} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <CodeLine tag={item.tag} content={item.title} color="#1d1d1f" />
                                                    <div style={{ fontSize: '14px', color: '#86868b', marginTop: '6px', lineHeight: 1.4 }}>
                                                        {item.desc}
                                                    </div>
                                                </div>
                                                <div style={{
                                                    background: `${item.color}15`,
                                                    color: item.color,
                                                    padding: '4px 10px',
                                                    borderRadius: '8px',
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.02em',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {item.badge}
                                                </div>
                                            </div>
                                        ))}
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
