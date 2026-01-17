import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    getInvitationByToken,
    updateInvitationStatus,
    saveTestResult,
    calculateScores
} from '../services/psychometricService'
import {
    testSections,
    likertScale,
    frequencyScale,
    getQuestionsBySection,
    getAllQuestions,
    scoreLabels
} from '../data/psychometricQuestions'
import './PsychometricTest.css'

function PsychometricTest() {
    const { token } = useParams()
    const navigate = useNavigate()

    // States
    const [invitation, setInvitation] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentSection, setCurrentSection] = useState(0)
    const [answers, setAnswers] = useState({})
    const [started, setStarted] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [startTime, setStartTime] = useState(null)
    const [results, setResults] = useState(null)

    // Load invitation data
    useEffect(() => {
        loadInvitation()
    }, [token])

    const loadInvitation = async () => {
        try {
            setLoading(true)
            const inv = await getInvitationByToken(token)

            if (!inv) {
                setError('invalid')
                return
            }

            // Check if expired
            const expiresAt = inv.expiresAt?.toDate ? inv.expiresAt.toDate() : new Date(inv.expiresAt)
            if (new Date() > expiresAt) {
                setError('expired')
                return
            }

            // Check if already completed
            if (inv.status === 'completed') {
                setError('completed')
                return
            }

            setInvitation(inv)

            // If already started, resume
            if (inv.status === 'started') {
                setStarted(true)
                setStartTime(new Date())
            }
        } catch (err) {
            console.error('Error loading invitation:', err)
            setError('error')
        } finally {
            setLoading(false)
        }
    }

    // Start test
    const handleStartTest = async () => {
        try {
            await updateInvitationStatus(invitation.id, 'started')
            setStarted(true)
            setStartTime(new Date())
        } catch (err) {
            console.error('Error starting test:', err)
        }
    }

    // Handle answer change
    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }))
    }

    // Get questions for current section
    const getCurrentQuestions = () => {
        const section = testSections[currentSection]
        return getQuestionsBySection(section.id)
    }

    // Check if current section is complete
    const isSectionComplete = () => {
        const questions = getCurrentQuestions()
        return questions.every(q => answers[q.id] !== undefined)
    }

    // Navigate sections
    const goToNextSection = () => {
        if (currentSection < testSections.length - 1) {
            setCurrentSection(prev => prev + 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const goToPrevSection = () => {
        if (currentSection > 0) {
            setCurrentSection(prev => prev - 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    // Submit test
    const handleSubmit = async () => {
        if (!isSectionComplete()) {
            alert('Por favor responde todas las preguntas antes de continuar.')
            return
        }

        try {
            setSubmitting(true)

            const allQuestions = getAllQuestions()
            const scores = calculateScores(answers, allQuestions)
            const timeSpent = Math.round((new Date() - startTime) / 1000)

            await saveTestResult(
                invitation.id,
                invitation.candidateId,
                answers,
                scores,
                timeSpent
            )

            setResults(scores)
            setCompleted(true)
        } catch (err) {
            console.error('Error submitting test:', err)
            alert('Hubo un error al enviar tus respuestas. Por favor intenta de nuevo.')
        } finally {
            setSubmitting(false)
        }
    }

    // Calculate progress
    const getProgress = () => {
        const allQuestions = getAllQuestions()
        const answered = Object.keys(answers).length
        return Math.round((answered / allQuestions.length) * 100)
    }

    // Render scale options
    const renderScaleOptions = (question, scale) => {
        return (
            <div className="scale-options">
                {scale.map(option => (
                    <label
                        key={option.value}
                        className={`scale-option ${answers[question.id] === option.value ? 'selected' : ''}`}
                    >
                        <input
                            type="radio"
                            name={question.id}
                            value={option.value}
                            checked={answers[question.id] === option.value}
                            onChange={() => handleAnswerChange(question.id, option.value)}
                        />
                        <span className="scale-value">{option.value}</span>
                        <span className="scale-label">{option.label}</span>
                    </label>
                ))}
            </div>
        )
    }

    // Render multiple choice options
    const renderMultipleChoice = (question) => {
        return (
            <div className="multiple-options">
                {question.options.map((option, idx) => (
                    <label
                        key={idx}
                        className={`multiple-option ${answers[question.id] === option ? 'selected' : ''}`}
                    >
                        <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={() => handleAnswerChange(question.id, option)}
                        />
                        <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                        <span className="option-text">{option}</span>
                    </label>
                ))}
            </div>
        )
    }

    // Render question based on type
    const renderQuestion = (question, index) => {
        return (
            <div key={question.id} className="question-card">
                <div className="question-number">{index + 1}</div>
                <div className="question-content">
                    <p className="question-text">{question.text}</p>
                    {question.type === 'likert' && renderScaleOptions(question, likertScale)}
                    {question.type === 'frequency' && renderScaleOptions(question, frequencyScale)}
                    {question.type === 'multiple' && renderMultipleChoice(question)}
                </div>
            </div>
        )
    }

    // Loading state
    if (loading) {
        return (
            <div className="test-page">
                <div className="test-loading">
                    <div className="spinner-large"></div>
                    <p>Cargando prueba...</p>
                </div>
            </div>
        )
    }

    // Error states
    if (error) {
        return (
            <div className="test-page">
                <div className="test-error">
                    <div className="error-icon">
                        {error === 'expired' ? '⏰' : error === 'completed' ? '✅' : '❌'}
                    </div>
                    <h2>
                        {error === 'invalid' && 'Enlace Inválido'}
                        {error === 'expired' && 'Enlace Expirado'}
                        {error === 'completed' && 'Prueba Completada'}
                        {error === 'error' && 'Error'}
                    </h2>
                    <p>
                        {error === 'invalid' && 'El enlace de la prueba no es válido. Por favor contacta al reclutador.'}
                        {error === 'expired' && 'El tiempo para completar esta prueba ha expirado. Por favor contacta al reclutador para obtener un nuevo enlace.'}
                        {error === 'completed' && 'Ya has completado esta prueba anteriormente. Gracias por participar.'}
                        {error === 'error' && 'Hubo un error al cargar la prueba. Por favor intenta más tarde.'}
                    </p>
                </div>
            </div>
        )
    }

    // Completed state
    if (completed) {
        return (
            <div className="test-page">
                <div className="test-completed">
                    <div className="completed-icon">🎉</div>
                    <h2>¡Prueba Completada!</h2>
                    <p>Gracias por completar la evaluación psicométrica, <strong>{invitation.candidateName}</strong>.</p>
                    <p className="completed-message">
                        Tu perfil ha sido registrado exitosamente. El equipo de reclutamiento
                        revisará tus resultados y se pondrá en contacto contigo pronto.
                    </p>

                    <div className="results-preview">
                        <h3>Resumen de tu perfil</h3>
                        <div className="results-grid">
                            <div className="result-category">
                                <h4>🎯 Perfil DISC</h4>
                                <div className="result-bars">
                                    {Object.entries(results.disc).map(([key, value]) => (
                                        <div key={key} className="result-bar-item">
                                            <span className="bar-label">{scoreLabels.disc[key]}</span>
                                            <div className="bar-container">
                                                <div className="bar-fill" style={{ width: `${value}%` }}></div>
                                            </div>
                                            <span className="bar-value">{value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="result-category">
                                <h4>🧠 Aptitudes</h4>
                                <div className="result-bars">
                                    {Object.entries(results.aptitudes).map(([key, value]) => (
                                        <div key={key} className="result-bar-item">
                                            <span className="bar-label">{scoreLabels.aptitudes[key]}</span>
                                            <div className="bar-container">
                                                <div className="bar-fill" style={{ width: `${value.percentage}%` }}></div>
                                            </div>
                                            <span className="bar-value">{value.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button onClick={() => navigate('/')} className="btn btn-primary btn-lg">
                        Volver al Inicio
                    </button>
                </div>
            </div>
        )
    }

    // Welcome screen
    if (!started) {
        return (
            <div className="test-page">
                <div className="test-welcome">
                    <div className="welcome-header">
                        <div className="company-logo">V</div>
                        <h1>Evaluación Psicométrica</h1>
                        <p className="welcome-subtitle">Viñoplastic Inyección</p>
                    </div>

                    <div className="welcome-card">
                        <h2>¡Hola, {invitation.candidateName}!</h2>
                        <p>
                            Has sido invitado/a a completar una evaluación psicométrica
                            como parte del proceso de selección para la vacante de
                            <strong> {invitation.vacancyTitle}</strong>.
                        </p>

                        <div className="test-info">
                            <div className="info-item">
                                <span className="info-icon">⏱️</span>
                                <div>
                                    <strong>Duración estimada</strong>
                                    <p>25-30 minutos</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="info-icon">📝</span>
                                <div>
                                    <strong>Secciones</strong>
                                    <p>{testSections.length} secciones, ~100 preguntas</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="info-icon">💡</span>
                                <div>
                                    <strong>Consejo</strong>
                                    <p>Responde honestamente, no hay respuestas correctas o incorrectas</p>
                                </div>
                            </div>
                        </div>

                        <div className="sections-preview">
                            <h3>Contenido de la Evaluación</h3>
                            <ul>
                                {testSections.map((section, idx) => (
                                    <li key={idx}>
                                        <span className="section-icon">{section.icon}</span>
                                        <div>
                                            <strong>{section.name}</strong>
                                            <p>{section.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="welcome-actions">
                            <button onClick={handleStartTest} className="btn btn-accent btn-lg start-btn">
                                <span>Comenzar Evaluación</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Test in progress
    const section = testSections[currentSection]
    const questions = getCurrentQuestions()
    const isLastSection = currentSection === testSections.length - 1

    return (
        <div className="test-page">
            {/* Progress Header */}
            <header className="test-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="company-logo-small">V</div>
                        <span className="header-title">Evaluación Psicométrica</span>
                    </div>
                    <div className="header-right">
                        <div className="progress-info">
                            <span className="progress-text">{getProgress()}% completado</span>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${getProgress()}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Section Navigation */}
            <nav className="section-nav">
                <div className="section-tabs">
                    {testSections.map((s, idx) => (
                        <button
                            key={idx}
                            className={`section-tab ${idx === currentSection ? 'active' : ''} ${idx < currentSection ? 'completed' : ''}`}
                            onClick={() => setCurrentSection(idx)}
                        >
                            <span className="tab-icon">{s.icon}</span>
                            <span className="tab-name">{s.name}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Section Content */}
            <main className="test-content">
                <div className="section-header">
                    <div className="section-icon-large">{section.icon}</div>
                    <div>
                        <h2 className="section-title">{section.name}</h2>
                        <p className="section-instructions">{section.instructions}</p>
                    </div>
                </div>

                <div className="questions-list">
                    {questions.map((q, idx) => renderQuestion(q, idx))}
                </div>

                <div className="section-actions">
                    {currentSection > 0 && (
                        <button onClick={goToPrevSection} className="btn btn-secondary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            Anterior
                        </button>
                    )}

                    {!isLastSection ? (
                        <button
                            onClick={goToNextSection}
                            className="btn btn-primary"
                            disabled={!isSectionComplete()}
                        >
                            Siguiente
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="btn btn-accent"
                            disabled={!isSectionComplete() || submitting}
                        >
                            {submitting ? (
                                <>
                                    <div className="spinner-small"></div>
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    Finalizar Evaluación
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </main>
        </div>
    )
}

export default PsychometricTest
