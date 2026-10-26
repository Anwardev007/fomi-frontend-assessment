import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/generate
 * Mocked AI image generation endpoint.
 * Returns 4 image variants based on the prompt, with simulated latency.
 *
 * The objective is not backend complexity — it is a realistic frontend
 * architecture. We simulate:
 *   - variable generation latency (800ms - 2200ms)
 *   - 4 variants per generation (industry standard, like Midjourney/DALL-E)
 *   - deterministic seed selection (so the same prompt yields consistent results)
 *   - per-variant metadata (model, dimensions, seed, prompt-strength)
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const prompt: string = (body?.prompt ?? "").trim() || "a serene mountain landscape at dawn";
  const model: string = body?.model ?? "fomi-v2-pro";
  const aspectRatio: string = body?.aspectRatio ?? "1:1";
  const style: string = body?.style ?? "photorealistic";
  const count: number = Math.min(Math.max(body?.count ?? 4, 1), 4);

  // Simulate model latency
  const latency = 800 + Math.floor(Math.random() * 1400);
  await new Promise((r) => setTimeout(r, latency));

  // Deterministic seed from prompt (so rerun yields same image set)
  const seedBase = hashString(prompt + model + style);

  const [w, h] = dimsFor(aspectRatio);

  const variants = Array.from({ length: count }, (_, i) => {
    const seed = (seedBase + i * 1009) % 1_000_000;
    return {
      id: `gen_${seedBase}_${i}_${Date.now()}`,
      url: `https://picsum.photos/seed/${seed}/${w}/${h}`,
      thumbUrl: `https://picsum.photos/seed/${seed}/400/400`,
      width: w,
      height: h,
      seed,
      prompt,
      model,
      style,
      aspectRatio,
      createdAt: new Date().toISOString(),
      // Mocked quality indicators — useful for the workspace UI
      promptAdherence: 0.7 + Math.random() * 0.28,
      aestheticScore: 0.6 + Math.random() * 0.38,
    };
  });

  return NextResponse.json({
    ok: true,
    requestId: `req_${seedBase}_${Date.now()}`,
    latencyMs: latency,
    variants,
    meta: {
      model,
      style,
      aspectRatio,
      prompt,
      count,
    },
  });
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % 1_000_000;
}

function dimsFor(ar: string): [number, number] {
  switch (ar) {
    case "1:1": return [1024, 1024];
    case "3:2": return [1024, 683];
    case "2:3": return [683, 1024];
    case "16:9": return [1024, 576];
    case "9:16": return [576, 1024];
    case "4:5": return [1024, 1280];
    case "5:4": return [1280, 1024];
    default: return [1024, 1024];
  }
}
