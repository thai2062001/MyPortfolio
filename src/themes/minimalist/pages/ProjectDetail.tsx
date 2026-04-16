import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import MinimalistLayout from "../components/MinimalistLayout";
import { useLang } from "@/contexts/LangContext";
import { useProjectDetails, useProjects } from "@/core/hooks/usePortfolio";

/**
 * Project Detail Page — "The Architectural Portfolio" Design System
 * Same tokens as SkillDetail — see SkillDetail.tsx header for full reference.
 */

export default function MinimalistProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLang();

  const { data: project, isLoading } = useProjectDetails(slug!);
  const { data: allProjects } = useProjects();

  const relatedProjects = useMemo(() => {
    if (!allProjects || !project) return [];
    return allProjects.filter((p) => p.id !== project.id && p.is_published).slice(0, 2);
  }, [allProjects, project]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <MinimalistLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
            className="text-[#0057c0] animate-pulse">
            Loading...
          </p>
        </div>
      </MinimalistLayout>
    );
  }

  if (!project) {
    return (
      <MinimalistLayout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f9fb] gap-8">
          <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.01em" }} className="text-[#030813]">
            Project not found
          </h1>
          <Link
            to="/"
            style={{
              fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em",
              textTransform: "uppercase", borderRadius: "9999px",
              padding: "0.75rem 1.75rem", background: "#030813", color: "#fff",
            }}
          >
            Back to Home
          </Link>
        </div>
      </MinimalistLayout>
    );
  }

  const testimonial = project.project_testimonials?.[0];

  return (
    <MinimalistLayout>

      {/* ── HERO — surface (#f7f9fb) ── */}
      <section
        className="bg-[#f7f9fb] relative overflow-hidden"
        style={{ paddingTop: "10rem", paddingBottom: "7rem", paddingLeft: "2rem", paddingRight: "2rem" }}
      >
        <div className="max-w-6xl mx-auto">

          {/* Back */}
          <div className="mb-16">
            <Link to="/" className="inline-flex items-center gap-3 text-[#030813]/50 hover:text-[#030813] transition-colors"
              style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              <ArrowLeft size={14} /> Back
            </Link>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>

            {/* Category chip */}
            {project.project_categories?.name && (
              <span className="inline-block mb-8" style={{
                fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em",
                textTransform: "uppercase", borderRadius: "9999px",
                padding: "0.25rem 0.75rem",
                background: "rgba(0, 87, 192, 0.10)", color: "#0057c0",
              }}>
                {project.project_categories.name}
              </span>
            )}

            {/* display-lg*/}
            <h1 className="text-[#030813] mb-10 max-w-3xl"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              {lang === "vi" && project.title_vi ? project.title_vi : project.title}
            </h1>

            {/* Metadata — NO borders, background-shifted grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[
                { label: "Client", value: project.client || "Internal" },
                { label: "Year", value: project.year || "2024" },
                { label: "Role", value: project.role || "Lead" },
                { label: "Type", value: project.project_categories?.name || "—" },
              ].map((m, i) => (
                <div key={i} style={{
                  background: "#f2f4f6", borderRadius: "1rem", padding: "1.25rem 1.5rem",
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
                    className="text-[#030813]/40 mb-1">{m.label}</p>
                  <p style={{ fontSize: "1.125rem", fontWeight: 600 }} className="text-[#030813]">{m.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── COVER IMAGE — surface-container-low ── */}
      {project.cover_image_url && (
        <section className="bg-[#f2f4f6]" style={{ padding: "3rem 2rem" }}>
          <div className="max-w-6xl mx-auto">
            <div style={{ borderRadius: "1.5rem", overflow: "hidden", aspectRatio: "16/9" }}>
              <img src={project.cover_image_url} alt="Cover"
                className="w-full h-full object-cover grayscale brightness-95 hover:grayscale-0 transition-all duration-1000" />
            </div>
          </div>
        </section>
      )}

      {/* ── OVERVIEW — surface, asymmetric layout ── */}
      <section className="bg-[#f7f9fb]" style={{ padding: "7rem 2rem" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 md:col-span-3">
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
              className="text-[#030813]/40 sticky top-32">Overview</p>
          </div>
          <div className="col-span-12 md:col-span-7">
            <p style={{ fontSize: "1rem", fontWeight: 400, lineHeight: 1.6 }} className="text-[#030813]/70">
              {lang === "vi" && project.overview_vi ? project.overview_vi : project.overview || project.short_description}
            </p>
          </div>
        </div>
      </section>

      {/* ── METRICS — surface-container-low (#f2f4f6), dark panel ── */}
      {project.project_results && project.project_results.length > 0 && (
        <section style={{ background: "#030813", padding: "7rem 2rem" }}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
                className="text-white/40 mb-4">Impact</p>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.01em" }} className="text-white">
                Measurable Outcomes
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {project.project_results.map((res: any, idx: number) => (
                <div key={idx} style={{
                  background: "rgba(198, 198, 204, 0.08)", borderRadius: "1.5rem",
                  padding: "2rem", border: "1px solid rgba(198, 198, 204, 0.15)",
                }}>
                  <p style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}
                    className="text-[#0057c0] mb-3">{res.value}</p>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
                    className="text-white/50">{res.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CHALLENGE & SOLUTION — surface, asymmetric ── */}
      {(project.challenge || project.solution) && (
        <section className="bg-[#f7f9fb]" style={{ padding: "7rem 2rem" }}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {project.challenge && (
              <div style={{ background: "#f2f4f6", borderRadius: "1.5rem", padding: "3rem" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
                  className="text-[#0057c0] mb-6">01 · Challenge</p>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 600 }} className="text-[#030813] mb-6">The Problem</h3>
                <p style={{ fontSize: "1rem", fontWeight: 400, lineHeight: 1.6 }} className="text-[#030813]/70">
                  {lang === "vi" && project.challenge_vi ? project.challenge_vi : project.challenge}
                </p>
              </div>
            )}
            {project.solution && (
              <div style={{ background: "#ffffff", borderRadius: "1.5rem", padding: "3rem",
                boxShadow: "0px 20px 40px rgba(25, 28, 30, 0.06)" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
                  className="text-[#0057c0] mb-6">02 · Solution</p>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 600 }} className="text-[#030813] mb-6">The Resolution</h3>
                <p style={{ fontSize: "1rem", fontWeight: 400, lineHeight: 1.6 }} className="text-[#030813]/70">
                  {lang === "vi" && project.solution_vi ? project.solution_vi : project.solution}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── TESTIMONIAL — surface-container-low ── */}
      {testimonial && (
        <section className="bg-[#f2f4f6]" style={{ padding: "7rem 2rem" }}>
          <div className="max-w-3xl mx-auto text-center">
            <blockquote style={{ fontSize: "clamp(1.25rem, 3vw, 2rem)", fontWeight: 400, lineHeight: 1.4,
              color: "#030813", marginBottom: "3rem", letterSpacing: "-0.01em" }}>
              "{lang === "vi" && testimonial.quote_vi ? testimonial.quote_vi : testimonial.quote}"
            </blockquote>
            <div style={{ width: "3rem", height: "2px", background: "#0057c0", margin: "0 auto 1.5rem" }} />
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
              className="text-[#030813]">{testimonial.author_name}</p>
            {testimonial.author_title && (
              <p style={{ fontSize: "0.75rem", fontWeight: 400, letterSpacing: "0.02em" }}
                className="text-[#030813]/50 mt-1">{testimonial.author_title}</p>
            )}
          </div>
        </section>
      )}

      {/* ── RELATED PROJECTS — surface ── */}
      {relatedProjects.length > 0 && (
        <section className="bg-[#f7f9fb]" style={{ padding: "7rem 2rem" }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-16 gap-8">
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
                  className="text-[#0057c0] mb-4">Continue Exploring</p>
                <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.01em" }} className="text-[#030813]">
                  Related Work
                </h2>
              </div>
              <Link to="/" style={{
                fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
                borderRadius: "9999px", padding: "0.625rem 1.5rem",
                background: "#030813", color: "#fff", flexShrink: 0,
              }}>View All</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProjects.map((p) => (
                <Link key={p.id} to={`/project/${p.slug}`}
                  className="group flex flex-col justify-between"
                  style={{
                    background: "#ffffff", borderRadius: "1.5rem", padding: "2.5rem",
                    boxShadow: "0px 20px 40px rgba(25, 28, 30, 0.06)",
                    minHeight: "300px", transition: "box-shadow 0.3s ease", textDecoration: "none",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "0px 30px 60px rgba(25, 28, 30, 0.10)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "0px 20px 40px rgba(25, 28, 30, 0.06)")}
                >
                  <div>
                    {p.project_categories?.name && (
                      <span className="inline-block mb-6" style={{
                        fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
                        background: "rgba(0,87,192,0.10)", color: "#0057c0", borderRadius: "9999px", padding: "0.25rem 0.75rem",
                      }}>{p.project_categories.name}</span>
                    )}
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.4 }} className="text-[#030813]">
                      {lang === "vi" && p.title_vi ? p.title_vi : p.title}
                    </h3>
                  </div>
                  <div className="flex justify-end">
                    <ArrowUpRight size={24} className="text-[#0057c0] opacity-30 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </MinimalistLayout>
  );
}
