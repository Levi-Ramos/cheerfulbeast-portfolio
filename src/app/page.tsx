"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { Lock, Search } from "lucide-react";
import { projects, experience, skills, type Project, type TermLine } from "@/lib/portfolio-data";

const GITHUB = "https://github.com/Levi-Ramos";
const LINKEDIN = "https://www.linkedin.com/in/rowserowserowse/";
const EMAIL = "leviramos59@gmail.com";

type LB = { i: number; title: string; desc?: string; link?: string; images?: string[]; terminal?: { title: string; lines: TermLine[] } };

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

type GateItem = { l: string; target: string | null; morph: boolean };
const GATE_ITEMS: GateItem[] = [
  { l: "Enter portfolio", target: null, morph: true },
  { l: "Jump to Projects", target: "#projects", morph: false },
  { l: "Skip intro", target: null, morph: false },
];

const HERO_BOOT: [string, "p" | "out"][] = [
  ["guest@mark-ramos:~$ whoami", "p"],
  ["Mark Levi Rowse M. Ramos · Full-stack Engineer", "out"],
  ["guest@mark-ramos:~$ cat status.txt", "p"],
  ["Shipping ActiveOne Field Sales solo · open to interesting problems", "out"],
  ["guest@mark-ramos:~$ ls", "p"],
];

const HELP =
  "Commands: help, whoami, ls, cat status.txt, open github, open linkedin, contact, sudo, matrix, cd .. (back to intro), clear";

const TRAIL_CHARS = ["0", "1", ".", "+", "*", "/", "\\", "<", ">", ":"];

const SECTION_LINKS_HTML =
  '<span class="term-link" data-t="#projects">projects/</span>  ' +
  '<span class="term-link" data-t="#experience">experience/</span>  ' +
  '<span class="term-link" data-t="#skills">skills/</span>  ' +
  '<span class="term-link" data-t="#contact">contact/</span>';

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

