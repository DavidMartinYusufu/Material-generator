import { ProductData } from '../types';

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
    // Determine canvas dimensions based on aspect ratio
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

    // Helper to load image
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
        } catch (e) {
          console.warn('Failed to load master image for compositing, fallback to graphic rendering:', e);
        }
      }

      const brand = (product.name || 'BRAND').toUpperCase();
      const headline = (headlineText || product.tagline || 'NEW HORIZON').toUpperCase();

      // ==========================================
      // 1. HIGHWAY MEGABOARD / BILLBOARD (16:9)
      // ==========================================
      if (mediumId === 'billboard') {
        // Twilight Sky Gradient
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
          // Tiny building windows
          ctx.fillStyle = '#ffe89c';
          if (i % 60 === 0) {
            ctx.fillRect(i + 8, height - bH + 10, 4, 4);
            ctx.fillRect(i + 18, height - bH + 20, 4, 4);
          }
          ctx.fillStyle = '#080d1a';
        }

        // Billboard Support Girders
        ctx.fillStyle = '#11141c';
        ctx.fillRect(width * 0.28, height * 0.65, 32, height * 0.35);
        ctx.fillRect(width * 0.7, height * 0.65, 32, height * 0.35);

        // Billboard Canvas Display Area
        const bMarginX = width * 0.08;
        const bMarginY = height * 0.12;
        const bW = width - bMarginX * 2;
        const bH = height * 0.68;

        // Heavy dark steel bezel
        ctx.fillStyle = '#0f1118';
        ctx.fillRect(bMarginX - 16, bMarginY - 16, bW + 32, bH + 32);
        ctx.strokeStyle = '#2d3345';
        ctx.lineWidth = 3;
        ctx.strokeRect(bMarginX - 16, bMarginY - 16, bW + 32, bH + 32);

        // Billboard Surface Gradient (Digital Backlit Display)
        const boardGrad = ctx.createLinearGradient(bMarginX, bMarginY, bMarginX + bW, bMarginY + bH);
        boardGrad.addColorStop(0, '#0d0e12');
        boardGrad.addColorStop(0.5, '#181b24');
        boardGrad.addColorStop(1, '#0a0b0e');
        ctx.fillStyle = boardGrad;
        ctx.fillRect(bMarginX, bMarginY, bW, bH);

        // Top Spotlights & Volumetric Light Cones
        for (let i = 0; i < 4; i++) {
          const spotX = bMarginX + (bW / 4) * (i + 0.5);
          const spotY = bMarginY - 14;

          // Fixture
          ctx.fillStyle = '#cfd6e6';
          ctx.beginPath();
          ctx.arc(spotX, spotY, 8, 0, Math.PI * 2);
          ctx.fill();

          // Soft light wash
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

        // Product Rendering inside Billboard
        if (productImg) {
          const pTargetH = bH * 0.82;
          const pAspect = productImg.width / productImg.height;
          const pTargetW = pTargetH * pAspect;
          const pX = bMarginX + bW * 0.65 - pTargetW / 2;
          const pY = bMarginY + bH * 0.5 - pTargetH / 2;

          // Drop shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
          ctx.beginPath();
          ctx.ellipse(pX + pTargetW / 2, pY + pTargetH * 0.95, pTargetW * 0.45, 20, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.drawImage(productImg, pX, pY, pTargetW, pTargetH);
        }

        // Commercial Typography on Billboard
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 44px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(brand, bMarginX + 60, bMarginY + bH * 0.35);

        ctx.fillStyle = '#f59e0b'; // Amber accent
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(headline, bMarginX + 60, bMarginY + bH * 0.45);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px sans-serif';
        ctx.fillText(product.tagline || 'Engineered without compromise.', bMarginX + 60, bMarginY + bH * 0.53);

        ctx.fillStyle = '#475569';
        ctx.font = '12px monospace';
        ctx.fillText('HIGHWAY MEGABOARD 04 • 8K MONUMENTAL DISPLAY', bMarginX + 60, bMarginY + bH * 0.85);

        // Strict Negative Constraint Watermark
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('NO HUMANS • SOLITARY ARCHITECTURAL STAGING', bMarginX + bW - 20, bMarginY + bH - 15);
      }

      // ==========================================
      // 2. PRINTED BROADSHEET NEWSPAPER (3:4)
      // ==========================================
      else if (mediumId === 'newspaper') {
        // Newsprint Paper Color with soft fiber tone
        ctx.fillStyle = '#f2efe6';
        ctx.fillRect(0, 0, width, height);

        // Paper Edge Margin
        const margin = 50;
        const pW = width - margin * 2;

        // Top Newspaper Header Rules
        ctx.strokeStyle = '#222222';
        ctx.lineWidth = 1;
        ctx.strokeRect(margin, 40, pW, 1);
        ctx.strokeRect(margin, 44, pW, 2);

        // Masthead
        ctx.fillStyle = '#111111';
        ctx.font = '900 68px serif';
        ctx.textAlign = 'center';
        ctx.fillText('THE FINANCIAL CHRONICLE', width / 2, 115);

        // Masthead sub-bar
        ctx.font = '600 12px sans-serif';
        ctx.fillStyle = '#444444';
        ctx.fillText('VOL. CXLVII NO. 52,190  •  THE GLOBAL ADVERTISING & INDUSTRIAL REVIEW  •  FOUR DOLLARS', width / 2, 140);
        ctx.strokeRect(margin, 150, pW, 2);

        // Lead Article Headline
        ctx.fillStyle = '#111111';
        ctx.font = 'bold 36px serif';
        ctx.textAlign = 'left';
        ctx.fillText(`BREAKTHROUGH: ${brand} DEFINES A NEW MATERIAL PARADIGM`, margin, 205);

        // Column layout lines
        const colW = (pW - 30) / 2;
        ctx.font = '14px serif';
        ctx.fillStyle = '#2b2b2b';
        ctx.fillText('Staff Correspondent  —  In an era demanding uncompromising physical precision, the introduction of', margin, 235);
        ctx.fillText('monolithic design forms marks a decisive shift away from transient excess toward architectural permanence.', margin, 255);

        // Central Advertisement Framing Box
        const adX = margin + 10;
        const adY = 280;
        const adW = pW - 20;
        const adH = height - adY - 80;

        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 3;
        ctx.strokeRect(adX, adY, adW, adH);
        ctx.lineWidth = 1;
        ctx.strokeRect(adX + 6, adY + 6, adW - 12, adH - 12);

        // Newspaper ad header
        ctx.fillStyle = '#111111';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SPECIAL FULL PAGE ADVERTISING PRESENTATION', width / 2, adY + 30);

        ctx.font = 'italic 20px serif';
        ctx.fillText(`“${headline}”`, width / 2, adY + 62);

        // Product Placement with subtle newspaper halftone filter
        if (productImg) {
          const pTargetH = adH * 0.62;
          const pAspect = productImg.width / productImg.height;
          const pTargetW = pTargetH * pAspect;
          const pX = width / 2 - pTargetW / 2;
          const pY = adY + 90;

          // Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
          ctx.beginPath();
          ctx.ellipse(width / 2, pY + pTargetH * 0.96, pTargetW * 0.4, 15, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.drawImage(productImg, pX, pY, pTargetW, pTargetH);
        }

        // Footer Copy in Ad
        ctx.fillStyle = '#111111';
        ctx.font = '900 28px serif';
        ctx.textAlign = 'center';
        ctx.fillText(brand, width / 2, adY + adH - 55);

        ctx.font = '13px serif';
        ctx.fillStyle = '#444444';
        ctx.fillText(product.materials || 'Pure Materials. Solitary Execution.', width / 2, adY + adH - 30);

        // Strict negative constraint verification stamp
        ctx.font = '10px monospace';
        ctx.fillStyle = '#666666';
        ctx.fillText('AUTHENTIC BROADSHEET INK ABSORPTION • STRICTLY ZERO PEOPLE', width / 2, height - 30);
      }

      // ==========================================
      // 3. SOCIAL MEDIA FEED (1:1)
      // ==========================================
      else if (mediumId === 'social_post') {
        // Deep obsidian studio background
        const grad = ctx.createRadialGradient(width / 2, height * 0.45, 100, width / 2, height / 2, width * 0.7);
        grad.addColorStop(0, '#1c1f2b');
        grad.addColorStop(0.5, '#0e1017');
        grad.addColorStop(1, '#050608');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Sculptural circular plinth
        ctx.fillStyle = '#151821';
        ctx.beginPath();
        ctx.ellipse(width / 2, height * 0.78, width * 0.38, 50, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#2d3345';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Plinth top bevel
        ctx.fillStyle = '#1e222e';
        ctx.beginPath();
        ctx.ellipse(width / 2, height * 0.77, width * 0.36, 42, 0, 0, Math.PI * 2);
        ctx.fill();

        // Product on plinth
        if (productImg) {
          const pTargetH = height * 0.65;
          const pAspect = productImg.width / productImg.height;
          const pTargetW = pTargetH * pAspect;
          const pX = width / 2 - pTargetW / 2;
          const pY = height * 0.48 - pTargetH / 2;

          // Plinth contact shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.beginPath();
          ctx.ellipse(width / 2, height * 0.76, pTargetW * 0.45, 18, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.drawImage(productImg, pX, pY, pTargetW, pTargetH);
        }

        // Minimalist brand lettering at top
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(brand, width / 2, 100);

        ctx.fillStyle = '#f59e0b';
        ctx.font = '600 16px sans-serif';
        ctx.fillText(headline, width / 2, 140);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '11px monospace';
        ctx.fillText('1:1 STUDIO HERO • STRICTLY ZERO HUMANS', width / 2, height - 50);
      }

      // ==========================================
      // 4. MOBILE STORY / REEL (9:16)
      // ==========================================
      else if (mediumId === 'social_story') {
        // Vertical cinematic dark gradient
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#090a10');
        grad.addColorStop(0.3, '#141824');
        grad.addColorStop(0.7, '#241a2f');
        grad.addColorStop(1, '#08090f');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Ambient radial light behind product
        const glow = ctx.createRadialGradient(width / 2, height * 0.48, 20, width / 2, height * 0.48, width * 0.6);
        glow.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
        glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);

        // Product Hero
        if (productImg) {
          const pTargetH = height * 0.52;
          const pAspect = productImg.width / productImg.height;
          const pTargetW = pTargetH * pAspect;
          const pX = width / 2 - pTargetW / 2;
          const pY = height * 0.46 - pTargetH / 2;

          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.beginPath();
          ctx.ellipse(width / 2, pY + pTargetH * 0.95, pTargetW * 0.4, 25, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.drawImage(productImg, pX, pY, pTargetW, pTargetH);
        }

        // Top Brand Header
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 38px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(brand, width / 2, 220);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(headline, width / 2, 280);

        // Bottom Swipe Up Bar
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
        // Honed Calacatta Marble Backdrop
        ctx.fillStyle = '#dcd7ce';
        ctx.fillRect(0, 0, width, height);

        // Open Magazine Pages
        const mX = 80;
        const mY = 60;
        const mW = width - mX * 2;
        const mH = height - mY * 2;

        // Shadow behind magazine
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fillRect(mX + 15, mY + 15, mW, mH);

        // Left Page (Crisp White Cotton)
        ctx.fillStyle = '#f8f6f0';
        ctx.fillRect(mX, mY, mW / 2, mH);

        // Right Page
        ctx.fillStyle = '#faf8f4';
        ctx.fillRect(mX + mW / 2, mY, mW / 2, mH);

        // Central Gutter Fold Shadow
        const gutter = ctx.createLinearGradient(mX + mW / 2 - 40, 0, mX + mW / 2 + 40, 0);
        gutter.addColorStop(0, 'rgba(0,0,0,0)');
        gutter.addColorStop(0.5, 'rgba(0,0,0,0.3)');
        gutter.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gutter;
        ctx.fillRect(mX + mW / 2 - 40, mY, 80, mH);

        // Left Page Editorial Text
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
        ctx.fillText('The pursuit of timeless silhouette requires removing every element that does not serve', mX + 60, mY + 240);
        ctx.fillText('the integrity of the material itself. What remains is pristine, solitary focus.', mX + 60, mY + 265);

        // Folio numbers
        ctx.font = '12px serif';
        ctx.fillStyle = '#888888';
        ctx.fillText('42', mX + 60, mY + mH - 40);
        ctx.textAlign = 'right';
        ctx.fillText('43', mX + mW - 60, mY + mH - 40);

        // Right Page Hero Packshot
        if (productImg) {
          const pTargetH = mH * 0.72;
          const pAspect = productImg.width / productImg.height;
          const pTargetW = pTargetH * pAspect;
          const pX = mX + (mW * 0.75) - pTargetW / 2;
          const pY = mY + mH * 0.5 - pTargetH / 2;

          ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
          ctx.beginPath();
          ctx.ellipse(pX + pTargetW / 2, pY + pTargetH * 0.95, pTargetW * 0.45, 16, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.drawImage(productImg, pX, pY, pTargetW, pTargetH);
        }
      }

      // ==========================================
      // 6. DEFAULT / TRANSIT / STOREFRONT / VITRINE
      // ==========================================
      else {
        // Modern architectural concrete / glass environment
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#10141f');
        grad.addColorStop(0.5, '#1e2536');
        grad.addColorStop(1, '#0b0e17');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Vitrine / Lightbox Bezel
        const bMargin = 60;
        ctx.strokeStyle = '#384259';
        ctx.lineWidth = 4;
        ctx.strokeRect(bMargin, bMargin, width - bMargin * 2, height - bMargin * 2);

        // Internal backlit poster area
        ctx.fillStyle = '#0a0d14';
        ctx.fillRect(bMargin + 4, bMargin + 4, width - bMargin * 2 - 8, height - bMargin * 2 - 8);

        // Product Hero
        if (productImg) {
          const pTargetH = (height - bMargin * 2) * 0.68;
          const pAspect = productImg.width / productImg.height;
          const pTargetW = pTargetH * pAspect;
          const pX = width / 2 - pTargetW / 2;
          const pY = height / 2 - pTargetH / 2;

          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.beginPath();
          ctx.ellipse(width / 2, pY + pTargetH * 0.96, pTargetW * 0.45, 20, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.drawImage(productImg, pX, pY, pTargetW, pTargetH);
        }

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

      // Convert canvas to base64 Data URL
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    };

    draw();
  });
}
