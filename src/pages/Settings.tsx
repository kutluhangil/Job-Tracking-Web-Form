import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { H2, Text, Caption, H3 } from '../components/common/Typography';
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
        <div className="mx-auto max-w-[800px] px-6 pt-24 pb-48">

            <Reveal direction="down" duration={0.6}>
                <Caption>Kişiselleştirme</Caption>
                <H2 className="mt-1">Ayarlar</H2>
            </Reveal>

            <div className="mt-16 flex flex-col gap-8">

                {/* Profile Card */}
                <Reveal direction="up" delay={0.1}>
                    <div className="apple-card p-8">
                        <H3 className="mb-6">Hesap Bilgileri</H3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-medium text-black/50">İsim</label>
                                <div className="mt-1 text-lg font-medium text-black">{user?.name}</div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-black/50">E-posta</label>
                                <div className="mt-1 text-lg font-medium text-black">{user?.email}</div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-black/5 flex justify-end">
                                <button
                                    onClick={handleLogout}
                                    className="rounded-full bg-black/5 px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black/10"
                                >
                                    Oturumu Kapat
                                </button>
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Data Management */}
                <Reveal direction="up" delay={0.2}>
                    <div className="apple-card p-8 border-rose-500/20">
                        <H3 className="mb-2 text-rose-600">Veri Yönetimi</H3>
                        <Text className="mb-6 max-w-lg">
                            MİNO verilerinizi cihazınızda güvenle saklar. Tüm geçmişi ve başvuruları kalıcı olarak silebilirsiniz.
                        </Text>

                        {!showConfirm ? (
                            <button
                                onClick={() => setShowConfirm(true)}
                                className="rounded-full bg-rose-500 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 shadow-sm shadow-rose-500/20"
                            >
                                Tüm Verileri Sil
                            </button>
                        ) : (
                            <div className="flex items-center gap-4 bg-rose-50 p-4 rounded-2xl border border-rose-100">
                                <span className="text-sm font-medium text-rose-800">Emin misiniz? Geri alınamaz.</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleWipeData}
                                        className="rounded-full bg-rose-600 px-4 py-2 text-xs font-medium text-white hover:bg-rose-700"
                                    >
                                        Evet, Sil
                                    </button>
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        className="rounded-full bg-black/5 px-4 py-2 text-xs font-medium text-black hover:bg-black/10"
                                    >
                                        İptal
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </Reveal>

            </div>
        </div>
    );
};

export default Settings;
