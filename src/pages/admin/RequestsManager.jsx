import { useState, useEffect } from 'react'
import {
    getImprovementRequests,
    updateImprovementRequest,
    deleteImprovementRequest
} from '../../services/firebaseService'
import './RequestsManager.css'

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pendiente', color: 'warning' },
    { value: 'in_progress', label: 'En Proceso', color: 'info' },
    { value: 'completed', label: 'Completada', color: 'success' },
    { value: 'rejected', label: 'Rechazada', color: 'danger' }
]

const PRIORITY_LABELS = {
    low: { label: 'Baja', color: 'neutral' },
    medium: { label: 'Media', color: 'warning' },
    high: { label: 'Alta', color: 'danger' }
}

const CATEGORY_LABELS = {
    feature: '✨ Nueva Funcionalidad',
    bug: '🐛 Error',
    improvement: '📈 Mejora',
    design: '🎨 Diseño',
    other: '📝 Otro'
}

function RequestsManager() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [filter, setFilter] = useState('all')
    const [responseText, setResponseText] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        loadRequests()
    }, [])

    const loadRequests = async () => {
        setLoading(true)
        const data = await getImprovementRequests()
        setRequests(data)
        setLoading(false)
    }

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            await updateImprovementRequest(requestId, { status: newStatus })
            setRequests(prev => prev.map(r =>
                r.id === requestId ? { ...r, status: newStatus } : r
            ))
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    const handleRespond = async () => {
        if (!selectedRequest || !responseText.trim()) return

        setSaving(true)
        try {
            await updateImprovementRequest(selectedRequest.id, {
                adminResponse: responseText,
                status: 'in_progress'
            })
            setRequests(prev => prev.map(r =>
                r.id === selectedRequest.id
                    ? { ...r, adminResponse: responseText, status: 'in_progress' }
                    : r
            ))
            setSelectedRequest(null)
            setResponseText('')
        } catch (error) {
            console.error('Error responding:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (requestId) => {
        if (!window.confirm('¿Eliminar esta solicitud permanentemente?')) return

        try {
            await deleteImprovementRequest(requestId)
            setRequests(prev => prev.filter(r => r.id !== requestId))
        } catch (error) {
            console.error('Error deleting:', error)
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

    const filteredRequests = filter === 'all'
        ? requests
        : requests.filter(r => r.status === filter)

    const statusCounts = {
        all: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        in_progress: requests.filter(r => r.status === 'in_progress').length,
        completed: requests.filter(r => r.status === 'completed').length,
        rejected: requests.filter(r => r.status === 'rejected').length
    }

    return (
        <div className="requests-manager-page">
            <div className="page-header-row">
                <div>
                    <h1 className="admin-page-title">Gestión de Solicitudes</h1>
                    <p className="page-subtitle">
                        {requests.length} solicitudes totales • {statusCounts.pending} pendientes
                    </p>
                </div>
            </div>

            {/* Filtros por estado */}
            <div className="status-filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Todas ({statusCounts.all})
                </button>
                {STATUS_OPTIONS.map(status => (
                    <button
                        key={status.value}
                        className={`filter-btn filter-${status.color} ${filter === status.value ? 'active' : ''}`}
                        onClick={() => setFilter(status.value)}
                    >
                        {status.label} ({statusCounts[status.value]})
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando solicitudes...</p>
                </div>
            ) : filteredRequests.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-state-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <h3 className="empty-state-title">No hay solicitudes en esta categoría</h3>
                </div>
            ) : (
                <div className="requests-grid">
                    {filteredRequests.map(request => (
                        <div key={request.id} className={`request-card-manager card priority-${request.priority}`}>
                            <div className="request-card-header">
                                <div className="request-info">
                                    <span className="request-category-tag">
                                        {CATEGORY_LABELS[request.category] || request.category}
                                    </span>
                                    <span className={`priority-badge priority-${request.priority}`}>
                                        {PRIORITY_LABELS[request.priority]?.label}
                                    </span>
                                </div>
                                <select
                                    value={request.status}
                                    onChange={(e) => handleStatusChange(request.id, e.target.value)}
                                    className={`status-select status-${request.status}`}
                                >
                                    {STATUS_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <h3 className="request-card-title">{request.title}</h3>

                            <p className="request-card-description">{request.description}</p>

                            <div className="request-card-meta">
                                <span className="meta-author">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    {request.userName}
                                </span>
                                <span className="meta-date">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                    {formatDate(request.createdAt)}
                                </span>
                            </div>

                            {request.adminResponse && (
                                <div className="admin-response-box">
                                    <strong>Tu respuesta:</strong>
                                    <p>{request.adminResponse}</p>
                                </div>
                            )}

                            <div className="request-card-actions">
                                <button
                                    onClick={() => {
                                        setSelectedRequest(request)
                                        setResponseText(request.adminResponse || '')
                                    }}
                                    className="btn btn-sm btn-outline"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    Responder
                                </button>
                                <button
                                    onClick={() => handleDelete(request.id)}
                                    className="btn btn-sm btn-icon btn-danger"
                                    title="Eliminar"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de respuesta */}
            {selectedRequest && (
                <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Responder Solicitud</h2>
                            <button onClick={() => setSelectedRequest(null)} className="modal-close">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="response-request-preview">
                                <h4>{selectedRequest.title}</h4>
                                <p>{selectedRequest.description}</p>
                                <span className="preview-author">De: {selectedRequest.userName}</span>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tu Respuesta</label>
                                <textarea
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    className="form-input"
                                    placeholder="Escribe tu respuesta o comentario..."
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setSelectedRequest(null)} className="btn btn-outline">
                                Cancelar
                            </button>
                            <button
                                onClick={handleRespond}
                                className="btn btn-primary"
                                disabled={saving || !responseText.trim()}
                            >
                                {saving ? 'Guardando...' : 'Enviar Respuesta'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RequestsManager
