import {
  MAX_WORDS,
  MIN_WORD_LENGTH,
  MAX_WORD_LENGTH,
  WORD_SPLIT_REGEX,
  WORD_CHAR_REGEX,
} from './constants';

export type ParseWordsResult = {
  words: string[];
  rejected: string[];
};

export function normalizeWord(raw: string): string | null {
  const word = raw.trim().replace(/\s+/g, ' ');
  if (!word) return null;
  if (word.length < MIN_WORD_LENGTH || word.length > MAX_WORD_LENGTH) return null;
  if (!WORD_CHAR_REGEX.test(word)) return null;
  return word;
}

export function parseWordsInput(input: string): ParseWordsResult {
  const parts = input.split(WORD_SPLIT_REGEX);
  const words: string[] = [];
  const rejected: string[] = [];
  const seen = new Set<string>();

  for (const part of parts) {
    const normalized = normalizeWord(part);
    if (!normalized) {
      if (part.trim()) rejected.push(part.trim());
      continue;
    }
    const key = normalized.toLocaleLowerCase('pt-BR');
    if (seen.has(key)) continue;
    if (words.length >= MAX_WORDS) {
      rejected.push(normalized);
      continue;
    }
    seen.add(key);
    words.push(normalized);
  }

  return { words, rejected };
}

export function mergeWords(existing: string[], incoming: string[]): string[] {
  const result = [...existing];
  const seen = new Set(existing.map((w) => w.toLocaleLowerCase('pt-BR')));

  for (const word of incoming) {
    const key = word.toLocaleLowerCase('pt-BR');
    if (seen.has(key) || result.length >= MAX_WORDS) continue;
    seen.add(key);
    result.push(word);
  }

  return result;
}
