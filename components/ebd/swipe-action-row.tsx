'use client';

import { useCallback } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from 'framer-motion';
import { cn } from '@/lib/utils';

const SWIPE_MAX = 100;
const COMMIT_OFFSET = 72;
const COMMIT_VELOCITY = 380;

export type SwipeSideAction = {
  label: string;
  icon: React.ReactNode;
  className: string;
  onCommit: () => void;
};

type SwipeActionRowProps = {
  children: React.ReactNode;
  onSwipeRight: SwipeSideAction;
  onSwipeLeft: SwipeSideAction;
  surfaceClassName?: string;
  className?: string;
};

export function SwipeActionRow({
  children,
  onSwipeRight,
  onSwipeLeft,
  surfaceClassName,
  className,
}: SwipeActionRowProps) {
  const x = useMotionValue(0);

  const rightHintOpacity = useTransform(x, [0, SWIPE_MAX], [0, 1]);
  const rightHintScale = useTransform(x, [0, SWIPE_MAX], [0.85, 1]);
  const leftHintOpacity = useTransform(x, [-SWIPE_MAX, 0], [1, 0]);
  const leftHintScale = useTransform(x, [-SWIPE_MAX, 0], [1, 0.85]);

  const snapBack = useCallback(() => {
    animate(x, 0, { type: 'spring', stiffness: 520, damping: 36 });
  }, [x]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const offset = x.get();
    const vx = info.velocity.x;

    if (offset > COMMIT_OFFSET || vx > COMMIT_VELOCITY) {
      onSwipeRight.onCommit();
      snapBack();
      return;
    }
    if (offset < -COMMIT_OFFSET || vx < -COMMIT_VELOCITY) {
      onSwipeLeft.onCommit();
      snapBack();
      return;
    }
    snapBack();
  };

  return (
    <div className={cn('relative overflow-hidden touch-pan-y', className)}>
      <div className="absolute inset-0 flex pointer-events-none select-none">
        <motion.div
          style={{ opacity: rightHintOpacity, scale: rightHintScale }}
          className={cn(
            'flex flex-1 items-center justify-start gap-1.5 pl-4 text-xs font-semibold text-white',
            onSwipeRight.className,
          )}
        >
          {onSwipeRight.icon}
          <span>{onSwipeRight.label}</span>
        </motion.div>
        <motion.div
          style={{ opacity: leftHintOpacity, scale: leftHintScale }}
          className={cn(
            'flex flex-1 items-center justify-end gap-1.5 pr-4 text-xs font-semibold text-white',
            onSwipeLeft.className,
          )}
        >
          <span>{onSwipeLeft.label}</span>
          {onSwipeLeft.icon}
        </motion.div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -SWIPE_MAX, right: SWIPE_MAX }}
        dragElastic={0.12}
        style={{ x }}
        onDragEnd={handleDragEnd}
        className={cn('relative z-10 bg-card shadow-sm', surfaceClassName)}
      >
        {children}
      </motion.div>
    </div>
  );
}
