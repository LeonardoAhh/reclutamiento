import { useState, useEffect } from 'react'
import {
    getImprovementRequests,
    createImprovementRequest
} from '../../services/firebaseService'
import './ImprovementRequests.css'

// Email del admin/desarrollador
const ADMIN_EMAIL = 'capacitacionqro@vinoplastic.com'

// Emails de reclutadores que pueden enviar solicitudes
const RECRUITER_EMAILS = [
    'reclutamientoqro@vinoplastic.com',
    'reclutamientoqro2@vinoplastic.com',
    'reclutamientoqro3@vinoplastic.com'
]

const STATUS_LABELS = {
    pending: { label: 'Pendiente', color: 'warning' },
    in_progress: { label: 'En Proceso', color: 'info' },
    completed: { label: 'Completada', color: 'success' },
    rejected: { label: 'Rechazada', color: 'danger' }
}

const PRIORITY_LABELS = {
    low: { label: 'Baja', color: 'neutral' },
    medium: { label: 'Media', color: 'warning' },
    high: { label: 'Alta', color: 'danger' }
}

function ImprovementRequests({ userEmail, userName }) {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        category: 'feature'
    })

    const isRecruiter = RECRUITER_EMAILS.includes(userEmail)

    useEffect(() => {
        loadRequests()
    }, [userEmail])

    const loadRequests = async () => {
        setLoading(true)
        // Los reclutadores solo ven sus propias solicitudes
        const data = await getImprovementRequests(isRecruiter ? userEmail : null)
        setRequests(data)
        setLoading(false)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            await createImprovementRequest({
                ...formData,
                userEmail,
                userName: userName || userEmail.split('@')[0],
                assignedTo: ADMIN_EMAIL
            })
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                category: 'feature'
            })
            setShowForm(false)
            loadRequests()
            alert('¡Solicitud enviada correctamente!')
        } catch (error) {
            console.error('Error submitting request:', error)
            alert('Error al enviar la solicitud')
        } finally {
            setSubmitting(false)
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

    return (
        <div className="improvement-requests-page">
            <div className="page-header-row">
                <div>
                    <h1 className="admin-page-title">
                        {isRecruiter ? 'Mis Solicitudes de Mejora' : 'Solicitudes de Mejora'}
                    </h1>
                    <p className="page-subtitle">
                        {isRecruiter
                            ? 'Envía sugerencias y reporta problemas al equipo de desarrollo'
                            : `${requests.length} solicitudes recibidas`
                        }
                    </p>
                </div>
                {isRecruiter && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn btn-primary"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Nueva Solicitud
                    </button>
                )}
            </div>

            {/* Formulario de nueva solicitud */}
            {showForm && isRecruiter && (
                <div className="request-form-card card">
                    <h3>Nueva Solicitud de Mejora</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Título *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Resumen breve de la mejora o problema"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Categoría</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="form-input form-select"
                                >
                                    <option value="feature">Nueva Funcionalidad</option>
                                    <option value="bug">Reporte de Error</option>
                                    <option value="improvement">Mejora Existente</option>
                                    <option value="design">Diseño/UI</option>
                                    <option value="other">Otro</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Prioridad</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="form-input form-select"
                                >
                                    <option value="low">Baja</option>
                                    <option value="medium">Media</option>
                                    <option value="high">Alta</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Descripción Detallada *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Describe con detalle qué te gustaría mejorar, añadir o reportar..."
                                rows="5"
                                required
                            ></textarea>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="btn btn-outline"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submitting}
                            >
                                {submitting ? 'Enviando...' : 'Enviar Solicitud'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista de solicitudes */}
            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando solicitudes...</p>
                </div>
            ) : requests.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-state-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                    <h3 className="empty-state-title">
                        {isRecruiter ? 'No has enviado solicitudes' : 'No hay solicitudes'}
                    </h3>
                    <p className="empty-state-text">
                        {isRecruiter
                            ? '¿Tienes una idea o encontraste un problema? ¡Envía tu primera solicitud!'
                            : 'Cuando los reclutadores envíen solicitudes, aparecerán aquí.'
                        }
                    </p>
                </div>
            ) : (
                <div className="requests-list">
                    {requests.map(request => (
                        <div key={request.id} className="request-card card">
                            <div className="request-header">
                                <div className="request-title-section">
                                    <h3 className="request-title">{request.title}</h3>
                                    <div className="request-meta">
                                        {!isRecruiter && (
                                            <span className="request-author">
                                                De: {request.userName}
                                            </span>
                                        )}
                                        <span className="request-date">
                                            {formatDate(request.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <div className="request-badges">
                                    <span className={`badge badge-${STATUS_LABELS[request.status]?.color || 'neutral'}`}>
                                        {STATUS_LABELS[request.status]?.label || request.status}
                                    </span>
                                    <span className={`badge badge-${PRIORITY_LABELS[request.priority]?.color || 'neutral'}`}>
                                        {PRIORITY_LABELS[request.priority]?.label || request.priority}
                                    </span>
                                </div>
                            </div>
                            <p className="request-description">{request.description}</p>
                            <div className="request-footer">
                                <span className="request-category">
                                    {request.category === 'feature' && '✨ Nueva Funcionalidad'}
                                    {request.category === 'bug' && '🐛 Reporte de Error'}
                                    {request.category === 'improvement' && '📈 Mejora'}
                                    {request.category === 'design' && '🎨 Diseño/UI'}
                                    {request.category === 'other' && '📝 Otro'}
                                </span>
                                {request.adminResponse && (
                                    <div className="admin-response">
                                        <strong>Respuesta:</strong> {request.adminResponse}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ImprovementRequests
