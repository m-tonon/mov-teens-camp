'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AreaScores {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
  G: number;
}

interface PerfilResultProps {
  scores: AreaScores;
  onReset: () => void;
}

const areaConfig = {
  A: {
    name: 'Coração que Acolhe',
    role: 'Conector',
    description: 'Recepção, boas-vindas, visitação, aconselhamento',
    icon: '🤝',
    color: 'bg-pink-500',
  },
  B: {
    name: 'Mão que Faz',
    role: 'Apoiador',
    description: 'Diaconato, logística, cozinha, organização de eventos',
    icon: '🛠️',
    color: 'bg-blue-500',
  },
  C: {
    name: 'Mente que Organiza',
    role: 'Estrategista',
    description:
      'Secretaria do grupo, organização de escalas, apoio administrativo',
    icon: '📋',
    color: 'bg-green-500',
  },
  D: {
    name: 'Voz que Inspira',
    role: 'Incentivador',
    description: 'Evangelismo, teatro, moderação de redes sociais, pregação',
    icon: '🎤',
    color: 'bg-purple-500',
  },
  E: {
    name: 'Talento que Cria',
    role: 'Criativo',
    description: 'Louvor, mídia, design, sonoplastia, artes visuais',
    icon: '🎨',
    color: 'bg-orange-500',
  },
  F: {
    name: 'Mestre que Ensina',
    role: 'Mestre',
    description: 'Ministério Infantil, auxílio em estudos bíblicos, biblioteca',
    icon: '📖',
    color: 'bg-teal-500',
  },
  G: {
    name: 'Pé que Lidera',
    role: 'Líder',
    description:
      'Liderança de gincanas, capitão de equipes, auxílio na liderança',
    icon: '👑',
    color: 'bg-red-500',
  },
};

export function PerfilResult({ scores, onReset }: PerfilResultProps) {
  const maxScore = 15;

  const sortedAreas = Object.entries(scores)
    .map(([key, value]) => ({
      key: key as keyof AreaScores,
      score: value,
      config: areaConfig[key as keyof typeof areaConfig],
    }))
    .sort((a, b) => b.score - a.score);

  const topArea = sortedAreas[0];
  const secondArea = sortedAreas[1];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
          <span>🎯</span>
          <span>Seu Resultado</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">
          Seu Perfil Vocacional
        </h1>
      </div>

      {/* Main Result Card */}
      <Card className="border-2 border-primary/20 overflow-hidden">
        <div className={`h-2 ${topArea.config.color}`} />
        <CardHeader className="text-center pb-2">
          <div className="text-5xl mb-2">{topArea.config.icon}</div>
          <CardTitle className="text-2xl">{topArea.config.role}</CardTitle>
          <p className="text-muted-foreground">{topArea.config.name}</p>
        </CardHeader>
        <CardContent className="text-center pb-6">
          <p className="text-sm text-muted-foreground">
            {topArea.config.description}
          </p>

          {secondArea && secondArea.score === topArea.score && (
            <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
              <span className="font-medium">🎉 Você tem dupla vocação!</span>
              <p className="text-muted-foreground text-xs mt-1">
                Também se destacou em {secondArea.config.role} (
                {secondArea.config.name})
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Areas Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span>📊</span> Detalhamento por Área
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedAreas.map(({ key, score, config }) => {
            const percentage = (score / maxScore) * 100;
            return (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span>{config.icon}</span>
                    <span className="font-medium">{config.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({config.role})
                    </span>
                  </div>
                  <span className="font-semibold">
                    {score}/{maxScore}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {config.description}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span>💡</span> Próximos Passos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
              1
            </div>
            <p className="text-sm">
              Converse com seu líder sobre o resultado e onde você pode começar
              a servir.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
              2
            </div>
            <p className="text-sm">
              Participe de uma reunião ou atividade da área{' '}
              <strong>{topArea.config.role}</strong> para experimentar na
              prática.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
              3
            </div>
            <p className="text-sm">
              Muitas áreas oferecem treinamento e capacitação para novos
              voluntários.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full py-3 text-sm font-medium rounded-xl border border-border hover:bg-muted transition-colors"
      >
        ← Refazer o teste
      </button>
    </div>
  );
}
