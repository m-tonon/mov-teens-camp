import {
  MIN_WORD_LENGTH,
  MAX_WORD_LENGTH,
  WORD_CHAR_REGEX,
} from './constants';

export function normalizeWord(raw: string): string | null {
  const word = raw.trim().replace(/\s+/g, ' ');
  if (!word) return null;
  if (word.length < MIN_WORD_LENGTH || word.length > MAX_WORD_LENGTH) return null;
  if (!WORD_CHAR_REGEX.test(word)) return null;
  return word;
}
