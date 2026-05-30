export const MAX_WORDS = 20;
export const MIN_WORD_LENGTH = 2;
export const MAX_WORD_LENGTH = 30;
export const WORD_SPLIT_REGEX = /[,;\n]+/;
export const WORD_CHAR_REGEX = /^[\p{L}\p{N}\s-]+$/u;

export const CLOUD_MAX_WIDTH = 640;
export const CLOUD_MIN_WIDTH = 260;

export const CLOUD_FONT = 'Arial';
export const CLOUD_FONT_WEIGHT = 'bold';

export function getCloudDimensions(containerWidth: number, wordCount = 10) {
  const width = Math.round(
    Math.min(CLOUD_MAX_WIDTH, Math.max(CLOUD_MIN_WIDTH, containerWidth)),
  );

  // Horizontal oval — archimedean spiral fills this shape like a classic cloud
  const aspect = wordCount <= 8 ? 0.7 : wordCount <= 14 ? 0.64 : 0.58;
  const height = Math.round(Math.max(220, width * aspect));

  return { width, height };
}
