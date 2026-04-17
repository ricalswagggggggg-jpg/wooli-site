import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, access, readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "data", "wooli-shop-data.json");
const OUTPUT_DATA_PATH = path.join(ROOT, "data", "wooli-shop-local.json");
const REPORT_PATH = path.join(ROOT, "data", "wooli-download-report.json");
const IMAGE_DIR = path.join(ROOT, "public", "wooli-images");
const PLACEHOLDER_PATH = "/wooli-images/missing-image.svg";
const CONCURRENCY = 8;
const FETCH_TIMEOUT_MS = 15000;

function normalizeSource(src) {
  if (!src) return "";
  if (src.startsWith("/photo/")) return `https://cdn.caidan2.com${src}`;
  if (src.startsWith("/")) return `https://us.caidan2.com${src}`;
  return src;
}

function fallbackSources(src) {
  const normalized = normalizeSource(src);
  const candidates = [normalized];

  if (normalized.startsWith("https://")) {
    candidates.push(normalized.replace("https://", "http://"));
  }

  return [...new Set(candidates)];
}

function extensionFromType(contentType) {
  if (!contentType) return ".bin";
  if (contentType.includes("jpeg")) return ".jpg";
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("gif")) return ".gif";
  if (contentType.includes("svg")) return ".svg";
  return ".bin";
}

function extensionFromUrl(urlString) {
  try {
    const url = new URL(urlString);
    const ext = path.extname(url.pathname);
    return ext || "";
  } catch {
    return "";
  }
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: {
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.byteLength === 0) {
    throw new Error("Empty response body");
  }

  return { buffer, contentType };
}

async function downloadOne(item, index) {
  const original = item.photo;
  const candidates = fallbackSources(original);
  const hash = createHash("sha1").update(original).digest("hex").slice(0, 16);
  const existingPrefix = `${String(index + 1).padStart(3, "0")}-${hash}`;

  let lastError = "Unknown error";

  try {
    const files = await readdir(IMAGE_DIR);
    const existing = files.find((file) => file.startsWith(existingPrefix));
    if (existing) {
      return {
        ok: true,
        original,
        local: `/wooli-images/${existing}`,
        size: 0
      };
    }
  } catch {}

  for (const candidate of candidates) {
    try {
      const { buffer, contentType } = await fetchBuffer(candidate);
      const ext = extensionFromUrl(candidate) || extensionFromType(contentType);
      const filename = `${String(index + 1).padStart(3, "0")}-${hash}${ext}`;
      const filePath = path.join(IMAGE_DIR, filename);

      if (!(await exists(filePath))) {
        await writeFile(filePath, buffer);
      }

      return {
        ok: true,
        original,
        local: `/wooli-images/${filename}`,
        size: buffer.byteLength
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }

  return {
    ok: false,
    original,
    local: PLACEHOLDER_PATH,
    error: lastError
  };
}

async function main() {
  const raw = await readFile(DATA_PATH, "utf8");
  const payload = JSON.parse(raw);
  const items = payload.content.menu.flatMap((category) => category.items || []);

  await mkdir(IMAGE_DIR, { recursive: true });

  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const currentIndex = cursor;
      cursor += 1;
      results[currentIndex] = await downloadOne(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  items.forEach((item, index) => {
    item.photo = results[index].local;
  });

  const summary = {
    total: results.length,
    downloaded: results.filter((result) => result.ok).length,
    placeholder: results.filter((result) => !result.ok).length,
    failedItems: results.filter((result) => !result.ok)
  };

  await writeFile(OUTPUT_DATA_PATH, JSON.stringify(payload, null, 2));
  await writeFile(REPORT_PATH, JSON.stringify(summary, null, 2));

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
