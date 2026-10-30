import React, { useState } from 'react';
import { GeneratedShot, ProductData } from '../types';
import { MediumShotCard } from './MediumShotCard';
import {
  Download,
  Layers,
  Sparkles,
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
      <div className="bg-neutral-50 border border-neutral-200 p-16 text-center">
        <div className="w-12 h-12 bg-neutral-200 text-neutral-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-neutral-900">No Campaign Assets Generated Yet</h3>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1.5 leading-relaxed">
          Configure your product packaging and select target mediums above, then click "Generate Campaign" to preview your brand across all placements.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section Header - Clean "Latest work" heading styled like the reference image */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Latest work
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {completedShots.length} of {shots.length} mediums rendered with verified visual lock and zero humans
          </p>
        </div>

        {/* Filter Tabs & Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 border border-neutral-200 bg-neutral-50 p-1 text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'outdoor', label: 'Outdoor' },
              { id: 'print', label: 'Print' },
              { id: 'digital', label: 'Digital' },
              { id: 'retail', label: 'Retail' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1 font-medium transition-colors ${
                  activeFilter === tab.id
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRegenerateAll}
              disabled={isGeneratingAny}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-neutral-700 border border-neutral-200 hover:border-neutral-300 bg-white transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAny ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Regenerate All</span>
            </button>

            {completedShots.length > 0 && (
              <button
                type="button"
                onClick={onExportAll}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-neutral-900 hover:bg-black text-white transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PNG</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3-Column Grid Matching Reference Image Exactly */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredShots.map((shot) => (
          <MediumShotCard
            key={shot.id}
            shot={shot}
            brandName={product.name}
            tagline={product.tagline || ''}
            onRegenerate={onRegenerateShot}
            onOpenLightbox={onOpenLightbox}
            isGenerating={shot.status === 'generating'}
          />
        ))}
      </div>
    </div>
  );
};
