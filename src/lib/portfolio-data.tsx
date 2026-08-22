import type { IconType } from "react-icons";
import {
  SiDart, SiFlutter, SiTypescript, SiJavascript, SiDotnet, SiNextdotjs,
  SiBlazor, SiLaravel, SiFlask, SiDjango, SiPostgresql, SiMysql,
  SiGithubactions, SiGit, SiFastlane,
} from "react-icons/si";
import { FaJava, FaVuejs, FaPhp, FaPython, FaDocker, FaReact } from "react-icons/fa";
import { BiLogoSpringBoot } from "react-icons/bi";
import { TbBrandCSharp } from "react-icons/tb";

export type TermLine = [text: string, cls?: "p" | "out" | "warn" | "ok" | "dim"];

export type Project = {
  name: string;
  /** Which grid tab the card lives in: paid production work vs. self-directed builds. */
  kind: "work" | "personal";
  status: string;
  badge: "dev" | "ship" | "cap";
  role: string;
  desc: string;
  tags: string[];
  glyph?: string;
  glyphColor?: string;
  grad?: string;
  images?: string[];
  imagesLabel?: string;
  terminal?: { title: string; lines: TermLine[] };
  link?: string;
  locked?: boolean;
  /** Built from scratch vs. joined an existing system — job-posting-style disclosure. */
  origin?: string;
  /** Specific tasks owned on this project, for cards with no live demo/screenshots to speak for themselves. */
  responsibilities?: string[];
};

