import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { Plus, Trash2, Check } from 'lucide-react';
import {
    adminCard, primaryBtn, dangerBtn, secondaryBtn, inputStyle, labelStyle,
    AdminPageHeader, StatusMsg,
} from '../AdminComponents';

const ICONS = ['university', 'school', 'graduation'];

function EducationCard({ edu, index, onChange, onDelete }) {
    return (
        <div style={{ ...adminCard, padding: 16, position: 'relative' }}>
            <button onClick={() => onDelete(index)} style={{
                position: 'absolute', top: 12, right: 12,
                background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)',
                borderRadius: 6, cursor: 'pointer', color: '#ff6b6b', padding: '4px 8px',
            }}>
                <Trash2 size={13} />
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                    <label style={labelStyle}>Degree *</label>
                    <input style={inputStyle} value={edu.degree} placeholder="Bachelor in Technology"
                        onChange={e => onChange(index, 'degree', e.target.value)} />
                </div>
                <div>
                    <label style={labelStyle}>Institution *</label>
                    <input style={inputStyle} value={edu.institution} placeholder="University name"
                        onChange={e => onChange(index, 'institution', e.target.value)} />
                </div>
                <div>
                    <label style={labelStyle}>Location</label>
                    <input style={inputStyle} value={edu.location} placeholder="City, State"
                        onChange={e => onChange(index, 'location', e.target.value)} />
                </div>
                <div>
                    <label style={labelStyle}>GPA / Grade</label>
                    <input style={inputStyle} value={edu.gpa} placeholder="8.49"
                        onChange={e => onChange(index, 'gpa', e.target.value)} />
                </div>
                <div>
                    <label style={labelStyle}>Years</label>
                    <input style={inputStyle} value={edu.years} placeholder="2018 – 2022"
                        onChange={e => onChange(index, 'years', e.target.value)} />
                </div>
                <div>
                    <label style={labelStyle}>Icon</label>
                    <select style={inputStyle} value={edu.icon} onChange={e => onChange(index, 'icon', e.target.value)}>
                        {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
}

export default function AdminAbout() {
    const [bio, setBio] = useState(['']);
    const [education, setEducation] = useState([]);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        apiFetch('/api/about').then(d => {
            setBio(d.bio?.length ? d.bio : ['']);
            setEducation(d.education || []);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleBioChange = (i, val) => {
        setBio(prev => { const n = [...prev]; n[i] = val; return n; });
    };

    const addBioPara = () => setBio(prev => [...prev, '']);
    const removeBioPara = (i) => setBio(prev => prev.filter((_, idx) => idx !== i));

    const addEducation = () => setEducation(prev => [...prev, { degree: '', institution: '', location: '', gpa: '', years: '', icon: 'university' }]);
    const removeEducation = (i) => setEducation(prev => prev.filter((_, idx) => idx !== i));
    const updateEducation = (i, field, val) => {
        setEducation(prev => { const n = [...prev]; n[i] = { ...n[i], [field]: val }; return n; });
    };

    const handleSave = async () => {
        setSaving(true);
        setStatus('');
        try {
            await apiFetch('/api/about', {
                method: 'PUT',
                body: JSON.stringify({ bio: bio.filter(p => p.trim()), education }),
            });
            setStatus('✅ About Me saved successfully!');
        } catch (err) {
            setStatus('❌ ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p style={{ color: '#888' }}>Loading...</p>;

    return (
        <div>
            <AdminPageHeader title="👤 About Me" subtitle="Edit your bio paragraphs and education cards." />

            {/* Bio */}
            <div style={adminCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ color: '#00b4ff', margin: 0, fontSize: 16 }}>📝 Bio Paragraphs</h3>
                    <button style={secondaryBtn} onClick={addBioPara}><Plus size={13} /> Add Paragraph</button>
                </div>
                <p style={{ color: '#666', fontSize: 12, margin: '0 0 12px' }}>
                    💡 You can use &lt;strong&gt;...&lt;/strong&gt; for bold text in paragraphs.
                </p>
                {bio.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
                        <textarea
                            style={{ ...inputStyle, flex: 1, minHeight: 70, resize: 'vertical' }}
                            value={p}
                            placeholder={`Paragraph ${i + 1}...`}
                            onChange={e => handleBioChange(i, e.target.value)}
                        />
                        {bio.length > 1 && (
                            <button onClick={() => removeBioPara(i)} style={{ ...dangerBtn, padding: '6px 10px', flexShrink: 0 }}>
                                <Trash2 size={13} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Education */}
            <div style={adminCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ color: '#00b4ff', margin: 0, fontSize: 16 }}>🎓 Education Cards</h3>
                    <button style={primaryBtn} onClick={addEducation}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={14} /> Add Education</span>
                    </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {education.length === 0 && <p style={{ color: '#888', fontSize: 13 }}>No education cards yet.</p>}
                    {education.map((edu, i) => (
                        <EducationCard key={i} edu={edu} index={i} onChange={updateEducation} onDelete={removeEducation} />
                    ))}
                </div>
            </div>

            <StatusMsg msg={status} isError={status.startsWith('❌')} />
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleSave} disabled={saving} style={primaryBtn}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} /> {saving ? 'Saving...' : 'Save All Changes'}</span>
                </button>
            </div>
        </div>
    );
}
