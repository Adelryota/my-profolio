"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ── */
interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  techStack: "",
  githubUrl: "",
  liveUrl: "",
  imageUrl: "",
};

/* ── Input Component ── */
function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  const base: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "0.65rem 0.9rem",
    color: "var(--text-primary)",
    fontSize: "0.9rem",
    outline: "none",
    width: "100%",
    resize: "vertical" as const,
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </label>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={base}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={base}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      )}
    </div>
  );
}

/* ── Dashboard Page ── */
export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  /* Fetch projects */
  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch {
      showToast("Failed to load projects", false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProjects(); }, []);

  /* Toast helper */
  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  /* Logout */
  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" }).catch(() => {});
    document.cookie = "auth-token=; Max-Age=0; path=/";
    router.push("/admin/login");
  }

  /* Open form for add or edit */
  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(p: Project) {
    setEditingId(p._id);
    setForm({
      title: p.title,
      description: p.description,
      techStack: p.techStack.join(", "),
      githubUrl: p.githubUrl ?? "",
      liveUrl: p.liveUrl ?? "",
      imageUrl: p.imageUrl ?? "",
    });
    setShowForm(true);
  }

  /* Save (create or update) */
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    setSaving(true);

    const payload = {
      ...form,
      techStack: form.techStack.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(editingId ? "Project updated ✓" : "Project created ✓", true);
        setShowForm(false);
        fetchProjects();
      } else {
        const d = await res.json();
        showToast(d.error ?? "Failed to save", false);
      }
    } catch {
      showToast("Network error", false);
    } finally {
      setSaving(false);
    }
  }

  /* Delete */
  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Project deleted", true);
        setProjects((prev) => prev.filter((p) => p._id !== id));
      } else {
        showToast("Failed to delete", false);
      }
    } catch {
      showToast("Network error", false);
    } finally {
      setDeletingId(null);
    }
  }

  /* ── Render ── */
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>

      {/* ── Top Bar ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid var(--border)",
          background: "rgba(8,12,20,0.9)",
          backdropFilter: "blur(12px)",
          padding: "0 2rem",
          height: "4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a
            href="/"
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              background: "var(--gradient-hero)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Portofolio
          </a>
          <span style={{ color: "var(--border)", fontSize: "1.2rem" }}>|</span>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 500 }}>Admin Dashboard</span>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openAdd}
            style={{
              padding: "0.45rem 1.1rem",
              background: "var(--gradient-hero)",
              border: "none",
              borderRadius: "7px",
              color: "#fff",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            + Add Project
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            style={{
              padding: "0.45rem 1rem",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "7px",
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Logout
          </motion.button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
          {[
            { label: "Total Projects", value: projects.length, icon: "📁" },
            { label: "With Live URL", value: projects.filter((p) => p.liveUrl).length, icon: "🌐" },
            { label: "With GitHub", value: projects.filter((p) => p.githubUrl).length, icon: "🐙" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "1.5rem" }}>{stat.icon}</span>
              <div>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Projects Table */}
        <div className="glass-card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Projects</h2>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{projects.length} total</span>
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
          ) : projects.length === 0 ? (
            <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📭</div>
              <p style={{ color: "var(--text-secondary)" }}>No projects yet.</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.4rem" }}>Click "Add Project" to get started.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Title", "Tech Stack", "Links", "Actions"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "0.75rem 1.25rem",
                          textAlign: "left",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p, i) => (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      {/* Title + description */}
                      <td style={{ padding: "1rem 1.25rem", maxWidth: 260 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.2rem" }}>{p.title}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 240 }}>
                          {p.description}
                        </div>
                      </td>

                      {/* Tech stack pills */}
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                          {p.techStack.slice(0, 4).map((t) => (
                            <span
                              key={t}
                              style={{
                                padding: "0.15rem 0.5rem",
                                background: "rgba(99,179,237,0.08)",
                                border: "1px solid rgba(99,179,237,0.15)",
                                borderRadius: "4px",
                                fontSize: "0.72rem",
                                color: "var(--accent)",
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {t}
                            </span>
                          ))}
                          {p.techStack.length > 4 && (
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", alignSelf: "center" }}>
                              +{p.techStack.length - 4}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Links */}
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          {p.githubUrl && (
                            <a href={p.githubUrl} target="_blank" rel="noreferrer"
                              style={{ fontSize: "0.78rem", color: "var(--accent)", padding: "0.2rem 0.5rem", border: "1px solid var(--border)", borderRadius: "4px" }}>
                              GitHub
                            </a>
                          )}
                          {p.liveUrl && (
                            <a href={p.liveUrl} target="_blank" rel="noreferrer"
                              style={{ fontSize: "0.78rem", color: "var(--accent)", padding: "0.2rem 0.5rem", border: "1px solid var(--border)", borderRadius: "4px" }}>
                              Live
                            </a>
                          )}
                          {!p.githubUrl && !p.liveUrl && (
                            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>—</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => openEdit(p)}
                            style={{
                              padding: "0.35rem 0.8rem",
                              background: "rgba(99,179,237,0.08)",
                              border: "1px solid rgba(99,179,237,0.15)",
                              borderRadius: "6px",
                              color: "var(--accent)",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "background 0.2s",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            disabled={deletingId === p._id}
                            style={{
                              padding: "0.35rem 0.8rem",
                              background: "rgba(252,68,86,0.07)",
                              border: "1px solid rgba(252,68,86,0.15)",
                              borderRadius: "6px",
                              color: "#fc4456",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              cursor: deletingId === p._id ? "not-allowed" : "pointer",
                              opacity: deletingId === p._id ? 0.5 : 1,
                            }}
                          >
                            {deletingId === p._id ? "…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Add/Edit Modal ── */}
      <AnimatePresence>
        {showForm && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
                zIndex: 200,
              }}
            />

            {/* Centering wrapper — flex centers, motion.div only animates */}
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 201,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25 }}
              style={{
                pointerEvents: "auto",
                width: "min(560px, calc(100vw - 2rem))",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "var(--bg-card)",
                border: "1px solid var(--border-accent)",
                borderRadius: "1.25rem",
                padding: "2rem",
                boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                  {editingId ? "Edit Project" : "Add New Project"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.3rem", lineHeight: 1, padding: "0.25rem" }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Field label="Title *" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} placeholder="My Awesome Project" />
                <Field label="Description *" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} placeholder="A brief description of what you built…" textarea />
                <Field label="Tech Stack (comma-separated)" value={form.techStack} onChange={(v) => setForm((f) => ({ ...f, techStack: v }))} placeholder="React, Node.js, MongoDB" />
                <Field label="GitHub URL" value={form.githubUrl} onChange={(v) => setForm((f) => ({ ...f, githubUrl: v }))} placeholder="https://github.com/you/project" />
                <Field label="Live URL" value={form.liveUrl} onChange={(v) => setForm((f) => ({ ...f, liveUrl: v }))} placeholder="https://myproject.com" />
                <Field label="Image URL (optional)" value={form.imageUrl} onChange={(v) => setForm((f) => ({ ...f, imageUrl: v }))} placeholder="https://..." />

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      background: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--text-secondary)",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={!saving ? { scale: 1.02 } : {}}
                    whileTap={!saving ? { scale: 0.98 } : {}}
                    style={{
                      flex: 2,
                      padding: "0.75rem",
                      background: saving ? "rgba(99,179,237,0.3)" : "var(--gradient-hero)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      cursor: saving ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {saving ? (
                      <>
                        <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                        Saving…
                      </>
                    ) : (
                      editingId ? "Save Changes" : "Create Project"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            style={{
              position: "fixed",
              bottom: "1.5rem",
              right: "1.5rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "10px",
              background: toast.ok ? "rgba(72,199,142,0.12)" : "rgba(252,68,86,0.12)",
              border: `1px solid ${toast.ok ? "rgba(72,199,142,0.3)" : "rgba(252,68,86,0.3)"}`,
              color: toast.ok ? "#48c78e" : "#fc4456",
              fontSize: "0.875rem",
              fontWeight: 600,
              zIndex: 300,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <span>{toast.ok ? "✓" : "✕"}</span>
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
