import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export type Theme = 'light' | 'dark' | 'system';

/**
 * Applies data-theme attribute on <html> based on stored theme preference.
 * Call this once at the top-level (App.tsx or AppLayout).
 */
export function useTheme() {
    const theme = useAppStore(state => state.theme);

    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else if (theme === 'light') {
            root.removeAttribute('data-theme');
        } else {
            // system
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                root.setAttribute('data-theme', 'dark');
            } else {
                root.removeAttribute('data-theme');
            }
        }
    }, [theme]);
}
