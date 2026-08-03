'use client';

import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, CheckCircle2, Save, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type {
  AttendanceRollCallRow,
  AttendanceStatus,
  EbdStudentDto,
} from '@/shared/ebd.interface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

function todayIso(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function mergeStudentsIntoRows(
  students: EbdStudentDto[],
  rows: AttendanceRollCallRow[],
): AttendanceRollCallRow[] {
  const statusById = new Map(
    rows.map((r) => [r.studentId, r.status] as const),
  );
  return students.map((s) => ({
    studentId: s._id,
    fullName: s.fullName,
    age: s.age,
    status: statusById.get(s._id) ?? 'absent',
  }));
}

type Props = {
  students: EbdStudentDto[];
  studentsFetched: boolean;
};

export function RollCallSection({ students, studentsFetched }: Props) {
  const [date, setDate] = useState(todayIso);
  const [rows, setRows] = useState<AttendanceRollCallRow[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadAttendance = useCallback(async () => {
    setAttendanceLoading(true);
    try {
      const res = await fetch(
        `/api/ebd/attendance?date=${encodeURIComponent(date)}`,
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao carregar chamada.');
      }
      setRows(data.rows ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao carregar.');
      setRows([]);
    } finally {
      setAttendanceLoading(false);
    }
  }, [date]);

  useEffect(() => {
    void loadAttendance();
  }, [loadAttendance]);

  useEffect(() => {
    setRows((prev) => mergeStudentsIntoRows(students, prev));
  }, [students]);

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setRows((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r)),
    );
  };

  const handleSave = async () => {
    if (rows.length === 0) {
      toast.error('Cadastre alunos antes de salvar a chamada.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/ebd/attendance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          records: rows.map((r) => ({
            studentId: r.studentId,
            status: r.status,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao salvar presença.');
      }
      toast.success('Presença salva.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const canSave =
    !saving && students.length > 0 && rows.length > 0 && !attendanceLoading;

  return (
    <Card className="border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="px-0 sm:px-6 pt-0 sm:pt-6">
        <CardTitle className="text-lg font-black tracking-tight">
          Chamada
        </CardTitle>
        <CardDescription>
          Selecione presente ou ausente para cada aluno.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-0 sm:px-6 pb-0 sm:pb-6">
        <div className="space-y-2 md:max-w-xs">
          <Label htmlFor="ebd-roll-date" className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            Data
          </Label>
          <Input
            id="ebd-roll-date"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setRows(mergeStudentsIntoRows(students, []));
            }}
            className="w-full h-11 cursor-pointer"
          />
        </div>

        {!studentsFetched ? null : students.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border rounded-xl">
            Cadastre alunos na aba Cadastro para fazer a chamada.
          </p>
        ) : (
          <ul className="space-y-3 md:space-y-0 md:rounded-xl md:border md:border-border md:bg-card md:overflow-hidden md:shadow-sm">
            {rows.map((row) => (
              <li
                key={row.studentId}
                className={cn(
                  'rounded-xl border border-border px-4 py-3 bg-card space-y-3',
                  'md:rounded-none md:border-0 md:border-b md:last:border-b-0 md:bg-transparent',
                  'md:flex md:items-center md:justify-between md:gap-6 md:space-y-0 md:py-3.5 md:px-5',
                )}
              >
                <div className="min-w-0 md:flex-1">
                  <p className="text-base font-medium leading-snug md:text-[0.9375rem]">
                    {row.fullName}
                  </p>
                  {row.age !== undefined && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {row.age} anos
                    </p>
                  )}
                </div>
                <div
                  className={cn(
                    'grid grid-cols-2 gap-2',
                    'md:inline-grid md:grid-cols-2 md:gap-0 md:shrink-0',
                    'md:rounded-lg md:border md:border-border md:bg-muted/40 md:p-1',
                  )}
                  role="group"
                  aria-label={`Presença de ${row.fullName}`}
                >
                  <Button
                    type="button"
                    variant={
                      row.status === 'present' ? 'default' : 'outline'
                    }
                    size="sm"
                    className={cn(
                      'cursor-pointer transition-all duration-200 min-h-11 w-full',
                      'md:min-h-9 md:min-w-[7.75rem] md:rounded-md md:border-0 md:font-medium',
                      row.status === 'present'
                        ? 'md:shadow-sm'
                        : 'md:bg-transparent md:text-muted-foreground md:hover:bg-background/70 md:hover:text-foreground',
                    )}
                    onClick={() => setStatus(row.studentId, 'present')}
                  >
                    <CheckCircle2 className="size-4 shrink-0" />
                    Presente
                  </Button>
                  <Button
                    type="button"
                    variant={
                      row.status === 'absent' ? 'destructive' : 'outline'
                    }
                    size="sm"
                    className={cn(
                      'cursor-pointer transition-all duration-200 min-h-11 w-full',
                      'md:min-h-9 md:min-w-[7.75rem] md:rounded-md md:border-0 md:font-medium',
                      row.status === 'absent'
                        ? 'md:shadow-sm'
                        : 'md:bg-transparent md:text-muted-foreground md:hover:bg-background/70 md:hover:text-foreground',
                    )}
                    onClick={() => setStatus(row.studentId, 'absent')}
                  >
                    <XCircle className="size-4 shrink-0" />
                    Ausente
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="sticky bottom-0 z-10 -mx-4 px-4 py-3 bg-background/95 backdrop-blur-sm border-t border-border sm:static sm:mx-0 sm:px-0 sm:py-0 sm:border-0 sm:bg-transparent sm:backdrop-blur-none md:flex md:justify-end md:pt-2">
          <Button
            type="button"
            disabled={!canSave}
            onClick={() => void handleSave()}
            className="cursor-pointer transition-colors duration-200 w-full min-h-12 text-base md:w-auto md:min-w-[13rem] md:min-h-10 md:px-8 md:shadow-sm"
          >
            <Save className="size-4" />
            Salvar presença
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
