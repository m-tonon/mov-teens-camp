'use client';

import { useState } from 'react';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import {
  formatIsoDatePtBr,
  isoStringToLocalDate,
  localDateToIso,
} from '@/lib/ebd/date-format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Props = {
  id?: string;
  value: string;
  onChange: (iso: string) => void;
  className?: string;
};

export function EbdDatePicker({
  id,
  value,
  onChange,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const selected = isoStringToLocalDate(value);
  const label = value ? formatIsoDatePtBr(value) : 'Selecione a data';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          className={cn(
            'w-full justify-start gap-2 font-normal tabular-nums h-11 cursor-pointer',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
          <span>{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={ptBR}
          weekStartsOn={0}
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            if (!date) return;
            onChange(localDateToIso(date));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
