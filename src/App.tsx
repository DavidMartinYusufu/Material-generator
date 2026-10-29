import React, { useState, useEffect } from 'react';
import {
  ProductData,
  MediumDefinition,
  GeneratedShot,
  VisualBible,
  NanoBananaModel,
} from './types';
import { PRODUCT_PRESETS, AVAILABLE_MEDIUMS } from './data/presets';
import { Header } from './components/Header';
import { ConsistencyAuditBadge } from './components/ConsistencyAuditBadge';
import { ProductForm } from './components/ProductForm';
import { MasterProductCard } from './components/MasterProductCard';
import { MediumSelector } from './components/MediumSelector';
import { CampaignGallery } from './components/CampaignGallery';
import { LightboxModal } from './components/LightboxModal';
import { compositeMediumShot, compositeStudioAnchorPackshot } from './utils/mediaCompositor';
import {
  generateCampaignBoardPng,
  triggerPngDownload,
  downloadAllIndividualShotsPng,
} from './utils/campaignBoardExporter';
import { AlertCircle, X, Sparkles, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'mmg_product_data_v2';
const STORAGE_MEDIUMS_KEY = 'mmg_mediums_v2';

export default function App() {
  // Load initial product from localStorage or default to NOIR preset
  const [product, setProduct] = useState<ProductData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.name === 'string') {
          return parsed;
        }
      }
    } catch (_e) {
      // ignore
    }
    return PRODUCT_PRESETS[0];
  });

  const [visualBible, setVisualBible] = useState<VisualBible | null>(null);

  // Selected mediums
  const [selectedMediumIds, setSelectedMediumIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MEDIUMS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (_e) {}
    return ['billboard', 'newspaper', 'social_post', 'magazine'];
  });

  const [customMediums, setCustomMediums] = useState<MediumDefinition[]>([]);
  const [shots, setShots] = useState<GeneratedShot[]>([]);
  const [selectedModel, setSelectedModel] = useState<NanoBananaModel>('gemini-nano-banana-2.1');
  const [imageSize, setImageSize] = useState<'1K' | '2K'>('1K');

  const [isGeneratingAnchor, setIsGeneratingAnchor] = useState(false);
  const [isGeneratingCampaign, setIsGeneratingCampaign] = useState(false);
  const [activeLightboxShot, setActiveLightboxShot] = useState<GeneratedShot | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Sync product to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(product));
    } catch (_e) {}
  }, [product]);

  // Sync selected mediums to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MEDIUMS_KEY, JSON.stringify(selectedMediumIds));
    } catch (_e) {}
  }, [selectedMediumIds]);

  // Switch preset
  const handleSelectPreset = (preset: ProductData) => {
    setProduct(preset);
    setVisualBible(null);
    setShots([]);
    setGlobalError(null);
  };

  // Intelligent product change handler:
  // If the user alters product name, and the previous masterImageUrl was a preset image (/images/...),
  // clear it so the old preset photo does not contaminate their new product!
  const handleProductChange = (updated: Partial<ProductData>) => {
    setProduct((prev) => {
      const nameChanged = updated.name !== undefined && updated.name !== prev.name;
      const isPresetImage = prev.masterImageUrl && prev.masterImageUrl.startsWith('/images/');

      const newMasterImageUrl =
        updated.masterImageUrl !== undefined
          ? updated.masterImageUrl
          : nameChanged && isPresetImage
          ? undefined
          : prev.masterImageUrl;

      return {
        ...prev,
        ...updated,
        masterImageUrl: newMasterImageUrl,
      };
    });

    // Invalidate stale visual bible if identity details change
    if (updated.name !== undefined || updated.description !== undefined || updated.category !== undefined) {
      setVisualBible(null);
    }
  };

  // Toggle medium selection
  const handleToggleMedium = (id: string) => {
    setSelectedMediumIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSelectAllMediums = () => {
    const allIds = [...AVAILABLE_MEDIUMS, ...customMediums].map((m) => m.id);
    setSelectedMediumIds(allIds);
  };

  const handleClearMediums = () => {
    setSelectedMediumIds([]);
  };

  const handleAddCustomMedium = (newMedium: MediumDefinition) => {
    setCustomMediums((prev) => [...prev, newMedium]);
    setSelectedMediumIds((prev) => [...prev, newMedium.id]);
  };

// Safe fetch helper that handles HTML gateway error pages and ensures valid JSON
async function safeFetchJson<T = any>(
  url: string,
  bodyData: any
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    });

    const text = await res.text();
    if (!text || text.trim().startsWith('<')) {
      return {
        ok: false,
        status: res.status,
        error: `Server returned non-JSON response (${res.status}).`,
      };
    }

    try {
      const json = JSON.parse(text);
      return {
        ok: res.ok && json.success !== false,
        status: res.status,
        data: json,
        error: json.error,
      };
    } catch {
      return {
        ok: false,
        status: res.status,
        error: 'Invalid JSON payload received from server.',
      };
    }
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      error: err.message || 'Network error.',
    };
  }
}

