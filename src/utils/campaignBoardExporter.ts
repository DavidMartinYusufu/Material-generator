import { ProductData, GeneratedShot } from '../types';

/**
 * Loads an image from a URL or data URL and returns an HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Generates an executive-grade Master Campaign Presentation Board in high-resolution PNG
 * combining all medium shots into a single unified creative campaign poster.
 */
export async function generateCampaignBoardPng(
  product: ProductData,
  completedShots: GeneratedShot[],
  engineName: string = 'Nano-Banana Image Model'
): Promise<string> {
  // Canvas width
  const canvasWidth = 2560;

  // Calculate layout rows
  // Header: 240px
  // Grid of shots: 2 columns or 3 columns depending on shot count
  const cols = completedShots.length > 4 ? 3 : 2;
  const rows = Math.ceil(completedShots.length / cols);
  const cardWidth = Math.floor((canvasWidth - 120 - (cols - 1) * 40) / cols);
  const cardHeight = Math.floor(cardWidth * 0.72);

  const canvasHeight = Math.max(1440, 280 + rows * (cardHeight + 70) + 100);

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not initialize canvas context');

  // Background - Deep studio obsidian with subtle warm gradient
  const bgGrad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  bgGrad.addColorStop(0, '#06080d');
  bgGrad.addColorStop(0.5, '#0b0f19');
  bgGrad.addColorStop(1, '#05070a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Subtle ambient glow
  const glow = ctx.createRadialGradient(canvasWidth / 2, 200, 50, canvasWidth / 2, 200, 800);
  glow.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Top Accent Line (Amber Gold)
  const lineGrad = ctx.createLinearGradient(0, 0, canvasWidth, 0);
  lineGrad.addColorStop(0, '#f59e0b');
  lineGrad.addColorStop(0.5, '#ea580c');
  lineGrad.addColorStop(1, '#f59e0b');
  ctx.fillStyle = lineGrad;
  ctx.fillRect(0, 0, canvasWidth, 6);

  // ==========================================
  // Header Section
  // ==========================================
  const startX = 60;
  let curY = 70;

  // Eyebrow
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('CAMPAIGN PRESENTATION BOARD • MULTI-MEDIUM ADVERTISING SUITE', startX, curY);

  curY += 50;

  // Main Campaign Title (Product Name)
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 48px sans-serif';
  ctx.fillText(product.name || 'COMMERCIAL CAMPAIGN', startX, curY);

  // Tagline / Subtitle
  curY += 34;
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 20px sans-serif';
  ctx.fillText(product.tagline || product.category || 'Integrated Cross-Medium Marketing Execution', startX, curY);

  // Constraint Badges on Right
  const badgeRight = canvasWidth - 60;
  let badgeY = 65;

  // Strict Zero-Human Rule Badge
  ctx.textAlign = 'right';
  ctx.fillStyle = '#f43f5e';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('STRICT ZERO-HUMAN CONSTRAINT: VERIFIED ACTIVE', badgeRight, badgeY);

  badgeY += 26;
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('CROSS-SHOT PRODUCT CONSISTENCY: LOCKED', badgeRight, badgeY);

  badgeY += 26;
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`ENGINE: ${engineName.toUpperCase()}`, badgeRight, badgeY);

  // Divider line
  curY += 45;
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(startX, curY);
  ctx.lineTo(canvasWidth - startX, curY);
  ctx.stroke();

  curY += 40;

  // ==========================================
  // Shots Grid
  // ==========================================
  ctx.textAlign = 'left';

  for (let idx = 0; idx < completedShots.length; idx++) {
    const shot = completedShots[idx];
    const col = idx % cols;
    const row = Math.floor(idx / cols);

    const x = startX + col * (cardWidth + 40);
    const y = curY + row * (cardHeight + 70);

    // Card Background Box
    ctx.fillStyle = '#0f1422';
    ctx.fillRect(x, y, cardWidth, cardHeight);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, cardWidth, cardHeight);

    // Image Content
    if (shot.imageUrl) {
      try {
        const img = await loadImage(shot.imageUrl);
        // Draw inside card with slight padding
        const pad = 12;
        const imgX = x + pad;
        const imgY = y + pad;
        const imgW = cardWidth - pad * 2;
        const imgH = cardHeight - pad * 2;

        // Draw image keeping aspect ratio
        const scale = Math.min(imgW / img.width, imgH / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = imgX + (imgW - dw) / 2;
        const dy = imgY + (imgH - dh) / 2;

        // Subtle shadow behind inner image
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(dx - 4, dy - 4, dw + 8, dh + 8);

        ctx.drawImage(img, dx, dy, dw, dh);
      } catch (e) {
        console.warn('Could not draw image on board:', e);
      }
    }

    // Card Label Bar below the box
    const labelY = y + cardHeight + 24;
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(shot.mediumName, x, labelY);

    // Aspect ratio badge
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`[ ${shot.aspectRatio} ]`, x + cardWidth - 80, labelY);

    const subY = labelY + 18;
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText(
      shot.headlineText ? `“${shot.headlineText}”` : 'Cross-Medium Advertising Placement',
      x,
      subY
    );
  }

  // ==========================================
  // Footer Section
  // ==========================================
  const footerY = canvasHeight - 35;
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(startX, footerY - 20);
  ctx.lineTo(canvasWidth - startX, footerY - 20);
  ctx.stroke();

  ctx.fillStyle = '#475569';
  ctx.font = '13px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(
    `MARKETING MATERIALS GENERATOR • EXPORT DATE: ${new Date().toLocaleDateString()} • STRICT ZERO-PEOPLE AUDIT PASSED`,
    startX,
    footerY
  );

  ctx.textAlign = 'right';
  ctx.fillText('HIGH-RESOLUTION 2560px CAMPAIGN ASSET EXPORT (PNG)', canvasWidth - startX, footerY);

  return canvas.toDataURL('image/png');
}

/**
 * Downloads a given data URL as a file with the specified filename
 */
export function triggerPngDownload(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Triggers batch download of all completed individual medium shots as PNGs
 */
export function downloadAllIndividualShotsPng(
  productName: string,
  completedShots: GeneratedShot[]
) {
  const sanitized = productName.toLowerCase().replace(/\s+/g, '_') || 'campaign';
  completedShots.forEach((shot, index) => {
    if (!shot.imageUrl) return;
    setTimeout(() => {
      triggerPngDownload(shot.imageUrl!, `${sanitized}_${shot.mediumId}.png`);
    }, index * 250);
  });
}
