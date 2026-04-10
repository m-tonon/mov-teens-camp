'use client';

import { useState } from 'react';

interface AreaScores {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
  G: number;
}

interface PerfilFormProps {
  onSubmit: (scores: AreaScores) => void;
}

const areaQuestions = {
  A: {
    title: 'Área A: O Coração que Acolhe',
    subtitle: 'Hospitalidade e Misericórdia',
    questions: [
      'Eu fico incomodado quando vejo alguém sozinho no culto e sinto vontade de ir lá falar com a pessoa.',
      'Meus amigos costumam me procurar para desabafar porque eu sei ouvir bem.',
      'Eu gosto de preparar o ambiente (comida, decoração, recepção) para que todos se sintam em casa.',
    ],
  },
  B: {
    title: 'Área B: A Mão que Faz',
    subtitle: 'Serviço e Ajuda Prática',
    questions: [
      'Eu prefiro ajudar na limpeza ou organização do que ficar na frente de todo mundo falando.',
      'Quando vejo uma necessidade prática (carregar algo, arrumar uma cadeira), eu faço sem ninguém precisar pedir.',
      "Eu sinto satisfação em saber que meu trabalho 'invisível' ajudou o evento a acontecer.",
    ],
  },
  C: {
    title: 'Área C: A Mente que Organiza',
    subtitle: 'Administração e Planejamento',
    questions: [
      'Eu gosto de fazer listas, cronogramas ou organizar como uma tarefa será dividida entre o grupo.',
      'Eu consigo manter a calma e ajudar a resolver problemas quando algo sai do planejado.',
      'Eu gosto de cuidar de detalhes, como horários, inscrições ou finanças.',
    ],
  },
  D: {
    title: 'Área D: A Voz que Inspira',
    subtitle: 'Exortação e Comunicação',
    questions: [
      'Eu gosto de postar mensagens de ânimo ou usar minhas redes sociais para falar de Deus.',
      'Eu tenho facilidade em incentivar as pessoas a não desistirem quando as coisas ficam difíceis.',
      'Eu gosto de falar em público ou participar de apresentações/teatro.',
    ],
  },
  E: {
    title: 'Área E: O Talento que Cria',
    subtitle: 'Artes e Criatividade',
    questions: [
      'Eu me expresso bem através da música, desenho, dança ou edição de vídeo/fotos.',
      'Eu gosto de pensar em jeitos diferentes e criativos de explicar uma passagem da Bíblia.',
      'Eu me interesso pela área técnica (som, luz, projeção, câmeras).',
    ],
  },
  F: {
    title: 'Área F: O Mestre que Ensina',
    subtitle: 'Ensino e Conhecimento',
    questions: [
      'Eu gosto de ler a Bíblia e pesquisar curiosidades sobre as histórias bíblicas.',
      'Eu tenho paciência e clareza para explicar algo difícil para alguém que não entendeu.',
      'Eu me imaginaria ajudando a cuidar de crianças menores e ensinando-as sobre Jesus.',
    ],
  },
  G: {
    title: 'Área G: O Pé que Lidera',
    subtitle: 'Liderança e Iniciativa',
    questions: [
      'Eu sinto facilidade em influenciar meus amigos a participarem de algo bom.',
      'Eu gosto de pensar no futuro do nosso grupo e sugerir metas ou projetos novos.',
      'Eu não tenho medo de assumir a responsabilidade por um projeto ou equipe.',
    ],
  },
};

const scoreOptions = [
  { value: 1, label: '1 – Nunca (nada a ver comigo)' },
  { value: 2, label: '2 – Raramente' },
  { value: 3, label: '3 – Às vezes' },
  { value: 4, label: '4 – Frequentemente' },
  { value: 5, label: '5 – Sempre (sou eu com certeza!)' },
];

