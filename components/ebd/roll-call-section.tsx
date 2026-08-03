'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Save,
  Users,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import type {
  AttendanceRollCallRow,
  AttendanceStatus,
  EbdStudentDto,
} from '@/shared/ebd.interface';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { formatIsoDatePtBr } from '@/lib/ebd/date-format';
import { EbdDatePicker } from '@/components/ebd/ebd-date-picker';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MobileRollCallSwipeRow } from '@/components/ebd/mobile-roll-call-swipe-row';

function todayIso(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function summaryFromRows(
  isoDate: string,
  rows: AttendanceRollCallRow[],
): DaySummary {
  return {
    date: isoDate,
    present: rows.filter((r) => r.status === 'present').length,
    absent: rows.filter((r) => r.status === 'absent').length,
  };
}

type DaySummary = {
  date: string;
  present: number;
  absent: number;
};

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
  const [daySummary, setDaySummary] = useState<DaySummary | null>(null);
  const [forceEditDate, setForceEditDate] = useState<string | null>(null);
  const studentsRef = useRef(students);
  studentsRef.current = students;

  const loadAttendance = useCallback(async () => {
    if (!studentsFetched) return;

    setAttendanceLoading(true);
    try {
      const res = await fetch(
        `/api/ebd/attendance?date=${encodeURIComponent(date)}`,
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao carregar chamada.');
      }
      const loadedRows = (data.rows ?? []) as AttendanceRollCallRow[];
      const merged = mergeStudentsIntoRows(studentsRef.current, loadedRows);
      setRows(merged);

      const hasSaved = Boolean(data.hasSavedAttendance);
      if (hasSaved) {
        setDaySummary(summaryFromRows(date, merged));
      } else {
        setDaySummary(null);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao carregar.');
      setRows([]);
      setDaySummary(null);
    } finally {
      setAttendanceLoading(false);
    }
  }, [date, studentsFetched]);

  useEffect(() => {
    void loadAttendance();
  }, [loadAttendance]);

  useEffect(() => {
    if (!studentsFetched || attendanceLoading) return;
    setRows((prev) => {
      if (prev.length === 0) return prev;
      return mergeStudentsIntoRows(students, prev);
    });
  }, [students, studentsFetched, attendanceLoading]);

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
      setForceEditDate(null);
      setDaySummary(summaryFromRows(date, rows));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const canSave =
    !saving && students.length > 0 && rows.length > 0 && !attendanceLoading;

  const showingSummary =
    daySummary !== null &&
    daySummary.date === date &&
    students.length > 0 &&
    forceEditDate !== date;

  const rollCallReady =
    studentsFetched && !(attendanceLoading && rows.length === 0);

  const openEditorForCurrentDay = () => {
    setForceEditDate(date);
  };

  return (
    <Card className="border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="px-0 sm:px-6 pt-0 sm:pt-6">
        <CardTitle className="text-lg font-black tracking-tight">
          Chamada
        </CardTitle>
        <CardDescription className="md:block">
          <span className="hidden md:inline">
            Selecione presente ou ausente para cada aluno.
          </span>
          <span className="md:hidden">
          Deslize o nome para a direita para confirmar presença ou para a esquerda para marcar ausência.
          </span>
        </CardDescription>
      </CardHeader> 
      <CardContent className="space-y-4 px-0 sm:px-6 pb-0 sm:pb-6">
        <div className="space-y-2 md:max-w-xs">
          <Label htmlFor="ebd-roll-date" className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            Data
          </Label>
          <EbdDatePicker
            id="ebd-roll-date"
            value={date}
            onChange={(iso) => {
              setForceEditDate(null);
              setRows([]);
              setDaySummary(null);
              setDate(iso);
            }}
          />
        </div>

        {!rollCallReady ? null : students.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border rounded-xl">
            Cadastre alunos na aba Cadastro para fazer a chamada.
          </p>
        ) : showingSummary ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={openEditorForCurrentDay}
              className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-left shadow-sm hover:bg-muted/30 transition-colors duration-200 cursor-pointer flex items-center gap-3 min-h-[4rem]"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-600/15 text-green-700 dark:text-green-500">
                <Users className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Chamada · {formatIsoDatePtBr(daySummary.date)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <span className="text-green-700 dark:text-green-500 font-medium">
                    {daySummary.present} presente
                    {daySummary.present === 1 ? '' : 's'}
                  </span>
                  {' · '}
                  <span className="text-destructive font-medium">
                    {daySummary.absent} ausente
                    {daySummary.absent === 1 ? '' : 's'}
                  </span>
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Toque para editar esta data
                </p>
              </div>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
            </button>
            <p className="text-[10px] text-muted-foreground text-center md:text-left px-1">
              Escolha outra data acima para registrar ou alterar outro dia.
            </p>
          </div>
        ) : (
          <ul className="space-y-2 md:space-y-0 md:rounded-xl md:border md:border-border md:bg-card md:overflow-hidden md:shadow-sm">
            {rows.map((row) => (
              <li
                key={row.studentId}
                className={cn(
                  'md:rounded-none md:border-0 md:border-b md:last:border-b-0',
                  'md:flex md:items-center md:justify-between md:gap-6 md:space-y-0 md:py-3.5 md:px-5 md:bg-transparent',
                )}
              >
                <div className="md:hidden">
                  <MobileRollCallSwipeRow
                    fullName={row.fullName}
                    age={row.age}
                    status={row.status}
                    onSwipePresent={() => setStatus(row.studentId, 'present')}
                    onSwipeAbsent={() => setStatus(row.studentId, 'absent')}
                  />
                </div>

                <div className="hidden md:block min-w-0 md:flex-1">
                  <p className="text-base font-medium leading-snug md:text-lg">
                    {row.fullName}
                  </p>
                  {row.age !== undefined && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {row.age} anos
                    </p>
                  )}
                </div>

                <div
                  className={cn(
                    'hidden md:grid grid-cols-2 gap-2',
                    'md:inline-grid md:grid-cols-2 md:gap-0 md:shrink-0',
                    'md:rounded-lg md:border md:border-border md:bg-muted/40 md:p-1',
                  )}
                  role="group"
                  aria-label={`Presença de ${row.fullName}`}
                >
                  <Button
                    type="button"
                    variant={row.status === 'present' ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      'cursor-pointer transition-all duration-200 min-h-11 w-full',
                      'md:min-h-9 md:min-w-[7.75rem] md:rounded-md md:border-0 md:font-medium',
                      row.status === 'present'
                        ? 'bg-green-600 text-white hover:bg-green-700 md:shadow-sm'
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

        {!showingSummary ? (
          <div className="sticky bottom-0 z-10 -mx-4 px-4 py-3 bg-background/95 backdrop-blur-sm border-t border-border sm:static sm:mx-0 sm:px-0 sm:py-0 sm:border-0 sm:bg-transparent sm:backdrop-blur-none md:flex md:justify-end md:pt-2">
            <Button
              type="button"
              disabled={!canSave}
              onClick={() => void handleSave()}
              className="cursor-pointer transition-colors duration-200 w-full min-h-12 text-base md:w-auto md:min-w-[13rem] md:min-h-10 md:px-8 md:shadow-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="size-4" />
              Salvar presença
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
