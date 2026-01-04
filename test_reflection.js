import { generateReflection } from './src/reflection.js';

const cases = [
  { brightness: 0.8, warmness: 0.7, edges: 0.4, grain: 0.1, seed: 0.123 },
  { brightness: 0.3, warmness: 0.3, edges: 0.7, grain: 0.2, seed: 0.456 },
  { brightness: 0.5, warmness: 0.5, edges: 0.5, grain: 0.3, seed: 0.789 },
];

for (const f of cases) {
  const text = generateReflection(f);
  const lines = text.split('\n');
  console.log('--- Reflection (' + lines.length + ' lines) ---');
  console.log(text);
  console.log();
}
