import { useAppStore } from '../store/useAppStore';

/**
 * Returns true when the effective theme is dark.
 * Respects the 'system' option by checking OS preference.
 */
export function useDark(): boolean {
    const theme = useAppStore(state => state.theme);
    if (theme === 'dark') return true;
    if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false; // default: light
}
