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
// PSYCHOMETRIC SERVICE
// Pruebas psicométricas para candidatos
// ========================================

const testResultsCollection = collection(db, 'testResults');
const testInvitationsCollection = collection(db, 'testInvitations');

// ========================================
// TEST INVITATIONS
// ========================================

// Generate unique token for test invitation
const generateToken = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
};

// Create test invitation for a candidate
export const createTestInvitation = async (candidateId, candidateName, candidateEmail, vacancyTitle) => {
    try {
        const token = generateToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

        const invitation = {
            candidateId,
            candidateName,
            candidateEmail,
            vacancyTitle,
            token,
            status: 'pending', // pending, started, completed, expired
            createdAt: serverTimestamp(),
            expiresAt,
            startedAt: null,
            completedAt: null
        };

        const docRef = await addDoc(testInvitationsCollection, invitation);
        return { id: docRef.id, token, ...invitation };
    } catch (error) {
        console.error('Error creating test invitation:', error);
        throw error;
    }
};

// Get invitation by token
export const getInvitationByToken = async (token) => {
    try {
        const q = query(testInvitationsCollection, where('token', '==', token));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        console.error('Error getting invitation:', error);
        throw error;
    }
};

// Update invitation status
export const updateInvitationStatus = async (invitationId, status, additionalData = {}) => {
    try {
        const invitationRef = doc(db, 'testInvitations', invitationId);
        const updateData = { status, ...additionalData };
        
        if (status === 'started') {
            updateData.startedAt = serverTimestamp();
        } else if (status === 'completed') {
            updateData.completedAt = serverTimestamp();
        }

        await updateDoc(invitationRef, updateData);
    } catch (error) {
        console.error('Error updating invitation status:', error);
        throw error;
    }
};

// Get all invitations (for admin)
export const getTestInvitations = async (status = null) => {
    try {
        let q = query(testInvitationsCollection, orderBy('createdAt', 'desc'));
        
        if (status) {
            q = query(testInvitationsCollection, where('status', '==', status), orderBy('createdAt', 'desc'));
        }

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting invitations:', error);
        throw error;
    }
};

