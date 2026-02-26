import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import type { Variant } from 'framer-motion';

interface RevealProps {
    children: React.ReactNode;
    width?: 'fit-content' | '100%';
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    className?: string;
    duration?: number;
}

export const Reveal = ({
    children,
    width = 'fit-content',
    delay = 0,
    direction = 'up',
    className = '',
    duration = 0.6
}: RevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start('visible');
        }
    }, [isInView, mainControls]);

    const getHiddenVariant = (): Variant => {
        switch (direction) {
            case 'up': return { opacity: 0, y: 40 };
            case 'down': return { opacity: 0, y: -40 };
            case 'left': return { opacity: 0, x: 40 };
            case 'right': return { opacity: 0, x: -40 };
            default: return { opacity: 0, y: 40 };
        }
    };

    return (
        <div ref={ref} style={{ width }} className={`relative overflow-hidden ${className}`}>
            <motion.div
                variants={{
                    hidden: getHiddenVariant(),
                    visible: { opacity: 1, y: 0, x: 0 },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }} // Apple-style custom spring/ease
            >
                {children}
            </motion.div>
        </div>
    );
};
