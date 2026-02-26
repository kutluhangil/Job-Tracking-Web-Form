import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import emailjs from '@emailjs/browser';
import { useLanguage } from '../lib/i18n';


const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: 'easeOut' as const }
});

type Theme = 'light' | 'system';

const Settings = () => {
    const user = useAppStore(state => state.user);
    const logout = useAppStore(state => state.logout);
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [showConfirm, setShowConfirm] = useState(false);
    const [theme, setTheme] = useState<Theme>('light');
    const [notifications, setNotifications] = useState({
        weeklyReport: true,
        reminderInactive: true,
        offerAlerts: false,
    });
    const [saved, setSaved] = useState<string | null>(null);
    const [fbType, setFbType] = useState('Bug / Hata');
    const [fbMessage, setFbMessage] = useState('');
    const [fbSending, setFbSending] = useState(false);
    const [fbSent, setFbSent] = useState(false);

    const handleFeedback = async () => {
        if (!fbMessage.trim() || fbSending) return;
        setFbSending(true);
        try {
            // EmailJS — add these 3 vars to .env.local after setup:
            // VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

            if (serviceId && templateId && publicKey) {
                await emailjs.send(serviceId, templateId, {
                    feedback_type: fbType,
                    feedback_message: fbMessage,
                    user_email: user?.email ?? 'anonymous',
                    to_email: 'kutluhangul@windowslive.com',
                }, publicKey);
            } else {
                // Fallback: open mailto if EmailJS not configured yet
                window.location.href = `mailto:kutluhangul@windowslive.com?subject=NextStep Feedback: ${fbType}&body=${encodeURIComponent(fbMessage)}`;
            }
            setFbSent(true);
            setFbMessage('');
            setTimeout(() => setFbSent(false), 3500);
        } catch {
            window.location.href = `mailto:kutluhangul@windowslive.com?subject=NextStep Feedback: ${fbType}&body=${encodeURIComponent(fbMessage)}`;
        } finally {
            setFbSending(false);
        }
    };


    const handleWipeData = () => {
        localStorage.removeItem('nextstep-storage');
        localStorage.removeItem('nextstep-remembered-email');
        window.location.href = '/';
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toast = (msg: string) => {
        setSaved(msg);
        setTimeout(() => setSaved(null), 2000);
    };

    const handleExportJSON = () => {
        const data = localStorage.getItem('nextstep-storage') || '{}';
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nextstep-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast('Veriler dışa aktarıldı');
    };

    const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'NS';

    const SettingRow = ({ icon, title, description, children }: {
        icon: string; title: string; description: string; children: React.ReactNode
    }) => (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-5 border-b border-black/5 last:border-0">
            <div className="flex items-start gap-4 flex-1">
                <div className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center text-base flex-shrink-0 mt-0.5">{icon}</div>
                <div>
                    <div className="font-semibold text-[#1d1d1f] text-sm">{title}</div>
                    <div className="text-xs text-black/40 mt-0.5 leading-relaxed max-w-xs">{description}</div>
                </div>
            </div>
            <div className="ml-13 sm:ml-0">{children}</div>
        </div>
    );

    const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
        <button
            onClick={onChange}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none ${checked ? 'bg-gradient-to-r from-indigo-500 to-blue-500' : 'bg-black/10'}`}
        >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    );

    return (
        <div className="w-full min-h-screen bg-[#f8f8fa]">
            <div className="mx-auto max-w-[860px] px-6 pt-24 pb-32">

                {/* Header */}
                <motion.div {...fadeUp(0)} className="mb-10">
                    <p className="text-xs font-bold tracking-[0.18em] text-black/40 uppercase mb-2">Kişiselleştirme</p>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f] mb-3">Ayarlar</h1>
                    <p className="text-base text-black/50 leading-relaxed">Hesap, güvenlik ve tercihlerinizi yönetin.</p>
                </motion.div>

                <div className="flex flex-col gap-5">

                    {/* ── PROFILE CARD ─────────────────────────────────────── */}
                    <motion.div {...fadeUp(0.08)} className="bg-white rounded-[24px] border border-black/5 shadow-[0_2px_24px_#00000008] p-6 sm:p-8 overflow-hidden relative">
                        <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-400/8 rounded-full blur-3xl pointer-events-none" />

                        {/* Avatar + name row */}
                        <div className="flex items-center gap-5 mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0">
                                {initials}
                            </div>
                            <div>
                                <div className="text-xl font-bold text-[#1d1d1f]">{user?.name || 'Kullanıcı'}</div>
                                <div className="text-sm text-black/45 mt-0.5">{user?.email || ''}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-black/40 mb-1.5 block">Ad</label>
                                <input type="text" disabled value={user?.name?.split(' ')[0] || ''}
                                    className="w-full rounded-xl border border-black/8 bg-[#fafafa] px-4 py-3 text-sm font-medium text-black/70" />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-black/40 mb-1.5 block">Soyad</label>
                                <input type="text" disabled value={user?.name?.split(' ').slice(1).join(' ') || ''}
                                    className="w-full rounded-xl border border-black/8 bg-[#fafafa] px-4 py-3 text-sm font-medium text-black/70" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-black/40 mb-1.5 block">E-posta</label>
                                <input type="email" disabled value={user?.email || ''}
                                    className="w-full rounded-xl border border-black/8 bg-[#fafafa] px-4 py-3 text-sm font-medium text-black/70" />
                            </div>
                        </div>

                        <div className="mt-6 pt-5 border-t border-black/5 flex justify-between items-center">
                            <span className="text-xs text-black/30">Profil bilgileri hesabınızdan alınır.</span>
                            <button onClick={handleLogout}
                                className="rounded-full border border-black/10 bg-white px-6 py-2.5 text-sm font-semibold text-black/70 transition-all hover:border-red-200 hover:text-red-600 hover:bg-red-50">
                                Oturumu Kapat
                            </button>
                        </div>
                    </motion.div>

                    {/* ── SECURITY CARD ────────────────────────────────────── */}
                    <motion.div {...fadeUp(0.12)} className="bg-white rounded-[24px] border border-black/5 shadow-[0_2px_24px_#00000008] p-6 sm:p-8">
                        <h3 className="text-base font-bold text-[#1d1d1f] mb-1">Güvenlik</h3>
                        <p className="text-xs text-black/40 mb-5">Hesabınızı güvende tutmak için şifrenizi düzenli olarak güncelleyin.</p>

                        <SettingRow icon="🔒" title="Şifre Değiştir" description="Son şifre değişikliği: Bilinmiyor">
                            <button onClick={() => toast('Şifre güncelleme yakında aktif olacak')}
                                className="whitespace-nowrap rounded-full border border-black/10 px-5 py-2 text-xs font-bold text-black/70 transition-all hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50">
                                Güncelle
                            </button>
                        </SettingRow>

                        <SettingRow icon="🛡️" title="İki Faktörlü Doğrulama" description="Hesabınıza ekstra güvenlik katmanı ekleyin">
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">Yakında</span>
                        </SettingRow>

                        <SettingRow icon="📱" title="Aktif Oturumlar" description="Farklı cihazlardaki oturumlarınızı görün ve kapatın">
                            <button onClick={() => toast('Tek oturum aktif — bu cihaz')}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                                Görüntüle →
                            </button>
                        </SettingRow>
                    </motion.div>

                    {/* ── GÖRÜNÜM KARTI ────────────────────────────────────── */}
                    <motion.div {...fadeUp(0.16)} className="bg-white rounded-[24px] border border-black/5 shadow-[0_2px_24px_#00000008] p-6 sm:p-8">
                        <h3 className="text-base font-bold text-[#1d1d1f] mb-1">Görünüm</h3>
                        <p className="text-xs text-black/40 mb-5">Arayüz teması ve görünüm tercihleri.</p>

                        <SettingRow icon="☀️" title="Tema" description="Açık, Koyu veya sistem varsayılanı">
                            <div className="flex gap-2">
                                {(['light', 'system'] as const).map(t => (
                                    <button key={t} onClick={() => { setTheme(t); toast('Tema güncellendi'); }}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${theme === t ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-black/10 text-black/60 hover:border-indigo-300'}`}>
                                        {t === 'light' ? '☀️ Açık' : '💻 Sistem'}
                                    </button>
                                ))}
                            </div>
                        </SettingRow>

                        <SettingRow icon="🌐" title="Dil" description="Uygulama dili">
                            <div className="flex items-center gap-2 rounded-xl border border-black/8 bg-[#fafafa] px-3 py-2 text-xs font-bold text-black/60">
                                🇹🇷 Türkçe
                            </div>
                        </SettingRow>
                    </motion.div>

                    {/* ── BİLDİRİM KARTI ───────────────────────────────────── */}
                    <motion.div {...fadeUp(0.2)} className="bg-white rounded-[24px] border border-black/5 shadow-[0_2px_24px_#00000008] p-6 sm:p-8">
                        <h3 className="text-base font-bold text-[#1d1d1f] mb-1">Bildirimler</h3>
                        <p className="text-xs text-black/40 mb-5">Hangi uyarıları almak istediğinizi seçin.</p>

                        <SettingRow icon="📊" title="Haftalık Rapor" description="Her Pazartesi başvuru özetinizi alın">
                            <Toggle checked={notifications.weeklyReport} onChange={() => { setNotifications(n => ({ ...n, weeklyReport: !n.weeklyReport })); toast('Tercih güncellendi'); }} />
                        </SettingRow>

                        <SettingRow icon="⏰" title="Hareketsizlik Uyarısı" description="7 gün başvuru yoksa hatırlatma">
                            <Toggle checked={notifications.reminderInactive} onChange={() => { setNotifications(n => ({ ...n, reminderInactive: !n.reminderInactive })); toast('Tercih güncellendi'); }} />
                        </SettingRow>

                        <SettingRow icon="🎯" title="Teklif Bildirimi" description="Teklif alındığında özel hatırlatma">
                            <Toggle checked={notifications.offerAlerts} onChange={() => { setNotifications(n => ({ ...n, offerAlerts: !n.offerAlerts })); toast('Tercih güncellendi'); }} />
                        </SettingRow>
                    </motion.div>

                    {/* ── VERİ YÖNETİMİ ────────────────────────────────────── */}
                    <motion.div {...fadeUp(0.24)} className="bg-white rounded-[24px] border border-black/5 shadow-[0_2px_24px_#00000008] p-6 sm:p-8">
                        <h3 className="text-base font-bold text-[#1d1d1f] mb-1">Veri Yönetimi</h3>
                        <p className="text-xs text-black/40 mb-5">Başvuru verilerinizi dışa aktarın veya silin.</p>

                        <SettingRow icon="📥" title="Verileri Dışa Aktar" description="Tüm başvuru geçmişinizi JSON olarak indirin">
                            <button onClick={handleExportJSON}
                                className="whitespace-nowrap rounded-full border border-black/10 px-5 py-2 text-xs font-bold text-black/70 transition-all hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50">
                                JSON İndir
                            </button>
                        </SettingRow>

                        <SettingRow icon="📦" title="Depolama" description="NextStep verilerini tarayıcınızda saklar">
                            <span className="text-xs font-bold text-black/40 bg-black/5 px-3 py-1.5 rounded-full">
                                ~{Math.round((localStorage.getItem('nextstep-storage')?.length ?? 0) / 1024)}KB kullanımda
                            </span>
                        </SettingRow>
                    </motion.div>

                    {/* ── GERİ BİLDİRİM ─────────────────────────────────── */}
                    <motion.div {...fadeUp(0.26)} className="bg-white rounded-[24px] border border-black/5 shadow-[0_2px_24px_#00000008] p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: 'linear-gradient(135deg, #f97316, #a855f7)' }}>💬</div>
                            <div>
                                <h3 className="text-base font-bold text-[#1d1d1f]">{t('settings.fbTitle')}</h3>
                                <p className="text-xs text-black/40">{t('settings.fbSub')}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative sm:w-44">
                                    <select value={fbType} onChange={e => setFbType(e.target.value)}
                                        className="w-full rounded-xl border border-black/8 bg-[#fafafa] px-4 py-3 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-orange-400/25 appearance-none">
                                        <option>Bug / Hata</option>
                                        <option>Öneri</option>
                                        <option>Diğer</option>
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/30">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                </div>
                                <textarea value={fbMessage} onChange={e => setFbMessage(e.target.value)}
                                    rows={3} placeholder={t('settings.fbMessage')}
                                    className="flex-1 rounded-xl border border-black/8 bg-[#fafafa] px-4 py-3 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-orange-400/25 resize-none" />
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-black/35">→ kutluhangul@windowslive.com</p>
                                <button onClick={handleFeedback} disabled={!fbMessage.trim() || fbSending || fbSent}
                                    className="rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                                    style={{ background: fbSent ? '#22c55e' : 'linear-gradient(135deg, #f97316, #a855f7)' }}>
                                    {fbSent ? '✓ Gönderildi!' : fbSending ? '...' : t('settings.fbSend')}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── TEHLİKE BÖLGESI ──────────────────────────────────── */}
                    <motion.div {...fadeUp(0.31)} className="bg-white rounded-[24px] border border-rose-100 shadow-[0_2px_24px_rgba(244,63,94,0.06)] p-6 sm:p-8">
                        <h3 className="text-base font-bold text-rose-600 mb-1">Tehlike Bölgesi</h3>
                        <p className="text-xs text-rose-400 mb-5">Bu işlemler geri alınamaz. Dikkatli olun.</p>

                        <AnimatePresence mode="wait">
                            {!showConfirm ? (
                                <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3">
                                    <div>
                                        <div className="font-semibold text-[#1d1d1f] text-sm">Tüm Verileri Sil</div>
                                        <div className="text-xs text-black/40 mt-0.5 max-w-xs leading-relaxed">
                                            Tüm başvurular, geçmiş ve ayarlar kalıcı olarak silinir.
                                        </div>
                                    </div>
                                    <button onClick={() => setShowConfirm(true)}
                                        className="whitespace-nowrap rounded-full border border-rose-200 bg-rose-50 px-6 py-2.5 text-xs font-bold text-rose-600 transition-all hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-[0_4px_16px_rgba(244,63,94,0.3)]">
                                        Tüm Verileri Sil
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div key="confirm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="rounded-2xl bg-rose-50 border border-rose-200/60 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="font-bold text-rose-700 text-sm mb-1">⚠️ Bu işlem geri alınamaz!</div>
                                        <div className="text-xs text-rose-600/70">Tüm başvuru verileri kalıcı olarak silinecek. Emin misiniz?</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={handleWipeData}
                                            className="rounded-full bg-rose-600 px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-rose-700 hover:shadow-[0_4px_16px_rgba(225,29,72,0.4)]">
                                            Evet, Sil
                                        </button>
                                        <button onClick={() => setShowConfirm(false)}
                                            className="rounded-full border border-black/10 px-6 py-2.5 text-xs font-bold text-black/60 hover:bg-black/5">
                                            İptal
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                </div>

                {/* Toast */}
                <AnimatePresence>
                    {saved && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, x: '-50%' }}
                            animate={{ opacity: 1, y: 0, x: '-50%' }}
                            exit={{ opacity: 0, y: 20, x: '-50%' }}
                            className="fixed bottom-32 left-1/2 z-50 rounded-full bg-white border border-black/10 shadow-2xl px-6 py-3 text-sm font-semibold text-[#1d1d1f] flex items-center gap-2"
                        >
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            {saved}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default Settings;
