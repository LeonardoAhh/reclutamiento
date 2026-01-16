import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import ApplicationForm from './pages/ApplicationForm'
import Admin from './pages/Admin'
import Login from './pages/Login'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/inicio" element={<Home />} />
            <Route path="/postular/:vacancyId?" element={<ApplicationForm />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    )
}

export default App
