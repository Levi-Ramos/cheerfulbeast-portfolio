"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { ChevronLeft, ChevronRight, Lock, Search } from "lucide-react";
import {
  projects, experience, skillGroups, LENSES, monthsIn, formatRange,
  type Project, type TermLine, type Lens,
} from "@/lib/portfolio-data";

const GITHUB = "https://github.com/Levi-Ramos";
const LINKEDIN = "https://www.linkedin.com/in/rowserowserowse/";
const EMAIL = "leviramos59@gmail.com";

type LB = {
  i: number;
  title: string;
  desc?: string;
  link?: string;
  images?: string[];
  terminal?: { title: string; lines: TermLine[] };
  role?: string;
  origin?: string;
  responsibilities?: string[];
  tags?: string[];
};

const NAV_LINKS = [
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

const PAGES = [{ id: "top", label: "Intro" }, ...NAV_LINKS] as const;

const GATE_BOOT = [
  "booting mark.ramos v2026.1 ...",
  "mounting projects/       [ok]",
  "mounting experience/     [ok]",
  "mounting skills/         [ok]",
];

type GateItem = { l: string; target: string | null; skipPrologue?: boolean };
const GATE_ITEMS: GateItem[] = [
  { l: "Enter portfolio", target: null },
  { l: "Jump to Projects", target: "#projects" },
  { l: "Skip intro", target: null, skipPrologue: true },
];

/** Each act owns a slice of the prologue's scroll. Two of them hold sub-stages. */
const ACT_WINDOWS: [number, number][] = [
  [0.000, 0.075], // who
  [0.075, 0.160], // what
  [0.160, 0.580], // how       — six sub-stages
  [0.580, 0.830], // the build — three sub-stages
  [0.830, 0.920], // the stack
  [0.920, 1.000], // resolve
];
const ACT_LABELS = ["who", "what", "how", "built", "stack", "ready"];
const LOOP_STAGES = ["spec", "plan", "review", "build", "verify", "ship"];
const BUILD_STAGES = ["the room", "the round", "the reveal"];
/** Fades are an absolute distance, not a fraction of the window: the "how" act is
 *  0.42 wide, and a proportional fade there outlasts its own first sub-stage. */
const EDGE = 0.04;

// The pixel dialect, shared by the cursor trail and the contact finale so they read as
// the same material: everything snaps to a 6px lattice and fades in four hard steps.
const PIX = 6;
const PIX_STEPS = [1, 0.75, 0.45, 0.18];
const snapPix = (n: number) => Math.round(n / PIX) * PIX;
const pixAlpha = (k: number) => PIX_STEPS[Math.min(3, Math.max(0, (k * 4) | 0))];
// canvas can't read CSS vars, so pull the palette off :root once per effect
const readAccents = () => {
  const css = getComputedStyle(document.documentElement);
  const v = (n: string, fallback: string) => css.getPropertyValue(n).trim() || fallback;
  return { a: v("--accent", "#4ade80"), b: v("--accent2", "#22d3ee"), w: v("--warn", "#e0af68") };
};
const fitCanvas = (c: HTMLCanvasElement, ctx: CanvasRenderingContext2D | null, w: number, h: number) => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  c.width = w * dpr;
  c.height = h * dpr;
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
};

// rotating ascii galaxy — a fixed-size character grid so every animation frame renders
// at the exact same width/height (no layout jitter), driven into a <pre> via ref + interval
const GALAXY_COLS = 34;
const GALAXY_ROWS = 15;
const GALAXY_ARMS = 3;
const GALAXY_STAR_COUNT = 130;
const GALAXY_CHARS = [" ", ".", ":", "+", "*", "#"];

function buildGalaxyStars() {
  const stars: { r: number; a0: number; spin: number }[] = [];
  for (let i = 0; i < GALAXY_STAR_COUNT; i++) {
    const t = Math.random(); // 0 = core, 1 = rim
    const arm = i % GALAXY_ARMS;
    // arm base angle + spiral winding + scatter that loosens further from the core
    const a0 = (arm / GALAXY_ARMS) * Math.PI * 2 + t * 2.6 + (Math.random() - 0.5) * (0.25 + t * 0.5);
    stars.push({ r: t, a0, spin: 0.6 + (1 - t) * 1.0 }); // inner stars spin faster, like a real galaxy
  }
  return stars;
}
function renderGalaxyFrame(stars: { r: number; a0: number; spin: number }[], angle: number) {
  const grid = Array.from({ length: GALAXY_ROWS }, () => Array(GALAXY_COLS).fill(" "));
  const cx = (GALAXY_COLS - 1) / 2, cy = (GALAXY_ROWS - 1) / 2;
  const maxR = Math.min(GALAXY_COLS / 2, GALAXY_ROWS) * 0.9;
  stars.forEach((s) => {
    const a = s.a0 + angle * s.spin;
    const rr = s.r * maxR;
    const x = Math.round(cx + Math.cos(a) * rr);
    const y = Math.round(cy + Math.sin(a) * rr * 0.5); // flatten for monospace character aspect
    if (x < 0 || x >= GALAXY_COLS || y < 0 || y >= GALAXY_ROWS) return;
    const idx = Math.min(GALAXY_CHARS.length - 1, Math.floor((1 - s.r) * (GALAXY_CHARS.length - 1)) + 1);
    if (GALAXY_CHARS.indexOf(grid[y][x]) < idx) grid[y][x] = GALAXY_CHARS[idx];
  });
  grid[Math.round(cy)][Math.round(cx)] = GALAXY_CHARS[GALAXY_CHARS.length - 1]; // bright core nucleus
  return grid.map((row) => row.join("")).join("\n");
}

// The finale is a tall scrubbed section whose contact card only exists at the very bottom,
// so every "go to contact" affordance has to land there rather than at the section's start —
// and it lands instantly, because someone clicking Contact wants the address, not the ride.
function jumpToSection(id: string, smooth: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  const r = el.getBoundingClientRect();
  const toEnd = id === "contact";
  window.scrollTo({
    top: window.scrollY + r.top + (toEnd ? r.height - window.innerHeight : 0),
    behavior: smooth && !toEnd ? "smooth" : "instant",
  });
}

// The three lines that land during the warp. Each owns a [from, to] slice of the section's
// scroll and holds at full opacity across the middle of it — a peak-and-fall curve reads
// as a flash and gives no time to actually read the line.
const FINALE_BEATS = [
  { from: 0.4, to: 0.565, h: "Build it together", s: "you bring the problem" },
  { from: 0.565, to: 0.73, h: "Ship it for real", s: "not a prototype that dies in staging" },
  { from: 0.73, to: 0.895, h: "Make it last", s: "the part everyone skips" },
];
const FINALE_BEAT_EDGE = 0.035; // fade in/out at each end; the rest of the slice is a hold

const LONGEST_ROLE = Math.max(...experience.map((j) => monthsIn(j)));

