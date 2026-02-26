import {
    collection, doc, addDoc, getDocs, updateDoc, deleteDoc,
    query, where, orderBy, serverTimestamp, type DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Application } from '../store/useAppStore';

const COLL = 'applications';

// ── Add ──────────────────────────────────────────────────────────
export const addApplicationFS = async (
    userId: string,
    appData: Omit<Application, 'id' | 'no' | 'createdAt'>
) => {
    const ref = await addDoc(collection(db, COLL), {
        ...appData,
        userId,
        createdAt: serverTimestamp(),
    });
    return ref.id;
};

// ── Get all for user ─────────────────────────────────────────────
export const getApplicationsFS = async (userId: string): Promise<Application[]> => {
    const q = query(
        collection(db, COLL),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d, i) => ({
        id: d.id,
        no: i + 1,
        createdAt: d.data().createdAt?.toMillis?.() ?? Date.now(),
        ...(d.data() as DocumentData),
    })) as Application[];
};

// ── Update ───────────────────────────────────────────────────────
export const updateApplicationFS = async (id: string, data: Partial<Application>) => {
    const ref = doc(db, COLL, id);
    await updateDoc(ref, { ...data });
};

// ── Delete ───────────────────────────────────────────────────────
export const deleteApplicationFS = async (id: string) => {
    await deleteDoc(doc(db, COLL, id));
};
