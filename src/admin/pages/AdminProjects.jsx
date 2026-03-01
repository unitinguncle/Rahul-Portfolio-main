import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { Trash2, Pencil, Plus, X, Check } from 'lucide-react';
import {
    adminCard, primaryBtn, dangerBtn, secondaryBtn, inputStyle, labelStyle,
    AdminPageHeader, StatusMsg,
} from '../AdminComponents';

const API_BASE = '';

function ProjectModal({ project, onClose, onSaved }) {
    const isEdit = !!project?._id;
    const [form, setForm] = useState({
        title: project?.title || '',
        desc: project?.desc || '',
        imageUrl: project?.imageUrl || '',
        tech: project?.tech?.join(', ') || '',
        liveUrl: project?.liveUrl || '',
        codeUrl: project?.codeUrl || '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(project?.imageUrl || '');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const f = e.target.files[0];
        if (f) {
            setImageFile(f);
            setImagePreview(URL.createObjectURL(f));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('desc', form.desc);
            formData.append('tech', JSON.stringify(form.tech.split(',').map(t => t.trim()).filter(Boolean)));
            formData.append('liveUrl', form.liveUrl);
            formData.append('codeUrl', form.codeUrl);
            if (imageFile) formData.append('image', imageFile);
            else if (form.imageUrl) formData.append('imageUrl', form.imageUrl);

            if (isEdit) {
                await apiFetch(`/api/projects/${project._id}`, { method: 'PUT', body: formData });
            } else {
                await apiFetch('/api/projects', { method: 'POST', body: formData });
            }
            setStatus('✅ Saved!');
            setTimeout(() => { onSaved(); onClose(); }, 800);
        } catch (err) {
            setStatus('❌ ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            <div style={{ ...adminCard, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ color: '#00b4ff', margin: 0 }}>{isEdit ? 'Edit Project' : 'Add New Project'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <label style={labelStyle}>Title *</label>
                        <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                    </div>
                    <div>
                        <label style={labelStyle}>Description *</label>
                        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }} value={form.desc}
                            onChange={e => setForm({ ...form, desc: e.target.value })} required />
                    </div>
                    <div>
                        <label style={labelStyle}>Tech Stack (comma separated)</label>
                        <input style={inputStyle} value={form.tech} placeholder="Python, Docker, React"
                            onChange={e => setForm({ ...form, tech: e.target.value })} />
                    </div>
                    <div>
                        <label style={labelStyle}>Live URL</label>
                        <input style={inputStyle} value={form.liveUrl} placeholder="https://github.com/..."
                            onChange={e => setForm({ ...form, liveUrl: e.target.value })} />
                    </div>
                    <div>
                        <label style={labelStyle}>Code URL</label>
                        <input style={inputStyle} value={form.codeUrl} placeholder="https://github.com/..."
                            onChange={e => setForm({ ...form, codeUrl: e.target.value })} />
                    </div>
                    <div>
                        <label style={labelStyle}>Project Image</label>
                        {imagePreview && <img src={imagePreview.startsWith('blob') ? imagePreview : `${API_BASE}${imagePreview}`}
                            alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />}
                        <input type="file" accept="image/*" onChange={handleFileChange}
                            style={{ ...inputStyle, padding: 8 }} />
                        <p style={{ color: '#666', fontSize: 12, marginTop: 4 }}>Or paste a URL below:</p>
                        <input style={inputStyle} value={form.imageUrl} placeholder="https://..."
                            onChange={e => { setForm({ ...form, imageUrl: e.target.value }); setImagePreview(e.target.value); }} />
                    </div>

                    <StatusMsg msg={status} isError={status.startsWith('❌')} />
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" onClick={onClose} style={secondaryBtn}>Cancel</button>
                        <button type="submit" disabled={loading} style={primaryBtn}>
                            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // null | { project | {} }
    const [deleteId, setDeleteId] = useState(null);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const data = await apiFetch('/api/projects');
            setProjects(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            await apiFetch(`/api/projects/${id}`, { method: 'DELETE' });
            setProjects(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            alert('Delete failed: ' + err.message);
        }
    };

    return (
        <div>
            <AdminPageHeader
                title="🚀 Projects"
                subtitle="Manage your portfolio projects. Cards appear newest first."
                action={
                    <button style={primaryBtn} onClick={() => setModal({})}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> Add Project</span>
                    </button>
                }
            />

            {loading ? (
                <p style={{ color: '#888' }}>Loading...</p>
            ) : projects.length === 0 ? (
                <div style={adminCard}><p style={{ color: '#888', textAlign: 'center', margin: 0 }}>No projects yet. Click "Add Project" to get started.</p></div>
            ) : (
                <div style={{ display: 'grid', gap: 14 }}>
                    {projects.map(p => (
                        <div key={p._id} style={{ ...adminCard, display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
                            {p.imageUrl && (
                                <img src={p.imageUrl.startsWith('http') ? p.imageUrl : `${API_BASE}${p.imageUrl}`}
                                    alt={p.title} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                            )}
                            <div style={{ flex: 1 }}>
                                <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{p.title}</div>
                                <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>{p.desc.slice(0, 100)}...</div>
                                <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                                    {p.tech?.map(t => (
                                        <span key={t} style={{ background: 'rgba(0,180,255,0.1)', border: '1px solid rgba(0,180,255,0.2)', padding: '2px 8px', borderRadius: 5, fontSize: 11, color: '#80cfff' }}>{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                <button style={secondaryBtn} onClick={() => setModal(p)} title="Edit">
                                    <Pencil size={14} />
                                </button>
                                <button style={dangerBtn} onClick={() => handleDelete(p._id)} title="Delete">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modal !== null && (
                <ProjectModal project={modal._id ? modal : null} onClose={() => setModal(null)} onSaved={fetchProjects} />
            )}
        </div>
    );
}
