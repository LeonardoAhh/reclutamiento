import { useState, useEffect } from 'react'
import { getCandidates, getVacancies, updateCandidateStatus, deleteCandidate } from '../../services/firebaseService'
import { exportCandidatesToExcel } from '../../services/excelExport'
import './Candidates.css'

function Candidates() {
    const [candidates, setCandidates] = useState([])
    const [vacancies, setVacancies] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterVacancy, setFilterVacancy] = useState('all')
    const [selectedCandidate, setSelectedCandidate] = useState(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        const [candidatesData, vacanciesData] = await Promise.all([
            getCandidates(),
            getVacancies()
        ])
        setCandidates(candidatesData)
        setVacancies(vacanciesData)
        setLoading(false)
    }

    const getVacancyTitle = (vacancyId) => {
        const vacancy = vacancies.find(v => v.id === vacancyId)
        return vacancy?.title || 'No especificada'
    }

    const filteredCandidates = filterVacancy === 'all'
        ? candidates
        : candidates.filter(c => c.vacancyId === filterVacancy)

    const handleExportExcel = () => {
        const dataToExport = filterVacancy === 'all' ? candidates : filteredCandidates
        exportCandidatesToExcel(dataToExport, vacancies, 'candidatos_vinoplastic')
    }

    const handleStatusChange = async (candidate, newStatus) => {
        try {
            await updateCandidateStatus(candidate.id, newStatus)
            loadData()
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    const handleDelete = async (candidate) => {
        if (window.confirm(`¿Eliminar la postulación de "${candidate.fullName}"?`)) {
            try {
                await deleteCandidate(candidate.id)
                loadData()
            } catch (error) {
                console.error('Error deleting candidate:', error)
            }
        }
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

    const statusOptions = [
        { value: 'pending', label: 'Pendiente', color: 'warning' },
        { value: 'reviewed', label: 'Revisado', color: 'info' },
        { value: 'contacted', label: 'Contactado', color: 'info' },
        { value: 'interviewed', label: 'Entrevistado', color: 'info' },
        { value: 'hired', label: 'Contratado', color: 'success' },
        { value: 'rejected', label: 'Rechazado', color: 'error' }
    ]

    const getStatusBadge = (status) => {
        const option = statusOptions.find(s => s.value === status) || statusOptions[0]
        return <span className={`badge badge-${option.color}`}>{option.label}</span>
    }

    return (
        <div className="candidates-page">
            <div className="page-header-row">
                <div>
                    <h1 className="admin-page-title">Candidatos Postulados</h1>
                    <p className="page-subtitle">
                        {filteredCandidates.length} candidato{filteredCandidates.length !== 1 ? 's' : ''}
                        {filterVacancy !== 'all' && ' para esta vacante'}
                    </p>
                </div>
                <div className="header-actions">
                    <select
                        value={filterVacancy}
                        onChange={(e) => setFilterVacancy(e.target.value)}
                        className="form-input form-select filter-select"
                    >
                        <option value="all">Todas las vacantes</option>
                        {vacancies.map(v => (
                            <option key={v.id} value={v.id}>{v.title}</option>
                        ))}
                    </select>
                    <button onClick={handleExportExcel} className="btn btn-accent" disabled={filteredCandidates.length === 0}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Exportar Excel
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando candidatos...</p>
                </div>
            ) : filteredCandidates.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-state-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <h3 className="empty-state-title">No hay candidatos aún</h3>
                    <p className="empty-state-text">Los candidatos que se postulen aparecerán aquí</p>
                </div>
            ) : (
                <div className="candidates-grid">
                    {filteredCandidates.map(candidate => (
                        <div key={candidate.id} className="candidate-card card">
                            <div className="candidate-header">
                                <div className="candidate-avatar">
                                    {candidate.fullName?.charAt(0).toUpperCase()}
                                </div>
                                <div className="candidate-info">
                                    <h3 className="candidate-name">{candidate.fullName}</h3>
                                    <p className="candidate-vacancy">{getVacancyTitle(candidate.vacancyId)}</p>
                                </div>
                                {getStatusBadge(candidate.status)}
                            </div>

                            <div className="candidate-details">
                                <div className="detail-row">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    <span>{candidate.email}</span>
                                </div>
                                <div className="detail-row">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                    <span>{candidate.phone}</span>
                                </div>
                                <div className="detail-row">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                    <span>{formatDate(candidate.createdAt)}</span>
                                </div>
                            </div>

                            {(candidate.experience || candidate.message) && (
                                <div className="candidate-extra">
                                    {candidate.experience && (
                                        <div className="extra-section">
                                            <strong>Experiencia:</strong>
                                            <p>{candidate.experience}</p>
                                        </div>
                                    )}
                                    {candidate.message && (
                                        <div className="extra-section">
                                            <strong>Motivación:</strong>
                                            <p>{candidate.message}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="candidate-actions">
                                <select
                                    value={candidate.status || 'pending'}
                                    onChange={(e) => handleStatusChange(candidate, e.target.value)}
                                    className="form-input form-select status-select"
                                >
                                    {statusOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => handleDelete(candidate)}
                                    className="btn btn-icon btn-sm btn-danger"
                                    title="Eliminar"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Candidates
