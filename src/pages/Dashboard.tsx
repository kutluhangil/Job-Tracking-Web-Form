import { useAppStore } from '../store/useAppStore';
import { H3, Text, Caption } from '../components/common/Typography';
import { Reveal } from '../components/common/Reveal';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const user = useAppStore(state => state.user);
    const applications = useAppStore(state => state.applications);
    const logout = useAppStore(state => state.logout);

    // Derived Stats
    const total = applications.length;
    const inProgress = applications.filter(a => a.status === 'Süreçte' || a.status === 'Görüşme Bekleniyor').length;
    const offers = applications.filter(a => a.status === 'Teklif Alındı' || a.status === 'Olumlu').length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthApps = applications.filter(a => {
        const d = new Date(a.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    return (
        <div className="mx-auto max-w-[1200px] px-6 pt-24 pb-32">

            {/* Header Profile Area (Minimal) */}
            <Reveal direction="down" duration={0.6}>
                <div className="flex items-center justify-between">
                    <div>
                        <Caption>GENEL BAKIŞ</Caption>
                        <h1 className="mt-1 text-[clamp(28px,4vw,36px)] font-bold tracking-tight text-[#1d1d1f]">
                            Merhaba, {user?.name || 'Kullanıcı'}
                        </h1>
                    </div>
                    <button
                        onClick={logout}
                        className="btn-ghost px-5 py-2 text-sm border-black/10 hover:border-indigo-300"
                    >
                        Çıkış Yap
                    </button>
                </div>
            </Reveal>

            {/* Typographic Canvas Stats Area */}
            {/* We avoid standard cards and use massive text instead */}
            <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

                {/* Main Number - Big Typographic Statement */}
                <Reveal direction="up" delay={0.1}>
                    <div className="group relative">
                        <div className="text-[120px] font-medium leading-none tracking-tighter text-black transition-transform duration-500 group-hover:scale-105 origin-left">
                            {total}
                        </div>
                        <div className="mt-2 text-xl font-medium text-black/60">
                            Toplam <br /> Başvuru
                        </div>
                    </div>
                </Reveal>

                <Reveal direction="up" delay={0.2}>
                    <div className="flex h-full flex-col justify-end gap-1">
                        <div className="text-[64px] font-medium leading-none tracking-tight text-blue-600">
                            {thisMonthApps}
                        </div>
                        <div className="text-lg font-medium text-black/60">Bu Ay</div>
                    </div>
                </Reveal>

                <Reveal direction="up" delay={0.3}>
                    <div className="flex h-full flex-col justify-end gap-1">
                        <div className="text-[64px] font-medium leading-none tracking-tight text-amber-500">
                            {inProgress}
                        </div>
                        <div className="text-lg font-medium text-black/60">Süreçte</div>
                    </div>
                </Reveal>

                <Reveal direction="up" delay={0.4}>
                    <div className="flex h-full flex-col justify-end gap-1">
                        <div className="text-[64px] font-medium leading-none tracking-tight text-emerald-500">
                            {offers}
                        </div>
                        <div className="text-lg font-medium text-black/60">Olumlu Sonuç</div>
                    </div>
                </Reveal>
            </div>

            <div className="my-16 h-px w-full bg-black/5" />

            {/* Recent Activity Canvas */}
            <Reveal direction="up" delay={0.2} className="w-full">
                <div className="flex flex-col w-full mx-auto max-w-[1200px]">
                    <div className="flex items-center justify-between mb-8">
                        <H3>Son Hareketler</H3>
                    </div>

                    {applications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <div className="mb-4 text-4xl">📭</div>
                            <Text>Henüz hiç başvuru eklemedin.</Text>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 w-full">
                            {/* Headers for Desktop */}
                            <div className="hidden md:grid md:grid-cols-10 gap-4 px-5 pb-2 text-xs font-semibold text-black/50 uppercase tracking-wider">
                                <div className="col-span-2">Firma / Pozisyon</div>
                                <div className="col-span-1">Durum</div>
                                <div className="col-span-1">Tarih</div>
                                <div className="col-span-1">Platform</div>
                                <div className="col-span-1">CV</div>
                                <div className="col-span-2">Motivasyon</div>
                                <div className="col-span-1">Test</div>
                                <div className="col-span-1 text-center">İlan</div>
                            </div>

                            {applications.slice(0, 5).map((app, i) => (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.1) }}
                                    className="group flex flex-col md:grid md:grid-cols-10 items-start md:items-center gap-4 rounded-3xl p-5 bg-white/70 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-black/5 transition-all cursor-pointer hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                                >
                                    <div className="col-span-2 flex flex-col">
                                        <div className="text-base font-bold text-black">{app.companyName}</div>
                                        <div className="text-sm text-black/60">{app.position}</div>
                                    </div>
                                    <div className="col-span-1">
                                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-black/5 text-black/80 whitespace-nowrap">
                                            {app.status}
                                        </span>
                                    </div>
                                    <div className="col-span-1 text-sm text-black/60">
                                        {new Date(app.date).toLocaleDateString('tr-TR')}
                                    </div>
                                    <div className="col-span-1 text-sm text-black/60">
                                        {app.platform || '-'}
                                    </div>
                                    <div className="col-span-1 text-sm text-black/60">
                                        {app.cvVersion || '-'}
                                    </div>
                                    <div className="col-span-2 text-sm text-black/60 truncate" title={app.motivation}>
                                        {app.motivation ? 'Eklendi' : '-'}
                                    </div>
                                    <div className="col-span-1 text-sm">
                                        {app.testLink ? (
                                            <a href={app.testLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                                                Var
                                            </a>
                                        ) : (
                                            <span className="text-black/30">-</span>
                                        )}
                                    </div>
                                    <div className="col-span-1 text-sm max-md:mt-2 md:text-center w-full">
                                        {app.jobLink ? (
                                            <a href={app.jobLink} target="_blank" rel="noopener noreferrer" className="btn-gradient inline-flex items-center justify-center w-full py-2 text-xs" onClick={(e) => e.stopPropagation()}>
                                                İlanı Aç
                                            </a>
                                        ) : (
                                            <span className="text-black/30 w-full text-center block">-</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </Reveal>

        </div>
    );
};

export default Dashboard;
