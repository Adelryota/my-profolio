"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AnimatedSection from "@/components/AnimatedSection";
import ProjectCard from "@/components/ProjectCard";

/* ── Types ─────────────────────────────────────── */
interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
}

/* ── Skills Data ────────────────────────────────── */
const SKILLS = [
  { name: "TypeScript", icon: "⚡" },
  { name: "React", icon: "⚛️" },
  { name: "Next.js", icon: "▲" },
  { name: "Node.js", icon: "🟢" },
  { name: "MongoDB", icon: "🍃" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Tailwind CSS", icon: "🎨" },
  { name: "Docker", icon: "🐳" },
  { name: "AWS", icon: "☁️" },
  { name: "Git", icon: "🌿" },
  { name: "REST APIs", icon: "🔌" },
  { name: "GraphQL", icon: "◈" },
];

/* ── Demo Apps ──────────────────────────────────── */
const DEMOS = [
  {
    title: "Todo App",
    desc: "Task manager with animations",
    icon: "✅",
    href: "/todo",
    color: "#63b3ed",
  },
  {
    title: "Weather App",
    desc: "Real-time weather by city",
    icon: "⛅",
    href: "/weather",
    color: "#7c6ff7",
  },
  {
    title: "Shop",
    desc: "E-commerce product browser",
    icon: "🛍️",
    href: "/shop",
    color: "#f6ad55",
  },
];

/* ── Contact Links ──────────────────────────────── */
const CONTACTS = [
  {
    label: "Email",
    value: "adel.cool.cool@gmail.com",
    href: "mailto:adel.cool.cool@gmail.com",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/adil-hamad-8a5154301/",
    href: "https://www.linkedin.com/in/adil-hamad-8a5154301/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    value: "github.com/Adelryota",
    href: "https://github.com/Adelryota",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
];

/* ── Placeholder Projects (shown before DB is set up) ── */
const PLACEHOLDER_PROJECTS: Project[] = [
  {
    _id: "1",
    title: "E-commerce Platform",
    description:
      "Full-stack e-commerce platform with Next.js, Stripe payments, and an admin dashboard for product management.",
    techStack: ["Next.js", "TypeScript", "MongoDB", "Stripe"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    _id: "2",
    title: "Real-time Chat App",
    description:
      "WebSocket-powered chat application with rooms, file sharing, and end-to-end message encryption.",
    techStack: ["React", "Socket.io", "Node.js", "Redis"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    _id: "3",
    title: "AI Task Manager",
    description:
      "Smart task management app that uses AI to prioritize and categorize your to-do list automatically.",
    techStack: ["Next.js", "OpenAI API", "PostgreSQL", "Tailwind"],
    githubUrl: "#",
    liveUrl: "#",
  },
];

/* ── Section Heading ────────────────────────────── */
function SectionHeading({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div style={{ marginBottom: "3rem", textAlign: "center" }}>
      <span
        style={{
          display: "inline-block",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "var(--accent)",
          textTransform: "uppercase",
          marginBottom: "0.75rem",
        }}
      >
        {label}
      </span>
      <h2
        style={{
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          marginBottom: subtitle ? "1rem" : 0,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ── Home Page ──────────────────────────────────── */
export default function Home() {
  const [projects, setProjects] = useState<Project[]>(PLACEHOLDER_PROJECTS);

  useEffect(() => {
    // Fetch projects from API when ready
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: Project[]) => {
        if (Array.isArray(data) && data.length > 0) setProjects(data);
      })
      .catch(() => {
        // Silently fall back to placeholder projects
      });
  }, []);

  return (
    <>
      <Navbar />

      {/* ── 1. Hero ── */}
      <Hero />

      {/* ── 2. About ── */}
      <section
        id="about"
        style={{
          padding: "6rem 1.5rem",
          background: "var(--bg-secondary)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <AnimatedSection>
            <SectionHeading
              label="About Me"
              title="Crafting Digital Experiences"
              subtitle="I'm a passionate full-stack developer who loves building things that live on the internet — from pixel-perfect UIs to robust backend systems."
            />
          </AnimatedSection>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
              alignItems: "start",
            }}
            className="about-grid"
          >
            {/* Bio Column */}
            <AnimatedSection delay={0.1}>
              <div className="glass-card" style={{ padding: "2rem" }}>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                    color: "var(--accent)",
                  }}
                >
                  Who I Am
                </h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.9, marginBottom: "1rem" }}>
                  I&apos;m a full-stack developer with a passion for crafting modern, performant web
                  applications. I specialize in React, Next.js, and Node.js ecosystems — building
                  products that are both beautiful and scalable.
                </p>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.9 }}>
                  When I&apos;m not coding, I&apos;m exploring new technologies, contributing to open source,
                  or learning about system design and architecture.
                </p>
              </div>
            </AnimatedSection>

            {/* Skills Grid */}
            <AnimatedSection delay={0.2}>
              <div className="glass-card" style={{ padding: "2rem" }}>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    marginBottom: "1.25rem",
                    color: "var(--accent)",
                  }}
                >
                  Tech Stack
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "0.6rem",
                  }}
                >
                  {SKILLS.map((skill, i) => (
                    <AnimatedSection key={skill.name} delay={0.05 * i}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "8px",
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid var(--border)",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          color: "var(--text-secondary)",
                          transition: "border-color 0.2s, color 0.2s",
                        }}
                        className="skill-pill"
                      >
                        <span>{skill.icon}</span>
                        <span>{skill.name}</span>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        <style>{`
          .about-grid { @media (max-width: 768px) { grid-template-columns: 1fr !important; } }
          @media (max-width: 768px) { .about-grid { grid-template-columns: 1fr !important; } }
          .skill-pill:hover { border-color: var(--border-accent) !important; color: var(--text-primary) !important; }
        `}</style>
      </section>

      {/* ── 3. Projects ── */}
      <section id="projects" style={{ padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <AnimatedSection>
            <SectionHeading
              label="My Work"
              title="Featured Projects"
              subtitle="A selection of projects I've built — from full-stack applications to UI experiments."
            />
          </AnimatedSection>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
              alignItems: "stretch",
            }}
          >
            {projects.map((project, i) => (
              <AnimatedSection key={project._id} delay={0.1 * i} style={{ height: "100%" }}>
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  techStack={project.techStack}
                  imageUrl={project.imageUrl}
                  githubUrl={project.githubUrl}
                  liveUrl={project.liveUrl}
                />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Demo Apps ── */}
      <section
        style={{
          padding: "6rem 1.5rem",
          background: "var(--bg-secondary)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <AnimatedSection>
            <SectionHeading
              label="Demos"
              title="Interactive Apps"
              subtitle="Live mini-applications built to demonstrate real-world frontend skills."
            />
          </AnimatedSection>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
            }}
            className="demo-grid"
          >
            {DEMOS.map((demo, i) => (
              <AnimatedSection key={demo.title} delay={0.1 * i}>
                <a
                  href={demo.href}
                  className="glass-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    padding: "2.5rem 1.5rem",
                    gap: "1rem",
                    textDecoration: "none",
                    transition: "transform 0.25s ease",
                  }}
                >
                  <span style={{ fontSize: "2.5rem" }}>{demo.icon}</span>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: demo.color,
                    }}
                  >
                    {demo.title}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {demo.desc}
                  </p>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    Open app →
                  </span>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <style>{`
          .demo-grid { @media (max-width: 768px) { grid-template-columns: 1fr !important; } }
          @media (max-width: 768px) { .demo-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ── 5. Contact ── */}
      <section id="contact" style={{ padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", width: "100%" }}>
          <AnimatedSection>
            <SectionHeading
              label="Contact"
              title="Let's Work Together"
              subtitle="Open to new opportunities, freelance projects, or just a good conversation about tech."
            />
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div
              className="glass-card"
              style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}
            >
              {CONTACTS.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.25rem",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                    transition: "border-color 0.2s, color 0.2s, background 0.2s",
                  }}
                  className="contact-link"
                >
                  <span style={{ color: "var(--accent)" }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.15rem" }}>
                      {c.label}
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 500 }}>{c.value}</div>
                  </div>
                  <span style={{ marginLeft: "auto", opacity: 0.4 }}>→</span>
                </a>
              ))}
            </div>
          </AnimatedSection>
        </div>

        <style>{`
          .contact-link:hover { border-color: var(--border-accent) !important; color: var(--text-primary) !important; background: rgba(99,179,237,0.04) !important; }
        `}</style>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "2rem 1.5rem",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
        }}
      >
        <p>
          © {new Date().getFullYear()} Portfolio. Built with{" "}
          <span style={{ color: "var(--accent)" }}>Next.js</span> &{" "}
          <span style={{ color: "var(--accent)" }}>TypeScript</span>.
        </p>
      </footer>
    </>
  );
}