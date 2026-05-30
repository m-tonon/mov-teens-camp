'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { normalizeWord } from '@/lib/deepfake/parse-words';

export default function DeepfakePage() {
  const [word, setWord] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const originalTheme = theme;
    setTheme('light');
    return () => {
      if (originalTheme) setTheme(originalTheme);
    };
  }, [setTheme, theme]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalized = normalizeWord(word);
    if (!normalized) {
      setError('Digite uma palavra válida (2–30 caracteres, sem símbolos especiais)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/deepfake/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: normalized }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erro ao enviar');
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar palavra');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md space-y-4 text-center">
          <div className="text-5xl">🙏</div>
          <h1 className="text-2xl font-bold">Obrigado!</h1>
          <p className="text-muted-foreground">
            Sua palavra foi registrada. Obrigado por participar!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <header className="text-center">
          <h1 className="text-2xl font-bold">Deepfake</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Digite <strong>uma palavra</strong> que representa você neste
            acampamento.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={word}
            onChange={(e) => {
              setWord(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Sua palavra..."
            disabled={loading}
            autoFocus
            maxLength={30}
            className="text-center text-lg"
          />
          {error && <p className="text-center text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading || !word.trim()}>
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </form>
      </div>
    </div>
  );
}
