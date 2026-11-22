import {
  discoverImages,
  findSensitiveTags,
  OWNER,
  readImageFile,
  relativePath,
} from "./image-metadata.mjs";

let files;
try {
  files = await discoverImages(process.argv.slice(2).filter((arg) => arg !== "--"));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

if (files.length === 0) {
  console.log("No images found to check.");
  process.exit(0);
}

let failed = 0;

for (const file of files) {
  const name = relativePath(file);
  try {
    const { metadata } = await readImageFile(file);
    const findings = findSensitiveTags(metadata);

    if (findings.length === 0) {
      console.log(`✓ ${name}`);
      continue;
    }

    failed += 1;
    console.error(`✗ ${name}`);
    for (const finding of findings) {
      console.error(`    ${finding.tag}: ${finding.value} (${finding.reason})`);
    }
  } catch (error) {
    failed += 1;
    console.error(`✗ ${name}`);
    console.error(
      `    could not read image: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

if (failed > 0) {
  console.error(
    `\n${failed} image(s) contain metadata that must not be published. ` +
      `Run \`vp run strip:images\` to strip it and set the owner to "${OWNER}".`,
  );
  process.exit(1);
}

console.log(`\n✓ ${files.length} image(s) checked — no sensitive metadata found.`);
