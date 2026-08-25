---
status: accepted
---

# The reduced-motion block goes last in globals.css

The prologue is a scroll-scrubbed sticky stage: `.prologue` is `960vh`, `.pstage` is
`position: sticky`, and the six `.beat` elements are `position: absolute` and cross-faded
by inline opacity that the scrub effect writes on every frame. Under
`prefers-reduced-motion: reduce` the scrub deliberately bails
(`src/app/page.tsx`, the prologue-scrub effect), so a CSS fallback has to unstack the
prologue into a plain vertical document instead.

That fallback existed but did not work. The `@media (prefers-reduced-motion: reduce)`
block sat at line 57 of `globals.css`, while every rule it overrides — `.prologue`,
`.pstage`, `.beat`, `.pstep`, `.pstage-inner`, `.pro-rail`, `.skip-pro` — is defined from
line 144 onward. Equal specificity, so the later rule won and the fallback was dead. Only
`.beat { opacity: 1 !important }` got through, which is the worst possible subset: all six
beats visible at once, still absolutely positioned, overlapping in one viewport, with the
JS that would have faded them never running.

It shipped that way because the author's browser has reduced motion off. It was reported
by a visitor whose OS has "animation effects" disabled — a machine-level Windows setting,
not a browser one, so it is not rare.

## Considered options

- **`!important` on each declaration in place.** Wins the same cascade fight without
  moving anything. Rejected: it is a larger diff than the move, and it permanently
  forfeits the ability to override those rules later — the next narrow-viewport or
  print rule that needs to touch `.pstage` would have to escalate too.
- **Split the query and put each piece directly after the rule it overrides.** Genuinely
  order-independent, and immune to the failure that caused this bug. Rejected for now:
  it scatters the fallback across six places in the file, so "what does reduced motion
  do to the prologue" stops being answerable by reading one block. Revisit if the
  fallback grows past a screenful or if this bug recurs.
- **`@layer` to make the cascade explicit.** The correct long-term shape. Rejected as
  out of scope: `globals.css` is otherwise unlayered, so this would mean layering the
  whole file to fix one block.
- **Move the block to the end of the file (chosen).** One relocation, no new
  `!important`, all seven overrides start working, and the fallback stays readable as a
  single unit.

## Consequences

- **The block is now position-dependent.** Appending any rule for `.prologue`,
  `.pstage`, `.beat`, or `.pstep` below it silently reintroduces this bug. A comment
  above the block says so, and that comment is the only guard — there is no test.
- **Mobile plus reduced motion now resolves in favour of reduced motion**, and two
  same-property conflicts already exist. An earlier draft of this ADR claimed there were
  none; that was wrong, and the bigger of the two is the best thing about this change:
  - `@media (max-width: 760px) { .pstep { display: none } }` versus reduced-motion
    `.pstep { display: grid }`. The mobile path shows a step only when JS adds `.on`, and
    that JS bails under reduced motion — so **before this move, a phone with reduced
    motion rendered the whole "how I work" and "the build" beats as blank space.** Not
    overlapping text: nothing at all. Reduced motion now wins and the steps render.
  - `@media (max-width: 760px) { .pstage { padding-bottom: 52px } }` versus reduced-motion
    `.pstage { padding: 80px 0 }`. The shorthand now overrides that mobile tuning. Minor,
    but it is a real regression in narrow-screen spacing and it was not intended.

  A future narrow-screen rule touching the same property as a reduced-motion rule will
  lose the same way. That is the standing cost of the ordering.
- **The fallback layout is now reachable for the first time**, which means its own latent
  bugs are reachable too. It was unreachable code from the day it was written, so it had
  never been looked at. It renders at 1400×900 and at 375×812 with
  `prefers-reduced-motion` emulated — but making it reachable immediately surfaced two of
  its own latent bugs, both fixed here:
  - It restored `opacity` on `.pstep` without restoring `pointer-events`, so every
    newly-visible step was unselectable.
  - It set `.pstage { position: static }`. The two `.aurora` canvases are absolutely
    positioned children of the stage, so a static stage handed their containing block to
    `.prologue` — putting them outside the stage's own `overflow: hidden` and letting a
    decorative orb widen the document by 260px at every viewport. The stage is
    `position: relative` here instead: it still unstacks, and it still contains the orbs.
    Worth remembering as a general rule — **`position: static` is not a neutral value if
    the box has absolutely-positioned children.**

  Expect more of that shape: every rule in this block is being exercised for the first
  time. The rest of the page's reduced-motion behaviour below the prologue has still not
  been re-audited.
- **Six of the seven overrides changed behaviour with no visual regression risk in the
  default path**, because the whole block is inert unless the visitor has reduced motion
  on. The change cannot affect anyone who was seeing the site correctly.
- The second reduced-motion block, the one covering the contact finale, was already
  positioned after the rules it overrides and needed no change. It was checked, not
  assumed.
