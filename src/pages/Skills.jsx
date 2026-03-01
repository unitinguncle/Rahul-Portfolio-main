import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./Skills.css";

const API_BASE = "";

export default function Skills() {
  const stageRef = useRef();
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/skills`).then(r => r.json()),
      fetch(`${API_BASE}/api/skills/categories`).then(r => r.json()),
    ]).then(([s, c]) => {
      setSkills(s);
      setCategories(c);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!skills.length) return;
    const stage = stageRef.current;
    if (!stage) return;
    const circles = Array.from(stage.querySelectorAll(".skill-circle"));
    const rect = stage.getBoundingClientRect();
    const placed = [];

    const isOverlapping = (x, y, size) =>
      placed.some((p) => {
        const dx = p.x - x, dy = p.y - y;
        return Math.sqrt(dx * dx + dy * dy) < p.size / 2 + size / 2 + 40;
      });

    circles.forEach((circle) => {
      const size = circle.offsetWidth;
      let x, y, tries = 0;
      do {
        x = Math.random() * (rect.width - size - 20);
        y = Math.random() * (rect.height - size - 20);
        tries++;
      } while (isOverlapping(x, y, size) && tries < 150);

      placed.push({ x, y, size });
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;

      const dx = (Math.random() - 0.5) * 100;
      const dy = (Math.random() - 0.5) * 100;
      circle.animate(
        [{ transform: "translate(0, 0)" }, { transform: `translate(${dx}px, ${dy}px)` }],
        { duration: 5000 + Math.random() * 2000, direction: "alternate", iterations: Infinity, easing: "ease-in-out" }
      );
    });
  }, [skills]);

  // Group categories by rowIndex
  const rows = categories.reduce((acc, cat) => {
    const rowIdx = cat.rowIndex || 0;
    if (!acc[rowIdx]) acc[rowIdx] = [];
    acc[rowIdx].push(cat);
    return acc;
  }, {});

  const getLogoSrc = (url) => !url ? '' : (url.startsWith('http') ? url : `${API_BASE}${url}`);

  return (
    <section className="skills-container" id="skills">
      <motion.div className="skills-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <h2 className="text-5xl text-cyan-400 font-semibold mb-3">My Skills</h2>
        <div className="w-28 h-[2px] bg-cyan-400 mx-auto mb-6"></div>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          ✨ Technical expertise blended with creativity — explore my core competencies below.
        </p>
      </motion.div>

      {loading ? (
        <p style={{ color: '#888', textAlign: 'center', height: 550, lineHeight: '550px' }}>Loading skills...</p>
      ) : (
        <motion.div className="skills-stage relative mx-auto mb-20" ref={stageRef}
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ width: "100%", height: "550px", borderRadius: "25px", background: "radial-gradient(circle at 50% 50%, #0a0a0a, #101010)", overflow: "hidden", boxShadow: "inset 0 0 60px rgba(0,255,255,0.07)", position: "relative" }}>
          {skills.map((s, i) => (
            <motion.div key={s._id} className="skill-circle"
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.3, boxShadow: "0 0 35px 10px rgba(0,255,255,0.6)", background: "rgba(0,255,255,0.12)" }}
              style={{ width: "110px", height: "110px", borderRadius: "50%", position: "absolute", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "rgba(0,255,255,0.06)", border: "1px solid rgba(0,255,255,0.25)", backdropFilter: "blur(8px)", cursor: "pointer", transition: "box-shadow 0.4s ease, background 0.4s ease" }}>
              <motion.img src={getLogoSrc(s.logoUrl)} alt={s.name}
                style={{ width: "50px", height: "50px", objectFit: "contain", filter: "drop-shadow(0 0 8px rgba(0,255,255,0.4)) brightness(1.2)", marginBottom: "5px" }}
                whileHover={{ filter: "drop-shadow(0 0 12px rgba(0,255,255,0.9)) brightness(1.6)", rotate: [0, 6, -6, 0], transition: { duration: 0.5 } }} />
              <span style={{ color: "rgba(180,255,255,0.9)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.3px" }}>{s.name}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Skills table */}
      <div className="skills-table">
        {Object.entries(rows).sort(([a], [b]) => Number(a) - Number(b)).map(([rowIdx, cats]) => (
          <div key={rowIdx} className="skills-row">
            {cats.sort((a, b) => (a.order || 0) - (b.order || 0)).map((col) => (
              <motion.div key={col._id} className="skill-box"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}>
                <h3>{col.title}</h3>
                <ul>
                  {col.items?.map((item, i) => (
                    <motion.li key={i} whileHover={{ x: 6, color: "#00ffc8" }}>{item}</motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
