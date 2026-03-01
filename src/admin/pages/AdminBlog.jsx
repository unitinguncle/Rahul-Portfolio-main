import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { apiFetch } from '../api';
import { Trash2, Pencil, Plus, X } from 'lucide-react';
import {
    adminCard, primaryBtn, dangerBtn, secondaryBtn, inputStyle, labelStyle,
    AdminPageHeader, StatusMsg,
} from '../AdminComponents';

const API_BASE = '';

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link'],
        ['clean'],
    ],
};

function BlogModal({ post, onClose, onSaved }) {
    const isEdit = !!post?._id;
    const [title, setTitle] = useState(post?.title || '');
    const [content, setContent] = useState(post?.content || '');
    const [tagsText, setTagsText] = useState(post?.tags?.join(', ') || '');
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(post?.coverImageUrl || '');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content || content === '<p><br></p>') {
            setStatus('❌ Content cannot be empty.'); return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('tags', JSON.stringify(tagsText.split(',').map(t => t.trim()).filter(Boolean)));
            if (coverFile) formData.append('coverImage', coverFile);
            else if (post?.coverImageUrl) formData.append('coverImageUrl', post.coverImageUrl);

            if (isEdit) await apiFetch(`/api/blog/${post._id}`, { method: 'PUT', body: formData });
            else await apiFetch('/api/blog', { method: 'POST', body: formData });

            setStatus('✅ Saved!');
            setTimeout(() => { onSaved(); onClose(); }, 700);
        } catch (err) {
            setStatus('❌ ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, padding: '20px', overflowY: 'auto' }}>
            <div style={{ ...adminCard, width: '100%', maxWidth: 760, margin: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ color: '#00b4ff', margin: 0 }}>{isEdit ? 'Edit Blog Post' : 'New Blog Post'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={labelStyle}>Title *</label>
                        <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} required placeholder="Post title..." />
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label style={labelStyle}>Cover Image</label>
                        {coverPreview && (
                            <img src={coverPreview.startsWith('blob') ? coverPreview : (coverPreview.startsWith('http') ? coverPreview : `${API_BASE}${coverPreview}`)}
                                alt="cover" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 10, marginBottom: 8 }} />
                        )}
                        <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); } }}
                            style={{ ...inputStyle, padding: 8 }} />
                    </div>

                    {/* Rich Text Editor */}
                    <div>
                        <label style={labelStyle}>Content *</label>
                        <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <style>{`
                .ql-toolbar { background: #1a1a2e !important; border-color: rgba(255,255,255,0.1) !important; }
                .ql-toolbar .ql-stroke { stroke: #aaa !important; }
                .ql-toolbar .ql-fill { fill: #aaa !important; }
                .ql-toolbar .ql-picker-label { color: #aaa !important; }
                .ql-container { background: #0f0f1a !important; border-color: rgba(255,255,255,0.1) !important; color: #eee !important; min-height: 220px; font-size: 15px; }
                .ql-editor.ql-blank::before { color: #555 !important; }
              `}</style>
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                modules={quillModules}
                                placeholder="Write your blog post here..."
                            />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Tags (comma separated)</label>
                        <input style={inputStyle} value={tagsText} onChange={e => setTagsText(e.target.value)} placeholder="Technology, AI, Life" />
                    </div>

                    <StatusMsg msg={status} isError={status.startsWith('❌')} />
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" onClick={onClose} style={secondaryBtn}>Cancel</button>
                        <button type="submit" disabled={loading} style={primaryBtn}>{loading ? 'Publishing...' : isEdit ? 'Update Post' : 'Publish Post'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminBlog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await apiFetch('/api/blog');
            setPosts(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchPosts(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this blog post?')) return;
        await apiFetch(`/api/blog/${id}`, { method: 'DELETE' });
        setPosts(prev => prev.filter(p => p._id !== id));
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div>
            <AdminPageHeader
                title="📝 Blog"
                subtitle="Write and manage blog posts. Rich text formatting supported."
                action={<button style={primaryBtn} onClick={() => setModal({})}><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> New Post</span></button>}
            />

            {loading ? <p style={{ color: '#888' }}>Loading...</p> :
                posts.length === 0 ? (
                    <div style={adminCard}><p style={{ color: '#888', textAlign: 'center', margin: 0 }}>No posts yet.</p></div>
                ) : (
                    <div style={{ display: 'grid', gap: 12 }}>
                        {posts.map(p => (
                            <div key={p._id} style={{ ...adminCard, display: 'flex', alignItems: 'center', gap: 14, padding: 14 }}>
                                {p.coverImageUrl && (
                                    <img src={p.coverImageUrl.startsWith('http') ? p.coverImageUrl : `${API_BASE}${p.coverImageUrl}`}
                                        alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                                )}
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{p.title}</div>
                                    <div style={{ color: '#666', fontSize: 12, marginTop: 2 }}>{formatDate(p.createdAt)} · 👍 {p.agree} · 👎 {p.disagree}</div>
                                    {p.tags?.length > 0 && (
                                        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                                            {p.tags.map(t => <span key={t} style={{ background: 'rgba(0,180,255,0.1)', padding: '1px 7px', borderRadius: 4, fontSize: 11, color: '#80cfff' }}>{t}</span>)}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button style={secondaryBtn} onClick={() => setModal(p)}><Pencil size={14} /></button>
                                    <button style={dangerBtn} onClick={() => handleDelete(p._id)}><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            {modal !== null && <BlogModal post={modal._id ? modal : null} onClose={() => setModal(null)} onSaved={fetchPosts} />}
        </div>
    );
}
