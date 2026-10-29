import React from 'react';
import { UserX, ShieldCheck, Sparkles, Sliders } from 'lucide-react';
import { NanoBananaModel } from '../types';

interface Props {
  hasMasterAnchor: boolean;
  selectedModel: NanoBananaModel;
  onSelectModel: (model: NanoBananaModel) => void;
  imageSize: '1K' | '2K';
  onSelectImageSize: (size: '1K' | '2K') => void;
}

export const ConsistencyAuditBadge: React.FC<Props> = ({
  hasMasterAnchor,
  selectedModel,
  onSelectModel,
  imageSize,
  onSelectImageSize,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Core Constraints Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Strict Zero People Constraint */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-semibold tracking-wide">
            <UserX className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>Strict Zero-Human Rule Active</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse ml-0.5" />
          </div>

          {/* Product Consistency Lock */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
            hasMasterAnchor
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/25 text-amber-300'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>{hasMasterAnchor ? 'Consistency Anchor Locked' : 'Anchor Conditioning Ready'}</span>
          </div>
        </div>

        {/* Engine Settings (Nano Banana) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 font-medium">Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => onSelectModel(e.target.value as NanoBananaModel)}
              className="bg-transparent text-amber-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="gemini-nano-banana-2.1" className="bg-slate-900 text-slate-100">
                Nano-Banana 2.1 (Flagship)
              </option>
              <option value="gemini-3.1-flash-lite-image" className="bg-slate-900 text-slate-100">
                Nano-Banana Lite (Fast)
              </option>
            </select>
          </div>

          {selectedModel === 'gemini-nano-banana-2.1' && (
            <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => onSelectImageSize('1K')}
                className={`px-2 py-0.5 rounded font-medium transition-all ${
                  imageSize === '1K'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1K
              </button>
              <button
                type="button"
                onClick={() => onSelectImageSize('2K')}
                className={`px-2 py-0.5 rounded font-medium transition-all ${
                  imageSize === '2K'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2K Res
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
