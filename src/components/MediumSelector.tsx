import React, { useState } from 'react';
import { MediumDefinition } from '../types';
import { AVAILABLE_MEDIUMS } from '../data/presets';
import {
  Check,
  Plus,
  Maximize2,
  Newspaper,
  Instagram,
  Smartphone,
  BookOpen,
  TrainFront,
  MapPin,
  Store,
  Layers,
  Sparkles,
} from 'lucide-react';

interface Props {
  selectedMediumIds: string[];
  onToggleMedium: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  customMediums: MediumDefinition[];
  onAddCustomMedium: (medium: MediumDefinition) => void;
  onGenerateCampaign: () => void;
  isGeneratingAny: boolean;
  canGenerate: boolean;
}

export const MediumSelector: React.FC<Props> = ({
  selectedMediumIds,
  onToggleMedium,
  onSelectAll,
  onClearAll,
  customMediums,
  onAddCustomMedium,
  onGenerateCampaign,
  isGeneratingAny,
  canGenerate,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customRatio, setCustomRatio] = useState<'1:1' | '16:9' | '3:4' | '9:16' | '4:3'>('16:9');
  const [customDesc, setCustomDesc] = useState('');

  const allMediums = [...AVAILABLE_MEDIUMS, ...customMediums];

  const filteredMediums = allMediums.filter((m) => {
    if (filter === 'all') return true;
    return m.category === filter;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Maximize2':
        return <Maximize2 className="w-3.5 h-3.5" />;
      case 'Newspaper':
        return <Newspaper className="w-3.5 h-3.5" />;
      case 'Instagram':
        return <Instagram className="w-3.5 h-3.5" />;
      case 'Smartphone':
        return <Smartphone className="w-3.5 h-3.5" />;
      case 'BookOpen':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'Subway':
        return <TrainFront className="w-3.5 h-3.5" />;
      case 'MapPin':
        return <MapPin className="w-3.5 h-3.5" />;
      case 'Store':
        return <Store className="w-3.5 h-3.5" />;
      default:
        return <Layers className="w-3.5 h-3.5" />;
    }
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newMedium: MediumDefinition = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      category: 'outdoor',
      defaultAspectRatio: customRatio,
      description: customDesc.trim() || `Custom placement for ${customName.trim()}.`,
      headlinePlaceholder: 'A TRANSFORMATIONAL STEP',
      lightingHint: 'Architectural studio lighting with high product fidelity',
      icon: 'Layers',
    };

    onAddCustomMedium(newMedium);
    setCustomName('');
    setCustomDesc('');
    setIsAddingCustom(false);
  };

  return (
    <div className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
            06. Target Media Placements
          </span>
          <p className="text-xs text-neutral-500 mt-1">
            Selected: <span className="font-semibold text-neutral-900">{selectedMediumIds.length}</span> of {allMediums.length} mediums
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex flex-wrap items-center gap-1 border border-neutral-200 bg-neutral-50 p-1 text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'outdoor', label: 'Outdoor' },
            { id: 'print', label: 'Print' },
            { id: 'digital', label: 'Digital' },
            { id: 'retail', label: 'Retail' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id)}
              className={`px-3 py-1 font-medium transition-colors ${
                filter === cat.id
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Select All / Clear / Add Custom */}
      <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSelectAll}
            className="hover:text-neutral-900 font-medium transition-colors"
          >
            Select All
          </button>
          <span className="text-neutral-300">/</span>
          <button
            type="button"
            onClick={onClearAll}
            className="hover:text-neutral-900 font-medium transition-colors"
          >
            Clear All
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingCustom(!isAddingCustom)}
          className="inline-flex items-center gap-1 font-medium text-neutral-800 hover:text-black transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAddingCustom ? 'Cancel Custom' : 'Custom Medium'}</span>
        </button>
      </div>

      {/* Custom Medium Input Drawer */}
      {isAddingCustom && (
        <form onSubmit={handleCreateCustom} className="p-4 bg-neutral-50 border border-neutral-200 space-y-3">
          <span className="text-xs font-semibold text-neutral-900 block">
            Add Custom Advertising Medium
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Medium name (e.g. Airport Gate Screen)"
              className="bg-white border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
            />
            <select
              value={customRatio}
              onChange={(e) => setCustomRatio(e.target.value as any)}
              className="bg-white border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 cursor-pointer"
            >
              <option value="16:9">16:9 Cinema / Landscape</option>
              <option value="1:1">1:1 Square</option>
              <option value="3:4">3:4 Portrait</option>
              <option value="9:16">9:16 Vertical Story</option>
              <option value="4:3">4:3 Standard</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold"
          >
            Save Custom Medium
          </button>
        </form>
      )}

      {/* Grid of Mediums */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredMediums.map((medium) => {
          const isSelected = selectedMediumIds.includes(medium.id);
          return (
            <button
              key={medium.id}
              type="button"
              onClick={() => onToggleMedium(medium.id)}
              className={`p-3.5 text-left border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-neutral-900 bg-neutral-50/80 shadow-xs'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-xs transition-colors ${
                      isSelected ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {getIcon(medium.icon)}
                  </div>
                  <span className="text-xs font-bold text-neutral-900">
                    {medium.name}
                  </span>
                </div>
                <div
                  className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
              </div>

              <p className="text-[11px] text-neutral-500 mt-2 line-clamp-2 leading-relaxed">
                {medium.description}
              </p>

              <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-2 font-medium">
                <span className="uppercase">{medium.category}</span>
                <span>{medium.defaultAspectRatio}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="border-t border-neutral-200" />

      {/* Primary CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onGenerateCampaign}
          disabled={isGeneratingAny || !canGenerate || selectedMediumIds.length === 0}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-neutral-900 hover:bg-black text-white text-sm font-semibold tracking-wide transition-all shadow-sm disabled:opacity-40"
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {isGeneratingAny
              ? 'Rendering Cross-Medium Campaign...'
              : `Generate Campaign Across ${selectedMediumIds.length} Selected Mediums`}
          </span>
        </button>
      </div>
    </div>
  );
};
