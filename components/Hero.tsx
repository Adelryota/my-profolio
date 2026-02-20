"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with WebGL
const ThreeAvatar = dynamic(() => import("./ThreeAvatar"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 280,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.3,
        fontSize: "4rem",
      }}
    >
      👁️
    </div>
  ),
});

const TYPING_ROLES = [
  "Full Stack Developer",
  "React & Next.js Engineer",
  "TypeScript Enthusiast",
  "UI/UX Craftsman",
];

function TypingText() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const role = TYPING_ROLES[roleIdx];
    let timeout: NodeJS.Timeout;

    if (!deleting && displayed.length < role.length) {
      timeout = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === role.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIdx((i) => (i + 1) % TYPING_ROLES.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIdx]);

  return (
    <span>
      <span style={{ color: "var(--accent)" }}>{displayed}</span>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        style={{ color: "var(--accent)", marginLeft: "2px" }}
      >
        |
      </motion.span>
    </span>
  );
}

export default function Hero() {
  return (
    <section
      style={{
        minHeight: "100dvh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        gap: "3rem",
        padding: "calc(var(--nav-height) + 3rem) 2rem 3rem",
        maxWidth: 1200,
        margin: "0 auto",
      }}
      className="hero-grid"
    >
      {/* Left — Text Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 1rem",
              borderRadius: "999px",
              background: "rgba(99,179,237,0.08)",
              border: "1px solid rgba(99,179,237,0.2)",
              fontSize: "0.8rem",
              color: "var(--accent)",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#4ade80",
                display: "inline-block",
                boxShadow: "0 0 8px #4ade80",
              }}
            />
            My eyes kinda functioning right now
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}
        >
          Hi, I&apos;m{" "}
          <span
            style={{
              background: "var(--gradient-hero)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Bob
          </span>
        </motion.h1>

        {/* Role Typing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            fontWeight: 600,
            color: "var(--text-secondary)",
          }}
        >
          <TypingText />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            color: "var(--text-secondary)",
            fontSize: "1rem",
            lineHeight: 1.8,
            maxWidth: 480,
          }}
        >
          I build beautiful, performant web applications with modern technologies.
          Passionate about clean code, smooth animations, and great user experiences and especially AI.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(99,179,237,0.35)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "0.75rem 1.75rem",
              borderRadius: "8px",
              background: "var(--gradient-hero)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.95rem",
              border: "none",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            View Projects
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.04, borderColor: "var(--accent)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "0.75rem 1.75rem",
              borderRadius: "8px",
              background: "transparent",
              color: "var(--text-primary)",
              fontWeight: 600,
              fontSize: "0.95rem",
              border: "1px solid var(--border)",
              cursor: "pointer",
              textDecoration: "none",
              transition: "border-color 0.2s",
            }}
          >
            Get in touch
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--text-muted)",
            fontSize: "0.8rem",
          }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ↓
          </motion.div>
          <span>Scroll to explore</span>
        </motion.div>
      </div>

      {/* Right — 3D Eyes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          width: "100%",
          aspectRatio: "1",
          maxHeight: 420,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Glow backdrop */}
        <div
          style={{
            position: "absolute",
            width: "70%",
            height: "70%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,179,237,0.12) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <div style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }}>
          <ThreeAvatar />
        </div>
      </motion.div>

      <style>{`
        .hero-grid {
          @media (max-width: 768px) {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
