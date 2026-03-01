import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const API_BASE = "";

export default function Resume() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/resume`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <section className="container" style={{ padding: "60px 0" }}>
      <p style={{ color: '#888', textAlign: 'center' }}>Loading resume...</p>
    </section>
  );

  const profile = data?.sections?.profile || {};
  const experience = data?.sections?.experience || [];
  const education = data?.sections?.education || [];
  const projects = data?.sections?.projects || [];
  const skills = data?.sections?.skills || [];
  const pdfUrl = data?.pdfUrl ? `${API_BASE}${data.pdfUrl}` : null;

  return (
    <section className="container" style={{ padding: "60px 0" }}>
      <motion.div className="card" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        style={{ background: "#0b0b0b", borderRadius: 16, padding: "40px 30px", color: "#e5e5e5", boxShadow: "0 0 25px rgba(0, 153, 255, 0.1)" }}>

        <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontSize: 28, color: "#00b4ff", marginBottom: 12 }}>
          📄 Resume
        </motion.h2>
        <p style={{ color: "#aaa", marginBottom: 25 }}>A quick glance at my journey.</p>

        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20, background: "rgba(255,255,255,0.03)", padding: "24px 20px", borderRadius: 12 }}>
          <div>
            <h3 style={{ fontSize: 24, color: "#00b4ff", marginBottom: 4 }}>👨‍💻 {profile.name || 'Rahul Kumar'}</h3>
            <p style={{ fontSize: 15, color: "#ccc" }}>{profile.title}</p>
            <p style={{ margin: "4px 0", fontSize: 14, color: "#aaa" }}>{profile.location}</p>
            <p style={{ margin: "4px 0", fontSize: 14, color: "#aaa" }}>{profile.email}</p>
          </div>
          {profile.summary && (
            <motion.div whileHover={{ scale: 1.05 }}
              style={{ background: "linear-gradient(135deg, #00b4ff44, #0b0b0b)", borderRadius: 12, padding: "14px 20px", border: "1px solid rgba(255,255,255,0.1)", maxWidth: 360, fontSize: 14, lineHeight: 1.6 }}>
              <strong style={{ color: "#00b4ff" }}>Professional Summary:</strong>
              <p style={{ marginTop: 6, color: "#ccc" }}>{profile.summary}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Experience */}
        {experience.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ marginTop: 40, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "20px 24px", background: "rgba(255,255,255,0.03)" }}>
            <h4 style={{ fontSize: 20, color: "#00b4ff", marginBottom: 12 }}>💼 Experience</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.8 }}>
              {experience.map((e, i) => (
                <li key={i} style={{ marginTop: i > 0 ? 16 : 0 }}>
                  <strong>{e.role} — {e.company}</strong><br />
                  <span style={{ color: "#aaa" }}>{e.period} | {e.location}</span>
                  <p style={{ fontSize: 14, color: "#ccc", marginTop: 4 }}>{e.description}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            style={{ marginTop: 40, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "20px 24px", background: "rgba(255,255,255,0.03)" }}>
            <h4 style={{ fontSize: 20, color: "#00b4ff", marginBottom: 12 }}>🎓 Education</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.8 }}>
              {education.map((e, i) => (
                <li key={i}>
                  <strong>{e.degree}</strong> — {e.institution}, {e.period}
                  {e.gpa && <><br /><span style={{ color: "#aaa" }}>GPA: {e.gpa}</span></>}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} style={{ marginTop: 40 }}>
            <h4 style={{ fontSize: 20, color: "#00b4ff", marginBottom: 12 }}>🚀 Key Projects</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.8 }}>
              {projects.map((p, i) => (
                <li key={i} style={{ marginBottom: 10 }}>
                  <strong>{i + 1}️⃣ {p.url
                    ? <a href={p.url} target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>{p.title}</a>
                    : p.title}</strong><br />
                  <span style={{ fontSize: 14, color: "#ccc" }}>{p.description}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} style={{ marginTop: 40 }}>
            <h4 style={{ fontSize: 20, color: "#00b4ff", marginBottom: 12 }}>⚙️ Skills</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {skills.map((skill) => (
                <motion.span key={skill} whileHover={{ scale: 1.1, backgroundColor: "rgba(0,180,255,0.3)" }}
                  style={{ background: "rgba(255,255,255,0.05)", padding: "6px 12px", borderRadius: 8, fontSize: 13, color: "#ccc" }}>
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* LinkedIn */}
        {profile.linkedin && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}
            style={{ display: "flex", justifyContent: "center", gap: 30, marginTop: 40 }}>
            <motion.a href={profile.linkedin} target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.1, color: "#00b4ff" }}
              style={{ color: "#ccc", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>
              💼 LinkedIn
            </motion.a>
          </motion.div>
        )}

        {/* PDF Viewer */}
        {pdfUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            style={{ marginTop: 50, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
            <iframe src={pdfUrl} title="Rahul Kumar Resume"
              style={{ width: "100%", height: "650px", border: "none", background: "#111" }} />
          </motion.div>
        )}

        {/* Download */}
        {pdfUrl && (
          <motion.a href={pdfUrl} download whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{ display: "inline-block", marginTop: 20, background: "#00b4ff", color: "#fff", padding: "10px 22px", borderRadius: 8, textDecoration: "none", fontWeight: 500, letterSpacing: 0.3 }}>
            ⬇️ Download Resume
          </motion.a>
        )}
      </motion.div>
    </section>
  );
}
