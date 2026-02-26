import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { H2, Caption } from '../components/common/Typography';
import { Reveal } from '../components/common/Reveal';
import { Search, Filter, ArrowDown, ArrowUp, Download, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Applications = () => {
    const applications = useAppStore(state => state.applications);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortField, setSortField] = useState<'date' | 'companyName'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedApp, setSelectedApp] = useState<typeof applications[0] | null>(null);

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
                <div className="flex flex-col gap-4">
                    {/* Desktop Headers */}
                    <div className="hidden lg:grid lg:grid-cols-11 gap-4 px-6 pb-2 text-xs font-semibold text-black/50 uppercase tracking-wider">
                        <div className="col-span-2 cursor-pointer hover:text-black flex items-center gap-1" onClick={() => handleSort('companyName')}>
                            Firma / Pozisyon
                            {sortField === 'companyName' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                        </div>
                        <div className="col-span-2">Durum</div>
                        <div className="col-span-1 cursor-pointer hover:text-black flex items-center gap-1" onClick={() => handleSort('date')}>
                            Tarih
                            {sortField === 'date' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                        </div>
                        <div className="col-span-1">Platform</div>
                        <div className="col-span-1">CV</div>
                        <div className="col-span-1">Motivasyon</div>
                        <div className="col-span-1">Test</div>
                        <div className="col-span-2 text-right">Aksiyon</div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <AnimatePresence>
                            {filteredApps.length === 0 ? (
                                <div className="text-center py-12 text-black/50 bg-white rounded-3xl border border-black/5">
                                    Başvuru bulunamadı.
                                </div>
                            ) : (
                                filteredApps.map((app, index) => (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group flex flex-col lg:grid lg:grid-cols-11 gap-4 lg:items-center rounded-3xl p-6 bg-white shadow-[0_4px_24px_#0000000a] border border-black/5 hover:shadow-[0_8px_32px_#00000014] transition-all"
                                    >
                                        <div className="col-span-2 flex flex-col">
                                            <div className="text-base font-bold text-black">{app.companyName}</div>
                                            <div className="text-sm text-black/60">{app.position}</div>
                                        </div>

                                        <div className="col-span-2 flex items-center">
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                                                ${app.status === 'Reddedildi' ? 'bg-rose-500/10 text-rose-600' : ''}
                                                ${app.status === 'Süreçte' ? 'bg-blue-500/10 text-blue-600' : ''}
                                                ${app.status === 'Olumlu' || app.status === 'Teklif Alındı' ? 'bg-emerald-500/10 text-emerald-600' : ''}
                                                ${app.status === 'Görüşme Bekleniyor' ? 'bg-amber-500/10 text-amber-600' : ''}
                                            `}>
                                                {app.status}
                                            </span>
                                        </div>

                                        <div className="col-span-1 text-sm text-black/70">
                                            {new Date(app.date).toLocaleDateString('tr-TR')}
                                        </div>

                                        <div className="col-span-1 text-sm font-medium text-black/80">
                                            {app.platform || '-'}
                                        </div>

                                        <div className="col-span-1 text-sm text-black/80">
                                            {app.cvVersion || '-'}
                                        </div>

                                        <div className="col-span-1 text-sm text-black/60 truncate" title={app.motivation}>
                                            {app.motivation ? 'Eklendi' : '-'}
                                        </div>

                                        <div className="col-span-1 text-sm text-blue-600">
                                            {app.testLink ? (
                                                <a href={app.testLink} target="_blank" rel="noopener noreferrer" className="hover:underline" onClick={(e) => e.stopPropagation()}>
                                                    Link
                                                </a>
                                            ) : (
                                                <span className="text-black/30">-</span>
                                            )}
                                        </div>

                                        <div className="col-span-2 flex items-center lg:justify-end gap-3 max-lg:mt-4">
                                            {app.jobLink && (
                                                <a href={app.jobLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors">
                                                    [ İlanı Aç ]
                                                </a>
                                            )}
                                            <button
                                                onClick={() => setSelectedApp(app)}
                                                className="inline-flex items-center justify-center rounded-full bg-black/5 px-4 py-1.5 text-xs font-semibold text-black hover:bg-black/10 transition-colors"
                                            >
                                                Detaylar
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </Reveal>

            {/* Action Details Modal */}
            <AnimatePresence>
                {selectedApp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-md p-4 sm:p-6"
                        onClick={() => setSelectedApp(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="absolute top-6 right-6 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                            >
                                <X size={20} className="text-black/70" />
                            </button>

                            <div className="mb-8">
                                <div className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wide">
                                    Başvuru Detayı
                                </div>
                                <h3 className="text-3xl font-bold tracking-tight text-black">{selectedApp.companyName}</h3>
                                <div className="text-lg text-black/60 mt-1">{selectedApp.position}</div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div>
                                    <div className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Başvuru Tarihi</div>
                                    <div className="text-base text-black font-medium">{new Date(selectedApp.date).toLocaleDateString('tr-TR')}</div>
                                </div>

                                <div>
                                    <div className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Durum</div>
                                    <span className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-sm font-medium text-black/80">
                                        {selectedApp.status}
                                    </span>
                                </div>

                                <div className="sm:col-span-2">
                                    <div className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Süreç Notları & Yorumlar</div>
                                    <div className="text-base text-black/80 bg-black/5 rounded-2xl p-4 min-h-[80px]">
                                        {selectedApp.comments || 'Henüz not eklenmemiş.'}
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <div className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Motivasyon / Ek Notlar</div>
                                    <div className="text-base text-black/80 bg-black/5 rounded-2xl p-4 min-h-[80px]">
                                        {selectedApp.motivation || 'Motivasyon yazısı bulunmuyor.'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">İK Görüşmesi</div>
                                    <div className="text-base text-black font-medium">{selectedApp.hrInterview || '-'}</div>
                                </div>

                                <div>
                                    <div className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Teknik / Diğer Mülakat</div>
                                    <div className="text-base text-black font-medium">{selectedApp.otherInterviews || '-'}</div>
                                </div>

                                {selectedApp.testLink && (
                                    <div className="sm:col-span-2">
                                        <div className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Değerlendirme Testi</div>
                                        <a href={selectedApp.testLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:underline font-medium">
                                            Teste Git ↗
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Applications;
