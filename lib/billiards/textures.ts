import * as THREE from 'three';

export interface BallColorSpec {
  color: string;
  isStripe: boolean;
  number: number;
}

export const BALL_SPECS: Record<number, BallColorSpec> = {
  0: { color: '#FAFAF7', isStripe: false, number: 0 },
  1: { color: '#F59E0B', isStripe: false, number: 1 },
  2: { color: '#1D4ED8', isStripe: false, number: 2 },
  3: { color: '#DC2626', isStripe: false, number: 3 },
  4: { color: '#6D28D9', isStripe: false, number: 4 },
  5: { color: '#EA580C', isStripe: false, number: 5 },
  6: { color: '#15803D', isStripe: false, number: 6 },
  7: { color: '#881337', isStripe: false, number: 7 },
  8: { color: '#0F172A', isStripe: false, number: 8 },
  9: { color: '#F59E0B', isStripe: true, number: 9 },
  10: { color: '#1D4ED8', isStripe: true, number: 10 },
  11: { color: '#DC2626', isStripe: true, number: 11 },
  12: { color: '#6D28D9', isStripe: true, number: 12 },
  13: { color: '#EA580C', isStripe: true, number: 13 },
  14: { color: '#15803D', isStripe: true, number: 14 },
  15: { color: '#881337', isStripe: true, number: 15 },
};

/**
 * Generates a high-definition CanvasTexture for a pool ball (0 to 15).
 * Matches standard Aramith pool ball glossy finishes.
 */
export function createBallTexture(num: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(document.createElement('canvas'));
  }

  const spec = BALL_SPECS[num] || BALL_SPECS[0];

  // Fill Background
  if (num === 0) {
    // Cue Ball: Pure glossy off-white
    ctx.fillStyle = '#FAFAF7';
    ctx.fillRect(0, 0, 512, 256);

    // Subtle red dot indicator
    ctx.fillStyle = '#B23A48';
    ctx.beginPath();
    ctx.arc(256, 128, 6, 0, Math.PI * 2);
    ctx.fill();
  } else if (!spec.isStripe) {
    // Solid Ball
    ctx.fillStyle = spec.color;
    ctx.fillRect(0, 0, 512, 256);

    // Draw White Number Circles (front & back equator)
    drawNumberCircle(ctx, 128, 128, spec.number);
    drawNumberCircle(ctx, 384, 128, spec.number);
  } else {
    // Striped Ball
    ctx.fillStyle = '#FAFAF7';
    ctx.fillRect(0, 0, 512, 256);

    // Color Band across equator
    ctx.fillStyle = spec.color;
    ctx.fillRect(0, 52, 512, 152);

    // Draw White Number Circles
    drawNumberCircle(ctx, 128, 128, spec.number, true);
    drawNumberCircle(ctx, 384, 128, spec.number, true);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

function drawNumberCircle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  num: number,
  isStripe = false
) {
  // White circle background
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy, 36, 0, Math.PI * 2);
  ctx.fill();

  // Subtle dark border
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Number Text
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 34px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(num.toString(), cx, cy);

  // Underline for striped numbers (6 & 9)
  if (isStripe || num === 6 || num === 9) {
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 14, cy + 18);
    ctx.lineTo(cx + 14, cy + 18);
    ctx.stroke();
  }
}

/**
 * Generates dark emerald green felt texture matching the user reference image.
 */
export function createFeltTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Base deep green matching reference image (#003D27)
    ctx.fillStyle = '#003D27';
    ctx.fillRect(0, 0, 1024, 1024);

    // Fine wool felt noise grain
    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 14;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise * 1.2));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates an elegant dark charcoal / slate cloth texture for minimal luxury aesthetics.
 */
export function createCharcoalClothTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Elegant dark charcoal tone (#0E1318)
    ctx.fillStyle = '#0E1318';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle microfiber wool texture noise
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 8;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.needsUpdate = true;
  return texture;
}

