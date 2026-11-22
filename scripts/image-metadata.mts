import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import exifr from "exifr";
import sharp from "sharp";

/** Attribution written to every stripped image. */
export const OWNER = "auchiya.dev";
/** Root of all public image assets. */
export const IMAGE_DIR = "public/images";

const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".heic",
  ".heif",
  ".jpeg",
  ".jpg",
  ".png",
  ".tif",
  ".tiff",
  ".webp",
]);

/** EXIF/IPTC/XMP keys that are allowed to remain, and only with this value. */
const OWNER_KEYS = new Set(["artist", "copyright", "cameraownername", "ownername", "42032"]);

const SENSITIVE_RULES: ReadonlyArray<{ pattern: RegExp; reason: string }> = [
  {
    pattern: /^gps|^latitude$|^longitude$|^gpsposition$|^location$/i,
    reason: "GPS / location",
  },
  {
    pattern:
      /serial|uniqueid|owner|^artist$|^copyright$|author|creator|contact|email|hostcomputer|^software$|processingsoftware|usercomment|imagedescription|^xp(title|comment|subject|author|keywords)$|copyrightnotice|^rights$/i,
    reason: "identifying metadata",
  },
  {
    pattern: /date|time/i,
    reason: "timestamp",
  },
];

export type Finding = {
  tag: string;
  value: string;
  reason: string;
};

export type ImageMetadata = {
  tags: Record<string, unknown>;
  gps: { latitude: number; longitude: number } | null;
  hasIptc: boolean;
  hasXmp: boolean;
  format: string | undefined;
};

function describe(value: unknown): string {
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value);
}

/** sharp returns a TIFF header, sometimes prefixed with the JPEG `Exif\0\0` marker. */
function normalizeExif(buffer: Buffer | undefined): Buffer | undefined {
  if (!buffer) return undefined;
  return buffer.subarray(0, 6).toString("latin1") === "Exif\0\0" ? buffer.subarray(6) : buffer;
}

export async function readImageMetadata(buffer: Buffer): Promise<ImageMetadata> {
  const meta = await sharp(buffer).metadata();
  const exif = normalizeExif(meta.exif);
  let tags: Record<string, unknown> = {};
  let gps: ImageMetadata["gps"] = null;

  if (exif) {
    try {
      tags = ((await exifr.parse(exif, true)) as Record<string, unknown> | undefined) ?? {};
      gps = ((await exifr.gps(exif)) as ImageMetadata["gps"] | undefined) ?? null;
    } catch (error) {
      // A malformed EXIF block is itself suspicious: do not let it hide data.
      tags = { EXIFParseError: error instanceof Error ? error.message : String(error) };
    }
  }

  return {
    tags,
    gps,
    hasIptc: Boolean(meta.iptc?.length),
    hasXmp: Boolean(meta.xmp?.length),
    format: meta.format,
  };
}

export async function readImageFile(
  filePath: string,
): Promise<{ buffer: Buffer; metadata: ImageMetadata }> {
  const buffer = await readFile(filePath);
  return { buffer, metadata: await readImageMetadata(buffer) };
}

export function findSensitiveTags(metadata: ImageMetadata): Finding[] {
  const findings: Finding[] = [];

  for (const [tag, value] of Object.entries(metadata.tags)) {
    if (tag === "EXIFParseError") {
      findings.push({ tag, value: describe(value), reason: "EXIF block could not be parsed" });
      continue;
    }

    if (OWNER_KEYS.has(tag.toLowerCase())) {
      if (describe(value) !== OWNER) {
        findings.push({ tag, value: describe(value), reason: `owner must be "${OWNER}"` });
      }
      continue;
    }

    const rule = SENSITIVE_RULES.find((candidate) => candidate.pattern.test(tag));
    if (rule) findings.push({ tag, value: describe(value), reason: rule.reason });
  }

  if (metadata.gps) {
    findings.push({
      tag: "GPS coordinates",
      value: `${metadata.gps.latitude}, ${metadata.gps.longitude}`,
      reason: "GPS / location",
    });
  }
  if (metadata.hasIptc) {
    findings.push({ tag: "IPTC", value: "block present", reason: "unexpected metadata block" });
  }
  if (metadata.hasXmp) {
    findings.push({ tag: "XMP", value: "block present", reason: "unexpected metadata block" });
  }

  return findings;
}

export function relativePath(filePath: string): string {
  return path.relative(process.cwd(), filePath);
}

async function collect(directory: string, files: string[]): Promise<void> {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(entryPath, files);
    else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) files.push(entryPath);
  }
}

/**
 * Explicit paths come from lint-staged / CLI args; otherwise scan the image root.
 */
export async function discoverImages(inputs: string[]): Promise<string[]> {
  const files: string[] = [];

  if (inputs.length === 0) {
    await collect(path.resolve(IMAGE_DIR), files);
    return files.sort();
  }

  for (const input of inputs) {
    const resolved = path.resolve(input);
    let info;
    try {
      info = await stat(resolved);
    } catch {
      throw new Error(`Image path not found: ${input}`);
    }
    if (info.isDirectory()) {
      await collect(resolved, files);
    } else if (IMAGE_EXTENSIONS.has(path.extname(resolved).toLowerCase())) {
      files.push(resolved);
    }
  }

  return [...new Set(files)].sort();
}
