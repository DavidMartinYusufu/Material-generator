import React, { useState } from 'react';
import { ProductData, VisualBible } from '../types';
import {
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  UserX,
  Layers,
  Copy,
  Check,
  RefreshCw,
  Box,
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
    <div className="bg-white border border-neutral-200 p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
        {/* Left: Product Anchor Frame & Visual Hierarchy */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full md:w-auto">
          {/* Arched image container reminiscent of the reference image */}
          <div className="relative shrink-0">
            <div className="w-28 h-36 rounded-t-full bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center shadow-xs">
              {product.masterImageUrl ? (
                <img
                  src={product.masterImageUrl}
                  alt={product.name || 'Master Product Anchor'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="text-center p-3 text-neutral-400">
                  <Box className="w-8 h-8 mx-auto mb-1 text-neutral-300" />
                  <span className="text-[10px] block">No packshot</span>
                </div>
              )}
            </div>
            {/* Geometric accent accentuating the arch */}
            <div
              className="absolute -bottom-2 -right-2 w-6 h-6 rounded-bl-full bg-[#00897B] opacity-90 pointer-events-none"
              title="Architectural accent"
            />
          </div>

          <div className="space-y-1.5 max-w-lg">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="font-semibold text-neutral-900 uppercase tracking-wider text-[10px]">
                Active Master Anchor
              </span>
              <span aria-hidden="true">·</span>
              <span>{product.category || 'Product Design'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-700 font-medium">
                {product.packagingStructure
                  ?.replace(/_/g, ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Studio Box'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              {product.name || 'Untitled Product'}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed">
              {product.tagline || product.description || 'Master visual anchor locked for multi-medium campaigns.'}
            </p>

            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-2 pt-1 text-xs text-neutral-500">
                <span className="text-[11px] text-neutral-400">Brand Palette:</span>
                <div className="flex items-center gap-1.5">
                  {product.colors.map((c, i) => (
                    <span
                      key={i}
                      className="w-3.5 h-3.5 rounded-full border border-neutral-300 shadow-2xs"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={onRegenerateAnchor}
            disabled={isGeneratingAnchor}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-neutral-900 hover:bg-black text-white transition-all shadow-xs disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAnchor ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAnchor ? 'Rendering Anchor...' : 'Regenerate Packshot'}</span>
          </button>

          {visualBible && (
            <button
              type="button"
              onClick={() => setShowBibleDetails(!showBibleDetails)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors border border-neutral-200"
            >
              <span>Consistency Specification</span>
              {showBibleDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Consistency Specification Drawer */}
      {showBibleDetails && visualBible && (
        <div className="mt-6 pt-6 border-t border-neutral-200 text-xs space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-900 uppercase tracking-wider text-[11px]">
              Visual Consistency Specification
            </span>
            <button
              type="button"
              onClick={handleCopyBiblePrompt}
              className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              {copiedPrompt ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedPrompt ? 'Copied' : 'Copy Full Specification'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-50 p-3.5 border border-neutral-200/80">
              <span className="font-medium text-neutral-800 block mb-1">Packaging Blueprint</span>
              <p className="text-neutral-600 text-[11px] leading-relaxed">
                {visualBible.visualIdentity.geometricFormFactor}
              </p>
            </div>

            <div className="bg-neutral-50 p-3.5 border border-neutral-200/80">
              <span className="font-medium text-neutral-800 block mb-1">Materials & Texture</span>
              <p className="text-neutral-600 text-[11px] leading-relaxed">
                {visualBible.visualIdentity.materialsAndTexture}
              </p>
            </div>

            <div className="bg-neutral-50 p-3.5 border border-neutral-200/80">
              <span className="font-medium text-neutral-800 block mb-1">Branding Details</span>
              <p className="text-neutral-600 text-[11px] leading-relaxed">
                {visualBible.visualIdentity.brandingAndLogoDetails}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