// Fallback visual consistency guide
function createLocalConsistencyBible(product: ProductData, selectedMediums: string[]): VisualBible {
  const brand = product.name || 'Brand';
  return {
    brandName: brand,
    visualIdentity: {
      primaryColors: product.colors.length > 0 ? product.colors : ['#0A0A0A', '#E0E0E0', '#C68B59'],
      materialsAndTexture: product.materials || 'Anodized matte metal, micro-textured surface',
      geometricFormFactor: product.description || 'Geometric form factor',
      brandingAndLogoDetails: `Minimalist typography for ${brand}`,
      keyDistinguishingFeatures: ['Solitary silhouette', 'High tactile contrast'],
    },
    masterPackshotPrompt: `Studio packshot of ${brand}, ${product.description}. Placed on a minimalist plinth, clean studio lighting. Absolutely zero people.`,
    mediumPrompts: selectedMediums.map((mid) => ({
      mediumId: mid,
      mediumTitle: mid.replace(/_/g, ' ').toUpperCase(),
      aspectRatio: mid === 'billboard' ? '16:9' : mid === 'newspaper' ? '3:4' : mid === 'social_post' ? '1:1' : '16:9',
      recommendedLighting: 'Architectural commercial lighting',
      detailedPrompt: `High-impact commercial advertising visual of ${brand} featured as a ${mid.replace(/_/g, ' ')}. ${product.description}. Absolutely zero people.`,
      headlineText: `INTRODUCING ${brand.toUpperCase()}`,
    })),
  };
}

  // Generate consistency bible and master packshot anchor
  const handleGenerateAnchorShot = async () => {
    if (!product.name || !product.description) {
      setGlobalError('Please provide a product name and physical silhouette description.');
      return;
    }

    try {
      setIsGeneratingAnchor(true);
      setGlobalError(null);

      // Step 1: Generate Visual Consistency Bible
      let generatedBible: VisualBible | null = null;
      const bibleRes = await safeFetchJson<{ data: VisualBible }>('/api/generate-consistency-bible', {
        productName: product.name,
        productCategory: product.category,
        productDescription: product.description,
        brandAesthetic: product.aesthetic,
        selectedMediums: selectedMediumIds,
      });

      if (bibleRes.ok && bibleRes.data?.data) {
        generatedBible = bibleRes.data.data;
      } else {
        generatedBible = createLocalConsistencyBible(product, selectedMediumIds);
      }
      setVisualBible(generatedBible);

      // Step 2: Render Master Packshot Anchor with Nano-Banana or Studio Compositor
      const anchorPrompt = `${generatedBible.masterPackshotPrompt}

Commercial studio packshot of ${product.name}, placed squarely in center on a minimalist architectural podium.
Materials: ${product.materials || generatedBible.visualIdentity.materialsAndTexture}.
Colors: ${product.colors.join(', ')}.
Aesthetic: ${product.aesthetic}.
Razor-sharp focus, clean contact shadows, neutral matte studio backdrop.`;

      let anchorUrl = '';
      const shotRes = await safeFetchJson<{ imageUrl: string; modelUsed: string }>('/api/generate-shot', {
        prompt: anchorPrompt,
        aspectRatio: '1:1',
        model: selectedModel,
        imageSize: imageSize,
      });

      if (shotRes.ok && shotRes.data?.imageUrl) {
        anchorUrl = shotRes.data.imageUrl;
      } else {
        // Fallback: Generate clean dedicated master studio anchor packshot using compositor
        anchorUrl = await compositeStudioAnchorPackshot(product);
      }

      if (anchorUrl) {
        setProduct((prev) => ({
          ...prev,
          masterImageUrl: anchorUrl,
          masterImageMimeType: 'image/png',
        }));
      }
    } catch (err: any) {
      console.warn('Anchor generation error handled cleanly:', err);
    } finally {
      setIsGeneratingAnchor(false);
    }
  };

  // Generate full campaign across selected mediums
  const handleGenerateCampaign = async () => {
    if (selectedMediumIds.length === 0) return;
    if (!product.name.trim() || !product.description.trim()) {
      setGlobalError('Please enter a product name and physical silhouette description before generating campaign.');
      return;
    }

    try {
      setIsGeneratingCampaign(true);
      setGlobalError(null);

      // Ensure we have a fresh consistency bible specifically for this product
      let currentBible = visualBible;
      if (!currentBible || currentBible.brandName.trim().toLowerCase() !== product.name.trim().toLowerCase()) {
        const bibleRes = await safeFetchJson<{ data: VisualBible }>('/api/generate-consistency-bible', {
          productName: product.name,
          productCategory: product.category,
          productDescription: product.description,
          brandAesthetic: product.aesthetic,
          selectedMediums: selectedMediumIds,
        });

        if (bibleRes.ok && bibleRes.data?.data) {
          currentBible = bibleRes.data.data;
        } else {
          currentBible = createLocalConsistencyBible(product, selectedMediumIds);
        }
        setVisualBible(currentBible);
      }

      // If product has no master anchor packshot yet, auto-synthesize one so all shots condition on it!
      let currentAnchor = product.masterImageUrl;
      if (!currentAnchor) {
        currentAnchor = await compositeStudioAnchorPackshot(product);
        setProduct((prev) => ({
          ...prev,
          masterImageUrl: currentAnchor,
          masterImageMimeType: 'image/png',
        }));
      }

      const allMediums = [...AVAILABLE_MEDIUMS, ...customMediums];
      const targetMediums = allMediums.filter((m) => selectedMediumIds.includes(m.id));

      // Initialize placeholder shot cards
      const newShots: GeneratedShot[] = targetMediums.map((m) => {
        const bibleMedium = currentBible?.mediumPrompts.find((p) => p.mediumId === m.id);
        const headline = bibleMedium?.headlineText || m.headlinePlaceholder;
        const prompt = bibleMedium?.detailedPrompt || `High-impact commercial advertising visual of ${product.name} featured as a ${m.name}. ${m.description} Lighting: ${m.lightingHint}.`;

        return {
          id: `shot_${m.id}_${Date.now()}`,
          mediumId: m.id,
          mediumName: m.name,
          aspectRatio: m.defaultAspectRatio,
          prompt,
          status: 'generating',
          timestamp: Date.now(),
          headlineText: headline,
        };
      });

      setShots(newShots);

      // Generate each shot concurrently with Nano-Banana or Studio Compositor fallback
      await Promise.allSettled(
        newShots.map(async (shot) => {
          const res = await safeFetchJson<{ imageUrl: string; modelUsed: string }>('/api/generate-shot', {
            prompt: shot.prompt,
            aspectRatio: shot.aspectRatio,
            referenceImage: currentAnchor,
            model: selectedModel,
            imageSize: imageSize,
          });

          if (res.ok && res.data?.imageUrl) {
            setShots((prev) =>
              prev.map((s) =>
                s.id === shot.id
                  ? {
                      ...s,
                      imageUrl: res.data!.imageUrl,
                      status: 'completed',
                      modelUsed: res.data!.modelUsed,
                    }
                  : s
              )
            );
            return;
          }

          // Fallback to high-res procedural medium compositor
          const compUrl = await compositeMediumShot(
            shot.mediumId,
            product,
            shot.headlineText || product.tagline || '',
            shot.aspectRatio
          );

          if (compUrl) {
            setShots((prev) =>
              prev.map((s) =>
                s.id === shot.id
                  ? {
                      ...s,
                      imageUrl: compUrl,
                      status: 'completed',
                      modelUsed: 'Studio Medium Engine (Consistency Lock)',
                    }
                  : s
              )
            );
          }
        })
      );
    } catch (err: any) {
      console.warn('Campaign generation error handled cleanly:', err);
    } finally {
      setIsGeneratingCampaign(false);
    }
  };

  // Regenerate a single medium shot
  const handleRegenerateSingleShot = async (targetShot: GeneratedShot) => {
    try {
      setShots((prev) =>
        prev.map((s) => (s.id === targetShot.id ? { ...s, status: 'generating', errorMessage: undefined } : s))
      );

      const res = await safeFetchJson<{ imageUrl: string; modelUsed: string }>('/api/generate-shot', {
        prompt: targetShot.prompt,
        aspectRatio: targetShot.aspectRatio,
        referenceImage: product.masterImageUrl,
        model: selectedModel,
        imageSize: imageSize,
      });

      if (res.ok && res.data?.imageUrl) {
        setShots((prev) =>
          prev.map((s) =>
            s.id === targetShot.id
              ? {
                  ...s,
                  imageUrl: res.data!.imageUrl,
                  status: 'completed',
                  modelUsed: res.data!.modelUsed,
                }
              : s
          )
        );
        return;
      }

      // Fallback
      const compUrl = await compositeMediumShot(
        targetShot.mediumId,
        product,
        targetShot.headlineText || product.tagline || '',
        targetShot.aspectRatio
      );

      if (compUrl) {
        setShots((prev) =>
          prev.map((s) =>
            s.id === targetShot.id
              ? {
                  ...s,
                  imageUrl: compUrl,
                  status: 'completed',
                  modelUsed: 'Studio Medium Engine (Consistency Lock)',
                }
              : s
          )
        );
      }
    } catch (err: any) {
      console.warn('Regeneration error handled cleanly:', err);
    }
  };

  // Export campaign as high-resolution PNG presentation board and individual PNG files
  const handleExportCampaign = async () => {
    const completed = shots.filter((s) => s.status === 'completed' && s.imageUrl);
    if (completed.length === 0) return;

    try {
      // Step 1: Generate and download the unified Master Campaign Board in PNG format
      const boardDataUrl = await generateCampaignBoardPng(product, completed, selectedModel);
      const sanitizedName = product.name.toLowerCase().replace(/\s+/g, '_') || 'campaign';
      triggerPngDownload(boardDataUrl, `${sanitizedName}_campaign_board.png`);

      // Step 2: Also trigger download of individual high-res PNG shots for each medium
      if (completed.length > 1) {
        downloadAllIndividualShotsPng(product.name, completed);
      }
    } catch (err: any) {
      console.warn('Board PNG composition error, falling back to direct PNG download:', err);
      // Fallback: download each shot directly as PNG
      downloadAllIndividualShotsPng(product.name, completed);
    }
  };

  // Reset all: resets to clean blank custom state, clears localStorage, shots, and bible
  const handleReset = () => {
    const blankProduct: ProductData = {
      name: '',
      category: '',
      tagline: '',
      description: '',
      materials: '',
      colors: ['#0A0A0A', '#E0E0E0', '#C68B59'],
      aesthetic: 'Modern Minimalist Luxury',
      masterImageUrl: undefined,
    };
    setProduct(blankProduct);
    setVisualBible(null);
    setShots([]);
    setGlobalError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {}
  };

  const completedCount = shots.filter((s) => s.status === 'completed' && s.imageUrl).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* App Header */}
      <Header
        onReset={handleReset}
        onExportAll={handleExportCampaign}
        completedCount={completedCount}
        totalCount={shots.length}
        isGeneratingAny={isGeneratingAnchor || isGeneratingCampaign}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Global Error Banner */}
        {globalError && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 flex items-start justify-between gap-3 text-rose-300 text-xs animate-in fade-in duration-150">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Notification</span>
                <p className="mt-0.5 text-rose-200">{globalError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setGlobalError(null)}
              className="text-rose-400 hover:text-rose-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Consistency Audit Bar */}
        <ConsistencyAuditBadge
          hasMasterAnchor={!!product.masterImageUrl}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          imageSize={imageSize}
          onSelectImageSize={setImageSize}
        />

        {/* Master Product Anchor Status Card (if present) */}
        {product.masterImageUrl && (
          <MasterProductCard
            product={product}
            visualBible={visualBible}
            onRegenerateAnchor={handleGenerateAnchorShot}
            isGeneratingAnchor={isGeneratingAnchor}
          />
        )}

        {/* Two-column Layout: Product Brief & Medium Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Product Specification Form */}
          <div className="lg:col-span-5 xl:col-span-5">
            <ProductForm
              product={product}
              onChange={handleProductChange}
              onGenerateAnchorShot={handleGenerateAnchorShot}
              isGeneratingAnchor={isGeneratingAnchor}
              onSelectPreset={handleSelectPreset}
            />
          </div>

          {/* Right: Target Mediums Selector */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            <MediumSelector
              selectedMediumIds={selectedMediumIds}
              onToggleMedium={handleToggleMedium}
              onSelectAll={handleSelectAllMediums}
              onClearAll={handleClearMediums}
              customMediums={customMediums}
              onAddCustomMedium={handleAddCustomMedium}
              onGenerateCampaign={handleGenerateCampaign}
              isGeneratingAny={isGeneratingCampaign}
              canGenerate={!!product.name.trim() && !!product.description.trim()}
            />
          </div>
        </div>

        {/* Multi-Medium Campaign Results Section */}
        <div className="pt-4">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Multi-Medium Cross-Shot Showcase</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review your product staged across billboards, broadsheet newspapers, social posts, stories, and magazines with verified zero humans and high-definition material fidelity.
            </p>
          </div>

          <CampaignGallery
            shots={shots}
            product={product}
            onRegenerateShot={handleRegenerateSingleShot}
            onRegenerateAll={handleGenerateCampaign}
            onOpenLightbox={(shot) => setActiveLightboxShot(shot)}
            onExportAll={handleExportCampaign}
            isGeneratingAny={isGeneratingCampaign}
          />
        </div>
      </main>

      {/* Lightbox Modal */}
      <LightboxModal
        shot={activeLightboxShot}
        brandName={product.name}
        onClose={() => setActiveLightboxShot(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <p>
          Marketing Materials Generator • Driven by Nano-Banana Image Model • Strictly Zero Humans • Product Consistency Engine
        </p>
      </footer>
    </div>
  );
}
