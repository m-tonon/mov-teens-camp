'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { PerfilForm } from '@/components/perfil/perfil-form';
import { PerfilResult } from '@/components/perfil/perfil-result';

interface AreaScores {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
  G: number;
}

export default function PerfilPage() {
  const [showResult, setShowResult] = useState(false);
  const [scores, setScores] = useState<AreaScores | null>(null);
  const { setTheme, theme } = useTheme();

  // Força light theme ao entrar na página
  useEffect(() => {
    const originalTheme = theme;
    setTheme('light');

    return () => {
      if (originalTheme) {
        setTheme(originalTheme);
      }
    };
  }, [setTheme, theme]);

  const handleFormSubmit = (formScores: AreaScores) => {
    setScores(formScores);
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setShowResult(false);
    setScores(null);
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container max-w-3xl mx-auto px-4">
        {!showResult ? (
          <PerfilForm onSubmit={handleFormSubmit} />
        ) : (
          scores && <PerfilResult scores={scores} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
