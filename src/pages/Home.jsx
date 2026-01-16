import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getVacancies } from '../services/firebaseService'
import './Home.css'

function Home() {
    const navigate = useNavigate()
    const [vacancies, setVacancies] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        loadVacancies()
    }, [])

    const loadVacancies = async () => {
        setLoading(true)
        const data = await getVacancies(true) // Only active
        setVacancies(data)
        setLoading(false)
    }

    const departments = ['all', ...new Set(vacancies.map(v => v.department).filter(Boolean))]

    const filteredVacancies = filter === 'all'
        ? vacancies
        : vacancies.filter(v => v.department === filter)

    return (
        <div className="home-page">
            {/* Header */}
            <header className="home-header">
                <div className="container">
                    <nav className="home-nav">
                        <Link to="/" className="home-brand">
                            <div className="home-logo">I</div>
                            <span className="home-logo-text">Viñoplastic Querétaro</span>
                        </Link>
                        <div className="home-nav-links">
                            <Link to="/login" className="btn btn-outline btn-sm">
                                Acceso Admin
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Page Title */}
            <section className="home-hero">
                <div className="container">
                    <div className="home-hero-content">
                        <h1 className="home-title animate-fade-in-up">
                            Vacantes <span className="text-accent">Disponibles</span>
                        </h1>
                        <p className="home-subtitle animate-fade-in-up stagger-1">
                            Encuentra la oportunidad perfecta para desarrollar tu carrera profesional
                        </p>
                    </div>
                </div>
            </section>

            {/* Filters */}
            {departments.length > 1 && (
                <section className="home-filters">
                    <div className="container">
                        <div className="filter-tabs">
                            {departments.map(dept => (
                                <button
                                    key={dept}
                                    className={`filter-tab ${filter === dept ? 'active' : ''}`}
                                    onClick={() => setFilter(dept)}
                                >
                                    {dept === 'all' ? 'Todas' : dept}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Vacancies Grid */}
            <section className="home-content">
                <div className="container">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Cargando vacantes...</p>
                        </div>
                    ) : filteredVacancies.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                </svg>
                            </div>
                            <h3 className="empty-state-title">No hay vacantes disponibles</h3>
                            <p className="empty-state-text">Por el momento no tenemos puestos abiertos, pero te invitamos a regresar pronto.</p>
                        </div>
                    ) : (
                        <div className="vacancies-grid">
                            {filteredVacancies.map((vacancy, index) => (
                                <div
                                    key={vacancy.id}
                                    className={`vacancy-card animate-fade-in-up`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="vacancy-card-header">
                                        <span className="vacancy-badge">
                                            {vacancy.department || 'General'}
                                        </span>
                                        <div className="vacancy-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                            </svg>
                                        </div>
                                    </div>

                                    <h3 className="vacancy-title">{vacancy.title}</h3>
                                    <p className="vacancy-description">
                                        {vacancy.description?.substring(0, 150)}
                                        {vacancy.description?.length > 150 ? '...' : ''}
                                    </p>

                                    {vacancy.requirements && (
                                        <div className="vacancy-requirements">
                                            <h4>Requisitos:</h4>
                                            <p>{vacancy.requirements.substring(0, 100)}
                                                {vacancy.requirements.length > 100 ? '...' : ''}
                                            </p>
                                        </div>
                                    )}

                                    <div className="vacancy-footer">
                                        <div className="vacancy-meta">
                                            {vacancy.location && (
                                                <span className="vacancy-location">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                        <circle cx="12" cy="10" r="3"></circle>
                                                    </svg>
                                                    {vacancy.location}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => navigate(`/postular/${vacancy.id}`)}
                                            className="btn btn-primary"
                                        >
                                            Postularme
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                <polyline points="12 5 19 12 12 19"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <div className="container">
                    <div className="home-footer-content">
                        <div className="footer-brand">
                            <div className="home-logo small">V</div>
                            <span>Viñoplastic Inyección</span>
                        </div>
                        <p>© 2026 Todos los derechos reservados</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Home