export const projects: Project[] = [
  {
    name: "Groundtruth",
    kind: "personal",
    status: "SHIPPED",
    badge: "ship",
    role: "Solo build — RAG pipeline + full-stack",
    desc: "Grounded, citation-backed resume-vs-job-description fit checker — retrieves evidence per requirement from an embedded resume and scores match/partial/gap via Gemini, citing exact quotes instead of inventing a match.",
    tags: ["Next.js", "Vercel AI SDK", "Gemini", "TypeScript", "Drizzle", "PostgreSQL", "Clerk", "RAG"],
    glyph: "GT",
    glyphColor: "#34d399",
    grad: "linear-gradient(135deg,#0b1f16,#0a0d14)",
    link: "https://resume-fit-checker.vercel.app",
    images: ["/groundtruth-landing.png", "/groundtruth-filled.png"],
  },
  {
    name: "Destiny 2 MCP Server",
    kind: "personal",
    status: "SHIPPED",
    badge: "ship",
    role: "Solo build — MCP server + Bungie API",
    desc: "An MCP server that connects AI assistants directly to Bungie's Destiny 2 API — search your inventory, equip or transfer gear across characters, and reason about loadouts and theorycrafting, straight from chat. Hosted remotely with OAuth — add it by URL, no local install or API key needed.",
    tags: ["MCP", "TypeScript", "Node.js", "Express", "Bungie API", "OAuth"],
    glyph: "D2",
    glyphColor: "#f5a623",
    grad: "linear-gradient(135deg,#2a1f0a,#0a0d14)",
    imagesLabel: "View install →",
    terminal: {
      title: "guest@mark-ramos: ~/destiny2-mcp",
      lines: [
        ["$ claude mcp add --transport http destiny2 https://destiny2-mcp.onrender.com/mcp", "p"],
        ["✓ added — no clone, no local install, no API key of your own", "ok"],
        ["", "out"],
        ["# or, any MCP client that takes raw JSON (Claude Desktop, etc.)", "dim"],
        ["{", "out"],
        ['  "mcpServers": {', "out"],
        ['    "destiny2": { "url": "https://destiny2-mcp.onrender.com/mcp" }', "out"],
        ["  }", "out"],
        ["}", "out"],
        ["", "out"],
        ["# first tool call opens a Bungie sign-in page —", "dim"],
        ["# grants access to your own account only, nothing shared", "dim"],
      ],
    },
  },
  {
    name: "ActiveOne Field Sales",
    kind: "work",
    status: "CONFIDENTIAL",
    badge: "dev",
    role: "Sole developer",
    desc: "Greenfield field-sales mobile app for an enterprise ERP — building it from scratch in Flutter to replace a legacy Delphi mobile app. Confidential, in active development.",
    tags: ["Flutter", "Dart", "Bloc", "GitHub Actions", "Fastlane"],
    glyphColor: "#4ade80",
    grad: "linear-gradient(135deg,#0f2318,#0a0d14)",
    locked: true,
    origin: "Built from scratch — new app, replacing a legacy Delphi mobile client",
    responsibilities: [
      "Sole developer: own architecture, features, and delivery end to end",
      "Building the Flutter/Dart app from the ground up with Bloc state management",
      "Defining the API integration against the existing ERP backend",
      "Set up the mobile CI/CD pipeline — GitHub Actions + Fastlane — plus Docker deploys for supporting services",
    ],
  },
  {
    name: "ActiveWork",
    kind: "work",
    status: "CONFIDENTIAL",
    badge: "dev",
    role: "Primary dev, web client",
    desc: "Enterprise payroll / HRMS platform. Built the web client and contributed across the .NET backend and the Next.js / React frontend migration. Confidential.",
    tags: ["Blazor", ".NET", "Next.js", "PostgreSQL", "Docker"],
    glyphColor: "#bb9af7",
    grad: "linear-gradient(135deg,#1a1630,#0a0d14)",
    locked: true,
    origin: "Existing system — joined a live enterprise payroll/HRMS platform",
    responsibilities: [
      "Primary developer of the Blazor web client, end to end",
      "Shipped features on the .NET backend (API endpoints, business logic)",
      "Working on migrating the frontend from Blazor to Next.js/React",
      "Schema and integration work against PostgreSQL, deployed via Docker",
    ],
  },
  {
    name: "ServePOS",
    kind: "work",
    status: "CONFIDENTIAL",
    badge: "dev",
    role: "Feature dev + release automation",
    desc: "BIR-compliant mobile point-of-sale, in pilot testing with clients. Contributed Flutter features and owned the mobile release pipeline (Fastlane, TestFlight).",
    tags: ["Flutter", "Dart", "Bloc"],
    glyph: "POS",
    glyphColor: "#22d3ee",
    grad: "linear-gradient(135deg,#07231f,#0a0d14)",
    origin: "Existing system — joined mid-build, now in client pilot",
    responsibilities: [
      "Built Flutter features (Bloc) for the BIR-compliant POS flow",
      "Owned the mobile release pipeline: Fastlane automation to TestFlight",
      "Supporting pilot rollout and client feedback fixes",
    ],
  },
  {
    name: "Code Party",
    kind: "personal",
    status: "IN PROGRESS",
    badge: "dev",
    role: "Solo build — real-time multiplayer + LLM judging",
    desc: "A skribbl.io-style party game for programmers — a room of players races a shared timer, submits work, and gets judged each round. UI Speedbuild has players building a live HTML/CSS/JS snippet against a prompt with a sandboxed live preview, then voting on each other's submissions; System Design has them writing an architecture answer that's scored by an LLM against a fixed rubric. Server-owned timers and full-resync reconnect via a PartyKit room server over WebSockets.",
    tags: ["Next.js", "PartyKit", "WebSockets", "TypeScript", "Gemini", "CodeMirror"],
    glyphColor: "#4ade80",
    grad: "linear-gradient(135deg,#0f2318,#0a0d14)",
    images: ["/code-party-coding.png", "/code-party-reveal.png", "/code-party-landing.png"],
  },
  {
    name: "Restaurant Ordering System",
    kind: "personal",
    status: "CAPSTONE",
    badge: "cap",
    role: "Full-stack + AI integration",
    desc: "Mobile + web ordering with real-time menu translation via the OpenAI API. Flutter app and Laravel backend, with a MySQL schema for catalog and translations.",
    tags: ["Flutter", "Laravel", "OpenAI", "MySQL"],
    images: ["/homepage.jpg", "/homepage2.jpg", "/productpage.jpg"],
  },
];

