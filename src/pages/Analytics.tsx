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

            <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* Row 1: Mülakat Oranı & Aylık Başvuru Hızı */}
                <Reveal direction="up" delay={0.1}>
                    <div className="apple-card p-6 min-h-[400px] flex flex-col justify-center shadow-[0_4px_24px_#00000008]">
                        <div className="flex items-center gap-3 mb-6">
                            <AnimatedIcon type="pie" size={24} />
                            <H3>Mülakat Oranı</H3>
                        </div>
                        <div className="flex-1 flex flex-col justify-center items-center text-center">
                            <div className="text-[100px] font-medium leading-none tracking-tighter text-[#0071e3]">
                                %{interviewRate}
                            </div>
                            <div className="mt-6 text-base font-medium text-black/60 max-w-xs mx-auto">
                                Başvurularınızın mülakata dönüşme oranı. Endüstri ortalaması %10-15 civarındadır.
                            </div>
                        </div>
                    </div>
                </Reveal>

                <Reveal direction="up" delay={0.2}>
                    <div className="apple-card p-6 min-h-[400px] flex flex-col shadow-[0_4px_24px_#00000008]">
                        <div className="flex items-center gap-3 mb-6">
                            <AnimatedIcon type="bar" size={24} />
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

                {/* Row 2: Durum Dağılımı & CV Performans */}
                <Reveal direction="up" delay={0.3}>
                    <div className="apple-card p-6 min-h-[400px] flex flex-col shadow-[0_4px_24px_#00000008]">
                        <div className="flex items-center gap-3 mb-4 w-full">
                            <AnimatedIcon type="pie" size={24} />
                            <H3>Durum Dağılımı</H3>
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

                <Reveal direction="up" delay={0.4}>
                    <div className="apple-card p-6 min-h-[400px] flex flex-col justify-center shadow-[0_4px_24px_#00000008]">
                        <div className="flex items-center gap-3 mb-6 w-full">
                            <AnimatedIcon type="bar" size={24} />
                            <H3>CV Performans</H3>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <Caption className="text-black/50">En Etkili Versiyon</Caption>
                            <div className="text-5xl font-medium text-black mt-1">V1 Düz</div>
                            <div className="text-sm text-black/50 mt-2">Bu CV modeli size en fazla pozitif dönüşü sağladı.</div>

                            <div className="mt-8 border-t border-black/5 pt-6">
                                <Caption className="text-black/50 mb-4">Formata Göre Dönüş Oranları</Caption>
                                <div className="space-y-4 w-full">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-black/70">V1 Düz</span>
                                            <span className="font-medium">%100 Test Raporu</span>
                                        </div>
                                        <div className="w-full bg-black/5 rounded-full h-2">
                                            <div className="bg-[#0071e3] h-2 rounded-full" style={{ width: '100%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-black/70">V2 Tasarım</span>
                                            <span className="font-medium">%62 Kapsama</span>
                                        </div>
                                        <div className="w-full bg-black/5 rounded-full h-2">
                                            <div className="bg-[#34c759] h-2 rounded-full" style={{ width: '62%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Row 3: Motivasyon Etkisi & Yıllık Trend */}
                <Reveal direction="up" delay={0.5}>
                    <div className="apple-card p-6 min-h-[400px] flex flex-col shadow-[0_4px_24px_#00000008]">
                        <div className="flex items-center gap-3 mb-6 w-full">
                            <AnimatedIcon type="bar" size={24} />
                            <H3>Motivasyon Etkisi</H3>
                        </div>
                        <div className="flex-1 flex flex-col justify-center items-center text-center">
                            <div className="text-[100px] font-medium leading-none tracking-tighter text-emerald-500">
                                +3x
                            </div>
                            <div className="mt-6 text-base font-medium text-black/60 max-w-xs mx-auto">
                                Motivasyon yazısı eklediğiniz başvurulardan olumlu dönüş alma ihtimaliniz <strong>3 kat</strong> daha fazla.
                            </div>
                        </div>
                    </div>
                </Reveal>

                <Reveal direction="up" delay={0.6}>
                    <div className="apple-card p-6 min-h-[400px] flex flex-col shadow-[0_4px_24px_#00000008]">
                        <div className="flex items-center gap-3 mb-6 w-full">
                            <AnimatedIcon type="area" size={24} />
                            <H3>Yıllık Trend</H3>
                        </div>
                        <div className="flex-1 flex flex-col justify-center mt-4">
                            <div className="text-2xl font-bold text-black tracking-tight mb-2">Başvurular Artışta!</div>
                            <div className="text-base font-medium text-black/50 mb-8">Bu çeyrek bir önceki döneme göre daha verimli geçti.</div>

                            <div className="flex items-end gap-2 h-32 mt-auto">
                                {/* Synthetic mock bar generation for visual placeholder logic */}
                                {[45, 60, 20, 90, 80, 50, 70, 40, 65, 80, 95, 100].map((h, i) => (
                                    <div key={i} className={`flex-1 rounded-t opacity-80 ${h > 70 ? 'bg-[#0071e3]' : 'bg-[#0071e3]/20'}`} style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Reveal>

            </div>
        </div>
    );
};

export default Analytics;
