import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { Trash2, Pencil, Plus, X } from 'lucide-react';
import {
    adminCard, primaryBtn, dangerBtn, secondaryBtn, inputStyle, labelStyle,
    AdminPageHeader, StatusMsg,
} from '../AdminComponents';

const API_BASE = '';
const CATEGORIES = ['personal', 'projects', 'achievements'];

function GalleryModal({ post, onClose, onSaved }) {
    const isEdit = !!post?._id;
    const [form, setForm] = useState({
        category: post?.category || 'personal',
        caption: post?.caption || '',
    });
    const [existingPhotos, setExistingPhotos] = useState(post?.photos || []);
    const [newFiles, setNewFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setNewFiles(files);
        setPreviews(files.map(f => URL.createObjectURL(f)));
    };

    const removeExistingPhoto = (url) => setExistingPhotos(prev => prev.filter(p => p !== url));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');
        try {
            const formData = new FormData();
            formData.append('category', form.category);
            formData.append('caption', form.caption);
            formData.append('existingPhotos', JSON.stringify(existingPhotos));
            newFiles.forEach(f => formData.append('photos', f));

            if (isEdit) {
                await apiFetch(`/api/gallery/${post._id}`, { method: 'PUT', body: formData });
            } else {
                await apiFetch('/api/gallery', { method: 'POST', body: formData });
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
                    <h2 style={{ color: '#00b4ff', margin: 0 }}>{isEdit ? 'Edit Post' : 'Add Gallery Post'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <label style={labelStyle}>Category *</label>
                        <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Caption *</label>
                        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} value={form.caption}
                            onChange={e => setForm({ ...form, caption: e.target.value })} required />
                    </div>

                    {/* Existing photos */}
                    {existingPhotos.length > 0 && (
                        <div>
                            <label style={labelStyle}>Current Photos (click × to remove)</label>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {existingPhotos.map(url => (
                                    <div key={url} style={{ position: 'relative' }}>
                                        <img src={url.startsWith('http') ? url : `${API_BASE}${url}`} alt=""
                                            style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6 }} />
                                        <button type="button" onClick={() => removeExistingPhoto(url)}
                                            style={{ position: 'absolute', top: -6, right: -6, background: '#ff4444', border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', color: '#fff', fontSize: 12, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New photos */}
                    <div>
                        <label style={labelStyle}>Upload New Photos (multiple allowed)</label>
                        <input type="file" accept="image/*" multiple onChange={handleFileChange} style={{ ...inputStyle, padding: 8 }} />
                        {previews.length > 0 && (
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                                {previews.map((src, i) => (
                                    <img key={i} src={src} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6 }} />
                                ))}
                            </div>
                        )}
                    </div>

                    <StatusMsg msg={status} isError={status.startsWith('❌')} />
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={secondaryBtn}>Cancel</button>
                        <button type="submit" disabled={loading} style={primaryBtn}>
                            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminGallery() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [activeTab, setActiveTab] = useState('personal');

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await apiFetch('/api/gallery/all');
            setPosts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPosts(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this gallery post?')) return;
        try {
            await apiFetch(`/api/gallery/${id}`, { method: 'DELETE' });
            setPosts(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            alert('Delete failed: ' + err.message);
        }
    };

    const filtered = posts.filter(p => p.category === activeTab);

    return (
        <div>
            <AdminPageHeader
                title="🖼️ Gallery"
                subtitle="Manage gallery posts. Each post can contain multiple photos."
                action={<button style={primaryBtn} onClick={() => setModal({})}><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> Add Post</span></button>}
            />

            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setActiveTab(c)} style={{
                        ...secondaryBtn,
                        background: activeTab === c ? 'linear-gradient(90deg, rgba(0,180,255,0.2), rgba(0,114,255,0.1))' : 'rgba(255,255,255,0.05)',
                        color: activeTab === c ? '#00b4ff' : '#888',
                        border: activeTab === c ? '1px solid rgba(0,180,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    }}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? <p style={{ color: '#888' }}>Loading...</p> :
                filtered.length === 0 ? (
                    <div style={adminCard}><p style={{ color: '#888', textAlign: 'center', margin: 0 }}>No posts in this category.</p></div>
                ) : (
                    <div style={{ display: 'grid', gap: 14 }}>
                        {filtered.map(p => (
                            <div key={p._id} style={{ ...adminCard, padding: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ color: '#ccc', fontSize: 14, margin: '0 0 10px' }}>{p.caption}</p>
                                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                            {p.photos?.map((src, i) => (
                                                <img key={i} src={src.startsWith('http') ? src : `${API_BASE}${src}`} alt=""
                                                    style={{ width: 70, height: 50, objectFit: 'cover', borderRadius: 6 }} />
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 12 }}>
                                        <button style={secondaryBtn} onClick={() => setModal(p)}><Pencil size={14} /></button>
                                        <button style={dangerBtn} onClick={() => handleDelete(p._id)}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            {modal !== null && (
                <GalleryModal post={modal._id ? modal : null} onClose={() => setModal(null)} onSaved={fetchPosts} />
            )}
        </div>
    );
}
