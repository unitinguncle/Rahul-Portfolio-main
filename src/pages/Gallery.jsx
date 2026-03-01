import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "./Gallery.css";

const API_BASE = "";

const pageVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { when: "beforeChildren", staggerChildren: 0.2, duration: 0.8, ease: "easeOut" } },
};
const childVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const tabContentVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -30, scale: 0.98, transition: { duration: 0.4 } },
};

function getImgSrc(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_BASE}${url}`;
}

export default function Gallery() {
  const [grouped, setGrouped] = useState({ personal: [], projects: [], achievements: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("personal");
  const [zoom, setZoom] = useState({ img: null, post: null, index: 0 });

  useEffect(() => {
    fetch(`${API_BASE}/api/gallery`)
      .then(r => r.json())
      .then(data => { setGrouped(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const openZoom = (post, index) => setZoom({ img: post.photos[index], post, index });
  const closeZoom = () => setZoom({ img: null, post: null, index: 0 });
  const nextImage = () => {
    if (!zoom.post) return;
    const nextIndex = (zoom.index + 1) % zoom.post.photos.length;
    setZoom({ ...zoom, img: zoom.post.photos[nextIndex], index: nextIndex });
  };
  const prevImage = () => {
    if (!zoom.post) return;
    const prevIndex = (zoom.index - 1 + zoom.post.photos.length) % zoom.post.photos.length;
    setZoom({ ...zoom, img: zoom.post.photos[prevIndex], index: prevIndex });
  };

  const currentPosts = grouped[tab] || [];

  return (
    <motion.section className="gallery-container" variants={pageVariants} initial="hidden" animate="visible" exit="hidden">
      <motion.h2 className="gallery-title" variants={childVariants}>Gallery</motion.h2>

      <motion.div className="tab-buttons" variants={childVariants}>
        {["personal", "projects", "achievements"].map((type) => (
          <motion.button key={type} className={`tab ${tab === type ? "active" : ""}`}
            onClick={() => setTab(type)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {loading && <p style={{ color: '#888', textAlign: 'center' }}>Loading gallery...</p>}

      <AnimatePresence mode="wait">
        <motion.div key={tab} className="post-feed" variants={tabContentVariants} initial="hidden" animate="visible" exit="exit">
          {currentPosts.length === 0 && !loading && (
            <p style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No posts in this category yet.</p>
          )}
          {currentPosts.map((post) => (
            <motion.div key={post._id} className="post-card" variants={childVariants} whileHover={{ y: -4 }}>
              <p className="caption">{post.caption}</p>
              <div className={`photo-grid ${post.photos?.length > 1 ? "multi" : "single"}`}>
                {post.photos?.map((src, i) => (
                  <motion.div key={i} className="photo-item" whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 250 }} onClick={() => openZoom(post, i)}>
                    <img src={getImgSrc(src)} alt="gallery" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Zoom Overlay */}
      <AnimatePresence>
        {zoom.img && (
          <motion.div className="zoom-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <motion.img key={zoom.img} src={getImgSrc(zoom.img)} alt="zoom" className="zoom-img"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3 }} />
            {zoom.post?.photos.length > 1 && (
              <>
                <button className="nav-btn left" onClick={prevImage}><ChevronLeft size={32} /></button>
                <button className="nav-btn right" onClick={nextImage}><ChevronRight size={32} /></button>
              </>
            )}
            <button className="close-btn" onClick={closeZoom}><X size={28} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
