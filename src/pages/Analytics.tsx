import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Text, Caption } from '../components/common/Typography';
import { Reveal } from '../components/common/Reveal';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { AnimatedIcon } from '../components/analytics/AnimatedIcon';

const COLORS = ['#0071e3', '#34c759', '#ff9500', '#ff3b30', '#8e8e93'];

const Analytics = () => {
    const applications = useAppStore(state => state.applications);

    // Group by month
    const monthlyData = useMemo(() => {
        const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        const data = months.map(month => ({ name: month, value: 0 }));

        applications.forEach(app => {
            const d = new Date(app.date);
            data[d.getMonth()].value += 1;
        });

        const currentMonth = new Date().getMonth();
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            let m = currentMonth - i;
            if (m < 0) m += 12;
            last6Months.push(data[m]);
        }

        return last6Months;
    }, [applications]);

    // Group by status
    const statusData = useMemo(() => {
        const counts: Record<string, number> = {};
        applications.forEach(app => {
            counts[app.status] = (counts[app.status] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [applications]);

    // Stats
    const total = applications.length;
    const interviewRate = total > 0
        ? Math.round((applications.filter(a => ['Olumlu', 'Teklif Alındı', 'Görüşme Bekleniyor'].includes(a.status)).length / total) * 100)
        : 0;

    return (
        <div className="mx-auto max-w-[1300px] px-6 pt-24 pb-48">

            <Reveal direction="down" duration={0.6}>
                <Caption>İÇGÖRÜLER</Caption>
                <h1 className="mt-1 text-[clamp(28px,4vw,36px)] font-bold tracking-tight text-[#1d1d1f]">
                    Analiz
                </h1>
                <Text className="mt-2 max-w-xl text-black/60">
                    Başvurularınızın mülakata dönüşme oranını ve kalite trendlerini widget görünümleriyle izleyin.
                </Text>
            </Reveal>

            {/* iPhone Widget Style Masonry Grid */}
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-6 lg:grid-cols-12 auto-rows-[160px]">

                {/* Widget 1: Mülakat Oranı (Small Square) */}
                <Reveal direction="up" delay={0.1} className="md:col-span-3 lg:col-span-4 row-span-2">
                    <div className="apple-glass-card h-full p-8 flex flex-col justify-between hover:shadow-[0_12px_48px_rgba(59,130,246,0.15)] transition-all group overflow-hidden relative">
                        <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all duration-700 pointer-events-none"></div>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <AnimatedIcon type="pie" size={20} />
                            </div>
                            <h3 className="text-sm font-semibold text-black/60 uppercase tracking-widest">Mülakat Oranı</h3>
                        </div>
                        <div className="relative z-10">
                            <div className="text-[clamp(64px,8vw,96px)] font-bold leading-none tracking-tighter bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                %{interviewRate}
                            </div>
                            <div className="mt-4 text-sm font-medium text-black/50">
                                Endüstri ortalaması: %10-15
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Widget 2: Aylık Başvuru Hızı (Large Rectangle) */}
                <Reveal direction="up" delay={0.2} className="md:col-span-6 lg:col-span-8 row-span-2">
                    <div className="apple-glass-card h-full p-8 flex flex-col group hover:shadow-[0_12px_48px_rgba(236,72,153,0.1)] transition-all relative overflow-hidden">
                        <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 blur-3xl rounded-full group-hover:bg-pink-500/10 transition-all duration-700 pointer-events-none"></div>
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                                <AnimatedIcon type="bar" size={20} />
                            </div>
                            <h3 className="text-sm font-semibold text-black/60 uppercase tracking-widest">Aylık Başvuru Hızı</h3>
                        </div>
                        <div className="flex-1 w-full relative z-10 min-h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#86868b', fontSize: 12, fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#86868b', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '12px 16px' }}
                                    />
                                    <Bar dataKey="value" fill="url(#colorUv)" radius={[8, 8, 8, 8]} maxBarSize={48}>
                                        {/* Gradient defined inside BarChart usually requires a defs block, but we simulate it by using theme color or standard fill on Recharts limits */}
                                    </Bar>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.8} />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Reveal>

                {/* Widget 3: Motivasyon Etkisi (Square) */}
                <Reveal direction="up" delay={0.3} className="md:col-span-3 lg:col-span-4 row-span-2">
                    <div className="apple-glass-card h-full p-8 flex flex-col justify-between group hover:shadow-[0_12px_48px_rgba(16,185,129,0.15)] transition-all overflow-hidden relative">
                        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full group-hover:bg-emerald-500/20 transition-all duration-700 pointer-events-none"></div>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <AnimatedIcon type="bar" size={20} />
                            </div>
                            <h3 className="text-sm font-semibold text-black/60 uppercase tracking-widest">Motivasyon Etkisi</h3>
                        </div>
                        <div className="relative z-10">
                            <div className="text-[clamp(80px,8vw,120px)] font-bold leading-none tracking-tighter bg-gradient-to-br from-emerald-400 to-teal-600 bg-clip-text text-transparent">
                                +3x
                            </div>
                            <div className="mt-4 text-sm font-medium text-black/60">
                                Motivasyon yazısı eklenen başvurular <strong>3 kat</strong> daha etkili.
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Widget 4: Durum Dağılımı (Tall Rectangle) */}
                <Reveal direction="up" delay={0.4} className="md:col-span-3 lg:col-span-4 row-span-3">
                    <div className="apple-glass-card h-full p-8 flex flex-col group hover:shadow-[0_12px_48px_rgba(99,102,241,0.12)] transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <AnimatedIcon type="pie" size={20} />
                            </div>
                            <h3 className="text-sm font-semibold text-black/60 uppercase tracking-widest">Durum Dağılımı</h3>
                        </div>
                        <div className="flex-1 w-full relative min-h-[200px] z-10 flex items-center justify-center">
                            {applications.length === 0 ? (
                                <div className="text-black/40 text-sm">Veri yok</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={4}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {statusData.map((_entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                                            itemStyle={{ fontWeight: 600 }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                        <div className="w-full flex flex-col gap-3 mt-6 z-10">
                            {statusData.slice(0, 4).map((_entry, idx) => (
                                <div key={_entry.name} className="flex justify-between items-center text-sm p-2 rounded-xl hover:bg-black/5 transition-colors cursor-default">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                        <span className="text-black/80 font-medium">{_entry.name}</span>
                                    </div>
                                    <span className="font-bold text-black">{_entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>

                {/* Widget 5: CV Performans (Square) */}
                <Reveal direction="up" delay={0.5} className="md:col-span-6 lg:col-span-4 row-span-3">
                    <div className="apple-glass-card h-full p-8 flex flex-col group hover:shadow-[0_12px_48px_rgba(249,115,22,0.1)] transition-all relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                <AnimatedIcon type="bar" size={20} />
                            </div>
                            <h3 className="text-sm font-semibold text-black/60 uppercase tracking-widest">CV Performans</h3>
                        </div>
                        <div className="flex-1 flex flex-col relative z-10">
                            <div className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-2">En Etkili Versiyon</div>
                            <div className="text-4xl font-bold tracking-tight text-black mb-2">V1 Düz</div>
                            <div className="text-sm text-black/50 leading-relaxed max-w-[80%]">
                                Minimalist CV modeliniz, tasarımlı versiyona göre %38 daha fazla ATS (Aday Takip Sistemi) uyumu sağlıyor.
                            </div>

                            <div className="mt-auto pt-8 flex flex-col gap-5">
                                <div className="group/item">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-black/80 font-medium">V1 Düz</span>
                                        <span className="font-bold text-orange-600">%100 Test Raporu</span>
                                    </div>
                                    <div className="w-full bg-black/5 rounded-full h-3 overflow-hidden border border-black/5">
                                        <div className="bg-gradient-to-r from-orange-400 to-rose-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                                <div className="group/item">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-black/80 font-medium">V2 Tasarım</span>
                                        <span className="font-bold text-black/60">%62 Kapsama</span>
                                    </div>
                                    <div className="w-full bg-black/5 rounded-full h-3 overflow-hidden border border-black/5">
                                        <div className="bg-gradient-to-r from-neutral-300 to-neutral-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '62%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>


            </div>
        </div>
    );
};

export default Analytics;
