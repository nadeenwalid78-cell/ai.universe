import * as THREE from "three";
import { PlanetData } from "../data/spaceData";

/**
 * Generates high-detail procedural HTML5 CanvasTextures for the Sun, all 8 planets,
 * and planetary ring systems with SRGBColorSpace and anisotropic filtering.
 */
export function createSunTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Base photosphere gradient
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, "#fb923c");
  grad.addColorStop(0.25, "#f59e0b");
  grad.addColorStop(0.5, "#fef08a");
  grad.addColorStop(0.75, "#f59e0b");
  grad.addColorStop(1, "#fb923c");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Solar granulation and active regions
  for (let i = 0; i < 900; i++) {
    const x = (Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) % 1 * canvas.width;
    const y = (Math.cos(i * 78.233) * 19341.231 % 1 + 1) % 1 * canvas.height;
    const r = 4 + (i % 26);
    const radial = ctx.createRadialGradient(x, y, 0, x, y, r);
    if (i % 7 === 0) {
      // Sunspot / cooler magnetic active zone
      radial.addColorStop(0, "rgba(180, 83, 9, 0.55)");
      radial.addColorStop(1, "rgba(245, 158, 11, 0)");
    } else {
      // Bright plasma faculae
      radial.addColorStop(0, "rgba(255, 255, 255, 0.45)");
      radial.addColorStop(1, "rgba(254, 240, 138, 0)");
    }
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createPlanetTexture(
  planet: PlanetData,
  maxAnisotropy = 4
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  const { primaryColor, secondaryColor, accentColor, textureType } =
    planet.visualConfig;

  // Base fill
  const baseGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  baseGrad.addColorStop(0, secondaryColor);
  baseGrad.addColorStop(0.5, primaryColor);
  baseGrad.addColorStop(1, secondaryColor);
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const pseudoRand = (seed: number) => {
    const x = Math.sin(seed * 91.3458) * 47453.5453;
    return x - Math.floor(x);
  };

  if (textureType === "cratered") {
    // Mercury: regolith variations + impact basins + ray craters
    for (let i = 0; i < 320; i++) {
      const x = pseudoRand(i * 3.1) * canvas.width;
      const y = pseudoRand(i * 7.7) * canvas.height;
      const r = 3 + pseudoRand(i * 11.3) * 38;
      const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
      g.addColorStop(0, "rgba(39, 39, 42, 0.65)");
      g.addColorStop(0.78, "rgba(212, 212, 216, 0.35)");
      g.addColorStop(1, "rgba(113, 113, 122, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (textureType === "cloud-sulfuric") {
    // Venus: V-shapedchevron sulfuric acid atmospheric bands
    for (let y = 0; y < canvas.height; y += 6) {
      const wave = Math.sin(y * 0.04) * 0.5 + 0.5;
      ctx.fillStyle =
        wave > 0.5
          ? "rgba(254, 240, 138, 0.22)"
          : "rgba(161, 98, 7, 0.22)";
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= canvas.width; x += 32) {
        const dy = Math.sin(x * 0.012 + y * 0.03) * 14;
        ctx.lineTo(x, y + dy);
      }
      ctx.lineTo(canvas.width, y + 12);
      ctx.lineTo(0, y + 12);
      ctx.closePath();
      ctx.fill();
    }
  } else if (textureType === "terrestrial") {
    // Earth: deep ocean base, emerald/ochre continents, polar ice caps, and wispy clouds
    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Continents
    const blobs = [
      { x: 220, y: 180, rx: 95, ry: 75, rot: 0.3 },
      { x: 280, y: 330, rx: 60, ry: 95, rot: -0.2 },
      { x: 520, y: 240, rx: 85, ry: 110, rot: 0.1 },
      { x: 680, y: 170, rx: 145, ry: 85, rot: -0.15 },
      { x: 820, y: 360, rx: 65, ry: 45, rot: 0.2 },
    ];
    blobs.forEach((b, idx) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.fillStyle = idx % 2 === 0 ? "#15803d" : "#166534";
      ctx.beginPath();
      ctx.ellipse(0, 0, b.rx, b.ry, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ca8a04";
      ctx.beginPath();
      ctx.ellipse(b.rx * 0.2, -b.ry * 0.1, b.rx * 0.45, b.ry * 0.35, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Polar ice caps
    ctx.fillStyle = "rgba(248, 250, 252, 0.92)";
    ctx.fillRect(0, 0, canvas.width, 34);
    ctx.fillRect(0, canvas.height - 34, canvas.width, 34);

    // Atmospheric cloud swirls
    for (let i = 0; i < 95; i++) {
      const x = pseudoRand(i * 5.2) * canvas.width;
      const y = pseudoRand(i * 8.9) * canvas.height;
      const rx = 30 + pseudoRand(i * 2.3) * 80;
      const ry = 6 + pseudoRand(i * 4.1) * 16;
      ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, pseudoRand(i) * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (textureType === "rusty-desert") {
    // Mars: dark basaltic maria (Syrtis Major), Tharsis Montes, Valles Marineris, polar CO2 caps
    for (let i = 0; i < 180; i++) {
      const x = pseudoRand(i * 4.7) * canvas.width;
      const y = 45 + pseudoRand(i * 9.1) * (canvas.height - 90);
      const r = 12 + pseudoRand(i * 3.3) * 65;
      ctx.fillStyle =
        i % 3 === 0
          ? "rgba(124, 45, 18, 0.42)"
          : "rgba(251, 146, 60, 0.25)";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // Valles Marineris scar
    ctx.strokeStyle = "rgba(67, 20, 7, 0.7)";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(380, 260);
    ctx.bezierCurveTo(460, 250, 550, 270, 640, 258);
    ctx.stroke();

    // Polar ice caps
    ctx.fillStyle = "rgba(254, 242, 242, 0.88)";
    ctx.fillRect(0, 0, canvas.width, 22);
    ctx.fillRect(0, canvas.height - 22, canvas.width, 22);
  } else if (textureType === "banded-storm" || textureType === "ringed-gold") {
    // Jupiter & Saturn: zonal jet bands + Great Red Spot on Jupiter
    const bandColors =
      textureType === "banded-storm"
        ? [
            "#78350f",
            "#d97706",
            "#fef3c7",
            "#b45309",
            "#fde68a",
            "#92400e",
            "#f59e0b",
            "#fffbeb",
            "#b45309",
          ]
        : [
            "#713f12",
            "#ca8a04",
            "#fef08a",
            "#eab308",
            "#fef9c3",
            "#a16207",
            "#fde047",
          ];

    const bandHeight = canvas.height / bandColors.length;
    bandColors.forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.fillRect(0, i * bandHeight, canvas.width, bandHeight + 4);
      // Turbulent eddies along band boundary
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = 0.22;
      for (let x = 0; x < canvas.width; x += 24) {
        const dy = Math.sin(x * 0.03 + i * 2) * 8;
        ctx.beginPath();
        ctx.arc(x, i * bandHeight + dy, 10, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });

    if (textureType === "banded-storm") {
      // Great Red Spot on Jupiter
      ctx.save();
      ctx.translate(640, 330);
      const grs = ctx.createRadialGradient(0, 0, 6, 0, 0, 58);
      grs.addColorStop(0, "#dc2626");
      grs.addColorStop(0.65, "#b91c1c");
      grs.addColorStop(0.9, "#fef3c7");
      grs.addColorStop(1, "rgba(254, 243, 199, 0)");
      ctx.fillStyle = grs;
      ctx.scale(1.6, 1.0);
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  } else {
    // Uranus & Neptune: smooth methane bands + high-altitude methane ice clouds
    for (let y = 0; y < canvas.height; y += 8) {
      ctx.fillStyle =
        y % 16 === 0
          ? "rgba(255, 255, 255, 0.08)"
          : "rgba(15, 23, 42, 0.12)";
      ctx.fillRect(0, y, canvas.width, 6);
    }
    if (textureType === "deep-azure") {
      // Neptune Great Dark Spot & scooter clouds
      ctx.save();
      ctx.translate(460, 290);
      ctx.scale(1.5, 0.95);
      ctx.fillStyle = "rgba(15, 23, 42, 0.55)";
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createRingTexture(ringColor = "#fde68a"): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0.0, "rgba(0,0,0,0)");
  grad.addColorStop(0.15, "rgba(254, 240, 138, 0.25)");
  grad.addColorStop(0.35, ringColor);
  grad.addColorStop(0.58, "rgba(253, 224, 71, 0.85)");
  // Cassini Division gap
  grad.addColorStop(0.64, "rgba(10, 10, 20, 0.08)");
  grad.addColorStop(0.68, "rgba(254, 240, 138, 0.7)");
  grad.addColorStop(0.92, "rgba(254, 240, 138, 0.3)");
  grad.addColorStop(1.0, "rgba(0,0,0,0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
