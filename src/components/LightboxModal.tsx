import React, { useState, useEffect } from 'react';
import { GeneratedShot } from '../types';
import {
  X,
  Download,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';

interface Props {
  shot: GeneratedShot | null;
  brandName: string;
  onClose: () => void;
}

export const LightboxModal: React.FC<Props> = ({ shot, brandName, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!shot || !shot.imageUrl) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shot.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = shot.imageUrl!;
    a.download = `${(brandName || 'campaign').toLowerCase().replace(/\s+/g, '_')}_${shot.mediumId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-neutral-900/80 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Container */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white border border-neutral-200 shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 bg-white/90 hover:bg-neutral-100 text-neutral-800 border border-neutral-200 transition-colors"
          title="Close Lightbox"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Image Canvas */}
        <div className="flex-1 bg-neutral-100 relative overflow-auto flex items-center justify-center p-6 min-h-[350px] lg:min-h-[500px]">
          <div className="relative transition-transform duration-200 max-w-full" style={{ transform: `scale(${zoomLevel})` }}>
            <img
              src={shot.imageUrl}
              alt={shot.mediumName}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] w-auto max-w-full object-contain shadow-md"
            />
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 bg-white border border-neutral-200 p-1 text-xs shadow-xs">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
              className="p-1.5 text-neutral-600 hover:text-black transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-neutral-500 px-1">{Math.round(zoomLevel * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              className="p-1.5 text-neutral-600 hover:text-black transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="p-1.5 text-neutral-600 hover:text-black transition-colors"
              title="Reset zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Metadata & Prompt Panel */}
        <div className="w-full lg:w-80 p-6 flex flex-col justify-between bg-white border-t lg:border-t-0 lg:border-l border-neutral-200 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                Medium Specification
              </span>
              <h3 className="text-lg font-bold text-neutral-900 mt-1">
                {shot.mediumName}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Aspect Ratio: <span className="font-mono text-neutral-700">{shot.aspectRatio}</span>
              </p>
            </div>

            <div className="border-t border-neutral-200" />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Generation Prompt
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-[11px] text-neutral-600 hover:text-black"
                >
                  {copiedPrompt ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-700 max-h-48 overflow-y-auto leading-relaxed">
                {shot.prompt}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-200 mt-6">
            <button
              type="button"
              onClick={handleDownload}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold tracking-wide transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download High-Res PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
