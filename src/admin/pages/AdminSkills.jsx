import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { Trash2, Pencil, Plus, X } from 'lucide-react';
import {
    adminCard, primaryBtn, dangerBtn, secondaryBtn, inputStyle, labelStyle,
    AdminPageHeader, StatusMsg,
} from '../AdminComponents';

const API_BASE = '';

function SkillModal({ skill, onClose, onSaved }) {
    const isEdit = !!skill?._id;
    const [name, setName] = useState(skill?.name || '');
    const [logoUrl, setLogoUrl] = useState(skill?.logoUrl || '');
    const [logoFile, setLogoFile] = useState(null);
    const [preview, setPreview] = useState(skill?.logoUrl || '');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const f = e.target.files[0];
        if (f) { setLogoFile(f); setPreview(URL.createObjectURL(f)); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            if (logoFile) formData.append('logo', logoFile);
            else formData.append('logoUrl', logoUrl);

            if (isEdit) await apiFetch(`/api/skills/${skill._id}`, { method: 'PUT', body: formData });
            else await apiFetch('/api/skills', { method: 'POST', body: formData });

            setStatus('✅ Saved!');
            setTimeout(() => { onSaved(); onClose(); }, 700);
        } catch (err) {
            setStatus('❌ ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            <div style={{ ...adminCard, width: '100%', maxWidth: 460 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <h2 style={{ color: '#00b4ff', margin: 0 }}>{isEdit ? 'Edit Skill' : 'Add Skill Bubble'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <label style={labelStyle}>Skill Name *</label>
                        <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Python" />
                    </div>
                    {preview && <img src={preview.startsWith('blob') ? preview : (preview.startsWith('http') ? preview : `${API_BASE}${preview}`)}
                        alt="logo" style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 8 }} />}
                    <div>
                        <label style={labelStyle}>Logo URL (e.g. devicons CDN)</label>
                        <input style={inputStyle} value={logoUrl}
                            onChange={e => { setLogoUrl(e.target.value); setPreview(e.target.value); }}
                            placeholder="https://cdn.jsdelivr.net/gh/devicons/..." />
                    </div>
                    <div>
                        <label style={labelStyle}>Or Upload Logo Image</label>
                        <input type="file" accept="image/*,.svg" onChange={handleFileChange} style={{ ...inputStyle, padding: 8 }} />
                    </div>
                    <StatusMsg msg={status} isError={status.startsWith('❌')} />
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={secondaryBtn}>Cancel</button>
                        <button type="submit" disabled={loading} style={primaryBtn}>{loading ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function CategoryModal({ cat, onClose, onSaved }) {
    const isEdit = !!cat?._id;
    const [title, setTitle] = useState(cat?.title || '');
    const [itemsText, setItemsText] = useState(cat?.items?.join('\n') || '');
    const [rowIndex, setRowIndex] = useState(cat?.rowIndex ?? 0);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                title,
                items: itemsText.split('\n').map(i => i.trim()).filter(Boolean),
                rowIndex: Number(rowIndex),
                order: cat?.order || 0,
            };
            if (isEdit) await apiFetch(`/api/skills/categories/${cat._id}`, { method: 'PUT', body: JSON.stringify(payload) });
            else await apiFetch('/api/skills/categories', { method: 'POST', body: JSON.stringify(payload) });
            setStatus('✅ Saved!');
            setTimeout(() => { onSaved(); onClose(); }, 700);
        } catch (err) {
            setStatus('❌ ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            <div style={{ ...adminCard, width: '100%', maxWidth: 460 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <h2 style={{ color: '#00b4ff', margin: 0 }}>{isEdit ? 'Edit Category' : 'Add Skill Category'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <label style={labelStyle}>Category Title *</label>
                        <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Programming Languages" />
                    </div>
                    <div>
                        <label style={labelStyle}>Items (one per line) *</label>
                        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }} value={itemsText}
                            onChange={e => setItemsText(e.target.value)} placeholder="Python&#10;Java&#10;C++" required />
                    </div>
                    <div>
                        <label style={labelStyle}>Row Group (0 = first row, 1 = second row)</label>
                        <input type="number" style={inputStyle} value={rowIndex} min={0} max={5} onChange={e => setRowIndex(e.target.value)} />
                    </div>
                    <StatusMsg msg={status} isError={status.startsWith('❌')} />
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={secondaryBtn}>Cancel</button>
                        <button type="submit" disabled={loading} style={primaryBtn}>{loading ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminSkills() {
    const [skills, setSkills] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [skillModal, setSkillModal] = useState(null);
    const [catModal, setCatModal] = useState(null);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [s, c] = await Promise.all([apiFetch('/api/skills'), apiFetch('/api/skills/categories')]);
            setSkills(s);
            setCategories(c);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const deleteSkill = async (id) => {
        if (!window.confirm('Delete this skill?')) return;
        await apiFetch(`/api/skills/${id}`, { method: 'DELETE' });
        setSkills(prev => prev.filter(s => s._id !== id));
    };

    const deleteCat = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        await apiFetch(`/api/skills/categories/${id}`, { method: 'DELETE' });
        setCategories(prev => prev.filter(c => c._id !== id));
    };

    return (
        <div>
            <AdminPageHeader title="⚙️ Skills" subtitle="Manage floating skill bubbles and skill category text cards." />

            {/* Skill Bubbles */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ color: '#ccc', margin: 0, fontSize: 16 }}>Floating Skill Bubbles</h3>
                <button style={primaryBtn} onClick={() => setSkillModal({})}><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={14} /> Add Skill</span></button>
            </div>

            {loading ? <p style={{ color: '#888' }}>Loading...</p> : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 36 }}>
                    {skills.map(s => (
                        <div key={s._id} style={{ ...adminCard, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, minWidth: 140 }}>
                            <img src={s.logoUrl.startsWith('http') ? s.logoUrl : `${API_BASE}${s.logoUrl}`} alt={s.name} style={{ width: 30, height: 30, objectFit: 'contain' }} />
                            <span style={{ color: '#ccc', fontSize: 14, flex: 1 }}>{s.name}</span>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }} onClick={() => setSkillModal(s)}><Pencil size={13} /></button>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff6b6b' }} onClick={() => deleteSkill(s._id)}><Trash2 size={13} /></button>
                        </div>
                    ))}
                </div>
            )}

            {/* Skill Categories */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ color: '#ccc', margin: 0, fontSize: 16 }}>Skill Categories (Text Cards)</h3>
                <button style={primaryBtn} onClick={() => setCatModal({})}><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={14} /> Add Category</span></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                {categories.map(c => (
                    <div key={c._id} style={{ ...adminCard, padding: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ color: '#00b4ff', fontWeight: 600, fontSize: 14 }}>{c.title}</span>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }} onClick={() => setCatModal(c)}><Pencil size={13} /></button>
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff6b6b' }} onClick={() => deleteCat(c._id)}><Trash2 size={13} /></button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {c.items?.map(item => (
                                <span key={item} style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 5, fontSize: 12, color: '#aaa' }}>{item}</span>
                            ))}
                        </div>
                        <span style={{ color: '#555', fontSize: 11, marginTop: 6, display: 'block' }}>Row {c.rowIndex}</span>
                    </div>
                ))}
            </div>

            {skillModal !== null && <SkillModal skill={skillModal._id ? skillModal : null} onClose={() => setSkillModal(null)} onSaved={fetchAll} />}
            {catModal !== null && <CategoryModal cat={catModal._id ? catModal : null} onClose={() => setCatModal(null)} onSaved={fetchAll} />}
        </div>
    );
}
