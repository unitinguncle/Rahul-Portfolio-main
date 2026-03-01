import React from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { removeToken, isLoggedIn } from './api';
import {
    FolderKanban, Image, Cpu, Award, BookOpen,
    FileText, User, LogOut, LayoutDashboard,
} from 'lucide-react';

const navItems = [
    { to: '/admin/projects', icon: <FolderKanban size={18} />, label: 'Projects' },
    { to: '/admin/gallery', icon: <Image size={18} />, label: 'Gallery' },
    { to: '/admin/skills', icon: <Cpu size={18} />, label: 'Skills' },
    { to: '/admin/certificates', icon: <Award size={18} />, label: 'Certificates' },
    { to: '/admin/blog', icon: <BookOpen size={18} />, label: 'Blog' },
    { to: '/admin/resume', icon: <FileText size={18} />, label: 'Resume' },
    { to: '/admin/about', icon: <User size={18} />, label: 'About Me' },
];

const linkStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 16px', borderRadius: 10, marginBottom: 4,
    textDecoration: 'none', fontSize: 14, fontWeight: 500,
    color: isActive ? '#fff' : '#888',
    background: isActive ? 'linear-gradient(90deg, rgba(0,180,255,0.2), rgba(0,114,255,0.1))' : 'transparent',
    borderLeft: isActive ? '3px solid #00b4ff' : '3px solid transparent',
    transition: 'all 0.2s',
});

export default function AdminLayout({ children }) {
    const navigate = useNavigate();

    if (!isLoggedIn()) {
        navigate('/admin/login');
        return null;
    }

    const handleLogout = () => {
        removeToken();
        navigate('/admin/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f', color: '#fff' }}>
            {/* ── Sidebar ── */}
            <aside style={{
                width: 220, flexShrink: 0, background: 'rgba(255,255,255,0.03)',
                borderRight: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', flexDirection: 'column', padding: '24px 12px',
                position: 'fixed', height: '100vh', overflowY: 'auto',
            }}>
                {/* Logo */}
                <div style={{ paddingLeft: 8, marginBottom: 28 }}>
                    <div style={{ color: '#00b4ff', fontSize: 18, fontWeight: 700 }}>⚙️ Admin Panel</div>
                    <div style={{ color: '#555', fontSize: 12, marginTop: 2 }}>Portfolio CMS</div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1 }}>
                    {navItems.map(item => (
                        <NavLink key={item.to} to={item.to} style={({ isActive }) => linkStyle(isActive)}>
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}

                    {/* View site link */}
                    <a href="/" target="_blank" rel="noreferrer"
                        style={{ ...linkStyle(false), marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 16 }}>
                        <LayoutDashboard size={18} />
                        View Portfolio
                    </a>
                </nav>

                {/* Logout */}
                <button onClick={handleLogout} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 16px', borderRadius: 10, border: 'none',
                    background: 'rgba(255,60,60,0.1)', color: '#ff6b6b', cursor: 'pointer',
                    fontSize: 14, fontWeight: 500, width: '100%', marginTop: 16,
                }}>
                    <LogOut size={18} /> Logout
                </button>
            </aside>

            {/* ── Main Content ── */}
            <main style={{ flex: 1, marginLeft: 220, padding: '32px 36px', overflowY: 'auto' }}>
                <Outlet />
                {children}
            </main>
        </div>
    );
}
