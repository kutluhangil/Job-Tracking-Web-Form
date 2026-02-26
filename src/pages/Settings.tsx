import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Text, Caption } from '../components/common/Typography';
import { Reveal } from '../components/common/Reveal';

const Settings = () => {
    const user = useAppStore(state => state.user);
    const logout = useAppStore(state => state.logout);
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleWipeData = () => {
        localStorage.removeItem('nextstep-storage');
        window.location.href = '/';
    };

    const handleLogout = () => {
        logout();
        navigate('/welcome');
    };

    return (
        <div className="mx-auto max-w-[900px] px-6 pt-24 pb-48">

            <Reveal direction="down" duration={0.6}>
                <Caption>KİŞİSELLEŞTİRME</Caption>
                <h1 className="mt-1 text-[clamp(28px,4vw,36px)] font-bold tracking-tight text-[#1d1d1f]">
                    Ayarlar
                </h1>
                <Text className="mt-2 max-w-xl text-black/60">
                    Hesap bilgilerinizi, güvenlik tercihlerinizi ve veri ayarlarınızı yönetin.
                </Text>
            </Reveal>

            <div className="mt-12 flex flex-col gap-8">

                {/* Profile Card */}
                <Reveal direction="up" delay={0.1}>
                    <div className="apple-glass-card p-6 sm:p-10 relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-700"></div>
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Hesap Bilgileri</h3>
                            <button className="text-sm font-semibold text-indigo-600 transition-opacity hover:opacity-70 tracking-wide">
                                DÜZENLE
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <div>
                                <label className="text-xs font-semibold text-black/40 uppercase tracking-wider ml-1">İsim</label>
                                <input
                                    type="text"
                                    disabled
                                    value={user?.name?.split(' ')[0] || ''}
                                    className="mt-2 w-full rounded-2xl border border-black/5 bg-[#fbfbfd] px-5 py-4 text-sm font-medium text-black/80 transition-all focus-gradient-ring"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-black/40 uppercase tracking-wider ml-1">Soyisim</label>
                                <input
                                    type="text"
                                    disabled
                                    value={user?.name?.split(' ').slice(1).join(' ') || ''}
                                    className="mt-2 w-full rounded-2xl border border-black/5 bg-[#fbfbfd] px-5 py-4 text-sm font-medium text-black/80 transition-all focus-gradient-ring"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs font-semibold text-black/40 uppercase tracking-wider ml-1">E-posta</label>
                                <input
                                    type="email"
                                    disabled
                                    value={user?.email || ''}
                                    className="mt-2 w-full rounded-2xl border border-black/5 bg-[#fbfbfd] px-5 py-4 text-sm font-medium text-black/80 transition-all focus-gradient-ring"
                                />
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-black/5 flex justify-end relative z-10">
                            <button
                                onClick={handleLogout}
                                className="btn-ghost rounded-full px-8 py-3 text-sm font-semibold text-black/80"
                            >
                                Oturumu Kapat
                            </button>
                        </div>
                    </div>
                </Reveal>

                {/* Security Management */}
                <Reveal direction="up" delay={0.2}>
                    <div className="apple-glass-card p-6 sm:p-10 relative overflow-hidden group">
                        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-700"></div>
                        <h3 className="text-xl font-bold text-emerald-600 mb-6 relative z-10">Güvenlik</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                            <div>
                                <div className="font-semibold text-black">Şifre Değiştir</div>
                                <div className="text-sm text-black/50 mt-1 max-w-sm leading-relaxed">Hesabınızın güvenliğini artırmak için şifrenizi düzenli olarak güncelleyin.</div>
                            </div>
                            <button className="btn-ghost rounded-full px-8 py-3 text-sm font-semibold text-black/80 whitespace-nowrap">
                                Şifreyi Güncelle
                            </button>
                        </div>
                    </div>
                </Reveal>

                {/* Data Management */}
                <Reveal direction="up" delay={0.3}>
                    <div className="apple-glass-card p-6 sm:p-10 border border-rose-500/10 hover:border-rose-500/20 shadow-[0_4px_24px_#ef444410] relative overflow-hidden transition-all duration-500 group">
                        <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-rose-500/10 transition-all duration-700"></div>
                        <h3 className="text-xl font-bold text-rose-600 mb-3 relative z-10">Veri Yönetimi</h3>
                        <Text className="mb-8 max-w-lg text-rose-950/60 font-medium relative z-10">
                            NextStep verilerinizi cihazınızda güvenle saklar. Tüm geçmişi ve başvuruları kalıcı olarak silebilirsiniz. Bu işlem geri alınamaz.
                        </Text>

                        <div className="relative z-10">
                            {!showConfirm ? (
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    className="rounded-full bg-gradient-to-r from-rose-500 to-red-600 px-8 py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(244,63,94,0.3)] shadow-[0_4px_20px_rgba(244,63,94,0.2)]"
                                >
                                    Tüm Verileri Sil
                                </button>
                            ) : (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/60 p-6 rounded-3xl border border-rose-200/60 shadow-sm backdrop-blur-md">
                                    <span className="text-sm font-bold text-rose-600">Bu işlemi geri alamazsınız. Emin misiniz?</span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={handleWipeData}
                                            className="rounded-full bg-rose-600 px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-rose-700 shadow-[0_4px_16px_rgba(225,29,72,0.3)] hover:shadow-[0_8px_24px_rgba(225,29,72,0.4)]"
                                        >
                                            Evet, Sil
                                        </button>
                                        <button
                                            onClick={() => setShowConfirm(false)}
                                            className="btn-ghost rounded-full px-8 py-3.5 text-sm font-bold text-black/70"
                                        >
                                            İptal
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Reveal>

            </div>
        </div>
    );
};

export default Settings;
