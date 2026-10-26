import { NextResponse } from "next/server";

/**
 * GET /api/templates
 * Returns curated templates and presets users can apply with one click.
 */
export async function GET() {
  return NextResponse.json({
    categories: [
      {
        id: "photography",
        label: "Photography",
        items: [
          { id: "t1", name: "Cinematic Portrait", prompt: "cinematic portrait, 85mm, shallow depth of field, dramatic lighting", style: "cinematic", aspectRatio: "2:3", thumb: "https://picsum.photos/seed/201/400/600" },
          { id: "t2", name: "Golden Hour Landscape", prompt: "sweeping landscape at golden hour, rolling hills, lens flare, ultra wide", style: "photorealistic", aspectRatio: "16:9", thumb: "https://picsum.photos/seed/202/600/338" },
          { id: "t3", name: "Product Shot", prompt: "product photography, softbox lighting, white seamless background, sharp detail", style: "photorealistic", aspectRatio: "1:1", thumb: "https://picsum.photos/seed/203/400/400" },
          { id: "t4", name: "Street Documentary", prompt: "black and white street photography, candid moment, 35mm grain", style: "black-and-white", aspectRatio: "3:2", thumb: "https://picsum.photos/seed/204/600/400" },
        ],
      },
      {
        id: "art",
        label: "Digital Art",
        items: [
          { id: "t5", name: "Anime Hero", prompt: "anime key visual, hero character, dynamic pose, vibrant colors, studio quality", style: "anime", aspectRatio: "2:3", thumb: "https://picsum.photos/seed/205/400/600" },
          { id: "t6", name: "Fantasy Concept", prompt: "fantasy concept art, epic environment, painterly brushwork, dramatic scale", style: "digital-art", aspectRatio: "16:9", thumb: "https://picsum.photos/seed/206/600/338" },
          { id: "t7", name: "3D Render", prompt: "octane 3d render, glossy materials, studio lighting, hyperdetailed", style: "3d-render", aspectRatio: "1:1", thumb: "https://picsum.photos/seed/207/400/400" },
          { id: "t8", name: "Watercolor", prompt: "soft watercolor illustration, paper texture, muted palette, hand-painted", style: "watercolor", aspectRatio: "4:5", thumb: "https://picsum.photos/seed/208/500/625" },
        ],
      },
      {
        id: "video",
        label: "Video",
        items: [
          { id: "t9", name: "Logo Reveal", prompt: "smooth logo reveal animation, dark background, particle effects, 5 seconds", style: "motion-graphics", aspectRatio: "16:9", thumb: "https://picsum.photos/seed/209/600/338" },
          { id: "t10", name: "Product Spin", prompt: "360 product spin, white background, soft reflection, loop", style: "3d-render", aspectRatio: "1:1", thumb: "https://picsum.photos/seed/210/400/400" },
          { id: "t11", name: "Cinematic Shot", prompt: "cinematic camera move, dramatic scene, anamorphic, 10 seconds", style: "cinematic", aspectRatio: "16:9", thumb: "https://picsum.photos/seed/211/600/338" },
          { id: "t12", name: "Abstract Loop", prompt: "abstract liquid metal loop, iridescent, seamless, 8 seconds", style: "motion-graphics", aspectRatio: "1:1", thumb: "https://picsum.photos/seed/212/400/400" },
        ],
      },
    ],
  });
}
