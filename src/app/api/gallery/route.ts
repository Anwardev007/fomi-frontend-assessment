import { NextResponse } from "next/server";

/**
 * GET /api/gallery
 * Returns the community showcase gallery. Uses deterministic seeds so the
 * gallery is stable across reloads.
 */
export async function GET() {
  const items = Array.from({ length: 24 }, (_, i) => {
    const seed = 1000 + i * 37;
    return {
      id: `g_${i}`,
      url: `https://picsum.photos/seed/${seed}/800/800`,
      thumbUrl: `https://picsum.photos/seed/${seed}/400/400`,
      prompt: GALLERY_PROMPTS[i % GALLERY_PROMPTS.length],
      author: AUTHORS[i % AUTHORS.length],
      likes: 50 + ((i * 17) % 480),
      views: 1200 + ((i * 311) % 9500),
      model: ["fomi-v2-pro", "fomi-v2-lite", "fomi-v1"][i % 3],
      style: ["photorealistic", "cinematic", "anime", "3d-render", "digital-art"][i % 5],
    };
  });

  return NextResponse.json({ items });
}

const GALLERY_PROMPTS = [
  "A cyberpunk samurai standing on a rooftop at night, neon reflections, rain, cinematic lighting",
  "Cozy bookshop interior, warm afternoon light, dust motes in the air, painterly style",
  "Majestic lion made of liquid gold, black background, hyperdetailed, octane render",
  "Floating islands in the sky, waterfalls cascading into clouds, fantasy concept art",
  "Portrait of an elderly fisherman, weathered face, soft window light, 85mm lens",
  "Futuristic city at dawn, flying vehicles, glass towers reflecting sunrise, utopian",
  "Surreal forest with bioluminescent plants, glowing mushrooms, mystical atmosphere",
  "Minimalist Japanese garden, cherry blossoms, stone lantern, soft morning mist",
  "Astronaut floating above Earth with aurora borealis below, ultra realistic, NASA style",
  "Vintage car in a desert highway at golden hour, lens flare, cinematic photography",
  "Dragon perched on a mountain peak, dramatic clouds, epic scale, fantasy illustration",
  "Abstract liquid metal forms, iridescent surface, studio lighting, 3D render",
];

const AUTHORS = [
  "maya.creates", "studio.north", "aria_h", "leo.designs", "kai_visual",
  "nova.art", "theo.pixels", "juno.k", "rin.makes", "sasha_v",
];
