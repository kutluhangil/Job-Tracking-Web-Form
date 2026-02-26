import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ApplicationStatus = 'Süreçte' | 'Olumlu' | 'Reddedildi' | 'Görüşme Bekleniyor' | 'Teklif Alındı';

export interface Application {
    id: string;
    no: number;
    companyName: string;
    position: string;
    jobLink: string;
    date: string;
    motivation: string;
    postApplication: string;
    status: ApplicationStatus;
    comments: string;
    hrInterview: string;
    notes: string;
    otherInterviews: string;
    notes2: string;
    testLink: string;
    cvVersion: string;
    motivationTemplate: string;
    city: string;
    platform: string;
    createdAt: number;
}

interface AppState {
    isAuthenticated: boolean;
    user: { name: string; email: string } | null;
    applications: Application[];

    // Actions
    login: (email: string, name?: string) => void;
    logout: () => void;
    addApplication: (app: Omit<Application, 'id' | 'no' | 'createdAt'>) => void;
    updateApplication: (id: string, app: Partial<Application>) => void;
    deleteApplication: (id: string) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            applications: [],

            login: (email, name = 'Kullanıcı') => set({ isAuthenticated: true, user: { name, email } }),

            logout: () => set({ isAuthenticated: false, user: null }),

            addApplication: (appData) => set((state) => {
                const newNo = state.applications.length > 0
                    ? Math.max(...state.applications.map(a => a.no)) + 1
                    : 1;

                const newApp: Application = {
                    ...appData,
                    id: crypto.randomUUID(),
                    no: newNo,
                    createdAt: Date.now(),
                };

                return { applications: [...state.applications, newApp] };
            }),

            updateApplication: (id, updatedData) => set((state) => ({
                applications: state.applications.map(app =>
                    app.id === id ? { ...app, ...updatedData } : app
                )
            })),

            deleteApplication: (id) => set((state) => ({
                applications: state.applications.filter(app => app.id !== id)
            })),
        }),
        {
            name: 'nextstep-storage', // name of the item in the storage (must be unique)
        }
    )
);
