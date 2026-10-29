import React, { useState } from 'react';
import { ProductData, VisualBible } from '../types';
import {
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  UserX,
  Layers,
  Wand2,
  Copy,
  Check,
} from 'lucide-react';

interface Props {
  product: ProductData;
  visualBible: VisualBible | null;
  onRegenerateAnchor: () => void;
  isGeneratingAnchor: boolean;
}

export const MasterProductCard: React.FC<Props> = ({
  product,
  visualBible,
  onRegenerateAnchor,
  isGeneratingAnchor,
}) => {
  const [showBibleDetails, setShowBibleDetails] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopyBiblePrompt = () => {
    if (!visualBible?.masterPackshotPrompt) return;
    navigator.clipboard.writeText(visualBible.masterPackshotPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row gap-5 items-center justify-between">
        {/* Left: Anchor image & status */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0 shadow-lg relative group">
            {product.masterImageUrl ? (
              <img
                src={product.masterImageUrl}
                alt="Master Anchor Product"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <div className="text-center p-2 text-slate-500">
                <Layers className="w-6 h-6 mx-auto mb-1 text-slate-600" />
                <span className="text-[10px] block">No anchor yet</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[9px] font-bold text-amber-300 uppercase tracking-wider">Master Anchor</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <ShieldCheck className="w-3 h-3" /> Visual Anchor Grounding
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                <UserX className="w-3 h-3" /> Zero Humans
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
              {product.name || 'Untitled Product'}
            </h2>
            <p className="text-xs text-slate-400 line-clamp-1">
              {product.tagline || product.category || 'Campaign conditioning master'}
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              {product.colors.map((c, i) => (
                <span
                  key={i}
                  className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
              <span className="text-[11px] text-slate-400 font-mono ml-1">
                {product.materials || 'Custom Finish'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {visualBible && (
            <button
              type="button"
              onClick={() => setShowBibleDetails(!showBibleDetails)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Consistency Specification</span>
              {showBibleDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            type="button"
            onClick={onRegenerateAnchor}
            disabled={isGeneratingAnchor || !product.name}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all disabled:opacity-50"
          >
            {isGeneratingAnchor ? (
              <>
                <Wand2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Re-shoot Anchor</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Visual Consistency Bible Breakdown */}
      {showBibleDetails && visualBible && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-amber-400 uppercase tracking-wider text-[11px]">
              AI Consistency Bible (Transmitted to Nano-Banana)
            </span>
            <button
              type="button"
              onClick={handleCopyBiblePrompt}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px]"
            >
              {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy Master Spec</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Form Factor</span>
              <p className="mt-0.5 leading-snug">{visualBible.visualIdentity.geometricFormFactor}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Materials & Finish</span>
              <p className="mt-0.5 leading-snug">{visualBible.visualIdentity.materialsAndTexture}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Branding Marks</span>
              <p className="mt-0.5 leading-snug">{visualBible.visualIdentity.brandingAndLogoDetails}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
