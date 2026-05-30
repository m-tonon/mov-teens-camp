'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  aggregateWordCounts,
  buildCloudPrompt,
} from '@/lib/deepfake/cloud-prompt';

export function WordsExport() {
  const [words, setWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wordCounts = useMemo(() => aggregateWordCounts(words), [words]);
  const promptText = useMemo(() => buildCloudPrompt(words), [words]);

  const loadWords = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      const res = await fetch('/api/deepfake/words');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erro ao buscar palavras');
      setWords(data.words ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao buscar palavras');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
    } catch {
      setError('Não foi possível copiar');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Palavras Deepfake</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Palavras enviadas pelos participantes. Copie o prompt e abra o{' '}
          <a
            href="https://wordart.com/create"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            WordArt
          </a>{' '}
          para gerar a nuvem.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : wordCounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma palavra enviada ainda.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {wordCounts.map(({ word, count, isPriority }) => (
              <span
                key={word.toLocaleLowerCase('pt-BR')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-colors ${
                  isPriority
                    ? 'bg-primary/15 text-primary ring-1 ring-primary/30'
                    : 'bg-muted text-foreground'
                }`}
                style={{
                  fontSize: `${Math.min(1.25, 0.85 + count * 0.08)}rem`,
                }}
              >
                {word}
                {count > 1 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs ${
                      isPriority
                        ? 'bg-primary/20 text-primary'
                        : 'bg-background/80 text-muted-foreground'
                    }`}
                  >
                    ×{count}
                  </span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleCopy} disabled={loading || words.length === 0}>
          {copied ? 'Prompt copiado!' : 'Copiar prompt'}
        </Button>
        <Button variant="outline" asChild>
          <a
            href="https://wordart.com/create"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir WordArt
          </a>
        </Button>
        <Button variant="outline" onClick={loadWords} disabled={loading}>
          Atualizar
        </Button>
      </div>

      {!loading && words.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {words.length} envio{words.length === 1 ? '' : 's'} ·{' '}
          {wordCounts.length} palavra{wordCounts.length === 1 ? '' : 's'} única
          {wordCounts.length === 1 ? '' : 's'}
        </p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
