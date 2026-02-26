import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Menu, X } from 'lucide-react';
import NextLogo from '../icons/NEXT.svg';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isAuthenticated = useAppStore(state => state.isAuthenticated);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-black/5 py-3' : 'bg-transparent py-5'
                    }`}
            >
                <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold tracking-tighter text-black flex items-center gap-[10px] group">
                        <img
                            src={NextLogo}
                            alt="NextStep Logo"
                            className="h-8 transition-transform duration-300 group-hover:scale-105"
                        />
                        NextStep
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {isAuthenticated ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="text-sm font-medium text-black hover:text-black/70 transition-colors"
                            >
                                Dashboard'a Git
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-sm font-medium text-black hover:text-black/70 transition-colors"
                                >
                                    Giriş Yap
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-transform hover:scale-105"
                                >
                                    Kayıt Ol
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-black"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                            className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-50 md:hidden shadow-2xl flex flex-col"
                        >
                            <div className="p-6 flex justify-end">
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-black bg-black/5 rounded-full hover:bg-black/10 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-4 px-6 mt-8">
                                {isAuthenticated ? (
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            navigate('/dashboard');
                                        }}
                                        className="w-full text-left py-4 text-lg font-medium text-black border-b border-black/5"
                                    >
                                        Dashboard'a Git
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                navigate('/login');
                                            }}
                                            className="w-full text-left py-4 text-lg font-medium text-black border-b border-black/5"
                                        >
                                            Giriş Yap
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                navigate('/register');
                                            }}
                                            className="w-full mt-4 rounded-xl bg-black py-4 text-base font-medium text-white text-center"
                                        >
                                            Kayıt Ol
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
