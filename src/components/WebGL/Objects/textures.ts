"use client";

import * as THREE from "three";

/**
 * Procedural textures for the 3D book, drawn on canvases at runtime so they
 * stay crisp at any size and cost nothing to download.
 */

const cache = new Map<string, unknown>();
function memo<T>(key: string, make: () => T): T {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key) as T;
}

// Slightly lifted from brand navy #141A2A so it reads as navy (not black) once lit.
const NAVY = "#18213a";
const GOLD = "#cfa65c";

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

function toTexture(c: HTMLCanvasElement, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function grain(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
  const img = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

/** The open-book mark from the logo. */
function drawMark(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  ctx.beginPath();
  ctx.moveTo(cx - 0.03 * s, cy - 0.36 * s);
  ctx.bezierCurveTo(cx - 0.2 * s, cy - 0.46 * s, cx - 0.36 * s, cy - 0.46 * s, cx - 0.5 * s, cy - 0.42 * s);
  ctx.lineTo(cx - 0.5 * s, cy + 0.4 * s);
  ctx.bezierCurveTo(cx - 0.36 * s, cy + 0.34 * s, cx - 0.2 * s, cy + 0.36 * s, cx - 0.03 * s, cy + 0.46 * s);
  ctx.closePath();
  ctx.moveTo(cx + 0.03 * s, cy - 0.36 * s);
  ctx.bezierCurveTo(cx + 0.2 * s, cy - 0.46 * s, cx + 0.36 * s, cy - 0.46 * s, cx + 0.5 * s, cy - 0.42 * s);
  ctx.lineTo(cx + 0.5 * s, cy + 0.4 * s);
  ctx.bezierCurveTo(cx + 0.36 * s, cy + 0.34 * s, cx + 0.2 * s, cy + 0.36 * s, cx + 0.03 * s, cy + 0.46 * s);
  ctx.closePath();
  ctx.fill();
}

/** Draws the gold foil artwork (used for both the colour map and the metal mask). */
function drawFoil(ctx: CanvasRenderingContext2D, w: number, h: number, ink: string) {
  ctx.fillStyle = ink;
  ctx.strokeStyle = ink;
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, w - 96, h - 96);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(64, 64, w - 128, h - 128);
  drawMark(ctx, w / 2, h * 0.27, w * 0.26);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const serif = '"Times New Roman", Times, serif';
  ctx.font = `700 ${w * 0.1}px ${serif}`;
  ctx.fillText("HIRE A", w / 2, h * 0.5);
  ctx.font = `700 ${w * 0.085}px ${serif}`;
  ctx.fillText("GHOST WRITER", w / 2, h * 0.585);
  ctx.font = `700 ${w * 0.1}px ${serif}`;
  ctx.fillText("NOW", w / 2, h * 0.68);
  ctx.fillRect(w / 2 - w * 0.08, h * 0.72, w * 0.16, 3);
  ctx.font = `500 ${w * 0.024}px ${serif}`;
  ctx.fillText("HIREAGHOSTWRITERNOW.COM", w / 2, h * 0.88);
}

/** Brand hardcover: navy cloth with gold-foil logo. Returns colour + metalness + roughness maps. */
export function brandCover() {
  return memo("brandCover", () => {
    const w = 1024;
    const h = 1434;
    const [c, ctx] = canvas(w, h);
    ctx.fillStyle = NAVY;
    ctx.fillRect(0, 0, w, h);
    grain(ctx, w, h, 14);
    drawFoil(ctx, w, h, GOLD);

    const [m, mctx] = canvas(w, h);
    mctx.fillStyle = "#000";
    mctx.fillRect(0, 0, w, h);
    drawFoil(mctx, w, h, "#fff");

    const [r, rctx] = canvas(w, h);
    rctx.fillStyle = "#b4b4b4";
    rctx.fillRect(0, 0, w, h);
    drawFoil(rctx, w, h, "#3c3c3c");

    return { map: toTexture(c), metalnessMap: toTexture(m, false), roughnessMap: toTexture(r, false) };
  });
}

/** Spine with the wordmark running bottom-to-top. */
export function spineTexture(label = "HIRE A GHOST WRITER NOW") {
  return memo(`spine:${label}`, () => {
    const [c, ctx] = canvas(128, 1024);
    ctx.fillStyle = NAVY;
    ctx.fillRect(0, 0, 128, 1024);
    grain(ctx, 128, 1024, 14);
    ctx.save();
    ctx.translate(64, 512);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = GOLD;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = '700 46px "Times New Roman", Times, serif';
    ctx.fillText(label, 0, 2);
    ctx.restore();
    ctx.fillRect(20, 60, 88, 3);
    ctx.fillRect(20, 961, 88, 3);
    return toTexture(c);
  });
}

/** Woven navy cloth for boards / spine edges. */
export function clothTexture() {
  return memo("cloth", () => {
    const [c, ctx] = canvas(256, 256);
    ctx.fillStyle = NAVY;
    ctx.fillRect(0, 0, 256, 256);
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 256; i += 2) {
      ctx.fillStyle = i % 4 ? "#000" : "#3a4560";
      ctx.fillRect(0, i, 256, 1);
      ctx.fillRect(i, 0, 1, 256);
    }
    ctx.globalAlpha = 1;
    grain(ctx, 256, 256, 10);
    const t = toTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 4);
    return t;
  });
}

