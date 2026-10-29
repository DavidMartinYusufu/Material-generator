import { ProductData } from '../types';

/**
 * Draws either the loaded product image or a high-end 3D-shaded procedural physical product
 * using the user's custom product colors, materials, category, and typography.
 */
function drawProductGraphic(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  product: ProductData,
  productImg: HTMLImageElement | null
) {
  if (productImg && productImg.complete && productImg.naturalWidth > 0) {
    const pAspect = productImg.width / productImg.height;
    const targetW = h * pAspect;
    const pX = x + (w - targetW) / 2;

    // Contact drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h * 0.95, targetW * 0.45, Math.min(22, h * 0.05), 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.drawImage(productImg, pX, y, targetW, h);
    return;
  }

  // ==========================================
  // PROCEDURAL 3D SHADED PRODUCT GRAPHIC
  // Uses exact user colors, category, materials, and brand name
  // ==========================================
  const brand = (product.name || 'NEW PRODUCT').toUpperCase();
  const primaryColor = product.colors?.[0] || '#111827';
  const accentColor = product.colors?.[1] || '#f59e0b';
  const lightColor = product.colors?.[2] || '#ffffff';
  const category = (product.category || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();

  const cx = x + w / 2;
  const bottomY = y + h * 0.92;

  // Contact shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.beginPath();
  ctx.ellipse(cx, bottomY, w * 0.4, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw based on category / description
  if (category.includes('watch') || category.includes('timepiece') || desc.includes('watch') || desc.includes('dial')) {
    // 1. Luxury Watch Form
    const radius = Math.min(w * 0.38, h * 0.38);
    const cy = y + h * 0.5;

    // Straps
    ctx.fillStyle = primaryColor;
    ctx.fillRect(cx - radius * 0.55, cy - radius * 1.3, radius * 1.1, radius * 2.6);

    // Bezel
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    const bezelGrad = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    bezelGrad.addColorStop(0, '#71717a');
    bezelGrad.addColorStop(0.5, '#27272a');
    bezelGrad.addColorStop(1, '#52525b');
    ctx.fillStyle = bezelGrad;
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Dial face
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.85, 0, Math.PI * 2);
    const dialGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius * 0.85);
    dialGrad.addColorStop(0, '#18181b');
    dialGrad.addColorStop(1, '#09090b');
    ctx.fillStyle = dialGrad;
    ctx.fill();

    // Dial markings
    ctx.strokeStyle = '#a1a1aa';
    ctx.lineWidth = 2;
    for (let a = 0; a < 12; a++) {
      const angle = (a * Math.PI) / 6;
      const x1 = cx + Math.cos(angle) * (radius * 0.7);
      const y1 = cy + Math.sin(angle) * (radius * 0.7);
      const x2 = cx + Math.cos(angle) * (radius * 0.82);
      const y2 = cy + Math.sin(angle) * (radius * 0.82);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Hands
    ctx.strokeStyle = lightColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * 0.45, cy - radius * 0.3);
    ctx.stroke();

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - radius * 0.2, cy - radius * 0.6);
    ctx.stroke();

    // Brand on dial
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand, cx, cy - radius * 0.35);
  } else if (
    category.includes('cosmetic') ||
    category.includes('skincare') ||
    category.includes('serum') ||
    category.includes('cream') ||
    category.includes('fragrance') ||
    category.includes('perfume') ||
    desc.includes('serum') ||
    desc.includes('cream') ||
    desc.includes('dropper') ||
    desc.includes('bottle')
  ) {
    // 2. Luxury Cosmetic Dropper / Serum / Fluted Flacon
    const bW = Math.min(w * 0.45, 200);
    const bH = Math.min(h * 0.65, 380);
    const bX = cx - bW / 2;
    const bY = bottomY - bH;

    // Dropper Pipette / Cap at top
    const capW = bW * 0.45;
    const capH = bH * 0.22;
    const capX = cx - capW / 2;
    const capY = bY - capH;

    // Gold / Accent Cap
    const capGrad = ctx.createLinearGradient(capX, 0, capX + capW, 0);
    capGrad.addColorStop(0, accentColor);
    capGrad.addColorStop(0.4, '#ffffff');
    capGrad.addColorStop(0.7, accentColor);
    capGrad.addColorStop(1, '#854d0e');
    ctx.fillStyle = capGrad;
    ctx.fillRect(capX, capY + capH * 0.35, capW, capH * 0.65);

    // Rubber Bulb
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.ellipse(cx, capY + capH * 0.35, capW * 0.35, capH * 0.4, 0, Math.PI, 0);
    ctx.fill();

    // Glass Body
    const bodyGrad = ctx.createLinearGradient(bX, 0, bX + bW, 0);
    bodyGrad.addColorStop(0, primaryColor);
    bodyGrad.addColorStop(0.2, '#ffffff44');
    bodyGrad.addColorStop(0.5, primaryColor);
    bodyGrad.addColorStop(0.85, '#000000aa');
    bodyGrad.addColorStop(1, '#ffffff22');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(bX, bY, bW, bH, [8, 8, 20, 20]);
    ctx.fill();

    // Inner Serum Level Glow
    ctx.fillStyle = accentColor + '33';
    ctx.beginPath();
    ctx.roundRect(bX + 8, bY + bH * 0.25, bW - 16, bH * 0.7, [4, 4, 16, 16]);
    ctx.fill();

    // Minimalist Luxury Plaque / Label
    const lW = bW * 0.78;
    const lH = bH * 0.52;
    const lX = cx - lW / 2;
    const lY = bY + bH * 0.28;

    ctx.fillStyle = 'rgba(10, 10, 15, 0.75)';
    ctx.fillRect(lX, lY, lW, lH);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(lX, lY, lW, lH);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(brand, cx, lY + lH * 0.35);

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(product.category ? product.category.toUpperCase() : 'CONCENTRÉ', cx, lY + lH * 0.52);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '9px monospace';
    ctx.fillText(product.tagline ? product.tagline.slice(0, 24).toUpperCase() : 'PURE ACTIVE FORMULA', cx, lY + lH * 0.72);
  } else if (category.includes('audio') || category.includes('sound') || category.includes('speaker') || desc.includes('speaker')) {
    // 3. High-End Acoustic Sphere / Architectural Speaker
    const radius = Math.min(w * 0.4, h * 0.4);
    const cy = bottomY - radius;

    // Metal Plinth Base
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cx - radius * 0.4, bottomY - 14, radius * 0.8, 14);

    // Sphere Grille
    const sphGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 10, cx, cy, radius);
    sphGrad.addColorStop(0, '#475569');
    sphGrad.addColorStop(0.4, primaryColor);
    sphGrad.addColorStop(0.85, '#090d16');
    sphGrad.addColorStop(1, '#020617');
    ctx.fillStyle = sphGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Accent Acoustic Ring
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.65, 0, Math.PI * 2);
    ctx.stroke();

    // Center Core
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Center Brand Emblem
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand, cx, cy + 5);
  } else {
    // 4. Sculptural / Bottle / Can / Tech Monolith Form
    const bodyW = Math.min(w * 0.55, 260);
    const bodyH = Math.min(h * 0.75, 460);
    const bodyX = cx - bodyW / 2;
    const bodyY = bottomY - bodyH;

    // Body with 3D cylindrical surface lighting
    const bodyGrad = ctx.createLinearGradient(bodyX, 0, bodyX + bodyW, 0);
    bodyGrad.addColorStop(0, primaryColor);
    bodyGrad.addColorStop(0.25, '#ffffff33');
    bodyGrad.addColorStop(0.5, primaryColor);
    bodyGrad.addColorStop(0.85, '#00000088');
    bodyGrad.addColorStop(1, '#ffffff22');

    // Rounded monolith cylinder
    const r = 16;
    ctx.beginPath();
    ctx.moveTo(bodyX + r, bodyY);
    ctx.lineTo(bodyX + bodyW - r, bodyY);
    ctx.quadraticCurveTo(bodyX + bodyW, bodyY, bodyX + bodyW, bodyY + r);
    ctx.lineTo(bodyX + bodyW, bodyY + bodyH - r);
    ctx.quadraticCurveTo(bodyX + bodyW, bodyY + bodyH, bodyX + bodyW - r, bodyY + bodyH);
    ctx.lineTo(bodyX + r, bodyY + bodyH);
    ctx.quadraticCurveTo(bodyX, bodyY + bodyH, bodyX, bodyY + bodyH - r);
    ctx.lineTo(bodyX, bodyY + r);
    ctx.quadraticCurveTo(bodyX, bodyY, bodyX + r, bodyY);
    ctx.closePath();
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // Accent Rim / Cap at Top
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.ellipse(cx, bodyY + 4, bodyW * 0.45, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Label Plaque
    const labelW = bodyW * 0.78;
    const labelH = bodyH * 0.58;
    const labelX = cx - labelW / 2;
    const labelY = bodyY + bodyH * 0.22;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(labelX, labelY, labelW, labelH);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(labelX, labelY, labelW, labelH);

    // Brand Name Typography on Product
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(brand, cx, labelY + labelH * 0.4);

    // Product Category / Material Sub-mark
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(product.category ? product.category.toUpperCase() : 'ORIGINAL FORMULA', cx, labelY + labelH * 0.58);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('SOLITARY DESIGN • 100% PURITY', cx, labelY + labelH * 0.74);
    ctx.restore();

    // Specular Highlight Line
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(bodyX + bodyW * 0.2, bodyY + 10, bodyW * 0.08, bodyH - 20);
  }
}

