'use client';

import { ClipboardEvent, KeyboardEvent, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/input';
import { MAX_WORDS } from '@/lib/deepfake/constants';
import {
  mergeWords,
  normalizeWord,
  parseWordsInput,
} from '@/lib/deepfake/parse-words';
import { cn } from '@/lib/utils';

type WordChipInputProps = {
  words: string[];
  onChange: (words: string[]) => void;
  disabled?: boolean;
};

export function WordChipInput({ words, onChange, disabled }: WordChipInputProps) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  const addDraft = (raw: string) => {
    const normalized = normalizeWord(raw);
    if (!normalized) {
      if (raw.trim()) {
        setError('Palavra inválida (2–30 caracteres, sem símbolos especiais)');
      }
      return;
    }
    if (words.length >= MAX_WORDS) {
      setError(`Limite de ${MAX_WORDS} palavras atingido`);
      return;
    }
    onChange(mergeWords(words, [normalized]));
    setDraft('');
    setError(null);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !draft && words.length) {
      onChange(words.slice(0, -1));
      return;
    }
    if (e.key === 'Enter' || e.key === 'Tab' || e.key === ',') {
      e.preventDefault();
      addDraft(draft);
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (!text.includes(',') && !text.includes(';') && !text.includes('\n')) {
      return;
    }
    e.preventDefault();
    const { words: parsed } = parseWordsInput(text);
    onChange(mergeWords(words, parsed));
    setError(null);
  };

  const removeWord = (word: string) => {
    onChange(words.filter((w) => w !== word));
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-border bg-background px-3 py-2',
          disabled && 'opacity-60',
        )}
      >
        {words.map((word) => (
          <span
            key={word}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
          >
            {word}
            {!disabled && (
              <button
                type="button"
                aria-label={`Remover ${word}`}
                onClick={() => removeWord(word)}
                className="rounded-full hover:bg-primary/20"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            )}
          </span>
        ))}
        <Input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onBlur={() => draft && addDraft(draft)}
          disabled={disabled || words.length >= MAX_WORDS}
          placeholder={
            words.length
              ? 'Adicionar palavra...'
              : 'Digite palavras separadas por vírgula'
          }
          className="min-w-[180px] flex-1 border-0 shadow-none focus-visible:ring-0"
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {words.length} / {MAX_WORDS} palavras
        </span>
        {error && <span className="text-destructive">{error}</span>}
      </div>
    </div>
  );
}
