import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ApplicationStatus =
    | 'Süreçte'
    | 'Görüşme Bekleniyor'
    | 'Teknik Mülakat'
    | 'İK Mülakatı'
    | 'Vaka / Ödev'
    | 'Teklif Alındı'
    | 'Olumlu'
    | 'Reddedildi'
    | 'İptal'
    | 'Yanıt Yok';

export type WorkType = 'Uzaktan' | 'Hibrit' | 'Ofis' | 'Belirtilmedi';
export type ContractType = 'Tam Zamanlı' | 'Yarı Zamanlı' | 'Staj' | 'Sözleşmeli' | 'Freelance';
export type SalaryPeriod = 'Aylık' | 'Yıllık';

export interface Application {
    id: string;
    no: number;
    // Core
    companyName: string;
    position: string;
    department: string;
    jobLink: string;
    date: string;
    status: ApplicationStatus;
    // Location & Work Style
    city: string;
    country: string;
    workType: WorkType;
    contractType: ContractType;
    // Salary
    salaryMin: string;
    salaryMax: string;
    salaryCurrency: string;
    salaryPeriod: SalaryPeriod;
    // Platform & CV
    platform: string;
    cvVersion: string;
    // Content
    motivation: string;
    testLink: string;
    // Interview tracking
    hrName: string;
    hrEmail: string;
    interviewDate: string;
    interviewNotes: string;
    followUpDate: string;
    // Outcome
    offerAmount: string;
    rejectionReason: string;
    priority: 'Düşük' | 'Orta' | 'Yüksek';
    tags: string;          // comma-separated
    notes: string;
    // Metadata
    createdAt: number;
}

interface AppState {
    isAuthenticated: boolean;
    firebaseUid: string | null;
    user: { name: string; email: string } | null;
    applications: Application[];

    // Actions
    login: (email: string, name?: string, uid?: string) => void;
    logout: () => void;
    addApplication: (app: Omit<Application, 'id' | 'no' | 'createdAt'>) => void;
    updateApplication: (id: string, app: Partial<Application>) => void;
    deleteApplication: (id: string) => void;
    setApplications: (apps: Application[]) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            firebaseUid: null,
            user: null,
            applications: [],

            login: (email, name = 'Kullanıcı', uid) =>
                set({ isAuthenticated: true, firebaseUid: uid ?? null, user: { name, email } }),

            logout: () =>
                set({ isAuthenticated: false, firebaseUid: null, user: null }),

            addApplication: (appData) =>
                set((state) => {
                    const newNo = state.applications.length > 0
                        ? Math.max(...state.applications.map(a => a.no)) + 1
                        : 1;
                    const newApp: Application = {
                        ...appData,
                        id: crypto.randomUUID(),
                        no: newNo,
                        createdAt: Date.now(),
                    };
                    return { applications: [newApp, ...state.applications] };
                }),

            updateApplication: (id, updatedData) =>
                set((state) => ({
                    applications: state.applications.map(app =>
                        app.id === id ? { ...app, ...updatedData } : app
                    ),
                })),

            deleteApplication: (id) =>
                set((state) => ({
                    applications: state.applications.filter(app => app.id !== id),
                })),

            setApplications: (apps) => set({ applications: apps }),
        }),
        {
            name: 'nextstep-storage',
        }
    )
);
