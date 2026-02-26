import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { H2, Text } from '../../components/common/Typography';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useAppStore(state => state.login);
    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Mock registration logic
        setTimeout(() => {
            login(`${firstName} ${lastName}`.trim());
            setLoading(false);
            navigate('/dashboard');
        }, 600);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-apple-bg)] px-6 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
                className="w-full max-w-[440px]"
            >
                <div className="apple-card p-10 md:p-12">
                    <div className="text-center mb-10">
                        <H2 className="mb-2">Kayıt Ol</H2>
                        <Text>NextStep ile süreci başlatın.</Text>
                    </div>

                    <form onSubmit={handleRegister} className="flex flex-col gap-5">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-black/70">
                                    İsim
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full rounded-2xl border border-black/10 bg-black/5 px-4 py-3.5 text-black outline-none transition-all placeholder:text-black/30 focus:border-[#0071e3] focus:bg-white focus:ring-4 focus:ring-[#0071e3]/10"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-black/70">
                                    Soyisim
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full rounded-2xl border border-black/10 bg-black/5 px-4 py-3.5 text-black outline-none transition-all placeholder:text-black/30 focus:border-[#0071e3] focus:bg-white focus:ring-4 focus:ring-[#0071e3]/10"
                                    required
                                />
                            </div>
                        </div>

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

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-black/70">
                                Şifre
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-2xl border border-black/10 bg-black/5 px-4 py-3.5 text-black outline-none transition-all placeholder:text-black/30 focus:border-[#0071e3] focus:bg-white focus:ring-4 focus:ring-[#0071e3]/10"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email || !password || !firstName}
                            className="mt-6 w-full rounded-full bg-black py-4 text-base font-medium text-white transition-all hover:bg-black/80 disabled:opacity-50"
                        >
                            {loading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-black/60">
                        Zaten hesabın var mı?{' '}
                        <Link to="/login" className="font-medium text-black hover:underline">
                            Giriş Yap
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
