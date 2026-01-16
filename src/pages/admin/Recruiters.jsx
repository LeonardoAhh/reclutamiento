import { useState, useEffect } from 'react'
import {
    getRecruiters,
    createRecruiter,
    updateRecruiter,
    deleteRecruiter
} from '../../services/firebaseService'
import './Recruiters.css'

function Recruiters() {
    const [recruiters, setRecruiters] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingRecruiter, setEditingRecruiter] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        extension: '',
        department: '',
        whatsapp: '',
        position: ''
    })

    useEffect(() => {
        loadRecruiters()
    }, [])

    const loadRecruiters = async () => {
        setLoading(true)
        const data = await getRecruiters()
        setRecruiters(data)
        setLoading(false)
    }

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            extension: '',
            department: '',
            whatsapp: '',
            position: ''
        })
        setEditingRecruiter(null)
    }

    const openModal = (recruiter = null) => {
        if (recruiter) {
            setEditingRecruiter(recruiter)
            setFormData({
                name: recruiter.name || '',
                email: recruiter.email || '',
                phone: recruiter.phone || '',
                extension: recruiter.extension || '',
                department: recruiter.department || '',
                whatsapp: recruiter.whatsapp || '',
                position: recruiter.position || ''
            })
        } else {
            resetForm()
        }
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        resetForm()
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (editingRecruiter) {
                await updateRecruiter(editingRecruiter.id, formData)
            } else {
                await createRecruiter(formData)
            }
            closeModal()
            loadRecruiters()
        } catch (error) {
            console.error('Error saving recruiter:', error)
            alert('Error al guardar los datos')
        }
    }

    const handleDelete = async (recruiter) => {
        if (window.confirm(`¿Estás seguro de eliminar a "${recruiter.name}"?`)) {
            try {
                await deleteRecruiter(recruiter.id)
                loadRecruiters()
            } catch (error) {
                console.error('Error deleting recruiter:', error)
            }
        }
    }

    return (
        <div className="recruiters-page">
            <div className="page-header-row">
                <div>
                    <h1 className="admin-page-title">Datos de Reclutadoras</h1>
                    <p className="page-subtitle">Información de contacto del equipo de reclutamiento</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Agregar Reclutadora
                </button>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando...</p>
                </div>
            ) : recruiters.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-state-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                    </div>
                    <h3 className="empty-state-title">No hay reclutadoras registradas</h3>
                    <p className="empty-state-text">Agrega los datos de contacto del equipo de reclutamiento</p>
                    <button onClick={() => openModal()} className="btn btn-primary">
                        Agregar Primera Reclutadora
                    </button>
                </div>
            ) : (
                <div className="recruiters-grid">
                    {recruiters.map(recruiter => (
                        <div key={recruiter.id} className="recruiter-card card">
                            <div className="recruiter-avatar">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>

                            <h3 className="recruiter-name">{recruiter.name}</h3>
                            {recruiter.department && (
                                <span className="recruiter-department">{recruiter.department}</span>
                            )}

                            <div className="recruiter-contact">
                                <a href={`mailto:${recruiter.email}`} className="contact-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    <span>{recruiter.email}</span>
                                </a>
                                <a href={`tel:${recruiter.phone}`} className="contact-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                    <span>{recruiter.phone}</span>
                                    {recruiter.extension && <span className="extension">Ext. {recruiter.extension}</span>}
                                </a>
                            </div>

                            <div className="recruiter-actions">
                                <button
                                    onClick={() => openModal(recruiter)}
                                    className="btn btn-outline btn-sm"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(recruiter)}
                                    className="btn btn-outline btn-sm btn-danger-outline"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingRecruiter ? 'Editar Reclutadora' : 'Nueva Reclutadora'}
                            </h2>
                            <button onClick={closeModal} className="modal-close">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Nombre Completo *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Ej: María García López"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Puesto</label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Ej: Coordinador RYS"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">WhatsApp *</label>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="+52 442 123 4567"
                                        required
                                    />
                                    <small className="form-help">Incluye código de país (+52 para México)</small>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={closeModal} className="btn btn-outline">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingRecruiter ? 'Guardar Cambios' : 'Agregar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Recruiters
