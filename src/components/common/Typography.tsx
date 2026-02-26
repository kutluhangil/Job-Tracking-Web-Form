import React from 'react';

// Apple-style typography enforces constraints. 
// We use tight tracking for larger headers, and normal tracking for body.
// We avoid completely black (#000) and use Apple's #1d1d1f (var(--color-apple-text)).

interface TypographyProps {
    children: React.ReactNode;
    className?: string;
    as?: React.ElementType;
}

export const H1 = ({ children, className = '', as: Component = 'h1' }: TypographyProps) => {
    return (
        <Component className={`text-[clamp(40px,8vw,120px)] font-bold tracking-tighter leading-[1.05] ${className}`}>
            {children}
        </Component>
    );
};

export const H2 = ({ children, className = '', as: Component = 'h2' }: TypographyProps) => {
    return (
        <Component className={`text-[clamp(28px,4vw,48px)] font-bold tracking-tight leading-tight ${className}`}>
            {children}
        </Component>
    );
};

export const H3 = ({ children, className = '', as: Component = 'h3' }: TypographyProps) => {
    return (
        <Component className={`text-[clamp(20px,2vw,28px)] font-semibold tracking-tight leading-snug ${className}`}>
            {children}
        </Component>
    );
};

export const AnimatedTitle = ({ children, className = '', as: Component = 'h1' }: TypographyProps) => {
    return (
        <Component className={`animated-gradient-text text-[clamp(48px,10vw,140px)] font-extrabold tracking-tighter leading-none ${className}`}>
            {children}
        </Component>
    );
};

export const Text = ({ children, className = '', as: Component = 'p' }: TypographyProps) => {
    return (
        <Component className={`text-base md:text-lg lg:text-xl font-normal tracking-normal text-[var(--color-apple-gray)] leading-relaxed ${className}`}>
            {children}
        </Component>
    );
};

export const Caption = ({ children, className = '', as: Component = 'span' }: TypographyProps) => {
    return (
        <Component className={`text-sm font-medium tracking-wide uppercase text-[var(--color-apple-gray)]/80 ${className}`}>
            {children}
        </Component>
    );
};
