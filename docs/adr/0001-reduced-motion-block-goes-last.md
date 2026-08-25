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
- **Mobile plus reduced motion now resolves in favour of reduced motion.** The block sits
  after `@media (max-width: 760px)`. Nothing conflicts today (`.pro-rail { left: 20px }`
  versus `display: none` are different properties), but a future narrow-screen rule
  touching the same property as a reduced-motion rule will lose.
- **The fallback layout is now reachable for the first time.** It was unreachable code
  from the day it was written, so it had never been looked at. It renders correctly at
  1400×900 and at 375×812, checked with `prefers-reduced-motion` emulated — but it has no
  further history than that, and the rest of the page's reduced-motion behaviour below the
  prologue was not re-audited.
- **Six of the seven overrides changed behaviour with no visual regression risk in the
  default path**, because the whole block is inert unless the visitor has reduced motion
  on. The change cannot affect anyone who was seeing the site correctly.
- The second reduced-motion block, the one covering the contact finale, was already
  positioned after the rules it overrides and needed no change. It was checked, not
  assumed.
