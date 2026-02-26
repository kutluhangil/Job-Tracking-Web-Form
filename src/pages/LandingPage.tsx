import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { H2, Text, Caption, AnimatedTitle } from '../components/common/Typography';
import { Reveal } from '../components/common/Reveal';
import { Navbar } from '../components/layout/Navbar';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen w-full bg-[#fbfbfd] text-[#1d1d1f] selection:bg-[#0071e3] selection:text-white">
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pt-20 text-center">
                <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] mix-blend-overlay"></div>

                <div className="relative z-10 flex max-w-[1200px] flex-col items-center pt-20">
                    <Reveal direction="up" delay={0.1} duration={1}>
                        <AnimatedTitle className="mb-4">
                            Geleceğini<br />Yönet
                        </AnimatedTitle>
                    </Reveal>

                    <Reveal direction="up" delay={0.4} duration={1}>
                        <h2 className="mt-8 text-[clamp(24px,4vw,48px)] font-medium tracking-tight text-black/60">
                            İş Başvurularını <br className="md:hidden" /> Akıllıca Takip Et.
                        </h2>
                    </Reveal>

                    <Reveal direction="up" delay={0.6} duration={1}>
                        <Text className="mx-auto mt-6 max-w-xl text-[clamp(18px,2vw,24px)] leading-relaxed">
                            NextStep, iş başvuru süreçlerinizi takip etmenin en zarif ve güçlü yoludur. Karmaşık Excel tablolarını geride bırakın.
                        </Text>
                    </Reveal>

                    <Reveal direction="up" delay={0.8} duration={1}>
                        <div className="mt-12 flex items-center justify-center gap-6 w-full px-6 md:px-0">
                            <button
                                onClick={() => navigate('/login')}
                                className="animated-border-button w-full md:w-auto px-10 py-4 text-lg font-medium"
                            >
                                Hemen Başla
                            </button>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* FEATURE SHOWCASE */}
            <section className="relative z-10 mx-auto max-w-[1400px] px-6 py-20 md:py-[120px]">
                <div className="flex flex-col gap-20 md:gap-[120px]">
                    <div className="flex flex-col items-center gap-16 md:flex-row">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="order-2 flex-1 md:order-1 w-full"
                        >
                            <div className="rounded-[24px] bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden p-6 relative">
                                {/* Decorative Dashboard Mockup */}
                                <div className="w-full flex items-center justify-between mb-8">
                                    <div className="w-32 h-6 bg-black/5 rounded-full" />
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-full bg-black/5" />
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-black/5">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 mb-3" />
                                        <div className="w-16 h-4 bg-black/5 rounded-full mb-2" />
                                        <div className="w-24 h-6 bg-black/10 rounded-full" />
                                    </div>
                                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-black/5">
                                        <div className="w-8 h-8 rounded-full bg-rose-500/10 mb-3" />
                                        <div className="w-16 h-4 bg-black/5 rounded-full mb-2" />
                                        <div className="w-24 h-6 bg-black/10 rounded-full" />
                                    </div>
                                </div>

                                <div className="w-full h-32 bg-white rounded-2xl shadow-sm border border-black/5 p-4 flex flex-col justify-end gap-2">
                                    <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
                                        <div className="w-3/4 h-full bg-blue-500 rounded-full" />
                                    </div>
                                    <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
                                        <div className="w-1/2 h-full bg-teal-400 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        <Reveal direction="left" className="order-1 flex-1 flex flex-col items-start md:order-2 md:pl-12">
                            <Caption className="text-[#0071e3]">Sıfır Karmaşa</Caption>
                            <H2 className="mt-4">Her şey gözünüzün <br /> önünde.</H2>
                            <Text className="mt-6 max-w-md">
                                Bırakın karmaşıklığı algoritmalar çözsün. Siz sadece mülakatlarınıza odaklanın. Minimal arayüz ile başvuru süreçleriniz tam kontrolünüzde.
                            </Text>
                        </Reveal>
                    </div>

                    <div className="flex flex-col items-center gap-16 md:flex-row">
                        <Reveal direction="right" className="flex-1 flex flex-col items-start md:pr-12">
                            <Caption className="text-rose-500">Güçlü Analiz</Caption>
                            <H2 className="mt-4">Kariyer verileriniz <br /> sizin gücünüz.</H2>
                            <Text className="mt-6 max-w-md">
                                Hangi CV'nin daha çok dönüş aldığını, hangi motivasyon mektubunun çalıştığını grafiklerle analiz edin. Stratejinizi verilerle çizin.
                            </Text>
                        </Reveal>
                        <Reveal direction="left" className="flex-1 w-full">
                            <div className="apple-card overflow-hidden p-4 shadow-xl">
                                <div className="aspect-[4/3] w-full rounded-[20px] bg-white flex items-end justify-center gap-2 sm:gap-4 md:gap-6 p-4 sm:p-6 relative overflow-hidden border border-black/5">
                                    {/* Grid Lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none opacity-20">
                                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-px bg-black/10" />)}
                                    </div>
                                    <motion.div initial={{ height: 0 }} whileInView={{ height: '35%' }} transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }} viewport={{ once: true }} className="w-10 sm:w-14 rounded-t-xl bg-gradient-to-t from-indigo-500/80 to-indigo-300 inner-glow-bar" />
                                    <motion.div initial={{ height: 0 }} whileInView={{ height: '65%' }} transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }} viewport={{ once: true }} className="w-10 sm:w-14 rounded-t-xl bg-gradient-to-t from-blue-500/80 to-blue-300 inner-glow-bar" />
                                    <motion.div initial={{ height: 0 }} whileInView={{ height: '45%' }} transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }} viewport={{ once: true }} className="w-10 sm:w-14 rounded-t-xl bg-gradient-to-t from-teal-400/80 to-teal-200 inner-glow-bar" />
                                    <motion.div initial={{ height: 0 }} whileInView={{ height: '85%' }} transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }} viewport={{ once: true }} className="w-10 sm:w-14 rounded-t-xl bg-gradient-to-t from-rose-500/80 to-rose-300 inner-glow-bar" />
                                    <motion.div initial={{ height: 0 }} whileInView={{ height: '100%' }} transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }} viewport={{ once: true }} className="w-10 sm:w-14 rounded-t-xl bg-gradient-to-t from-pink-500/80 to-pink-300 inner-glow-bar" />
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* CTA SECTION - CENTERED */}
            <Reveal direction="up" delay={0.2} className="w-full">
                <section className="w-full text-center mb-32 md:mb-48 px-4 sm:px-6">
                    <div className="mx-auto max-w-[1100px] rounded-[32px] cta-gradient-bg p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
                        {/* Soft overlay for premium feel */}
                        <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
                        <div className="relative z-10">
                            <h2 className="mb-6 text-white font-bold leading-tight tracking-tight text-[clamp(32px,5vw,48px)]">
                                Başvuruya Hazır Mısın?
                            </h2>
                            <p className="mx-auto mb-10 max-w-xl text-lg text-white/90">
                                Saniyeler içinde hesabınızı oluşturun ve NextStep ile kariyerinizi şekillendirin.
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-lg font-semibold text-black transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                            >
                                Ücretsiz Başla
                            </button>
                        </div>
                    </div>
                </section>
            </Reveal>

            {/* FOOTER */}
            <footer className="border-t border-black/5 py-16 text-center text-sm font-medium tracking-wide flex flex-col items-center gap-4 px-6">
                <p className="text-black/40">© 2026 NextStep</p>
                <p className="animated-gradient-text max-w-[600px] mx-auto text-sm leading-relaxed">
                    Bu site Kutluhan Gül tarafından iş başvurularını takip etmeyi kolaylaştırmak ve anlamlandırmak için geliştirilmiştir.
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;