export default function Home() {
  const [lb, setLb] = useState<LB | null>(null);
  const [modKey, setModKey] = useState("⌘");
  const [gateMenuShown, setGateMenuShown] = useState(false);
  const [gateSelectedIdx, setGateSelectedIdx] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [paletteActiveIdx, setPaletteActiveIdx] = useState(0);

  // DOM refs touched imperatively (continuous/high-frequency effects, or raw-HTML regions React doesn't own)
  const prologueRef = useRef<HTMLElement>(null);
  const navElRef = useRef<HTMLElement>(null);
  const waveRef = useRef<HTMLSpanElement>(null);
  const proRailRef = useRef<HTMLDivElement>(null);
  const proFillRef = useRef<HTMLSpanElement>(null);
  const proLabelRef = useRef<HTMLSpanElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const paintRef = useRef<() => void>(() => {});
  const gateElRef = useRef<HTMLDivElement>(null);
  const gateTermRef = useRef<HTMLDivElement>(null);
  const gateBootRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLCanvasElement>(null);
  const starfieldRef = useRef<HTMLCanvasElement>(null);
  const a1Ref = useRef<HTMLDivElement>(null);
  const a2Ref = useRef<HTMLDivElement>(null);
  const navIndicatorRef = useRef<HTMLSpanElement>(null);
  const navlinksElRef = useRef<HTMLDivElement>(null);
  const navLinkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const pagedotRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const paletteInputRef = useRef<HTMLInputElement>(null);
  const projectRefs = useRef<(HTMLElement | null)[]>([]);
  const [projTab, setProjTab] = useState<"work" | "personal">("personal");
  const [lens, setLens] = useState<Lens | "all">("all");
  const galaxyGateRef = useRef<HTMLPreElement>(null);
  const galaxyContactRef = useRef<HTMLPreElement>(null);
  const finaleRef = useRef<HTMLElement>(null);
  const finaleFieldRef = useRef<HTMLCanvasElement>(null);

  // mutable flags that shouldn't trigger re-renders
  const gateOpenRef = useRef(true);
  const reducedRef = useRef(false);

  const openProject = (p: Project) => {
    if (p.terminal) setLb({ i: 0, title: p.name, terminal: p.terminal });
    else if (p.images && p.images.length) setLb({ images: p.images, i: 0, title: p.name, desc: p.desc, link: p.link });
    else if (p.responsibilities?.length)
      setLb({ i: 0, title: p.name, desc: p.desc, role: p.role, origin: p.origin, responsibilities: p.responsibilities, tags: p.tags, link: p.link });
  };
  const renderProjectCard = (p: Project, i: number) => {
    const hasModal = !!(p.images?.length || p.terminal || p.responsibilities?.length);
    const showThumbImage = !!p.images?.length;
    const overlay = p.images?.length
      ? (p.imagesLabel ?? "View screenshots →")
      : p.terminal
      ? (p.imagesLabel ?? "View install →")
      : p.responsibilities?.length
      ? "View details →"
      : p.link
      ? "Visit live site →"
      : null;

    const content = (
      <>
        <div className="thumb" style={showThumbImage ? { padding: 0, background: "#0a0d14" } : { background: p.grad }}>
          {showThumbImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.images![0]} alt={p.name} />
              <div className="overlay">{overlay}</div>
            </>
          ) : p.locked ? (
            <>
              <Lock size={34} color={p.glyphColor} strokeWidth={1.5} />
              {overlay && <div className="overlay">{overlay}</div>}
            </>
          ) : (
            <>
              <span className="glyph" style={{ color: p.glyphColor }}>{p.glyph}</span>
              {overlay && <div className="overlay">{overlay}</div>}
            </>
          )}
          <span className={`badge ${p.badge}`}><span className="bdot" />{p.status}</span>
        </div>
        <div className="proj-body">
          <h3>{p.name}</h3>
          <div className="role">{p.role}</div>
          <p>{p.desc}</p>
          <div className="tags">{p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
        </div>
      </>
    );

    const setRef = (el: HTMLElement | null) => {
      projectRefs.current[i] = el;
    };

    if (p.link && !hasModal) {
      return (
        <a key={p.name} ref={setRef} className="proj reveal clickable" href={p.link} target="_blank" rel="noreferrer">
          {content}
        </a>
      );
    }

    return (
      <div
        key={p.name}
        ref={setRef}
        className={`proj reveal${hasModal ? " clickable" : ""}`}
        onClick={() => openProject(p)}
        role={hasModal ? "button" : undefined}
        tabIndex={hasModal ? 0 : undefined}
        onKeyDown={(e) => { if (hasModal && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openProject(p); } }}
      >
        {content}
      </div>
    );
  };

  // The hidden panel sits outside the viewport, so its cards never trip the reveal observer —
  // mark them revealed on switch instead of waiting for an intersection that won't come.
  const switchProjTab = (tab: "work" | "personal") => {
    setProjTab(tab);
    document.querySelectorAll<HTMLElement>("#projects .proj.reveal:not(.in)").forEach((el) => {
      el.style.transitionDelay = "";
      el.classList.add("in");
    });
  };

  const closeLb = () => setLb(null);
  const stepLb = (d: number) => {
    setLb((s) => (s?.images ? { ...s, i: (s.i + d + s.images.length) % s.images.length } : s));
  };

  // ---------- shared helpers (touch only refs/setters — safe to define once per render) ----------
  function addLine(container: HTMLElement, html: string, cls?: string | null) {
    const d = document.createElement("div");
    d.className = "ln" + (cls ? ` ${cls}` : "");
    d.innerHTML = html;
    container.appendChild(d);
    container.scrollTop = container.scrollHeight;
    return d;
  }
  function typeLine(container: HTMLElement, text: string, cls: string | null, cb?: () => void) {
    const d = addLine(container, "", cls);
    if (reducedRef.current) {
      d.textContent = text;
      cb?.();
      return;
    }
    let i = 0;
    const step = () => {
      d.textContent = text.slice(0, i++);
      container.scrollTop = container.scrollHeight;
      if (i <= text.length) setTimeout(step, 14);
      else cb?.();
    };
    step();
  }

  function triggerMatrix() {
    if (reducedRef.current || document.getElementById("matrixRain")) return;
    const c = document.createElement("canvas");
    c.id = "matrixRain";
    c.style.cssText = "position:fixed;inset:0;z-index:500;pointer-events:none;";
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    document.body.appendChild(c);
    const ctx = c.getContext("2d");
    if (!ctx) {
      c.remove();
      return;
    }
    const cols = Math.floor(c.width / 16);
    const drops = new Array(cols).fill(0);
    const chars = "アイウエオカキクケコ01<>/=+-";
    let frame = 0;
    const maxFrames = 220;
    const loop = () => {
      ctx.fillStyle = "rgba(10,13,20,.14)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#4ade80";
      ctx.font = "14px monospace";
      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * 16, y * 16);
        drops[i] = y * 16 > c.height && Math.random() > 0.975 ? 0 : y + 1;
      });
      frame++;
      if (frame < maxFrames) requestAnimationFrame(loop);
      else {
        c.style.transition = "opacity .6s";
        c.style.opacity = "0";
        setTimeout(() => c.remove(), 600);
      }
    };
    loop();
  }

  // ---------- intro gate ----------
  function gBoot(i: number) {
    const el = gateBootRef.current;
    if (!el) return;
    if (i >= GATE_BOOT.length) {
      addLine(el, "", null);
      addLine(el, '<span class="p">? where to</span>', null);
      setGateMenuShown(true);
      return;
    }
    typeLine(el, GATE_BOOT[i], "out", () => setTimeout(() => gBoot(i + 1), 90));
  }
  function resetGate() {
    gateElRef.current?.classList.remove("closing");
    if (gateBootRef.current) gateBootRef.current.innerHTML = "";
    if (gateTermRef.current) gateTermRef.current.style.cssText = "";
    setGateMenuShown(false);
    setGateSelectedIdx(0);
  }
  function reopenGate() {
    resetGate();
    window.scrollTo(0, 0);
    if (gateElRef.current) gateElRef.current.style.display = "";
    gateOpenRef.current = true;
    document.body.style.overflow = "hidden";
    gBoot(0);
  }
  function gFade(target: string | null, skipPrologue = false) {
    const gateEl = gateElRef.current, gateTermEl = gateTermRef.current;
    if (!gateEl || !gateTermEl) return;
    gateEl.classList.add("closing");
    gateTermEl.style.transition = "opacity .4s ease";
    gateTermEl.style.opacity = "0";
    setTimeout(() => {
      gateEl.style.display = "none";
      document.body.style.overflow = "";
      if (target) document.querySelector(target)?.scrollIntoView({ behavior: reducedRef.current ? "auto" : "smooth" });
      else if (skipPrologue) window.scrollTo(0, prologueRef.current?.offsetHeight ?? 0);
      paintRef.current();
    }, reducedRef.current ? 0 : 420);
  }
  function gCommit(idx: number) {
    if (!gateOpenRef.current) return;
    gateOpenRef.current = false;
    try {
      sessionStorage.setItem("gateSeen", "1");
    } catch {}
    const item = GATE_ITEMS[idx];
    const el = gateBootRef.current;
    if (el) addLine(el, '<span class="out">&rarr; entering ...</span>', null);
    setTimeout(() => gFade(item.target, item.skipPrologue), 220);
  }
  function gSkip() {
    if (!gateOpenRef.current) return;
    gateOpenRef.current = false;
    try {
      sessionStorage.setItem("gateSeen", "1");
    } catch {}
    gFade(null, true);
  }

  const PALETTE_ACTIONS = [
    { l: "Go to Projects", h: "section", a: () => document.querySelector("#projects")?.scrollIntoView({ behavior: reducedRef.current ? "auto" : "smooth" }) },
    { l: "Go to Experience", h: "section", a: () => document.querySelector("#experience")?.scrollIntoView({ behavior: reducedRef.current ? "auto" : "smooth" }) },
    { l: "Go to Skills", h: "section", a: () => document.querySelector("#skills")?.scrollIntoView({ behavior: reducedRef.current ? "auto" : "smooth" }) },
    { l: "Go to Contact", h: "section", a: () => jumpToSection("contact", !reducedRef.current) },
    { l: "View Resume", h: "↗", a: () => window.open("/resume.pdf", "_blank", "noopener") },
    { l: "Open GitHub", h: "↗", a: () => window.open(GITHUB, "_blank", "noopener") },
    { l: "Open LinkedIn", h: "↗", a: () => window.open(LINKEDIN, "_blank", "noopener") },
    { l: "Copy email address", h: EMAIL, a: () => navigator.clipboard?.writeText(EMAIL) },
    { l: "sudo make me a sandwich", h: "easter egg", a: () => triggerMatrix() },
  ];
  const filteredPalette = PALETTE_ACTIONS.filter((c) => c.l.toLowerCase().includes(paletteQuery.toLowerCase()));

  // ---------- decide gate visibility before first paint (avoids a flash on repeat visits) ----------
  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedRef.current = reduced;
    let gateSeen = false;
    try {
      gateSeen = !!sessionStorage.getItem("gateSeen");
    } catch {}
    if (reduced || gateSeen) {
      if (gateElRef.current) gateElRef.current.style.display = "none";
      gateOpenRef.current = false;
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ---------- OS-aware shortcut label ----------
  useEffect(() => {
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent || "");
    setModKey(isMac ? "⌘" : "Ctrl");
  }, []);

  // ---------- reveal-on-scroll ----------
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        // Stagger by position within the batch that just came into view — and cap it. Indexing
        // by position in the whole group meant a 23-tile grid queued up ~1.8s of delay, and any
        // element already on screen at load inherited a delay it never earned.
        let n = 0;
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          if (!reducedRef.current) el.style.transitionDelay = `${Math.min(n++, 5) * 55}ms`;
          el.classList.add("in");
          io.unobserve(el);
          // the stagger delay is only for this reveal transition — clear it once it fires, so it
          // doesn't keep throttling later hover/tilt transitions on el.
          el.addEventListener("transitionend", () => { el.style.transitionDelay = ""; }, { once: true });
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ---------- lightbox keyboard nav ----------
  useEffect(() => {
    if (!lb) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowRight") stepLb(1);
      else if (e.key === "ArrowLeft") stepLb(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lb]);

  // ---------- command palette: open/close lifecycle + keyboard nav ----------
  useEffect(() => {
    if (paletteOpen) {
      setPaletteQuery("");
      setPaletteActiveIdx(0);
      requestAnimationFrame(() => paletteInputRef.current?.focus());
    }
  }, [paletteOpen]);
  useEffect(() => {
    setPaletteActiveIdx(0);
  }, [paletteQuery]);
  useEffect(() => {
    if (!paletteOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPaletteOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setPaletteActiveIdx((v) => Math.min(v + 1, filteredPalette.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setPaletteActiveIdx((v) => Math.max(v - 1, 0));
      } else if (e.key === "Enter") {
        const item = filteredPalette[paletteActiveIdx];
        if (item) {
          item.a();
          setPaletteOpen(false);
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paletteOpen, paletteQuery, paletteActiveIdx]);

  // ---------- gate keyboard nav (arrow/enter/escape + digit shortcuts) ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!gateOpenRef.current) return;
      if (e.key === "Escape") {
        gSkip();
        return;
      }
      if (!gateMenuShown) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setGateSelectedIdx((v) => (v + 1) % GATE_ITEMS.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setGateSelectedIdx((v) => (v - 1 + GATE_ITEMS.length) % GATE_ITEMS.length);
      } else if (e.key === "Enter") {
        gCommit(gateSelectedIdx);
      } else if (/^[1-3]$/.test(e.key)) {
        const i = Number(e.key) - 1;
        setGateSelectedIdx(i);
        gCommit(i);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gateMenuShown, gateSelectedIdx]);

  // ---------- Cmd/Ctrl+K global palette toggle + gate boot kickoff + all continuous/ambient effects ----------
  useEffect(() => {
    const reduced = reducedRef.current;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const cleanups: Array<() => void> = [];

    // custom cursor + pixel comet trail: three pixels per step, sprayed into a ±25° cone
    // pointing back down the tail, then quantised to the lattice as they drift and fade
    const dot = cursorDotRef.current;
    const trailCanvas = cursorTrailRef.current;
    if (finePointer && !reduced && dot && trailCanvas) {
      const tctx = trailCanvas.getContext("2d");
      const { a: ACC, b: ACC2 } = readAccents();
      const pix: { x: number; y: number; vx: number; vy: number; t: number; life: number; c: string }[] = [];
      let lastX: number | null = null;
      let lastY: number | null = null;

      const fitTrail = () => fitCanvas(trailCanvas, tctx, window.innerWidth, window.innerHeight);
      fitTrail();
      window.addEventListener("resize", fitTrail);
      cleanups.push(() => window.removeEventListener("resize", fitTrail));

      const onMove = (e: MouseEvent) => {
        const mx = e.clientX, my = e.clientY;
        dot.style.transform = `translate(${mx}px,${my}px)`;
        if (lastX === null || lastY === null) {
          lastX = mx; lastY = my;
        } else {
          const ddx = mx - lastX, ddy = my - lastY;
          const dist = Math.hypot(ddx, ddy);
          if (dist >= 4) {
            lastX = mx; lastY = my;
            const base = Math.atan2(-ddy / dist, -ddx / dist);
            for (let i = 0; i < 3; i++) {
              const ang = base + (Math.random() * 2 - 1) * 0.44;
              const sp = 1.2 * (0.5 + Math.random());
              pix.push({
                x: mx, y: my,
                vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
                t: 0, life: 40 + Math.random() * 20,
                c: Math.random() < 0.62 ? ACC : ACC2,
              });
            }
            if (pix.length > 260) pix.splice(0, pix.length - 260);
          }
        }
        const target = e.target as HTMLElement;
        const hoverTarget = target.closest?.("a,button,.clickable,input,.skilltile");
        dot.classList.toggle("hover", !!hoverTarget);
      };
      window.addEventListener("mousemove", onMove);
      cleanups.push(() => window.removeEventListener("mousemove", onMove));

      let painted = false;
      let trailRaf = requestAnimationFrame(function loop() {
        // a still pointer means nothing to draw — don't spend a full-viewport clear on it
        if (tctx && (pix.length || painted)) {
          painted = pix.length > 0;
          tctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          for (let i = pix.length - 1; i >= 0; i--) {
            const p = pix[i];
            if (++p.t > p.life) { pix.splice(i, 1); continue; }
            const k = p.t / p.life;
            p.x += p.vx; p.y += p.vy;
            p.vx *= 0.94; p.vy *= 0.94;
            const s = k > 0.6 ? 3 : PIX;
            tctx.globalAlpha = pixAlpha(k);
            tctx.fillStyle = p.c;
            tctx.fillRect(snapPix(p.x) - s / 2, snapPix(p.y) - s / 2, s, s);
          }
          tctx.globalAlpha = 1;
        }
        trailRaf = requestAnimationFrame(loop);
      });
      cleanups.push(() => cancelAnimationFrame(trailRaf));
    } else if (dot) {
      dot.style.display = "none";
    }

    // starfield + the odd comet streaking past
    const canvas = starfieldRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      let stars: { x: number; y: number; r: number; phase: number; speed: number }[] = [];
      type Comet = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; len: number };
      let comets: Comet[] = [];
      let nextCometAt = 4 + Math.random() * 6;
      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        stars = [];
        const count = Math.floor((canvas.width * canvas.height) / 9000);
        for (let i = 0; i < count; i++) {
          stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.2 + 0.3,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.02 + 0.008,
          });
        }
        draw(0);
      };
      const spawnComet = () => {
        const fromLeft = Math.random() < 0.5;
        const drop = Math.PI / 7 + Math.random() * (Math.PI / 9); // shallow downward angle
        const angle = fromLeft ? drop : Math.PI - drop;
        const speed = 7 + Math.random() * 5;
        const len = 70 + Math.random() * 50;
        comets.push({
          x: fromLeft ? -len : canvas.width + len,
          y: Math.random() * canvas.height * 0.55,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 70,
          len,
        });
      };
      const draw = (t: number) => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#e8edf4";
        stars.forEach((s) => {
          const o = reduced ? 0.5 : Math.sin(t * s.speed + s.phase) * 0.4 + 0.5;
          ctx.globalAlpha = o * 0.7;
          // a rect, not an arc: at r < 1.5px they're indistinguishable, and 144 arc
          // paths per frame was the single most expensive thing on the page
          ctx.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r * 2);
        });
        ctx.globalAlpha = 1;

        if (!reduced) {
          comets = comets.filter((c) => c.life < c.maxLife);
          comets.forEach((c) => {
            c.x += c.vx; c.y += c.vy; c.life++;
            const mag = Math.hypot(c.vx, c.vy) || 1;
            const tailX = c.x - (c.vx / mag) * c.len;
            const tailY = c.y - (c.vy / mag) * c.len;
            const fade = 1 - c.life / c.maxLife;
            const grad = ctx.createLinearGradient(tailX, tailY, c.x, c.y);
            grad.addColorStop(0, "rgba(232,237,244,0)");
            grad.addColorStop(1, `rgba(232,237,244,${0.85 * fade})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(c.x, c.y);
            ctx.stroke();
            ctx.globalAlpha = fade;
            ctx.beginPath();
            ctx.arc(c.x, c.y, 1.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          });
        }
      };
      window.addEventListener("resize", resize);
      cleanups.push(() => window.removeEventListener("resize", resize));
      resize();
      if (!reduced) {
        // The twinkle sine has a period of several minutes, so repainting the star layer
        // 60 times a second animates nothing visible — it just spends a full-viewport
        // repaint per frame and halves the frame budget for everything else on the page.
        // Stars settle for ~8fps; a streaking comet pulls the loop back up to full rate.
        let lastStars = -1;
        let raf = requestAnimationFrame(function loop(ms) {
          const t = ms / 1000;
          if (t > nextCometAt) {
            spawnComet();
            nextCometAt = t + 5 + Math.random() * 9;
          }
          if (comets.length || t - lastStars > 0.12) {
            draw(t);
            lastStars = t;
          }
          raf = requestAnimationFrame(loop);
        });
        cleanups.push(() => cancelAnimationFrame(raf));
      }
    }

    // rotating ascii galaxy — a fixed-width character-grid animation, same frame driven
    // into both the boot terminal (neofetch-style) and the contact mascot, kept in sync
    const galaxyStars = buildGalaxyStars();
    let galaxyAngle = 0;
    const renderGalaxy = () => {
      const frame = renderGalaxyFrame(galaxyStars, galaxyAngle);
      if (galaxyGateRef.current) galaxyGateRef.current.textContent = frame;
      if (galaxyContactRef.current) galaxyContactRef.current.textContent = frame;
    };
    renderGalaxy();
    if (!reduced) {
      const galaxyIv = setInterval(() => {
        galaxyAngle += 0.045;
        renderGalaxy();
      }, 130);
      cleanups.push(() => clearInterval(galaxyIv));
    }

    // parallax aurora
    const heroEl = prologueRef.current;
    if (!reduced && heroEl && a1Ref.current && a2Ref.current) {
      const a1 = a1Ref.current, a2 = a2Ref.current;
      const mouse = { nx: 0, ny: 0 };
      const render = () => {
        const sy = window.scrollY;
        a1.style.transform = `translate(${mouse.nx * -30}px,${mouse.ny * -30 + sy * 0.12}px)`;
        a2.style.transform = `translate(${mouse.nx * 24}px,${mouse.ny * 24 + sy * 0.08}px)`;
      };
      const onHeroMove = (e: MouseEvent) => {
        const r = heroEl.getBoundingClientRect();
        mouse.nx = (e.clientX - r.left) / r.width - 0.5;
        mouse.ny = (e.clientY - r.top) / r.height - 0.5;
        render();
      };
      heroEl.addEventListener("mousemove", onHeroMove);
      cleanups.push(() => heroEl.removeEventListener("mousemove", onHeroMove));
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          render();
          ticking = false;
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
    }

    // tilt cards
    projectRefs.current.forEach((card) => {
      if (!card) return;
      const onMove = (e: MouseEvent) => {
        if (reducedRef.current) return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${py * -6}deg) rotateY(${px * 8}deg) translateY(-4px)`;
      };
      const onLeave = () => {
        card.style.transform = "";
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    // magnetic buttons
    if (!reduced && finePointer) {
      document.querySelectorAll<HTMLElement>(".btn").forEach((btn) => {
        const onMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          btn.style.transform = `translate(${dx * 0.18}px,${dy * 0.35}px)`;
        };
        const onLeave = () => {
          btn.style.transform = "";
        };
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          btn.removeEventListener("mousemove", onMove);
          btn.removeEventListener("mouseleave", onLeave);
        });
      });
    }

    // scrollspy: nav underline + page dots
    const setActiveNav = (id: string) => {
      let link: HTMLAnchorElement | null = null;
      Object.entries(navLinkRefs.current).forEach(([linkId, a]) => {
        if (!a) return;
        const isMatch = linkId === id;
        a.classList.toggle("active", isMatch);
        if (isMatch) link = a;
      });
      const navlinksEl = navlinksElRef.current, indicator = navIndicatorRef.current;
      if (link && navlinksEl && indicator) {
        const pr = navlinksEl.getBoundingClientRect();
        const lr = (link as HTMLAnchorElement).getBoundingClientRect();
        indicator.style.left = `${lr.left - pr.left}px`;
        indicator.style.width = `${lr.width}px`;
        indicator.classList.add("show");
      }
    };
    const setActiveDot = (id: string) => {
      Object.entries(pagedotRefs.current).forEach(([dotId, d]) => {
        d?.classList.toggle("active", dotId === id);
      });
    };
    const sections = PAGES.map((p) => document.getElementById(p.id)).filter((el): el is HTMLElement => !!el);
    const spyIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActiveNav(e.target.id);
            setActiveDot(e.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spyIO.observe(s));
    cleanups.push(() => spyIO.disconnect());

    // konami easter egg
    if (!reduced) {
      const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
      const buf: string[] = [];
      const onKonami = (e: KeyboardEvent) => {
        if (gateOpenRef.current) return;
        buf.push(e.key);
        if (buf.length > seq.length) buf.shift();
        if (buf.join(",") === seq.join(",")) triggerMatrix();
      };
      document.addEventListener("keydown", onKonami);
      cleanups.push(() => document.removeEventListener("keydown", onKonami));
    }

    // Cmd/Ctrl+K palette toggle (blocked while the gate is open)
    const onPaletteShortcut = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        if (gateOpenRef.current) return;
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onPaletteShortcut);
    cleanups.push(() => document.removeEventListener("keydown", onPaletteShortcut));

    // kick off: gate boot, if the layout effect decided the gate is still open
    if (gateOpenRef.current) gBoot(0);

    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- the prologue scrub ----------
  // Six acts share one sticky viewport. Every bit of state is derived from scroll
  // position, so scrolling back up replays the whole thing in reverse for free.
  useEffect(() => {
    const root = prologueRef.current;
    const nav = navElRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nav?.classList.remove("pro-hidden");
      return;
    }

    const qsa = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));
    const beats = qsa(".beat");
    const acts = [
      { beat: 2, steps: qsa("#loopStage .pstep"), rail: qsa("#loopRail .rail-step"), labels: LOOP_STAGES, at: 0 },
      { beat: 3, steps: qsa("#buildStage .pstep"), rail: qsa("#buildRail .rail-step"), labels: BUILD_STAGES, at: 0 },
    ];

    const ramp = (p: number, a: number, b: number) => {
      if (p <= a || p >= b) return 0;
      if (p < a + EDGE) return (p - a) / EDGE;
      if (p > b - EDGE) return (b - p) / EDGE;
      return 1;
    };

    // The hand waves once per arrival, and never behind the gate.
    let waving = false;
    const setWave = (on: boolean) => {
      const el = waveRef.current;
      if (!el || on === waving || gateOpenRef.current) return;
      waving = on;
      if (!on) {
        el.classList.remove("go");
        return;
      }
      el.classList.remove("go");
      void el.offsetWidth; // restart the animation
      el.classList.add("go");
    };

    const paint = () => {
      const travel = root.offsetHeight - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, window.scrollY / travel)) : 1;

      beats.forEach((el, i) => {
        const w = ACT_WINDOWS[i];
        let o: number;
        if (i === 0) {
          // Already on screen when the gate leaves, so no fade-in — otherwise the
          // visitor lands on a near-blank page and never learns to scroll.
          o = 1 - Math.min(1, Math.max(0, (p - (w[1] - EDGE)) / EDGE));
          setWave(o > 0.85);
        } else if (i === beats.length - 1) {
          o = Math.min(1, Math.max(0, (p - w[0]) / 0.05)); // the hero arrives and stays
        } else {
          o = ramp(p, w[0] - 0.02, w[1] + 0.02);
        }
        el.style.opacity = String(o);
        el.style.transform = `translateY(${(1 - o) * 26}px)`;
        el.style.pointerEvents = o > 0.6 ? "auto" : "none";
      });

      // Sub-stages only advance once their beat has settled, so nothing swaps
      // underneath a fade.
      acts.forEach((act) => {
        const w = ACT_WINDOWS[act.beat];
        const s0 = w[0] + EDGE + 0.015;
        const s1 = w[1] - EDGE;
        const inner = Math.min(1, Math.max(0, (p - s0) / (s1 - s0)));
        act.at = Math.min(act.steps.length - 1, Math.floor(inner * act.steps.length));
        act.steps.forEach((el, i) => el.classList.toggle("on", i === act.at));
        act.rail.forEach((el, i) => {
          el.classList.toggle("on", i === act.at);
          el.classList.toggle("done", i < act.at);
        });
      });

      nav?.classList.toggle("pro-hidden", p < 0.905);
      proRailRef.current?.classList.toggle("in", p < 0.99);
      skipRef.current?.classList.toggle("in", p < 0.93);
      if (proFillRef.current) proFillRef.current.style.width = `${(p * 100).toFixed(1)}%`;

      const label = proLabelRef.current;
      if (label) {
        const bi = ACT_WINDOWS.findIndex((w) => p >= w[0] && p < w[1]);
        const act = acts.find((a) => a.beat === bi);
        if (p < 0.04) {
          label.className = "cue";
          label.innerHTML = 'scroll <i>&darr;</i>';
        } else {
          label.className = "";
          label.textContent = act
            ? `${ACT_LABELS[bi]} · ${act.labels[act.at]}`
            : ACT_LABELS[bi < 0 ? ACT_LABELS.length - 1 : bi];
        }
      }
    };

    paintRef.current = paint;
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        paint();
        queued = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", paint);
    paint();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", paint);
    };
  }, []);

  // ---------- the contact finale scrub ----------
  // Same contract as the prologue: one sticky stage, every value derived from scroll
  // position. The loop only runs while the section is on screen — a warp field is far
  // too expensive to leave spinning behind three other sections.
  useEffect(() => {
    const root = finaleRef.current;
    const canvas = finaleFieldRef.current;
    const galaxy = galaxyContactRef.current;
    if (!root || !canvas || !galaxy) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    const { a: ACC, b: ACC2, w: WARN } = readAccents();
    const beats = Array.from(root.querySelectorAll<HTMLElement>(".fbeat"));
    const card = root.querySelector<HTMLElement>(".fcard");
    const hud = root.querySelector<HTMLElement>(".fhud");
    const hudVel = root.querySelector<HTMLElement>(".fhud .vel");
    const hudSec = root.querySelector<HTMLElement>(".fhud .sec");

    let W = window.innerWidth, H = window.innerHeight;
    const fit = () => {
      W = window.innerWidth; H = window.innerHeight;
      fitCanvas(canvas, ctx, W, H);
    };
    fit();
    window.addEventListener("resize", fit);

    // stars in normalised camera space; z shrinking toward 0 is the camera flying into them
    const field = Array.from({ length: 820 }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random() * 0.96 + 0.04,
      c: Math.random() < 0.58 ? ACC2 : Math.random() < 0.8 ? ACC : WARN,
    }));
    const respawn = (s: (typeof field)[number], far: boolean) => {
      s.x = Math.random() * 2 - 1;
      s.y = Math.random() * 2 - 1;
      s.z = far ? 1 : 0.04;
    };

    const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
    const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
    const ease = (t: number) => t * t * (3 - 2 * t);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    // fade in over `edge`, hold flat, fade out over `edge` — same shape the prologue uses
    const ramp = (n: number, a: number, b: number, edge: number) => {
      if (n <= a || n >= b) return 0;
      if (n < a + edge) return (n - a) / edge;
      if (n > b - edge) return (b - n) / edge;
      return 1;
    };

    const draw = () => {
      const r = root.getBoundingClientRect();
      const travel = r.height - H;
      const p = travel > 0 ? clamp01(-r.top / travel) : 0;

      // The approach is compressed to the front so the three lines get most of the
      // section's scroll to hold across — they are the part that has to be read.
      const zoom = ease(seg(p, 0.06, 0.3)); // THE GALAXY is what enlarges
      const rush = ease(seg(p, 0.18, 0.34)); // the field starts streaming past
      const warp = ease(seg(p, 0.3, 0.4)) * (1 - ease(seg(p, 0.88, 0.96)));
      const pullOut = ease(seg(p, 0.93, 1));

      ctx?.clearRect(0, 0, W, H);
      if (ctx && (rush > 0.02 || pullOut > 0)) {
        const cx = W / 2, cy = H / 2;
        // the retreat peaks mid-pull-out then settles into a slow held drift
        const speed = warp * 0.052 + rush * 0.004 - pullOut * (1 - pullOut * 0.88) * 0.03;
        const fov = lerp(0.55, 1.35, warp) * Math.min(W, H);
        // the field dims as it settles so the contact card is the brightest thing left
        const vis = clamp01(Math.max(rush * (1 - pullOut), warp) + pullOut * 0.4);
        for (const s of field) {
          s.z -= speed;
          if (s.z <= 0.04) { respawn(s, true); continue; }
          if (s.z > 1) { respawn(s, false); continue; }
          const x1 = cx + (s.x / s.z) * fov, y1 = cy + (s.y / s.z) * fov;
          if (x1 < -240 || x1 > W + 240 || y1 < -240 || y1 > H + 240) continue;
          // the tail is where the star was ~10 frames ago, not one — a single frame's
          // delta is a dot, and a warp made of dots reads as debris, not speed
          const zTail = Math.min(1, s.z + Math.abs(speed) * 10);
          const x0 = cx + (s.x / zTail) * fov, y0 = cy + (s.y / zTail) * fov;
          const near = 1 - s.z;
          // streaks are columns of lattice pixels, never smooth lines, so the finale and
          // the cursor trail stay the same material
          // capped so one very long streak can't alone cost thousands of fills a frame
          const n = Math.min(64, Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / PIX)));
          ctx.fillStyle = s.c;
          let px = NaN, py = NaN;
          for (let i = 0; i < n; i++) {
            const t = i / n;
            const qx = snapPix(lerp(x1, x0, t)), qy = snapPix(lerp(y1, y0, t));
            if (qx === px && qy === py) continue; // same lattice cell as the last sample
            px = qx; py = qy;
            const sz = t < 0.3 ? 6 : t < 0.7 ? 4 : 3;
            ctx.globalAlpha = pixAlpha(t) * (0.35 + 0.65 * near) * vis;
            ctx.fillRect(qx - sz / 2, qy - sz / 2, sz, sz);
          }
        }
        ctx.globalAlpha = 1;
      }

      // A scaled <pre> is a real composited layer: at 30x it is ~8000px across and costs
      // a whole frame budget to raster, even at zero opacity. Take it out of the tree the
      // moment it stops being visible — for most of the section that is the whole cost.
      const gAlpha = ease(seg(p, 0, 0.05)) * 0.85 * (1 - ease(seg(p, 0.24, 0.33)));
      if (gAlpha < 0.005) {
        galaxy.style.display = "none";
      } else {
        // exponential, so it reads as approach rather than a linear CSS scale-up
        const gScale = Math.pow(30, zoom);
        galaxy.style.display = "";
        galaxy.style.opacity = gAlpha.toFixed(3);
        galaxy.style.transform = `translate(-50%,-50%) scale(${gScale.toFixed(3)})`;
        // filter runs before transform, so a plain blur gets multiplied by the scale and
        // smears the galaxy into soup — divide it back out to keep it constant on screen
        galaxy.style.filter = zoom > 0.3 ? `blur(${(((zoom - 0.3) * 11) / gScale).toFixed(3)}px)` : "none";
      }

      beats.forEach((el, i) => {
        const { from, to } = FINALE_BEATS[i];
        const o = ease(ramp(p, from, to, FINALE_BEAT_EDGE));
        el.style.opacity = o.toFixed(3);
        el.style.transform = `scale(${lerp(0.94, 1, o).toFixed(3)})`;
      });

      const fin = ease(seg(p, 0.94, 0.995));
      if (card) {
        card.style.opacity = fin.toFixed(3);
        card.style.transform = `translateY(${lerp(26, 0, fin).toFixed(1)}px)`;
        card.style.pointerEvents = fin > 0.6 ? "auto" : "none";
      }
      hud?.classList.toggle("in", p > 0.06 && p < 0.995);
      if (hudVel) hudVel.textContent = (warp * 0.94 + rush * 0.1 * (1 - pullOut)).toFixed(2);
      if (hudSec) hudSec.textContent = String(Math.round(p * 12)).padStart(2, "0");
    };

    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !raf) {
          raf = requestAnimationFrame(function loop() {
            draw();
            raf = requestAnimationFrame(loop);
          });
        } else if (!e.isIntersecting && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(root);
    draw();

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={cursorDotRef} aria-hidden="true" />
      <canvas id="cursorTrail" ref={cursorTrailRef} aria-hidden="true" />
      <canvas id="starfield" ref={starfieldRef} aria-hidden="true" />
      <div className="pagedots">
        {PAGES.map((p) => (
          <button
            key={p.id}
            type="button"
            className="pdot"
            aria-label={p.label}
            ref={(el) => {
              pagedotRefs.current[p.id] = el;
            }}
            onClick={() => jumpToSection(p.id, !reducedRef.current)}
          />
        ))}
      </div>

      <div className="gate" id="gate" ref={gateElRef} role="dialog" aria-label="Intro">
        <div className="gate-scrim" />
        <div className="gate-term" ref={gateTermRef}>
          <div className="term-bar">
            <span className="dot r" /><span className="dot y" /><span className="dot g" />
            <span className="term-title">guest@mark-ramos: ~</span>
          </div>
          <div className="term-body">
            <div className="neofetch">
              <pre className="ascii-art" aria-hidden="true" style={{ width: `${GALAXY_COLS}ch` }} ref={galaxyGateRef} />
              <div className="neofetch-info">
                <div ref={gateBootRef} />
                {gateMenuShown && (
                  <>
                    <div className="gate-menu">
                      {GATE_ITEMS.map((item, i) => (
                        <div
                          key={item.l}
                          className={`gate-item${i === gateSelectedIdx ? " active" : ""}`}
                          onMouseEnter={() => setGateSelectedIdx(i)}
                          onClick={() => gCommit(i)}
                        >
                          <span className="marker">{i === gateSelectedIdx ? "❯" : ""}</span>
                          {item.l}
                        </div>
                      ))}
                    </div>
                    <div className="ln out gate-hint">&uarr;&darr; move &middot; enter select &middot; esc skip</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <button className="gate-skip clickable" type="button" onClick={gSkip}>
          Skip intro &rarr;
        </button>
      </div>

      <nav className="pf-nav pro-hidden" ref={navElRef}>
        <div className="inner">
          <a className="pf-brand" href="#top">mark<span>.</span>ramos<span className="blinkcaret">_</span></a>
          <div className="pf-navlinks" ref={navlinksElRef}>
            <span className="nav-indicator" ref={navIndicatorRef} />
            {NAV_LINKS.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                ref={(el) => {
                  navLinkRefs.current[n.id] = el;
                }}
                onClick={(e) => { e.preventDefault(); jumpToSection(n.id, !reducedRef.current); }}
              >
                {n.label}
              </a>
            ))}
          </div>
          <div className="nav-right">
            <button className="kbd-hint clickable" type="button" aria-label="Open command palette" onClick={() => setPaletteOpen(true)}>
              <span>{modKey}</span>K
            </button>
            <a
              className="btn solid"
              href="#contact"
              onClick={(e) => { e.preventDefault(); jumpToSection("contact", !reducedRef.current); }}
            >
              Get in touch
            </a>
          </div>
        </div>
      </nav>

      {/* The prologue: six acts in one sticky viewport, scrubbed by scroll.
          Scrolling back up replays it, because every value is derived from position. */}
      <header className="prologue" id="top" ref={prologueRef}>
        <div className="pstage">
          <div className="aurora a1" ref={a1Ref} />
          <div className="aurora a2" ref={a2Ref} />

          {/* 01 — who */}
          <div className="beat" data-beat="0">
            <h1>
              Hi, I&apos;m <span className="grad">Levi</span>.{" "}
              <span className="wave" ref={waveRef} aria-hidden="true">&#128075;</span>
            </h1>
            <p className="beat-p">Software engineer. Mobile and web. Davao City, Philippines.</p>
          </div>

          {/* 02 — what */}
          <div className="beat" data-beat="1">
            <div className="beat-meta">what I do</div>
            <h1>I build for mobile<br />and web, end to end.</h1>
            <div className="beat-list">
              <span>mobile apps</span><span>web clients</span><span>APIs</span>
              <span>databases</span><span>release pipelines</span>
            </div>
            <p className="beat-p">
              Three years, four teams &mdash; most of that time inside systems that were already running.
            </p>
          </div>

          {/* 03 — how: the six-stage loop, one stage at a time */}
          <div className="beat" data-beat="2">
            <div className="beat-meta">how I work</div>
            <div className="prail" id="loopRail">
              <div className="rail-step"><b>01</b>spec</div>
              <div className="rail-step"><b>02</b>plan</div>
              <div className="rail-step"><b>03</b>review</div>
              <div className="rail-step"><b>04</b>build</div>
              <div className="rail-step"><b>05</b>verify</div>
              <div className="rail-step"><b>06</b>ship</div>
            </div>

            <div className="pstage-inner" id="loopStage">
              <div className="pstep">
                <div>
                  <div className="who">human authored</div>
                  <h2>I write the spec first.</h2>
                  <p>What changes, what stays, what done means. An agent handed one sentence will build the wrong thing, quickly.</p>
                </div>
                <div className="art">
                  <div className="cap">/spec &mdash; scroll-snap fights the user</div>
                  <div className="l"><span className="g">&rsaquo;</span><span>problem: snap <b>captures</b> the scroll instead of assisting it</span></div>
                  <div className="l"><span className="g">&rsaquo;</span><span>done means: a flick lands where it was aimed</span></div>
                  <div className="l"><span className="g">&rsaquo;</span><span>out of scope: section order, reveal timing</span></div>
                </div>
              </div>

              <div className="pstep">
                <div>
                  <div className="who">agent proposal</div>
                  <h2>Then the plan, before any code.</h2>
                  <p>Which files, in what order, and the smallest change that satisfies the spec. I read a plan, not four hundred lines I have to reverse-engineer.</p>
                </div>
                <div className="art">
                  <div className="cap">implementation plan</div>
                  <div className="l"><span className="g">1</span><span>globals.css:14 &mdash; <b>one declaration</b></span></div>
                  <div className="l"><span className="g">2</span><span>no new dependency, no new state</span></div>
                  <div className="l"><span className="g">3</span><span>check at 390&times;844 before ship</span></div>
                </div>
              </div>

              <div className="pstep">
                <div>
                  <div className="who">human gate &middot; pre-build</div>
                  <h2>The plan gets reviewed.</h2>
                  <p>Scope creep, missing cases, cheaper options &mdash; caught while the change is still a paragraph. Rejecting a plan costs minutes. Rejecting a branch costs a day.</p>
                </div>
                <div className="art">
                  <div className="cap">/plan-eng-review</div>
                  <div className="l"><span className="ok">&#10003;</span><span>scope matches the spec</span></div>
                  <div className="l"><span className="no">!</span><span>proximity still snaps on desktop &mdash; <b>intended?</b> confirmed yes</span></div>
                  <div className="l"><span className="ok">&#10003;</span><span>approved &mdash; one line, reversible</span></div>
                </div>
              </div>

              <div className="pstep">
                <div>
                  <div className="who">agent execution &middot; constrained</div>
                  <h2>The smallest thing that works.</h2>
                  <p>Standard library before custom code, native before a dependency, one line before fifty. Shortcuts I take on purpose get written down instead of forgotten.</p>
                </div>
                <div className="art">
                  <div className="cap">diff</div>
                  <div className="l"><span className="no">&minus;</span><span><span className="del">scroll-snap-type: y mandatory</span></span></div>
                  <div className="l"><span className="ok">+</span><span>scroll-snap-type: y proximity</span></div>
                  <div className="l"><span className="g">&middot;</span><span className="g">skipped: a JS scroll controller. add when CSS proves insufficient.</span></div>
                </div>
              </div>

              <div className="pstep">
                <div>
                  <div className="who">human gate &middot; pre-ship</div>
                  <h2>Nothing ships on the agent&apos;s word.</h2>
                  <p>I measure it &mdash; on a device for mobile, at a real viewport for web. Numbers, not vibes, and it catches what reading a diff can&apos;t see.</p>
                </div>
                <div className="art">
                  <div className="cap">measured &mdash; real defects, this site</div>
                  <div className="l"><span className="no">!</span><span>animation delay <span className="del">1760ms</span> &rarr; <span className="num">275ms</span></span></div>
                  <div className="l"><span className="no">!</span><span>section column <span className="del">858px</span> &rarr; <span className="num">1232px</span></span></div>
                  <div className="l"><span className="no">!</span><span>text contrast <span className="del">3.2:1</span> &rarr; <span className="num">6.9:1</span></span></div>
                  <div className="l"><span className="no">!</span><span>duration read <span className="del">19 months</span> &rarr; <span className="num">20</span></span></div>
                </div>
              </div>

              <div className="pstep">
                <div>
                  <div className="who">human decision</div>
                  <h2>Then it ships, with a commit that says why.</h2>
                  <p>Tests, diff review, deploy. If something was left out, the commit says that too &mdash; a record you can&apos;t trust is worth nothing.</p>
                </div>
                <div className="art">
                  <div className="cap">/ship</div>
                  <div className="l"><span className="ok">&#10003;</span><span>lint, types, build clean</span></div>
                  <div className="l"><span className="g">&middot;</span><span><b>34505b1</b> Relax scroll-snap from mandatory to proximity</span></div>
                  <div className="l"><span className="ok">&#10003;</span><span>deployed, verified live</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* 04 — the build: one project, walked */}
          <div className="beat" data-beat="3">
            <div className="beat-meta">
              the project I&apos;m proudest of &middot;{" "}
              <a href="https://code-party-dusky.vercel.app" target="_blank" rel="noreferrer">code-party-dusky.vercel.app</a>
              {" \u00b7 "}
              <a href="https://code-party-dusky.vercel.app/room/DEMO" target="_blank" rel="noreferrer">or watch the 80s demo</a>
            </div>
            <div className="prail r3" id="buildRail">
              <div className="rail-step"><b>01</b>the room</div>
              <div className="rail-step"><b>02</b>the round</div>
              <div className="rail-step"><b>03</b>the reveal</div>
            </div>

            <div className="pstage-inner tall" id="buildStage">
              <div className="pstep shot-step">
                <div>
                  <div className="who">code party &middot; <span className="live-pill">shipped, no signup</span></div>
                  <h2>2&ndash;10 players, one room, one clock.</h2>
                  <p>A four-character code and a display name. Three game modes share the same room, lobby, timer and reconnect skeleton &mdash; mode is a setting, not a separate app.</p>
                  <div className="art">
                    <div className="cap">hard part &mdash; the server owns every timer</div>
                    <div className="l"><span className="no">!</span><span>a skewed clock or a paused tab must not <b>buy time</b></span></div>
                    <div className="l"><span className="ok">&rarr;</span><span>the server broadcasts <b>phase_changed &#123; deadline &#125;</b>; clients only render a countdown to it</span></div>
                    <div className="l"><span className="ok">&rarr;</span><span>a deadline is a ceiling, not a schedule &mdash; the last submission ends the phase early</span></div>
                  </div>
                </div>
                <figure className="shot zoom">
                  <div className="term-bar">
                    <span className="dot r" /><span className="dot y" /><span className="dot g" />
                    <span className="term-title">code-party-dusky.vercel.app/room/5454</span>
                  </div>
                  <div className="frame">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/cp-lobby.png" alt="Code Party lobby: room code, player list, and the three game modes" />
                  </div>
                </figure>
              </div>

              <div className="pstep shot-step">
                <div>
                  <div className="who">mode 01 &middot; ui speedbuild</div>
                  <h2>Write it, watch it render.</h2>
                  <p>A live HTML/CSS/JS editor beside a preview that updates as you type, against a prompt and a countdown.</p>
                  <div className="art">
                    <div className="cap">hard part &mdash; running a stranger&apos;s code</div>
                    <div className="l"><span className="ok">&rarr;</span><span><b>iframe sandbox srcdoc</b> &mdash; untrusted player code never reaches a server at all</span></div>
                    <div className="l"><span className="no">!</span><span>30s isn&apos;t enough to hand-write centering and card chrome</span></div>
                    <div className="l"><span className="ok">&rarr;</span><span>a small preset sheet covers <b>structure only</b> &mdash; styling everything makes every entry converge and drains the vote of signal</span></div>
                  </div>
                </div>
                <figure className="shot">
                  <div className="term-bar">
                    <span className="dot r" /><span className="dot y" /><span className="dot g" />
                    <span className="term-title">round 1/3 &mdash; 00:58 left</span>
                  </div>
                  <div className="frame">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/cp-round.png" alt="A round in progress: prompt, countdown, editor, live preview and the preset class reference" />
                  </div>
                </figure>
              </div>

              <div className="pstep shot-step">
                <div>
                  <div className="who">three modes, three judges</div>
                  <h2>Everyone&apos;s revealed at once.</h2>
                  <p>Peer vote for UI Speedbuild. An LLM rubric for System Design. Real test runs for Coding Challenge &mdash; pick Python, JS, Java or Go and your code is compiled and run.</p>
                  <div className="art">
                    <div className="cap">hard part &mdash; judging that repeats</div>
                    <div className="l"><span className="no">!</span><span>&ldquo;is this good?&rdquo; answers differently every time you ask</span></div>
                    <div className="l"><span className="ok">&rarr;</span><span>Gemini, structured JSON, <b>temp 0</b>, fixed criteria &mdash; repeatable scoring, not creative grading</span></div>
                    <div className="l"><span className="ok">&rarr;</span><span>one harness covers four languages: the arguments are baked in as <b>language literals</b>, so nothing parses JSON at runtime</span></div>
                    <div className="l opt"><span className="g">&middot;</span><span className="g">submissions are blanked from room state until reveal &mdash; &ldquo;3/4 submitted&rdquo; is a broadcast, and it must not carry anyone&apos;s code</span></div>
                  </div>
                </div>
                <figure className="shot z13">
                  <div className="term-bar">
                    <span className="dot r" /><span className="dot y" /><span className="dot g" />
                    <span className="term-title">code-party-dusky.vercel.app/room/DEMO</span>
                  </div>
                  <div className="frame">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/cp-reveal.png" alt="The voting grid: four players&apos; pricing-card submissions side by side, with the vote timer" />
                  </div>
                </figure>
              </div>
            </div>
          </div>

          {/* 05 — the stack, cut down to what is actually current */}
          <div className="beat" data-beat="4">
            <div className="beat-meta">what I work with, most weeks</div>
            <h1>The current stack.</h1>
            <div className="stackrows">
              <div className="srow">
                <span className="sl">mobile</span>
                <span className="st">Flutter &middot; Dart &middot; Bloc</span>
                <span className="se">ActiveOne &middot; ServePOS</span>
              </div>
              <div className="srow">
                <span className="sl">web</span>
                <span className="st">Next.js &middot; React &middot; TypeScript</span>
                <span className="se">this site &middot; Groundtruth &middot; Code Party</span>
              </div>
              <div className="srow">
                <span className="sl">server</span>
                <span className="st">TypeScript on Node <em>&middot;</em> .NET / C#</span>
                <span className="se">route handlers &middot; Workers &middot; Express</span>
              </div>
              <div className="srow">
                <span className="sl">data</span>
                <span className="st">PostgreSQL &middot; Drizzle</span>
                <span className="se">Neon &middot; Supabase &middot; work Postgres</span>
              </div>
              <div className="srow">
                <span className="sl">ai</span>
                <span className="st">Gemini &middot; Vercel AI SDK</span>
                <span className="se">Groundtruth &middot; Code Party</span>
              </div>
              <div className="srow">
                <span className="sl">ship</span>
                <span className="st">Docker &middot; GitHub Actions &middot; Fastlane</span>
                <span className="se">mobile CI/CD &middot; TestFlight</span>
              </div>
            </div>
            <p className="stacknote">
              Laravel, Spring Boot and Flask are on my r&eacute;sum&eacute; and I can still work in them &mdash;
              I just haven&apos;t in two years. The complete list is in Skills, below.
            </p>
          </div>

          {/* 06 — resolve into the hero the rest of the page expects */}
          <div className="beat hero-resolve" data-beat="5">
            <div className="kicker"><span className="pulse" />FULL-STACK ENGINEER &middot; MOBILE + WEB &middot; DAVAO CITY, PH</div>
            <h1>Mark Levi Rowse<br /><span className="grad">M. Ramos</span></h1>
            <p className="tagline">
              I take products from a rough spec to something running in production &mdash; mobile and web,
              with the release pipeline that ships it.
            </p>
            <div className="hero-cta">
              <a className="btn solid clickable" href="#projects">View my projects</a>
              <a className="btn clickable" href="/resume.pdf" target="_blank" rel="noreferrer">View Resume</a>
              <a className="btn clickable" href={GITHUB} target="_blank" rel="noreferrer"><FaGithub /> GitHub</a>
              <a className="btn clickable" href={LINKEDIN} target="_blank" rel="noreferrer"><FaLinkedinIn /> LinkedIn</a>
            </div>
          </div>
        </div>
      </header>

      <div className="pro-rail" ref={proRailRef} aria-hidden="true">
        <span ref={proLabelRef} />
        <div className="pro-bar"><span ref={proFillRef} /></div>
      </div>
      <button
        className="skip-pro clickable"
        type="button"
        ref={skipRef}
        onClick={() =>
          window.scrollTo({
            top: prologueRef.current?.offsetHeight ?? 0,
            behavior: reducedRef.current ? "auto" : "smooth",
          })
        }
      >
        skip to work &darr;
      </button>

      <section id="projects" className="pf-section">
        <div className="pf-wrap">
          <div className="sec-head reveal"><span className="sec-num">01</span><span className="sec-title">Selected Projects</span><span className="sec-sub">tilt a card</span></div>
          <div className="projtabs reveal">
            {([["personal", "Personal"], ["work", "Work"]] as const).map(([k, label]) => (
              <button
                key={k}
                type="button"
                className={`projtab clickable${projTab === k ? " on" : ""}`}
                aria-pressed={projTab === k}
                onClick={() => switchProjTab(k)}
              >
                {label}<span className="ct">{projects.filter((p) => p.kind === k).length}</span>
              </button>
            ))}
          </div>
          <div className="projtrack-clip">
            <div className="projtrack" data-tab={projTab}>
              <div className="projects">{projects.map((p, i) => (p.kind === "personal" ? renderProjectCard(p, i) : null))}</div>
              <div className="projects">{projects.map((p, i) => (p.kind === "work" ? renderProjectCard(p, i) : null))}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="pf-section alt">
        <div className="pf-wrap">
          <div className="sec-head reveal"><span className="sec-num">02</span><span className="sec-title">Experience</span><span className="sec-sub">filter by stack</span></div>
          <div className="exp-filter reveal">
            <span className="ef-lbl">where I used</span>
            <button
              type="button"
              className={`ef-chip clickable${lens === "all" ? " on" : ""}`}
              aria-pressed={lens === "all"}
              onClick={() => setLens("all")}
            >
              everything
            </button>
            {LENSES.map((l) => (
              <button
                key={l.key}
                type="button"
                className={`ef-chip clickable${lens === l.key ? " on" : ""}`}
                aria-pressed={lens === l.key}
                onClick={() => setLens(lens === l.key ? "all" : l.key)}
              >
                {l.label}
              </button>
            ))}
            {lens !== "all" && (() => {
              // Counting the matches is the point of the filter — a lens that dims
              // most of the page without saying how much it kept is just noise.
              const hits = experience.reduce(
                (n, j) => n + (j.highlights?.filter((h) => h.tech?.includes(lens)).length ?? 0), 0);
              const roles = experience.filter(
                (j) => j.highlights?.some((h) => h.tech?.includes(lens))).length;
              const label = LENSES.find((l) => l.key === lens)?.label;
              return (
                <span className="ef-count" role="status">
                  {label} — {roles} of {experience.length} roles · {hits} {hits === 1 ? "highlight" : "highlights"}
                </span>
              );
            })()}
          </div>
          <div className="tl" data-filter={lens === "all" ? undefined : lens}>
            {experience.map((j) => {
              const months = monthsIn(j);
              const matched = j.highlights?.filter((h) => h.tech?.includes(lens as Lens)).length ?? 0;
              const lensTags = LENSES.find((l) => l.key === lens)?.tags ?? [];
              return (
                <div className="item reveal" data-dim={lens !== "all" && matched === 0 ? "" : undefined} key={j.company}>
                  <div className="when">
                    <span className="range">{formatRange(j)}</span>
                    <span className="dur" suppressHydrationWarning>
                      {months} months{j.internship ? " · internship" : ""}
                    </span>
                    <span className="bar" style={{ width: `${Math.round((months / LONGEST_ROLE) * 100)}%` }} />
                  </div>
                  <div>
                    <div className="r">
                      {j.role}
                      {!j.end && <span className="live"><i />current</span>}
                    </div>
                    <div className="co">
                      {j.company}
                      {!!j.products && <em> · {j.products} products</em>}
                    </div>
                    {!!j.highlights?.length && (
                      <ul className="highlights">
                        {j.highlights.map((h, i) => {
                          const hit = lens !== "all" && !!h.tech?.includes(lens as Lens);
                          return (
                            <li key={i} className={lens === "all" ? undefined : hit ? "hit" : "dim"}>
                              {h.lead && <b>{h.lead}</b>}{h.lead ? " " : ""}{h.text}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {!!j.tags?.length && (
                      <div className="tags">
                        {j.tags.map((t) => (
                          <span
                            className={`tag${lens === "all" ? "" : lensTags.includes(t) ? " hit" : " dim"}`}
                            key={t}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="skills" className="pf-section">
        <div className="pf-wrap">
          <div className="sec-head reveal"><span className="sec-num">03</span><span className="sec-title">Skills</span><span className="sec-sub">move your cursor over the grid</span></div>
          {skillGroups.map((g) => (
            <div className="skillgroup" key={g.label}>
              <div className="sk-label reveal">{g.label}<span className="ct">{g.items.length}</span></div>
              <div className="skillgrid">
                {g.items.map(({ name, Icon, color }) => (
                  <div
                    className="skilltile reveal"
                    key={name}
                    style={{ ["--b" as string]: color } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                      e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                    }}
                    onMouseMove={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                      e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                    }}
                  >
                    <div className="logo"><Icon size={30} color={color} /></div>
                    <div className="nm">{name}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The finale: the galaxy that has been idling since the boot terminal finally
          rushes the camera, and the site exits through it into the contact card.
          Deliberately no `reveal` classes in here — the scrub owns every opacity. */}
      <section id="contact" className="contact" ref={finaleRef}>
        <div className="fstage">
          <canvas id="finaleField" ref={finaleFieldRef} aria-hidden="true" />
          {/* deliberately not .ascii-art: that paints the glyphs as transparent-on-gradient,
              which at 46x scale leaves nothing but smeared text-shadow */}
          <pre className="fgalaxy" aria-hidden="true" style={{ width: `${GALAXY_COLS}ch` }} ref={galaxyContactRef} />

          {FINALE_BEATS.map((b) => (
            <div className="fbeat" key={b.h}>
              <h2>{b.h}</h2>
              <p>{b.s}</p>
            </div>
          ))}

          <div className="fcard">
            <h2>Let&apos;s build something <em>extraordinary</em>.</h2>
            <div className="term-flavor"><span className="p">guest@mark-ramos:~$</span> contact --send</div>
            <div className="row">
              <a className="btn solid clickable" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a className="btn clickable" href={GITHUB} target="_blank" rel="noreferrer"><FaGithub /> GitHub</a>
              <a className="btn clickable" href={LINKEDIN} target="_blank" rel="noreferrer"><FaLinkedinIn /> LinkedIn</a>
            </div>
          </div>

          <div className="fhud" aria-hidden="true">
            <span className="tl">MARK RAMOS · DAVAO CITY</span>
            <span className="tr">SECTOR <b className="sec">00</b></span>
            <span className="br">VEL <b className="vel">0.00</b>c</span>
          </div>
        </div>
      </section>

      <footer className="pf-footer">© 2026 Mark Levi Rowse M. Ramos · Davao City, Philippines</footer>

      <div className={`palette-overlay${paletteOpen ? " open" : ""}`} onMouseDown={(e) => { if (e.target === e.currentTarget) setPaletteOpen(false); }}>
        <div className="palette">
          <div className="palette-inputrow">
            <Search size={16} />
            <input
              ref={paletteInputRef}
              placeholder="Type a command or search…"
              autoComplete="off"
              spellCheck={false}
              value={paletteQuery}
              onChange={(e) => setPaletteQuery(e.target.value)}
            />
          </div>
          <div className="palette-list">
            {filteredPalette.length === 0 ? (
              <div className="palette-empty">no matching command</div>
            ) : (
              filteredPalette.map((c, i) => (
                <div
                  key={c.l}
                  className={`palette-item clickable${i === paletteActiveIdx ? " active" : ""}`}
                  onMouseEnter={() => setPaletteActiveIdx(i)}
                  onClick={() => { c.a(); setPaletteOpen(false); }}
                >
                  <span className="l">{c.l}</span><span className="h">{c.h}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {lb && (
        <div className="lightbox" onClick={closeLb}>
          <button className="lb-close" onClick={closeLb} aria-label="Close">&times;</button>
          {lb.terminal ? (
            <div className="terminal lb-terminal" onClick={(e) => e.stopPropagation()}>
              <div className="term-bar">
                <span className="dot r" /><span className="dot y" /><span className="dot g" />
                <span className="term-title">{lb.terminal.title}</span>
              </div>
              <div className="term-body">
                {lb.terminal.lines.map(([text, cls], i) => (
                  <div key={i} className={`ln${cls ? ` ${cls}` : ""}`}>{text}</div>
                ))}
              </div>
            </div>
          ) : lb.images ? (
            <div className="lb-panel" onClick={(e) => e.stopPropagation()}>
              <div className="lb-carousel">
                {(lb.images?.length ?? 0) > 1 && (
                  <button className="lb-arrow left" onClick={(e) => { e.stopPropagation(); stepLb(-1); }} aria-label="Previous"><ChevronLeft size={22} /></button>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={lb.images![lb.i]} alt={`${lb.title} screenshot ${lb.i + 1}`} />
                {(lb.images?.length ?? 0) > 1 && (
                  <button className="lb-arrow right" onClick={(e) => { e.stopPropagation(); stepLb(1); }} aria-label="Next"><ChevronRight size={22} /></button>
                )}
                {(lb.images?.length ?? 0) > 1 && (
                  <div className="lb-dots">
                    {lb.images?.map((_, i) => <span key={i} className={`lb-dot${i === lb.i ? " active" : ""}`} />)}
                  </div>
                )}
              </div>
              <div className="lb-info">
                <h3>{lb.title}</h3>
                {lb.desc && <p>{lb.desc}</p>}
                {lb.link && (
                  <a className="btn solid" href={lb.link} target="_blank" rel="noreferrer">
                    Visit live site &rarr;
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="lb-details" onClick={(e) => e.stopPropagation()}>
              <h3>{lb.title}</h3>
              {lb.role && <div className="role">{lb.role}</div>}
              {lb.origin && <div className="origin">{lb.origin}</div>}
              {lb.desc && <p className="desc">{lb.desc}</p>}
              {!!lb.responsibilities?.length && (
                <>
                  <div className="resp-label">Responsibilities</div>
                  <ul className="resp">
                    {lb.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </>
              )}
              {!!lb.tags?.length && (
                <div className="tags">{lb.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
