import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import type { Application } from '../store/useAppStore';
import { Text, Caption } from '../components/common/Typography';
import { Reveal } from '../components/common/Reveal';

const AddApplication = () => {
    const navigate = useNavigate();
    const addApplication = useAppStore(state => state.addApplication);

    const [formData, setFormData] = useState<Partial<Application>>({
        companyName: '',
        position: '',
        jobLink: '',
        date: new Date().toISOString().split('T')[0],
        motivation: '',
        postApplication: '',
        status: 'Süreçte',
        comments: '',
        hrInterview: '',
        notes: '',
        otherInterviews: '',
        notes2: '',
        testLink: '',
        cvVersion: 'V1 Düz',
        motivationTemplate: '',
        city: 'İstanbul',
        platform: 'LinkedIn'
    });

    const [showToast, setShowToast] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.companyName && formData.position) {
            addApplication(formData as Omit<Application, 'id' | 'no' | 'createdAt'>);
            setShowToast(true);

            // Clear form state
            setFormData({
                companyName: '',
                position: '',
                jobLink: '',
                date: new Date().toISOString().split('T')[0],
                motivation: '',
                postApplication: '',
                status: 'Süreçte',
                comments: '',
                hrInterview: '',
                notes: '',
                otherInterviews: '',
                notes2: '',
                testLink: '',
                cvVersion: 'V1 Düz',
                motivationTemplate: '',
                city: 'İstanbul',
                platform: 'LinkedIn'
            });

            setTimeout(() => {
                setShowToast(false);
                navigate('/dashboard');
            }, 1500);
        }
    };

    return (
        <div className="mx-auto max-w-[900px] px-6 pt-24 pb-32">
            <Reveal direction="down" duration={0.6}>
                <Caption>YENİ KAYIT</Caption>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <h1 className="mt-1 text-[clamp(36px,5vw,48px)] font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">
                        Başvuru Ekle
                    </h1>
                </div>
                <Text className="mt-2 text-black/60 max-w-xl">
                    Mülakat sürecini başlatıp detayları kayıt altına alın.
                </Text>
            </Reveal>

            <form onSubmit={handleSubmit} className="mt-12 space-y-10">
                <Reveal direction="up" delay={0.2}>
                    {/* Main Group */}
                    <div className="apple-card p-8 flex flex-col gap-6">
                        <h3 className="text-xl font-medium tracking-tight">Temel Bilgiler</h3>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-black/70">Firma Adı</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Örn. Apple"
                                    className="w-full rounded-xl border border-black/10 bg-[#fbfbfd] px-4 py-3 text-base text-black transition-all placeholder:text-black/30 focus-gradient-ring"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-black/70">
                                    Pozisyon
                                </label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    required
                                    placeholder="Frontend Developer"
                                    className="w-full rounded-xl border border-black/10 bg-[#fbfbfd] px-4 py-3 text-base text-black transition-all placeholder:text-black/30 focus-gradient-ring"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-black/70">
                                    Tarih
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-black/10 bg-[#fbfbfd] px-4 py-3 text-base text-black transition-all focus-gradient-ring"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-black/70">
                                    Durum
                                </label>
                                <div className="relative">
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full appearance-none rounded-xl border border-black/10 bg-[#fbfbfd] px-4 py-3 pr-10 text-base text-black transition-all focus-gradient-ring"
                                    >
                                        <option value="Süreçte">Süreçte</option>
                                        <option value="Görüşme Bekleniyor">Görüşme Bekleniyor</option>
                                        <option value="Teklif Alındı">Teklif Alındı</option>
                                        <option value="Olumlu">Olumlu</option>
                                        <option value="Reddedildi">Reddedildi</option>
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-black/70">İş İlanı Linki</label>
                            <input
                                type="url"
                                name="jobLink"
                                value={formData.jobLink}
                                onChange={handleChange}
                                placeholder="https://"
                                className="w-full rounded-xl border border-black/10 bg-[#fbfbfd] px-4 py-3 text-base text-black transition-all placeholder:text-black/30 focus-gradient-ring"
                            />
                        </div>
                    </div>
                </Reveal>

                {/* Optional Data Card */}
                <Reveal direction="up" delay={0.2}>
                    <div className="apple-card p-8 flex flex-col gap-6">
                        <h3 className="text-xl font-medium tracking-tight">Detaylar & Analiz</h3>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-black/70">Şehir</label>
                                <input
                                    type="text"
                                    name="city" // Changed from 'location' to 'city' to match formData
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="İstanbul"
                                    className="w-full rounded-xl border border-black/10 bg-[#fbfbfd] px-4 py-3 text-base text-black transition-all placeholder:text-black/30 focus-gradient-ring"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-black/70">
                                    Platform
                                </label>
                                <input
                                    type="text"
                                    name="platform"
                                    value={formData.platform}
                                    onChange={handleChange}
                                    placeholder="LinkedIn"
                                    className="w-full rounded-xl border border-black/10 bg-[#fbfbfd] px-4 py-3 text-base text-black transition-all placeholder:text-black/30 focus-gradient-ring"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-black/70">
                                    CV Versiyonu
                                </label>
                                <div className="relative">
                                    <select
                                        name="cvVersion"
                                        value={formData.cvVersion}
                                        onChange={handleChange}
                                        className="w-full appearance-none rounded-xl border border-black/10 bg-[#fbfbfd] px-4 py-3 pr-10 text-base text-black transition-all focus-gradient-ring"
                                    >
                                        <option value="V1 Düz">V1 Düz</option>
                                        <option value="V2 Tasarım">V2 Tasarım</option>
                                        <option value="V3 İngilizce">V3 İngilizce</option> {/* Changed from V3 Global to V3 İngilizce to match initial state */}
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-full space-y-2">
                                <label className="text-sm font-medium text-black/70">
                                    Motivasyon Yazısı / Notlar
                                </label>
                                <textarea
                                    name="motivation"
                                    value={formData.motivation}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Başvururken yazdığınız yazı veya ek notlar..."
                                    className="w-full resize-none rounded-xl border border-black/10 bg-[#fbfbfd] px-4 py-3 text-base text-black transition-all placeholder:text-black/30 focus-gradient-ring"
                                />
                            </div>

                            <div className="col-span-full space-y-2">
                                <label className="text-sm font-medium text-black/70">
                                    Test Linki
                                </label>
                                <input
                                    type="url"
                                    name="testLink"
                                    value={formData.testLink}
                                    onChange={handleChange}
                                    placeholder="https://"
                                    className="w-full rounded-xl border border-black/10 bg-[#fbfbfd] px-4 py-3 text-base text-black transition-all placeholder:text-black/30 focus-gradient-ring"
                                />
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Submit Action */}
                <Reveal direction="up" delay={0.3}>
                    <div className="flex justify-end pt-4 pb-12 w-full max-w-[900px] mx-auto">
                        <button
                            type="submit"
                            className="btn-gradient w-[160px] py-4 text-center rounded-2xl font-bold tracking-wide"
                        >
                            Kaydet
                        </button>
                    </div>
                </Reveal>
            </form>

            {/* Success Toast */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 50, x: '-50%' }}
                        className="fixed bottom-32 left-1/2 z-50 rounded-full bg-black/80 backdrop-blur-md px-6 py-3 text-white shadow-2xl flex items-center gap-2"
                    >
                        <div className="h-2 w-2 rounded-full bg-green-400" />
                        Başvuru başarıyla kaydedildi
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AddApplication;