// Get invitations for a specific candidate
export const getInvitationsByCandidateId = async (candidateId) => {
    try {
        const q = query(testInvitationsCollection, where('candidateId', '==', candidateId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting candidate invitations:', error);
        throw error;
    }
};

// ========================================
// TEST RESULTS
// ========================================

// Save test results
export const saveTestResult = async (invitationId, candidateId, answers, scores, timeSpent) => {
    try {
        const result = {
            invitationId,
            candidateId,
            answers,
            scores,
            timeSpent, // in seconds
            completedAt: serverTimestamp()
        };

        const docRef = await addDoc(testResultsCollection, result);
        
        // Update invitation status to completed
        await updateInvitationStatus(invitationId, 'completed');

        return { id: docRef.id, ...result };
    } catch (error) {
        console.error('Error saving test result:', error);
        throw error;
    }
};

// Get test results for a candidate
export const getTestResultsByCandidate = async (candidateId) => {
    try {
        const q = query(testResultsCollection, where('candidateId', '==', candidateId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting test results:', error);
        throw error;
    }
};

// Get test result by invitation ID
export const getTestResultByInvitation = async (invitationId) => {
    try {
        const q = query(testResultsCollection, where('invitationId', '==', invitationId));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            return null;
        }

        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    } catch (error) {
        console.error('Error getting test result:', error);
        throw error;
    }
};

// Get all test results (for admin)
export const getAllTestResults = async () => {
    try {
        const q = query(testResultsCollection, orderBy('completedAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting all test results:', error);
        throw error;
    }
};

// ========================================
// SCORE CALCULATION
// ========================================

// Calculate scores from answers
export const calculateScores = (answers, questions) => {
    const scores = {
        // DISC
        disc: {
            dominance: 0,
            influence: 0,
            steadiness: 0,
            compliance: 0
        },
        // Big Five
        bigFive: {
            openness: 0,
            conscientiousness: 0,
            extraversion: 0,
            agreeableness: 0,
            neuroticism: 0
        },
        // Aptitudes
        aptitudes: {
            logical: { correct: 0, total: 0, percentage: 0 },
            numerical: { correct: 0, total: 0, percentage: 0 },
            verbal: { correct: 0, total: 0, percentage: 0 }
        },
        // Competencias
        competencies: {
            teamwork: 0,
            leadership: 0,
            problemSolving: 0,
            communication: 0,
            adaptability: 0
        },
        // Inteligencia Emocional
        emotionalIntelligence: {
            selfAwareness: 0,
            selfRegulation: 0,
            motivation: 0,
            empathy: 0,
            socialSkills: 0
        }
    };

    const counts = {
        disc: { dominance: 0, influence: 0, steadiness: 0, compliance: 0 },
        bigFive: { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 },
        competencies: { teamwork: 0, leadership: 0, problemSolving: 0, communication: 0, adaptability: 0 },
        emotionalIntelligence: { selfAwareness: 0, selfRegulation: 0, motivation: 0, empathy: 0, socialSkills: 0 }
    };

    questions.forEach(question => {
        const answer = answers[question.id];
        if (answer === undefined || answer === null) return;

        const category = question.category;
        const subcategory = question.subcategory;

        switch (category) {
            case 'disc':
                if (subcategory && scores.disc[subcategory] !== undefined) {
                    scores.disc[subcategory] += parseInt(answer) || 0;
                    counts.disc[subcategory]++;
                }
                break;

            case 'bigFive':
                if (subcategory && scores.bigFive[subcategory] !== undefined) {
                    const value = question.reverse ? (6 - parseInt(answer)) : parseInt(answer);
                    scores.bigFive[subcategory] += value || 0;
                    counts.bigFive[subcategory]++;
                }
                break;

            case 'logical':
            case 'numerical':
            case 'verbal':
                scores.aptitudes[category].total++;
                if (answer === question.correctAnswer) {
                    scores.aptitudes[category].correct++;
                }
                break;

            case 'competencies':
                if (subcategory && scores.competencies[subcategory] !== undefined) {
                    scores.competencies[subcategory] += parseInt(answer) || 0;
                    counts.competencies[subcategory]++;
                }
                break;

            case 'emotionalIntelligence':
                if (subcategory && scores.emotionalIntelligence[subcategory] !== undefined) {
                    const value = question.reverse ? (6 - parseInt(answer)) : parseInt(answer);
                    scores.emotionalIntelligence[subcategory] += value || 0;
                    counts.emotionalIntelligence[subcategory]++;
                }
                break;
        }
    });

    // Normalize DISC scores (percentage out of max possible)
    Object.keys(scores.disc).forEach(key => {
        if (counts.disc[key] > 0) {
            scores.disc[key] = Math.round((scores.disc[key] / (counts.disc[key] * 5)) * 100);
        }
    });

    // Normalize Big Five scores
    Object.keys(scores.bigFive).forEach(key => {
        if (counts.bigFive[key] > 0) {
            scores.bigFive[key] = Math.round((scores.bigFive[key] / (counts.bigFive[key] * 5)) * 100);
        }
    });

    // Calculate aptitude percentages
    Object.keys(scores.aptitudes).forEach(key => {
        if (scores.aptitudes[key].total > 0) {
            scores.aptitudes[key].percentage = Math.round((scores.aptitudes[key].correct / scores.aptitudes[key].total) * 100);
        }
    });

    // Normalize Competencies scores
    Object.keys(scores.competencies).forEach(key => {
        if (counts.competencies[key] > 0) {
            scores.competencies[key] = Math.round((scores.competencies[key] / (counts.competencies[key] * 5)) * 100);
        }
    });

    // Normalize Emotional Intelligence scores
    Object.keys(scores.emotionalIntelligence).forEach(key => {
        if (counts.emotionalIntelligence[key] > 0) {
            scores.emotionalIntelligence[key] = Math.round((scores.emotionalIntelligence[key] / (counts.emotionalIntelligence[key] * 5)) * 100);
        }
    });

    return scores;
};

// Get overall profile summary
export const getProfileSummary = (scores) => {
    const summary = {
        discProfile: '',
        strengths: [],
        areasForDevelopment: []
    };

    // Determine DISC profile
    const discValues = Object.entries(scores.disc);
    discValues.sort((a, b) => b[1] - a[1]);
    const primaryTrait = discValues[0][0];
    const secondaryTrait = discValues[1][0];

    const discLabels = {
        dominance: 'D (Dominante)',
        influence: 'I (Influyente)',
        steadiness: 'S (Estable)',
        compliance: 'C (Cumplidor)'
    };

    summary.discProfile = `${discLabels[primaryTrait]} / ${discLabels[secondaryTrait]}`;

    // Identify strengths (scores >= 70%)
    const allScores = [
        ...Object.entries(scores.disc).map(([k, v]) => ({ category: 'DISC', name: k, value: v })),
        ...Object.entries(scores.bigFive).map(([k, v]) => ({ category: 'Big Five', name: k, value: v })),
        ...Object.entries(scores.competencies).map(([k, v]) => ({ category: 'Competencias', name: k, value: v })),
        ...Object.entries(scores.emotionalIntelligence).map(([k, v]) => ({ category: 'IE', name: k, value: v })),
        ...Object.entries(scores.aptitudes).map(([k, v]) => ({ category: 'Aptitudes', name: k, value: v.percentage }))
    ];

    summary.strengths = allScores
        .filter(s => s.value >= 70)
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
        .map(s => s.name);

    summary.areasForDevelopment = allScores
        .filter(s => s.value < 50)
        .sort((a, b) => a.value - b.value)
        .slice(0, 3)
        .map(s => s.name);

    return summary;
};
