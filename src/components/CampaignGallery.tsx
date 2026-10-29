import React, { useState } from 'react';
import { GeneratedShot, ProductData } from '../types';
import { MediumShotCard } from './MediumShotCard';
import {
  Download,
  Layers,
  Sparkles,
  Filter,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface Props {
  shots: GeneratedShot[];
  product: ProductData;
  onRegenerateShot: (shot: GeneratedShot) => void;
  onRegenerateAll: () => void;
  onOpenLightbox: (shot: GeneratedShot) => void;
  onExportAll: () => void;
  isGeneratingAny: boolean;
}

export const CampaignGallery: React.FC<Props> = ({
  shots,
  product,
  onRegenerateShot,
  onRegenerateAll,
  onOpenLightbox,
  onExportAll,
  isGeneratingAny,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'outdoor' | 'print' | 'digital' | 'retail'>('all');

  const completedShots = shots.filter((s) => s.status === 'completed' && s.imageUrl);

  // Filter shots
  const filteredShots = shots.filter((shot) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'outdoor') return ['billboard', 'subway_kiosk', 'bus_shelter'].includes(shot.mediumId);
    if (activeFilter === 'print') return ['newspaper', 'magazine'].includes(shot.mediumId);
    if (activeFilter === 'digital') return ['social_post', 'social_story'].includes(shot.mediumId);
    if (activeFilter === 'retail') return ['storefront'].includes(shot.mediumId);
    return true;
  });

  if (shots.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
        <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">No Campaign Shots Generated Yet</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          Select target mediums above and click "Generate Campaign" to imagine your product across billboards, newspapers, and social media with Nano-Banana.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Gallery Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Campaign Media Assets</span>
          </span>
          <span className="text-xs text-slate-400 font-mono">
            ({completedShots.length}/{shots.length} completed)
          </span>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Shots' },
            { id: 'outdoor', label: 'Outdoor / Billboards' },
            { id: 'print', label: 'Print / Newsprint' },
            { id: 'digital', label: 'Social Feeds' },
            { id: 'retail', label: 'Retail' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === tab.id
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRegenerateAll}
            disabled={isGeneratingAny}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all disabled:opacity-40"
          >
            <RefreshCw className={`w-3 h-3 ${isGeneratingAny ? 'animate-spin' : ''}`} />
            <span>Regenerate All</span>
          </button>

          {completedShots.length > 0 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onExportAll}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all"
                title="Download Master Campaign Presentation Board as PNG"
              >
                <Download className="w-3 h-3" />
                <span>Export Campaign (PNG)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Medium Shots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredShots.map((shot) => (
          <MediumShotCard
            key={shot.id}
            shot={shot}
            brandName={product.name}
            tagline={product.tagline}
            onRegenerate={onRegenerateShot}
            onOpenLightbox={onOpenLightbox}
            isGenerating={shot.status === 'generating'}
          />
        ))}
      </div>
    </div>
  );
};
