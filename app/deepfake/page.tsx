'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { WordChipInput } from '@/components/deepfake/word-chip-input';
import { WordCloudDisplay } from '@/components/deepfake/word-cloud-display';
import { Button } from '@/components/ui/button';

export default function DeepfakePage() {
  const [words, setWords] = useState<string[]>([]);
  const [generation, setGeneration] = useState<{
    seed: string;
    words: string[];
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const originalTheme = theme;
    setTheme('light');

    return () => {
      if (originalTheme) {
        setTheme(originalTheme);
      }
    };
  }, [setTheme, theme]);

  const handleGenerate = () => {
    if (words.length === 0 || isGenerating) return;
    setIsGenerating(true);
    setGeneration({ seed: crypto.randomUUID(), words: [...words] });
  };

  const handleLayoutReady = useCallback(() => {
    setIsGenerating(false);
  }, []);

  const handleClear = () => {
    setWords([]);
    setGeneration(null);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-background py-6 sm:py-10">
      <div className="container mx-auto max-w-3xl space-y-5 px-3 sm:space-y-6 sm:px-4">
        <header>
          <h1 className="text-xl font-bold sm:text-2xl">
            Deepfake — Sua Nuvem de Palavras
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Adicione palavras e gere sua nuvem de palavras.
          </p>
        </header>

        <WordChipInput words={words} onChange={setWords} disabled={isGenerating} />

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleGenerate}
            disabled={words.length === 0 || isGenerating}
            className="flex-1 sm:flex-none"
          >
            {isGenerating ? 'Gerando...' : 'Gerar nuvem'}
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={(words.length === 0 && !generation) || isGenerating}
            className="flex-1 sm:flex-none"
          >
            Limpar
          </Button>
        </div>

        <WordCloudDisplay
          generation={generation}
          isGenerating={isGenerating}
          onLayoutReady={handleLayoutReady}
        />
      </div>
    </div>
  );
}
