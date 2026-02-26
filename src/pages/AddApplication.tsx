import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import type { Application } from '../store/useAppStore';

const fd = (d = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: d, ease: 'easeOut' as const }
});

const SectionCard = ({ title, icon, children, delay = 0 }: {
    title: string; icon: string; children: React.ReactNode; delay?: number
}) => (
    <motion.div {...fd(delay)} className="bg-white rounded-[24px] border border-black/5 shadow-[0_2px_24px_#00000008] overflow-hidden">
        <div className="flex items-center gap-3 px-8 py-5 border-b border-black/5">
            <span className="text-lg">{icon}</span>
            <h3 className="text-sm font-bold text-[#1d1d1f] tracking-tight">{title}</h3>
        </div>
        <div className="px-8 py-6 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </motion.div>
);

const Field = ({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) => (
    <div className={`space-y-1.5 ${full ? 'sm:col-span-2' : ''}`}>
        <label className="text-xs font-bold uppercase tracking-wider text-black/40">{label}</label>
        {children}
    </div>
);

const inputCls = "w-full rounded-xl border border-black/8 bg-[#fafafa] px-4 py-3 text-sm font-medium text-black transition-all placeholder:text-black/25 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-300";
const selectCls = inputCls + " appearance-none pr-10";

const Select = ({ name, value, onChange, options }: { name: string; value?: string; onChange: React.ChangeEventHandler<HTMLSelectElement>; options: string[] }) => (
    <div className="relative">
        <select name={name} value={value} onChange={onChange} className={selectCls}>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/30">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
    </div>
);

const AddApplication = () => {
    const navigate = useNavigate();
    const addApplication = useAppStore(state => state.addApplication);
    const [showToast, setShowToast] = useState(false);

    const [formData, setFormData] = useState<Partial<Application>>({
        companyName: '',
        position: '',
        department: '',
        jobLink: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Süreçte',
        city: 'İstanbul',
        country: 'Türkiye',
        workType: 'Hibrit',
        contractType: 'Tam Zamanlı',
        platform: 'LinkedIn',
        cvVersion: 'V1 Düz',
        priority: 'Orta',
        salaryMin: '',
        salaryMax: '',
        salaryCurrency: 'TRY',
        salaryPeriod: 'Aylık',
        motivation: '',
        testLink: '',
        hrName: '',
        hrEmail: '',
        interviewDate: '',
        interviewNotes: '',
        followUpDate: '',
        offerAmount: '',
        rejectionReason: '',
        tags: '',
        notes: '',
    });

    const hc = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.companyName && formData.position) {
            addApplication(formData as Omit<Application, 'id' | 'no' | 'createdAt'>);
            setShowToast(true);
            setFormData({
                companyName: '', position: '', department: '', jobLink: '',
                date: new Date().toISOString().split('T')[0], status: 'Süreçte',
                city: 'İstanbul', country: 'Türkiye', workType: 'Hibrit',
                contractType: 'Tam Zamanlı', platform: 'LinkedIn', cvVersion: 'V1 Düz',
                priority: 'Orta', salaryMin: '', salaryMax: '', salaryCurrency: 'TRY',
                salaryPeriod: 'Aylık', motivation: '', testLink: '', hrName: '', hrEmail: '',
                interviewDate: '', interviewNotes: '', followUpDate: '', offerAmount: '',
                rejectionReason: '', tags: '', notes: '',
            });
            setTimeout(() => { setShowToast(false); navigate('/dashboard'); }, 1600);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#f8f8fa]">
            <div className="mx-auto max-w-[920px] px-6 pt-24 pb-32">

                <motion.div {...fd(0)} className="mb-10">
                    <p className="text-xs font-bold tracking-[0.18em] text-black/40 uppercase mb-2">Yeni Kayıt</p>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-orange-400 via-rose-500 to-violet-500 bg-clip-text text-transparent mb-3">
                        Başvuru Ekle
                    </h1>
                    <p className="text-base text-black/50 leading-relaxed">Tüm detayları eksiksiz doldurun, analiz daha isabetli olsun.</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* ── 1. TEMEL BİLGİLER ──────────────────────────────── */}
                    <SectionCard title="Temel Bilgiler" icon="🏢" delay={0.08}>
                        <Field label="Firma Adı">
                            <input name="companyName" type="text" value={formData.companyName} onChange={hc} required placeholder="Örn. Apple" className={inputCls} />
                        </Field>
                        <Field label="Pozisyon">
                            <input name="position" type="text" value={formData.position} onChange={hc} required placeholder="Frontend Developer" className={inputCls} />
                        </Field>
                        <Field label="Departman">
                            <input name="department" type="text" value={formData.department} onChange={hc} placeholder="Ürün & Mühendislik" className={inputCls} />
                        </Field>
                        <Field label="Başvuru Tarihi">
                            <input name="date" type="date" value={formData.date} onChange={hc} required className={inputCls} />
                        </Field>
                        <Field label="Durum">
                            <Select name="status" value={formData.status} onChange={hc} options={[
                                'Süreçte', 'Görüşme Bekleniyor', 'Teknik Mülakat', 'İK Mülakatı',
                                'Vaka / Ödev', 'Teklif Alındı', 'Olumlu', 'Reddedildi', 'İptal', 'Yanıt Yok'
                            ]} />
                        </Field>
                        <Field label="Öncelik">
                            <Select name="priority" value={formData.priority} onChange={hc} options={['Düşük', 'Orta', 'Yüksek']} />
                        </Field>
                        <Field label="İş İlanı Linki" full>
                            <input name="jobLink" type="url" value={formData.jobLink} onChange={hc} placeholder="https://" className={inputCls} />
                        </Field>
                        <Field label="Etiketler (virgülle ayır)" full>
                            <input name="tags" type="text" value={formData.tags} onChange={hc} placeholder="react, remote, ürün, startup" className={inputCls} />
                        </Field>
                    </SectionCard>

                    {/* ── 2. KONUM & ÇALIŞMA ──────────────────────────────── */}
                    <SectionCard title="Konum & Çalışma Biçimi" icon="📍" delay={0.12}>
                        <Field label="Şehir">
                            <input name="city" type="text" value={formData.city} onChange={hc} placeholder="İstanbul" className={inputCls} />
                        </Field>
                        <Field label="Ülke">
                            <input name="country" type="text" value={formData.country} onChange={hc} placeholder="Türkiye" className={inputCls} />
                        </Field>
                        <Field label="Çalışma Biçimi">
                            <Select name="workType" value={formData.workType} onChange={hc} options={['Uzaktan', 'Hibrit', 'Ofis', 'Belirtilmedi']} />
                        </Field>
                        <Field label="Sözleşme Türü">
                            <Select name="contractType" value={formData.contractType} onChange={hc} options={['Tam Zamanlı', 'Yarı Zamanlı', 'Staj', 'Sözleşmeli', 'Freelance']} />
                        </Field>
                    </SectionCard>

                    {/* ── 3. MAAŞ ─────────────────────────────────────────── */}
                    <SectionCard title="Maaş & Ücret Beklentisi" icon="💰" delay={0.16}>
                        <Field label="Minimum (net)">
                            <input name="salaryMin" type="number" value={formData.salaryMin} onChange={hc} placeholder="40000" className={inputCls} />
                        </Field>
                        <Field label="Maksimum (net)">
                            <input name="salaryMax" type="number" value={formData.salaryMax} onChange={hc} placeholder="60000" className={inputCls} />
                        </Field>
                        <Field label="Para Birimi">
                            <Select name="salaryCurrency" value={formData.salaryCurrency} onChange={hc} options={['TRY', 'USD', 'EUR', 'GBP', 'CHF']} />
                        </Field>
                        <Field label="Periyot">
                            <Select name="salaryPeriod" value={formData.salaryPeriod} onChange={hc} options={['Aylık', 'Yıllık']} />
                        </Field>
                    </SectionCard>

                    {/* ── 4. PLATFORM & CV ────────────────────────────────── */}
                    <SectionCard title="Platform & Doküman" icon="📄" delay={0.2}>
                        <Field label="Platform">
                            <Select name="platform" value={formData.platform} onChange={hc} options={['LinkedIn', 'Kariyer.net', 'Indeed', 'Glassdoor', 'Şirket Web Sitesi', 'Referans', 'E-posta', 'Diğer']} />
                        </Field>
                        <Field label="CV Versiyonu">
                            <Select name="cvVersion" value={formData.cvVersion} onChange={hc} options={['V1 Düz', 'V2 Tasarım', 'V3 İngilizce', 'V4 Kıdemli', 'Özel']} />
                        </Field>
                        <Field label="Test / Ödev Linki" full>
                            <input name="testLink" type="url" value={formData.testLink} onChange={hc} placeholder="https://" className={inputCls} />
                        </Field>
                        <Field label="Motivasyon Yazısı / Notlar" full>
                            <textarea name="motivation" value={formData.motivation} onChange={hc} rows={3} placeholder="Başvururken yazdığınız yazı veya özel notlar..."
                                className={inputCls + " resize-none"} />
                        </Field>
                    </SectionCard>

                    {/* ── 5. İLETİŞİM & MÜLAKAT ──────────────────────────── */}
                    <SectionCard title="İletişim & Mülakat Takibi" icon="📅" delay={0.24}>
                        <Field label="İK / Recruiter Adı">
                            <input name="hrName" type="text" value={formData.hrName} onChange={hc} placeholder="Ayşe Demir" className={inputCls} />
                        </Field>
                        <Field label="İK E-postası">
                            <input name="hrEmail" type="email" value={formData.hrEmail} onChange={hc} placeholder="hr@sirket.com" className={inputCls} />
                        </Field>
                        <Field label="Mülakat Tarihi">
                            <input name="interviewDate" type="date" value={formData.interviewDate} onChange={hc} className={inputCls} />
                        </Field>
                        <Field label="Takip Tarihi (Follow-up)">
                            <input name="followUpDate" type="date" value={formData.followUpDate} onChange={hc} className={inputCls} />
                        </Field>
                        <Field label="Mülakat Notları" full>
                            <textarea name="interviewNotes" value={formData.interviewNotes} onChange={hc} rows={3} placeholder="Sorular, izlenimler, geri bildirimler..."
                                className={inputCls + " resize-none"} />
                        </Field>
                    </SectionCard>

                    {/* ── 6. SONUÇ ────────────────────────────────────────── */}
                    <SectionCard title="Sonuç (varsa)" icon="🎯" delay={0.28}>
                        <Field label="Teklif Tutarı">
                            <input name="offerAmount" type="text" value={formData.offerAmount} onChange={hc} placeholder="55.000 TRY/ay" className={inputCls} />
                        </Field>
                        <Field label="Red Nedeni">
                            <input name="rejectionReason" type="text" value={formData.rejectionReason} onChange={hc} placeholder="Deneyim eksikliği / Bütçe / Kültür uyumu..." className={inputCls} />
                        </Field>
                        <Field label="Ek Notlar" full>
                            <textarea name="notes" value={formData.notes} onChange={hc} rows={3} placeholder="Genel izlenimler, gelecek için hatırlatmalar..."
                                className={inputCls + " resize-none"} />
                        </Field>
                    </SectionCard>

                    {/* Submit */}
                    <motion.div {...fd(0.32)} className="flex flex-col sm:flex-row justify-end gap-3 pb-12">
                        <button type="button" onClick={() => navigate(-1)}
                            className="w-full sm:w-auto rounded-full border border-black/10 bg-white px-8 py-3.5 text-sm font-semibold text-black/70 transition-all hover:border-black/20 hover:bg-black/5">
                            İptal
                        </button>
                        <button type="submit"
                            className="w-full sm:w-auto rounded-full bg-gradient-to-r from-orange-400 via-rose-500 to-violet-500 px-10 py-3.5 text-sm font-bold text-white transition-all hover:shadow-[0_8px_24px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 hover:scale-[1.02]">
                            Kaydet
                        </button>
                    </motion.div>
                </form>

                <AnimatePresence>
                    {showToast && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, x: '-50%' }}
                            animate={{ opacity: 1, y: 0, x: '-50%' }}
                            exit={{ opacity: 0, y: 20, x: '-50%' }}
                            className="fixed bottom-32 left-1/2 z-50 rounded-full bg-white border border-black/10 shadow-2xl px-6 py-3 text-sm font-semibold text-[#1d1d1f] flex items-center gap-2"
                        >
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            Başvuru başarıyla kaydedildi
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AddApplication;
