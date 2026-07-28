"use client";

import { useCallback, useEffect, useState } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { projects, experience, skills, type Project } from "@/lib/portfolio-data";

const GITHUB = "https://github.com/Levi-Ramos";
const LINKEDIN = "https://www.linkedin.com/in/rowserowserowse/";
const EMAIL = "leviramos59@gmail.com";

type LB = { images: string[]; i: number; title: string };

export default function Home() {
  const [lb, setLb] = useState<LB | null>(null);

  const openProject = (p: Project) => {
    if (p.images && p.images.length) setLb({ images: p.images, i: 0, title: p.name });
  };
  const close = useCallback(() => setLb(null), []);
  const step = useCallback((d: number) => {
    setLb((s) => (s ? { ...s, i: (s.i + d + s.images.length) % s.images.length } : s));
  }, []);

  // scroll-reveal
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
    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // lightbox keyboard nav
  useEffect(() => {
    if (!lb) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lb, close, step]);

  return (
    <>
      <nav className="pf-nav">
        <div className="inner">
          <div className="pf-brand">mark<span>.</span>ramos</div>
          <div className="pf-navlinks">
            <a href="#work">Work</a>
            <a href="#experience">Experience</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
          </div>
          <a className="btn" href="#contact">Get in touch</a>
        </div>
      </nav>

      <header className="hero">
        <div className="aurora a1" />
        <div className="aurora a2" />
        <div className="pf-wrap">
          <div className="kicker reveal"><span className="pulse" />FULL-STACK ENGINEER · MOBILE + WEB · DAVAO CITY, PH</div>
          <h1 className="reveal">Mark Levi Rowse<br /><span className="grad">M. Ramos</span></h1>
          <p className="tagline reveal">
            Full-stack software engineer who takes products from a rough spec all the way to release —
            across Flutter, .NET, and modern web. Comfortable in unfamiliar stacks and the parts most
            people skip.
          </p>
          <div className="hero-cta">
            <a className="btn solid reveal" href="#work">View my work</a>
            <a className="btn reveal" href={GITHUB} target="_blank" rel="noreferrer"><FaGithub /> GitHub</a>
            <a className="btn reveal" href={LINKEDIN} target="_blank" rel="noreferrer"><FaLinkedinIn /> LinkedIn</a>
          </div>

          <div className="glance">
            <div className="stat reveal"><div className="big">~2 yrs</div><div className="lbl">building &amp; shipping in production</div></div>
            <div className="stat reveal"><div className="big">Mobile + Web</div><div className="lbl">full-stack across platforms</div></div>
            <div className="stat reveal"><div className="big mono">CI/CD</div><div className="lbl">owns mobile releases &amp; deploys</div></div>
            <div className="stat reveal"><div className="big mono">AI-assisted</div><div className="lbl">spec-driven dev workflow</div></div>
          </div>
        </div>
      </header>

      <section id="work" className="pf-section">
        <div className="pf-wrap">
          <div className="sec-head reveal"><span className="sec-num">01</span><span className="sec-title">Selected Work</span></div>
          <div className="projects">
            {projects.map((p) => {
              const content = (
                <>
                  <div className="thumb" style={p.images ? { padding: 0, background: "#0a0d14" } : { background: p.grad }}>
                    {p.images ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images[0]} alt={p.name} />
                        <div className="overlay">View screenshots &rarr;</div>
                      </>
                    ) : (
                      <>
                        <span className="glyph" style={{ color: p.glyphColor }}>{p.glyph}</span>
                        {p.link && <div className="overlay">Visit live site &rarr;</div>}
                      </>
                    )}
                    <span className={`badge ${p.badge}`}>{p.status}</span>
                  </div>
                  <div className="proj-body">
                    <h3>{p.name}</h3>
                    <div className="role">{p.role}</div>
                    <p>{p.desc}</p>
                    <div className="tags">{p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
                  </div>
                </>
              );

              if (p.link && !p.images) {
                return (
                  <a key={p.name} className="proj reveal clickable" href={p.link} target="_blank" rel="noreferrer">
                    {content}
                  </a>
                );
              }

              return (
                <div
                  key={p.name}
                  className={`proj reveal${p.images ? " clickable" : ""}`}
                  onClick={() => openProject(p)}
                  role={p.images ? "button" : undefined}
                  tabIndex={p.images ? 0 : undefined}
                  onKeyDown={(e) => { if (p.images && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openProject(p); } }}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="experience" className="pf-section" style={{ background: "var(--bg2)" }}>
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
          <div className="sec-head reveal"><span className="sec-num">03</span><span className="sec-title">Skills</span></div>
          <div className="skillgrid">
            {skills.map(({ name, Icon, color }) => (
              <div className="skilltile reveal" key={name} style={{ ["--b" as string]: color } as React.CSSProperties}>
                <div className="logo"><Icon size={29} color={color} /></div>
                <div className="nm">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="pf-wrap">
          <h2 className="reveal">Let&apos;s build something.</h2>
          <p className="reveal">The fastest way to reach me:</p>
          <div className="row">
            <a className="btn solid reveal" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a className="btn reveal" href={GITHUB} target="_blank" rel="noreferrer"><FaGithub /> GitHub</a>
            <a className="btn reveal" href={LINKEDIN} target="_blank" rel="noreferrer"><FaLinkedinIn /> LinkedIn</a>
          </div>
        </div>
      </section>

      <footer className="pf-footer">© 2026 Mark Levi Rowse M. Ramos · Davao City, Philippines</footer>

      {lb && (
        <div className="lightbox" onClick={close}>
          <button className="lb-close" onClick={close} aria-label="Close">&times;</button>
          {lb.images.length > 1 && (
            <button className="lb-arrow left" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous">&#8249;</button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lb.images[lb.i]} alt={`${lb.title} screenshot ${lb.i + 1}`} onClick={(e) => e.stopPropagation()} />
          {lb.images.length > 1 && (
            <button className="lb-arrow right" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next">&#8250;</button>
          )}
          <div className="lb-dots">
            {lb.images.map((_, i) => <span key={i} className={`lb-dot${i === lb.i ? " active" : ""}`} />)}
          </div>
        </div>
      )}
    </>
  );
}