/** Stacked page edges. */
export function pageEdgeTexture() {
  return memo("pageEdge", () => {
    const [c, ctx] = canvas(512, 64);
    ctx.fillStyle = "#efe9dc";
    ctx.fillRect(0, 0, 512, 64);
    for (let y = 0; y < 64; y += 1) {
      ctx.fillStyle = `rgba(120, 100, 70, ${0.05 + Math.random() * 0.12})`;
      ctx.fillRect(0, y, 512, 0.6);
    }
    return toTexture(c);
  });
}

/** Typeset first page: chapter heading + ruled text. */
export function pageTexture(kind: "text" | "redline" | "plate" = "text") {
  return memo(`page:${kind}`, () => {
    const w = 700;
    const h = 1000;
    const [c, ctx] = canvas(w, h);
    ctx.fillStyle = "#f6f1e6";
    ctx.fillRect(0, 0, w, h);
    grain(ctx, w, h, 8);
    ctx.fillStyle = "#141a2a";
    ctx.textAlign = "center";
    ctx.font = 'italic 400 34px "Times New Roman", Times, serif';
    ctx.fillText("Chapter One", w / 2, 150);
    ctx.fillStyle = GOLD;
    ctx.fillRect(w / 2 - 30, 175, 60, 2);
    const top = kind === "plate" ? 640 : 240;
    if (kind === "plate") {
      const g = ctx.createLinearGradient(0, 220, 0, 600);
      g.addColorStop(0, "#3b4a68");
      g.addColorStop(1, NAVY);
      ctx.fillStyle = g;
      ctx.fillRect(80, 220, w - 160, 380);
      ctx.fillStyle = "#e3c993";
      ctx.beginPath();
      ctx.arc(w * 0.66, 330, 44, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let y = top, i = 0; y < h - 110; y += 26, i++) {
      const len = i % 7 === 6 ? 0.45 : 0.82 + ((i * 37) % 13) / 100;
      ctx.fillStyle = "rgba(20, 26, 42, 0.55)";
      ctx.fillRect(80, y, (w - 160) * Math.min(len, 1), 3);
      if (kind === "redline" && i % 3 === 1) {
        ctx.fillStyle = "rgba(197, 160, 89, 0.9)";
        ctx.fillRect(80 + (w - 160) * 0.3, y - 2, (w - 160) * 0.35, 6);
      }
    }
    ctx.fillStyle = "rgba(20, 26, 42, 0.5)";
    ctx.font = 'italic 22px "Times New Roman", Times, serif';
    ctx.fillText("1", w / 2, h - 50);
    return toTexture(c);
  });
}
