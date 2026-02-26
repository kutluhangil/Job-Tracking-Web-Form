import { motion } from 'framer-motion';
import { AreaChart, LineChart, PieChart, BarChart } from 'lucide-react';

interface AnimatedIconProps {
    type: 'area' | 'line' | 'pie' | 'bar';
    size?: number;
    className?: string;
}

const IconMap = {
    area: AreaChart,
    line: LineChart,
    pie: PieChart,
    bar: BarChart,
};

export const AnimatedIcon = ({ type, size = 24, className = '' }: AnimatedIconProps) => {
    const Icon = IconMap[type] || BarChart;

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            className={`p-3 rounded-2xl bg-black/5 text-black ${className}`}
        >
            <Icon size={size} strokeWidth={1.5} />
        </motion.div>
    );
};
