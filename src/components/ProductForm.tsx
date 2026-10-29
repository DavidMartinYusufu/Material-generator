import React, { useState, useRef } from 'react';
import { ProductData } from '../types';
import { PRODUCT_PRESETS } from '../data/presets';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Plus,
  Palette,
  Layers,
  Wand2,
  Sliders,
} from 'lucide-react';

interface Props {
  product: ProductData;
  onChange: (updated: Partial<ProductData>) => void;
  onGenerateAnchorShot: () => void;
  isGeneratingAnchor: boolean;
  onSelectPreset: (preset: ProductData) => void;
}

export const ProductForm: React.FC<Props> = ({
  product,
  onChange,
  onGenerateAnchorShot,
  isGeneratingAnchor,
  onSelectPreset,
}) => {
  const [newColor, setNewColor] = useState('#ffffff');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange({
          masterImageUrl: reader.result,
          masterImageMimeType: file.type || 'image/png',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddColor = () => {
    if (newColor && !product.colors.includes(newColor)) {
      onChange({ colors: [...product.colors, newColor] });
    }
  };

  const handleRemoveColor = (indexToRemove: number) => {
    onChange({ colors: product.colors.filter((_, idx) => idx !== indexToRemove) });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-6">
      {/* Preset selector */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant Product Presets</span>
          </label>
          <span className="text-[11px] text-slate-400">Click to auto-fill sample brief</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_PRESETS.map((preset) => {
            const isSelected = product.name === preset.name;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                    : 'bg-slate-950/70 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() =>
              onChange({
                name: '',
                category: '',
                tagline: '',
                description: '',
                materials: '',
                colors: ['#0A0A0A', '#E0E0E0'],
                aesthetic: 'Minimalist Modern Luxury',
                masterImageUrl: undefined,
              })
            }
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-950/70 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all"
          >
            + Blank Custom
          </button>
        </div>
      </div>

      {/* Main product inputs */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Product Name <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. NOIR Cold Brew"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Category / Industry
            </label>
            <input
              type="text"
              value={product.category}
              onChange={(e) => onChange({ category: e.target.value })}
              placeholder="e.g. Beverage, Watch, Consumer Tech"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Advertising Tagline / Core Headline
          </label>
          <input
            type="text"
            value={product.tagline}
            onChange={(e) => onChange({ tagline: e.target.value })}
            placeholder="e.g. Deep extraction. Pure silence."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Physical Form & Silhouette Details <span className="text-amber-400">*</span>
          </label>
          <textarea
            rows={3}
            value={product.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Describe the physical shape, silhouette, packaging, geometry, and key distinguishing marks to lock consistency across all mediums..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 resize-y"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Nano-Banana uses this geometry to preserve identical form factor in billboards, newspapers, and social shots.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Materials, Finishes & Textures
            </label>
            <input
              type="text"
              value={product.materials}
              onChange={(e) => onChange({ materials: e.target.value })}
              placeholder="e.g. Matte obsidian aluminum, burnished copper rim"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Brand Aesthetic Mood
            </label>
            <input
              type="text"
              value={product.aesthetic}
              onChange={(e) => onChange({ aesthetic: e.target.value })}
              placeholder="e.g. Moody architectural luxury, dark minimalist"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
            />
          </div>
        </div>

        {/* Color palette */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span>Brand Color Palette</span>
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {product.colors.map((color, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="font-mono text-[11px]">{color}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveColor(idx)}
                  className="text-slate-500 hover:text-rose-400 transition-colors ml-1"
                >
                  &times;
                </button>
              </div>
            ))}

            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-7 h-7 rounded border border-slate-800 bg-slate-950 cursor-pointer p-0.5"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Master Anchor Packshot Section */}
      <div className="border-t border-slate-800/80 pt-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Master Product Visual Anchor</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Condition all campaign mediums against this exact product shot to maintain absolute consistency.
            </p>
          </div>
          {product.masterImageUrl && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> Master Shot Locked
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-center">
          {/* Action to generate anchor packshot */}
          <div className="sm:col-span-2 space-y-2.5">
            <button
              type="button"
              onClick={onGenerateAnchorShot}
              disabled={isGeneratingAnchor || !product.name.trim() || !product.description.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingAnchor ? (
                <>
                  <Wand2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Synthesizing Anchor with Nano-Banana...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Generate Master Anchor Packshot</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-slate-400" />
                <span>Upload Existing Product Shot</span>
              </button>

              {product.masterImageUrl && (
                <button
                  type="button"
                  onClick={() => onChange({ masterImageUrl: undefined, masterImageMimeType: undefined })}
                  className="p-2 rounded-lg text-xs font-medium bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-900 transition-all"
                  title="Clear master shot"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Master shot preview tile */}
          <div className="h-28 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center relative group">
            {product.masterImageUrl ? (
              <img
                src={product.masterImageUrl}
                alt="Master Anchor Product"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain p-1.5"
              />
            ) : (
              <div className="text-center p-2 text-slate-500">
                <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-40" />
                <span className="text-[10px] block">No anchor generated yet</span>
                <span className="text-[9px] text-slate-600 block">Required for consistency</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
