import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { Plus, Trash2, Upload, Check } from 'lucide-react';
import {
    adminCard, primaryBtn, dangerBtn, secondaryBtn, inputStyle, labelStyle,
    AdminPageHeader, StatusMsg,
} from '../AdminComponents';

const API_BASE = '';
const SECTIONS = ['profile', 'experience', 'education', 'projects', 'skills'];

export default function AdminResume() {
    const [data, setData] = useState({ sections: {}, pdfUrl: null });
    const [activeTab, setActiveTab] = useState('profile');
    const [editContent, setEditContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfStatus, setPdfStatus] = useState('');
    const [pdfLoading, setPdfLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const d = await apiFetch('/api/resume');
            setData(d);
            const cur = d.sections?.[activeTab];
            setEditContent(cur ? JSON.stringify(cur, null, 2) : '');
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const switchTab = (tab) => {
        setActiveTab(tab);
        const cur = data.sections?.[tab];
        setEditContent(cur ? JSON.stringify(cur, null, 2) : '');
        setSaveStatus('');
    };

    const handleSaveSection = async () => {
        setSaveStatus('');
        try {
            const parsed = JSON.parse(editContent);
            await apiFetch(`/api/resume/${activeTab}`, {
                method: 'PUT',
                body: JSON.stringify({ content: parsed }),
            });
            setSaveStatus('✅ Section saved!');
            fetchData();
        } catch (err) {
            setSaveStatus('❌ ' + (err.message.includes('JSON') ? 'Invalid JSON format' : err.message));
        }
    };

    const handlePdfUpload = async () => {
        if (!pdfFile) return;
        setPdfLoading(true);
        setPdfStatus('');
        try {
            const formData = new FormData();
            formData.append('pdf', pdfFile);
            await apiFetch('/api/resume/upload', { method: 'POST', body: formData });
            setPdfStatus('✅ Resume PDF updated successfully!');
            setPdfFile(null);
            fetchData();
        } catch (err) {
            setPdfStatus('❌ ' + err.message);
        } finally {
            setPdfLoading(false);
        }
    };

    const sectionHelp = {
        profile: 'Edit your name, title, location, email, summary, and linkedin URL.',
        experience: 'Array of { role, company, period, location, description }',
        education: 'Array of { degree, institution, period, gpa }',
        projects: 'Array of { title, url, description }',
        skills: 'Array of skill strings like ["Python", "Docker", ...]',
    };

    return (
        <div>
            <AdminPageHeader title="📄 Resume" subtitle="Edit resume sections and upload your latest PDF." />

            {/* PDF Upload */}
            <div style={{ ...adminCard, marginBottom: 28 }}>
                <h3 style={{ color: '#00b4ff', margin: '0 0 14px', fontSize: 16 }}>📁 Resume PDF</h3>
                {data.pdfUrl && (
                    <p style={{ color: '#888', fontSize: 13, margin: '0 0 12px' }}>
                        Current: <a href={`${API_BASE}${data.pdfUrl}`} target="_blank" rel="noreferrer" style={{ color: '#00b4ff' }}>{data.pdfOriginalName || 'resume.pdf'}</a>
                    </p>
                )}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])}
                        style={{ ...inputStyle, flex: 1, minWidth: 200, padding: 8 }} />
                    <button onClick={handlePdfUpload} disabled={!pdfFile || pdfLoading} style={primaryBtn}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Upload size={14} /> {pdfLoading ? 'Uploading...' : 'Upload PDF'}
                        </span>
                    </button>
                </div>
                <StatusMsg msg={pdfStatus} isError={pdfStatus.startsWith('❌')} />
            </div>

            {/* Section Editor */}
            <div style={adminCard}>
                <h3 style={{ color: '#00b4ff', margin: '0 0 14px', fontSize: 16 }}>✏️ Edit Section Content</h3>

                {/* Section tabs */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                    {SECTIONS.map(s => (
                        <button key={s} onClick={() => switchTab(s)} style={{
                            ...secondaryBtn, fontSize: 12, padding: '6px 12px', textTransform: 'capitalize',
                            background: activeTab === s ? 'rgba(0,180,255,0.15)' : 'rgba(255,255,255,0.05)',
                            color: activeTab === s ? '#00b4ff' : '#888',
                            border: activeTab === s ? '1px solid rgba(0,180,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
                        }}>
                            {s}
                        </button>
                    ))}
                </div>

                <p style={{ color: '#666', fontSize: 12, margin: '0 0 10px' }}>
                    💡 {sectionHelp[activeTab]}
                </p>

                <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 13, minHeight: 320, resize: 'vertical', lineHeight: 1.6 }}
                    placeholder="Loading..."
                    spellCheck={false}
                />

                <StatusMsg msg={saveStatus} isError={saveStatus.startsWith('❌')} />
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleSaveSection} style={primaryBtn}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} /> Save Section</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
