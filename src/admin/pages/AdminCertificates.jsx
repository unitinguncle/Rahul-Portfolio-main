import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { Trash2, Pencil, Plus, X } from 'lucide-react';
import {
    adminCard, primaryBtn, dangerBtn, secondaryBtn, inputStyle, labelStyle,
    AdminPageHeader, StatusMsg,
} from '../AdminComponents';

const API_BASE = '';

function CertModal({ cert, onClose, onSaved }) {
    const isEdit = !!cert?._id;
    const [form, setForm] = useState({
        title: cert?.title || '',
        org: cert?.org || '',
        date: cert?.date || '',
        category: cert?.category || 'other',
        imageUrl: cert?.imageUrl || '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(cert?.imageUrl || '');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('org', form.org);
            formData.append('date', form.date);
            formData.append('category', form.category);
            if (imageFile) formData.append('image', imageFile);
            else if (form.imageUrl) formData.append('imageUrl', form.imageUrl);

            if (isEdit) await apiFetch(`/api/certificates/${cert._id}`, { method: 'PUT', body: formData });
            else await apiFetch('/api/certificates', { method: 'POST', body: formData });
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
            <div style={{ ...adminCard, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <h2 style={{ color: '#00b4ff', margin: 0 }}>{isEdit ? 'Edit Certificate' : 'Add Certificate'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <label style={labelStyle}>Certificate Title *</label>
                        <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <label style={labelStyle}>Organization *</label>
                            <input style={inputStyle} value={form.org} onChange={e => setForm({ ...form, org: e.target.value })} required placeholder="e.g. Coursera" />
                        </div>
                        <div>
                            <label style={labelStyle}>Year *</label>
                            <input style={inputStyle} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required placeholder="2025" />
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Category *</label>
                        <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                            <option value="tech">Tech</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Certificate Image</label>
                        {imagePreview && (
                            <img src={imagePreview.startsWith('blob') ? imagePreview : (imagePreview.startsWith('http') ? imagePreview : `${API_BASE}${imagePreview}`)}
                                alt="preview" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
                        )}
                        <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }}
                            style={{ ...inputStyle, padding: 8 }} />
                        <p style={{ color: '#666', fontSize: 12, marginTop: 4 }}>Or paste a URL:</p>
                        <input style={inputStyle} value={form.imageUrl} placeholder="https://..."
                            onChange={e => { setForm({ ...form, imageUrl: e.target.value }); setImagePreview(e.target.value); }} />
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

export default function AdminCertificates() {
    const [grouped, setGrouped] = useState({ tech: [], other: [] });
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [activeTab, setActiveTab] = useState('tech');

    const fetchCerts = async () => {
        setLoading(true);
        try {
            const data = await apiFetch('/api/certificates');
            setGrouped(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchCerts(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this certificate?')) return;
        await apiFetch(`/api/certificates/${id}`, { method: 'DELETE' });
        fetchCerts();
    };

    const list = grouped[activeTab] || [];

    return (
        <div>
            <AdminPageHeader
                title="🏅 Certificates"
                subtitle="Manage certificates in Tech and Other categories."
                action={<button style={primaryBtn} onClick={() => setModal({})}><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> Add Certificate</span></button>}
            />
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {['tech', 'other'].map(t => (
                    <button key={t} onClick={() => setActiveTab(t)} style={{
                        ...secondaryBtn,
                        background: activeTab === t ? 'rgba(0,180,255,0.15)' : 'rgba(255,255,255,0.05)',
                        color: activeTab === t ? '#00b4ff' : '#888',
                        border: activeTab === t ? '1px solid rgba(0,180,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    }}>
                        {t === 'tech' ? 'Tech' : 'Others'}
                    </button>
                ))}
            </div>

            {loading ? <p style={{ color: '#888' }}>Loading...</p> :
                list.length === 0 ? (
                    <div style={adminCard}><p style={{ color: '#888', textAlign: 'center', margin: 0 }}>No certificates in this category.</p></div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                        {list.map(c => (
                            <div key={c._id} style={{ ...adminCard, padding: 14 }}>
                                {c.imageUrl && <img src={c.imageUrl.startsWith('http') ? c.imageUrl : `${API_BASE}${c.imageUrl}`}
                                    alt={c.title} style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />}
                                <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{c.title}</div>
                                <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>{c.org} • {c.date}</div>
                                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                                    <button style={secondaryBtn} onClick={() => setModal(c)}><Pencil size={13} /> Edit</button>
                                    <button style={dangerBtn} onClick={() => handleDelete(c._id)}><Trash2 size={13} /> Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            {modal !== null && <CertModal cert={modal._id ? modal : null} onClose={() => setModal(null)} onSaved={fetchCerts} />}
        </div>
    );
}
