import React, { useState, useRef } from 'react';
import { ProductData, PackagingStructureType } from '../types';
import { PRODUCT_PRESETS } from '../data/presets';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Check,
  Trash2,
  Plus,
  Box,
  Layers,
  FileCode2,
  Gift,
  ArrowRight,
  Package,
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
  const [newColor, setNewColor] = useState('#111111');
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

  const packagingStructures: {
    type: PackagingStructureType;
    label: string;
    description: string;
    badge: string;
  }[] = [
    {
      type: 'gable_handle_box',
      label: 'Gable Handle Box',
      description: 'Die-cut carrier handle with pitched triangular roof and dual side gussets.',
      badge: 'Boutique Carry',
    },
    {
      type: 'canva_multi_box',
      label: 'Canva Multi-Box Array',
      description: 'Studio geometric prism boxes in complementary colorways on colored pedestals.',
      badge: 'Hero Display',
    },
    {
      type: 'kraft_unboxing_mailer',
      label: 'Kraft Unboxing Mailer',
      description: 'Fluted corrugated shipper with interior tissue paper and custom sticker seal.',
      badge: 'Direct to Consumer',
    },
    {
      type: 'rigid_ribbon_box',
      label: 'Rigid Ribbon Gift Box',
      description: 'Heavyweight matte paperboard with two-piece lift-off lid and satin ribbon pull.',
      badge: 'Luxury Tier',
    },
    {
      type: 'sliding_sleeve_drawer',
      label: 'Sliding Sleeve Drawer',
      description: 'Precision matchbox-style slide tray with outer jacket and ribbon pull loop.',
      badge: 'Unboxing Ritual',
    },
    {
      type: 'packaging_dieline_net',
      label: 'Packaging Dieline Blueprint',
      description: 'Technical fold layout with dashed fold scores and cut lines on architectural grid.',
      badge: 'Engineering',
    },
  ];

  const boxFinishes = [
    { id: 'matte_soft_touch', label: 'Matte Soft-Touch' },
    { id: 'kraft_paper', label: 'Raw Kraft Cardboard' },
    { id: 'gold_foil_stamped', label: 'Gold Hot-Foil Stamping' },
    { id: 'holographic_foil', label: 'Holographic Prism Foil' },
    { id: 'gloss_uv_spot', label: 'Gloss Spot-UV Varnish' },
    { id: 'embossed_texture', label: 'Tactile Embossed Relief' },
  ];

  return (
    <div className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-8">
      {/* Header & Preset Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            01. Product Archetype & Presets
          </span>
          <span className="text-[11px] text-neutral-400">Click to autofill sample brief</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRODUCT_PRESETS.map((preset) => {
            const isSelected =
              product.name === preset.name &&
              product.packagingStructure === preset.packagingStructure;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className={`px-3 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
          {(() => {
            const isCustom = !PRODUCT_PRESETS.some(
              (p) => p.name === product.name && p.packagingStructure === product.packagingStructure
            );
            return (
              <button
                type="button"
                onClick={() =>
                  onChange({
                    name: 'Custom Product',
                    category: 'Design & Packaging',
                    tagline: 'Precision Crafted',
                    description: 'Custom packaging with tactile finishes and bespoke proportions.',
                    packagingStructure: 'rigid_ribbon_box',
                    boxFinish: 'matte_soft_touch',
                  })
                }
                className={`px-3 py-1.5 text-xs font-medium transition-all ${
                  isCustom
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
                }`}
              >
                + Custom Brief
              </button>
            );
          })()}
        </div>
      </div>

      <div className="border-t border-neutral-200" />

      {/* Step 1: Identity Inputs */}
      <div className="space-y-4">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
          02. Identity & Description
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              Brand / Product Name
            </label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Kinfolk Fragrance or Lumen Audio"
              className="w-full bg-white border border-neutral-300 focus:border-neutral-900 focus:outline-none px-3.5 py-2.5 text-xs text-neutral-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              Product Category
            </label>
            <input
              type="text"
              value={product.category}
              onChange={(e) => onChange({ category: e.target.value })}
              placeholder="e.g. Luxury Cosmetics or Coffee Beans"
              className="w-full bg-white border border-neutral-300 focus:border-neutral-900 focus:outline-none px-3.5 py-2.5 text-xs text-neutral-900 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">
            Advertising Tagline / Campaign Hook
          </label>
          <input
            type="text"
            value={product.tagline || ''}
            onChange={(e) => onChange({ tagline: e.target.value })}
            placeholder="e.g. Tactile Elegance In Every Unboxing"
            className="w-full bg-white border border-neutral-300 focus:border-neutral-900 focus:outline-none px-3.5 py-2.5 text-xs text-neutral-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">
            Visual & Structural Description
          </label>
          <textarea
            rows={3}
            value={product.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Describe the packaging shape, dimensions, debossed typography, and tactile surface finish..."
            className="w-full bg-white border border-neutral-300 focus:border-neutral-900 focus:outline-none p-3.5 text-xs text-neutral-900 transition-colors leading-relaxed"
          />
        </div>
      </div>

      <div className="border-t border-neutral-200" />

      {/* Step 2: Packaging Structure Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            03. Packaging Architecture
          </span>
          <span className="text-[11px] text-neutral-400">Select physical form geometry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {packagingStructures.map((struct) => {
            const isSelected =
              (product.packagingStructure || 'rigid_ribbon_box') === struct.type;
            return (
              <button
                key={struct.type}
                type="button"
                onClick={() => onChange({ packagingStructure: struct.type })}
                className={`p-3.5 text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-50 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-neutral-900">
                    {struct.label}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0 mt-0.5" />}
                </div>
                <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                  {struct.description}
                </p>
                <span className="text-[10px] text-neutral-400 mt-2 font-medium">
                  {struct.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-neutral-200" />

      {/* Step 3: Material Finish & Brand Color Palette */}
      <div className="space-y-4">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
          04. Specialty Box Finish & Brand Colors
        </span>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-2">
            Specialty Surface Finish
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {boxFinishes.map((f) => {
              const isSelected = (product.boxFinish || 'matte_soft_touch') === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onChange({ boxFinish: f.id })}
                  className={`px-3 py-2 text-xs text-left border transition-all ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white font-medium'
                      : 'border-neutral-200 text-neutral-700 hover:border-neutral-300 bg-white'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-2">
            Brand Color Palette
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {product.colors.map((color, index) => (
              <div
                key={index}
                className="group relative flex items-center gap-1.5 px-2.5 py-1 border border-neutral-200 bg-neutral-50 text-xs"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-neutral-300"
                  style={{ backgroundColor: color }}
                />
                <span className="font-mono text-[11px] text-neutral-700">{color}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveColor(index)}
                  className="text-neutral-400 hover:text-rose-600 transition-colors ml-1"
                  title="Remove color"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}

            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-7 h-7 p-0 border border-neutral-300 cursor-pointer rounded-none"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-2.5 py-1 text-xs font-medium text-neutral-700 border border-neutral-200 hover:border-neutral-300 bg-white"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200" />

      {/* Step 4: Master Anchor Image Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            05. Master Packshot Anchor
          </span>
          <span className="text-[11px] text-neutral-400">Zero-human visual foundation</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={onGenerateAnchorShot}
            disabled={isGeneratingAnchor || !product.name.trim()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold bg-neutral-900 hover:bg-black text-white transition-all shadow-xs disabled:opacity-40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isGeneratingAnchor
                ? 'Synthesizing Anchor Packshot...'
                : 'Generate Master Packshot Anchor'}
            </span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-medium text-neutral-700 border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};
