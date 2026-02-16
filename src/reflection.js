// Enhanced reflection generator with REAL AI vision
// Uses Google Gemini Flash for image analysis and poetic narrative generation

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }

// Gemini API configuration
const GEMINI_API_KEY = 'AIzaSyDVW9H8oGr0fliOH5qk-yi0AUAVhEFWClI'; // Free tier API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Real AI vision using Google Gemini
async function analyzeImageWithAI(imageDataUrl) {
  try {
    // Extract base64 image data (remove the data:image/jpeg;base64, prefix)
    const base64Image = imageDataUrl.split(',')[1];

    // Prompt for Gemini to analyze image and generate poetic reflection
    const prompt = `Look at this image carefully. Identify what you see - be specific (e.g., "a tabby cat sleeping", "a person's hand", "a wooden floor", "rain on a window").

Then write a beautiful, simple reflection about it (2-3 sentences max). The reflection should:
- Be accessible and touching, not overly poetic or complex
- Connect the object to time, human experience, or a new perspective
- Feel like it helps people pause and appreciate small things
- Be relevant to what's actually in the image

Examples of the style:
- For a cat: "Cats have been curling up in warm spots for thousands of years. This one doesn't worry about yesterday or tomorrow. Just warmth, just now."
- For a hand: "Your hands have held so many things - some you remember, some forgotten. They've learned, built, and reached out. They tell a story only you know."
- For a floor: "How many footsteps have crossed this spot? People rushing to somewhere important, or just wandering home. You're one of them."

Now look at the image and write your reflection:`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 200,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text.trim();

    return {
      name: 'analyzed',
      confidence: 0.95,
      poetic_fact: generatedText
    };

  } catch (error) {
    console.error('AI analysis failed:', error);
    throw error; // Let it fall back to feature-based
  }
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

      // Use the AI result directly - it's already beautiful and accessible
      return {
        text: aiResult.poetic_fact,
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
