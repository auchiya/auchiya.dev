import auchiyaDev from "./images/auchiya.dev.webp";
import solarCalculator from "./images/calculadorasolartermica.ar.webp";
import soundsGoodCombined from "./images/sounds-good-combined.webp";
import soundsGoodMetronome from "./images/sounds-good-metronome.webp";
import soundsGoodTuner from "./images/sounds-good-tuner.webp";
import soundsGoodVisualizer from "./images/sounds-good-visualizer.webp";

/**
 * Project screenshots, imported so the build emits content-hashed URLs and
 * intrinsic dimensions. MDX imports of images only return a URL string, so
 * keep the imports here (a `.ts` module) and reference the entries from MDX.
 *
 * To add an image:
 *   1. Put the file in `content/projects/images/`.
 *   2. Add an import and an entry below.
 *   3. Use `projectImages["<key>"]` in the project's `meta.screenshots`.
 */
export const projectImages = {
  "auchiya.dev": auchiyaDev,
  "calculadorasolartermica.ar": solarCalculator,
  "sounds-good-combined": soundsGoodCombined,
  "sounds-good-metronome": soundsGoodMetronome,
  "sounds-good-tuner": soundsGoodTuner,
  "sounds-good-visualizer": soundsGoodVisualizer,
} as const;

export type ProjectImageKey = keyof typeof projectImages;
