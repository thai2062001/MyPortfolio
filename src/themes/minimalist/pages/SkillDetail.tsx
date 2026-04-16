import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import MinimalistLayout from "../components/MinimalistLayout";
import { useLang } from "@/contexts/LangContext";
import { useQuery } from "@tanstack/react-query";
import { portfolioApi } from "@/core/api/portfolio";
import { supabase } from "@/lib/supabase";

/**
 * Skill Detail Page — "The Architectural Portfolio" Design System
 *
 * Typography scale (all Inter):
 *   label-md  = 0.75rem / 700 / uppercase / +0.05em
 *   title-md  = 1.125rem / 600
 *   headline-lg = 2rem / 700
 *   display-lg = 3.5rem / 800 / -0.02em
 *   body-lg   = 1rem / 400 / 1.6
 *
 * Colors:
 *   #f7f9fb  surface (base)
 *   #f2f4f6  surface-container-low (sections)
 *   #ffffff  surface-container-lowest (cards)
 *   #030813  primary (text, never pure black)
 *   #0057c0  secondary (electric blue — use sparingly)
 *   #c6c6cc  outline-variant (ghost border at 15% opacity)
 *
 * Rules:
 *   - NO 1px solid borders for sections
 *   - Ambient shadow: 0px 20px 40px rgba(25, 28, 30, 0.06)
 *   - Buttons: pill (9999px radius)
 *   - Cards: xl radius (1.5rem), no dividers
 */

