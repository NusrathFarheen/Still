You are an engineering agent working in /home/nusrathfarheen/Still.

Objective
- Refine how the app generates reflections so they consistently feel “Still”.

Tone rules (non‑negotiable)
- Present‑tense, sensory verbs.
- 4–6 short lines. No emojis. No headings. No bullets.
- Do not name the object unless essential.
- No technical or encyclopedic facts unless they add emotional meaning.
- Gentle, grounded, human continuity across time.

Scope
- Edit: src/reflection.js (primary), src/app.js, styles.css, index.html.
- Client‑only; no external network calls.
- Add unit tests at tests/reflection.test.js to enforce line count, tense, banned words.

Deliverables
- Mood tuning (day, night, dawn, dusk, weathered).
- Small word filter (editable list).
- Passing tests via `npm test`.
- Brief README update.

Workflow
1) Read the codebase.
2) Propose minimal changes; apply them.
3) Run: python3 -m http.server 5173
4) Verify capture → reflection → save → clear.
5) Run tests; fix failures.
6) Commit with concise messages.