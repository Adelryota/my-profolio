"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
  { label: "Demos", href: "/todo" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: "var(--nav-height)",
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background 0.3s ease, border-color 0.3s ease",
        background: scrolled
          ? "rgba(8, 12, 20, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
      }}
    >
      {/* Logo */}
      <a
        href="#top"
        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
      >
        <motion.span
          whileHover={{ scale: 1.05 }}
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            background: "var(--gradient-hero)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            cursor: "pointer",
          }}
        >
          My Portfolio
        </motion.span>
      </a>

      {/* Desktop Links */}
      <ul
        style={{
          display: "flex",
          gap: "2rem",
          listStyle: "none",
          alignItems: "center",
        }}
        className="desktop-nav"
      >
        {NAV_LINKS.map(({ label, href }) => (
          <li key={label}>
            <motion.a
              href={href}
              whileHover={{ color: "var(--accent)" }}
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
                fontWeight: 500,
                transition: "color 0.2s ease",
              }}
            >
              {label}
            </motion.a>
          </li>
        ))}
        <li>
          <motion.a
            href="/admin/login"
            whileHover={{ scale: 1.05, borderColor: "var(--accent)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "0.4rem 1rem",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              fontWeight: 500,
              transition: "all 0.2s ease",
            }}
          >
            Admin
          </motion.a>
        </li>
      </ul>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
        style={{
          display: "none",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-primary)",
          padding: "0.5rem",
        }}
        className="mobile-menu-btn"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {menuOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: "absolute",
              top: "calc(var(--nav-height) + 0.5rem)",
              left: "1rem",
              right: "1rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "1rem",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
            }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{ color: "var(--text-secondary)", fontWeight: 500 }}
              >
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </motion.nav>
  );
}