/**
 * Creates a dedicated, pristine 1:1 master studio packshot anchor
 * placed on a museum podium with diffused lighting, exact colors, and branding.
 */
export async function compositeStudioAnchorPackshot(product: ProductData): Promise<string> {
  return new Promise((resolve) => {
    const width = 1200;
    const height = 1200;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve('');
      return;
    }

    // Studio backdrop gradient (clean architectural museum lighting)
    const bgGrad = ctx.createRadialGradient(width / 2, height * 0.45, 80, width / 2, height / 2, width * 0.75);
    bgGrad.addColorStop(0, '#1c1f2e');
    bgGrad.addColorStop(0.6, '#0f1118');
    bgGrad.addColorStop(1, '#07080b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Minimalist Studio Plinth / Podium
    const plinthW = width * 0.55;
    const plinthH = 70;
    const plinthX = width / 2 - plinthW / 2;
    const plinthY = height * 0.78;

    // Contact drop shadow on ground
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.ellipse(width / 2, plinthY + plinthH + 10, plinthW * 0.58, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Plinth top oval
    ctx.fillStyle = '#222736';
    ctx.beginPath();
    ctx.ellipse(width / 2, plinthY, plinthW * 0.5, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#384259';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Plinth cylinder body
    const pGrad = ctx.createLinearGradient(plinthX, 0, plinthX + plinthW, 0);
    pGrad.addColorStop(0, '#12151e');
    pGrad.addColorStop(0.3, '#2a3142');
    pGrad.addColorStop(0.7, '#181d28');
    pGrad.addColorStop(1, '#0e1117');
    ctx.fillStyle = pGrad;
    ctx.fillRect(plinthX, plinthY, plinthW, plinthH);

    // Plinth bottom oval
    ctx.fillStyle = '#10131a';
    ctx.beginPath();
    ctx.ellipse(width / 2, plinthY + plinthH, plinthW * 0.5, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw the procedural or provided product in pristine studio center
    const targetH = height * 0.62;
    const targetW = width * 0.55;
    const pX = width / 2 - targetW / 2;
    const pY = height * 0.18;
    drawProductGraphic(ctx, pX, pY, targetW, targetH, product, null);

    // Studio typography badge in corner
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('MASTER VISUAL ANCHOR • 1:1 STUDIO PACKSHOT', 50, height - 50);

    ctx.textAlign = 'right';
    ctx.fillText('STRICTLY ZERO HUMANS • CONSISTENCY LOCK', width - 50, height - 50);

    resolve(canvas.toDataURL('image/png'));
  });
}

/**
 * Creates high-fidelity realistic procedural campaign shots across different mediums
 * preserving exact product consistency, branding typography, and zero people.
 */
export async function compositeMediumShot(
  mediumId: string,
  product: ProductData,
  headlineText: string,
  aspectRatio: string
): Promise<string> {
  return new Promise((resolve) => {
    let width = 1600;
    let height = 900;

    if (aspectRatio === '1:1') {
      width = 1200;
      height = 1200;
    } else if (aspectRatio === '3:4') {
      width = 1200;
      height = 1600;
    } else if (aspectRatio === '4:3') {
      width = 1600;
      height = 1200;
    } else if (aspectRatio === '9:16') {
      width = 1080;
      height = 1920;
    } else if (aspectRatio === '4:1') {
      width = 2000;
      height = 500;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve('');
      return;
    }

    const loadImg = (src: string): Promise<HTMLImageElement> => {
      return new Promise((res, rej) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = src;
      });
    };

    const draw = async () => {
      let productImg: HTMLImageElement | null = null;
      if (product.masterImageUrl) {
        try {
          productImg = await loadImg(product.masterImageUrl);
        } catch (_e) {
          // If image fails to load, fallback seamlessly to procedural physical rendering
          productImg = null;
        }
      }

      const brand = (product.name || 'NEW PRODUCT').toUpperCase();
      const headline = (headlineText || product.tagline || 'NEW HORIZON').toUpperCase();

      // ==========================================
      // 1. HIGHWAY MEGABOARD / BILLBOARD (16:9)
      // ==========================================
      if (mediumId === 'billboard') {
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#070b19');
        skyGrad.addColorStop(0.4, '#141d36');
        skyGrad.addColorStop(0.7, '#2a2238');
        skyGrad.addColorStop(1, '#0b0f1a');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Distant illuminated skyline silhouette
        ctx.fillStyle = '#080d1a';
        for (let i = 0; i < width; i += 40) {
          const bH = 60 + Math.sin(i * 0.05) * 50 + (i % 80);
          ctx.fillRect(i, height - bH - 40, 36, bH + 40);
          if (i % 60 === 0) {
            ctx.fillStyle = '#ffe89c';
            ctx.fillRect(i + 8, height - bH + 10, 4, 4);
            ctx.fillRect(i + 18, height - bH + 20, 4, 4);
            ctx.fillStyle = '#080d1a';
          }
        }

        // Support Girders
        ctx.fillStyle = '#11141c';
        ctx.fillRect(width * 0.28, height * 0.65, 32, height * 0.35);
        ctx.fillRect(width * 0.7, height * 0.65, 32, height * 0.35);

        // Billboard Display Area
        const bMarginX = width * 0.08;
        const bMarginY = height * 0.12;
        const bW = width - bMarginX * 2;
        const bH = height * 0.68;

        ctx.fillStyle = '#0f1118';
        ctx.fillRect(bMarginX - 16, bMarginY - 16, bW + 32, bH + 32);
        ctx.strokeStyle = '#2d3345';
        ctx.lineWidth = 3;
        ctx.strokeRect(bMarginX - 16, bMarginY - 16, bW + 32, bH + 32);

        const boardGrad = ctx.createLinearGradient(bMarginX, bMarginY, bMarginX + bW, bMarginY + bH);
        boardGrad.addColorStop(0, '#0d0e12');
        boardGrad.addColorStop(0.5, '#181b24');
        boardGrad.addColorStop(1, '#0a0b0e');
        ctx.fillStyle = boardGrad;
        ctx.fillRect(bMarginX, bMarginY, bW, bH);

        // Spotlights
        for (let i = 0; i < 4; i++) {
          const spotX = bMarginX + (bW / 4) * (i + 0.5);
          const spotY = bMarginY - 14;

          ctx.fillStyle = '#cfd6e6';
          ctx.beginPath();
          ctx.arc(spotX, spotY, 8, 0, Math.PI * 2);
          ctx.fill();

          const washGrad = ctx.createRadialGradient(spotX, bMarginY, 5, spotX, bMarginY + 120, 180);
          washGrad.addColorStop(0, 'rgba(255, 245, 220, 0.25)');
          washGrad.addColorStop(1, 'rgba(255, 245, 220, 0)');
          ctx.fillStyle = washGrad;
          ctx.beginPath();
          ctx.moveTo(spotX, spotY);
          ctx.lineTo(spotX - 120, bMarginY + bH * 0.4);
          ctx.lineTo(spotX + 120, bMarginY + bH * 0.4);
          ctx.closePath();
          ctx.fill();
        }

        // Product on Billboard
        const pTargetH = bH * 0.82;
        const pTargetW = bW * 0.45;
        const pX = bMarginX + bW * 0.52;
        const pY = bMarginY + bH * 0.09;
        drawProductGraphic(ctx, pX, pY, pTargetW, pTargetH, product, productImg);

        // Commercial Typography on Billboard
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 44px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(brand, bMarginX + 60, bMarginY + bH * 0.35);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(headline, bMarginX + 60, bMarginY + bH * 0.45);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px sans-serif';
        ctx.fillText(product.tagline || 'Engineered without compromise.', bMarginX + 60, bMarginY + bH * 0.53);

        ctx.fillStyle = '#475569';
        ctx.font = '12px monospace';
        ctx.fillText('HIGHWAY MEGABOARD 04 • 8K MONUMENTAL DISPLAY', bMarginX + 60, bMarginY + bH * 0.85);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('NO HUMANS • SOLITARY ARCHITECTURAL STAGING', bMarginX + bW - 20, bMarginY + bH - 15);
      }

      // ==========================================
      // 2. PRINTED BROADSHEET NEWSPAPER (3:4)
      // ==========================================
      else if (mediumId === 'newspaper') {
        ctx.fillStyle = '#f2efe6';
        ctx.fillRect(0, 0, width, height);

        const margin = 50;
        const pW = width - margin * 2;

        ctx.strokeStyle = '#222222';
        ctx.lineWidth = 1;
        ctx.strokeRect(margin, 40, pW, 1);
        ctx.strokeRect(margin, 44, pW, 2);

        ctx.fillStyle = '#111111';
        ctx.font = '900 68px serif';
        ctx.textAlign = 'center';
        ctx.fillText('THE FINANCIAL CHRONICLE', width / 2, 115);

        ctx.font = '600 12px sans-serif';
        ctx.fillStyle = '#444444';
        ctx.fillText('VOL. CXLVII NO. 52,190  •  THE GLOBAL ADVERTISING & INDUSTRIAL REVIEW  •  FOUR DOLLARS', width / 2, 140);
        ctx.strokeRect(margin, 150, pW, 2);

        ctx.fillStyle = '#111111';
        ctx.font = 'bold 36px serif';
        ctx.textAlign = 'left';
        ctx.fillText(`BREAKTHROUGH: ${brand} DEFINES A NEW MATERIAL PARADIGM`, margin, 205);

        ctx.font = '14px serif';
        ctx.fillStyle = '#2b2b2b';
        ctx.fillText(`In an era demanding uncompromising physical precision, the introduction of ${brand}`, margin, 235);
        ctx.fillText('marks a decisive shift away from transient excess toward architectural permanence and material integrity.', margin, 255);

        const adX = margin + 10;
        const adY = 280;
        const adW = pW - 20;
        const adH = height - adY - 80;

        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 3;
        ctx.strokeRect(adX, adY, adW, adH);
        ctx.lineWidth = 1;
        ctx.strokeRect(adX + 6, adY + 6, adW - 12, adH - 12);

        ctx.fillStyle = '#111111';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SPECIAL FULL PAGE ADVERTISING PRESENTATION', width / 2, adY + 30);

        ctx.font = 'italic 20px serif';
        ctx.fillText(`“${headline}”`, width / 2, adY + 62);

        // Product on Newspaper
        const pTargetH = adH * 0.62;
        const pTargetW = adW * 0.7;
        const pX = width / 2 - pTargetW / 2;
        const pY = adY + 80;
        drawProductGraphic(ctx, pX, pY, pTargetW, pTargetH, product, productImg);

        ctx.fillStyle = '#111111';
        ctx.font = '900 28px serif';
        ctx.textAlign = 'center';
        ctx.fillText(brand, width / 2, adY + adH - 55);

        ctx.font = '13px serif';
        ctx.fillStyle = '#444444';
        ctx.fillText(product.materials || 'Pure Materials. Solitary Execution.', width / 2, adY + adH - 30);

        ctx.font = '10px monospace';
        ctx.fillStyle = '#666666';
        ctx.fillText('AUTHENTIC BROADSHEET INK ABSORPTION • STRICTLY ZERO PEOPLE', width / 2, height - 30);
      }

      // ==========================================
      // 3. SOCIAL MEDIA FEED (1:1)
      // ==========================================
      else if (mediumId === 'social_post') {
        const grad = ctx.createRadialGradient(width / 2, height * 0.45, 100, width / 2, height / 2, width * 0.7);
        grad.addColorStop(0, '#1c1f2b');
        grad.addColorStop(0.5, '#0e1017');
        grad.addColorStop(1, '#050608');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Sculptural plinth
        ctx.fillStyle = '#151821';
        ctx.beginPath();
        ctx.ellipse(width / 2, height * 0.78, width * 0.38, 50, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#2d3345';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#1e222e';
        ctx.beginPath();
        ctx.ellipse(width / 2, height * 0.77, width * 0.36, 42, 0, 0, Math.PI * 2);
        ctx.fill();

        // Product on Plinth
        const pTargetH = height * 0.62;
        const pTargetW = width * 0.55;
        const pX = width / 2 - pTargetW / 2;
        const pY = height * 0.18;
        drawProductGraphic(ctx, pX, pY, pTargetW, pTargetH, product, productImg);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(brand, width / 2, 80);

        ctx.fillStyle = '#f59e0b';
        ctx.font = '600 16px sans-serif';
        ctx.fillText(headline, width / 2, 115);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '11px monospace';
        ctx.fillText('1:1 STUDIO HERO • STRICTLY ZERO HUMANS', width / 2, height - 50);
      }

      // ==========================================
      // 4. MOBILE STORY / REEL (9:16)
      // ==========================================
      else if (mediumId === 'social_story') {
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#090a10');
        grad.addColorStop(0.3, '#141824');
        grad.addColorStop(0.7, '#241a2f');
        grad.addColorStop(1, '#08090f');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        const glow = ctx.createRadialGradient(width / 2, height * 0.48, 20, width / 2, height * 0.48, width * 0.6);
        glow.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
        glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);

        // Product Hero
        const pTargetH = height * 0.52;
        const pTargetW = width * 0.7;
        const pX = width / 2 - pTargetW / 2;
        const pY = height * 0.22;
        drawProductGraphic(ctx, pX, pY, pTargetW, pTargetH, product, productImg);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 38px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(brand, width / 2, 170);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(headline, width / 2, 215);

        ctx.fillStyle = '#ffffff';
        ctx.font = '14px sans-serif';
        ctx.fillText('▲  SWIPE UP TO DISCOVER', width / 2, height - 160);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px monospace';
        ctx.fillText('VERTICAL CAMPAIGN • ZERO PEOPLE', width / 2, height - 100);
      }

      // ==========================================
      // 5. LUXURY MAGAZINE SPREAD (16:9)
      // ==========================================
      else if (mediumId === 'magazine') {
        ctx.fillStyle = '#dcd7ce';
        ctx.fillRect(0, 0, width, height);

        const mX = 80;
        const mY = 60;
        const mW = width - mX * 2;
        const mH = height - mY * 2;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fillRect(mX + 15, mY + 15, mW, mH);

        ctx.fillStyle = '#f8f6f0';
        ctx.fillRect(mX, mY, mW / 2, mH);

        ctx.fillStyle = '#faf8f4';
        ctx.fillRect(mX + mW / 2, mY, mW / 2, mH);

        const gutter = ctx.createLinearGradient(mX + mW / 2 - 40, 0, mX + mW / 2 + 40, 0);
        gutter.addColorStop(0, 'rgba(0,0,0,0)');
        gutter.addColorStop(0.5, 'rgba(0,0,0,0.3)');
        gutter.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gutter;
        ctx.fillRect(mX + mW / 2 - 40, mY, 80, mH);

        ctx.fillStyle = '#111111';
        ctx.font = 'italic 16px serif';
        ctx.textAlign = 'left';
        ctx.fillText('EDITORIAL ESSAY / ISSUE 48', mX + 60, mY + 80);

        ctx.font = 'bold 42px serif';
        ctx.fillText(brand, mX + 60, mY + 140);

        ctx.font = 'italic 22px serif';
        ctx.fillStyle = '#b45309';
        ctx.fillText(`“${headline}”`, mX + 60, mY + 185);

        ctx.font = '14px serif';
        ctx.fillStyle = '#333333';
        ctx.fillText(`The pursuit of timeless silhouette requires removing every element that does not serve`, mX + 60, mY + 240);
        ctx.fillText(`the integrity of the material itself. ${brand} presents pristine, solitary focus.`, mX + 60, mY + 265);

        ctx.font = '12px serif';
        ctx.fillStyle = '#888888';
        ctx.fillText('42', mX + 60, mY + mH - 40);
        ctx.textAlign = 'right';
        ctx.fillText('43', mX + mW - 60, mY + mH - 40);

        // Right Page Hero Packshot
        const pTargetH = mH * 0.72;
        const pTargetW = (mW / 2) * 0.8;
        const pX = mX + mW / 2 + (mW / 2 - pTargetW) / 2;
        const pY = mY + mH * 0.15;
        drawProductGraphic(ctx, pX, pY, pTargetW, pTargetH, product, productImg);
      }

      // ==========================================
      // 6. DEFAULT / TRANSIT / STOREFRONT / VITRINE
      // ==========================================
      else {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#10141f');
        grad.addColorStop(0.5, '#1e2536');
        grad.addColorStop(1, '#0b0e17');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        const bMargin = 60;
        ctx.strokeStyle = '#384259';
        ctx.lineWidth = 4;
        ctx.strokeRect(bMargin, bMargin, width - bMargin * 2, height - bMargin * 2);

        ctx.fillStyle = '#0a0d14';
        ctx.fillRect(bMargin + 4, bMargin + 4, width - bMargin * 2 - 8, height - bMargin * 2 - 8);

        // Product in Vitrine
        const pTargetH = (height - bMargin * 2) * 0.68;
        const pTargetW = (width - bMargin * 2) * 0.6;
        const pX = width / 2 - pTargetW / 2;
        const pY = height * 0.2;
        drawProductGraphic(ctx, pX, pY, pTargetW, pTargetH, product, productImg);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(brand, width / 2, bMargin + 60);

        ctx.fillStyle = '#f59e0b';
        ctx.font = '600 18px sans-serif';
        ctx.fillText(headline, width / 2, bMargin + 95);

        ctx.fillStyle = '#64748b';
        ctx.font = '11px monospace';
        ctx.fillText('ARCHITECTURAL DISPLAY • ZERO PEOPLE', width / 2, height - bMargin - 20);
      }

      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    };

    draw();
  });
}
