import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { H2, H3, Text, Caption } from '../components/common/Typography';
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
        <div className="mx-auto max-w-[1400px] px-6 pt-24 pb-48">

            <Reveal direction="down" duration={0.6}>
                <Caption>İçgörüler</Caption>
                <H2 className="mt-1">Analiz</H2>
                <Text className="mt-2 max-w-xl">
                    Sadece başvuru sayınızı değil, süreçlerinizin kalitesini ve mülakata dönüşme oranınızı inceleyin.
                </Text>
            </Reveal>

            <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">

                {/* Metric 1 */}
                <Reveal direction="up" delay={0.1}>
                    <div className="apple-card p-8 h-full flex flex-col justify-center">
                        <div className="text-sm font-medium text-black/50">Mülakat Oranı</div>
                        <div className="mt-2 text-[84px] font-medium leading-none tracking-tighter text-black">
                            %{interviewRate}
                        </div>
                        <div className="mt-4 text-sm text-black/60">
                            Mülakat aşamasına geçme yüzdeniz. Hedef: %15+
                        </div>
                    </div>
                </Reveal>

                {/* Chart 1: Monthly Trends */}
                <Reveal direction="up" delay={0.2} className="lg:col-span-2">
                    <div className="apple-card p-8 h-[400px] flex flex-col">
                        <div className="flex items-center gap-4 mb-8">
                            <AnimatedIcon type="bar" size={28} />
                            <H3>Aylık Başvuru Hızı</H3>
                        </div>
                        <div className="flex-1 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#86868b', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#86868b', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                                    />
                                    <Bar dataKey="value" fill="#0071e3" radius={[6, 6, 0, 0]} maxBarSize={48} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Reveal>

                {/* Chart 2: Status Breakdown */}
                <Reveal direction="up" delay={0.3} className="lg:col-span-1">
                    <div className="apple-card p-8 h-[400px] flex flex-col items-center">
                        <div className="flex items-center gap-4 mb-4 w-full">
                            <AnimatedIcon type="pie" size={28} />
                            <H3 className="w-full text-left">Durum Dağılımı</H3>
                        </div>
                        <div className="flex-1 w-full relative flex items-center justify-center">
                            {applications.length === 0 ? (
                                <div className="text-black/40 text-sm">Veri yok</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {statusData.map((_entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                        {/* Legend Map */}
                        <div className="w-full flex flex-col gap-2 mt-4">
                            {statusData.slice(0, 3).map((_entry, idx) => (
                                <div key={_entry.name} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                        <span className="text-black/70">{_entry.name}</span>
                                    </div>
                                    <span className="font-medium">{_entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>

                {/* Most Frequent Platform / City */}
                <Reveal direction="up" delay={0.4} className="lg:col-span-2">
                    <div className="apple-card p-8 bg-[#1d1d1f] text-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
                            <div className="flex flex-col gap-2 pt-4 md:pt-0">
                                <Caption className="text-white/50">En Etkili CV Versiyonu</Caption>
                                <div className="text-3xl font-medium">V1 Düz</div>
                                <div className="text-sm text-white/50 mt-auto pt-4">En çok mülakat getiren format.</div>
                            </div>
                            <div className="flex flex-col gap-2 pt-4 md:pt-0 md:pl-8">
                                <Caption className="text-white/50">Ortalama Dönüş Süresi</Caption>
                                <div className="text-3xl font-medium z-10">14 Gün</div>
                                <div className="text-sm text-white/50 mt-auto pt-4">Firmaların size dönüş hızı.</div>
                            </div>
                        </div>
                    </div>
                </Reveal>

            </div>
        </div>
    );
};

export default Analytics;
