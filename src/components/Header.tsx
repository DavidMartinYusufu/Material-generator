import React from 'react';
import { Layers, Download, RefreshCw, Box } from 'lucide-react';

interface Props {
  onReset: () => void;
  onExportAll: () => void;
  completedCount: number;
  totalCount: number;
  isGeneratingAny: boolean;
  activeView: 'studio' | 'gallery';
  setActiveView: (view: 'studio' | 'gallery') => void;
}

export const Header: React.FC<Props> = ({
  onReset,
  onExportAll,
  completedCount,
  totalCount,
  isGeneratingAny,
  activeView,
  setActiveView,
}) => {
  return (
    <header className="border-b border-neutral-200 bg-white/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Brand & Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white shrink-0">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-neutral-900 uppercase">
                  Studio Arc
                </span>
                <span className="text-xs text-neutral-400">/</span>
                <span className="text-xs font-normal text-neutral-500 hidden sm:inline">
                  Visual Consistency & Packaging
                </span>
              </div>
            </div>
          </div>

          {/* Center Navigation Links (Clean Text, Zero-Pill) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveView('studio')}
              className={`transition-colors pb-0.5 border-b-2 ${
                activeView === 'studio'
                  ? 'border-neutral-900 text-neutral-900 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Packaging Studio
            </button>
            <button
              type="button"
              onClick={() => setActiveView('gallery')}
              className={`transition-colors pb-0.5 border-b-2 flex items-center gap-1.5 ${
                activeView === 'gallery'
                  ? 'border-neutral-900 text-neutral-900 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <span>Latest Work</span>
              {completedCount > 0 && (
                <span className="text-[11px] text-neutral-400 font-normal">
                  ({completedCount})
                </span>
              )}
            </button>
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-3">
            {completedCount > 0 && (
              <button
                type="button"
                onClick={onExportAll}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-neutral-900 hover:bg-black text-white transition-all shadow-sm"
                title="Download high-resolution campaign presentation board as PNG"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Campaign (PNG)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onReset}
              disabled={isGeneratingAny}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 transition-all disabled:opacity-40"
              title="Reset product inputs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