export default function Home() {
  const [lb, setLb] = useState<LB | null>(null);
  const [modKey, setModKey] = useState("⌘");
  const [gateMenuShown, setGateMenuShown] = useState(false);
  const [gateSelectedIdx, setGateSelectedIdx] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [paletteActiveIdx, setPaletteActiveIdx] = useState(0);

  // DOM refs touched imperatively (continuous/high-frequency effects, or raw-HTML regions React doesn't own)
  const heroTermRef = useRef<HTMLDivElement>(null);
  const heroTermBarRef = useRef<HTMLDivElement>(null);
  const heroBootRef = useRef<HTMLDivElement>(null);
  const heroTermInputRef = useRef<HTMLInputElement>(null);
  const gateElRef = useRef<HTMLDivElement>(null);
  const gateTermRef = useRef<HTMLDivElement>(null);
  const gateBootRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);
  const starfieldRef = useRef<HTMLCanvasElement>(null);
  const a1Ref = useRef<HTMLDivElement>(null);
  const a2Ref = useRef<HTMLDivElement>(null);
  const navIndicatorRef = useRef<HTMLSpanElement>(null);
  const navlinksElRef = useRef<HTMLDivElement>(null);
  const navLinkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const pagedotRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const paletteInputRef = useRef<HTMLInputElement>(null);
  const projectRefs = useRef<(HTMLElement | null)[]>([]);
  const galaxyGateRef = useRef<HTMLPreElement>(null);
  const galaxyContactRef = useRef<HTMLPreElement>(null);

  // mutable flags that shouldn't trigger re-renders
  const gateOpenRef = useRef(true);
  const heroBootedRef = useRef(false);
  const reducedRef = useRef(false);

  const openProject = (p: Project) => {
    if (p.terminal) setLb({ i: 0, title: p.name, terminal: p.terminal });
    else if (p.images && p.images.length) setLb({ images: p.images, i: 0, title: p.name, desc: p.desc, link: p.link });
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

  // ---------- hero terminal boot + commands ----------
  function runHeroBoot(i: number) {
    const el = heroBootRef.current;
    if (!el) return;
    if (i >= HERO_BOOT.length) {
      addLine(el, `${SECTION_LINKS_HTML}   <span class="out">(try 'help')</span>`, "out");
      return;
    }
    typeLine(el, HERO_BOOT[i][0], HERO_BOOT[i][1], () => runHeroBoot(i + 1));
  }
  function startHeroBoot() {
    if (heroBootedRef.current) return;
    heroBootedRef.current = true;
    runHeroBoot(0);
  }
  function runCommand(raw: string) {
    const el = heroBootRef.current;
    if (!el) return;
    const cmd = raw.trim().toLowerCase();
    addLine(el, `<span class="p">guest@mark-ramos:~$</span> ${raw}`, null);
    if (!cmd) return;
    if (cmd === "help") addLine(el, HELP, "out");
    else if (cmd === "whoami") addLine(el, "Mark Levi Rowse M. Ramos · Full-stack Engineer", "out");
    else if (cmd === "ls" || cmd === "ls projects") addLine(el, SECTION_LINKS_HTML, "out");
    else if (cmd === "cat status.txt")
      addLine(el, "Shipping ActiveOne Field Sales solo · open to interesting problems", "out");
    else if (cmd === "open github") {
      addLine(el, "opening github.com/Levi-Ramos…", "out");
      window.open(GITHUB, "_blank", "noopener");
    } else if (cmd === "open linkedin") {
      addLine(el, "opening linkedin.com/in/rowserowserowse…", "out");
      window.open(LINKEDIN, "_blank", "noopener");
    } else if (cmd === "contact") addLine(el, `${EMAIL} — or just scroll, contact/ is at the bottom.`, "out");
    else if (cmd === "sudo" || cmd.indexOf("sudo") === 0)
      addLine(el, "Nice try. Access granted: you may now scroll.", "warn");
    else if (cmd === "matrix") triggerMatrix();
    else if (cmd === "cd .." || cmd === "back" || cmd === "exit") {
      addLine(el, "returning to the main terminal ...", "out");
      setTimeout(morphIntoGate, 250);
    } else if (cmd === "clear") el.innerHTML = "";
    else addLine(el, `command not found: ${cmd} — try 'help'`, "warn");
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
  function gFade(target: string | null) {
    const gateEl = gateElRef.current, gateTermEl = gateTermRef.current;
    if (!gateEl || !gateTermEl) return;
    gateEl.classList.add("closing");
    gateTermEl.style.transition = "opacity .4s ease";
    gateTermEl.style.opacity = "0";
    setTimeout(() => {
      gateEl.style.display = "none";
      document.body.style.overflow = "";
      startHeroBoot();
      if (target) document.querySelector(target)?.scrollIntoView({ behavior: reducedRef.current ? "auto" : "smooth" });
    }, reducedRef.current ? 0 : 420);
  }
  function morphIntoHero() {
    const gateEl = gateElRef.current, gateTermEl = gateTermRef.current;
    if (!gateEl || !gateTermEl) return;
    gateEl.classList.add("closing");
    if (reducedRef.current) {
      gateEl.style.display = "none";
      document.body.style.overflow = "";
      startHeroBoot();
      return;
    }
    const heroTerm = heroTermRef.current;
    if (!heroTerm) return;
    const fromRect = gateTermEl.getBoundingClientRect();
    const toRect = heroTerm.getBoundingClientRect();

    gateTermEl.style.position = "fixed";
    gateTermEl.style.left = `${fromRect.left}px`;
    gateTermEl.style.top = `${fromRect.top}px`;
    gateTermEl.style.right = "auto";
    gateTermEl.style.bottom = "auto";
    gateTermEl.style.width = `${fromRect.width}px`;
    gateTermEl.style.height = `${fromRect.height}px`;
    void gateTermEl.offsetHeight;

    if (gateBootRef.current) {
      gateBootRef.current.style.transition = "opacity .2s ease";
      gateBootRef.current.style.opacity = "0";
    }

    requestAnimationFrame(() => {
      const ease = "cubic-bezier(.16,1,.3,1)";
      gateTermEl.style.transition = `left .68s ${ease}, top .68s ${ease}, width .68s ${ease}, height .68s ${ease}, border-radius .68s ease`;
      gateTermEl.style.left = `${toRect.left}px`;
      gateTermEl.style.top = `${toRect.top}px`;
      gateTermEl.style.width = `${toRect.width}px`;
      gateTermEl.style.height = `${toRect.height}px`;
      gateTermEl.style.borderRadius = "14px";
    });

    setTimeout(() => {
      gateEl.style.display = "none";
      document.body.style.overflow = "";
      startHeroBoot();
    }, 700);
  }
  function morphIntoGate() {
    const gateEl = gateElRef.current, gateTermEl = gateTermRef.current, heroTerm = heroTermRef.current;
    if (!gateEl || !gateTermEl) return;
    if (reducedRef.current || !heroTerm) {
      reopenGate();
      return;
    }
    resetGate();
    window.scrollTo(0, 0);
    gateEl.style.display = "";
    gateOpenRef.current = true;
    document.body.style.overflow = "hidden";

    // FLIP, run in reverse: start pinned over the hero terminal's current rect...
    const fromRect = heroTerm.getBoundingClientRect();
    gateTermEl.style.animation = "none"; // don't let the built-in gate-in keyframe fight the FLIP
    gateTermEl.style.position = "fixed";
    gateTermEl.style.left = `${fromRect.left}px`;
    gateTermEl.style.top = `${fromRect.top}px`;
    gateTermEl.style.right = "auto";
    gateTermEl.style.bottom = "auto";
    gateTermEl.style.width = `${fromRect.width}px`;
    gateTermEl.style.height = `${fromRect.height}px`;
    gateTermEl.style.borderRadius = "14px";
    void gateTermEl.offsetHeight;

    // ...then grow to fill the gate (which is already fixed inset:0, so its own rect is the viewport)
    const toRect = gateEl.getBoundingClientRect();
    requestAnimationFrame(() => {
      const ease = "cubic-bezier(.16,1,.3,1)";
      gateTermEl.style.transition = `left .6s ${ease}, top .6s ${ease}, width .6s ${ease}, height .6s ${ease}, border-radius .6s ease`;
      gateTermEl.style.left = `${toRect.left}px`;
      gateTermEl.style.top = `${toRect.top}px`;
      gateTermEl.style.width = `${toRect.width}px`;
      gateTermEl.style.height = `${toRect.height}px`;
      gateTermEl.style.borderRadius = "0px";
    });

    setTimeout(() => {
      gateTermEl.style.cssText = "";
      gBoot(0);
    }, 640);
  }
  function gCommit(idx: number) {
    if (!gateOpenRef.current) return;
    gateOpenRef.current = false;
    try {
      sessionStorage.setItem("gateSeen", "1");
    } catch {}
    const item = GATE_ITEMS[idx];
    const el = gateBootRef.current;
    if (item.morph) {
      if (el) addLine(el, '<span class="out">&rarr; entering ...</span>', null);
      setTimeout(morphIntoHero, 220);
    } else {
      if (el) addLine(el, '<span class="out">&rarr; loading portfolio ...</span>', null);
      setTimeout(() => gFade(item.target), 220);
    }
  }
  function gSkip() {
    if (!gateOpenRef.current) return;
    gateOpenRef.current = false;
    try {
      sessionStorage.setItem("gateSeen", "1");
    } catch {}
    gFade(null);
  }

  const PALETTE_ACTIONS = [
    { l: "Go to Projects", h: "section", a: () => document.querySelector("#projects")?.scrollIntoView({ behavior: reducedRef.current ? "auto" : "smooth" }) },
    { l: "Go to Experience", h: "section", a: () => document.querySelector("#experience")?.scrollIntoView({ behavior: reducedRef.current ? "auto" : "smooth" }) },
    { l: "Go to Skills", h: "section", a: () => document.querySelector("#skills")?.scrollIntoView({ behavior: reducedRef.current ? "auto" : "smooth" }) },
    { l: "Go to Contact", h: "section", a: () => document.querySelector("#contact")?.scrollIntoView({ behavior: reducedRef.current ? "auto" : "smooth" }) },
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
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document
      .querySelectorAll<HTMLElement>(".glance,.projects,.tl,.skillgrid,.hero-cta,.contact .row")
      .forEach((group) => {
        group.querySelectorAll<HTMLElement>(".reveal").forEach((el, i) => {
          el.style.transitionDelay = `${i * 80}ms`;
        });
      });
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

    // custom cursor + cone comet trail
    const dot = cursorDotRef.current;
    const trailContainer = cursorTrailRef.current;
    if (finePointer && !reduced && dot && trailContainer) {
      let lastX: number | null = null;
      let lastY: number | null = null;
      const queue: HTMLSpanElement[] = [];
      const onMove = (e: MouseEvent) => {
        const mx = e.clientX, my = e.clientY;
        dot.style.transform = `translate(${mx}px,${my}px)`;
        let dx = 0, dy = -1;
        if (lastX !== null && lastY !== null) {
          const ddx = mx - lastX, ddy = my - lastY;
          const dist = Math.hypot(ddx, ddy);
          if (dist >= 14) {
            dx = ddx / dist; dy = ddy / dist;
            lastX = mx; lastY = my;
            const side = Math.random() < 0.5 ? -1 : 1;
            const spread = 6 + Math.random() * 22;
            const back = 6 + Math.random() * 10;
            const ex = -dy * side * spread - dx * back;
            const ey = dx * side * spread - dy * back;
            const span = document.createElement("span");
            span.className = "trail-glyph";
            span.textContent = TRAIL_CHARS[Math.floor(Math.random() * TRAIL_CHARS.length)];
            span.style.left = `${mx}px`;
            span.style.top = `${my}px`;
            span.style.setProperty("--ex", `${ex}px`);
            span.style.setProperty("--ey", `${ey}px`);
            span.style.color = Math.random() < 0.7 ? "var(--accent)" : "var(--accent2)";
            trailContainer.appendChild(span);
            span.addEventListener("animationend", () => span.remove());
            queue.push(span);
            if (queue.length > 40) queue.shift()?.remove();
          }
        } else {
          lastX = mx; lastY = my;
        }
        const target = e.target as HTMLElement;
        const hoverTarget = target.closest?.("a,button,.clickable,input,.skilltile");
        dot.classList.toggle("hover", !!hoverTarget);
      };
      window.addEventListener("mousemove", onMove);
      cleanups.push(() => window.removeEventListener("mousemove", onMove));
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
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;

        if (!reduced) {
          if (t > nextCometAt) {
            spawnComet();
            nextCometAt = t + 5 + Math.random() * 9;
          }
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
        let raf = requestAnimationFrame(function loop(t) {
          draw(t / 1000);
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
    const heroEl = document.querySelector<HTMLElement>(".hero");
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

    // draggable hero terminal
    const term = heroTermRef.current, bar = heroTermBarRef.current;
    if (term && bar) {
      let dragging = false, ox = 0, oy = 0, curX = 0, curY = 0;
      const onDown = (e: PointerEvent) => {
        dragging = true;
        bar.setPointerCapture(e.pointerId);
        ox = e.clientX - curX; oy = e.clientY - curY;
        term.style.transition = "none";
      };
      const onDragMove = (e: PointerEvent) => {
        if (!dragging) return;
        curX = e.clientX - ox; curY = e.clientY - oy;
        const max = 90;
        curX = Math.max(-max, Math.min(max, curX));
        curY = Math.max(-max, Math.min(max, curY));
        term.style.left = `${curX}px`; term.style.top = `${curY}px`; term.style.position = "relative";
      };
      const onUp = (e: PointerEvent) => {
        dragging = false;
        bar.releasePointerCapture(e.pointerId);
        term.style.transition = "";
      };
      bar.addEventListener("pointerdown", onDown);
      bar.addEventListener("pointermove", onDragMove);
      bar.addEventListener("pointerup", onUp);
      cleanups.push(() => {
        bar.removeEventListener("pointerdown", onDown);
        bar.removeEventListener("pointermove", onDragMove);
        bar.removeEventListener("pointerup", onUp);
      });
    }

    // term-link click delegation (raw-HTML regions React doesn't own)
    [heroBootRef.current, gateBootRef.current].forEach((container) => {
      if (!container) return;
      const onClick = (e: MouseEvent) => {
        const link = (e.target as HTMLElement).closest<HTMLElement>(".term-link");
        const sel = link?.dataset.t;
        if (sel) document.querySelector(sel)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      };
      container.addEventListener("click", onClick);
      cleanups.push(() => container.removeEventListener("click", onClick));
    });

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

    // kick off: gate boot (if still open per the layout effect's decision) or hero boot directly
    if (gateOpenRef.current) gBoot(0);
    else startHeroBoot();

    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={cursorDotRef} aria-hidden="true" />
      <div id="cursorTrail" ref={cursorTrailRef} aria-hidden="true" />
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
            onClick={() =>
              document.getElementById(p.id)?.scrollIntoView({ behavior: reducedRef.current ? "auto" : "smooth" })
            }
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

      <nav className="pf-nav">
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
              >
                {n.label}
              </a>
            ))}
          </div>
          <div className="nav-right">
            <button className="kbd-hint clickable" type="button" aria-label="Open command palette" onClick={() => setPaletteOpen(true)}>
              <span>{modKey}</span>K
            </button>
            <a className="btn solid" href="#contact">Get in touch</a>
          </div>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="aurora a1" ref={a1Ref} />
        <div className="aurora a2" ref={a2Ref} />
        <div className="pf-wrap">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="kicker reveal"><span className="pulse" />FULL-STACK ENGINEER · MOBILE + WEB · DAVAO CITY, PH</div>
              <h1 className="reveal">Mark Levi Rowse<br /><span className="grad">M. Ramos</span></h1>
              <p className="tagline reveal">
                Full-stack software engineer who takes products from a rough spec all the way to release —
                across Flutter, .NET, and modern web. Comfortable in unfamiliar stacks and the parts most
                people skip.
              </p>
              <div className="hero-cta">
                <a className="btn solid reveal clickable" href="#projects">View my projects</a>
                <a className="btn reveal clickable" href={GITHUB} target="_blank" rel="noreferrer"><FaGithub /> GitHub</a>
                <a className="btn reveal clickable" href={LINKEDIN} target="_blank" rel="noreferrer"><FaLinkedinIn /> LinkedIn</a>
              </div>
            </div>

            <div
              className="terminal reveal"
              ref={heroTermRef}
              style={{ transitionDelay: "120ms" }}
              onClick={() => {
                if (window.getSelection()?.toString()) return; // don't yank focus mid text-selection
                heroTermInputRef.current?.focus();
              }}
            >
              <div className="term-bar" ref={heroTermBarRef}>
                <span className="dot r" /><span className="dot y" /><span className="dot g" />
                <span className="term-title">guest@mark-ramos: ~</span>
              </div>
              <div className="term-body" ref={heroBootRef} />
              <div className="term-inputline">
                <span className="prompt">guest@mark-ramos:~$</span>
                <input
                  ref={heroTermInputRef}
                  className="term-input clickable"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Terminal command input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
                      runCommand(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <span className="term-caret" />
              </div>
            </div>
          </div>

          <div className="glance">
            <div className="stat reveal"><div className="big">~2 yrs</div><div className="lbl">building &amp; shipping in production</div></div>
            <div className="stat reveal"><div className="big">Mobile + Web</div><div className="lbl">full-stack across platforms</div></div>
            <div className="stat reveal"><div className="big mono">CI/CD</div><div className="lbl">owns mobile releases &amp; deploys</div></div>
            <div className="stat reveal"><div className="big mono">AI-assisted</div><div className="lbl">spec-driven dev workflow</div></div>
          </div>
        </div>
      </header>

      <section id="projects" className="pf-section">
        <div className="pf-wrap">
          <div className="sec-head reveal"><span className="sec-num">01</span><span className="sec-title">Selected Projects</span><span className="sec-sub">tilt a card</span></div>
          <div className="projects">
            {projects.map((p, i) => {
              const hasModal = !!(p.images?.length || p.terminal);
              const showThumbImage = !!p.images?.length;
              const overlay = p.images?.length
                ? (p.imagesLabel ?? "View screenshots →")
                : p.terminal
                ? (p.imagesLabel ?? "View install →")
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
                      <Lock size={34} color={p.glyphColor} strokeWidth={1.5} />
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
            })}
          </div>
        </div>
      </section>

      <section id="experience" className="pf-section alt">
        <div className="pf-wrap">
          <div className="sec-head reveal"><span className="sec-num">02</span><span className="sec-title">Experience</span></div>
          <div className="tl">
            {experience.map((j) => (
              <div className="item reveal" key={j.company}>
                <div className="top">
                  <div><div className="r">{j.role}</div><div className="co">{j.company}</div></div>
                  <div className="dt">{j.dates}</div>
                </div>
                <p>{j.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="pf-section">
        <div className="pf-wrap">
          <div className="sec-head reveal"><span className="sec-num">03</span><span className="sec-title">Skills</span><span className="sec-sub">move your cursor over the grid</span></div>
          <div className="skillgrid">
            {skills.map(({ name, Icon, color }) => (
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
                <div className="logo"><Icon size={34} color={color} /></div>
                <div className="nm">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="pf-wrap">
          <pre className="ascii-art ascii-float reveal" aria-hidden="true" style={{ width: `${GALAXY_COLS}ch` }} ref={galaxyContactRef} />
          <h2 className="reveal">Let&apos;s build something.</h2>
          <div className="term-flavor reveal"><span className="p">guest@mark-ramos:~$</span> contact --send</div>
          <div className="row">
            <a className="btn solid reveal clickable" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a className="btn reveal clickable" href={GITHUB} target="_blank" rel="noreferrer"><FaGithub /> GitHub</a>
            <a className="btn reveal clickable" href={LINKEDIN} target="_blank" rel="noreferrer"><FaLinkedinIn /> LinkedIn</a>
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
          ) : (
            <div className="lb-panel" onClick={(e) => e.stopPropagation()}>
              <div className="lb-carousel">
                {(lb.images?.length ?? 0) > 1 && (
                  <button className="lb-arrow left" onClick={(e) => { e.stopPropagation(); stepLb(-1); }} aria-label="Previous">&#8249;</button>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={lb.images![lb.i]} alt={`${lb.title} screenshot ${lb.i + 1}`} />
                {(lb.images?.length ?? 0) > 1 && (
                  <button className="lb-arrow right" onClick={(e) => { e.stopPropagation(); stepLb(1); }} aria-label="Next">&#8250;</button>
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
          )}
        </div>
      )}
    </>
  );
}