export function PerfilForm({ onSubmit }: PerfilFormProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleAnswer = (questionKey: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }));
    setTouched((prev) => ({ ...prev, [questionKey]: true }));
  };

  const calculateScores = (): AreaScores => {
    const scores: AreaScores = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0 };
    Object.entries(answers).forEach(([key, value]) => {
      const area = key.split('-')[0] as keyof AreaScores;
      scores[area] += value;
    });
    return scores;
  };

  const allAreasComplete = () =>
    Object.keys(areaQuestions).every((areaKey) => {
      const total =
        areaQuestions[areaKey as keyof typeof areaQuestions].questions.length;
      return (
        Object.keys(answers).filter((k) => k.startsWith(areaKey)).length ===
        total
      );
    });

  const handleSubmit = () => {
    const allKeys = Object.keys(areaQuestions).flatMap((areaKey) =>
      areaQuestions[areaKey as keyof typeof areaQuestions].questions.map(
        (_, i) => `${areaKey}-${i}`,
      ),
    );
    const newTouched: Record<string, boolean> = {};
    allKeys.forEach((k) => (newTouched[k] = true));
    setTouched(newTouched);

    if (!allAreasComplete()) {
      alert('Por favor, responda todas as perguntas antes de continuar.');
      return;
    }
    onSubmit(calculateScores());
  };

  const totalAnswered = Object.keys(answers).length;

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-2">
          <span>⛪</span>
          <span>Teste Vocacional</span>
        </div>
        <h1 className="text-xl font-black tracking-tight">
          Descubra Seu Perfil de Serviço
        </h1>
        <p className="text-muted-foreground text-xs max-w-md mx-auto">
          Responda as perguntas abaixo para descobrir onde você pode servir
          melhor no ministério.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-card border border-border rounded-xl p-3">
        <div className="flex justify-between items-center text-xs text-muted-foreground mb-1.5">
          <span>Progresso</span>
          <span>{totalAnswered} / 21</span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${(totalAnswered / 21) * 100}%` }}
          />
        </div>
      </div>

      {/* Areas - sem o badge de perfil agora */}
      {Object.entries(areaQuestions).map(([areaKey, area]) => (
        <div
          key={areaKey}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          {/* Area header - sem o perfil */}
          <div className="px-4 py-3 border-b border-border bg-muted/20">
            <p className="text-xs font-semibold text-foreground">
              {area.title}
            </p>
            <p className="text-xs text-muted-foreground">{area.subtitle}</p>
          </div>

          {/* Questions */}
          <div className="divide-y divide-border">
            {area.questions.map((question, qIdx) => {
              const questionKey = `${areaKey}-${qIdx}`;
              const hasError = touched[questionKey] && !answers[questionKey];

              return (
                <div key={qIdx} className="px-4 py-3 space-y-1.5">
                  <label
                    htmlFor={questionKey}
                    className="block text-xs leading-relaxed text-foreground"
                  >
                    {qIdx + 1}. {question}
                  </label>

                  <select
                    id={questionKey}
                    value={answers[questionKey] ?? ''}
                    onChange={(e) =>
                      handleAnswer(questionKey, Number(e.target.value))
                    }
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, [questionKey]: true }))
                    }
                    className={`
                      w-full rounded-lg px-3 py-2 text-xs bg-background border
                      transition-all duration-200 focus:outline-none focus:ring-2
                      cursor-pointer
                      ${
                        hasError
                          ? 'border-destructive/60 bg-destructive/5 focus:ring-destructive/30 focus:border-destructive'
                          : answers[questionKey]
                            ? 'border-primary/40 focus:ring-primary/40 focus:border-primary'
                            : 'border-border focus:ring-primary/40 focus:border-primary text-muted-foreground'
                      }
                    `}
                  >
                    <option value="" disabled>
                      Selecione uma resposta...
                    </option>
                    {scoreOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {hasError && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <span className="inline-flex w-3 h-3 rounded-full bg-destructive/20 items-center justify-center text-[10px] font-bold">
                        !
                      </span>
                      Por favor, selecione uma resposta.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Submit */}
      <div className="pb-2">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-sm"
        >
          Ver Meu Perfil →
        </button>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Todas as áreas precisam ser completamente respondidas para gerar seu
          resultado.
        </p>
      </div>
    </div>
  );
}
