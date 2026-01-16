import { useState, useEffect } from 'react'
import {
    getPositions,
    createPosition,
    updatePosition,
    deletePosition,
    importPositions
} from '../../services/firebaseService'
import positionsData from '../../data/data.json'
import './Positions.css'

function Positions() {
    const [positions, setPositions] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingPosition, setEditingPosition] = useState(null)
    const [filter, setFilter] = useState('')
    const [importing, setImporting] = useState(false)
    const [formData, setFormData] = useState({
        position: '',
        department: ''
    })

    useEffect(() => {
        loadPositions()
    }, [])

    const loadPositions = async () => {
        setLoading(true)
        const data = await getPositions()
        setPositions(data)
        setLoading(false)
    }

    const resetForm = () => {
        setFormData({
            position: '',
            department: ''
        })
        setEditingPosition(null)
    }

    const openModal = (position = null) => {
        if (position) {
            setEditingPosition(position)
            setFormData({
                position: position.position || '',
                department: position.department || ''
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
            if (editingPosition) {
                await updatePosition(editingPosition.id, formData)
            } else {
                await createPosition(formData)
            }
            closeModal()
            loadPositions()
        } catch (error) {
            console.error('Error saving position:', error)
            alert('Error al guardar el puesto')
        }
    }

    const handleDelete = async (position) => {
        if (window.confirm(`¿Eliminar el puesto "${position.position}"?`)) {
            try {
                await deletePosition(position.id)
                loadPositions()
            } catch (error) {
                console.error('Error deleting position:', error)
            }
        }
    }

    const handleImport = async () => {
        if (positions.length > 0) {
            if (!window.confirm('Ya existen puestos. ¿Deseas importar los datos del archivo JSON de todos modos?')) {
                return
            }
        }

        setImporting(true)
        try {
            await importPositions(positionsData)
            loadPositions()
            alert(`Se importaron ${positionsData.length} puestos correctamente`)
        } catch (error) {
            console.error('Error importing positions:', error)
            alert('Error al importar los puestos')
        } finally {
            setImporting(false)
        }
    }

    // Get unique departments for filtering
    const departments = ['', ...new Set(positions.map(p => p.department).filter(Boolean))].sort()

    const filteredPositions = filter
        ? positions.filter(p => p.department === filter)
        : positions

    return (
        <div className="positions-page">
            <div className="page-header-row">
                <div>
                    <h1 className="admin-page-title">Catálogo de Puestos</h1>
                    <p className="page-subtitle">
                        {positions.length} puestos registrados
                    </p>
                </div>
                <div className="header-actions">
                    {positions.length === 0 && (
                        <button
                            onClick={handleImport}
                            className="btn btn-outline"
                            disabled={importing}
                        >
                            {importing ? (
                                <>
                                    <div className="spinner" style={{ width: 16, height: 16 }}></div>
                                    Importando...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    Importar desde JSON
                                </>
                            )}
                        </button>
                    )}
                    <button onClick={() => openModal()} className="btn btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Nuevo Puesto
                    </button>
                </div>
            </div>

            {/* Filters */}
            {departments.length > 2 && (
                <div className="positions-filters">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="form-input form-select filter-select"
                    >
                        <option value="">Todos los departamentos</option>
                        {departments.filter(d => d).map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
            )}

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando puestos...</p>
                </div>
            ) : positions.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-state-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                    </div>
                    <h3 className="empty-state-title">No hay puestos registrados</h3>
                    <p className="empty-state-text">Importa los puestos desde el archivo JSON o crea uno manualmente</p>
                    <div className="empty-state-actions">
                        <button onClick={handleImport} className="btn btn-primary" disabled={importing}>
                            Importar desde JSON
                        </button>
                        <button onClick={() => openModal()} className="btn btn-outline">
                            Crear Manualmente
                        </button>
                    </div>
                </div>
            ) : (
                <div className="positions-table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Puesto</th>
                                <th>Departamento</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPositions.map(position => (
                                <tr key={position.id}>
                                    <td>
                                        <strong>{position.position}</strong>
                                    </td>
                                    <td>
                                        <span className="department-badge">{position.department}</span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => openModal(position)}
                                                className="btn btn-icon btn-sm"
                                                title="Editar"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(position)}
                                                className="btn btn-icon btn-sm btn-danger"
                                                title="Eliminar"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                                {editingPosition ? 'Editar Puesto' : 'Nuevo Puesto'}
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
                                    <label className="form-label">Nombre del Puesto *</label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Ej: Supervisor de Producción"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Departamento *</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Ej: Producción"
                                        required
                                        list="departments-list"
                                    />
                                    <datalist id="departments-list">
                                        {departments.filter(d => d).map(dept => (
                                            <option key={dept} value={dept} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={closeModal} className="btn btn-outline">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingPosition ? 'Guardar Cambios' : 'Crear Puesto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Positions