/** The lenses the Experience filter offers. Each highlight declares which it belongs to. */
export type Lens = "flutter" | "dotnet" | "web" | "backend" | "ops";

export const LENSES: { key: Lens; label: string; tags: string[] }[] = [
  { key: "flutter", label: "Flutter", tags: ["Flutter", "Dart", "Bloc"] },
  { key: "dotnet", label: ".NET / Blazor", tags: ["Blazor", ".NET"] },
  { key: "web", label: "Next.js / Vue", tags: ["Next.js", "Vue", "Quasar"] },
  { key: "backend", label: "Laravel / APIs", tags: ["Laravel", "PHP", "Flask", "Spring Boot", "KillBill"] },
  { key: "ops", label: "CI/CD", tags: ["Docker", "GitHub Actions", "Fastlane"] },
];

export type Highlight = {
  /** Bolded opening phrase — the ownership claim, so it survives a skim. */
  lead?: string;
  text: string;
  tech?: Lens[];
};

export type Job = {
  role: string;
  company: string;
  /** YYYY-MM. Duration is computed from these, so "20 months" can't go stale. */
  start: string;
  /** YYYY-MM, omitted while the role is current. */
  end?: string;
  internship?: boolean;
  /** Distinct products owned in this role, when it's more than one. */
  products?: number;
  /** One-line summary. Not rendered — the highlights carry the content; kept for reuse. */
  desc: string;
  /** Specific tasks owned in this role — what the job-posting "responsibilities" line expects. */
  highlights?: Highlight[];
  /** Technologies/frameworks used in this role. */
  tags?: string[];
};

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parse(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return { y, m: m - 1 };
}

/** Inclusive, the way LinkedIn counts: May–Aug 2023 is 4 months, not 3. */
export function monthsIn(job: Job, now = new Date()) {
  const a = parse(job.start);
  const b = job.end ? parse(job.end) : { y: now.getFullYear(), m: now.getMonth() };
  return (b.y - a.y) * 12 + (b.m - a.m) + 1;
}

/** "Jan 2025 — now", "Jul — Dec 2024" (year stated once), "Oct 2023 — Feb 2024". */
export function formatRange(job: Job) {
  const a = parse(job.start);
  if (!job.end) return `${MONTH[a.m]} ${a.y} — now`;
  const b = parse(job.end);
  return a.y === b.y
    ? `${MONTH[a.m]} — ${MONTH[b.m]} ${b.y}`
    : `${MONTH[a.m]} ${a.y} — ${MONTH[b.m]} ${b.y}`;
}

