import React from 'react';
import { ShieldCheck, UserX, SlidersHorizontal } from 'lucide-react';
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
    <div className="bg-neutral-50/80 border border-neutral-200/90 rounded-none sm:rounded-sm px-5 py-3">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Core Constraints (Clean unboxed typography) */}
        <div className="flex flex-wrap items-center gap-4 text-neutral-600">
          <div className="flex items-center gap-1.5 font-medium text-neutral-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Strict Zero-Human Rule Active</span>
          </div>

          <span className="text-neutral-300" aria-hidden="true">/</span>

          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-neutral-700">
              {hasMasterAnchor ? 'Visual Anchor Locked' : 'Anchor Conditioning Ready'}
            </span>
          </div>

          <span className="text-neutral-300" aria-hidden="true">/</span>

          <span className="text-neutral-500">
            Cross-Medium Consistent Geometry
          </span>
        </div>

        {/* Engine Settings (Clean controls) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-neutral-600">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-500">Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => onSelectModel(e.target.value as NanoBananaModel)}
              className="bg-white border border-neutral-200 px-2.5 py-1 text-xs text-neutral-900 font-medium focus:outline-none focus:border-neutral-400 cursor-pointer"
            >
              <option value="gemini-nano-banana-2.1">
                Nano-Banana 2.1 (Flagship)
              </option>
              <option value="gemini-3.1-flash-lite-image">
                Nano-Banana Lite (Fast)
              </option>
            </select>
          </div>

          <div className="flex items-center gap-1 border border-neutral-200 bg-white p-0.5">
            <button
              type="button"
              onClick={() => onSelectImageSize('1K')}
              className={`px-2 py-0.5 text-[11px] font-medium transition-colors ${
                imageSize === '1K'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              1K
            </button>
            <button
              type="button"
              onClick={() => onSelectImageSize('2K')}
              className={`px-2 py-0.5 text-[11px] font-medium transition-colors ${
                imageSize === '2K'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              2K
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
