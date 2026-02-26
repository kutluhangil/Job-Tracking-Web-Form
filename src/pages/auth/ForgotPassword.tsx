import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { H2, Text } from '../../components/common/Typography';
import { CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    const handleSendLink = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Mock sending link
        setTimeout(() => {
            setLoading(false);
            setIsSent(true);
        }, 800);
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Mock password reset
        setTimeout(() => {
            setLoading(false);
            setIsComplete(true);
        }, 800);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-apple-bg)] px-6 py-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
                className="w-full max-w-[440px]"
            >
                <div className="apple-card p-10 md:p-12 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {!isSent && !isComplete && (
                            <motion.div
                                key="step-1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center mb-10">
                                    <H2 className="mb-2">Şifremi Unuttum</H2>
                                    <Text>Hesabınıza ait e-posta adresini girin.</Text>
                                </div>

                                <form onSubmit={handleSendLink} className="flex flex-col gap-6">
                                    <div>
                                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-black/70">
                                            E-posta
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-2xl border border-black/10 bg-black/5 px-4 py-3.5 text-black outline-none transition-all placeholder:text-black/30 focus:border-[#0071e3] focus:bg-white focus:ring-4 focus:ring-[#0071e3]/10"
                                            placeholder="ornek@email.com"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !email}
                                        className="mt-2 w-full rounded-full bg-black py-4 text-base font-medium text-white transition-all hover:bg-black/80 disabled:opacity-50"
                                    >
                                        {loading ? 'Gönderiliyor...' : 'Devam Et'}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {isSent && !isComplete && (
                            <motion.div
                                key="step-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center mb-10">
                                    <H2 className="mb-2">Yeni Şifre Belirle</H2>
                                    <Text>{email} hesabı için yeni şifrenizi giriniz.</Text>
                                </div>

                                <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
                                    <div>
                                        <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-black/70">
                                            Yeni Şifre
                                        </label>
                                        <input
                                            id="newPassword"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full rounded-2xl border border-black/10 bg-black/5 px-4 py-3.5 text-black outline-none transition-all placeholder:text-black/30 focus:border-[#0071e3] focus:bg-white focus:ring-4 focus:ring-[#0071e3]/10"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || newPassword.length < 6}
                                        className="mt-2 w-full rounded-full bg-[#0071e3] py-4 text-base font-medium text-white transition-all hover:bg-[#0077ed] hover:shadow-lg disabled:opacity-50"
                                    >
                                        {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {isComplete && (
                            <motion.div
                                key="step-3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col items-center justify-center text-center py-8"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                                    className="mb-6 rounded-full bg-emerald-500/10 p-4 text-emerald-500"
                                >
                                    <CheckCircle2 size={48} />
                                </motion.div>
                                <H2 className="mb-2">Şifre Değiştirildi</H2>
                                <Text className="mb-8">Yeni şifrenizle hemen giriş yapabilirsiniz.</Text>

                                <Link
                                    to="/login"
                                    className="w-full rounded-full bg-black py-4 text-base font-medium text-white transition-all hover:bg-black/80 inline-block text-center"
                                >
                                    Giriş Yap
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isComplete && (
                        <div className="mt-8 text-center text-sm text-black/60">
                            <Link to="/login" className="font-medium text-black hover:underline">
                                Giriş sayfasına dön
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
