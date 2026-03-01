import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Gallery from './pages/Gallery'
import Certificates from './pages/Certificates'
import Blog from './pages/Blog'
import Resume from './pages/Resume'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import SkillNetwork from './pages/Skills'

// Admin
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import AdminProjects from './admin/pages/AdminProjects'
import AdminGallery from './admin/pages/AdminGallery'
import AdminSkills from './admin/pages/AdminSkills'
import AdminCertificates from './admin/pages/AdminCertificates'
import AdminBlog from './admin/pages/AdminBlog'
import AdminResume from './admin/pages/AdminResume'
import AdminAbout from './admin/pages/AdminAbout'

// Public portfolio wrapper with Navbar + footer
function PublicLayout({ children }) {
  return (
    <div className="app">
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <footer className="footer">
        © {new Date().getFullYear()} Rahul Kumar — Built with React
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* ── Public Portfolio Routes ── */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
      <Route path="/skills" element={<PublicLayout><SkillNetwork /></PublicLayout>} />
      <Route path="/certificates" element={<PublicLayout><Certificates /></PublicLayout>} />
      <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
      <Route path="/resume" element={<PublicLayout><Resume /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

      {/* ── Admin Routes (no Navbar/footer) ── */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/projects" replace />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="certificates" element={<AdminCertificates />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="resume" element={<AdminResume />} />
        <Route path="about" element={<AdminAbout />} />
      </Route>

      {/* ── 404 ── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
