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

// ========================================
// QUESTIONS SERVICE
// Preguntas personalizadas por vacante
// ========================================

const questionsCollection = collection(db, 'questions');

export const getQuestionsByVacancy = async (vacancyId) => {
    try {
        const q = query(questionsCollection, where('vacancyId', '==', vacancyId));
        const snapshot = await getDocs(q);
        const questions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        // Sort by order on client side
        questions.sort((a, b) => (a.order || 0) - (b.order || 0));
        return questions;
    } catch (error) {
        console.error('Error getting questions:', error);
        return [];
    }
};

export const createQuestion = async (questionData) => {
    try {
        const docRef = await addDoc(questionsCollection, {
            ...questionData,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...questionData };
    } catch (error) {
        console.error('Error creating question:', error);
        throw error;
    }
};

export const updateQuestion = async (id, questionData) => {
    try {
        const docRef = doc(db, 'questions', id);
        await updateDoc(docRef, questionData);
        return { id, ...questionData };
    } catch (error) {
        console.error('Error updating question:', error);
        throw error;
    }
};

export const deleteQuestion = async (id) => {
    try {
        const docRef = doc(db, 'questions', id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error('Error deleting question:', error);
        throw error;
    }
};

// Delete all questions for a vacancy (when vacancy is deleted)
export const deleteQuestionsByVacancy = async (vacancyId) => {
    try {
        const questions = await getQuestionsByVacancy(vacancyId);
        for (const question of questions) {
            await deleteQuestion(question.id);
        }
        return true;
    } catch (error) {
        console.error('Error deleting questions by vacancy:', error);
        throw error;
    }
};

// ========================================
// POSITIONS SERVICE
// Catálogo de puestos disponibles
// ========================================

const positionsCollection = collection(db, 'positions');

export const getPositions = async () => {
    try {
        const q = query(positionsCollection, orderBy('position', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting positions:', error);
        return [];
    }
};

export const createPosition = async (positionData) => {
    try {
        const docRef = await addDoc(positionsCollection, {
            ...positionData,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...positionData };
    } catch (error) {
        console.error('Error creating position:', error);
        throw error;
    }
};

export const updatePosition = async (id, positionData) => {
    try {
        const docRef = doc(db, 'positions', id);
        await updateDoc(docRef, positionData);
        return { id, ...positionData };
    } catch (error) {
        console.error('Error updating position:', error);
        throw error;
    }
};

export const deletePosition = async (id) => {
    try {
        const docRef = doc(db, 'positions', id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error('Error deleting position:', error);
        throw error;
    }
};

// Bulk import positions from JSON
export const importPositions = async (positionsArray) => {
    try {
        const results = [];
        for (const pos of positionsArray) {
            const docRef = await addDoc(positionsCollection, {
                position: pos.position,
                department: pos.department,
                createdAt: serverTimestamp()
            });
            results.push({ id: docRef.id, ...pos });
        }
        return results;
    } catch (error) {
        console.error('Error importing positions:', error);
        throw error;
    }
};

// ========================================
// USER SERVICE
// Para obtener datos del usuario logueado
// ========================================

export const getUserByEmail = async (email) => {
    try {
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('email', '==', email));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const docData = snapshot.docs[0];
            return { id: docData.id, ...docData.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};

export const updateUserAvatar = async (userId, avatarStyle, avatarSeed) => {
    try {
        const docRef = doc(db, 'users', userId);
        await updateDoc(docRef, {
            avatarStyle,
            avatarSeed
        });
        return true;
    } catch (error) {
        console.error('Error updating avatar:', error);
        throw error;
    }
};

// ========================================
// IMPROVEMENT REQUESTS SERVICE
// Sistema de solicitudes de mejoras
// ========================================

const requestsCollection = collection(db, 'improvementRequests');

export const getImprovementRequests = async (userEmail = null) => {
    try {
        let q;
        if (userEmail) {
            // Filtrar por usuario específico
            q = query(requestsCollection, where('userEmail', '==', userEmail), orderBy('createdAt', 'desc'));
        } else {
            // Obtener todas (para admin)
            q = query(requestsCollection, orderBy('createdAt', 'desc'));
        }
        const snapshot = await getDocs(q);
        return snapshot.docs.map(docData => ({
            id: docData.id,
            ...docData.data()
        }));
    } catch (error) {
        console.error('Error getting requests:', error);
        return [];
    }
};

export const createImprovementRequest = async (requestData) => {
    try {
        const docRef = await addDoc(requestsCollection, {
            ...requestData,
            status: 'pending', // pending, in_progress, completed, rejected
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...requestData };
    } catch (error) {
        console.error('Error creating request:', error);
        throw error;
    }
};

export const updateImprovementRequest = async (id, data) => {
    try {
        const docRef = doc(db, 'improvementRequests', id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
        return { id, ...data };
    } catch (error) {
        console.error('Error updating request:', error);
        throw error;
    }
};

export const deleteImprovementRequest = async (id) => {
    try {
        const docRef = doc(db, 'improvementRequests', id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error('Error deleting request:', error);
        throw error;
    }
};
