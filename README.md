# STILL

Still is a reflective project that turns everyday sights into calm, soulful moments—inviting you to pause, feel connected to time, and notice human continuity in what you see.

## Features
- Camera capture (stays on your device)
- Simple image cues (brightness, warmth, texture) shape tone
- Soulful 4–6 line reflections, no object naming or facts
- Save moments locally with a small snapshot and text
- Clear saved moments from the local gallery

## Quick Start

### Option A: Python simple server
```bash
python3 -m http.server 5173
```
Open http://localhost:5173 in your browser.

### Option B: Node (no dependencies)
```bash
node test_reflection.js
# Then open the HTML via any static server or your editor's Live Server.
```

## Test the reflection generator
3. Run tests:
```bash
npm test
# Or if you don't have Node.js locally, serve the directory and open tests/runner.html
```
This prints sample reflections based on synthetic features and verifies constraints (4-6 lines, no banned words).

## Structure
- [index.html](index.html)
- [styles.css](styles.css)
- [src/app.js](src/app.js)
- [src/reflection.js](src/reflection.js)
- [dev.html](dev.html)
- [test_reflection.js](test_reflection.js)
- [package.json](package.json)

## Notes
- The generator avoids naming objects and technical facts.
- It uses present-tense, sensory language to ground attention.
- Saved moments are stored in your browser (localStorage).
- Use the Clear button to remove all saved moments.
