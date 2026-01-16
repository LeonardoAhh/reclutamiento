import { useState, useEffect } from 'react'
import {
    getVacancies,
    createVacancy,
    updateVacancy,
    deleteVacancy,
    toggleVacancyStatus,
    getPositions
} from '../../services/firebaseService'
import QuestionsManager from './QuestionsManager'
import './VacancyManager.css'

function VacancyManager() {
    const [vacancies, setVacancies] = useState([])
    const [positions, setPositions] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingVacancy, setEditingVacancy] = useState(null)
    const [questionsVacancy, setQuestionsVacancy] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        department: '',
        location: '',
        salary: ''
    })

    useEffect(() => {
        loadVacancies()
    }, [])

    const loadVacancies = async () => {
        setLoading(true)
        const [vacanciesData, positionsData] = await Promise.all([
            getVacancies(),
            getPositions()
        ])
        setVacancies(vacanciesData)
        setPositions(positionsData)
        setLoading(false)
    }

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            requirements: '',
            department: '',
            location: '',
            salary: ''
        })
        setEditingVacancy(null)
    }

    const openModal = (vacancy = null) => {
        if (vacancy) {
            setEditingVacancy(vacancy)
            setFormData({
                title: vacancy.title || '',
                description: vacancy.description || '',
                requirements: vacancy.requirements || '',
                department: vacancy.department || '',
                location: vacancy.location || '',
                salary: vacancy.salary || ''
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
            if (editingVacancy) {
                await updateVacancy(editingVacancy.id, formData)
            } else {
                await createVacancy(formData)
            }
            closeModal()
            loadVacancies()
        } catch (error) {
            console.error('Error saving vacancy:', error)
            alert('Error al guardar la vacante')
        }
    }

    const handleToggleStatus = async (vacancy) => {
        try {
            await toggleVacancyStatus(vacancy.id, vacancy.active)
            loadVacancies()
        } catch (error) {
            console.error('Error toggling status:', error)
        }
    }

    const handleDelete = async (vacancy) => {
        if (window.confirm(`¿Estás seguro de eliminar la vacante "${vacancy.title}"?`)) {
            try {
                await deleteVacancy(vacancy.id)
                loadVacancies()
            } catch (error) {
                console.error('Error deleting vacancy:', error)
            }
        }
    }

    return (
        <div className="vacancy-manager">
            <div className="page-header-row">
                <div>
                    <h1 className="admin-page-title">Gestión de Vacantes</h1>
                    <p className="page-subtitle">Administra las posiciones disponibles en la empresa</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Nueva Vacante
                </button>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando vacantes...</p>
                </div>
            ) : vacancies.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-state-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                    </div>
                    <h3 className="empty-state-title">No hay vacantes registradas</h3>
                    <p className="empty-state-text">Crea tu primera vacante para comenzar a recibir candidatos</p>
                    <button onClick={() => openModal()} className="btn btn-primary">
                        Crear Primera Vacante
                    </button>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Vacante</th>
                                <th>Departamento</th>
                                <th>Ubicación</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vacancies.map(vacancy => (
                                <tr key={vacancy.id}>
                                    <td>
                                        <div className="vacancy-cell">
                                            <strong>{vacancy.title}</strong>
                                            <span className="vacancy-desc-preview">
                                                {vacancy.description?.substring(0, 60)}...
                                            </span>
                                        </div>
                                    </td>
                                    <td>{vacancy.department || '-'}</td>
                                    <td>{vacancy.location || '-'}</td>
                                    <td>
                                        <span className={`badge ${vacancy.active ? 'badge-success' : 'badge-warning'}`}>
                                            {vacancy.active ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => handleToggleStatus(vacancy)}
                                                className="btn btn-icon btn-sm"
                                                title={vacancy.active ? 'Desactivar' : 'Activar'}
                                            >
                                                {vacancy.active ? (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                                    </svg>
                                                ) : (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => openModal(vacancy)}
                                                className="btn btn-icon btn-sm"
                                                title="Editar"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setQuestionsVacancy(vacancy)}
                                                className="btn btn-icon btn-sm btn-questions"
                                                title="Gestionar Preguntas"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(vacancy)}
                                                className="btn btn-icon btn-sm btn-danger"
                                                title="Eliminar"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingVacancy ? 'Editar Vacante' : 'Nueva Vacante'}
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
                                    <label className="form-label">Puesto a Contratar *</label>
                                    {positions.length > 0 ? (
                                        <select
                                            name="title"
                                            value={formData.title}
                                            onChange={(e) => {
                                                const selectedPos = positions.find(p => p.position === e.target.value)
                                                setFormData(prev => ({
                                                    ...prev,
                                                    title: e.target.value,
                                                    department: selectedPos?.department || prev.department
                                                }))
                                            }}
                                            className="form-input form-select"
                                            required
                                        >
                                            <option value="">Selecciona un puesto</option>
                                            {positions.map(pos => (
                                                <option key={pos.id} value={pos.position}>
                                                    {pos.position} - {pos.department}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="Ej: Operador de Inyección"
                                            required
                                        />
                                    )}
                                    {positions.length === 0 && (
                                        <small className="form-help">Configura el catálogo de puestos para ver opciones</small>
                                    )}
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Departamento</label>
                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="Ej: Producción"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Ubicación</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="Ej: Querétaro"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Descripción</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Describe las responsabilidades del puesto..."
                                        rows="4"
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Requisitos</label>
                                    <textarea
                                        name="requirements"
                                        value={formData.requirements}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Lista los requisitos necesarios..."
                                        rows="3"
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Sueldo Ofrecido</label>
                                    <input
                                        type="text"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Ej: $8,000 - $10,000 MXN mensuales"
                                    />
                                </div>
                            </div>



                            <div className="modal-footer">
                                <button type="button" onClick={closeModal} className="btn btn-outline">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingVacancy ? 'Guardar Cambios' : 'Crear Vacante'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Questions Manager Modal */}
            {questionsVacancy && (
                <QuestionsManager
                    vacancy={questionsVacancy}
                    onClose={() => setQuestionsVacancy(null)}
                />
            )}
        </div>
    )
}

export default VacancyManager
