'use client';

import { Input } from '@/components/ui/input';
import { sanitizeAgeDigitsInput } from '@/lib/ebd/age-input';
import { cn } from '@/lib/utils';

type EbdAgeInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'type' | 'inputMode' | 'maxLength' | 'onChange' | 'value'
> & {
  value: string;
  onValueChange: (value: string) => void;
};

export function EbdAgeInput({
  value,
  onValueChange,
  className,
  ...props
}: EbdAgeInputProps) {
  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={2}
      autoComplete="off"
      placeholder="—"
      value={value}
      onChange={(e) => onValueChange(sanitizeAgeDigitsInput(e.target.value))}
      className={cn('tabular-nums', className)}
      aria-describedby={props['aria-describedby']}
    />
  );
}
