import { generateReflection } from './reflection.js';
import { createCompositeImage, downloadImage } from './imageOverlay.js';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const output = document.getElementById('output');
const captureBtn = document.getElementById('captureBtn');
const againBtn = document.getElementById('againBtn');
const saveBtn = document.getElementById('saveBtn');
const permissionHint = document.getElementById('permissionHint');
const galleryRoot = document.getElementById('gallery');
const clearBtn = document.getElementById('clearBtn');

async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    video.srcObject = stream;
    permissionHint.classList.add('hidden');
  } catch (err) {
    permissionHint.classList.remove('hidden');
    output.textContent = 'Camera permission is needed to pause with an image.';
  }
}

function getFeaturesFromFrame() {
  const w = Math.min(640, video.videoWidth || 640);
  const h = Math.round((video.videoHeight || 480) * (w / (video.videoWidth || 640)));
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, w, h);
  const img = ctx.getImageData(0, 0, w, h);
  const data = img.data;

  let sumLuma = 0;
  let sumWarm = 0;
  let edges = 0;
  let grain = 0;

  const sobel = (x, y) => {
    const g = (ix, iy) => {
      const i = (iy * w + ix) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      return 0.2126 * r + 0.7152 * g + 0.0722 * b; // luma
    };
    const xm1 = Math.max(0, x - 1), xp1 = Math.min(w - 1, x + 1);
    const ym1 = Math.max(0, y - 1), yp1 = Math.min(h - 1, y + 1);
    const gx = -g(xm1, ym1) - 2 * g(xm1, y) - g(xm1, yp1) + g(xp1, ym1) + 2 * g(xp1, y) + g(xp1, yp1);
    const gy = -g(xm1, ym1) - 2 * g(x, ym1) - g(xp1, ym1) + g(xm1, yp1) + 2 * g(x, yp1) + g(xp1, yp1);
    return Math.sqrt(gx * gx + gy * gy);
  };

  // Sample grid for performance
  const step = 4;
  let samples = 0;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      sumLuma += luma;
      // Warm/cool heuristic: red vs blue bias
      sumWarm += Math.max(0, r - b);
      edges += sobel(x, y);
      samples++;
    }
  }

  const avgLuma = sumLuma / samples / 255;
  const avgWarm = sumWarm / samples / 255;
  const edgeNorm = Math.min(1, edges / (samples * 50));

  // Grain: variance of luma on coarse grid
  let sum2 = 0; let sumSq = 0; let n = 0;
  for (let y = 0; y < h; y += step * 4) {
    for (let x = 0; x < w; x += step * 4) {
      const i = (y * w + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      sum2 += l; sumSq += l * l; n++;
    }
  }
  const mean = sum2 / Math.max(1, n);
  const variance = sumSq / Math.max(1, n) - mean * mean;
  grain = Math.max(0, Math.min(1, variance * 4));

  return {
    brightness: Math.max(0, Math.min(1, avgLuma)),
    warmness: Math.max(0, Math.min(1, avgWarm)),
    edges: edgeNorm,
    grain,
    seed: Math.random(),
  };
}

function showReflection(text) {
  output.textContent = text;
  againBtn.classList.remove('hidden');
  saveBtn.classList.remove('hidden');
}

captureBtn.addEventListener('click', async () => {
  captureBtn.disabled = true;
  output.textContent = 'Finding beauty in this moment...';

  const features = getFeaturesFromFrame();

  // Get image data URL for AI analysis
  const w = Math.min(640, video.videoWidth || 640);
  const h = Math.round((video.videoHeight || 480) * (w / (video.videoWidth || 640)));
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, w, h);
  const imageDataUrl = canvas.toDataURL('image/jpeg', 0.85);

  // Generate reflection with AI
  const result = await generateReflection(features, imageDataUrl);
  const text = typeof result === 'string' ? result : result.text;

  showReflection(text);
  captureBtn.disabled = false;
});

againBtn.addEventListener('click', () => {
  output.textContent = '';
  againBtn.classList.add('hidden');
  saveBtn.classList.add('hidden');
});

initCamera();

function readMoments() {
  try {
    const raw = localStorage.getItem('still-moments');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeMoments(arr) {
  localStorage.setItem('still-moments', JSON.stringify(arr));
}

function renderGallery() {
  if (!galleryRoot) return;
  const moments = readMoments();
  galleryRoot.innerHTML = '';
  moments.slice().reverse().forEach(m => {
    const card = document.createElement('div');
    card.className = 'card';
    const img = document.createElement('img');
    img.src = m.image;
    img.alt = 'Saved moment image';
    const text = document.createElement('div');
    text.className = 'text';
    text.textContent = m.text;
    const meta = document.createElement('div');
    meta.className = 'meta';
    const d = new Date(m.ts);
    meta.textContent = d.toLocaleString();
    card.appendChild(img);
    card.appendChild(text);
    card.appendChild(meta);
    galleryRoot.appendChild(card);
  });
}

saveBtn?.addEventListener('click', async () => {
  try {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Creating beautiful memory...';

    // Get current frame
    const w = Math.min(640, video.videoWidth || 640);
    const h = Math.round((video.videoHeight || 480) * (w / (video.videoWidth || 640)));
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    const baseImageUrl = canvas.toDataURL('image/jpeg', 0.85);

    // Create composite image with text overlay
    const compositeImageUrl = await createCompositeImage(
      baseImageUrl,
      output.textContent || ''
    );

    // Save to localStorage gallery
    const moments = readMoments();
    moments.push({
      text: output.textContent || '',
      image: compositeImageUrl,
      ts: Date.now()
    });
    writeMoments(moments);
    renderGallery();

    // Also trigger download for mobile users
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    downloadImage(compositeImageUrl, `still-moment-${timestamp}.jpg`);

    saveBtn.textContent = 'Save this moment';
    saveBtn.disabled = false;
    againBtn.click(); // Reset for next capture
  } catch (error) {
    console.error('Error saving moment:', error);
    saveBtn.textContent = 'Save this moment';
    saveBtn.disabled = false;
    alert('Could not save moment. Please try again.');
  }
});

renderGallery();

clearBtn?.addEventListener('click', () => {
  const ok = window.confirm('Clear all saved moments?');
  if (!ok) return;
  writeMoments([]);
  renderGallery();
});
