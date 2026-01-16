import { useState, useEffect } from 'react'
import {
    getQuestionsByVacancy,
    createQuestion,
    updateQuestion,
    deleteQuestion
} from '../../services/firebaseService'
import './QuestionsManager.css'

function QuestionsManager({ vacancy, onClose }) {
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState(null)
    const [formData, setFormData] = useState({
        text: '',
        type: 'text',
        required: false,
        options: ''
    })

    useEffect(() => {
        if (vacancy?.id) {
            loadQuestions()
        }
    }, [vacancy?.id])

    const loadQuestions = async () => {
        setLoading(true)
        const data = await getQuestionsByVacancy(vacancy.id)
        setQuestions(data)
        setLoading(false)
    }

    const resetForm = () => {
        setFormData({
            text: '',
            type: 'text',
            required: false,
            options: ''
        })
        setEditingQuestion(null)
        setShowForm(false)
    }

    const openForm = (question = null) => {
        if (question) {
            setEditingQuestion(question)
            setFormData({
                text: question.text || '',
                type: question.type || 'text',
                required: question.required || false,
                options: question.options?.join(', ') || ''
            })
        } else {
            resetForm()
        }
        setShowForm(true)
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const questionData = {
                vacancyId: vacancy.id,
                text: formData.text,
                type: formData.type,
                required: formData.required,
                order: editingQuestion ? editingQuestion.order : questions.length
            }

            // Parse options for select/radio/checkbox types
            if (['select', 'radio', 'checkbox'].includes(formData.type) && formData.options) {
                questionData.options = formData.options.split(',').map(opt => opt.trim()).filter(Boolean)
            }

            if (editingQuestion) {
                await updateQuestion(editingQuestion.id, questionData)
            } else {
                await createQuestion(questionData)
            }

            resetForm()
            loadQuestions()
        } catch (error) {
            console.error('Error saving question:', error)
            alert('Error al guardar la pregunta')
        }
    }

    const handleDelete = async (question) => {
        if (window.confirm(`¿Eliminar la pregunta "${question.text}"?`)) {
            try {
                await deleteQuestion(question.id)
                loadQuestions()
            } catch (error) {
                console.error('Error deleting question:', error)
            }
        }
    }

    const getTypeLabel = (type) => {
        const labels = {
            text: 'Texto corto',
            textarea: 'Texto largo',
            select: 'Selección única',
            radio: 'Opciones (radio)',
            checkbox: 'Múltiple (checkbox)',
            number: 'Número',
            date: 'Fecha'
        }
        return labels[type] || type
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal questions-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">Preguntas de Postulación</h2>
                        <p className="modal-subtitle">{vacancy.title}</p>
                    </div>
                    <button onClick={onClose} className="modal-close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    {/* Add Question Button */}
                    {!showForm && (
                        <button onClick={() => openForm()} className="btn btn-primary btn-sm add-question-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Agregar Pregunta
                        </button>
                    )}

                    {/* Question Form */}
                    {showForm && (
                        <div className="question-form-card">
                            <h4>{editingQuestion ? 'Editar Pregunta' : 'Nueva Pregunta'}</h4>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Texto de la pregunta *</label>
                                    <input
                                        type="text"
                                        name="text"
                                        value={formData.text}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Ej: ¿Cuántos años de experiencia tienes?"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Tipo de respuesta</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            className="form-input form-select"
                                        >
                                            <option value="text">Texto corto</option>
                                            <option value="textarea">Texto largo</option>
                                            <option value="number">Número</option>
                                            <option value="date">Fecha</option>
                                            <option value="select">Selección única (dropdown)</option>
                                            <option value="radio">Opciones (radio buttons)</option>
                                        </select>
                                    </div>

                                    <div className="form-group checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="required"
                                                checked={formData.required}
                                                onChange={handleChange}
                                            />
                                            <span>Respuesta obligatoria</span>
                                        </label>
                                    </div>
                                </div>

                                {['select', 'radio'].includes(formData.type) && (
                                    <div className="form-group">
                                        <label className="form-label">Opciones (separadas por coma)</label>
                                        <input
                                            type="text"
                                            name="options"
                                            value={formData.options}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="Ej: Opción 1, Opción 2, Opción 3"
                                        />
                                    </div>
                                )}

                                <div className="form-actions">
                                    <button type="button" onClick={resetForm} className="btn btn-outline btn-sm">
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary btn-sm">
                                        {editingQuestion ? 'Guardar' : 'Agregar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Questions List */}
                    {loading ? (
                        <div className="loading-state small">
                            <div className="spinner"></div>
                        </div>
                    ) : questions.length === 0 && !showForm ? (
                        <div className="empty-questions">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            <p>No hay preguntas configuradas para esta vacante</p>
                            <span>Las preguntas se mostrarán en el formulario de postulación</span>
                        </div>
                    ) : (
                        <div className="questions-list">
                            {questions.map((question, index) => (
                                <div key={question.id} className="question-item">
                                    <div className="question-order">{index + 1}</div>
                                    <div className="question-content">
                                        <p className="question-text">
                                            {question.text}
                                            {question.required && <span className="required-badge">*</span>}
                                        </p>
                                        <span className="question-type">{getTypeLabel(question.type)}</span>
                                        {question.options && (
                                            <span className="question-options">
                                                Opciones: {question.options.join(', ')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="question-actions">
                                        <button
                                            onClick={() => openForm(question)}
                                            className="btn btn-icon btn-sm"
                                            title="Editar"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(question)}
                                            className="btn btn-icon btn-sm btn-danger"
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
                </div>

                <div className="modal-footer">
                    <button onClick={onClose} className="btn btn-primary">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default QuestionsManager
