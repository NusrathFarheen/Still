// Reflection generator tuned by simple image features.
// Constraints:
// - Present-tense, sensory verbs for immediacy
// - 4–6 short lines
// - No object names, no technical facts unless they add meaning
// - Soft, grounded tone; connects time, people, continuity

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }

export function generateReflection(features) {
  const {
    brightness = 0.5,       // 0..1
    warmness = 0.5,         // 0..1 (higher = warm)
    edges = 0.5,            // 0..1 (visual detail)
    grain = 0.0,            // noise level heuristic
    seed = Math.random(),   // randomizer
  } = features || {};

  const r = (n = 1) => {
    const x = Math.sin(seed * 1000 + n * 13.37) * 10000;
    return x - Math.floor(x);
  };

  const moodLight = brightness > 0.7 ? "light leans in" : brightness < 0.3 ? "quiet gathers" : "the day holds steady";
  const tempLine = warmness > 0.65 ? "warmth settles on the edges" : warmness < 0.35 ? "cool air steadies the breath" : "the air waits without hurry";
  const detailSense = edges > 0.65 ? "small textures speak softly" : edges < 0.3 ? "shapes blur into gentleness" : "stillness lives in the in‑between";

  const isNight = brightness < 0.35 && warmness < 0.55;
  const isDay = brightness > 0.7 && warmness > 0.6;
  const isWeathered = grain > 0.25 && edges > 0.6 && !isDay;
  const isDawn = brightness > 0.35 && brightness < 0.6 && warmness > 0.6;
  const isDusk = brightness > 0.3 && brightness < 0.5 && warmness < 0.5;

  const timeLinePool = [
    "This has been here longer than today's worries.",
    "It has watched people arrive and drift away.",
    "Others stood near this and felt their own breath.",
    "What endures does not need to announce itself.",
    "Someone before you paused here, someone after will too.",
  ];
  const presenceCore = [
    `I hear ${moodLight}.`,
    `${tempLine}.`,
    `${detailSense}.`,
    "Hands learn to rest when eyes do.",
    "Breath comes back to its simple rhythm.",
    "Quiet is not empty; it is patient.",
  ];
  const presenceNight = [
    "Soft dark folds around the edges.",
    "Voices fade; breath stays.",
    "Evening remembers those who passed gently here.",
  ];
  const presenceDay = [
    "Morning steadies the heart.",
    "Light touches and moves on without hurry.",
    "Today is enough as it is.",
  ];
  const presenceDawn = [
    "Early light arrives without asking for attention.",
    "Morning breathes in gently and lets go.",
    "Newness does not hurry; it opens slowly.",
  ];
  const presenceDusk = [
    "Edges soften; the day releases its hold.",
    "Evening gathers small details into quiet.",
    "What remains is enough to be with.",
  ];
  const presenceWeathered = [
    "A slow patter hums in the background.",
    "Textures gather stories without needing to be told.",
    "The air asks you to listen, not to name.",
  ];
  const presencePool = [
    ...presenceCore,
    ...(isNight ? presenceNight : []),
    ...(isDay ? presenceDay : []),
    ...(isDawn ? presenceDawn : []),
    ...(isDusk ? presenceDusk : []),
    ...(isWeathered ? presenceWeathered : []),
  ];
  const groundingPool = [
    "You are here, not yesterday, not later.",
    "There is enough time to feel this.",
    "Nothing rushes you but the mind; let it pass.",
    "The moment does not ask for more than presence.",
    "Stay until you notice what is already kind.",
  ];

  const pick = (arr, t = r()) => arr[Math.floor(clamp(t, 0, 0.999) * arr.length)];

  const lines = [];
  lines.push(pick(timeLinePool, r(1)));
  lines.push(pick(presencePool, r(2)));

  const extraLine = r(3) > 0.4 ? pick(presencePool, r(4)) : pick(groundingPool, r(5));
  lines.push(extraLine);

  const addFourth = r(6) > 0.3;
  const addFifth = r(7) > lerp(0.2, 0.6, edges);
  const addSixth = r(8) > lerp(0.1, 0.5, 1 - brightness);

  if (addFourth) lines.push(pick(groundingPool, r(9)));
  if (addFifth) lines.push(pick(timeLinePool, r(10)));
  if (addSixth) lines.push("Let the present be enough for now.");

  const finalLines = lines.slice(0, clamp(lines.length, 4, 6));
  const text = finalLines.join("\n");
  return sanitize(text);
}

function sanitize(text) {
  const banned = [
    'tree','car','phone','cup','book','street','building','chair','table','lamp','flower','computer','screen','keyboard','bottle','shoe','bag','window','door'
  ];
  const neutral = [
    "Quiet is not empty; it is patient.",
    "You are here, not yesterday, not later.",
    "There is enough time to feel this.",
    "Let the present be enough for now.",
  ];
  const hasBanned = (line) => banned.some(w => line.toLowerCase().includes(w));
  const replaceLine = (line, i) => hasBanned(line) ? neutral[i % neutral.length] : line;
  return text
    .split('\n')
    .map((l, i) => replaceLine(l, i))
    .join('\n');
}
