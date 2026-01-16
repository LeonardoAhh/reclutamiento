import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRecruiters } from '../services/firebaseService'
import './Landing.css'

function Landing() {
    const navigate = useNavigate()
    const [recruiters, setRecruiters] = useState([])
    const [expandedCard, setExpandedCard] = useState(null)

    useEffect(() => {
        const loadRecruiters = async () => {
            const data = await getRecruiters()
            setRecruiters(data)
        }
        loadRecruiters()
    }, [])

    return (
        <div className="landing">
            {/* Animated Background */}
            <div className="landing-bg">
                <div className="landing-bg-gradient"></div>
                <div className="landing-bg-pattern"></div>
                <div className="landing-bg-orbs">
                    <div className="orb orb-1"></div>
                    <div className="orb orb-2"></div>
                    <div className="orb orb-3"></div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="landing-nav">
                <div className="container">
                    <div className="landing-nav-content">
                        <div className="landing-brand">
                            <div className="landing-logo">V</div>
                            <span className="landing-logo-text">Viñoplastic</span>
                        </div>
                        <div className="landing-nav-links">
                            <button
                                onClick={() => navigate('/login')}
                                className="btn btn-secondary btn-sm"
                            >
                                🚫
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge animate-fade-in-down">
                            <span className="hero-badge-icon">🏭</span>
                            <span>Industria de Inyección de Plástico</span>
                        </div>

                        <h1 className="hero-title animate-fade-in-up stagger-1">
                            <span className="hero-title-line">Únete a</span>
                            <span className="hero-title-accent">Viñoplastic</span>
                            <span className="hero-title-line">Inyección</span>
                        </h1>

                        <p className="hero-description animate-fade-in-up stagger-2">
                            Somos líderes en manufactura de productos plásticos de alta calidad.
                            Descubre las oportunidades de carrera que tenemos para ti y forma parte
                            de un equipo comprometido con la excelencia.
                        </p>

                        <div className="hero-cta animate-fade-in-up stagger-3">
                            <button
                                onClick={() => navigate('/inicio')}
                                className="btn btn-accent btn-lg"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                </svg>
                                Ver Vacantes Disponibles
                            </button>
                        </div>

                        <div className="hero-stats animate-fade-in-up stagger-4">
                            <div className="hero-stat">
                                <span className="hero-stat-number">50+</span>
                                <span className="hero-stat-label">Años de experiencia</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <span className="hero-stat-number">500+</span>
                                <span className="hero-stat-label">Colaboradores</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <span className="hero-stat-number">100+</span>
                                <span className="hero-stat-label">Clientes satisfechos</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual animate-fade-in stagger-2">
                        <div className="hero-card-stack">
                            <div className="hero-floating-card card-1">
                                <div className="floating-card-icon">👷</div>
                                <span>Operadores</span>
                            </div>
                            <div className="hero-floating-card card-2">
                                <div className="floating-card-icon">🔧</div>
                                <span>Técnicos</span>
                            </div>
                            <div className="hero-floating-card card-3">
                                <div className="floating-card-icon">📊</div>
                                <span>Supervisores</span>
                                <div>
                                    <div className="hero-floating-card card-4">
                                        <div className="floating-card-icon">🎓</div>
                                        <span>Administrativos</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card animate-fade-in-up stagger-1">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                            </div>
                            <h3 className="feature-title">Estabilidad Laboral</h3>
                            <p className="feature-description">Empresa consolidada con más de 50 años en el mercado ofreciendo seguridad a tu carrera.</p>
                        </div>
                        <div className="feature-card animate-fade-in-up stagger-2">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <h3 className="feature-title">Prestaciones de ley</h3>
                            <p className="feature-description">Beneficios establecidos la ley para tu bienestar y el de tu familia.</p>
                        </div>
                        <div className="feature-card animate-fade-in-up stagger-3">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                    <polyline points="17 6 23 6 23 12"></polyline>
                                </svg>
                            </div>
                            <h3 className="feature-title">Crecimiento Profesional</h3>
                            <p className="feature-description">Oportunidades de desarrollo y capacitación continua para impulsar tu carrera.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section - Recruiters */}
            {recruiters.length > 0 && (
                <section className="recruiters-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">¿Tienes dudas? Contáctanos</h2>
                            <p className="section-subtitle">
                                Haz clic en un contacto para ver su información
                            </p>
                        </div>
                        <div className="recruiters-accordion">
                            {recruiters.map(recruiter => (
                                <div
                                    key={recruiter.id}
                                    className={`recruiter-accordion-card ${expandedCard === recruiter.id ? 'expanded' : ''}`}
                                    onClick={() => setExpandedCard(expandedCard === recruiter.id ? null : recruiter.id)}
                                >
                                    {/* Header - Siempre visible */}
                                    <div className="accordion-header">
                                        <div className="accordion-avatar">
                                            {recruiter.name?.charAt(0).toUpperCase() || 'R'}
                                        </div>
                                        <span className="accordion-name">{recruiter.name}</span>
                                        <svg
                                            className="accordion-arrow"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </div>

                                    {/* Content - Solo visible cuando está expandido */}
                                    <div className="accordion-content" onClick={e => e.stopPropagation()}>
                                        {recruiter.position && (
                                            <p className="accordion-position">{recruiter.position}</p>
                                        )}
                                        {recruiter.whatsapp && (
                                            <a
                                                href={`https://wa.me/${recruiter.whatsapp.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="accordion-whatsapp-btn"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                </svg>
                                                <span>Enviar WhatsApp</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <p>© 2026 Viñoplastic Inyección. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    )
}

export default Landing

