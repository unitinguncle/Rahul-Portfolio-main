import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import "./blog.css";

const API_BASE = "";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/blog`)
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function vote(id, type) {
    const post = posts.find(p => p._id === id);
    if (!post || post.userVote) return; // already voted locally

    try {
      const res = await fetch(`${API_BASE}/api/blog/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      if (res.status === 400) return; // already voted server-side
      const data = await res.json();
      setPosts(prev => prev.map(p => p._id === id
        ? { ...p, agree: data.agree, disagree: data.disagree, userVote: type }
        : p
      ));
    } catch (err) {
      console.error('Vote error:', err);
    }
  }

  const getImgSrc = (url) => !url ? '' : (url.startsWith('http') ? url : `${API_BASE}${url}`);

  return (
    <motion.section className="blog-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <motion.h2 className="blog-title" initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        📝 My Blog
      </motion.h2>
      <p className="blog-sub">Personal thoughts, experiences, and reflections — feel free to react!</p>

      {loading && <p style={{ color: '#888', textAlign: 'center' }}>Loading posts...</p>}

      <div className="blog-grid">
        {posts.map((p, idx) => (
          <motion.div key={p._id} className="blog-post"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.12 }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,255,255,0.1)" }}>

            {/* Cover image */}
            {p.coverImageUrl && (
              <img src={getImgSrc(p.coverImageUrl)} alt={p.title}
                style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 10, marginBottom: 14 }} />
            )}

            <h3 className="post-title">{p.title}</h3>

            {/* Render rich HTML content */}
            <div className="post-text" dangerouslySetInnerHTML={{ __html: p.content }} />

            {/* Tags */}
            {p.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '10px 0' }}>
                {p.tags.map(t => (
                  <span key={t} style={{ background: 'rgba(0,180,255,0.1)', border: '1px solid rgba(0,180,255,0.2)', padding: '2px 8px', borderRadius: 5, fontSize: 11, color: '#80cfff' }}>{t}</span>
                ))}
              </div>
            )}

            <div className="vote-container">
              <motion.button onClick={() => vote(p._id, "agree")} disabled={!!p.userVote}
                whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.15 }}
                className={`vote-btn-circle agree ${p.userVote === "agree" ? "active" : ""}`}>
                <ThumbsUp size={20} />
                <motion.span key={p.agree} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="vote-count">
                  {p.agree}
                </motion.span>
              </motion.button>

              <motion.button onClick={() => vote(p._id, "disagree")} disabled={!!p.userVote}
                whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.15 }}
                className={`vote-btn-circle disagree ${p.userVote === "disagree" ? "active" : ""}`}>
                <ThumbsDown size={20} />
                <motion.span key={p.disagree} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="vote-count">
                  {p.disagree}
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
