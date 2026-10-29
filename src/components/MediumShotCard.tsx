import React, { useState } from 'react';
import { GeneratedShot } from '../types';
import {
  Download,
  Maximize2,
  RefreshCw,
  Copy,
  Check,
  Frame,
  Image as ImageIcon,
  AlertCircle,
  Sparkles,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  CheckCircle,
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

  const handleDownload = () => {
    if (!shot.imageUrl) return;
    const a = document.createElement('a');
    a.href = shot.imageUrl;
    a.download = `${brandName.toLowerCase().replace(/\s+/g, '_')}_${shot.mediumId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Helper to render authentic mockup frames
  const renderMockup = () => {
    if (!shot.imageUrl) return null;

    // 1. Printed Newspaper Mockup
    if (shot.mediumId === 'newspaper') {
      return (
        <div className="bg-[#f3f0e8] text-neutral-900 p-3 sm:p-4 rounded-lg font-serif border border-neutral-300 shadow-md">
          {/* Newspaper Masthead */}
          <div className="border-b-2 border-neutral-800 pb-1.5 mb-2 text-center">
            <div className="text-[9px] font-sans tracking-widest uppercase text-neutral-600 flex justify-between border-b border-neutral-400 pb-0.5 mb-1">
              <span>Vol. CXLIV No. 49,201</span>
              <span>The Financial & Cultural Review</span>
              <span>Two Dollars</span>
            </div>
            <h5 className="text-xl sm:text-2xl font-black tracking-tight uppercase font-serif">
              THE DISPATCH CHRONICLE
            </h5>
          </div>

          {/* Ad Header */}
          <div className="text-center mb-1.5">
            <span className="text-[8px] font-sans uppercase tracking-widest text-neutral-500">
              SPECIAL FEATURE PRESENTATION
            </span>
            <h6 className="text-xs sm:text-sm font-bold uppercase tracking-wide font-sans text-neutral-950 mt-0.5">
              {shot.headlineText || tagline || 'A NEW STANDARD IN DESIGN'}
            </h6>
          </div>

          {/* Newspaper Image with halftone ink texture look */}
          <div className="relative border border-neutral-400 bg-neutral-200 overflow-hidden shadow-inner">
            <img
              src={shot.imageUrl}
              alt={shot.mediumName}
              referrerPolicy="no-referrer"
              className="w-full object-cover grayscale-[20%] contrast-[105%]"
            />
          </div>

          {/* Newspaper Sub-columns */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-1 border-t border-neutral-300 text-[8px] sm:text-[9px] font-serif leading-tight text-neutral-700">
            <div>
              <p className="line-clamp-2">
                Engineered with uncompromising precision, {brandName} introduces a transformative standard in modern material execution.
              </p>
            </div>
            <div className="text-right">
              <span className="font-sans font-bold uppercase block text-neutral-900">{brandName}</span>
              <span className="text-neutral-500 font-sans block">Zero compromise. Solitary focus.</span>
            </div>
          </div>
        </div>
      );
    }

    // 2. Highway Megaboard / Billboard Mockup
    if (shot.mediumId === 'billboard') {
      return (
        <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 p-2 sm:p-3 rounded-lg border border-slate-800 shadow-2xl">
          {/* Billboard Overhead Lighting Fixtures */}
          <div className="flex justify-around mb-1.5 px-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-2.5 h-1.5 bg-neutral-300 rounded-t shadow-[0_0_8px_#ffffff]" />
                <div className="w-0.5 h-2 bg-neutral-500" />
              </div>
            ))}
          </div>

          {/* Billboard Bezel */}
          <div className="border-4 border-neutral-800 bg-black rounded shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden relative">
            <img
              src={shot.imageUrl}
              alt={shot.mediumName}
              referrerPolicy="no-referrer"
              className="w-full object-cover"
            />
            {/* Ambient city light reflection */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5 pointer-events-none" />
          </div>

          {/* Billboard Support Truss */}
          <div className="flex justify-center mt-1">
            <div className="w-8 h-3 bg-neutral-700 rounded-b flex items-center justify-center">
              <div className="w-4 h-full bg-neutral-800" />
            </div>
          </div>
        </div>
      );
    }

    // 3. Social Media Feed Mockup (1:1)
    if (shot.mediumId === 'social_post') {
      return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl text-slate-200">
          {/* Social Header */}
          <div className="flex items-center justify-between p-2.5 border-b border-slate-850">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-[10px] font-bold text-slate-950">
                {brandName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-slate-100">{brandName.toLowerCase().replace(/\s+/g, '_')}</span>
                  <CheckCircle className="w-3 h-3 text-sky-400 fill-sky-400/20" />
                </div>
                <span className="text-[10px] text-slate-400 block -mt-0.5">Sponsored</span>
              </div>
            </div>
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </div>

          {/* Main 1:1 Image */}
          <div className="relative aspect-square overflow-hidden bg-black">
            <img
              src={shot.imageUrl}
              alt={shot.mediumName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Social Engagement Bar */}
          <div className="p-2.5 space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 hover:text-rose-500 transition-colors cursor-pointer" />
                <MessageCircle className="w-4 h-4 hover:text-slate-100 transition-colors cursor-pointer" />
                <Send className="w-4 h-4 hover:text-slate-100 transition-colors cursor-pointer" />
              </div>
              <Bookmark className="w-4 h-4 hover:text-slate-100 transition-colors cursor-pointer" />
            </div>
            <div className="text-[11px] font-semibold text-slate-200">32,841 likes</div>
            <div className="text-[11px] text-slate-300 leading-snug">
              <span className="font-semibold text-slate-100 mr-1.5">{brandName.toLowerCase().replace(/\s+/g, '_')}</span>
              {tagline || 'Experience solitary refinement. Pure architectural craft.'}
            </div>
          </div>
        </div>
      );
    }

    // 4. Social Story / Vertical Reel (9:16)
    if (shot.mediumId === 'social_story') {
      return (
        <div className="relative max-w-[260px] mx-auto rounded-2xl overflow-hidden border-2 border-slate-700 bg-black shadow-2xl">
          {/* Top Story Header */}
          <div className="absolute top-2 inset-x-2 z-10 flex flex-col gap-1.5">
            <div className="w-full h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-white" />
            </div>
            <div className="flex items-center justify-between text-white drop-shadow">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[9px] font-bold text-black">
                  {brandName.charAt(0)}
                </div>
                <span className="text-[10px] font-semibold">{brandName}</span>
                <span className="text-[9px] text-white/70">8h</span>
              </div>
              <span className="text-xs">&times;</span>
            </div>
          </div>

          {/* Image */}
          <img
            src={shot.imageUrl}
            alt={shot.mediumName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          {/* Bottom Story Footer */}
          <div className="absolute bottom-2.5 inset-x-3 z-10 flex items-center gap-2">
            <div className="flex-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 text-[10px] text-white/80">
              Send message...
            </div>
            <Heart className="w-4 h-4 text-white drop-shadow" />
          </div>
        </div>
      );
    }

    // 5. Default Framed Display (Magazine / Subway / Vitrine)
    return (
      <div className="relative rounded-lg overflow-hidden border border-slate-700/80 shadow-2xl bg-black">
        <img
          src={shot.imageUrl}
          alt={shot.mediumName}
          referrerPolicy="no-referrer"
          className="w-full object-cover"
        />
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-medium text-slate-200 border border-white/10">
          {shot.mediumName} Environment
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm flex flex-col justify-between transition-all hover:border-slate-700">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-100">{shot.mediumName}</h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
              {shot.aspectRatio}
            </span>
          </div>

          {/* State / Toggle controls */}
          <div className="flex items-center gap-1.5">
            {shot.status === 'completed' && shot.imageUrl && (
              <button
                type="button"
                onClick={() => setShowMockup(!showMockup)}
                className={`p-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
                  showMockup
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title={showMockup ? 'Switch to Raw Image' : 'Switch to Framed Mockup'}
              >
                <Frame className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">
                  {showMockup ? 'Framed Mockup' : 'Raw View'}
                </span>
              </button>
            )}

            {shot.status === 'generating' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                <Sparkles className="w-2.5 h-2.5" /> Rendering
              </span>
            )}
          </div>
        </div>

        {/* Display Content Area */}
        <div className="min-h-[220px] rounded-xl bg-slate-950 border border-slate-800/80 overflow-hidden flex items-center justify-center relative p-1.5">
          {shot.status === 'generating' ? (
            <div className="text-center p-6 space-y-3">
              <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Nano-Banana Rendering {shot.mediumName}...
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Enforcing strict zero-people constraint & visual product lock
                </span>
              </div>
            </div>
          ) : shot.status === 'failed' ? (
            <div className="text-center p-4 space-y-2 text-rose-400">
              <AlertCircle className="w-6 h-6 mx-auto text-rose-400" />
              <span className="text-xs font-semibold block">Generation Failed</span>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto line-clamp-3">
                {shot.errorMessage || 'Failed to render image with Nano-Banana.'}
              </p>
              <button
                type="button"
                onClick={() => onRegenerate(shot)}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
              >
                <RefreshCw className="w-3 h-3" /> Retry Generation
              </button>
            </div>
          ) : shot.imageUrl ? (
            <div className="w-full">
              {showMockup ? (
                renderMockup()
              ) : (
                <div className="relative group/raw overflow-hidden rounded-lg">
                  <img
                    src={shot.imageUrl}
                    alt={shot.mediumName}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-contain max-h-[360px] mx-auto rounded"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-6 text-slate-500">
              <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-30" />
              <span className="text-xs block">Ready to render in {shot.mediumName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Controls */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>No People • Locked Product</span>
        </div>

        <div className="flex items-center gap-1.5">
          {shot.imageUrl && (
            <>
              <button
                type="button"
                onClick={() => onOpenLightbox(shot)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                title="Fullscreen Lightbox & Prompt Details"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                title="Download PNG"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleCopyPrompt}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            title="Copy Prompt"
          >
            {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => onRegenerate(shot)}
            disabled={isGenerating}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-40"
            title="Regenerate this medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${shot.status === 'generating' ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
