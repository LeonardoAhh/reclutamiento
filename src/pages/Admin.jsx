import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { getUserByEmail, updateUserAvatar } from '../services/firebaseService'
import { MOTIVATIONAL_MESSAGES } from '../data/motivationalMessages'
import AvatarSelector, { generateAvatarSvg } from '../components/AvatarSelector'
import VacancyManager from './admin/VacancyManager'
import Candidates from './admin/Candidates'
import Recruiters from './admin/Recruiters'
import Positions from './admin/Positions'
import ImprovementRequests from './admin/ImprovementRequests'
import RequestsManager from './admin/RequestsManager'
import './Admin.css'

// Email del admin/desarrollador principal
const ADMIN_EMAIL = 'capacitacionqro@vinoplastic.com'

function Admin() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [currentMessage, setCurrentMessage] = useState('')
    const [messageIndex, setMessageIndex] = useState(0)
    const [showAvatarSelector, setShowAvatarSelector] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser)
            if (currentUser?.email) {
                const userInfo = await getUserByEmail(currentUser.email)
                setUserData(userInfo)
                // Generar avatar si el usuario tiene configuración guardada
                if (userInfo?.avatarStyle) {
                    const url = generateAvatarSvg(userInfo.avatarStyle, userInfo.avatarSeed || userInfo.name)
                    setAvatarUrl(url)
                }
            }
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    // Cambiar mensaje cada 20 segundos
    useEffect(() => {
        // Establecer mensaje inicial aleatorio
        const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)
        setMessageIndex(randomIndex)
        setCurrentMessage(MOTIVATIONAL_MESSAGES[randomIndex])

        const interval = setInterval(() => {
            setMessageIndex(prev => {
                const newIndex = (prev + 1) % MOTIVATIONAL_MESSAGES.length
                setCurrentMessage(MOTIVATIONAL_MESSAGES[newIndex])
                return newIndex
            })
        }, 20000) // 20 segundos

        return () => clearInterval(interval)
    }, [])

    const handleLogout = async () => {
        try {
            await signOut(auth)
            navigate('/login')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const handleAvatarSelect = async (style, seed) => {
        try {
            if (userData?.id) {
                await updateUserAvatar(userData.id, style, seed)
                const url = generateAvatarSvg(style, seed)
                setAvatarUrl(url)
                setUserData(prev => ({ ...prev, avatarStyle: style, avatarSeed: seed }))
            }
        } catch (error) {
            console.error('Error saving avatar:', error)
            alert('Error al guardar el avatar')
        }
    }

    // Obtener nombre para mostrar
    const displayName = userData?.name || user?.email?.split('@')[0] || 'Usuario'

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Cargando...</p>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        <div className="sidebar-brand-logo">V</div>
                        <div className="sidebar-brand-text">
                            <span className="brand-name">Reclutamiento</span>
                            <span className="brand-subtitle">Panel de Admin</span>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/admin/vacantes"
                        className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <svg className="sidebar-nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                        Vacantes
                    </NavLink>

                    <NavLink
                        to="/admin/candidatos"
                        className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <svg className="sidebar-nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        Candidatos
                    </NavLink>

                    <NavLink
                        to="/admin/reclutadoras"
                        className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <svg className="sidebar-nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        Contactos
                    </NavLink>

                    <NavLink
                        to="/admin/puestos"
                        className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <svg className="sidebar-nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        Puestos
                    </NavLink>

                    {/* Link de Solicitudes - diferente según el usuario */}
                    <NavLink
                        to="/admin/solicitudes"
                        className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <svg className="sidebar-nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        {user?.email === ADMIN_EMAIL ? 'Solicitudes' : 'Sugerencias'}
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <NavLink to="/inicio" className="sidebar-nav-item sidebar-link-external">
                        <svg className="sidebar-nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        Ver Portal Público
                    </NavLink>
                    <button onClick={handleLogout} className="sidebar-nav-item sidebar-logout">
                        <svg className="sidebar-nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>

                    {/* Mensaje Motivacional */}
                    <div className="motivational-section">
                        <p className="motivational-message">{currentMessage}</p>
                    </div>

                    <div className="admin-header-user">
                        <div className="user-info">
                            <span className="user-greeting">¡Hola, {displayName}!</span>
                            <span className="user-role">{userData?.rol || 'Administrador'}</span>
                        </div>
                        <button
                            className="admin-user-avatar-btn"
                            onClick={() => setShowAvatarSelector(true)}
                            title="Cambiar avatar"
                        >
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="avatar-image" />
                            ) : (
                                <div className="avatar-initial">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="avatar-edit-icon">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </span>
                        </button>
                    </div>
                </header>

                <div className="admin-content">
                    <Routes>
                        <Route index element={<Navigate to="vacantes" replace />} />
                        <Route path="vacantes" element={<VacancyManager />} />
                        <Route path="candidatos" element={<Candidates />} />
                        <Route path="reclutadoras" element={<Recruiters />} />
                        <Route path="puestos" element={<Positions />} />
                        <Route path="solicitudes" element={
                            user?.email === ADMIN_EMAIL
                                ? <RequestsManager />
                                : <ImprovementRequests userEmail={user?.email} userName={displayName} />
                        } />
                    </Routes>
                </div>
            </main>

            {/* Avatar Selector Modal */}
            {showAvatarSelector && (
                <AvatarSelector
                    currentStyle={userData?.avatarStyle}
                    currentSeed={userData?.avatarSeed}
                    userName={displayName}
                    onSelect={handleAvatarSelect}
                    onClose={() => setShowAvatarSelector(false)}
                />
            )}
        </div>
    )
}

export default Admin
