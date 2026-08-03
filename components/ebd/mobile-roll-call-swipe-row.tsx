'use client';

import { CheckCircle2, UserX } from 'lucide-react';
import type { AttendanceStatus } from '@/shared/ebd.interface';
import { SwipeActionRow } from '@/components/ebd/swipe-action-row';
import { cn } from '@/lib/utils';

type Props = {
  fullName: string;
  age?: number;
  status: AttendanceStatus;
  onSwipePresent: () => void;
  onSwipeAbsent: () => void;
};

export function MobileRollCallSwipeRow({
  fullName,
  age,
  status,
  onSwipePresent,
  onSwipeAbsent,
}: Props) {
  return (
    <SwipeActionRow
      className="rounded-xl border border-border"
      surfaceClassName={cn(
        'rounded-xl',
        status === 'present'
          ? 'border-l-4 border-l-green-600'
          : 'border-l-4 border-l-destructive',
      )}
      onSwipeRight={{
        label: 'Presente',
        icon: <CheckCircle2 className="size-4 shrink-0" strokeWidth={2} />,
        className: 'bg-green-600',
        onCommit: onSwipePresent,
      }}
      onSwipeLeft={{
        label: 'Ausente',
        icon: <UserX className="size-4 shrink-0" strokeWidth={2} />,
        className: 'bg-destructive',
        onCommit: onSwipeAbsent,
      }}
    >
      <div className="flex items-center gap-2.5 px-3.5 py-3 min-h-[3.5rem]">
        <div
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full transition-colors',
            status === 'present'
              ? 'bg-green-600/15 text-green-700 dark:text-green-500'
              : 'bg-destructive/15 text-destructive',
          )}
          aria-hidden
        >
          {status === 'present' ? (
            <CheckCircle2 className="size-3.5" strokeWidth={2} />
          ) : (
            <UserX className="size-3.5" strokeWidth={2} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug truncate">
            {fullName}
          </p>
          {age !== undefined && (
            <p className="text-xs text-muted-foreground">{age} anos</p>
          )}
        </div>
        <span
          className={cn(
            'text-[9px] font-semibold uppercase tracking-wide shrink-0',
            status === 'present'
              ? 'text-green-700 dark:text-green-500'
              : 'text-destructive',
          )}
        >
          {status === 'present' ? 'P' : 'A'}
        </span>
      </div>
    </SwipeActionRow>
  );
}