export default function MinimalistSkillDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLang();

  const { data: skillData, isLoading } = useQuery({
    queryKey: ["minimalist-skill-full-detail", slug],
    queryFn: async () => {
      if (!slug) return null;
      const skill = await portfolioApi.getSkillBySlug(slug);
      if (!skill) return null;

      const [highlights, applications, tools, projectSkills] = await Promise.all([
        portfolioApi.getSkillHighlights(skill.id),
        portfolioApi.getSkillApplications(skill.id),
        portfolioApi.getSkillTools(skill.id),
        supabase
          .from("project_skills")
          .select("project_id, projects(*, project_categories(*))")
          .eq("skill_id", skill.id)
          .then((res) => res.data || []),
      ]);

      return { skill, highlights, applications, tools, projectSkills };
    },
    enabled: !!slug,
  });

  const skill = skillData?.skill;
  const highlights = skillData?.highlights || [];
  const tools = skillData?.tools || [];
  const projectSkills = skillData?.projectSkills || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  /* ── Loading state ── */
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

  /* ── Not found state ── */
  if (!skill) {
    return (
      <MinimalistLayout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f9fb] gap-8">
          <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.01em" }} className="text-[#030813]">
            Skill not found
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

  const displayName = lang === "vi" && skill.skill_name_vi ? skill.skill_name_vi : skill.skill_name;
  const displayDesc = lang === "vi" && skill.description_vi ? skill.description_vi : (skill.short_description || skill.description);
  const displayOverview = lang === "vi" && skill.overview_vi ? skill.overview_vi : skill.overview;

  /* ─────────────────────────────────────────── */

  return (
    <MinimalistLayout>

      {/* ── HERO — surface (#f7f9fb), Generous Rhythm ── */}
      <section
        className="bg-[#f7f9fb] relative overflow-hidden"
        style={{ paddingTop: "10rem", paddingBottom: "7rem", paddingLeft: "2rem", paddingRight: "2rem" }}
      >
        <div className="max-w-6xl mx-auto">

          {/* Back navigation */}
          <div className="mb-16">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-[#030813]/50 hover:text-[#030813] transition-colors"
              style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
            >
              <ArrowLeft size={14} />
              Back
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* label-md — category chip */}
            {(skill as any).category?.name && (
              <span
                className="inline-block mb-8"
                style={{
                  fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em",
                  textTransform: "uppercase", borderRadius: "9999px",
                  padding: "0.25rem 0.75rem",
                  background: "rgba(0, 87, 192, 0.10)", color: "#0057c0",
                }}
              >
                {(skill as any).category.name}
              </span>
            )}

            {/* display-lg — 3.5rem / 800 / -0.02em */}
            <h1
              className="text-[#030813] mb-10 max-w-3xl"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              {displayName}
            </h1>

            {/* Asymmetric: description offset right */}
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 md:col-start-5 md:col-span-8 lg:col-start-6 lg:col-span-6">
                {/* body-lg */}
                <p style={{ fontSize: "1rem", fontWeight: 400, lineHeight: 1.6 }} className="text-[#030813]/60">
                  {displayDesc}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── METRICS STRIP — surface-container-low (#f2f4f6), no border ── */}
      <section className="bg-[#f2f4f6]" style={{ padding: "4rem 2rem" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Intensity", value: skill.difficulty_level || "Expert" },
            { label: "Mastery", value: skill.experience_level || "Senior" },
            { label: "Instruments", value: `${tools.length}` },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                background: "#ffffff",
                borderRadius: "1.5rem",
                padding: "2rem",
                boxShadow: "0px 20px 40px rgba(25, 28, 30, 0.06)",
              }}
            >
              <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
                className="text-[#030813]/40 mb-3">{m.label}</p>
              <p style={{ fontSize: "1.125rem", fontWeight: 600 }} className="text-[#030813]">{m.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── NARRATIVE — surface (#f7f9fb), asymmetric layout ── */}
      {displayOverview && (
        <section className="bg-[#f7f9fb]" style={{ padding: "7rem 2rem" }}>
          <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8 items-start">
            <div className="col-span-12 md:col-span-3">
              <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
                className="text-[#030813]/40 sticky top-32">
                Overview
              </p>
            </div>
            {/* 60% content, ~10% dead zone, 30% for context */}
            <div className="col-span-12 md:col-span-7">
              <p style={{ fontSize: "1rem", fontWeight: 400, lineHeight: 1.6 }} className="text-[#030813]/70">
                {displayOverview}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── HIGHLIGHTS — surface-container-low (#f2f4f6) ── */}
      {highlights.length > 0 && (
        <section className="bg-[#f2f4f6]" style={{ padding: "7rem 2rem" }}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
                className="text-[#0057c0] mb-4">Key Results</p>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.01em" }} className="text-[#030813]">
                Value Delivered
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map((h: any, i: number) => (
                <div
                  key={i}
                  style={{
                    background: "#ffffff", borderRadius: "1.5rem", padding: "2rem",
                    boxShadow: "0px 20px 40px rgba(25, 28, 30, 0.06)",
                  }}
                >
                  {/* Chip */}
                  <span
                    className="inline-block mb-6"
                    style={{
                      fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em",
                      textTransform: "uppercase", background: "rgba(0,87,192,0.10)",
                      color: "#0057c0", borderRadius: "9999px", padding: "0.25rem 0.75rem",
                    }}
                  >
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 600 }} className="text-[#030813] mb-4">{h.title}</h3>
                  <p style={{ fontSize: "1rem", fontWeight: 400, lineHeight: 1.6 }} className="text-[#030813]/60">{h.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CASE STUDIES — surface (#f7f9fb) ── */}
      {projectSkills.length > 0 && (
        <section className="bg-[#f7f9fb]" style={{ padding: "7rem 2rem" }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-16 gap-8">
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
                  className="text-[#0057c0] mb-4">Portfolio</p>
                <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.01em" }} className="text-[#030813]">
                  Case Studies
                </h2>
              </div>
              <Link
                to="/"
                style={{
                  fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em",
                  textTransform: "uppercase", borderRadius: "9999px",
                  padding: "0.625rem 1.5rem", background: "#0057c0", color: "#fff",
                  flexShrink: 0,
                }}
              >
                View All
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              {projectSkills.map((ps: any) => (
                <Link
                  key={ps.project_id}
                  to={`/project/${ps.projects?.slug}`}
                  className="group flex flex-col md:flex-row md:items-center justify-between"
                  style={{
                    background: "#ffffff", borderRadius: "1.5rem", padding: "2rem",
                    boxShadow: "0px 20px 40px rgba(25, 28, 30, 0.06)",
                    transition: "box-shadow 0.3s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "0px 30px 60px rgba(25, 28, 30, 0.10)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "0px 20px 40px rgba(25, 28, 30, 0.06)")}
                >
                  <div className="flex-1">
                    <span
                      className="inline-block mb-4"
                      style={{
                        fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em",
                        textTransform: "uppercase", background: "rgba(0,87,192,0.10)",
                        color: "#0057c0", borderRadius: "9999px", padding: "0.25rem 0.75rem",
                      }}
                    >
                      {ps.projects?.project_categories?.name || "Project"}
                    </span>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 600 }} className="text-[#030813]">
                      {lang === "vi" && ps.projects?.title_vi ? ps.projects.title_vi : ps.projects?.title}
                    </h3>
                  </div>
                  <ArrowUpRight size={20} className="text-[#0057c0] mt-4 md:mt-0 md:ml-8 opacity-40 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TOOLS — surface-container-low (#f2f4f6) ── */}
      {tools.length > 0 && (
        <section className="bg-[#f2f4f6]" style={{ padding: "7rem 2rem" }}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
                className="text-[#030813]/40 mb-4">Stack</p>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.01em" }} className="text-[#030813]">
                Core Instruments
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tools.map((tool: any, i: number) => (
                <div
                  key={i}
                  style={{
                    background: "#ffffff", borderRadius: "1rem", padding: "1.5rem",
                    boxShadow: "0px 20px 40px rgba(25, 28, 30, 0.06)",
                  }}
                >
                  <h4 style={{ fontSize: "1.125rem", fontWeight: 600 }} className="text-[#030813] mb-2">
                    {tool.tool_name}
                  </h4>
                  {tool.description && (
                    <p style={{ fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.6 }} className="text-[#030813]/50">
                      {tool.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </MinimalistLayout>
  );
}
