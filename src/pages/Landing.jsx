import { useNavigate } from 'react-router-dom'
import './Landing.css'

function Landing() {
    const navigate = useNavigate()

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
                                Acceso Admin
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
