import { useAppStore } from '../store/useAppStore';
import { H2, H3, Text, Caption } from '../components/common/Typography';
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
                        <Caption>Genel Bakış</Caption>
                        <H2 className="mt-1">Merhaba, {user?.name}</H2>
                    </div>
                    <button
                        onClick={logout}
                        className="rounded-full bg-black/5 px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-black/10"
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
            <Reveal direction="up" delay={0.2}>
                <div className="flex items-center justify-between mb-8">
                    <H3>Son Hareketler</H3>
                </div>

                {applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <div className="mb-4 text-4xl">📭</div>
                        <Text>Henüz hiç başvuru eklemedin.</Text>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {applications.slice(0, 5).map((app, i) => (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                className="group flex items-center justify-between rounded-2xl p-4 hover:bg-black/5 transition-colors cursor-pointer"
                            >
                                <div>
                                    <div className="text-lg font-medium text-black">{app.companyName}</div>
                                    <div className="text-sm text-black/50">{app.position}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-sm font-medium px-3 py-1 rounded-full bg-black/5 text-black/80">
                                        {app.status}
                                    </div>
                                    <div className="text-sm text-black/40">
                                        {new Date(app.date).toLocaleDateString('tr-TR')}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </Reveal>

        </div>
    );
};

export default Dashboard;
