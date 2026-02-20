"use client";

import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

export default function ProjectCard({
  title,
  description,
  techStack,
  imageUrl,
  githubUrl,
  liveUrl,
  featured = false,
}: ProjectCardProps) {
  return (
    <motion.article
      whileHover={{
        y: featured ? -8 : -6,
        boxShadow: featured
          ? "0 20px 60px rgba(99,179,237,0.28)"
          : "0 12px 40px rgba(99,179,237,0.15)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="glass-card"
      style={{
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: "1px solid var(--border)",
        position: "relative",
      }}
    >
      {/* Featured badge */}
      {featured && (
        <div
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            zIndex: 10,
            padding: "0.25rem 0.75rem",
            borderRadius: "999px",
            background: "var(--gradient-hero)",
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            boxShadow: "0 2px 12px rgba(99,179,237,0.4)",
          }}
        >
          ⭐ Featured
        </div>
      )}

      {/* Image */}
      <div
        style={{
          width: "100%",
          aspectRatio: featured ? "4/3" : "16/9",
          background: imageUrl
            ? `url(${imageUrl}) center/cover no-repeat`
            : featured
            ? "linear-gradient(135deg, rgba(99,179,237,0.22) 0%, rgba(124,111,247,0.22) 100%)"
            : "linear-gradient(135deg, rgba(99,179,237,0.12) 0%, rgba(124,111,247,0.12) 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {!imageUrl && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: featured ? "3.5rem" : "2.5rem",
              opacity: 0.5,
            }}
          >
            🚀
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: "linear-gradient(to top, var(--bg-card), transparent)",
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          padding: featured ? "1.75rem" : "1.5rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <h3
          style={{
            fontSize: featured ? "1.25rem" : "1.1rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            lineHeight: 1.75,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: featured ? 4 : 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>

        {/* Tech Stack Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {techStack.map((tech) => (
            <span
              key={tech}
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                background: "rgba(99,179,237,0.1)",
                border: "1px solid rgba(99,179,237,0.2)",
                color: "var(--accent)",
                letterSpacing: "0.03em",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          {githubUrl && (
            <motion.a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ color: "var(--accent)" }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                fontWeight: 500,
                transition: "color 0.2s",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </motion.a>
          )}
          {liveUrl && (
            <motion.a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ color: "var(--accent)" }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                fontWeight: 500,
                transition: "color 0.2s",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
              Live
            </motion.a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
