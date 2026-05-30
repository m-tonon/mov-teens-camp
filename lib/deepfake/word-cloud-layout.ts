import cloud from 'd3-cloud';
import {
  CLOUD_FONT,
  CLOUD_FONT_WEIGHT,
  CLOUD_MAX_WIDTH,
  getCloudDimensions,
} from './constants';

export type WordCloudItem = {
  text: string;
  fontSize: number;
  color: string;
  rotation: number;
  x: number;
  y: number;
};

type SizeTier = 'hero' | 'large' | 'medium' | 'small' | 'filler';

type CloudWord = cloud.Word & {
  color: string;
};

type PlacedCloudWord = CloudWord & {
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
};

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TIER_COLORS: Record<SizeTier, string[]> = {
  hero: ['#B8337A', '#A02080', '#C0267A'],
  large: ['#B8337A', '#9932CC', '#8E2470'],
  medium: ['#2F2855', '#3D3066', '#443370'],
  small: ['#D4AD3A', '#E5C050', '#C9A030'],
  filler: ['#E07060', '#E8826A', '#D96050'],
};

function computeSizeRange(wordCount: number, cloudWidth: number) {
  const widthScale = Math.max(0.5, Math.min(1, cloudWidth / CLOUD_MAX_WIDTH));

  // Fewer words → larger fonts so the cloud fills the canvas naturally
  // (never scale fonts up *after* layout — that causes overlap)
  let maxBase: number;
  if (wordCount <= 4) maxBase = 82;
  else if (wordCount <= 8) maxBase = 72;
  else if (wordCount <= 12) maxBase = 62;
  else if (wordCount <= 16) maxBase = 54;
  else maxBase = 46;

  const minBase = 12;

  return {
    max: Math.round(maxBase * widthScale),
    min: Math.round(minBase * widthScale),
  };
}

function shuffle<T>(array: T[], rand: () => number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildTierPool(wordCount: number): SizeTier[] {
  const heroCount = wordCount >= 2 ? 2 : 1;
  const largeCount = Math.max(1, Math.round(wordCount * 0.12));
  const mediumCount = Math.max(2, Math.round(wordCount * 0.22));
  const smallCount = Math.max(2, Math.round(wordCount * 0.28));

  const pool: SizeTier[] = [
    ...Array(heroCount).fill('hero' as SizeTier),
    ...Array(largeCount).fill('large' as SizeTier),
    ...Array(mediumCount).fill('medium' as SizeTier),
    ...Array(smallCount).fill('small' as SizeTier),
  ];

  while (pool.length < wordCount) pool.push('filler');
  return pool.slice(0, wordCount);
}

function tierFontSize(tier: SizeTier, maxSize: number, minSize: number): number {
  const ratios: Record<SizeTier, number> = {
    hero: 1,
    large: 0.68,
    medium: 0.48,
    small: 0.33,
    filler: 0.24,
  };
  return Math.max(minSize, Math.round(maxSize * ratios[tier]));
}

function assignTieredWords(
  words: string[],
  maxSize: number,
  minSize: number,
  rand: () => number,
): { text: string; size: number; color: string }[] {
  const tiers = shuffle(buildTierPool(words.length), rand);

  return words.map((text, index) => {
    const tier = tiers[index];
    let size = tierFontSize(tier, maxSize, minSize);

    if (text.length > 10) size = Math.round(size * 0.84);
    else if (text.length > 7) size = Math.round(size * 0.92);

    const palette = TIER_COLORS[tier];
    const color = palette[Math.floor(rand() * palette.length)];

    return { text, size, color };
  });
}

/**
 * Re-centre the cloud on (0,0). Only scale DOWN when the bounding box
 * overflows the canvas — never scale up, because enlarging fonts after
 * d3-cloud placement breaks collision detection and causes overlap.
 */
function fitLayoutToBox(
  items: PlacedCloudWord[],
  width: number,
  height: number,
): WordCloudItem[] {
  if (items.length === 0) return [];

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const item of items) {
    const x = item.x ?? 0;
    const y = item.y ?? 0;
    const left = x + (item.x0 ?? 0);
    const right = x + (item.x1 ?? 0);
    const top = y + (item.y0 ?? 0);
    const bottom = y + (item.y1 ?? 0);
    minX = Math.min(minX, left);
    maxX = Math.max(maxX, right);
    minY = Math.min(minY, top);
    maxY = Math.max(maxY, bottom);
  }

  const boxW = maxX - minX || 1;
  const boxH = maxY - minY || 1;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const margin = 10;
  const scale = Math.min(
    1,
    (width - margin * 2) / boxW,
    (height - margin * 2) / boxH,
  );

  return items.map((item) => ({
    text: item.text ?? '',
    fontSize: Math.max(10, Math.round((item.size ?? 14) * scale)),
    color: item.color,
    rotation: 0,
    x: ((item.x ?? 0) - centerX) * scale,
    y: ((item.y ?? 0) - centerY) * scale,
  }));
}

export function buildWordCloudLayout(
  words: string[],
  seed: string,
  containerWidth: number,
): Promise<WordCloudItem[]> {
  const { width, height } = getCloudDimensions(containerWidth, words.length);
  const rand = mulberry32(hashSeed(seed));
  const { max, min } = computeSizeRange(words.length, width);
  const tieredWords = assignTieredWords(words, max, min, rand);

  const cloudWords: CloudWord[] = tieredWords.map(({ text, size, color }) => ({
    text,
    size,
    color,
  }));

  return new Promise((resolve) => {
    cloud<CloudWord>()
      .size([width, height])
      .words(cloudWords)
      .padding(3)
      .random(() => rand())
      .rotate(() => 0)
      .font(CLOUD_FONT)
      .fontWeight(CLOUD_FONT_WEIGHT)
      .fontSize((d) => d.size ?? 14)
      .spiral('archimedean')
      .on('end', (placed) => {
        const items = (placed as PlacedCloudWord[]).filter(
          (w) => w.x != null && w.y != null,
        );

        resolve(fitLayoutToBox(items, width, height));
      })
      .start();
  });
}

export type CloudDimensions = ReturnType<typeof getCloudDimensions>;

export function getLayoutDimensions(
  containerWidth: number,
  wordCount = 10,
): CloudDimensions {
  return getCloudDimensions(containerWidth, wordCount);
}
