import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function normalizeSource(src: string) {
  if (!src) return "";
  if (src.startsWith("/photo/")) return `https://cdn.caidan2.com${src}`;
  if (src.startsWith("/")) return `https://us.caidan2.com${src}`;
  if (src.startsWith("http://")) return src.replace("http://", "https://");
  return src;
}

function svgFallback(label: string) {
  const safeLabel = label.replace(/[<>&"]/g, "");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#f8efe2"/>
          <stop offset="100%" stop-color="#ead6bb"/>
        </linearGradient>
      </defs>
      <rect width="800" height="800" rx="48" fill="url(#bg)"/>
      <rect x="36" y="36" width="728" height="728" rx="34" fill="none" stroke="#c7a57d" stroke-width="4" stroke-dasharray="10 12"/>
      <text x="400" y="350" text-anchor="middle" font-size="44" font-family="Arial, sans-serif" fill="#8a623b">Image unavailable</text>
      <text x="400" y="420" text-anchor="middle" font-size="28" font-family="Arial, sans-serif" fill="#6a4d2f">${safeLabel}</text>
    </svg>
  `.trim();
}

async function fetchImage(url: string) {
  const response = await fetch(url, {
    cache: "force-cache",
    headers: {
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
    }
  });

  if (!response.ok) {
    throw new Error(`Upstream image request failed: ${response.status}`);
  }

  const contentType =
    response.headers.get("content-type") || "application/octet-stream";
  const buffer = await response.arrayBuffer();

  return { buffer, contentType };
}

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src") || "";
  const label = request.nextUrl.searchParams.get("label") || "Product";

  if (!src) {
    return NextResponse.json({ message: "Missing src parameter." }, { status: 400 });
  }

  const normalized = normalizeSource(src);

  try {
    const result = await fetchImage(normalized);

    return new NextResponse(result.buffer, {
      headers: {
        "Content-Type": result.contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400"
      }
    });
  } catch (primaryError) {
    if (src.startsWith("http://")) {
      try {
        const result = await fetchImage(src);

        return new NextResponse(result.buffer, {
          headers: {
            "Content-Type": result.contentType,
            "Cache-Control": "public, max-age=86400, s-maxage=86400"
          }
        });
      } catch {
        const message =
          primaryError instanceof Error ? primaryError.message : "Image proxy failed";

        return new NextResponse(svgFallback(label), {
          status: 200,
          headers: {
            "Content-Type": "image/svg+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600"
          }
        });
      }
    }

    return new NextResponse(svgFallback(label), {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600"
      }
    });
  }
}
