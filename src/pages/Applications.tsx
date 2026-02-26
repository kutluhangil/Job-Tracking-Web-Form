import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { H2, Caption } from '../components/common/Typography';
import { Reveal } from '../components/common/Reveal';
import { Search, Filter, ArrowDown, ArrowUp, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Applications = () => {
    const applications = useAppStore(state => state.applications);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortField, setSortField] = useState<'date' | 'companyName'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const handleSort = (field: 'date' | 'companyName') => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const filteredApps = useMemo(() => {
        return applications
            .filter(app => {
                const matchesSearch =
                    app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    app.position.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = statusFilter ? app.status === statusFilter : true;
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                if (sortField === 'date') {
                    return sortOrder === 'asc'
                        ? new Date(a.date).getTime() - new Date(b.date).getTime()
                        : new Date(b.date).getTime() - new Date(a.date).getTime();
                } else {
                    return sortOrder === 'asc'
                        ? a.companyName.localeCompare(b.companyName)
                        : b.companyName.localeCompare(a.companyName);
                }
            });
    }, [applications, searchTerm, statusFilter, sortField, sortOrder]);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredApps.map(app => ({
            No: app.no,
            Firma: app.companyName,
            Pozisyon: app.position,
            Tarih: new Date(app.date).toLocaleDateString('tr-TR'),
            Durum: app.status,
            Platform: app.platform,
            CvVersiyonu: app.cvVersion,
            Notlar: app.motivation
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Basvurular");
        XLSX.writeFile(wb, "nextstep_basvurular.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("NextStep Is Basvuru Raporu", 14, 15);

        const tableData = filteredApps.map(app => [
            app.no,
            app.companyName,
            app.position,
            new Date(app.date).toLocaleDateString('tr-TR'),
            app.status,
            app.platform
        ]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (doc as any).autoTable({
            head: [['No', 'Firma', 'Pozisyon', 'Tarih', 'Durum', 'Platform']],
            body: tableData,
            startY: 20,
            theme: 'grid',
            styles: { fontSize: 8, font: 'helvetica' },
            headStyles: { fillColor: [0, 113, 227] }
        });

        doc.save("nextstep_basvurular.pdf");
    };

    return (
        <div className="mx-auto max-w-[1400px] px-6 pt-24 pb-48">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <Reveal direction="down" duration={0.6}>
                    <div className="flex items-center gap-6">
                        <div>
                            <Caption>Takip</Caption>
                            <H2 className="mt-1">Tüm Başvurular</H2>
                        </div>
                        {/* Export Actions */}
                        <div className="flex items-center gap-2 mt-4 ml-4">
                            <button
                                onClick={exportToExcel}
                                className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-500/20"
                            >
                                <Download size={14} /> EXCEL
                            </button>
                            <button
                                onClick={exportToPDF}
                                className="flex items-center gap-2 rounded-full bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-500/20"
                            >
                                <Download size={14} /> PDF
                            </button>
                        </div>
                    </div>
                </Reveal>

                <Reveal direction="down" delay={0.1}>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <Search size={18} className="text-black/40" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Firma veya pozisyon ara..."
                                className="w-full sm:w-64 rounded-full border border-black/10 bg-black/5 py-2.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-[#0071e3] focus:bg-white focus:ring-2 focus:ring-[#0071e3]/20"
                            />
                        </div>

                        {/* Filter */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <Filter size={18} className="text-black/40" />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full sm:w-48 appearance-none rounded-full border border-black/10 bg-black/5 py-2.5 pl-11 pr-10 text-sm outline-none transition-all focus:border-[#0071e3] focus:bg-white focus:ring-2 focus:ring-[#0071e3]/20"
                            >
                                <option value="">Tüm Durumlar</option>
                                <option value="Süreçte">Süreçte</option>
                                <option value="Görüşme Bekleniyor">Görüşme Bekleniyor</option>
                                <option value="Teklif Alındı">Teklif Alındı</option>
                                <option value="Olumlu">Olumlu</option>
                                <option value="Reddedildi">Reddedildi</option>
                            </select>
                        </div>
                    </div>
                </Reveal>
            </div>

            <Reveal direction="up" delay={0.2}>
                <div className="apple-card overflow-x-auto">
                    <table className="w-full text-left text-sm text-black">
                        <thead className="bg-[#fbfbfd] text-xs uppercase text-black/60 border-b border-black/5">
                            <tr>
                                <th className="px-6 py-5 font-medium">No</th>
                                <th
                                    className="px-6 py-5 font-medium cursor-pointer hover:text-black transition-colors"
                                    onClick={() => handleSort('companyName')}
                                >
                                    <div className="flex items-center gap-1">
                                        Firma & Pozisyon
                                        {sortField === 'companyName' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-5 font-medium cursor-pointer hover:text-black transition-colors"
                                    onClick={() => handleSort('date')}
                                >
                                    <div className="flex items-center gap-1">
                                        Tarih
                                        {sortField === 'date' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                                    </div>
                                </th>
                                <th className="px-6 py-5 font-medium">Durum</th>
                                <th className="px-6 py-5 font-medium">CV / Platform</th>
                                <th className="px-6 py-5 font-medium text-right">Aksiyon</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            <AnimatePresence>
                                {filteredApps.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-black/50">
                                            Başvuru bulunamadı.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredApps.map((app, index) => (
                                        <motion.tr
                                            key={app.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-black/[0.02] transition-colors"
                                        >
                                            <td className="px-6 py-5 font-medium text-black/40">#{app.no}</td>
                                            <td className="px-6 py-5">
                                                <div className="font-semibold text-black">{app.companyName}</div>
                                                <div className="text-black/60 mt-0.5">{app.position}</div>
                                            </td>
                                            <td className="px-6 py-5 text-black/70">
                                                {new Date(app.date).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                          ${app.status === 'Reddedildi' ? 'bg-rose-500/10 text-rose-600' : ''}
                          ${app.status === 'Süreçte' ? 'bg-blue-500/10 text-blue-600' : ''}
                          ${app.status === 'Olumlu' || app.status === 'Teklif Alındı' ? 'bg-emerald-500/10 text-emerald-600' : ''}
                          ${app.status === 'Görüşme Bekleniyor' ? 'bg-amber-500/10 text-amber-600' : ''}
                        `}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-black/80">{app.cvVersion}</div>
                                                <div className="text-black/50 text-xs mt-0.5">{app.platform}</div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="text-[#0071e3] hover:underline text-sm font-medium">
                                                    Detay
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </Reveal>
        </div>
    );
};

export default Applications;
