import { Outlet } from 'react-router-dom';
import { FloatingDock } from '../components/common/FloatingDock';
import { AnimatePresence } from 'framer-motion';

export default function AppLayout() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[var(--color-apple-bg)] text-[var(--color-apple-text)]">
            {/* 
        Full-bleed semantic main content wrapper.
        Provides a vast canvas-like feel, avoiding boxed layouts.
      */}
            <main className="relative z-0 h-full w-full pb-32">
                <AnimatePresence mode="wait">
                    <Outlet />
                </AnimatePresence>
            </main>

            {/* Floating Mac-style Dock sits firmly at the bottom center */}
            <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
                <FloatingDock />
            </div>
        </div>
    );
}
