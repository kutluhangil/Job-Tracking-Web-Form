import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import type { Application } from '../store/useAppStore';
import { useLanguage } from '../lib/i18n';

const fd = (d = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: d, ease: 'easeOut' as const }
});

const inputCls = "w-full rounded-xl border border-black/8 bg-[#fafafa] px-4 py-3 text-sm font-medium text-black transition-all placeholder:text-black/25 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-300";
const selectCls = "w-full rounded-xl border border-black/8 bg-[#fafafa] px-4 py-3 text-sm font-medium text-black transition-all focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-300 appearance-none";

const SectionCard = ({ title, icon, children, delay = 0 }: {
    title: string; icon: string; children: React.ReactNode; delay?: number
}) => (
    <motion.div {...fd(delay)} className="bg-white rounded-[24px] border border-black/5 shadow-[0_2px_24px_#00000008] overflow-hidden">
        <div className="flex items-center gap-3 px-6 sm:px-8 py-4 sm:py-5 border-b border-black/5">
            <span className="text-lg">{icon}</span>
            <h3 className="text-sm font-bold text-[#1d1d1f]">{title}</h3>
        </div>
        <div className="px-6 sm:px-8 py-5 sm:py-6 grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </motion.div>
);

const Field = ({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) => (
    <div className={`space-y-1.5 ${full ? 'sm:col-span-2' : ''}`}>
        <label className="text-xs font-bold uppercase tracking-wider text-black/40">{label}</label>
        {children}
    </div>
);

const SelectWrap = ({ name, value, onChange, options }: {
    name: string; value?: string;
    onChange: React.ChangeEventHandler<HTMLSelectElement>;
    options: string[];
}) => (
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
    const { t } = useLanguage();
    const [showToast, setShowToast] = useState(false);

    const [form, setForm] = useState<Partial<Application>>({
        companyName: '',
        position: '',
        jobLink: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Süreçte',
        city: 'İstanbul',
        country: 'Türkiye',
        workType: 'Hibrit',
        contractType: 'Tam Zamanlı',
        platform: 'LinkedIn',
        cvVersion: 'V1 Düz',
        testLink: '',
        motivation: '',
        // Process notes (oldAfterApply, comments, hrInterview, otherInterviews, feedback stored in these fields)
        notes: '',         // afterApply / genel notlar
        interviewNotes: '', // diğer mülakat notları
        hrName: '',         // İK Görüşmesi (kişi + özet)
        rejectionReason: '', // diğer mülakat süreçleri
        tags: '',           // yorumlar
    });

    const hc = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.companyName && form.position) {
            addApplication(form as Omit<Application, 'id' | 'no' | 'createdAt'>);
            setShowToast(true);
            setTimeout(() => { setShowToast(false); navigate('/dashboard'); }, 1700);
        }
    };

    const statusOptions = ['Süreçte', 'Görüşme Bekleniyor', 'Teknik Mülakat', 'İK Mülakatı', 'Vaka / Ödev', 'Teklif Alındı', 'Olumlu', 'Reddedildi', 'İptal', 'Yanıt Yok'];

    return (
        <div className="w-full min-h-screen bg-[#f8f8fa]">
            <div className="mx-auto max-w-[860px] px-4 sm:px-6 pt-20 sm:pt-24 pb-32">

                <motion.div {...fd(0)} className="mb-8 sm:mb-10">
                    <p className="text-xs font-bold tracking-[0.18em] text-black/40 uppercase mb-2">{t('add.title')}</p>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f] mb-2">{t('add.title')}</h1>
                    <p className="text-sm text-black/50">{t('add.subtitle')}</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* ── 1. Temel Bilgiler ─────────────────────────────── */}
                    <SectionCard title={t('add.section.core')} icon="🏢" delay={0.08}>
                        <Field label={t('add.company')}>
                            <input name="companyName" type="text" value={form.companyName} onChange={hc} required placeholder="Apple" className={inputCls} />
                        </Field>
                        <Field label={t('add.position')}>
                            <input name="position" type="text" value={form.position} onChange={hc} required placeholder="Frontend Developer" className={inputCls} />
                        </Field>
                        <Field label={t('add.date')}>
                            <input name="date" type="date" value={form.date} onChange={hc} required className={inputCls} />
                        </Field>
                        <Field label={t('add.status')}>
                            <SelectWrap name="status" value={form.status} onChange={hc} options={statusOptions} />
                        </Field>
                        <Field label={t('add.jobLink')} full>
                            <input name="jobLink" type="url" value={form.jobLink} onChange={hc} placeholder="https://..." className={inputCls} />
                        </Field>
                    </SectionCard>

                    {/* ── 2. Konum & Çalışma ───────────────────────────── */}
                    <SectionCard title={t('add.section.location')} icon="📍" delay={0.12}>
                        <Field label={t('add.city')}>
                            <input name="city" type="text" value={form.city} onChange={hc} placeholder="İstanbul" className={inputCls} />
                        </Field>
                        <Field label={t('add.country')}>
                            <input name="country" type="text" value={form.country} onChange={hc} placeholder="Türkiye" className={inputCls} />
                        </Field>
                        <Field label={t('add.workType')}>
                            <SelectWrap name="workType" value={form.workType} onChange={hc} options={['Uzaktan', 'Hibrit', 'Ofis', 'Belirtilmedi']} />
                        </Field>
                        <Field label={t('add.contractType')}>
                            <SelectWrap name="contractType" value={form.contractType} onChange={hc} options={['Tam Zamanlı', 'Yarı Zamanlı', 'Staj', 'Sözleşmeli', 'Freelance']} />
                        </Field>
                    </SectionCard>

                    {/* ── 3. Platform & Döküman ─────────────────────────── */}
                    <SectionCard title={t('add.section.platform')} icon="📄" delay={0.16}>
                        <Field label={t('add.platform')}>
                            <SelectWrap name="platform" value={form.platform} onChange={hc} options={['LinkedIn', 'Kariyer.net', 'Indeed', 'Glassdoor', 'Şirket Web Sitesi', 'Referans', 'E-posta', 'Diğer']} />
                        </Field>
                        <Field label={t('add.cvVersion')}>
                            <SelectWrap name="cvVersion" value={form.cvVersion} onChange={hc} options={['V1 Düz', 'V2 Tasarım', 'V3 İngilizce', 'V4 Kıdemli', 'Özel']} />
                        </Field>
                        <Field label={t('add.testLink')} full>
                            <input name="testLink" type="url" value={form.testLink} onChange={hc} placeholder="https://..." className={inputCls} />
                        </Field>
                        <Field label={t('add.motivation')} full>
                            <textarea name="motivation" value={form.motivation} onChange={hc} rows={4} placeholder="Başvururken yazdığınız motivasyon yazısı veya kapak mektubu..."
                                className={inputCls + " resize-none"} />
                        </Field>
                    </SectionCard>

                    {/* ── 4. Süreç Notları ─────────────────────────────── */}
                    <SectionCard title={t('add.section.process')} icon="📋" delay={0.2}>
                        <Field label={t('add.afterApply')} full>
                            <textarea name="notes" value={form.notes} onChange={hc} rows={3} placeholder="Başvurudan sonra ne oldu? Geri dönüş geldi mi?"
                                className={inputCls + " resize-none"} />
                        </Field>
                        <Field label={t('add.comments')} full>
                            <textarea name="tags" value={form.tags} onChange={hc} rows={2} placeholder="Kişisel yorumlar, notlar..."
                                className={inputCls + " resize-none"} />
                        </Field>
                        <Field label={t('add.hrInterview')} full>
                            <input name="hrName" type="text" value={form.hrName} onChange={hc} placeholder="İK Görüşmesi — kişi adı, tarih, kısa özet..." className={inputCls} />
                        </Field>
                        <Field label={t('add.otherInterviews')} full>
                            <textarea name="rejectionReason" value={form.rejectionReason} onChange={hc} rows={2} placeholder="Teknik mülakat, vaka çalışması, panel görüşmesi..."
                                className={inputCls + " resize-none"} />
                        </Field>
                        <Field label={t('add.feedback')} full>
                            <textarea name="interviewNotes" value={form.interviewNotes} onChange={hc} rows={3} placeholder="Alınan geri bildirimler, genel izlenimler, öğrendikleriniz..."
                                className={inputCls + " resize-none"} />
                        </Field>
                    </SectionCard>

                    {/* Submit Buttons */}
                    <motion.div {...fd(0.24)} className="flex flex-col-reverse sm:flex-row justify-end gap-3 pb-12">
                        <button type="button" onClick={() => navigate(-1)}
                            className="w-full sm:w-auto rounded-full border border-black/10 bg-white px-8 py-3.5 text-sm font-semibold text-black/70 transition-all hover:bg-black/5">
                            {t('add.cancel')}
                        </button>
                        <button type="submit"
                            className="w-full sm:w-auto rounded-full px-10 py-3.5 text-sm font-bold text-white transition-all hover:shadow-[0_8px_24px_rgba(249,115,22,0.35)] hover:-translate-y-0.5"
                            style={{ background: 'linear-gradient(135deg, #f97316, #ec4899, #a855f7)' }}>
                            {t('add.save')}
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
                            {t('add.saved')}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AddApplication;
