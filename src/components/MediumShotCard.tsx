import React, { useState } from 'react';
import { GeneratedShot } from '../types';
import {
  Download,
  Maximize2,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface Props {
  shot: GeneratedShot;
  brandName: string;
  tagline: string;
  onRegenerate: (shot: GeneratedShot) => void;
  onOpenLightbox: (shot: GeneratedShot) => void;
  isGenerating: boolean;
}

export const MediumShotCard: React.FC<Props> = ({
  shot,
  brandName,
  tagline,
  onRegenerate,
  onOpenLightbox,
  isGenerating,
}) => {
  const [showMockup, setShowMockup] = useState(true);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(shot.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shot.imageUrl) return;
    const a = document.createElement('a');
    a.href = shot.imageUrl;
    a.download = `${(brandName || 'campaign').toLowerCase().replace(/\s+/g, '_')}_${shot.mediumId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Helper subtitle like in the reference image ("UI, Art direction")
  const getSubTitle = () => {
    switch (shot.mediumId) {
      case 'billboard':
        return 'Outdoor, 16:9 Cinema';
      case 'newspaper':
        return 'Editorial Print, Newsprint';
      case 'magazine':
        return 'Editorial Print, Gloss';
      case 'social_post':
        return 'Digital, 1:1 Social Feed';
      case 'social_story':
        return 'Digital, 9:16 Vertical';
      case 'subway_kiosk':
        return 'Outdoor, Transit Kiosk';
      case 'bus_shelter':
        return 'Outdoor, Street Furniture';
      case 'storefront':
        return 'Retail, Vinyl Display';
      default:
        return 'Campaign Medium, Art direction';
    }
  };

  return (
    <div className="group flex flex-col transition-all">
      {/* Media Container - Square/Aspect box matching reference image */}
      <div
        onClick={() => shot.imageUrl && onOpenLightbox(shot)}
        className="relative aspect-square w-full bg-neutral-100 overflow-hidden cursor-pointer border border-neutral-200/90 shadow-2xs"
      >
        {isGenerating || shot.status === 'generating' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/95">
            <div className="w-8 h-8 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin mb-3" />
            <span className="text-xs font-semibold text-neutral-900 block">
              Rendering {shot.mediumName}...
            </span>
            <span className="text-[11px] text-neutral-500 mt-1">
              Zero humans · Material lock
            </span>
          </div>
        ) : shot.status === 'failed' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-neutral-50 text-neutral-800">
            <AlertCircle className="w-6 h-6 text-rose-500 mb-2" />
            <span className="text-xs font-semibold block">Generation Failed</span>
            <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">
              {shot.errorMessage || 'Could not generate shot.'}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRegenerate(shot);
              }}
              className="mt-3 px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium"
            >
              Retry
            </button>
          </div>
        ) : shot.imageUrl ? (
          <>
            <img
              src={shot.imageUrl}
              alt={shot.mediumName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />

            {/* Subtle Overlay on Hover with Actions */}
            <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenLightbox(shot);
                }}
                className="w-9 h-9 bg-white text-neutral-900 flex items-center justify-center shadow-md hover:bg-neutral-100 transition-colors"
                title="Fullscreen View"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="w-9 h-9 bg-white text-neutral-900 flex items-center justify-center shadow-md hover:bg-neutral-100 transition-colors"
                title="Download PNG"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyPrompt();
                }}
                className="w-9 h-9 bg-white text-neutral-900 flex items-center justify-center shadow-md hover:bg-neutral-100 transition-colors"
                title="Copy Prompt"
              >
                {copiedPrompt ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRegenerate(shot);
                }}
                className="w-9 h-9 bg-white text-neutral-900 flex items-center justify-center shadow-md hover:bg-neutral-100 transition-colors"
                title="Regenerate"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-400">
            Awaiting generation
          </div>
        )}
      </div>

      {/* Unboxed Metadata & Project Title (Exact Match to Reference Image) */}
      <div className="mt-3 flex items-start justify-between">
        <div>
          <h4 className="text-sm font-bold text-neutral-900 tracking-tight">
            {shot.mediumName}
          </h4>
          <p className="text-xs text-neutral-500 mt-0.5">
            {getSubTitle()}
          </p>
        </div>

        {shot.imageUrl && (
          <span className="text-[10px] text-neutral-400 font-mono mt-0.5">
            {shot.aspectRatio}
          </span>
        )}
      </div>
    </div>
  );
};
