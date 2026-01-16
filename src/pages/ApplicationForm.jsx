import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getVacancies, getVacancy, createCandidate, getQuestionsByVacancy } from '../services/firebaseService'
import './ApplicationForm.css'

function ApplicationForm() {
    const { vacancyId } = useParams()
    const navigate = useNavigate()
    const [vacancies, setVacancies] = useState([])
    const [selectedVacancy, setSelectedVacancy] = useState(null)
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState({})

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        vacancyId: vacancyId || '',
        zona: '',
        message: ''
    })

    const [answers, setAnswers] = useState({})

    useEffect(() => {
        loadData()
    }, [vacancyId])

    const loadData = async () => {
        setLoading(true)
        const vacanciesData = await getVacancies(true)
        setVacancies(vacanciesData)

        if (vacancyId) {
            const vacancy = await getVacancy(vacancyId)
            setSelectedVacancy(vacancy)
            setFormData(prev => ({ ...prev, vacancyId }))
            // Load questions for this vacancy
            const vacancyQuestions = await getQuestionsByVacancy(vacancyId)
            setQuestions(vacancyQuestions)
        }
        setLoading(false)
    }

    const loadQuestionsForVacancy = async (id) => {
        if (id) {
            const vacancyQuestions = await getQuestionsByVacancy(id)
            setQuestions(vacancyQuestions)
            setAnswers({}) // Reset answers when vacancy changes
        } else {
            setQuestions([])
            setAnswers({})
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }

        // Update selected vacancy when dropdown changes
        if (name === 'vacancyId') {
            const vacancy = vacancies.find(v => v.id === value)
            setSelectedVacancy(vacancy)
            loadQuestionsForVacancy(value)
        }
    }

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }))
        // Clear error
        if (errors[`question_${questionId}`]) {
            setErrors(prev => ({ ...prev, [`question_${questionId}`]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'El nombre es requerido'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Ingresa un email válido'
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'El teléfono es requerido'
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Ingresa un teléfono válido (10 dígitos)'
        }

        if (!formData.vacancyId) {
            newErrors.vacancyId = 'Selecciona una vacante'
        }

        // Validate required questions
        questions.forEach(question => {
            if (question.required && !answers[question.id]?.trim()) {
                newErrors[`question_${question.id}`] = 'Esta pregunta es obligatoria'
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setSubmitting(true)
        try {
            const vacancyTitle = selectedVacancy?.title || ''

            // Prepare answers with question text for easy reading
            const formattedAnswers = questions.map(q => ({
                questionId: q.id,
                questionText: q.text,
                answer: answers[q.id] || ''
            }))

            await createCandidate({
                ...formData,
                vacancyTitle,
                answers: formattedAnswers
            })
            setSubmitted(true)
        } catch (error) {
            console.error('Error submitting application:', error)
            alert('Hubo un error al enviar tu postulación. Por favor intenta de nuevo.')
        } finally {
            setSubmitting(false)
        }
    }

    const renderQuestionInput = (question) => {
        const errorKey = `question_${question.id}`
        const hasError = !!errors[errorKey]

        switch (question.type) {
            case 'textarea':
                return (
                    <textarea
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className={`form-input ${hasError ? 'form-input-error' : ''}`}
                        placeholder="Escribe tu respuesta..."
                        rows="3"
                    />
                )
            case 'number':
                return (
                    <input
                        type="number"
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className={`form-input ${hasError ? 'form-input-error' : ''}`}
                        placeholder="Ingresa un número"
                    />
                )
            case 'date':
                return (
                    <input
                        type="date"
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className={`form-input ${hasError ? 'form-input-error' : ''}`}
                    />
                )
            case 'select':
                return (
                    <select
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className={`form-input form-select ${hasError ? 'form-input-error' : ''}`}
                    >
                        <option value="">Selecciona una opción</option>
                        {question.options?.map((opt, idx) => (
                            <option key={idx} value={opt}>{opt}</option>
                        ))}
                    </select>
                )
            case 'radio':
                return (
                    <div className="radio-group">
                        {question.options?.map((opt, idx) => (
                            <label key={idx} className="radio-label">
                                <input
                                    type="radio"
                                    name={`question_${question.id}`}
                                    value={opt}
                                    checked={answers[question.id] === opt}
                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                />
                                <span>{opt}</span>
                            </label>
                        ))}
                    </div>
                )
            default: // text
                return (
                    <input
                        type="text"
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className={`form-input ${hasError ? 'form-input-error' : ''}`}
                        placeholder="Escribe tu respuesta..."
                    />
                )
        }
    }

    if (loading) {
        return (
            <div className="form-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando...</p>
                </div>
            </div>
        )
    }

    if (submitted) {
        return (
            <div className="form-page">
                <div className="form-container">
                    <div className="success-card animate-scale-in">
                        <div className="success-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <h2 className="success-title">¡Postulación Enviada!</h2>
                        <p className="success-message">
                            Gracias por tu interés en formar parte de Viñoplastic.
                            Hemos recibido tu información y nuestro equipo de reclutamiento
                            se pondrá en contacto contigo pronto.
                        </p>
                        <div className="success-actions">
                            <button onClick={() => navigate('/inicio')} className="btn btn-primary">
                                Ver más vacantes
                            </button>
                            <button onClick={() => navigate('/')} className="btn btn-outline">
                                Ir al inicio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="form-page">
            {/* Header */}
            <header className="form-header">
                <div className="container">
                    <nav className="form-nav">
                        <Link to="/" className="form-brand">
                            <div className="form-logo">V</div>
                            <span className="form-logo-text">Viñoplastic</span>
                        </Link>
                        <Link to="/inicio" className="btn btn-secondary btn-sm">
                            ← Volver a vacantes
                        </Link>
                    </nav>
                </div>
            </header>

            <div className="form-container">
                <div className="form-card animate-fade-in-up">
                    <div className="form-card-header">
                        <h1 className="form-title">Postúlate Ahora</h1>
                        <p className="form-subtitle">
                            Completa el formulario y da el primer paso hacia tu nuevo empleo
                        </p>
                    </div>

                    {selectedVacancy && (
                        <div className="selected-vacancy-banner">
                            <div className="banner-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                </svg>
                            </div>
                            <div className="banner-content">
                                <span className="banner-label">Postulándote a:</span>
                                <strong className="banner-title">{selectedVacancy.title}</strong>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="application-form">
                        <div className="form-group">
                            <label className="form-label" htmlFor="fullName">
                                Nombre Completo *
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`form-input ${errors.fullName ? 'form-input-error' : ''}`}
                                placeholder="Ej: Juan Pérez García"
                            />
                            {errors.fullName && <span className="form-error">{errors.fullName}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="email">
                                    Correo Electrónico *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                                    placeholder="correo@ejemplo.com"
                                />
                                {errors.email && <span className="form-error">{errors.email}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="phone">
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`form-input ${errors.phone ? 'form-input-error' : ''}`}
                                    placeholder="4421234567"
                                />
                                {errors.phone && <span className="form-error">{errors.phone}</span>}
                            </div>
                        </div>

                        {!vacancyId && (
                            <div className="form-group">
                                <label className="form-label" htmlFor="vacancyId">
                                    Vacante de Interés *
                                </label>
                                <select
                                    id="vacancyId"
                                    name="vacancyId"
                                    value={formData.vacancyId}
                                    onChange={handleChange}
                                    className={`form-input form-select ${errors.vacancyId ? 'form-input-error' : ''}`}
                                >
                                    <option value="">Selecciona una vacante</option>
                                    {vacancies.map(vacancy => (
                                        <option key={vacancy.id} value={vacancy.id}>
                                            {vacancy.title} {vacancy.department ? `- ${vacancy.department}` : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.vacancyId && <span className="form-error">{errors.vacancyId}</span>}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label" htmlFor="zona">
                                Zona donde vives
                            </label>
                            <input
                                type="text"
                                id="zona"
                                name="zona"
                                value={formData.zona}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Ej: Col. Centro, Querétaro"
                            />
                        </div>

                        {/* Dynamic Questions Section */}
                        {questions.length > 0 && (
                            <div className="dynamic-questions-section">
                                <h3 className="questions-section-title">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg>
                                    Preguntas Adicionales
                                </h3>

                                {questions.map((question, index) => (
                                    <div key={question.id} className="form-group question-group">
                                        <label className="form-label">
                                            {index + 1}. {question.text}
                                            {question.required && <span className="required-mark"> *</span>}
                                        </label>
                                        {renderQuestionInput(question)}
                                        {errors[`question_${question.id}`] && (
                                            <span className="form-error">{errors[`question_${question.id}`]}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Motivation Question - After dynamic questions */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="message">
                                ¿Por qué te gustaría trabajar con nosotros?
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Cuéntanos tus motivaciones..."
                                rows="3"
                            ></textarea>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-accent btn-lg"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <div className="spinner" style={{ width: 20, height: 20 }}></div>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </svg>
                                        Enviar Postulación
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ApplicationForm
