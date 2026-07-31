import type { IconType } from "react-icons";
import {
  SiDart, SiFlutter, SiTypescript, SiJavascript, SiDotnet, SiNextdotjs,
  SiBlazor, SiLaravel, SiFlask, SiDjango, SiPostgresql, SiMysql,
  SiGithubactions, SiGit, SiFastlane,
} from "react-icons/si";
import { FaJava, FaVuejs, FaPhp, FaPython, FaDocker, FaReact } from "react-icons/fa";
import { BiLogoSpringBoot } from "react-icons/bi";
import { TbBrandCSharp } from "react-icons/tb";

export type Project = {
  name: string;
  status: string;
  badge: "dev" | "ship" | "cap";
  role: string;
  desc: string;
  tags: string[];
  glyph?: string;
  glyphColor?: string;
  grad?: string;
  images?: string[];
  link?: string;
};

export const projects: Project[] = [
  {
    name: "Resume Fit Checker",
    status: "SHIPPED",
    badge: "ship",
    role: "Solo build — RAG pipeline + full-stack",
    desc: "Grounded, citation-backed resume-vs-job-description fit checker — retrieves evidence per requirement from an embedded resume and scores match/partial/gap via Gemini, citing exact quotes instead of inventing a match.",
    tags: ["Next.js", "Vercel AI SDK", "Gemini", "TypeScript", "Drizzle", "PostgreSQL", "Clerk", "RAG"],
    glyph: "FIT",
    glyphColor: "#22d3ee",
    grad: "linear-gradient(135deg,#0a2a30,#0a0d14)",
    link: "https://resume-fit-checker.vercel.app",
  },
  {
    name: "ActiveOne Field Sales",
    status: "IN DEV",
    badge: "dev",
    role: "Sole developer",
    desc: "Greenfield field-sales mobile app for an enterprise ERP — building it from scratch in Flutter to replace a legacy Delphi mobile app. Confidential, in active development.",
    tags: ["Flutter", "Dart", "Bloc", "GitHub Actions", "Fastlane"],
    glyph: "\u{1F512}",
    glyphColor: "#4ade80",
    grad: "linear-gradient(135deg,#0f2318,#0a0d14)",
  },
  {
    name: "ActiveWork",
    status: "IN DEV",
    badge: "dev",
    role: "Primary dev, web client",
    desc: "Enterprise payroll / HRMS platform. Built the web client and contributed across the .NET backend and the Next.js / React frontend migration. Confidential.",
    tags: ["Blazor", ".NET", "Next.js", "PostgreSQL", "Docker"],
    glyph: "\u{1F512}",
    glyphColor: "#bb9af7",
    grad: "linear-gradient(135deg,#1a1630,#0a0d14)",
  },
  {
    name: "ServePOS",
    status: "SHIPPED",
    badge: "ship",
    role: "Feature dev + release automation",
    desc: "BIR-compliant mobile point-of-sale, in production with pilot clients. Contributed Flutter features and owned the mobile release pipeline (Fastlane, TestFlight).",
    tags: ["Flutter", "Dart", "Bloc"],
    glyph: "POS",
    glyphColor: "#22d3ee",
    grad: "linear-gradient(135deg,#07231f,#0a0d14)",
  },
  {
    name: "Restaurant Ordering System",
    status: "CAPSTONE",
    badge: "cap",
    role: "Full-stack + AI integration",
    desc: "Mobile + web ordering with real-time menu translation via the OpenAI API. Flutter app and Laravel backend, with a MySQL schema for catalog and translations.",
    tags: ["Flutter", "Laravel", "OpenAI", "MySQL"],
    images: ["/homepage.jpg", "/homepage2.jpg", "/productpage.jpg"],
  },
];

export type Job = { role: string; company: string; dates: string; desc: string };

export const experience: Job[] = [
  {
    role: "Software Engineer (Full-Stack)",
    company: "ActiveSystems Software Inc.",
    dates: "Jan 2025 — Present",
    desc: "Sole developer on a greenfield Flutter field-sales app replacing a legacy Delphi mobile app. Earlier, primary developer of a payroll/HRMS web client (Blazor/.NET), plus backend features and a Next.js migration. Set up mobile release pipelines and Docker deploys.",
  },
  {
    role: "Full-Stack Developer",
    company: "Apollo Technologies, Inc.",
    dates: "Jul 2024 — Dec 2024",
    desc: "Owned a Vue/Quasar reskin of a telecom billing system and built a Flutter mobile app (Bloc) for a client ISP. Improved a Spring Boot service; collaborated on a Flask API and a KillBill integration.",
  },
  {
    role: "Full-Stack Developer Intern",
    company: "NHTS Dept., DSWD",
    dates: "Nov 2023 — Feb 2024",
    desc: "Built a request-document management system for DSWD Region XI with SMS/email notifications and cloud storage, in Laravel — including deployment and QA.",
  },
  {
    role: "Back-End Developer Intern",
    company: "Next BPO Solutions, Inc.",
    dates: "Jul 2023 — Oct 2023",
    desc: "First industry role — built a back-end employee module with REST API endpoints for the company's internal system.",
  },
];

export type Skill = { name: string; Icon: IconType; color: string };

export const skills: Skill[] = [
  { name: "Dart", Icon: SiDart, color: "#0175C2" },
  { name: "Flutter", Icon: SiFlutter, color: "#02569B" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "JavaScript", Icon: SiJavascript, color: "#E8B800" },
  { name: "C#", Icon: TbBrandCSharp, color: "#9B4F96" },
  { name: ".NET Core", Icon: SiDotnet, color: "#512BD4" },
  { name: "React", Icon: FaReact, color: "#0EA5C7" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#0a0d14" },
  { name: "Vue / Quasar", Icon: FaVuejs, color: "#42B883" },
  { name: "Blazor", Icon: SiBlazor, color: "#5C2D91" },
  { name: "Laravel", Icon: SiLaravel, color: "#FF2D20" },
  { name: "PHP", Icon: FaPhp, color: "#777BB4" },
  { name: "Python", Icon: FaPython, color: "#3776AB" },
  { name: "Java", Icon: FaJava, color: "#E76F00" },
  { name: "Spring Boot", Icon: BiLogoSpringBoot, color: "#6DB33F" },
  { name: "Flask", Icon: SiFlask, color: "#0a0d14" },
  { name: "Django", Icon: SiDjango, color: "#0C4B33" },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
  { name: "MySQL", Icon: SiMysql, color: "#00758F" },
  { name: "Docker", Icon: FaDocker, color: "#2496ED" },
  { name: "GitHub Actions", Icon: SiGithubactions, color: "#2088FF" },
  { name: "Fastlane", Icon: SiFastlane, color: "#22A45B" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
];
