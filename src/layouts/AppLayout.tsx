import { Outlet, useLocation } from 'react-router-dom';
import { FloatingDock } from '../components/common/FloatingDock';
import { AnimatePresence, motion } from 'framer-motion';

export default function AppLayout() {
    const location = useLocation();

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[var(--color-apple-bg)] text-[var(--color-apple-text)]">
            <main className="relative z-0 h-full w-full pb-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -15, scale: 0.98 }}
                        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                        className="w-full h-full"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 w-[calc(100%-2rem)] max-w-max">
                <FloatingDock />
            </div>
        </div>
    );
}
