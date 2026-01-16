import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

// ========================================
// VACANCIES SERVICE
// ========================================

const vacanciesCollection = collection(db, 'vacancies');

export const getVacancies = async (onlyActive = false) => {
    try {
        let q;
        if (onlyActive) {
            // Simple query without composite index requirement
            q = query(vacanciesCollection, where('active', '==', true));
        } else {
            q = query(vacanciesCollection, orderBy('createdAt', 'desc'));
        }
        const snapshot = await getDocs(q);
        const vacancies = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        // Sort by createdAt on client side if filtering
        if (onlyActive) {
            vacancies.sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || new Date(0);
                const dateB = b.createdAt?.toDate?.() || new Date(0);
                return dateB - dateA;
            });
        }
        return vacancies;
    } catch (error) {
        console.error('Error getting vacancies:', error);
        return [];
    }
};

export const getVacancy = async (id) => {
    try {
        const docRef = doc(db, 'vacancies', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting vacancy:', error);
        return null;
    }
};

export const createVacancy = async (vacancyData) => {
    try {
        const docRef = await addDoc(vacanciesCollection, {
            ...vacancyData,
            active: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { id: docRef.id, ...vacancyData };
    } catch (error) {
        console.error('Error creating vacancy:', error);
        throw error;
    }
};

export const updateVacancy = async (id, vacancyData) => {
    try {
        const docRef = doc(db, 'vacancies', id);
        await updateDoc(docRef, {
            ...vacancyData,
            updatedAt: serverTimestamp()
        });
        return { id, ...vacancyData };
    } catch (error) {
        console.error('Error updating vacancy:', error);
        throw error;
    }
};

export const deleteVacancy = async (id) => {
    try {
        const docRef = doc(db, 'vacancies', id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error('Error deleting vacancy:', error);
        throw error;
    }
};

export const toggleVacancyStatus = async (id, currentStatus) => {
    try {
        const docRef = doc(db, 'vacancies', id);
        await updateDoc(docRef, {
            active: !currentStatus,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error toggling vacancy status:', error);
        throw error;
    }
};

// ========================================
// CANDIDATES SERVICE
// ========================================

const candidatesCollection = collection(db, 'candidates');

export const getCandidates = async (vacancyId = null) => {
    try {
        let q = query(candidatesCollection, orderBy('createdAt', 'desc'));
        if (vacancyId) {
            q = query(candidatesCollection, where('vacancyId', '==', vacancyId), orderBy('createdAt', 'desc'));
        }
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting candidates:', error);
        return [];
    }
};

export const createCandidate = async (candidateData) => {
    try {
        const docRef = await addDoc(candidatesCollection, {
            ...candidateData,
            status: 'pending',
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...candidateData };
    } catch (error) {
        console.error('Error creating candidate:', error);
        throw error;
    }
};

export const updateCandidateStatus = async (id, status) => {
    try {
        const docRef = doc(db, 'candidates', id);
        await updateDoc(docRef, { status });
        return true;
    } catch (error) {
        console.error('Error updating candidate status:', error);
        throw error;
    }
};

export const deleteCandidate = async (id) => {
    try {
        const docRef = doc(db, 'candidates', id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error('Error deleting candidate:', error);
        throw error;
    }
};

// ========================================
// RECRUITERS SERVICE
// ========================================

const recruitersCollection = collection(db, 'recruiters');

export const getRecruiters = async () => {
    try {
        const q = query(recruitersCollection, orderBy('name', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting recruiters:', error);
        return [];
    }
};

export const createRecruiter = async (recruiterData) => {
    try {
        const docRef = await addDoc(recruitersCollection, {
            ...recruiterData,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...recruiterData };
    } catch (error) {
        console.error('Error creating recruiter:', error);
        throw error;
    }
};

export const updateRecruiter = async (id, recruiterData) => {
    try {
        const docRef = doc(db, 'recruiters', id);
        await updateDoc(docRef, recruiterData);
        return { id, ...recruiterData };
    } catch (error) {
        console.error('Error updating recruiter:', error);
        throw error;
    }
};

export const deleteRecruiter = async (id) => {
    try {
        const docRef = doc(db, 'recruiters', id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error('Error deleting recruiter:', error);
        throw error;
    }
};
