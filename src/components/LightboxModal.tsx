import React, { useState, useEffect } from 'react';
import { GeneratedShot } from '../types';
import {
  X,
  Download,
  Copy,
  Check,
  ShieldCheck,
  UserX,
  Sparkles,
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
    a.download = `${brandName.toLowerCase().replace(/\s+/g, '_')}_${shot.mediumId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Container */}
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Canvas */}
        <div className="flex-1 bg-black/60 relative overflow-auto flex items-center justify-center p-4 min-h-[350px] lg:min-h-[550px]">
          <div className="relative transition-transform duration-200 max-w-full" style={{ transform: `scale(${zoomLevel})` }}>
            <img
              src={shot.imageUrl}
              alt={shot.mediumName}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-400 px-1">{Math.round(zoomLevel * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
              title="Reset zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Metadata & Prompt Panel */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col justify-between overflow-y-auto max-h-[40vh] lg:max-h-[85vh] bg-slate-950/80">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400 font-semibold">
                  {shot.aspectRatio}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {shot.modelUsed || 'gemini-nano-banana-2.1'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">{shot.mediumName}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Campaign placement for {brandName}</p>
            </div>

            {/* Constraints Check Badges */}
            <div className="space-y-2 pt-1 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1.5 rounded-lg font-medium">
                <UserX className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Zero Humans: No people, models, hands or crowds</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Product Consistency Anchor Enforced</span>
              </div>
            </div>

            {/* Prompt details */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Generation Prompt
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono leading-relaxed max-h-48 overflow-y-auto">
                {shot.prompt}
              </div>
            </div>
          </div>

          {/* Action buttons at bottom */}
          <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