export const experience: Job[] = [
  {
    role: "Software Engineer, Full-Stack",
    company: "ActiveSystems Software Inc.",
    start: "2025-01",
    products: 4,
    desc: "Sole developer on a greenfield Flutter field-sales app replacing a legacy Delphi mobile app. Earlier, primary developer of a payroll/HRMS web client (Blazor/.NET), plus backend features and a Next.js migration.",
    highlights: [
      {
        lead: "Sole developer",
        text: "on a greenfield Flutter field-sales app replacing a legacy Delphi client — architecture through release.",
        tech: ["flutter"],
      },
      {
        lead: "Primary developer",
        text: "of the Blazor payroll/HRMS web client; shipped .NET backend features and the Next.js migration.",
        tech: ["dotnet", "web"],
      },
      {
        text: "Owns the mobile CI/CD pipeline — GitHub Actions, Fastlane, TestFlight — plus Docker deploys for supporting services.",
        tech: ["ops"],
      },
    ],
    tags: ["Flutter", "Dart", "Bloc", "Blazor", ".NET", "Next.js", "PostgreSQL", "Docker", "GitHub Actions", "Fastlane"],
  },
  {
    role: "Full-Stack Developer",
    company: "Apollo Technologies, Inc.",
    start: "2024-07",
    end: "2024-12",
    desc: "Owned a Vue/Quasar reskin of a telecom billing system and built a Flutter mobile app (Bloc) for a client ISP.",
    highlights: [
      {
        lead: "Owned",
        text: "a Vue/Quasar reskin of a live telecom billing system.",
        tech: ["web"],
      },
      {
        text: "Built a Flutter loyalty/WiFi app from scratch for a client ISP, integrating a legacy provisioning system that returned scraped HTML.",
        tech: ["flutter"],
      },
      {
        text: "Collaborated on the Flask API layer and a KillBill subscription-billing integration.",
        tech: ["backend"],
      },
    ],
    tags: ["Vue", "Quasar", "Flutter", "Bloc", "Spring Boot", "Flask", "KillBill"],
  },
  {
    role: "Full-Stack Developer Intern",
    company: "NHTS Dept., DSWD",
    start: "2023-10",
    end: "2024-02",
    internship: true,
    desc: "Built a request-document management system for DSWD Region XI, in Laravel — including deployment and QA.",
    highlights: [
      {
        lead: "Led the intern team",
        text: "across front-end and back-end on a document-request system for DSWD Region XI, built from scratch in Laravel.",
        tech: ["backend", "web"],
      },
      {
        text: "Added SMS/email notifications and cloud storage for uploads; owned deployment and QA.",
        tech: ["backend", "ops"],
      },
    ],
    tags: ["Laravel", "PHP"],
  },
  {
    role: "Back-End Developer Intern",
    company: "Next BPO Solutions, Inc.",
    start: "2023-05",
    end: "2023-08",
    internship: true,
    desc: "First industry role — built a back-end employee module with REST API endpoints for the company's internal system.",
    highlights: [
      {
        lead: "Led the back-end",
        text: "of the internship team in my first industry role — employee-module REST endpoints and ERD design.",
        tech: ["backend"],
      },
    ],
  },
];

export type Skill = { name: string; Icon: IconType; color: string };
export type SkillGroup = { label: string; items: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      { name: "Dart", Icon: SiDart, color: "#0175C2" },
      { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
      { name: "JavaScript", Icon: SiJavascript, color: "#E8B800" },
      { name: "C#", Icon: TbBrandCSharp, color: "#9B4F96" },
      { name: "PHP", Icon: FaPhp, color: "#777BB4" },
      { name: "Python", Icon: FaPython, color: "#3776AB" },
      { name: "Java", Icon: FaJava, color: "#E76F00" },
    ],
  },
  {
    label: "Frontend & Mobile",
    items: [
      { name: "Flutter", Icon: SiFlutter, color: "#02569B" },
      { name: "React", Icon: FaReact, color: "#0EA5C7" },
      { name: "Next.js", Icon: SiNextdotjs, color: "#0a0d14" },
      { name: "Vue / Quasar", Icon: FaVuejs, color: "#42B883" },
      { name: "Blazor", Icon: SiBlazor, color: "#5C2D91" },
    ],
  },
  {
    label: "Backend",
    items: [
      { name: ".NET Core", Icon: SiDotnet, color: "#512BD4" },
      { name: "Laravel", Icon: SiLaravel, color: "#FF2D20" },
      { name: "Spring Boot", Icon: BiLogoSpringBoot, color: "#6DB33F" },
      { name: "Flask", Icon: SiFlask, color: "#0a0d14" },
      { name: "Django", Icon: SiDjango, color: "#0C4B33" },
    ],
  },
  {
    label: "Databases",
    items: [
      { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
      { name: "MySQL", Icon: SiMysql, color: "#00758F" },
    ],
  },
  {
    label: "Tools & DevOps",
    items: [
      { name: "Docker", Icon: FaDocker, color: "#2496ED" },
      { name: "GitHub Actions", Icon: SiGithubactions, color: "#2088FF" },
      { name: "Fastlane", Icon: SiFastlane, color: "#22A45B" },
      { name: "Git", Icon: SiGit, color: "#F05032" },
    ],
  },
];
