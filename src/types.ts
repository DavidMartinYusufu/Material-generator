export type MediumCategory = 'outdoor' | 'print' | 'digital' | 'retail';

export interface MediumDefinition {
  id: string;
  name: string;
  category: MediumCategory;
  defaultAspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9' | '4:1';
  description: string;
  headlinePlaceholder: string;
  lightingHint: string;
  icon: string;
}

export type PackagingStructureType =
  | 'none'
  | 'gable_handle_box'
  | 'canva_multi_box'
  | 'kraft_unboxing_mailer'
  | 'rigid_ribbon_box'
  | 'sliding_sleeve_drawer'
  | 'packaging_dieline_net';

export interface ProductData {
  name: string;
  category: string;
  tagline: string;
  description: string;
  materials: string;
  colors: string[];
  aesthetic: string;
  packagingStructure?: PackagingStructureType;
  boxFinish?: string;
  masterImageUrl?: string;
  masterImageMimeType?: string;
}

export interface VisualBible {
  brandName: string;
  visualIdentity: {
    primaryColors: string[];
    materialsAndTexture: string;
    geometricFormFactor: string;
    brandingAndLogoDetails: string;
    keyDistinguishingFeatures?: string[];
  };
  masterPackshotPrompt: string;
  mediumPrompts: Array<{
    mediumId: string;
    mediumTitle: string;
    aspectRatio: string;
    recommendedLighting: string;
    detailedPrompt: string;
    headlineText: string;
  }>;
}

export interface GeneratedShot {
  id: string;
  mediumId: string;
  mediumName: string;
  aspectRatio: string;
  prompt: string;
  imageUrl?: string;
  status: 'idle' | 'generating' | 'completed' | 'failed';
  errorMessage?: string;
  modelUsed?: string;
  timestamp: number;
  headlineText?: string;
}

export type NanoBananaModel = 'gemini-nano-banana-2.1' | 'gemini-3.1-flash-lite-image';
