import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "";

export default function Certificates() {
  const [grouped, setGrouped] = useState({ tech: [], other: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("tech");
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/certificates`)
      .then(r => r.json())
      .then(data => { setGrouped(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getImgSrc = (url) => !url ? '' : (url.startsWith('http') ? url : `${API_BASE}${url}`);

  return (
    <section className="container" style={{ padding: "40px 0" }}>
      <div className="card" style={{ background: "#111", borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontSize: "1.8rem", color: "#fff", marginBottom: 4 }}>Certificates 🏅</h2>
        <p className="lead" style={{ color: "#aaa" }}>Explore my certifications — technical & others.</p>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          {["tech", "other"].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={tab === t ? "tab active" : "tab"}
              style={{
                padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
                background: tab === t ? "#007bff" : "#333", color: "#fff", fontWeight: 500, transition: "0.3s"
              }}>
              {t === "tech" ? "Tech" : "Others"}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: '#888', marginTop: 20 }}>Loading certificates...</p>}

        <div className="certs-grid" style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          <AnimatePresence mode="wait">
            {(grouped[tab] || []).map((c, idx) => (
              <motion.div key={c._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(0, 123, 255, 0.4)" }}
                style={{ background: "#1a1a1a", borderRadius: 12, padding: 16, color: "#fff" }}>
                {c.imageUrl && (
                  <img src={getImgSrc(c.imageUrl)} alt={c.title}
                    style={{ width: "100%", height: 160, borderRadius: 10, objectFit: "cover", marginBottom: 12 }} />
                )}
                <strong style={{ fontSize: 16 }}>{c.title}</strong>
                <div style={{ fontSize: 13, color: "#bbb", marginTop: 4 }}>{c.org} • {c.date}</div>
                <div style={{ marginTop: 12 }}>
                  <button className="btn" onClick={() => setSelectedCert(c)}
                    style={{ background: "#007bff", border: "none", color: "white", borderRadius: 6, padding: "6px 14px", cursor: "pointer" }}>
                    View
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedCert && (
          <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}
            onClick={() => setSelectedCert(null)}>
            <motion.img src={getImgSrc(selectedCert.imageUrl)} alt={selectedCert.title}
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              style={{ maxWidth: "90%", maxHeight: "85%", borderRadius: 10, boxShadow: "0 0 25px rgba(255,255,255,0.2)" }}
              onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
