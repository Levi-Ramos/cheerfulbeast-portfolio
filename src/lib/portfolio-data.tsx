import type { IconType } from "react-icons";
import {
  SiDart, SiFlutter, SiTypescript, SiJavascript, SiDotnet, SiNextdotjs,
  SiBlazor, SiLaravel, SiFlask, SiDjango, SiPostgresql, SiMysql,
  SiGithubactions, SiGit, SiFastlane, SiReactquery, SiWordpress,
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
    status: "SHIPPED",
    badge: "ship",
    role: "Solo build — room server, three game modes, LLM + sandbox judging",
    desc: "A real-time multiplayer game for programmers — 2–10 players get one prompt and one server-owned timer, then every submission is revealed at once and judged. Three modes: UI Speedbuild writes live HTML/CSS/JS into a sandboxed iframe and is judged by peer vote; System Design is scored by an LLM against a fixed rubric at temperature 0; Coding Challenge compiles and runs your Python, JS, Java or Go against hidden tests in a real sandbox. One Cloudflare Durable Object per room over WebSockets — the server owns every deadline, and reconnect is a full state resync rather than a special path.",
    tags: ["Next.js", "TypeScript", "Cloudflare Workers", "WebSockets", "Gemini", "Judge0", "CodeMirror"],
    glyphColor: "#4ade80",
    grad: "linear-gradient(135deg,#0f2318,#0a0d14)",
    link: "https://code-party-dusky.vercel.app",
    images: ["/cp-round.png", "/cp-reveal.png", "/cp-lobby.png"],
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
export type Lens = "flutter" | "dotnet" | "web" | "backend" | "ops" | "ai";

export const LENSES: { key: Lens; label: string; tags: string[] }[] = [
  { key: "flutter", label: "Flutter", tags: ["Flutter", "Dart", "Bloc"] },
  { key: "dotnet", label: ".NET / Blazor", tags: ["Blazor", ".NET", "SignalR"] },
  { key: "web", label: "Next.js / Vue", tags: ["Next.js", "React", "TanStack Query", "Vue", "Quasar"] },
  { key: "backend", label: "Laravel / APIs", tags: ["Laravel", "PHP", "Flask", "Spring Boot", "KillBill"] },
  { key: "ops", label: "CI/CD", tags: ["Docker", "GitHub Actions", "Fastlane", "PowerShell", "Flyway"] },
  { key: "ai", label: "AI workflow", tags: ["Claude Code"] },
];

export type Highlight = {
  /** Set on the first highlight of a product group — renders a subhead above it. */
  product?: string;
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
    desc: "Four products: a Blazor/.NET payroll platform, a greenfield Flutter field-sales app replacing a legacy Delphi client, a BIR-compliant Flutter POS, and a Delphi/React ticket portal whose delivery pipeline I built from scratch.",
    highlights: [
      {
        lead: "Works spec-first with an AI coding agent",
        text: "(Claude Code) across all four products — a short PRD and implementation plan per feature, agent-driven execution, and managed context on long-running work.",
        tech: ["ai"],
      },
      {
        product: "ActiveWork — payroll & HR platform · Blazor, .NET Core, Next.js",
        lead: "Primary developer",
        text: "of the Blazor web client — most of the front-end feature set across 200+ Razor components: payroll schedules, attendance import and calendar, Philippine statutory payroll pages.",
        tech: ["dotnet", "web"],
      },
      {
        text: "Built the TanStack Query data layer in the Next.js 16 / React 19 client, for payroll reporting (export, summary and period queries) and the account-access module.",
        tech: ["web"],
      },
      {
        lead: "Owns two domain modules",
        text: "end to end — Taxes (tax tables and brackets, de-minimis allowances, its read/update API) and account access (token-based invitations, temporary-password enforcement, password reset).",
        tech: ["dotnet", "backend"],
      },
      {
        text: "Built the real-time notification services on ASP.NET Core SignalR, with tenant- and user-scoped broadcast groups, plus the statutory payroll calculators — SSS, PhilHealth, Pag-IBIG, withholding tax.",
        tech: ["dotnet", "backend"],
      },
      {
        text: "Contributed the payroll- and contribution-summary reporting endpoints and their report templates.",
        tech: ["dotnet", "backend"],
      },
      {
        text: "Engineered the containerized deploy pipeline — GitHub Actions, Docker, GitHub Container Registry — with an SSH deploy step to reach a network-isolated production environment.",
        tech: ["ops"],
      },
      {
        product: "ActiveFieldSales — field-sales mobile app · Flutter",
        lead: "Sole developer",
        text: "on a greenfield Flutter/Bloc app replacing a legacy Delphi mobile client for the company's ERP product — architecture through release to internal testing.",
        tech: ["flutter"],
      },
      {
        lead: "Sole author",
        text: "of the iOS and Android release pipeline, end to end: GitHub Actions and Fastlane.",
        tech: ["ops", "flutter"],
      },
      {
        product: "ServePOS — point of sale · Flutter, BIR-compliant",
        text: "Built the Popular Items sales-reporting widgets and the end-of-shift cash-count gate, which blocks reconciliation while held or unpaid transactions are still open.",
        tech: ["flutter"],
      },
      {
        text: "Built a Provider-based permission gate enforcing per-action authorization on payments, discounts and reprints, with an override-login fallback — still intact in production.",
        tech: ["flutter"],
      },
      {
        text: "Built refund and return processing, the on-hold order drawer (hold, resume, cashier-scoped queues), and Philippine statutory discount handling.",
        tech: ["flutter"],
      },
      {
        text: "Co-owns the mobile release automation — Fastlane, TestFlight and Play.",
        tech: ["ops"],
      },
      {
        product: "ActiveScorecard — job-ticket portal · Delphi/Object Pascal, React",
        lead: "Built the deploy pipeline from scratch",
        text: "across three repositories — self-hosted GitHub Actions runners, PowerShell packaging, Flyway migrations run from the deployed artifact, and health-probed in-place swaps that restore the previous build on failure.",
        tech: ["ops"],
      },
      {
        text: "Took the product from no pipeline, no backups and no monitoring to a service-managed system: a Windows-service backend verified by unattended reboot, and nightly off-box backups whose weekly checksum-verified restore caught a real three-night silent failure.",
        tech: ["ops"],
      },
      {
        text: "Ships the frontend as immutable versioned releases cut from a release tag — atomic swaps behind a byte-hash health probe with one-dispatch rollback, and a corrected cache policy: no-store entry point, immutable hashed assets.",
        tech: ["ops", "web"],
      },
      {
        text: "Diagnosed a silent deploy failure where name-sorted artifact selection shipped a stale build past a passing health check; added provenance guards pinning each deploy to the commit just built.",
        tech: ["ops"],
      },
      {
        text: "Built role-based review gating for service-request modifications — a new RBAC policy action splitting content from due-date changes, routed to the right authority tier, enforced on both client and server, with a migration and a standalone test runner.",
        tech: ["backend", "web"],
      },
      {
        text: "Fixed a QA-found cross-bucket approval bug in that feature post-release, and shipped the correction with regression tests.",
        tech: ["backend"],
      },
      {
        text: "Implemented the ticket-creation email notification for the portal's public intake flow, per an accepted ADR, with defensive null-handling for unassigned tickets.",
        tech: ["backend"],
      },
      {
        text: "Maintain the public WordPress site where clients read this portal's ticket report; fixed a broken embed by tracing the iframe refusal to the app's frame-ancestor restrictions.",
        tech: ["web", "ops"],
      },
    ],
    tags: ["Flutter", "Dart", "Bloc", "Blazor", ".NET", "SignalR", "Next.js", "React", "TanStack Query", "Delphi", "PostgreSQL", "Docker", "GitHub Actions", "Fastlane", "PowerShell", "Flyway", "Claude Code"],
  },
  {
    role: "Frontend Developer",
    company: "Apollo Technologies, Inc.",
    start: "2024-07",
    end: "2024-12",
    desc: "Front-end lead on a Vue/Quasar reskin of a live telecom billing system, with full-stack scope: a Flutter mobile app and the Flask integration layer behind it.",
    highlights: [
      {
        lead: "Owned",
        text: "the front-end redevelopment of a live telecom billing system in Vue 3 and Quasar, for an ISP client.",
        tech: ["web"],
      },
      {
        text: "Built a Flutter/Bloc loyalty and Wi-Fi app from scratch for the same client, integrating a legacy provisioning system that returned scraped HTML instead of a REST interface.",
        tech: ["flutter"],
      },
      {
        text: "Collaborated on the Flask API layer bridging that integration, and on a third-party KillBill subscription-billing integration.",
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
      { name: "TanStack Query", Icon: SiReactquery, color: "#FF4154" },
      { name: "Vue / Quasar", Icon: FaVuejs, color: "#42B883" },
      { name: "Blazor", Icon: SiBlazor, color: "#5C2D91" },
      { name: "WordPress", Icon: SiWordpress, color: "#21759B" },
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
