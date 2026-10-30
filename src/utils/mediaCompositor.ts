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

  // ==========================================
  // MULTI-ARCHETYPE GENERATIVE PROCEDURAL ENGINE
  // Intelligently maps user category, description & materials into authentic 3D physical forms
  // ==========================================

  // Helper: check if text contains any keywords
  const has = (...keywords: string[]) => {
    const combined = `${category} ${desc} ${(product.materials || '')}`.toLowerCase();
    return keywords.some((k) => combined.includes(k.toLowerCase()));
  };

  const packType = product.packagingStructure || 'none';
  const isGable = packType === 'gable_handle_box' || has('gable', 'handle box', 'carry box', 'carry carton');
  const isCanvaMulti = packType === 'canva_multi_box' || has('multi-box', 'multi box', 'isometric box', 'yellow box');
  const isKraftMailer = packType === 'kraft_unboxing_mailer' || has('kraft mailer', 'unboxing mailer', 'corrugated box', 'subscription box');
  const isRigidRibbon = packType === 'rigid_ribbon_box' || has('ribbon box', 'rigid ribbon', 'gift box', 'presentation box');
  const isSlidingSleeve = packType === 'sliding_sleeve_drawer' || has('sliding box', 'sleeve box', 'drawer box', 'matchbox');
  const isDieline = packType === 'packaging_dieline_net' || has('dieline', 'template net', 'blueprint template', 'packaging net');

  // ==========================================
  // CREATIVE PACKAGING & BOX ARCHITECTURES (Direct match to reference image)
  // ==========================================

  // P1. GABLE BOX WITH DIE-CUT HANDLE (Navy "Make Your Box" retail carry carton)
  if (isGable) {
    const bW = Math.min(w * 0.72, 320);
    const bH = Math.min(h * 0.78, 380);
    const bX = cx - bW / 2;
    const bY = bottomY - bH;

    // Contact drop shadow with soft ambient blur
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 6, bW * 0.48, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    const roofH = bH * 0.38;
    const bodyH = bH - roofH;
    const apexY = bY + 20;
    const shoulderY = bY + roofH;

    // Side Gusset Fold (Shadowed facet to left)
    const gussetGrad = ctx.createLinearGradient(bX, 0, bX + 45, 0);
    gussetGrad.addColorStop(0, '#050a12');
    gussetGrad.addColorStop(1, primaryColor);
    ctx.fillStyle = gussetGrad;
    ctx.beginPath();
    ctx.moveTo(bX + 40, apexY);
    ctx.lineTo(bX, shoulderY);
    ctx.lineTo(bX, bottomY - 8);
    ctx.lineTo(bX + 45, bottomY - 8);
    ctx.lineTo(bX + 45, shoulderY);
    ctx.closePath();
    ctx.fill();

    // Main Front Panel Box Body
    const bodyGrad = ctx.createLinearGradient(bX + 45, 0, bX + bW, 0);
    bodyGrad.addColorStop(0, primaryColor);
    bodyGrad.addColorStop(0.35, primaryColor);
    bodyGrad.addColorStop(0.9, '#0d1320');
    bodyGrad.addColorStop(1, '#050810');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(bX + 45, shoulderY, bW - 45, bodyH - 8, [0, 0, 10, 10]);
    ctx.fill();

    // Peaked Gable Sloped Roof Face
    const roofGrad = ctx.createLinearGradient(0, apexY, 0, shoulderY);
    roofGrad.addColorStop(0, '#2d3748');
    roofGrad.addColorStop(0.15, primaryColor);
    roofGrad.addColorStop(1, '#0b0f19');
    ctx.fillStyle = roofGrad;
    ctx.beginPath();
    ctx.moveTo(bX + 40, apexY);
    ctx.lineTo(bX + bW, apexY);
    ctx.lineTo(bX + bW, shoulderY);
    ctx.lineTo(bX + 45, shoulderY);
    ctx.closePath();
    ctx.fill();

    // Crisp Crease Score Line across Shoulder
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bX + 45, shoulderY);
    ctx.lineTo(bX + bW, shoulderY);
    ctx.stroke();

    // Peaked Gable Apex Ridge / Handle Header Flap
    const handleFlapH = 50;
    const flapGrad = ctx.createLinearGradient(0, apexY - handleFlapH, 0, apexY);
    flapGrad.addColorStop(0, '#334155');
    flapGrad.addColorStop(0.4, primaryColor);
    flapGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = flapGrad;
    ctx.beginPath();
    ctx.roundRect(bX + 40, apexY - handleFlapH, bW - 40, handleFlapH + 4, [10, 10, 0, 0]);
    ctx.fill();

    // Header score line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bX + 40, apexY);
    ctx.lineTo(bX + bW, apexY);
    ctx.stroke();

    // Die-Cut Oval Carry Handle (with interior depth shadow)
    const handleCX = bX + 40 + (bW - 40) / 2;
    const handleCY = apexY - handleFlapH / 2;
    const handleRX = (bW - 40) * 0.22;
    const handleRY = 14;

    // Handle interior void
    ctx.fillStyle = '#06080d';
    ctx.beginPath();
    ctx.ellipse(handleCX, handleCY, handleRX, handleRY, 0, 0, Math.PI * 2);
    ctx.fill();

    // Handle bevel highlight on upper rim
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(handleCX, handleCY, handleRX, handleRY, 0, 0, Math.PI);
    ctx.stroke();

    // Bold Front Panel Minimalist Typography (exact match to navy "Make your box")
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'left';
    const textLines = brand.split(' ');
    if (textLines.length >= 2) {
      ctx.fillText(textLines[0], bX + 65, shoulderY + 55);
      ctx.fillText(textLines.slice(1).join(' '), bX + 65, shoulderY + 88);
    } else {
      ctx.fillText(brand, bX + 65, shoulderY + 65);
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('BOX PACK', bX + 65, shoulderY + 95);
    }

    // Minimalist Crosshair / Plus-Grid Graphic Accent (from reference image)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    const crossX = bX + bW - 45;
    const crossY = shoulderY + 65;
    ctx.beginPath();
    ctx.moveTo(crossX - 14, crossY);
    ctx.lineTo(crossX + 14, crossY);
    ctx.moveTo(crossX, crossY - 14);
    ctx.lineTo(crossX, crossY + 14);
    ctx.stroke();

    // Subtle side vertical line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(crossX, shoulderY + 95);
    ctx.lineTo(crossX, bottomY - 30);
    ctx.stroke();

    // Secondary Tagline
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 10px monospace';
    ctx.fillText((product.tagline || 'ARCHITECTURAL CARRY CARTON').toUpperCase(), bX + 65, shoulderY + 130);

    // Dieline info & barcode at bottom
    ctx.fillStyle = '#64748b';
    ctx.font = '9px monospace';
    ctx.fillText('DIELINE 01 • DIE-CUT HANDLE • 350 GSM', bX + 65, bottomY - 24);
  }

  // P2. CANVA DYNAMIC MULTI-BOX STUDIO ARRAY (Cadmium yellow cartons on lilac blocks)
  else if (isCanvaMulti) {
    const aW = Math.min(w * 0.92, 420);
    const aH = Math.min(h * 0.85, 400);
    const aX = cx - aW / 2;
    const aY = bottomY - aH;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 8, aW * 0.48, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Architectural Lilac / Lavender Pedestal Blocks (like in Canva reference)
    const plinth1X = aX + 30;
    const plinth1Y = aY + aH * 0.45;
    const plinth1W = 110;
    const plinth1H = 80;

    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.roundRect(plinth1X, plinth1Y, plinth1W, plinth1H, 8);
    ctx.fill();

    const plinth2X = aX + aW - 130;
    const plinth2Y = aY + aH * 0.55;
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.roundRect(plinth2X, plinth2Y, 110, 70, 8);
    ctx.fill();

    // Box 1: Background Left Box (Cadmium Yellow, angled)
    ctx.save();
    ctx.translate(aX + 85, aY + 90);
    ctx.rotate(-0.25);
    // Box shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(8, 8, 120, 160);
    // Box Face
    ctx.fillStyle = accentColor === '#f59e0b' ? '#fbbf24' : accentColor;
    ctx.fillRect(0, 0, 120, 160);
    // Dark edge
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(105, 0, 15, 160);
    // Typography
    ctx.fillStyle = '#18181b';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(brand.slice(0, 10), 12, 45);
    ctx.font = '9px monospace';
    ctx.fillText('COLD & TASTY', 12, 70);
    ctx.restore();

    // Box 2: Background Right Upright Box
    ctx.save();
    ctx.translate(aX + aW - 145, aY + 70);
    ctx.rotate(0.18);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(8, 8, 115, 175);
    ctx.fillStyle = accentColor === '#f59e0b' ? '#f59e0b' : accentColor;
    ctx.fillRect(0, 0, 115, 175);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.fillRect(0, 0, 18, 175);
    ctx.fillStyle = '#18181b';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('PREMIUM', 26, 40);
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(brand.slice(0, 8), 26, 62);
    ctx.restore();

    // Box 3: Hero Foreground Center Box (Tilted 30 degrees, prominent Swiss typography)
    ctx.save();
    ctx.translate(cx - 30, aY + aH * 0.58);
    ctx.rotate(-0.28);
    // Deep 3D drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(14, 14, 155, 195);
    // Yellow Carton Body
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(0, 0, 155, 195);
    // Right isometric dark bevel
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(155, 0);
    ctx.lineTo(175, 20);
    ctx.lineTo(175, 215);
    ctx.lineTo(155, 195);
    ctx.closePath();
    ctx.fill();
    // Top isometric light bevel
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(20, -20);
    ctx.lineTo(175, -20);
    ctx.lineTo(155, 0);
    ctx.closePath();
    ctx.fill();

    // Bold diagonal Swiss typography (like "cold, smooth & tasty" in Canva image)
    ctx.fillStyle = '#18181b';
    ctx.font = '900 20px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('COLD,', 18, 55);
    ctx.fillText('SMOOTH', 18, 80);
    ctx.fillText('& TASTY.', 18, 105);

    // Brand Name Monogram at bottom
    ctx.font = 'bold 13px monospace';
    ctx.fillText(brand, 18, 150);

    // Barcode on box side
    ctx.fillStyle = '#18181b';
    for (let b = 0; b < 12; b++) {
      ctx.fillRect(18 + b * 9, 165, (b % 3 === 0 ? 4 : 2), 16);
    }
    ctx.restore();
  }

  // P3. CORRUGATED KRAFT UNBOXING MAILER (Open subscription box with crinkle paper bed)
  else if (isKraftMailer) {
    const mW = Math.min(w * 0.88, 380);
    const mH = Math.min(h * 0.72, 340);
    const mX = cx - mW / 2;
    const mY = bottomY - mH;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 6, mW * 0.48, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Natural Kraft Cardboard Gradient
    const kraftBase = '#926a47';
    const kraftLight = '#bfa07d';
    const kraftDark = '#5e432c';

    // 1. Open Hinged Lid (Angled backwards 75 degrees)
    const lidH = mH * 0.45;
    const lidGrad = ctx.createLinearGradient(0, mY, 0, mY + lidH);
    lidGrad.addColorStop(0, kraftDark);
    lidGrad.addColorStop(0.5, kraftBase);
    lidGrad.addColorStop(1, kraftLight);
    ctx.fillStyle = lidGrad;
    ctx.beginPath();
    ctx.moveTo(mX + 25, mY + 15);
    ctx.lineTo(mX + mW - 25, mY + 15);
    ctx.lineTo(mX + mW - 10, mY + lidH + 20);
    ctx.lineTo(mX + 10, mY + lidH + 20);
    ctx.closePath();
    ctx.fill();

    // Lid debossed brand typography on inside flap
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.font = 'bold 22px serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand, cx, mY + lidH * 0.65);
    ctx.font = 'bold 9px monospace';
    ctx.fillText('CRAFTED WITH INTENTION • UNBOX THE EXPERIENCE', cx, mY + lidH * 0.85);

    // 2. Main Box Cavity (Depth and interior shadow)
    const boxY = mY + lidH + 15;
    const boxH = mH - (lidH + 15);
    ctx.fillStyle = '#3a2717';
    ctx.beginPath();
    ctx.roundRect(mX + 8, boxY, mW - 16, boxH, 8);
    ctx.fill();

    // 3. Crinkle Cut Kraft Shredded Paper Bed (Interior unboxing filler)
    ctx.strokeStyle = kraftLight;
    ctx.lineWidth = 3;
    for (let c = 0; c < 28; c++) {
      const crX = mX + 25 + ((c * 43) % (mW - 65));
      const crY = boxY + 15 + ((c * 31) % (boxH * 0.45));
      ctx.beginPath();
      ctx.moveTo(crX, crY);
      ctx.lineTo(crX + 10, crY - 8);
      ctx.lineTo(crX + 18, crY + 5);
      ctx.lineTo(crX + 26, crY - 6);
      ctx.stroke();
    }

    // 4. Premium Embossed Welcome / Product Insert Card inside box
    const cardW = mW * 0.52;
    const cardH = boxH * 0.65;
    const cardX = cx - cardW / 2;
    const cardY = boxY + 22;

    ctx.save();
    ctx.translate(cx, cardY + cardH / 2);
    ctx.rotate(-0.06);
    // Card Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(-cardW / 2 + 5, -cardH / 2 + 5, cardW, cardH);
    // Card Body (Ivory cotton paper)
    ctx.fillStyle = '#fbf9f4';
    ctx.fillRect(-cardW / 2, -cardH / 2, cardW, cardH);
    // Hot-stamped Gold / Copper Foil Emblem
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-cardW / 2 + 10, -cardH / 2 + 10, cardW - 20, cardH - 20);

    ctx.fillStyle = '#1c1917';
    ctx.font = 'bold 16px serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand, 0, -5);
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 8px monospace';
    ctx.fillText('ORIGINAL CREATION', 0, 16);
    ctx.restore();

    // 5. Exterior Front Carton Rim & Wall Thickness
    const rimGrad = ctx.createLinearGradient(0, boxY + boxH - 65, 0, boxY + boxH);
    rimGrad.addColorStop(0, kraftBase);
    rimGrad.addColorStop(1, kraftDark);
    ctx.fillStyle = rimGrad;
    ctx.beginPath();
    ctx.roundRect(mX, boxY + boxH - 65, mW, 65, [0, 0, 12, 12]);
    ctx.fill();

    // Corrugated Fluting Edge Texture
    ctx.strokeStyle = '#422c1b';
    ctx.lineWidth = 1.5;
    for (let f = 0; f < mW - 15; f += 8) {
      ctx.beginPath();
      ctx.moveTo(mX + 10 + f, boxY + boxH - 8);
      ctx.lineTo(mX + 10 + f + 4, boxY + boxH - 2);
      ctx.stroke();
    }

    // Outer Debossed Stencil on Carton Front
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.font = '900 18px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(brand, mX + 28, boxY + boxH - 28);
    ctx.font = '9px monospace';
    ctx.fillText('100% RECYCLED CORRUGATED FLUTING', mX + 28, boxY + boxH - 14);
  }

  // P4. RIGID LUXURY PRESENTATION GIFT BOX WITH SATIN RIBBON (Temu gift box)
  else if (isRigidRibbon) {
    const rW = Math.min(w * 0.72, 320);
    const rH = Math.min(h * 0.72, 320);
    const rX = cx - rW / 2;
    const rY = bottomY - rH;

    // Contact drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 6, rW * 0.48, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rigid Two-Piece Gift Box Base
    const boxGrad = ctx.createLinearGradient(rX, rY, rX + rW, rY + rH);
    boxGrad.addColorStop(0, primaryColor);
    boxGrad.addColorStop(0.5, '#1e2026');
    boxGrad.addColorStop(1, '#090a0f');
    ctx.fillStyle = boxGrad;
    ctx.beginPath();
    ctx.roundRect(rX, rY + 40, rW, rH - 45, 12);
    ctx.fill();

    // Box Lid (Telescoping Upper Cap)
    const lidGrad = ctx.createLinearGradient(rX - 8, rY, rX + rW + 8, rY + 55);
    lidGrad.addColorStop(0, '#333846');
    lidGrad.addColorStop(0.3, primaryColor);
    lidGrad.addColorStop(1, '#0c0e14');
    ctx.fillStyle = lidGrad;
    ctx.beginPath();
    ctx.roundRect(rX - 6, rY, rW + 12, 55, [14, 14, 6, 6]);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 38mm Satin Ribbon - Vertical Cross Band
    const ribbonW = 38;
    const ribbonGrad = ctx.createLinearGradient(cx - ribbonW / 2, 0, cx + ribbonW / 2, 0);
    ribbonGrad.addColorStop(0, '#78350f');
    ribbonGrad.addColorStop(0.3, accentColor);
    ribbonGrad.addColorStop(0.7, '#fde68a');
    ribbonGrad.addColorStop(1, '#92400e');
    ctx.fillStyle = ribbonGrad;
    ctx.fillRect(cx - ribbonW / 2, rY, ribbonW, rH - 5);

    // 38mm Satin Ribbon - Horizontal Cross Band
    const ribbonH = 34;
    const ribbonHGrad = ctx.createLinearGradient(0, rY + rH * 0.52 - ribbonH / 2, 0, rY + rH * 0.52 + ribbonH / 2);
    ribbonHGrad.addColorStop(0, '#78350f');
    ribbonHGrad.addColorStop(0.3, accentColor);
    ribbonHGrad.addColorStop(0.7, '#fde68a');
    ribbonHGrad.addColorStop(1, '#92400e');
    ctx.fillStyle = ribbonHGrad;
    ctx.fillRect(rX, rY + rH * 0.52 - ribbonH / 2, rW, ribbonH);

    // Hot-Stamped Copper / Gold Foil Brand Crest
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(rX + 25, rY + rH * 0.2, rW - 50, 48);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rX + 25, rY + rH * 0.2, rW - 50, 48);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand, cx, rY + rH * 0.2 + 28);
    ctx.font = 'bold 9px sans-serif';
    ctx.fillStyle = accentColor;
    ctx.fillText('HAUTE PRESENTATION', cx, rY + rH * 0.2 + 42);

    // Dimensionally Tied Satin Ribbon Bow Knot on Top
    const bowY = rY;
    // Left Bow Loop
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.ellipse(cx - 38, bowY - 14, 38, 16, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Right Bow Loop
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.ellipse(cx + 38, bowY - 14, 38, 16, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Center Knot Core
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(cx, bowY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Flowing Ribbon Tails
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.moveTo(cx - 8, bowY + 8);
    ctx.quadraticCurveTo(cx - 45, bowY + 45, cx - 65, bowY + 95);
    ctx.lineTo(cx - 48, bowY + 95);
    ctx.quadraticCurveTo(cx - 30, bowY + 45, cx + 2, bowY + 8);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + 8, bowY + 8);
    ctx.quadraticCurveTo(cx + 45, bowY + 45, cx + 65, bowY + 95);
    ctx.lineTo(cx + 48, bowY + 95);
    ctx.quadraticCurveTo(cx + 30, bowY + 45, cx - 2, bowY + 8);
    ctx.closePath();
    ctx.fill();
  }

  // P5. TWO-PIECE SLIDING DRAWER MATCHBOX (Harmony / BoxesGen sleeve box)
  else if (isSlidingSleeve) {
    const sW = Math.min(w * 0.85, 360);
    const sH = Math.min(h * 0.58, 240);
    const sX = cx - sW / 2;
    const sY = bottomY - sH;

    // Contact drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 6, sW * 0.48, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. Sliding Outward Inner Tray (Pulled out to right by 35%)
    const trayW = sW * 0.85;
    const trayH = sH * 0.85;
    const trayX = sX + sW * 0.25;
    const trayY = sY + sH * 0.08;

    // Inner Tray Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(trayX + 10, trayY + 10, trayW, trayH);

    // Inner Tray Body (Ivory / Contrast Tray)
    ctx.fillStyle = lightColor === '#ffffff' ? '#faf7f2' : lightColor;
    ctx.beginPath();
    ctx.roundRect(trayX, trayY, trayW, trayH, 8);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Woven Fabric Pull-Tab Ribbon on Drawer Lip
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.roundRect(trayX + trayW - 6, trayY + trayH * 0.4, 22, 18, 4);
    ctx.fill();

    // Interior Molded Bed inside pulled-out tray
    ctx.fillStyle = '#e7e2d8';
    ctx.beginPath();
    ctx.roundRect(trayX + trayW * 0.45, trayY + 15, trayW * 0.45, trayH - 30, 6);
    ctx.fill();

    // 2. Main Outer Sleeve Carton (Coral/Terracotta or User primary color)
    const sleeveW = sW * 0.75;
    const sleeveGrad = ctx.createLinearGradient(sX, sY, sX + sleeveW, sY + sH);
    sleeveGrad.addColorStop(0, primaryColor);
    sleeveGrad.addColorStop(0.6, '#991b1b');
    sleeveGrad.addColorStop(1, '#450a0a');
    ctx.fillStyle = sleeveGrad;
    ctx.beginPath();
    ctx.roundRect(sX, sY, sleeveW, sH, 10);
    ctx.fill();

    // Debossed Geometric Pattern Linework on Sleeve Face
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    for (let l = 0; l < 4; l++) {
      ctx.beginPath();
      ctx.arc(sX + sleeveW * 0.35, sY + sH * 0.5, 25 + l * 18, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Outer Sleeve Bevel and Opening Lip
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(sX + sleeveW - 12, sY, 12, sH);

    // Brand Name Typography on Outer Sleeve
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(brand, sX + 24, sY + 45);

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 10px monospace';
    ctx.fillText((product.tagline || 'FRICTIONLESS SLIDE CARTON').toUpperCase(), sX + 24, sY + 70);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '9px monospace';
    ctx.fillText('TWO-PIECE MATCHBOX SLEEVE • PULP TRAY', sX + 24, sY + sH - 22);
  }

  // P6. TECHNICAL PACKAGING DIELINE BLUEPRINT (Vecteezy flat CAD template net)
  else if (isDieline) {
    const dW = Math.min(w * 0.92, 420);
    const dH = Math.min(h * 0.88, 420);
    const dX = cx - dW / 2;
    const dY = bottomY - dH;

    // Technical CAD Engineering Blueprint Mat
    const matGrad = ctx.createLinearGradient(dX, dY, dX + dW, dY + dH);
    matGrad.addColorStop(0, '#0f172a');
    matGrad.addColorStop(1, '#020617');
    ctx.fillStyle = matGrad;
    ctx.beginPath();
    ctx.roundRect(dX, dY, dW, dH, 12);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Engineering Coordinate Grid Lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1;
    for (let gx = dX + 20; gx < dX + dW; gx += 20) {
      ctx.beginPath();
      ctx.moveTo(gx, dY);
      ctx.lineTo(gx, dY + dH);
      ctx.stroke();
    }
    for (let gy = dY + 20; gy < dY + dH; gy += 20) {
      ctx.beginPath();
      ctx.moveTo(dX, gy);
      ctx.lineTo(dX + dW, gy);
      ctx.stroke();
    }

    // Flat Unfolded Dieline Panels (Center net layout)
    const netCX = cx;
    const netCY = dY + dH * 0.52;
    const panelW = 75;
    const panelH = 110;

    // 1. Front Panel (Tangerine / Accent)
    ctx.fillStyle = accentColor;
    ctx.fillRect(netCX - panelW, netCY - panelH / 2, panelW, panelH);

    // Front Panel Typography
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand, netCX - panelW / 2, netCY - 10);
    ctx.font = '8px monospace';
    ctx.fillText('FRONT PANEL', netCX - panelW / 2, netCY + 15);

    // 2. Back Panel (White SBS board)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(netCX, netCY - panelH / 2, panelW, panelH);

    // Back Panel Nutrition & Barcode
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('SPECIFICATIONS', netCX + panelW / 2, netCY - 25);
    for (let b = 0; b < 10; b++) {
      ctx.fillRect(netCX + 15 + b * 5, netCY + 20, 2, 14);
    }

    // 3. Left Side Panel
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(netCX - panelW * 1.5, netCY - panelH / 2, panelW * 0.5, panelH);

    // 4. Right Side Panel
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(netCX + panelW, netCY - panelH / 2, panelW * 0.5, panelH);

    // 5. Top Tuck-In Flap
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(netCX - panelW, netCY - panelH / 2);
    ctx.lineTo(netCX - panelW + 10, netCY - panelH / 2 - 40);
    ctx.lineTo(netCX - 10, netCY - panelH / 2 - 40);
    ctx.lineTo(netCX, netCY - panelH / 2);
    ctx.closePath();
    ctx.fill();

    // 6. Glue Tab (Hatched lines on left side)
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(netCX - panelW * 1.5, netCY - panelH / 2 + 10);
    ctx.lineTo(netCX - panelW * 1.5 - 20, netCY - panelH / 2 + 25);
    ctx.lineTo(netCX - panelW * 1.5 - 20, netCY + panelH / 2 - 25);
    ctx.lineTo(netCX - panelW * 1.5, netCY + panelH / 2 - 10);
    ctx.closePath();
    ctx.fill();

    // Cut Lines (Solid Red #ef4444)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(netCX - panelW * 1.5 - 20, netCY - panelH / 2 - 40, panelW * 2.5 + 40, panelH + 75);

    // Fold Score Crease Lines (Dashed Cyan #06b6d4)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(netCX, netCY - panelH / 2);
    ctx.lineTo(netCX, netCY + panelH / 2);
    ctx.moveTo(netCX - panelW, netCY - panelH / 2);
    ctx.lineTo(netCX - panelW, netCY + panelH / 2);
    ctx.moveTo(netCX - panelW * 1.5, netCY - panelH / 2);
    ctx.lineTo(netCX - panelW * 1.5, netCY + panelH / 2);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // CMYK Prepress Color Calibration Bars at Top
    const cmykColors = ['#00ffff', '#ff00ff', '#ffff00', '#000000'];
    cmykColors.forEach((col, idx) => {
      ctx.fillStyle = col;
      ctx.fillRect(dX + 25 + idx * 18, dY + 18, 14, 10);
    });

    // Technical Dieline Info Overlay
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('DIELINE BLUEPRINT • CAD NET TEMPLATE', dX + 110, dY + 27);
    ctx.fillStyle = '#ef4444';
    ctx.font = '9px monospace';
    ctx.fillText('RED: DIE-CUT  |  CYAN: SCORE/CREASE', dX + 25, dY + dH - 18);
  }

  // 1. FOOTWEAR / SNEAKER / ATHLETIC SHOE
  else if (has('shoe', 'sneaker', 'footwear', 'runner', 'kicks', 'boot', 'sole', 'trainer', 'cleat', 'sandal')) {
    const sW = Math.min(w * 0.88, 380);
    const sH = Math.min(h * 0.52, 220);
    const sX = cx - sW / 2;
    const sY = bottomY - sH;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 6, sW * 0.48, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Outsole (Tread base)
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.moveTo(sX + 25, sY + sH);
    ctx.quadraticCurveTo(sX + sW * 0.5, sY + sH + 6, sX + sW - 15, sY + sH - 10);
    ctx.lineTo(sX + sW - 15, sY + sH - 22);
    ctx.quadraticCurveTo(sX + sW * 0.5, sY + sH - 12, sX + 25, sY + sH - 18);
    ctx.closePath();
    ctx.fill();

    // Tread grooved lugs
    ctx.strokeStyle = '#00000088';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 9; i++) {
      const lx = sX + 45 + i * (sW * 0.08);
      ctx.beginPath();
      ctx.moveTo(lx, sY + sH - 18);
      ctx.lineTo(lx - 8, sY + sH);
      ctx.stroke();
    }

    // Sculpted Nitrogen Foam Midsole
    const midGrad = ctx.createLinearGradient(sX, sY + sH - 55, sX, sY + sH);
    midGrad.addColorStop(0, '#ffffff');
    midGrad.addColorStop(0.3, lightColor);
    midGrad.addColorStop(0.8, '#cbd5e1');
    midGrad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = midGrad;
    ctx.beginPath();
    ctx.moveTo(sX + 15, sY + sH - 25);
    ctx.quadraticCurveTo(sX + sW * 0.35, sY + sH - 35, sX + sW * 0.7, sY + sH - 25);
    ctx.quadraticCurveTo(sX + sW - 5, sY + sH - 15, sX + sW - 12, sY + sH - 55);
    ctx.quadraticCurveTo(sX + sW * 0.65, sY + sH - 42, sX + sW * 0.35, sY + sH - 48);
    ctx.quadraticCurveTo(sX + 30, sY + sH - 35, sX + 15, sY + sH - 25);
    ctx.closePath();
    ctx.fill();

    // Midsole Heel Air-Pod / Accent Insert
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.ellipse(sX + sW * 0.78, sY + sH - 38, sW * 0.12, 10, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Upper Shell (Knit & Technical Panels)
    const upperGrad = ctx.createLinearGradient(sX, sY, sX + sW, sY + sH);
    upperGrad.addColorStop(0, primaryColor);
    upperGrad.addColorStop(0.5, primaryColor);
    upperGrad.addColorStop(1, '#090a0f');
    ctx.fillStyle = upperGrad;
    ctx.beginPath();
    ctx.moveTo(sX + 20, sY + sH - 32); // Toe tip
    ctx.quadraticCurveTo(sX + sW * 0.22, sY + sH - 85, sX + sW * 0.42, sY + sH - 95); // Vamp to instep
    ctx.lineTo(sX + sW * 0.58, sY + 15); // Tongue peak
    ctx.quadraticCurveTo(sX + sW * 0.68, sY + 35, sX + sW * 0.82, sY + 25); // Ankle collar notch
    ctx.quadraticCurveTo(sX + sW - 10, sY + 50, sX + sW - 12, sY + sH - 52); // Heel curve
    ctx.quadraticCurveTo(sX + sW * 0.5, sY + sH - 45, sX + 20, sY + sH - 32);
    ctx.closePath();
    ctx.fill();

    // Breathable micro-mesh knit pattern on vamp
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 8; c++) {
        ctx.beginPath();
        ctx.arc(sX + sW * 0.2 + c * 10, sY + sH - 75 + r * 7, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Dynamic Lateral Wave Overlay / Speed Stripe
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(sX + sW * 0.28, sY + sH - 52);
    ctx.quadraticCurveTo(sX + sW * 0.5, sY + sH - 85, sX + sW * 0.78, sY + sH - 65);
    ctx.stroke();

    // Heel TPU Stabilization Clip
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(sX + sW * 0.72, sY + sH - 55);
    ctx.lineTo(sX + sW * 0.88, sY + sH - 80);
    ctx.lineTo(sX + sW - 12, sY + sH - 55);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Lacing System (5 Diagonal Tension Ribs)
    ctx.strokeStyle = lightColor;
    ctx.lineWidth = 3.5;
    for (let l = 0; l < 5; l++) {
      const lx1 = sX + sW * 0.38 + l * 8;
      const ly1 = sY + sH - 85 + l * 10;
      const lx2 = sX + sW * 0.45 + l * 8;
      const ly2 = sY + sH - 105 + l * 12;
      ctx.beginPath();
      ctx.moveTo(lx1, ly1);
      ctx.lineTo(lx2, ly2);
      ctx.stroke();
    }

    // Brand Name Typography on Heel / Flank
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(brand, sX + sW * 0.35, sY + sH - 55);
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 9px monospace';
    ctx.fillText('KINETIC LABS • ZERO DROP', sX + sW * 0.35, sY + sH - 42);
    ctx.restore();
  }

  // 2. EYEWEAR / SUNGLASSES / SPECTACLES
  else if (has('eyewear', 'sunglass', 'glasses', 'spectacle', 'shades', 'frames', 'lenses')) {
    const gW = Math.min(w * 0.85, 360);
    const gH = Math.min(h * 0.42, 170);
    const gY = bottomY - h * 0.48;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 10, gW * 0.45, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    const lensW = gW * 0.42;
    const lensH = gH * 0.72;
    const bridgeW = gW * 0.12;

    const leftLX = cx - bridgeW / 2 - lensW;
    const rightLX = cx + bridgeW / 2;
    const lensY = gY + 25;

    // Temple Arms (Isometric 3D perspective extending back)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(leftLX + 5, lensY + 15);
    ctx.lineTo(leftLX - 35, lensY - 45);
    ctx.moveTo(rightLX + lensW - 5, lensY + 15);
    ctx.lineTo(rightLX + lensW + 35, lensY - 45);
    ctx.stroke();

    // Acetate / Titanium Rims & Lenses (Left & Right)
    [leftLX, rightLX].forEach((lX, idx) => {
      // Outer Rim Frame
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      ctx.roundRect(lX - 4, lensY - 4, lensW + 8, lensH + 8, [18, 18, 28, 28]);
      ctx.fill();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Polarized Gradient Lens
      const lGrad = ctx.createLinearGradient(lX, lensY, lX + lensW, lensY + lensH);
      lGrad.addColorStop(0, '#020617');
      lGrad.addColorStop(0.5, accentColor + '66');
      lGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = lGrad;
      ctx.beginPath();
      ctx.roundRect(lX, lensY, lensW, lensH, [14, 14, 24, 24]);
      ctx.fill();

      // Specular High-Gloss Diagonal Glare Streak
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.beginPath();
      ctx.moveTo(lX + lensW * 0.35, lensY + 4);
      ctx.lineTo(lX + lensW * 0.55, lensY + 4);
      ctx.lineTo(lX + lensW * 0.2, lensY + lensH - 6);
      ctx.lineTo(lX + lensW * 0.05, lensY + lensH - 6);
      ctx.closePath();
      ctx.fill();

      // Laser etch on top corner of left lens
      if (idx === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(brand.slice(0, 8), lX + 8, lensY + 16);
      }
    });

    // Dual Architectural Bridge (Nose bridge & Brow bar)
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(leftLX + lensW, lensY + 8);
    ctx.lineTo(rightLX, lensY + 8);
    ctx.stroke();

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, lensY + lensH * 0.35, bridgeW * 0.65, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();

    // Brand Name Typography Underneath
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand, cx, bottomY - 30);
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 10px monospace';
    ctx.fillText('JAPANESE BETA-TITANIUM • UV400 POLARIZED', cx, bottomY - 14);
  }

  // 3. OVER-EAR HEADPHONES / EARBUDS
  else if (has('headphone', 'earphone', 'earbud', 'over-ear', 'earcup', 'acoustic monitor')) {
    const rW = Math.min(w * 0.75, 320);
    const rH = Math.min(h * 0.72, 340);
    const topY = bottomY - rH;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 8, rW * 0.45, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Suspension Headband Arch
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 22;
    ctx.beginPath();
    ctx.arc(cx, topY + rH * 0.42, rW * 0.42, Math.PI * 1.08, Math.PI * 1.92);
    ctx.stroke();

    // Padded Leather Underside Cushion
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(cx, topY + rH * 0.42, rW * 0.39, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    // Metallic Headband Sliders / Yolks
    const cupW = rW * 0.28;
    const cupH = rH * 0.44;
    const leftCX = cx - rW * 0.36;
    const rightCX = cx + rW * 0.36;
    const cupCY = topY + rH * 0.65;

    [leftCX, rightCX].forEach((cupX) => {
      // Telescoping metal arm
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cupX, cupCY - cupH * 0.7);
      ctx.lineTo(cupX, cupCY - cupH * 0.4);
      ctx.stroke();

      // Memory Foam Cushion (Dark Plush Leather)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(cupX, cupCY, cupW * 0.58, cupH * 0.52, 0, 0, Math.PI * 2);
      ctx.fill();

      // Outer Spun Metal Earcup Shell
      const cupGrad = ctx.createRadialGradient(cupX - 5, cupCY - 10, 5, cupX, cupCY, cupW * 0.48);
      cupGrad.addColorStop(0, '#475569');
      cupGrad.addColorStop(0.5, primaryColor);
      cupGrad.addColorStop(1, '#020617');
      ctx.fillStyle = cupGrad;
      ctx.beginPath();
      ctx.ellipse(cupX, cupCY, cupW * 0.48, cupH * 0.46, 0, 0, Math.PI * 2);
      ctx.fill();

      // Concentric Spun Acoustic Grooves
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      for (let g = 1; g <= 3; g++) {
        ctx.beginPath();
        ctx.ellipse(cupX, cupCY, (cupW * 0.48 * g) / 4, (cupH * 0.46 * g) / 4, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Glowing Halo Ring in Accent Color
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cupX, cupCY, cupW * 0.36, cupH * 0.34, 0, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Centered Brand Typography between cups
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand, cx, cupCY);

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 11px monospace';
    ctx.fillText('BERYLLIUM DRIVER • 48-BIT DSP', cx, cupCY + 22);
  }

  // 4. SMART RING / JEWELRY / BIOMETRIC RING
  else if (has('ring', 'jewelry', 'bracelet', 'pendant', 'necklace', 'band', 'wearable')) {
    const ringRadius = Math.min(w * 0.38, h * 0.38, 160);
    const cy = bottomY - ringRadius * 1.1;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 12, ringRadius * 0.85, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Outer Torus Ring in 35-degree Isometric Tilt
    const ringThickness = ringRadius * 0.38;

    // Outer Back Arc
    const backGrad = ctx.createLinearGradient(cx - ringRadius, cy, cx + ringRadius, cy);
    backGrad.addColorStop(0, '#1e293b');
    backGrad.addColorStop(0.5, '#090d16');
    backGrad.addColorStop(1, '#1e293b');
    ctx.strokeStyle = backGrad;
    ctx.lineWidth = ringThickness;
    ctx.beginPath();
    ctx.ellipse(cx, cy, ringRadius, ringRadius * 0.45, 0, Math.PI, Math.PI * 2);
    ctx.stroke();

    // Biometric Optical Sensor Nodes (Glowing emerald and infrared on inner surface)
    for (let s = 0; s < 3; s++) {
      const sAngle = Math.PI * 1.25 + s * 0.25;
      const sx = cx + Math.cos(sAngle) * (ringRadius - ringThickness * 0.2);
      const sy = cy + Math.sin(sAngle) * ((ringRadius - ringThickness * 0.2) * 0.45);
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(sx, sy, 4, 0, Math.PI * 2);
      ctx.fill();
      // Glow
      ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.beginPath();
      ctx.arc(sx, sy, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer Front Arc (Brushed Titanium / Ceramic with Beveled Edges)
    const frontGrad = ctx.createLinearGradient(cx - ringRadius, cy, cx + ringRadius, cy);
    frontGrad.addColorStop(0, primaryColor);
    frontGrad.addColorStop(0.3, '#94a3b8');
    frontGrad.addColorStop(0.5, lightColor);
    frontGrad.addColorStop(0.7, primaryColor);
    frontGrad.addColorStop(1, '#0f172a');
    ctx.strokeStyle = frontGrad;
    ctx.lineWidth = ringThickness;
    ctx.beginPath();
    ctx.ellipse(cx, cy, ringRadius, ringRadius * 0.45, 0, 0, Math.PI);
    ctx.stroke();

    // Polished Edge Chamfer Inlays
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy - ringThickness * 0.4, ringRadius, ringRadius * 0.45, 0, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, cy + ringThickness * 0.4, ringRadius, ringRadius * 0.45, 0, 0, Math.PI);
    ctx.stroke();

    // Laser-etched Brand on Outer Face
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand, cx, bottomY - 38);

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 11px monospace';
    ctx.fillText('AEROSPACE TITANIUM • PPG OPTICAL TELEMETRY', cx, bottomY - 18);
  }

  // 5. CAMERA / OPTICS / PHOTOGRAPHY
  else if (has('camera', 'lens', 'shutter', 'aperture', 'photography', 'optics')) {
    const cW = Math.min(w * 0.78, 340);
    const cH = Math.min(h * 0.58, 240);
    const cX = cx - cW / 2;
    const cY = bottomY - cH;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 8, cW * 0.48, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Magnesium Alloy Chassis
    const bodyGrad = ctx.createLinearGradient(cX, cY, cX + cW, cY + cH);
    bodyGrad.addColorStop(0, primaryColor);
    bodyGrad.addColorStop(0.5, '#1e293b');
    bodyGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(cX, cY + 30, cW, cH - 30, 16);
    ctx.fill();

    // Leatherette Textured Grip (Right side)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(cX + cW * 0.65, cY + 35, cW * 0.32, cH - 40, 10);
    ctx.fill();

    // Top Plate Dials (Shutter dial, Mode dial)
    ctx.fillStyle = '#64748b';
    ctx.fillRect(cX + 25, cY + 12, 34, 18); // Mode dial
    ctx.fillRect(cX + cW - 65, cY + 12, 38, 18); // Shutter dial
    // Red Shutter Release Button
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(cX + cW - 85, cY + 22, 9, 0, Math.PI * 2);
    ctx.fill();

    // Central Multi-Element Lens Barrel
    const lensR = Math.min(cW * 0.32, (cH - 30) * 0.48);
    const lensCX = cX + cW * 0.38;
    const lensCY = cY + 30 + (cH - 30) / 2;

    // Outer Barrel Ring with Knurled Teeth
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(lensCX, lensCY, lensR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Antireflective Glass Element (Emerald/Cyan/Violet iridescent sheen)
    const glassGrad = ctx.createRadialGradient(lensCX - 15, lensCY - 15, 10, lensCX, lensCY, lensR * 0.85);
    glassGrad.addColorStop(0, '#06b6d4');
    glassGrad.addColorStop(0.4, '#1e1b4b');
    glassGrad.addColorStop(0.8, '#042f2e');
    glassGrad.addColorStop(1, '#020617');
    ctx.fillStyle = glassGrad;
    ctx.beginPath();
    ctx.arc(lensCX, lensCY, lensR * 0.82, 0, Math.PI * 2);
    ctx.fill();

    // Specular Reflection Crescent
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(lensCX, lensCY, lensR * 0.65, -0.8, 0.5);
    ctx.stroke();

    // Aperture Blades Inlay
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(lensCX, lensCY, lensR * 0.3, 0, Math.PI * 2);
    ctx.stroke();

    // Brand Name Typography on Top Face
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(brand, cX + 25, cY + 55);

    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(cX + cW - 35, cY + 55, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. SMARTPHONE / TABLET / HANDHELD / SCREEN
  else if (has('phone', 'smartphone', 'tablet', 'screen', 'oled', 'handheld', 'display', 'gadget')) {
    const pW = Math.min(w * 0.55, 240);
    const pH = Math.min(h * 0.76, 420);
    const pX = cx - pW / 2;
    const pY = bottomY - pH;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 8, pW * 0.5, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Outer Titanium / Polished Bezel Chassis
    const bezelGrad = ctx.createLinearGradient(pX, pY, pX + pW, pY + pH);
    bezelGrad.addColorStop(0, '#64748b');
    bezelGrad.addColorStop(0.5, '#1e293b');
    bezelGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bezelGrad;
    ctx.beginPath();
    ctx.roundRect(pX - 4, pY - 4, pW + 8, pH + 8, 28);
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Edge-to-Edge Vibrant OLED Display
    const oledGrad = ctx.createLinearGradient(pX, pY, pX + pW, pY + pH);
    oledGrad.addColorStop(0, '#090d16');
    oledGrad.addColorStop(0.4, primaryColor);
    oledGrad.addColorStop(0.7, accentColor + '88');
    oledGrad.addColorStop(1, '#020617');
    ctx.fillStyle = oledGrad;
    ctx.beginPath();
    ctx.roundRect(pX, pY, pW, pH, 24);
    ctx.fill();

    // Ambient UI Wallpaper Glow Curve
    ctx.fillStyle = accentColor + '33';
    ctx.beginPath();
    ctx.ellipse(cx, pY + pH * 0.55, pW * 0.4, pH * 0.28, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Lockscreen Status Bar & Time
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 38px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('09:41', cx, pY + pH * 0.26);

    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('THURSDAY, OCTOBER 29', cx, pY + pH * 0.32);

    // Centered Brand Monogram / Icon Lockup on Display
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(brand, cx, pY + pH * 0.65);

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 10px monospace';
    ctx.fillText('SPATIAL ENGINE • 120HZ OLED', cx, pY + pH * 0.72);

    // Glass Reflection Diagonal Glare
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.moveTo(pX + 20, pY);
    ctx.lineTo(pX + 70, pY);
    ctx.lineTo(pX + 10, pY + pH);
    ctx.lineTo(pX - 40, pY + pH);
    ctx.closePath();
    ctx.fill();
  }

  // 7. FURNITURE / CHAIR / ARMCHAIR / SEATING / DESK
  else if (has('chair', 'armchair', 'furniture', 'lounge', 'seating', 'stool', 'sofa', 'table')) {
    const fW = Math.min(w * 0.78, 360);
    const fH = Math.min(h * 0.68, 320);
    const fX = cx - fW / 2;
    const fY = bottomY - fH;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 6, fW * 0.48, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Splayed Architectural Steel / Brass Legs
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx - fW * 0.32, bottomY - 8);
    ctx.lineTo(cx - fW * 0.2, fY + fH * 0.68);
    ctx.moveTo(cx + fW * 0.32, bottomY - 8);
    ctx.lineTo(cx + fW * 0.2, fY + fH * 0.68);
    ctx.stroke();

    // Brass Leg Glides
    ctx.fillStyle = accentColor;
    ctx.fillRect(cx - fW * 0.32 - 4, bottomY - 14, 8, 8);
    ctx.fillRect(cx + fW * 0.32 - 4, bottomY - 14, 8, 8);

    // Steam-Bent Wood Shell
    const shellGrad = ctx.createLinearGradient(fX, fY, fX + fW, fY + fH);
    shellGrad.addColorStop(0, primaryColor);
    shellGrad.addColorStop(0.5, '#451a03');
    shellGrad.addColorStop(1, '#1c1917');
    ctx.fillStyle = shellGrad;
    ctx.beginPath();
    ctx.roundRect(fX, fY + 20, fW, fH * 0.58, [35, 35, 20, 20]);
    ctx.fill();

    // Deep Tufted Seat Bolster Cushion (Tactile Bouclé Fabric)
    const cW = fW * 0.82;
    const cH = fH * 0.48;
    const cX = cx - cW / 2;
    const cY = fY + fH * 0.22;
    ctx.fillStyle = lightColor;
    ctx.beginPath();
    ctx.roundRect(cX, cY, cW, cH, 20);
    ctx.fill();

    // Cushion stitch seam accents
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cX + 20, cY + cH * 0.5);
    ctx.lineTo(cX + cW - 20, cY + cH * 0.5);
    ctx.stroke();

    // Solid Walnut / Brass Inscription Plaque
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 60, cY + cH - 18, 120, 24);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - 60, cY + cH - 18, 120, 24);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand, cx, cY + cH - 2);
  }

  // 8. ARCHITECTURAL LIGHTING / LAMP
  else if (has('lamp', 'lighting', 'light', 'chandelier', 'fixture', 'sconce')) {
    const lW = Math.min(w * 0.65, 280);
    const lH = Math.min(h * 0.78, 380);
    const lY = bottomY - lH;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 6, lW * 0.38, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Heavy Plinth Base (Honed Nero Marquina Marble)
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.roundRect(cx - lW * 0.35, bottomY - 26, lW * 0.7, 22, 6);
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Slender Cantilevered Arch Stem
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx, bottomY - 26);
    ctx.lineTo(cx, lY + lH * 0.3);
    ctx.quadraticCurveTo(cx, lY + 20, cx - lW * 0.25, lY + 20);
    ctx.stroke();

    // Sculptural Lamp Shade
    const shadeCX = cx - lW * 0.25;
    const shadeCY = lY + 25;
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.arc(shadeCX, shadeCY, 42, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Warm Radiant Downward Light Cone
    const coneGrad = ctx.createLinearGradient(shadeCX, shadeCY, shadeCX, bottomY - 40);
    coneGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
    coneGrad.addColorStop(0.7, 'rgba(251, 191, 36, 0.1)');
    coneGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = coneGrad;
    ctx.beginPath();
    ctx.moveTo(shadeCX - 38, shadeCY + 5);
    ctx.lineTo(shadeCX + 38, shadeCY + 5);
    ctx.lineTo(shadeCX + 110, bottomY - 40);
    ctx.lineTo(shadeCX - 110, bottomY - 40);
    ctx.closePath();
    ctx.fill();

    // Inscribed Brand
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand, cx, bottomY - 38);
  }

  // 9. BAG / BACKPACK / LUGGAGE / LEATHER GOODS
  else if (has('bag', 'backpack', 'tote', 'luggage', 'duffel', 'briefcase', 'pack')) {
    const bW = Math.min(w * 0.72, 320);
    const bH = Math.min(h * 0.72, 340);
    const bX = cx - bW / 2;
    const bY = bottomY - bH;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 8, bW * 0.45, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Top Grab Handle
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx, bY + 15, bW * 0.18, Math.PI, 0);
    ctx.stroke();

    // Main Backpack Body (Structured Ballistic Fabric / Rich Leather)
    const bagGrad = ctx.createLinearGradient(bX, bY, bX + bW, bY + bH);
    bagGrad.addColorStop(0, primaryColor);
    bagGrad.addColorStop(0.6, '#1e293b');
    bagGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = bagGrad;
    ctx.beginPath();
    ctx.roundRect(bX, bY + 25, bW, bH - 30, [32, 32, 16, 16]);
    ctx.fill();

    // Waterproof Taped Zipper Seam
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bX + 25, bY + bH * 0.4);
    ctx.lineTo(bX + bW - 25, bY + bH * 0.4);
    ctx.stroke();

    // Magnetic Anodized Aluminum Buckle
    ctx.fillStyle = '#64748b';
    ctx.fillRect(cx - 24, bY + bH * 0.36, 48, 16);
    ctx.fillStyle = accentColor;
    ctx.fillRect(cx - 16, bY + bH * 0.38, 32, 12);

    // Front Utility Pocket Compartment
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.roundRect(bX + 20, bY + bH * 0.45, bW - 40, bH * 0.45, 12);
    ctx.fill();

    // Debossed Leather Brand Badge
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(cx - 55, bY + bH * 0.7, 110, 32, 6);
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand, cx, bY + bH * 0.7 + 21);
  }

  // 10. BEVERAGE CAN / CRAFT DRINK (e.g. NOIR Cold Brew)
  else if (has('beverage', 'drink', 'can', 'cold brew', 'beer', 'soda', 'brew', 'aluminum can')) {
    const cW = Math.min(w * 0.42, 180);
    const cH = Math.min(h * 0.74, 380);
    const cX = cx - cW / 2;
    const cY = bottomY - cH;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 6, cW * 0.45, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cylindrical Can Body with Brushed Metallic Sheen
    const canGrad = ctx.createLinearGradient(cX, 0, cX + cW, 0);
    canGrad.addColorStop(0, primaryColor);
    canGrad.addColorStop(0.25, '#ffffff33');
    canGrad.addColorStop(0.5, primaryColor);
    canGrad.addColorStop(0.85, '#00000088');
    canGrad.addColorStop(1, '#ffffff22');
    ctx.fillStyle = canGrad;
    ctx.beginPath();
    ctx.roundRect(cX, cY + 22, cW, cH - 28, [10, 10, 18, 18]);
    ctx.fill();

    // Tapered Top Chime / Neck
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(cX + 8, cY + 22);
    ctx.lineTo(cX + 18, cY + 6);
    ctx.lineTo(cX + cW - 18, cY + 6);
    ctx.lineTo(cX + cW - 8, cY + 22);
    ctx.closePath();
    ctx.fill();

    // Can Lid Top Oval with Pull-Tab
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.ellipse(cx, cY + 6, cW * 0.38, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Copper / Accent Pull-Tab Ring
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.ellipse(cx, cY + 6, cW * 0.16, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Copper Foil Accent Bands
    ctx.fillStyle = accentColor;
    ctx.fillRect(cX, cY + 36, cW, 5);
    ctx.fillRect(cX, bottomY - 24, cW, 5);

    // Tactile Condensation Micro-Droplets
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let d = 0; d < 14; d++) {
      const dx = cX + 15 + ((d * 37) % (cW - 30));
      const dy = cY + 50 + ((d * 53) % (cH - 100));
      ctx.beginPath();
      ctx.arc(dx, dy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Bold Vertical Brand Lettermark on Can
    ctx.save();
    ctx.translate(cx, cY + cH * 0.52);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand, 0, 10);
    ctx.restore();

    // Sub-mark
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(product.category ? product.category.toUpperCase() : 'SINGLE ORIGIN', cx, cY + cH * 0.82);
  }

  // 11. ACOUSTIC SPEAKER / MONITOR (e.g. SOLIS)
  else if (has('speaker', 'audio', 'sound', 'acoustic monitor', 'woofer')) {
    const spW = Math.min(w * 0.65, 280);
    const spH = Math.min(h * 0.72, 340);
    const spX = cx - spW / 2;
    const spY = bottomY - spH;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 6, spW * 0.45, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bent Scandinavian Wood Cabinet
    const woodGrad = ctx.createLinearGradient(spX, spY, spX + spW, spY + spH);
    woodGrad.addColorStop(0, primaryColor);
    woodGrad.addColorStop(0.5, '#78350f');
    woodGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = woodGrad;
    ctx.beginPath();
    ctx.roundRect(spX, spY, spW, spH, 20);
    ctx.fill();

    // Woven Melange Fabric Front Baffle
    const bW = spW - 24;
    const bH = spH - 24;
    ctx.fillStyle = lightColor;
    ctx.beginPath();
    ctx.roundRect(spX + 12, spY + 12, bW, bH, 14);
    ctx.fill();

    // Recessed Copper/Gold Driver Cone
    const coneR = Math.min(bW * 0.35, bH * 0.28);
    const coneCY = spY + 12 + bH * 0.62;

    const coneGrad = ctx.createRadialGradient(cx, coneCY, 10, cx, coneCY, coneR);
    coneGrad.addColorStop(0, '#090d16');
    coneGrad.addColorStop(0.6, accentColor);
    coneGrad.addColorStop(1, '#020617');
    ctx.fillStyle = coneGrad;
    ctx.beginPath();
    ctx.arc(cx, coneCY, coneR, 0, Math.PI * 2);
    ctx.fill();

    // Copper Dustcap Core
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(cx, coneCY, coneR * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // High-Frequency Ribbon Tweeter (Top)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(cx - 30, spY + 35, 60, 36, 8);
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Metal Brand Badge
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 50, spY + 95, 100, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand, cx, spY + 109);
  }

  // 12. NATURAL STONE DIFFUSER / SCULPTURE (e.g. AURA 01)
  else if (has('diffuser', 'travertine', 'vapor', 'sculpture', 'wellness', 'ultrasonic')) {
    const dW = Math.min(w * 0.48, 210);
    const dH = Math.min(h * 0.68, 320);
    const dX = cx - dW / 2;
    const dY = bottomY - dH;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 6, dW * 0.45, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ultrasonic Mist Vapor Plume Rising Upward
    const mistGrad = ctx.createLinearGradient(cx, dY - 80, cx, dY);
    mistGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    mistGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
    mistGrad.addColorStop(1, 'rgba(255, 255, 255, 0.6)');
    ctx.fillStyle = mistGrad;
    ctx.beginPath();
    ctx.moveTo(cx - 6, dY);
    ctx.quadraticCurveTo(cx - 28, dY - 45, cx - 12, dY - 90);
    ctx.quadraticCurveTo(cx + 25, dY - 50, cx + 6, dY);
    ctx.closePath();
    ctx.fill();

    // Solid Raw Brass Vapor Chimney Spout
    ctx.fillStyle = accentColor;
    ctx.fillRect(cx - 14, dY - 14, 28, 16);

    // Natural Porous Travertine Monolith Body
    const stoneGrad = ctx.createLinearGradient(dX, 0, dX + dW, 0);
    stoneGrad.addColorStop(0, primaryColor);
    stoneGrad.addColorStop(0.3, lightColor);
    stoneGrad.addColorStop(0.7, primaryColor);
    stoneGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = stoneGrad;
    ctx.beginPath();
    ctx.roundRect(dX, dY, dW, dH - 12, [18, 18, 12, 12]);
    ctx.fill();

    // Porous speckled travertine texture
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let p = 0; p < 25; p++) {
      const px = dX + 12 + ((p * 29) % (dW - 24));
      const py = dY + 15 + ((p * 37) % (dH - 40));
      ctx.beginPath();
      ctx.ellipse(px, py, 3, 1.5, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Flush Ambient LED Horizon Ring at Base
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 12, dW * 0.44, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Minimal Inscribed Brand Mark
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 15px serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand, cx, dY + dH * 0.55);

    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = accentColor;
    ctx.fillText('NATURAL STONE • ULTRASONIC', cx, dY + dH * 0.65);
  }

  // 13. LUXURY PERFUME / FRAGRANCE FLACON
  else if (has('perfume', 'fragrance', 'parfum', 'cologne', 'flacon', 'scent')) {
    const fW = Math.min(w * 0.48, 210);
    const fH = Math.min(h * 0.66, 320);
    const fX = cx - fW / 2;
    const fY = bottomY - fH;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 6, fW * 0.45, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Magnetic Brass / Chrome Atomizer Cap
    const capW = fW * 0.45;
    const capH = fH * 0.22;
    ctx.fillStyle = accentColor;
    ctx.fillRect(cx - capW / 2, fY - capH, capW, capH);
    ctx.fillStyle = '#ffffff44';
    ctx.fillRect(cx - capW * 0.2, fY - capH, capW * 0.15, capH); // Highlight streak

    // Heavy Faceted Crystal Flacon
    const glassGrad = ctx.createLinearGradient(fX, 0, fX + fW, 0);
    glassGrad.addColorStop(0, '#ffffff66');
    glassGrad.addColorStop(0.2, primaryColor + 'cc');
    glassGrad.addColorStop(0.5, '#ffffff44');
    glassGrad.addColorStop(0.8, primaryColor + 'cc');
    glassGrad.addColorStop(1, '#ffffff22');
    ctx.fillStyle = glassGrad;
    ctx.beginPath();
    ctx.roundRect(fX, fY, fW, fH, [12, 12, 22, 22]);
    ctx.fill();

    // Amber / Radiant Liquid Core
    ctx.fillStyle = accentColor + '66';
    ctx.beginPath();
    ctx.roundRect(fX + 16, fY + fH * 0.22, fW - 32, fH * 0.68, [8, 8, 16, 16]);
    ctx.fill();

    // Atomizer Dip Tube
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, fY);
    ctx.lineTo(cx, fY + fH * 0.85);
    ctx.stroke();

    // Foiled Luxury Label
    const lW = fW * 0.72;
    const lH = fH * 0.38;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - lW / 2, fY + fH * 0.35, lW, lH);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - lW / 2, fY + fH * 0.35, lW, lH);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand, cx, fY + fH * 0.5);

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('EXTRAIT DE PARFUM', cx, fY + fH * 0.62);
  }

  // 14. SKINCARE DROPPER / BOTANICAL SERUM (e.g. TERRA)
  else if (has('serum', 'skincare', 'cosmetic', 'dropper', 'cream', 'apothecary', 'lotion')) {
    const bW = Math.min(w * 0.45, 190);
    const bH = Math.min(h * 0.65, 330);
    const bX = cx - bW / 2;
    const bY = bottomY - bH;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 6, bW * 0.45, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dropper Pipette / Bulb
    const capW = bW * 0.45;
    const capH = bH * 0.22;
    const capX = cx - capW / 2;
    const capY = bY - capH;

    // Wood Collar
    ctx.fillStyle = accentColor;
    ctx.fillRect(capX, capY + capH * 0.35, capW, capH * 0.65);

    // Rubber Bulb
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.ellipse(cx, capY + capH * 0.35, capW * 0.35, capH * 0.4, 0, Math.PI, 0);
    ctx.fill();

    // Heavy Glass Bottle
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

    // Minimalist Luxury Plaque
    const lW = bW * 0.78;
    const lH = bH * 0.52;
    const lX = cx - lW / 2;
    const lY = bY + bH * 0.28;

    ctx.fillStyle = 'rgba(10, 10, 15, 0.85)';
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
  }

  // 15. AUTOMOTIVE / VEHICLE / MOBILITY / BIKE
  else if (has('vehicle', 'car', 'auto', 'mobility', 'bike', 'motor', 'scooter')) {
    const vW = Math.min(w * 0.9, 420);
    const vH = Math.min(h * 0.45, 180);
    const vX = cx - vW / 2;
    const vY = bottomY - vH;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 6, vW * 0.48, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Aerodynamic Body Speedform
    const carGrad = ctx.createLinearGradient(vX, vY, vX + vW, vY + vH);
    carGrad.addColorStop(0, primaryColor);
    carGrad.addColorStop(0.5, '#334155');
    carGrad.addColorStop(1, '#020617');
    ctx.fillStyle = carGrad;
    ctx.beginPath();
    ctx.moveTo(vX + 20, vY + vH - 25);
    ctx.quadraticCurveTo(vX + vW * 0.35, vY + 10, vX + vW * 0.65, vY + 15);
    ctx.quadraticCurveTo(vX + vW - 20, vY + 45, vX + vW - 10, vY + vH - 25);
    ctx.closePath();
    ctx.fill();

    // Dark Tinted Cockpit Glass
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.moveTo(vX + vW * 0.32, vY + 35);
    ctx.quadraticCurveTo(vX + vW * 0.5, vY + 18, vX + vW * 0.68, vY + 25);
    ctx.lineTo(vX + vW * 0.72, vY + 55);
    ctx.lineTo(vX + vW * 0.28, vY + 55);
    ctx.closePath();
    ctx.fill();

    // Blade LED Headlight Bar
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(vX + 15, vY + vH - 35);
    ctx.lineTo(vX + 90, vY + vH - 42);
    ctx.stroke();

    // Dual Alloy Wheels
    [vX + vW * 0.22, vX + vW * 0.78].forEach((wx) => {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(wx, bottomY - 25, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.stroke();
    });

    // Inscribed Brand
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand, cx, bottomY - 45);
  }

  // 16. ADAPTIVE NOVEL INDUSTRIAL PRODUCT (Intelligently adapts to ANY user input)
  else {
    const aW = Math.min(w * 0.75, 340);
    const aH = Math.min(h * 0.65, 300);
    const aX = cx - aW / 2;
    const aY = bottomY - aH;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 8, aW * 0.46, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Precision CNC-Machined Architectural Hardware Chassis
    const baseGrad = ctx.createLinearGradient(aX, aY, aX + aW, aY + aH);
    baseGrad.addColorStop(0, primaryColor);
    baseGrad.addColorStop(0.35, '#334155');
    baseGrad.addColorStop(0.7, primaryColor);
    baseGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = baseGrad;
    ctx.beginPath();
    ctx.roundRect(aX, aY, aW, aH, 24);
    ctx.fill();

    // Polished Accent Perimeter Chamfer
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Inner Architectural Recess / Interaction Surface
    ctx.fillStyle = '#0b0f19';
    ctx.beginPath();
    ctx.roundRect(aX + 20, aY + 20, aW - 40, aH - 40, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Precision Status Optics / Rotary Controller
    const dialR = Math.min((aW - 40) * 0.22, (aH - 40) * 0.28);
    const dialX = cx;
    const dialY = aY + 35 + dialR;

    const dialGrad = ctx.createRadialGradient(dialX, dialY, 5, dialX, dialY, dialR);
    dialGrad.addColorStop(0, '#64748b');
    dialGrad.addColorStop(0.6, primaryColor);
    dialGrad.addColorStop(1, '#020617');
    ctx.fillStyle = dialGrad;
    ctx.beginPath();
    ctx.arc(dialX, dialY, dialR, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center Core Indicator LED
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(dialX, dialY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Micro Ventilation / Cooling Slits
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 2;
    for (let s = -2; s <= 2; s++) {
      ctx.beginPath();
      ctx.moveTo(cx + s * 14, dialY + dialR + 18);
      ctx.lineTo(cx + s * 14, dialY + dialR + 32);
      ctx.stroke();
    }

    // Prominent Brand Typography on Hardware
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand, cx, aY + aH - 65);

    // Product Category Label
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 11px monospace';
    ctx.fillText((product.category || 'INDUSTRIAL HARDWARE').toUpperCase(), cx, aY + aH - 44);

    // Material Tagline
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px monospace';
    ctx.fillText('PRECISION ARCHITECTURE • ZERO HUMANS', cx, aY + aH - 28);
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
