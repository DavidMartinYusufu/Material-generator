import React from 'react';
import { Layers, Download, Sparkles, RefreshCw, Zap } from 'lucide-react';

interface Props {
  onReset: () => void;
  onExportAll: () => void;
  completedCount: number;
  totalCount: number;
  isGeneratingAny: boolean;
}

export const Header: React.FC<Props> = ({
  onReset,
  onExportAll,
  completedCount,
  totalCount,
  isGeneratingAny,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-100 tracking-tight">
                  Marketing Materials Generator
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Zap className="w-2.5 h-2.5" /> Nano-Banana Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cross-Medium Advertising Campaigns with Strict Product Consistency & Zero People
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2.5 self-end sm:self-center">
            {completedCount > 0 && (
              <button
                type="button"
                onClick={onExportAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all disabled:opacity-50"
              title="Reset product and campaign"
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
