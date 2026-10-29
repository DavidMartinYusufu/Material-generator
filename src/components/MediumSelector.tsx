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
  Wand2,
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
        return <Maximize2 className="w-4 h-4" />;
      case 'Newspaper':
        return <Newspaper className="w-4 h-4" />;
      case 'Instagram':
        return <Instagram className="w-4 h-4" />;
      case 'Smartphone':
        return <Smartphone className="w-4 h-4" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4" />;
      case 'Subway':
        return <TrainFront className="w-4 h-4" />;
      case 'MapPin':
        return <MapPin className="w-4 h-4" />;
      case 'Store':
        return <Store className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
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
      description: customDesc.trim() || `Custom advertising placement for ${customName.trim()}.`,
      headlinePlaceholder: 'NEW FRONTIER',
      lightingHint: 'Architectural precision lighting tailored for placement',
      icon: 'Layers',
    };

    onAddCustomMedium(newMedium);
    setCustomName('');
    setCustomDesc('');
    setIsAddingCustom(false);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Select Target Advertising Mediums</span>
            <span className="text-xs font-normal text-slate-400">
              ({selectedMediumIds.length} of {allMediums.length} selected)
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Nano-Banana will render the product natively across each chosen format with strict consistency and zero humans.
          </p>
        </div>

        {/* Quick select buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSelectAll}
            className="text-[11px] font-medium text-amber-400 hover:text-amber-300 px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-medium text-slate-400 hover:text-slate-300 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-all"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setIsAddingCustom(!isAddingCustom)}
            className="text-[11px] font-medium text-slate-200 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1"
          >
            <Plus className="w-3 h-3 text-amber-400" />
            <span>Custom Medium</span>
          </button>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-1.5 border-b border-slate-800/80 pb-3 text-xs overflow-x-auto">
        {[
          { id: 'all', label: 'All Formats' },
          { id: 'outdoor', label: 'Outdoor & Billboards' },
          { id: 'print', label: 'Print & Newspapers' },
          { id: 'digital', label: 'Social & Digital' },
          { id: 'retail', label: 'Retail & Storefronts' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1 rounded-lg font-medium transition-all shrink-0 ${
              filter === tab.id
                ? 'bg-slate-800 text-amber-300 border border-slate-700 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Custom medium modal / inline creator */}
      {isAddingCustom && (
        <form
          onSubmit={handleCreateCustom}
          className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 space-y-3 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400">Add Custom Advertising Medium</span>
            <button
              type="button"
              onClick={() => setIsAddingCustom(false)}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Medium Name (e.g. Times Square 3D Curved LED, Airport Carrousel)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                autoFocus
              />
            </div>
            <div>
              <select
                value={customRatio}
                onChange={(e) => setCustomRatio(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="16:9">Aspect 16:9 (Landscape)</option>
                <option value="1:1">Aspect 1:1 (Square)</option>
                <option value="3:4">Aspect 3:4 (Portrait)</option>
                <option value="9:16">Aspect 9:16 (Vertical)</option>
                <option value="4:3">Aspect 4:3 (Classic)</option>
              </select>
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="Atmospheric scene prompt notes (e.g. Suspended over baggage claim with airport reflections)"
              value={customDesc}
              onChange={(e) => setCustomDesc(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all"
          >
            Save Medium
          </button>
        </form>
      )}

      {/* Medium Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredMediums.map((medium) => {
          const isSelected = selectedMediumIds.includes(medium.id);
          return (
            <div
              key={medium.id}
              onClick={() => onToggleMedium(medium.id)}
              className={`group relative rounded-xl p-3.5 border text-left cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-950 border-amber-500/50 shadow-md shadow-amber-500/5 ring-1 ring-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
              }`}
            >
              {/* Checkbox indicator */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {getIcon(medium.icon)}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {medium.defaultAspectRatio}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-amber-500 border-amber-500 text-slate-950'
                        : 'border-slate-700 bg-slate-900/80 group-hover:border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>

              <h4 className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
                {medium.name}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {medium.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Global Generate Campaign CTA Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onGenerateCampaign}
          disabled={!canGenerate || isGeneratingAny || selectedMediumIds.length === 0}
          className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-xl shadow-amber-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          {isGeneratingAny ? (
            <>
              <Wand2 className="w-5 h-5 animate-spin text-slate-950" />
              <span>Rendering Cross-Medium Campaign with Nano-Banana...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
              <span>
                Generate Campaign Across {selectedMediumIds.length} Selected Medium{selectedMediumIds.length !== 1 ? 's' : ''}
              </span>
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-slate-400 mt-2">
          Strictly preserves product silhouette, materials, and logo. Zero humans will be rendered in any shot.
        </p>
      </div>
    </div>
  );
};
