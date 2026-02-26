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
                        <div className="mt-12 flex items-center justify-center gap-6">
                            <button
                                onClick={() => navigate('/login')}
                                className="group relative overflow-hidden rounded-full bg-black px-8 py-4 text-lg font-medium text-white transition-transform hover:scale-105"
                            >
                                <span className="relative z-10 w-full">Hemen Başla</span>
                                <div className="absolute inset-0 z-0 h-full w-full scale-x-0 transform bg-[#0071e3] transition-transform duration-300 origin-left group-hover:scale-x-100" />
                            </button>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* FEATURE SHOWCASE */}
            <section className="relative z-10 mx-auto max-w-[1400px] px-6 py-32 md:py-48">
                <div className="flex flex-col gap-32">
                    <div className="flex flex-col items-center gap-16 md:flex-row">
                        <Reveal direction="right" className="order-2 flex-1 md:order-1">
                            <div className="apple-card overflow-hidden p-2">
                                <div className="aspect-[4/3] w-full rounded-2xl bg-[#f5f5f7] flex items-center justify-center p-8">
                                    <div className="w-full h-full flex flex-col gap-4">
                                        <div className="h-8 w-1/3 rounded-lg bg-black/10"></div>
                                        <div className="flex gap-4">
                                            <div className="h-24 flex-1 rounded-xl bg-black/5"></div>
                                            <div className="h-24 flex-1 rounded-xl bg-black/5"></div>
                                        </div>
                                        <div className="h-full w-full rounded-xl bg-black/5 mt-4"></div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
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
                        <Reveal direction="left" className="flex-1">
                            <div className="apple-card overflow-hidden p-2">
                                <div className="aspect-[4/3] w-full rounded-2xl bg-[#f5f5f7] flex items-end justify-center gap-4 p-8 relative overflow-hidden">
                                    <motion.div initial={{ height: 0 }} whileInView={{ height: '40%' }} className="w-12 rounded-t-lg bg-indigo-400" />
                                    <motion.div initial={{ height: 0 }} whileInView={{ height: '70%' }} className="w-12 rounded-t-lg bg-blue-500" />
                                    <motion.div initial={{ height: 0 }} whileInView={{ height: '30%' }} className="w-12 rounded-t-lg bg-teal-400" />
                                    <motion.div initial={{ height: 0 }} whileInView={{ height: '90%' }} className="w-12 rounded-t-lg bg-rose-500" />
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* CTA SECTION - CENTERED */}
            <Reveal direction="up" delay={0.2} className="px-5">
                <section className="mx-auto max-w-[1200px] text-center mb-32">
                    <div className="rounded-[40px] bg-black p-10 md:p-24 text-white">
                        <h2 className="mb-6 text-white font-bold leading-tight tracking-tight text-[clamp(32px,5vw,48px)]">
                            Başvuruya Hazır Mısın?
                        </h2>
                        <p className="mx-auto mb-10 max-w-xl text-lg text-white/60">
                            Saniyeler içinde hesabınızı oluşturun ve NextStep ile kariyerinizi şekillendirin.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full md:w-auto inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-medium text-black transition-transform hover:scale-105"
                        >
                            Ücretsiz Başla
                        </button>
                    </div>
                </section>
            </Reveal>

            {/* FOOTER */}
            <footer className="border-t border-black/5 py-12 text-center text-sm font-medium tracking-wide text-black/40">
                <p>© 2026 NextStep</p>
            </footer>
        </div>
    );
};

export default LandingPage;
