'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CLOUD_FONT,
  CLOUD_FONT_WEIGHT,
  getCloudDimensions,
} from '@/lib/deepfake/constants';
import {
  buildWordCloudLayout,
  type WordCloudItem,
} from '@/lib/deepfake/word-cloud-layout';

type Generation = {
  seed: string;
  words: string[];
};

type WordCloudDisplayProps = {
  generation: Generation | null;
  isGenerating?: boolean;
  onLayoutReady?: () => void;
};

export function WordCloudDisplay({
  generation,
  isGenerating = false,
  onLayoutReady,
}: WordCloudDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(320);
  const [layout, setLayout] = useState<WordCloudItem[]>([]);
  const [localLoading, setLocalLoading] = useState(false);

  const { width, height } = getCloudDimensions(
    containerWidth,
    generation?.words.length ?? 10,
  );
  const isEmpty = !generation;
  const showLoading = isGenerating || localLoading;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      setContainerWidth(el.clientWidth);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!generation) {
      setLayout([]);
      return;
    }

    let cancelled = false;
    setLocalLoading(true);

    buildWordCloudLayout(generation.words, generation.seed, containerWidth)
      .then((result) => {
        if (!cancelled) {
          setLayout(result);
          onLayoutReady?.();
        }
      })
      .finally(() => {
        if (!cancelled) setLocalLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [generation, containerWidth, onLayoutReady]);

  return (
    <section
      aria-label="Nuvem de palavras"
      className="rounded-2xl border border-border bg-white px-2 py-4 sm:px-4"
    >
      <div ref={containerRef} className="w-full">
        {showLoading ? (
          <div
            className="flex items-center justify-center text-sm text-muted-foreground"
            style={{ height }}
          >
            Gerando nuvem...
          </div>
        ) : isEmpty ? (
          <div
            className="flex items-center justify-center px-4 text-center text-sm text-muted-foreground"
            style={{ height }}
          >
            Suas palavras aparecerão aqui depois de clicar em{' '}
            <strong className="mx-1">Gerar nuvem</strong>.
          </div>
        ) : (
          <div
            key={`${generation.seed}-${width}`}
            className="relative mx-auto"
            style={{ width, height, maxWidth: '100%' }}
          >
            {layout.map((item, i) => (
              <motion.span
                key={`${generation.seed}-${item.text}-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02, duration: 0.25 }}
                style={{
                  position: 'absolute',
                  left: width / 2 + item.x,
                  top: height / 2 + item.y,
                  fontSize: item.fontSize,
                  color: item.color,
                  transform: 'translate(-50%, -50%)',
                  fontFamily: `${CLOUD_FONT}, Helvetica, sans-serif`,
                  fontWeight: CLOUD_FONT_WEIGHT,
                  lineHeight: 1.1,
                  whiteSpace: 'nowrap',
                  letterSpacing: '-0.02em',
                }}
                className="select-none"
              >
                {item.text}
              </motion.span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
