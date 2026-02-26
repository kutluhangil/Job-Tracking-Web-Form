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
                {/* Profile Card */}
                <Reveal direction="up" delay={0.1}>
                    <div className="apple-card p-8 shadow-[0_4px_24px_#00000006]">
                        <div className="flex items-center justify-between mb-8">
                            <H3>Hesap Bilgileri</H3>
                            <button className="text-sm font-semibold text-[#0071e3] transition-opacity hover:opacity-70">
                                Düzenle
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-black/50 ml-1">İsim</label>
                                <input
                                    type="text"
                                    disabled
                                    value={user?.name?.split(' ')[0] || ''}
                                    className="mt-2 w-full rounded-2xl border border-black/10 bg-black/[0.03] px-5 py-3.5 text-sm outline-none text-black/80 font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-black/50 ml-1">Soyisim</label>
                                <input
                                    type="text"
                                    disabled
                                    value={user?.name?.split(' ').slice(1).join(' ') || ''}
                                    className="mt-2 w-full rounded-2xl border border-black/10 bg-black/[0.03] px-5 py-3.5 text-sm outline-none text-black/80 font-medium"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-black/50 ml-1">E-posta</label>
                                <input
                                    type="email"
                                    disabled
                                    value={user?.email || ''}
                                    className="mt-2 w-full rounded-2xl border border-black/10 bg-black/[0.03] px-5 py-3.5 text-sm outline-none text-black/80 font-medium"
                                />
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-black/5 flex justify-end">
                            <button
                                onClick={handleLogout}
                                className="rounded-full bg-black/5 px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black/10"
                            >
                                Oturumu Kapat
                            </button>
                        </div>
                    </div>
                </Reveal>

                {/* Security Management */}
                <Reveal direction="up" delay={0.2}>
                    <div className="apple-card p-8 shadow-[0_4px_24px_#00000006]">
                        <H3 className="mb-6">Güvenlik</H3>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="font-semibold text-black">Şifre Değiştir</div>
                                <div className="text-sm text-black/50 mt-1 max-w-sm">Hesabınızın güvenliğini artırmak için şifrenizi düzenli olarak güncelleyin.</div>
                            </div>
                            <button className="rounded-full bg-black/5 px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black/10 whitespace-nowrap">
                                Şifreyi Güncelle
                            </button>
                        </div>
                    </div>
                </Reveal>

                {/* Data Management */}
                <Reveal direction="up" delay={0.3}>
                    <div className="apple-card p-8 border border-rose-500/20 bg-rose-50/30 shadow-[0_4px_24px_#ef444415]">
                        <H3 className="mb-2 text-rose-600">Veri Yönetimi</H3>
                        <Text className="mb-6 max-w-lg text-rose-950/60 font-medium">
                            NextStep verilerinizi cihazınızda güvenle saklar. Tüm geçmişi ve başvuruları kalıcı olarak silebilirsiniz. Bu işlem geri alınamaz.
                        </Text>

                        {!showConfirm ? (
                            <button
                                onClick={() => setShowConfirm(true)}
                                className="rounded-full bg-rose-500 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/20"
                            >
                                Tüm Verileri Sil
                            </button>
                        ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-rose-50 p-5 rounded-2xl border border-rose-200">
                                <span className="text-sm font-semibold text-rose-800">Bu işlemi geri alamazsınız. Emin misiniz?</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleWipeData}
                                        className="rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
                                    >
                                        Evet, Sil
                                    </button>
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        className="rounded-full bg-black/5 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-black/10"
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
