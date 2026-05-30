const PROMPT_PREFIX = `Shape mask: shapes/thumbs/cloud. Font: Roboto. All words horizontal. White background.
Use a blueish color palette (light to dark blues, avoid neon). Distribute colors evenly.
Text only — no icons, borders, shadows, or decorations.
Make Amor, Deus, and Jesus the largest words.
Fill shape densely. Keep readable.
Words:

`;

export const PRIORITY_WORDS = ['amor', 'deus', 'jesus'];

export function buildCloudPrompt(words: string[]): string {
  return PROMPT_PREFIX + words.join(', ');
}

export type WordCount = {
  word: string;
  count: number;
  isPriority: boolean;
};

export function aggregateWordCounts(words: string[]): WordCount[] {
  const map = new Map<string, WordCount>();

  for (const raw of words) {
    const word = raw.trim();
    if (!word) continue;

    const key = word.toLocaleLowerCase('pt-BR');
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(key, {
        word,
        count: 1,
        isPriority: PRIORITY_WORDS.includes(key),
      });
    }
  }

  return [...map.values()].sort((a, b) => {
    if (a.isPriority !== b.isPriority) return a.isPriority ? -1 : 1;
    return b.count - a.count;
  });
}
