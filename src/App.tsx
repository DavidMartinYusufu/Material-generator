import React, { useState, useEffect, useRef } from 'react';
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
import { AlertCircle, X, Sparkles, ArrowRight, Box, Compass, Sparkle, Shield, Layers } from 'lucide-react';

const STORAGE_KEY = 'mmg_product_data_v2';
const STORAGE_MEDIUMS_KEY = 'mmg_mediums_v2';

export default function App() {
  const [product, setProduct] = useState<ProductData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.name === 'string') {
          return parsed;
        }
      }
    } catch (_e) {}
    return PRODUCT_PRESETS[0];
  });

  const [visualBible, setVisualBible] = useState<VisualBible | null>(null);

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
    return ['billboard', 'newspaper', 'social_post', 'magazine', 'subway_kiosk'];
  });

  const [customMediums, setCustomMediums] = useState<MediumDefinition[]>([]);
  const [shots, setShots] = useState<GeneratedShot[]>([]);
  const [selectedModel, setSelectedModel] = useState<NanoBananaModel>('gemini-nano-banana-2.1');
  const [imageSize, setImageSize] = useState<'1K' | '2K'>('1K');
  const [activeView, setActiveView] = useState<'studio' | 'gallery'>('studio');

  const [isGeneratingAnchor, setIsGeneratingAnchor] = useState(false);
  const [isGeneratingCampaign, setIsGeneratingCampaign] = useState(false);
  const [activeLightboxShot, setActiveLightboxShot] = useState<GeneratedShot | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const studioSectionRef = useRef<HTMLDivElement>(null);
  const gallerySectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(product));
    } catch (_e) {}
  }, [product]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MEDIUMS_KEY, JSON.stringify(selectedMediumIds));
    } catch (_e) {}
  }, [selectedMediumIds]);

  const handleSelectPreset = (preset: ProductData) => {
    setProduct(preset);
    setVisualBible(null);
    setShots([]);
    setGlobalError(null);
  };

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

    if (updated.name !== undefined || updated.description !== undefined || updated.category !== undefined) {
      setVisualBible(null);
    }
  };

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

  function createLocalConsistencyBible(product: ProductData, selectedMediums: string[]): VisualBible {
    const brand = product.name || 'Brand';
    const category = product.category || 'Commercial Goods';
    const desc = product.description || 'Geometric form factor';
    const mat = product.materials || 'Matte finish with clean tactile debossing';
    const col = product.colors.length > 0 ? product.colors : ['#111111', '#E5E7EB', '#C68B59'];
    const userTagline = product.tagline || 'Engineered without compromise';

    return {
      brandName: brand,
      visualIdentity: {
        primaryColors: col,
        materialsAndTexture: mat,
        geometricFormFactor: `${category}: ${desc}`,
        brandingAndLogoDetails: `Minimalist typography for ${brand}`,
        keyDistinguishingFeatures: [`Physical archetype: ${category}`, `Unique geometry: ${desc}`, 'Strictly zero people'],
      },
      masterPackshotPrompt: `Studio product packshot of ${brand} (${category}). Physical form factor: ${desc}. Materials: ${mat}. Placed on a minimalist plinth, clean studio lighting. Absolutely zero people.`,
      mediumPrompts: selectedMediums.map((mid) => ({
        mediumId: mid,
        mediumTitle: mid.replace(/_/g, ' ').toUpperCase(),
        aspectRatio: mid === 'billboard' ? '16:9' : mid === 'newspaper' ? '3:4' : mid === 'social_post' ? '1:1' : '16:9',
        recommendedLighting: 'Architectural commercial lighting',
        detailedPrompt: `High-impact commercial advertising visual of ${brand} (${category}) featured as a ${mid.replace(/_/g, ' ')}. Physical form factor: ${desc}. Materials: ${mat}. Absolutely zero people.`,
        headlineText: userTagline.toUpperCase(),
      })),
    };
  }

  const handleGenerateAnchorShot = async () => {
    if (!product.name || !product.description) {
      setGlobalError('Please provide a product name and physical silhouette description.');
      return;
    }

    try {
      setIsGeneratingAnchor(true);
      setGlobalError(null);

      let generatedBible: VisualBible | null = null;
      const bibleRes = await safeFetchJson<{ data: VisualBible }>('/api/generate-consistency-bible', {
        productName: product.name,
        productCategory: product.category,
        productDescription: product.description,
        brandAesthetic: product.aesthetic,
        materials: product.materials,
        colors: product.colors,
        tagline: product.tagline,
        packagingStructure: product.packagingStructure,
        boxFinish: product.boxFinish,
        selectedMediums: selectedMediumIds,
      });

      if (bibleRes.ok && bibleRes.data?.data) {
        generatedBible = bibleRes.data.data;
      } else {
        generatedBible = createLocalConsistencyBible(product, selectedMediumIds);
      }
      setVisualBible(generatedBible);

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

  const handleGenerateCampaign = async () => {
    if (selectedMediumIds.length === 0) return;
    if (!product.name.trim() || !product.description.trim()) {
      setGlobalError('Please enter a product name and physical description before generating campaign.');
      return;
    }

    try {
      setIsGeneratingCampaign(true);
      setGlobalError(null);

      let currentBible = visualBible;
      if (!currentBible || currentBible.brandName.trim().toLowerCase() !== product.name.trim().toLowerCase()) {
        const bibleRes = await safeFetchJson<{ data: VisualBible }>('/api/generate-consistency-bible', {
          productName: product.name,
          productCategory: product.category,
          productDescription: product.description,
          brandAesthetic: product.aesthetic,
          packagingStructure: product.packagingStructure,
          boxFinish: product.boxFinish,
          selectedMediums: selectedMediumIds,
        });

        if (bibleRes.ok && bibleRes.data?.data) {
          currentBible = bibleRes.data.data;
        } else {
          currentBible = createLocalConsistencyBible(product, selectedMediumIds);
        }
        setVisualBible(currentBible);
      }

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
      setActiveView('gallery');

      setTimeout(() => {
        gallerySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

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

  const handleExportCampaign = async () => {
    const completed = shots.filter((s) => s.status === 'completed' && s.imageUrl);
    if (completed.length === 0) return;

    try {
      const boardDataUrl = await generateCampaignBoardPng(product, completed, selectedModel);
      const sanitizedName = product.name.toLowerCase().replace(/\s+/g, '_') || 'campaign';
      triggerPngDownload(boardDataUrl, `${sanitizedName}_campaign_board.png`);

      if (completed.length > 1) {
        downloadAllIndividualShotsPng(product.name, completed);
      }
    } catch (err: any) {
      console.warn('Board PNG composition error, falling back to direct PNG download:', err);
      downloadAllIndividualShotsPng(product.name, completed);
    }
  };

  const handleReset = () => {
    const blankProduct: ProductData = {
      name: '',
      category: '',
      tagline: '',
      description: '',
      materials: '',
      colors: ['#111111', '#E5E7EB', '#C68B59'],
      aesthetic: 'Modern Minimalist Luxury',
      packagingStructure: 'rigid_ribbon_box',
      boxFinish: 'matte_soft_touch',
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
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* 3-Zone Clean Header */}
      <Header
        onReset={handleReset}
        onExportAll={handleExportCampaign}
        completedCount={completedCount}
        totalCount={shots.length}
        isGeneratingAny={isGeneratingAnchor || isGeneratingCampaign}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {/* Global Error Banner */}
        {globalError && (
          <div className="bg-rose-50 border border-rose-200 p-4 flex items-start justify-between gap-3 text-rose-800 text-xs animate-in fade-in duration-150">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Notification</span>
                <p className="mt-0.5 text-rose-700">{globalError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setGlobalError(null)}
              className="text-rose-500 hover:text-rose-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* HERO SECTION - Faithfully styled after the uploaded reference image */}
        <section className="border-b border-neutral-200 pb-12 sm:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Typography & Direct Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                  Branding | Image making
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.06]">
                  Visual Designer
                </h1>
              </div>

              <p className="text-sm sm:text-base text-neutral-600 max-w-lg leading-relaxed">
                Design custom packaging architecture, generate high-fidelity master packshots, and deploy multi-medium cross-channel campaigns with guaranteed product consistency and zero humans.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('studio');
                    studioSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
                >
                  Create Design
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveView('gallery');
                    gallerySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs font-semibold tracking-wider uppercase transition-all bg-white"
                >
                  Latest Work ({shots.length})
                </button>
              </div>
            </div>

            {/* Right Column: Architectural Arch Graphic (Inspired directly by the reference image) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-72 sm:w-80 h-96">
                {/* Coral half-circle arch accent */}
                <div
                  className="absolute -top-4 right-4 w-20 h-20 rounded-tr-full bg-[#FF6551] opacity-95 pointer-events-none"
                  aria-hidden="true"
                />

                {/* Emerald quadrant accent */}
                <div
                  className="absolute -bottom-4 -left-4 w-24 h-24 rounded-bl-3xl bg-[#00897B] opacity-95 pointer-events-none"
                  aria-hidden="true"
                />

                {/* Minimalist crosshair mark */}
                <div
                  className="absolute top-8 left-2 text-neutral-400 font-mono text-xs select-none pointer-events-none"
                  aria-hidden="true"
                >
                  +
                </div>
                <div
                  className="absolute bottom-8 right-2 text-neutral-400 font-mono text-xs select-none pointer-events-none"
                  aria-hidden="true"
                >
                  +
                </div>

                {/* Main Arch Frame */}
                <div className="w-full h-full rounded-t-full bg-neutral-100 border border-neutral-300 overflow-hidden shadow-sm relative flex flex-col justify-between p-4">
                  <div className="pt-8 text-center">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                      {product.name || 'Studio Packshot'}
                    </span>
                    <span className="text-xs font-semibold text-neutral-800">
                      {product.packagingStructure
                        ?.replace(/_/g, ' ')
                        .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Rigid Ribbon Gift Box'}
                    </span>
                  </div>

                  {/* Product Packshot Image */}
                  <div className="flex-1 flex items-center justify-center p-2">
                    {product.masterImageUrl ? (
                      <img
                        src={product.masterImageUrl}
                        alt="Product Packshot Preview"
                        referrerPolicy="no-referrer"
                        className="max-h-52 w-auto object-contain drop-shadow-md"
                      />
                    ) : (
                      <div className="text-center p-4 text-neutral-400">
                        <Box className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
                        <span className="text-xs block font-medium">Ready to Synthesize</span>
                      </div>
                    )}
                  </div>

                  <div className="pb-3 text-center text-[10px] text-neutral-500 font-mono">
                    Zero Humans · Solitary Focus
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOUR FEATURE PILLARS (Matching the "Product Design", "Visual Design", "Art Direction" cards from reference) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-neutral-200 pb-12 sm:pb-16">
          {/* Card 1: Product Design */}
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-t-full bg-[#FF6551]/15 flex items-center justify-center text-[#FF6551]">
              <Box className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              Product Design
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Precision packaging architecture with 6 tangible structural archetypes: gable boxes, sliding sleeves, rigid gift cases, and unboxing mailers.
            </p>
          </div>

          {/* Card 2: Visual Consistency */}
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-tr-full bg-[#FF6551]/20 flex items-center justify-center text-[#FF6551]">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              Visual Consistency
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Cross-shot visual grounding locks color, tactile debossing, typography, and proportions across any camera angle and medium.
            </p>
          </div>

          {/* Card 3: Art Direction */}
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-bl-full bg-[#00897B]/20 flex items-center justify-center text-[#00897B]">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              Art Direction
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Uncompromising zero-human rule ensures your advertising campaigns highlight the physical product without distracting AI artifacts.
            </p>
          </div>
        </section>

        {/* Consistency Bar */}
        <ConsistencyAuditBadge
          hasMasterAnchor={!!product.masterImageUrl}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          imageSize={imageSize}
          onSelectImageSize={setImageSize}
        />

        {/* Master Product Anchor Status Card */}
        {product.masterImageUrl && (
          <MasterProductCard
            product={product}
            visualBible={visualBible}
            onRegenerateAnchor={handleGenerateAnchorShot}
            isGeneratingAnchor={isGeneratingAnchor}
          />
        )}

        {/* STUDIO WORKSPACE SECTION */}
        <section ref={studioSectionRef} className="space-y-8">
          <div className="border-b border-neutral-200 pb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Packaging Studio
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Configure product specifications, select packaging architecture, and deploy across media
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Product Form */}
            <div className="lg:col-span-6">
              <ProductForm
                product={product}
                onChange={handleProductChange}
                onGenerateAnchorShot={handleGenerateAnchorShot}
                isGeneratingAnchor={isGeneratingAnchor}
                onSelectPreset={handleSelectPreset}
              />
            </div>

            {/* Right: Target Mediums */}
            <div className="lg:col-span-6 space-y-8">
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
        </section>

        {/* CAMPAIGN GALLERY SECTION - "Latest work" */}
        <section ref={gallerySectionRef} className="pt-6">
          <CampaignGallery
            shots={shots}
            product={product}
            onRegenerateShot={handleRegenerateSingleShot}
            onRegenerateAll={handleGenerateCampaign}
            onOpenLightbox={(shot) => setActiveLightboxShot(shot)}
            onExportAll={handleExportCampaign}
            isGeneratingAny={isGeneratingCampaign}
          />
        </section>
      </main>

      {/* Lightbox Modal */}
      <LightboxModal
        shot={activeLightboxShot}
        brandName={product.name}
        onClose={() => setActiveLightboxShot(null)}
      />

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-neutral-200 bg-white py-8 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
            Studio Arc
          </span>
          <p className="text-neutral-500">
            Visual Consistency & Packaging Studio · Zero Humans · Pure Material Fidelity
          </p>
          <span className="text-[11px] text-neutral-400">
            Powered by Nano-Banana
          </span>
        </div>
      </footer>
    </div>
  );
}
