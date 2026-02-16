// Enhanced reflection generator with AI integration
// Now includes object recognition and personalized narrative generation

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }

// Mock AI vision API - will be replaced with real API later
async function analyzeImageWithAI(imageDataUrl, features) {
  // TODO: Replace with real Google Cloud Vision API call
  // For now, use image features to make an educated guess

  await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API delay

  // Use image features to guess what we're looking at
  const { brightness, warmness, edges, grain } = features;

  // Simple heuristic-based object detection
  let detectedObject;

  if (brightness > 0.7 && warmness > 0.6) {
    // Bright and warm = likely sky, sunset, or sunny scene
    detectedObject = brightness > 0.85 ? 'sky' : 'sunset';
  } else if (warmness > 0.65 && edges < 0.4) {
    // Warm and soft = likely person, pet, or cozy object
    detectedObject = Math.random() > 0.5 ? 'person' : 'coffee';
  } else if (edges > 0.6 && grain > 0.3) {
    // High detail and texture = tree, building, or textured object
    detectedObject = brightness < 0.4 ? 'building' : 'tree';
  } else if (warmness < 0.4 && brightness < 0.4) {
    // Cool and dark = night scene or water
    detectedObject = 'night';
  } else {
    // Default to common objects
    const commonObjects = ['book', 'flower', 'street', 'window'];
    detectedObject = commonObjects[Math.floor(Math.random() * commonObjects.length)];
  }

  // Simpler, more beautiful reflections (not overly poetic)
  const reflections = {
    'tree': `This tree has been here longer than you have. It watched seasons change, storms pass, and people come and go. Right now, it's just here—steady and patient.`,

    'sky': `The same sky that's above you now was here before cities existed. Everyone who ever lived has looked up at it. It makes us all feel small and connected at once.`,

    'sunset': `The sun doesn't try to be beautiful—it just is. This same moment of golden light has marked the end of millions of days. Yours is one of them.`,

    'person': `Every person you see carries a whole life you'll never know. They have memories, dreams, and stories that would fill books. You just crossed paths for this one moment.`,

    'coffee': `Someone grew these beans, someone shipped them, someone roasted them. A lot of quiet work went into this simple moment of warmth in your hands.`,

    'book': `Between these pages, someone spent months or years of their life. Now those thoughts can live in your mind. That's kind of magical when you think about it.`,

    'flower': `This flower doesn't know it's beautiful. It just exists, blooming for a brief moment. That's all it needs to do.`,

    'building': `People designed this, built it brick by brick, and now it stands. Others have walked past it thousands of times. You're just one of them.`,

    'street': `How many footsteps have worn down this path? People rushing, strolling, meeting, leaving. You're walking where countless others have walked before.`,

    'night': `The quiet of night has a different feeling. The world slows down. The same darkness that covers you now has covered people for thousands of years.`,

    'window': `Windows frame little pieces of the world. Someone looked through this window yesterday, maybe thinking about something completely different than you are now.`,
  };

  return {
    name: detectedObject,
    confidence: 0.85 + Math.random() * 0.15,
    poetic_fact: reflections[detectedObject] || reflections['sky']
  };
}

// Generate reflection combining AI analysis with visual features
export async function generateReflection(features, imageDataUrl = null) {
  const {
    brightness = 0.5,
    warmness = 0.5,
    edges = 0.5,
    grain = 0.0,
    seed = Math.random(),
  } = features || {};

  const r = (n = 1) => {
    const x = Math.sin(seed * 1000 + n * 13.37) * 10000;
    return x - Math.floor(x);
  };

  // If image data is provided, try AI analysis
  if (imageDataUrl) {
    try {
      const aiResult = await analyzeImageWithAI(imageDataUrl);

      // Enhance the poetic fact with visual context
      const moodModifier = brightness > 0.7
        ? "In this gentle light, "
        : brightness < 0.3
          ? "Even in shadow, "
          : "";

      const warmthModifier = warmness > 0.65
        ? "Warmth gathers here. "
        : warmness < 0.35
          ? "Cool stillness surrounds it. "
          : "";

      return {
        text: `${moodModifier}${aiResult.poetic_fact}`,
        object: aiResult.name,
        confidence: aiResult.confidence
      };
    } catch (error) {
      console.warn('AI analysis failed, falling back to feature-based reflection', error);
    }
  }

  // Fallback to original feature-based reflection
  const moodLight = brightness > 0.7 ? "light leans in" : brightness < 0.3 ? "quiet gathers" : "the day holds steady";
  const tempLine = warmness > 0.65 ? "warmth settles on the edges" : warmness < 0.35 ? "cool air steadies the breath" : "the air waits without hurry";
  const detailSense = edges > 0.65 ? "small textures speak softly" : edges < 0.3 ? "shapes blur into gentleness" : "stillness lives in the in‑between";

  const isNight = brightness < 0.35 && warmness < 0.55;
  const isDay = brightness > 0.7 && warmness > 0.6;
  const isWeathered = grain > 0.25 && edges > 0.6 && !isDay;
  const isDawn = brightness > 0.35 && brightness < 0.6 && warmness > 0.6;
  const isDusk = brightness > 0.3 && brightness < 0.5 && warmness < 0.5;
  const isLiving = warmness > 0.4 && edges < 0.6;

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
  const presenceLiving = [
    "A quiet pulse moves beneath the surface.",
    "Life rests here without worry.",
    "Warmth gathers where the heart beats.",
    "Soft breath rises and falls.",
    "There is a gentle knowing in this silence.",
  ];

  const presencePool = [
    ...presenceCore,
    ...(isNight ? presenceNight : []),
    ...(isDay ? presenceDay : []),
    ...(isDawn ? presenceDawn : []),
    ...(isDusk ? presenceDusk : []),
    ...(isWeathered ? presenceWeathered : []),
    ...(isLiving ? presenceLiving : []),
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
  lines.push(pick(groundingPool, r(3)));
  lines.push(r(4) > 0.5 ? pick(presencePool, r(5)) : pick(timeLinePool, r(6)));

  const addFifth = r(7) > lerp(0.2, 0.6, edges);
  const addSixth = r(8) > lerp(0.1, 0.5, 1 - brightness);

  if (addFifth) lines.push(pick(groundingPool, r(9)));
  if (addSixth) lines.push("Let the present be enough for now.");

  const uniqueLines = [...new Set(lines)];
  while (uniqueLines.length < 4) {
    uniqueLines.push(pick(presencePool, Math.random()));
  }

  const finalLines = uniqueLines.slice(0, clamp(uniqueLines.length, 4, 6));
  const text = finalLines.join("\n");

  return {
    text: sanitize(text),
    object: null,
    confidence: 0
  };
}

function sanitize(text) {
  const banned = [
    'tree', 'car', 'phone', 'cup', 'book', 'street', 'building', 'chair', 'table', 'lamp', 'flower', 'computer', 'screen', 'keyboard', 'bottle', 'shoe', 'bag', 'window', 'door'
  ];
  const neutral = [
    "Quiet is not empty; it is patient.",
    "You are here, not yesterday, not later.",
    "There is enough time to feel this.",
    "Let the present be enough for now.",
  ];

  const hasBanned = (line) => {
    const lower = line.toLowerCase();
    return banned.some(w => {
      const regex = new RegExp(`\\b${w}\\b`, 'i');
      return regex.test(lower);
    });
  };

  const replaceLine = (line, i) => hasBanned(line) ? neutral[i % neutral.length] : line;
  return text
    .split('\n')
    .map((l, i) => replaceLine(l, i))
    .join('\n');
}
