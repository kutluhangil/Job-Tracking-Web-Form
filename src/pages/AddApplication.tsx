import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import type { Application } from '../store/useAppStore';
import { H2, Text, Caption } from '../components/common/Typography';
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
            setTimeout(() => {
                setShowToast(false);
                navigate('/');
            }, 1500);
        }
    };

    return (
        <div className="mx-auto max-w-3xl px-6 pt-24 pb-48">

            <Reveal direction="down" duration={0.6}>
                <Caption>Yeni Kayıt</Caption>
                <H2 className="mt-1">Başvuru Ekle</H2>
                <Text className="mt-2">Mülakat sürecini başlat.</Text>
            </Reveal>

            <Reveal direction="up" delay={0.2} className="mt-12">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">

                    {/* Main Group */}
                    <div className="apple-card p-8 flex flex-col gap-6">
                        <h3 className="text-xl font-medium tracking-tight">Temel Bilgiler</h3>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="companyName" className="mb-2 block text-sm font-medium text-black/70">Firma Adı</label>
                                <input
                                    id="companyName"
                                    type="text"
                                    name="companyName"
                                    required
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 outline-none transition-all focus:border-[#0071e3] focus:bg-white focus:ring-2 focus:ring-[#0071e3]/20"
                                    placeholder="Örn. Apple"
                                />
                            </div>

                            <div>
                                <label htmlFor="position" className="mb-2 block text-sm font-medium text-black/70">Pozisyon</label>
                                <input
                                    id="position"
                                    type="text"
                                    name="position"
                                    required
                                    value={formData.position}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 outline-none transition-all focus:border-[#0071e3] focus:bg-white focus:ring-2 focus:ring-[#0071e3]/20"
                                    placeholder="Frontend Developer"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="date" className="mb-2 block text-sm font-medium text-black/70">Tarih</label>
                                <input
                                    id="date"
                                    type="date"
                                    name="date"
                                    required
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 outline-none transition-all focus:border-[#0071e3] focus:bg-white focus:ring-2 focus:ring-[#0071e3]/20"
                                />
                            </div>

                            <div>
                                <label htmlFor="status" className="mb-2 block text-sm font-medium text-black/70">Durum</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 outline-none transition-all focus:border-[#0071e3] focus:bg-white focus:ring-2 focus:ring-[#0071e3]/20"
                                >
                                    <option value="Süreçte">Süreçte</option>
                                    <option value="Görüşme Bekleniyor">Görüşme Bekleniyor</option>
                                    <option value="Teklif Alındı">Teklif Alındı</option>
                                    <option value="Olumlu">Olumlu</option>
                                    <option value="Reddedildi">Reddedildi</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="jobLink" className="mb-2 block text-sm font-medium text-black/70">İş İlanı Linki</label>
                            <input
                                id="jobLink"
                                type="url"
                                name="jobLink"
                                value={formData.jobLink}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 outline-none transition-all focus:border-[#0071e3] focus:bg-white focus:ring-2 focus:ring-[#0071e3]/20"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Details Group */}
                    <div className="apple-card p-8 flex flex-col gap-6">
                        <h3 className="text-xl font-medium tracking-tight">Detaylar & Analiz</h3>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div>
                                <label htmlFor="city" className="mb-2 block text-sm font-medium text-black/70">Şehir</label>
                                <input
                                    id="city"
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 outline-none transition-all focus:border-[#0071e3] focus:bg-white focus:ring-2 focus:ring-[#0071e3]/20"
                                />
                            </div>
                            <div>
                                <label htmlFor="platform" className="mb-2 block text-sm font-medium text-black/70">Platform</label>
                                <input
                                    id="platform"
                                    type="text"
                                    name="platform"
                                    value={formData.platform}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 outline-none transition-all focus:border-[#0071e3] focus:bg-white focus:ring-2 focus:ring-[#0071e3]/20"
                                />
                            </div>
                            <div>
                                <label htmlFor="cvVersion" className="mb-2 block text-sm font-medium text-black/70">CV Versiyonu</label>
                                <select
                                    id="cvVersion"
                                    name="cvVersion"
                                    value={formData.cvVersion}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 outline-none transition-all focus:border-[#0071e3] focus:bg-white focus:ring-2 focus:ring-[#0071e3]/20"
                                >
                                    <option value="V1 Düz">V1 Düz</option>
                                    <option value="V2 Tasarım">V2 Tasarım</option>
                                    <option value="V3 İngilizce">V3 İngilizce</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="motivation" className="mb-2 block text-sm font-medium text-black/70">Motivasyon Yazısı / Notlar</label>
                            <textarea
                                id="motivation"
                                name="motivation"
                                value={formData.motivation}
                                onChange={handleChange}
                                rows={4}
                                className="w-full resize-none rounded-xl border border-black/10 bg-black/5 px-4 py-3 outline-none transition-all focus:border-[#0071e3] focus:bg-white focus:ring-2 focus:ring-[#0071e3]/20"
                                placeholder="Başvururken yazdığınız yazı veya ek notlar..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="rounded-full bg-black px-10 py-4 text-white font-medium transition-transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                            Kaydet
                        </button>
                    </div>
                </form>
            </Reveal>

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
                        Başvuru başarıyla eklendi!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AddApplication;
