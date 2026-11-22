import { readFile, rename, writeFile } from "node:fs/promises";
import sharp from "sharp";
import {
  discoverImages,
  findSensitiveTags,
  OWNER,
  readImageMetadata,
  relativePath,
} from "./image-metadata.mjs";

const args = process.argv.slice(2).filter((arg) => arg !== "--");
const dryRun = args.includes("--dry-run");
let files;
try {
  files = await discoverImages(args.filter((arg) => arg !== "--dry-run"));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

if (files.length === 0) {
  console.log("No images found to strip.");
  process.exit(0);
}

const ownerExif = {
  IFD0: {
    Artist: OWNER,
    Copyright: OWNER,
    CameraOwnerName: OWNER,
  },
};

let failed = 0;

for (const file of files) {
  const name = relativePath(file);
  try {
    const buffer = await readFile(file);
    const { format } = await sharp(buffer).metadata();

    // sharp strips EXIF/IPTC/XMP by default; withExif writes only our attribution.
    // rotate() bakes an existing orientation into the pixels before it is removed.
    const pipeline = sharp(buffer).rotate().withExif(ownerExif);
    if (format === "jpeg") pipeline.jpeg({ quality: 92, mozjpeg: true });
    if (format === "webp") pipeline.webp({ quality: 92 });
    const output = await pipeline.toBuffer();

    const findings = findSensitiveTags(await readImageMetadata(output));
    if (findings.length > 0) {
      failed += 1;
      console.error(`✗ ${name} — metadata remained after stripping:`);
      for (const finding of findings) {
        console.error(`    ${finding.tag}: ${finding.value} (${finding.reason})`);
      }
      continue;
    }

    if (dryRun) {
      console.log(`· ${name} (dry run, ${buffer.length} → ${output.length} bytes)`);
      continue;
    }

    const temporary = `${file}.tmp-${process.pid}`;
    await writeFile(temporary, output);
    await rename(temporary, file);
    console.log(`✓ ${name} (${buffer.length} → ${output.length} bytes)`);
  } catch (error) {
    failed += 1;
    console.error(
      `✗ ${name} — could not strip image: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

if (failed > 0) {
  console.error(`\n${failed} image(s) could not be stripped.`);
  process.exit(1);
}

console.log(
  `\n${dryRun ? "Dry run:" : "Stripped"} ${files.length} image(s). Owner set to "${OWNER}".`,
);
