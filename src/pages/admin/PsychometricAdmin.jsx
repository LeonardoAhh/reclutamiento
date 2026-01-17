import { useState, useEffect } from 'react'
import {
    getTestInvitations,
    getTestResultByInvitation,
    getProfileSummary
} from '../../services/psychometricService'
import { getCandidates, getVacancies, updateCandidateStatus } from '../../services/firebaseService'
import { createTestInvitation } from '../../services/psychometricService'
import { scoreLabels } from '../../data/psychometricQuestions'
import './PsychometricAdmin.css'

function PsychometricAdmin() {
    const [invitations, setInvitations] = useState([])
    const [candidates, setCandidates] = useState([])
    const [vacancies, setVacancies] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('pending')
    const [selectedResult, setSelectedResult] = useState(null)
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [selectedCandidate, setSelectedCandidate] = useState(null)
    const [sendingInvite, setSendingInvite] = useState(false)
    const [copiedLink, setCopiedLink] = useState(false)
    const [generatedLink, setGeneratedLink] = useState(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const [invData, candData, vacData] = await Promise.all([
                getTestInvitations(),
                getCandidates(),
                getVacancies()
            ])
            setInvitations(invData)
            setCandidates(candData)
            setVacancies(vacData)
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getVacancyTitle = (vacancyId) => {
        const vacancy = vacancies.find(v => v.id === vacancyId)
        return vacancy?.title || 'Sin vacante'
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return '-'
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return date.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusBadge = (status) => {
        const badges = {
            pending: { label: 'Pendiente', color: 'warning' },
            started: { label: 'En Progreso', color: 'info' },
            completed: { label: 'Completado', color: 'success' },
            expired: { label: 'Expirado', color: 'error' }
        }
        const badge = badges[status] || badges.pending
        return <span className={`badge badge-${badge.color}`}>{badge.label}</span>
    }

    const filteredInvitations = invitations.filter(inv => {
        if (activeTab === 'pending') return inv.status === 'pending' || inv.status === 'started'
        if (activeTab === 'completed') return inv.status === 'completed'
        return true
    })

    // Candidates eligible for psychometric test (reviewed status)
    const eligibleCandidates = candidates.filter(c =>
        c.status === 'reviewed' &&
        !invitations.some(inv => inv.candidateId === c.id && inv.status !== 'expired')
    )

    const handleInviteCandidate = async () => {
        if (!selectedCandidate) return

        setSendingInvite(true)
        try {
            const vacancyTitle = getVacancyTitle(selectedCandidate.vacancyId)
            const invitation = await createTestInvitation(
                selectedCandidate.id,
                selectedCandidate.fullName,
                selectedCandidate.email,
                vacancyTitle
            )

            // Update candidate status
            await updateCandidateStatus(selectedCandidate.id, 'psychometric_pending')

            // Generate link
            const baseUrl = window.location.origin
            const testLink = `${baseUrl}/prueba/${invitation.token}`
            setGeneratedLink(testLink)

            // Reload data
            loadData()
        } catch (error) {
            console.error('Error creating invitation:', error)
            alert('Error al crear la invitación')
        } finally {
            setSendingInvite(false)
        }
    }

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedLink(true)
            setTimeout(() => setCopiedLink(false), 2000)
        } catch (error) {
            console.error('Error copying:', error)
        }
    }

    const handleViewResult = async (invitation) => {
        try {
            const result = await getTestResultByInvitation(invitation.id)
            if (result) {
                const summary = getProfileSummary(result.scores)
                setSelectedResult({ ...result, invitation, summary })
            }
        } catch (error) {
            console.error('Error loading result:', error)
        }
    }

    const closeModal = () => {
        setShowInviteModal(false)
        setSelectedCandidate(null)
        setGeneratedLink(null)
    }

    const closeResultModal = () => {
        setSelectedResult(null)
    }

    if (loading) {
        return (
            <div className="psychometric-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando pruebas psicométricas...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="psychometric-page">
            <div className="page-header-row">
                <div>
                    <h1 className="admin-page-title">Pruebas Psicométricas</h1>
                    <p className="page-subtitle">
                        Gestiona las evaluaciones psicométricas de candidatos
                    </p>
                </div>
                <div className="header-actions">
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="btn btn-accent"
                        disabled={eligibleCandidates.length === 0}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        Invitar Candidato
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon pending">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{invitations.filter(i => i.status === 'pending' || i.status === 'started').length}</span>
                        <span className="stat-label">Pendientes</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon completed">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{invitations.filter(i => i.status === 'completed').length}</span>
                        <span className="stat-label">Completadas</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon eligible">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{eligibleCandidates.length}</span>
                        <span className="stat-label">Elegibles</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs-container">
                <button
                    className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pendientes
                </button>
                <button
                    className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Completadas
                </button>
                <button
                    className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    Todas
                </button>
            </div>

            {/* Invitations List */}
            {filteredInvitations.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-state-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="12" y1="18" x2="12" y2="12"></line>
                            <line x1="9" y1="15" x2="15" y2="15"></line>
                        </svg>
                    </div>
                    <h3 className="empty-state-title">No hay pruebas {activeTab === 'pending' ? 'pendientes' : activeTab === 'completed' ? 'completadas' : ''}</h3>
                    <p className="empty-state-text">
                        {activeTab === 'pending'
                            ? 'Invita a candidatos pre-seleccionados para que tomen la prueba psicométrica.'
                            : 'Los resultados aparecerán aquí cuando los candidatos completen sus pruebas.'}
                    </p>
                </div>
            ) : (
                <div className="invitations-grid">
                    {filteredInvitations.map(invitation => (
                        <div key={invitation.id} className="invitation-card card">
                            <div className="invitation-header">
                                <div className="candidate-avatar">
                                    {invitation.candidateName?.charAt(0).toUpperCase()}
                                </div>
                                <div className="candidate-info">
                                    <h3 className="candidate-name">{invitation.candidateName}</h3>
                                    <p className="candidate-vacancy">{invitation.vacancyTitle}</p>
                                </div>
                                {getStatusBadge(invitation.status)}
                            </div>

                            <div className="invitation-details">
                                <div className="detail-row">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    <span>{invitation.candidateEmail}</span>
                                </div>
                                <div className="detail-row">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                    <span>Enviado: {formatDate(invitation.createdAt)}</span>
                                </div>
                                {invitation.completedAt && (
                                    <div className="detail-row">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        <span>Completado: {formatDate(invitation.completedAt)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="invitation-actions">
                                {invitation.status === 'completed' ? (
                                    <button
                                        onClick={() => handleViewResult(invitation)}
                                        className="btn btn-primary"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                        Ver Resultados
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => copyToClipboard(`${window.location.origin}/prueba/${invitation.token}`)}
                                        className="btn btn-secondary"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                        Copiar Enlace
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Invitar a Prueba Psicométrica</h2>
                            <button onClick={closeModal} className="modal-close">×</button>
                        </div>

                        {!generatedLink ? (
                            <>
                                <div className="modal-body">
                                    <p className="modal-description">
                                        Selecciona un candidato pre-seleccionado para enviarle la invitación a la prueba psicométrica.
                                    </p>

                                    <div className="form-group">
                                        <label className="form-label">Candidato</label>
                                        <select
                                            className="form-input form-select"
                                            value={selectedCandidate?.id || ''}
                                            onChange={(e) => {
                                                const candidate = eligibleCandidates.find(c => c.id === e.target.value)
                                                setSelectedCandidate(candidate)
                                            }}
                                        >
                                            <option value="">Selecciona un candidato</option>
                                            {eligibleCandidates.map(c => (
                                                <option key={c.id} value={c.id}>
                                                    {c.fullName} - {getVacancyTitle(c.vacancyId)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedCandidate && (
                                        <div className="selected-candidate-preview">
                                            <div className="preview-avatar">
                                                {selectedCandidate.fullName?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <strong>{selectedCandidate.fullName}</strong>
                                                <p>{selectedCandidate.email}</p>
                                                <p className="vacancy-label">{getVacancyTitle(selectedCandidate.vacancyId)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="modal-footer">
                                    <button onClick={closeModal} className="btn btn-secondary">
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleInviteCandidate}
                                        className="btn btn-accent"
                                        disabled={!selectedCandidate || sendingInvite}
                                    >
                                        {sendingInvite ? (
                                            <>
                                                <div className="spinner" style={{ width: 16, height: 16 }}></div>
                                                Generando...
                                            </>
                                        ) : (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                                </svg>
                                                Generar Enlace
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="modal-body">
                                    <div className="success-icon-modal">✅</div>
                                    <h3>¡Enlace Generado!</h3>
                                    <p className="modal-description">
                                        Copia este enlace y envíalo al candidato por correo electrónico o WhatsApp.
                                    </p>

                                    <div className="link-box">
                                        <code>{generatedLink}</code>
                                        <button
                                            onClick={() => copyToClipboard(generatedLink)}
                                            className="btn btn-icon"
                                        >
                                            {copiedLink ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    {copiedLink && (
                                        <p className="copied-message">¡Enlace copiado al portapapeles!</p>
                                    )}

                                    <div className="info-box">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="16" x2="12" y2="12"></line>
                                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                        </svg>
                                        <span>El enlace expira en 7 días</span>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button onClick={closeModal} className="btn btn-primary">
                                        Entendido
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Results Modal */}
            {selectedResult && (
                <div className="modal-overlay" onClick={closeResultModal}>
                    <div className="modal modal-large" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Resultados de {selectedResult.invitation.candidateName}</h2>
                            <button onClick={closeResultModal} className="modal-close">×</button>
                        </div>

                        <div className="modal-body results-modal-body">
                            <div className="results-summary">
                                <div className="summary-card">
                                    <h4>🎯 Perfil DISC</h4>
                                    <p className="profile-type">{selectedResult.summary.discProfile}</p>
                                </div>

                                {selectedResult.summary.strengths.length > 0 && (
                                    <div className="summary-card">
                                        <h4>💪 Fortalezas</h4>
                                        <div className="tags">
                                            {selectedResult.summary.strengths.map((s, i) => (
                                                <span key={i} className="tag tag-success">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="results-sections">
                                {/* DISC */}
                                <div className="result-section">
                                    <h4>🎯 DISC</h4>
                                    <div className="score-bars">
                                        {Object.entries(selectedResult.scores.disc).map(([key, value]) => (
                                            <div key={key} className="score-bar-row">
                                                <span className="score-label">{scoreLabels.disc[key]}</span>
                                                <div className="score-bar-container">
                                                    <div className="score-bar-fill" style={{ width: `${value}%` }}></div>
                                                </div>
                                                <span className="score-value">{value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Big Five */}
                                <div className="result-section">
                                    <h4>⭐ Big Five</h4>
                                    <div className="score-bars">
                                        {Object.entries(selectedResult.scores.bigFive).map(([key, value]) => (
                                            <div key={key} className="score-bar-row">
                                                <span className="score-label">{scoreLabels.bigFive[key]}</span>
                                                <div className="score-bar-container">
                                                    <div className="score-bar-fill" style={{ width: `${value}%` }}></div>
                                                </div>
                                                <span className="score-value">{value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Aptitudes */}
                                <div className="result-section">
                                    <h4>🧠 Aptitudes</h4>
                                    <div className="score-bars">
                                        {Object.entries(selectedResult.scores.aptitudes).map(([key, value]) => (
                                            <div key={key} className="score-bar-row">
                                                <span className="score-label">{scoreLabels.aptitudes[key]}</span>
                                                <div className="score-bar-container">
                                                    <div className="score-bar-fill aptitude" style={{ width: `${value.percentage}%` }}></div>
                                                </div>
                                                <span className="score-value">{value.correct}/{value.total}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Competencies */}
                                <div className="result-section">
                                    <h4>💼 Competencias</h4>
                                    <div className="score-bars">
                                        {Object.entries(selectedResult.scores.competencies).map(([key, value]) => (
                                            <div key={key} className="score-bar-row">
                                                <span className="score-label">{scoreLabels.competencies[key]}</span>
                                                <div className="score-bar-container">
                                                    <div className="score-bar-fill competency" style={{ width: `${value}%` }}></div>
                                                </div>
                                                <span className="score-value">{value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Emotional Intelligence */}
                                <div className="result-section">
                                    <h4>❤️ Inteligencia Emocional</h4>
                                    <div className="score-bars">
                                        {Object.entries(selectedResult.scores.emotionalIntelligence).map(([key, value]) => (
                                            <div key={key} className="score-bar-row">
                                                <span className="score-label">{scoreLabels.emotionalIntelligence[key]}</span>
                                                <div className="score-bar-container">
                                                    <div className="score-bar-fill emotional" style={{ width: `${value}%` }}></div>
                                                </div>
                                                <span className="score-value">{value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button onClick={closeResultModal} className="btn btn-primary">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PsychometricAdmin
