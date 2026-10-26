/**
 * Shared mock data and types for the Fomi frontend.
 * Centralising here keeps the components clean and the architecture scalable.
 */

export type AspectRatio = "1:1" | "3:2" | "2:3" | "16:9" | "9:16" | "4:5" | "5:4";
export type FomiModel = "fomi-v2-pro" | "fomi-v2-lite" | "fomi-v1";
export type FomiStyle =
  | "photorealistic"
  | "cinematic"
  | "anime"
  | "3d-render"
  | "digital-art"
  | "watercolor"
  | "black-and-white"
  | "motion-graphics";

export interface GeneratedVariant {
  id: string;
  url: string;
  thumbUrl: string;
  width: number;
  height: number;
  seed: number;
  prompt: string;
  model: FomiModel;
  style: FomiStyle;
  aspectRatio: AspectRatio;
  createdAt: string;
  promptAdherence: number;
  aestheticScore: number;
}

export interface GenerateResponse {
  ok: boolean;
  requestId: string;
  latencyMs: number;
  variants: GeneratedVariant[];
  meta: {
    model: FomiModel;
    style: FomiStyle;
    aspectRatio: AspectRatio;
    prompt: string;
    count: number;
  };
}

export interface GalleryItem {
  id: string;
  url: string;
  thumbUrl: string;
  prompt: string;
  author: string;
  likes: number;
  views: number;
  model: FomiModel;
  style: FomiStyle;
}

export interface HistoryEntry {
  id: string;
  prompt: string;
  model: FomiModel;
  style: FomiStyle;
  aspectRatio: AspectRatio;
  createdAt: string;
  variants: GeneratedVariant[];
}

export const MODELS: { id: FomiModel; name: string; tagline: string; badge?: string }[] = [
  { id: "fomi-v2-pro", name: "Fomi v2 Pro", tagline: "Best quality · 4K ready", badge: "Recommended" },
  { id: "fomi-v2-lite", name: "Fomi v2 Lite", tagline: "2× faster · Draft mode" },
  { id: "fomi-v1", name: "Fomi v1", tagline: "Legacy · Stable" },
];

export const STYLES: { id: FomiStyle; name: string; emoji: string }[] = [
  { id: "photorealistic", name: "Photorealistic", emoji: "📷" },
  { id: "cinematic", name: "Cinematic", emoji: "🎬" },
  { id: "anime", name: "Anime", emoji: "🌸" },
  { id: "3d-render", name: "3D Render", emoji: "🧊" },
  { id: "digital-art", name: "Digital Art", emoji: "🎨" },
  { id: "watercolor", name: "Watercolor", emoji: "💧" },
  { id: "black-and-white", name: "B&W", emoji: "⚫" },
];

export const ASPECT_RATIOS: { id: AspectRatio; label: string; w: number; h: number }[] = [
  { id: "1:1", label: "Square", w: 1, h: 1 },
  { id: "3:2", label: "Landscape", w: 3, h: 2 },
  { id: "2:3", label: "Portrait", w: 2, h: 3 },
  { id: "16:9", label: "Widescreen", w: 16, h: 9 },
  { id: "9:16", label: "Vertical", w: 9, h: 16 },
  { id: "4:5", label: "Instagram", w: 4, h: 5 },
];

export const SAMPLE_PROMPTS = [
  "A cyberpunk samurai on a neon rooftop at midnight, rain reflections, cinematic",
  "Cozy bookshop in autumn, warm light, dust motes, painterly, 35mm",
  "Portrait of a weathered fisherman, soft window light, 85mm, shallow depth of field",
  "Floating islands in the sky with cascading waterfalls, fantasy concept art",
  "Majestic lion made of liquid gold, black background, hyperdetailed, octane",
  "Surreal bioluminescent forest, glowing mushrooms, mystical atmosphere",
  "Astronaut floating above Earth with aurora borealis, ultra realistic",
  "Vintage car on a desert highway at golden hour, lens flare, cinematic",
];
