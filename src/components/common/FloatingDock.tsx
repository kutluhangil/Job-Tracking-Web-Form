import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    PlusCircle,
    List,
    PieChart,
    Settings
} from 'lucide-react';

const DOCK_ITEMS = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'add', label: 'Add', icon: PlusCircle, path: '/add' },
    { id: 'list', label: 'Applications', icon: List, path: '/applications' },
    { id: 'analytics', label: 'Analytics', icon: PieChart, path: '/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export function FloatingDock() {
    const [hovered, setHovered] = useState<string | null>(null);
    const location = useLocation();

    return (
        <motion.nav
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.8, delay: 0.2 }}
            className="glass-dock flex items-center gap-2 rounded-full px-4 py-3"
        >
            {DOCK_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                return (
                    <Link
                        key={item.id}
                        to={item.path}
                        onMouseEnter={() => setHovered(item.id)}
                        onMouseLeave={() => setHovered(null)}
                        className="group relative flex items-center justify-center rounded-full p-3 transition-colors duration-200 hover:bg-black/5"
                        aria-label={item.label}
                    >
                        {/* Active Indicator Dot */}
                        {isActive && (
                            <motion.div
                                layoutId="active-indicator"
                                className="absolute -bottom-1 h-1 w-1 rounded-full bg-black/60"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}

                        {/* Tooltip */}
                        <AnimatePresence>
                            {hovered === item.id && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: -45, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                                    className="absolute -top-1 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-black/80 px-3 py-1.5 text-xs font-medium text-white shadow-xl backdrop-blur-md whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            animate={{
                                scale: hovered === item.id ? 1.2 : 1,
                                y: hovered === item.id ? -4 : 0,
                            }}
                            transition={{ type: 'spring', bounce: 0.4, duration: 0.5 }}
                        >
                            <Icon
                                size={22}
                                className={`transition-colors duration-300 ${isActive ? 'text-black' : 'text-gray-500 group-hover:text-black/80'}`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                        </motion.div>
                    </Link>
                );
            })}
        </motion.nav>
    );
}


