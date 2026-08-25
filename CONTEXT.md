# Portfolio — Prologue Context

The vocabulary of the scroll-scrubbed intro. These terms are load-bearing in
`src/app/page.tsx` and `src/app/globals.css` — the scrub effect, the CSS, and the
reduced-motion fallback all address the same objects, and they only stay in sync
if they use the same words for them.

## Language

**Gate**:
The boot terminal that covers the viewport on first load — neofetch panel, typed
boot lines, and a "where to" menu. It holds `body { overflow: hidden }` until the
visitor picks a destination, then fades and hands over to the prologue. Tracked by
`gateOpenRef`, and remembered for the session via `sessionStorage.gateSeen`.
_Avoid_: "the loader", "splash" (it is interactive, and it is skippable), "modal".

**Prologue**:
The `960vh` `<header>` that the whole intro scrolls through. It is one tall
scroll region, not a sequence of sections — its height exists purely to buy
scroll distance for the scrub.
_Avoid_: "hero" (that is one beat *inside* the prologue), "intro section".

**Stage**:
The `position: sticky`, `100vh` viewport pinned inside the prologue. Every beat is
painted into this one stage; nothing scrolls past it.
_Avoid_: "slide", "panel", "screen".

**Beat**:
One of the six acts that share the stage — who, what, how, built, stack, ready. A
beat is absolutely positioned in the stage and cross-faded by scroll position.
_Avoid_: "section" (a `.pf-section` is a real document section, further down the
page), "slide", "step" (a step is the sub-unit, below).

**Step**:
A sub-unit *within* a beat, for the two beats that have internal stages — the
seven-stage loop and the three-part project walkthrough. Steps advance only after
their beat has finished fading in, so nothing swaps underneath a cross-fade.
_Avoid_: "beat", "stage" (both are the enclosing units).

**Rail**:
The numbered progress strip above a multi-step beat. The rail holds still while
steps swap under it; its entries take `.on` (current) and `.done` (passed).
_Avoid_: "tabs", "stepper" (nothing is clickable — it is an indicator).

**Scrub**:
Deriving every bit of prologue state from `window.scrollY` rather than from
transitions or timers. This is why scrolling back up replays the intro in reverse
for free, and why there is no animation state to get out of sync.
_Avoid_: "animation", "timeline" (there is no clock; the scroll position *is* the
clock), "parallax".

**Reveal**:
The below-the-prologue fade-up, driven by an `IntersectionObserver` adding `.in`.
Unrelated to the scrub.
_Avoid_: "scroll animation" (ambiguous with the scrub — they are different
mechanisms with different failure modes).

## Relationships

- Exactly one gate, one prologue, one stage. Six beats, two of which have steps.
- Beat opacity is written as an **inline style** by the scrub. The CSS default for
  `.beat` is therefore visible (`opacity: 1`), because a beat with no inline style
  is a beat the scrub never reached.
- The reduced-motion fallback unstacks all of it — the prologue becomes
  `height: auto`, the stage becomes static, and beats and steps become a plain
  vertical document. See `docs/adr/0001-reduced-motion-block-goes-last.md`.
- `.reveal` is imperative once observed: React re-rendering a `className` that
  contains `reveal` drops the observer's `.in` and the element stays hidden. Write
  the class once and let the observer own it.

## Flagged ambiguities

- "Section" was used for both a beat and a `.pf-section`. Resolved: **beat** for
  the prologue's six acts, **section** only for the real document sections
  (Projects, Experience, Skills, Contact).
- "Stage" reads as both the sticky viewport and a step in the seven-stage loop.
  Resolved: the viewport is the **stage**; a unit of the loop is a **step**. The
  loop's *rail labels* still read "01 language … 07 ship" as user-facing copy,
  which is fine — that is the visitor's word, not the code's.
- `LOOP_STAGES` and the `#loopRail` markup are two lists that must stay the same
  length as the `.pstep` children of `#loopStage`. The scrub clamps to the *step*
  count, so a label with no step behind it goes permanently dim and silently
  shifts every caption after it by one. Adding a stage means editing three places.
