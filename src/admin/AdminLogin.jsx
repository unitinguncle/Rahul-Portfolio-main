import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, setToken } from './api';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            setToken(data.token);
            navigate('/admin/projects');
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 30% 30%, #0d1117, #000)',
        }}>
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(0,180,255,0.2)',
                    borderRadius: 20,
                    padding: '48px 40px',
                    width: '100%',
                    maxWidth: 420,
                    boxShadow: '0 0 60px rgba(0,180,255,0.08)',
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00b4ff, #0072ff)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 16, boxShadow: '0 0 30px rgba(0,180,255,0.4)',
                    }}>
                        <Lock size={28} color="#fff" />
                    </div>
                    <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>Admin Panel</h1>
                    <p style={{ color: '#888', fontSize: 14, marginTop: 6 }}>Rahul's Portfolio CMS</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Username */}
                    <div style={{ position: 'relative' }}>
                        <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '12px 12px 12px 42px',
                                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 10, color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ position: 'relative' }}>
                        <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                        <input
                            type={showPass ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '12px 42px 12px 42px',
                                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 10, color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box',
                            }}
                        />
                        <button type="button" onClick={() => setShowPass(v => !v)}
                            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {error && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{ color: '#ff6b6b', fontSize: 13, textAlign: 'center', margin: 0 }}>
                            ⚠️ {error}
                        </motion.p>
                    )}

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            padding: '13px', borderRadius: 10, border: 'none', cursor: 'pointer',
                            background: 'linear-gradient(90deg, #00b4ff, #0072ff)',
                            color: '#fff', fontWeight: 700, fontSize: 15, marginTop: 4,
                        }}
                    >
                        {loading ? 'Logging in...' : '🔐 Login'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
