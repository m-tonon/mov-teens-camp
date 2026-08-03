'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Download, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import type { AttendanceMatrixReportRow } from '@/shared/ebd.interface';
import {
  attendanceCellLabel,
  formatReportDayHeader,
} from '@/lib/ebd/report-utils';
import { cn } from '@/lib/utils';
import { formatIsoDatePtBr } from '@/lib/ebd/date-format';
import { EbdDatePicker } from '@/components/ebd/ebd-date-picker';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function monthRangeIso(): { start: string; end: string } {
  const now = new Date();
  return {
    start: format(startOfMonth(now), 'yyyy-MM-dd'),
    end: format(endOfMonth(now), 'yyyy-MM-dd'),
  };
}

function cellClass(status: 'present' | 'absent' | null | undefined): string {
  if (status === 'present') {
    return 'text-primary font-semibold';
  }
  if (status === 'absent') {
    return 'text-destructive font-medium';
  }
  return 'text-muted-foreground';
}

export function ReportsSection() {
  const initial = monthRangeIso();
  const [start, setStart] = useState(initial.start);
  const [end, setEnd] = useState(initial.end);
  const [dates, setDates] = useState<string[]>([]);
  const [rows, setRows] = useState<AttendanceMatrixReportRow[]>([]);
  const [reportStart, setReportStart] = useState<string | null>(null);
  const [reportEnd, setReportEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const fetchReport = async (params: URLSearchParams) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ebd/reports?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao gerar relatório.');
      }
      setDates(data.dates ?? []);
      setRows(data.rows ?? []);
      setReportStart(data.start);
      setReportEnd(data.end);
      setHasGenerated(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro no relatório.');
    } finally {
      setLoading(false);
    }
  };

  const currentMonth = monthRangeIso();
  const isCurrentMonthRange =
    start === currentMonth.start && end === currentMonth.end;
  const canUseCurrentMonth = !isCurrentMonthRange && !loading;

  const handleCurrentMonth = () => {
    const range = monthRangeIso();
    setStart(range.start);
    setEnd(range.end);
  };

  const handleGenerate = () => {
    if (!start || !end) {
      toast.error('Informe as datas de início e fim.');
      return;
    }
    if (start > end) {
      toast.error('A data inicial deve ser anterior ou igual à final.');
      return;
    }
    void fetchReport(new URLSearchParams({ start, end }));
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (reportStart && reportEnd) {
      params.set('start', reportStart);
      params.set('end', reportEnd);
    } else {
      params.set('start', start);
      params.set('end', end);
    }
    params.set('csv', '1');
    window.open(`/api/ebd/reports?${params.toString()}`, '_blank');
  };

  const reportTable = (
    <div className="rounded-xl border border-border overflow-x-auto" aria-busy={loading}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-10 bg-card min-w-[140px]">
              Nome
            </TableHead>
            {dates.map((d) => (
              <TableHead
                key={d}
                className="text-center min-w-[3rem] px-2 text-xs whitespace-nowrap"
                title={d}
              >
                {formatReportDayHeader(d)}
              </TableHead>
            ))}
            <TableHead className="text-right min-w-[5rem] sticky right-0 z-10 bg-card">
              Frequência
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.studentId}>
              <TableCell className="sticky left-0 z-10 bg-card font-medium">
                {row.fullName}
              </TableCell>
              {dates.map((d) => {
                const status = row.days[d];
                return (
                  <TableCell
                    key={d}
                    className={`text-center px-2 tabular-nums ${cellClass(status)}`}
                    title={
                      status === 'present'
                        ? 'Presente'
                        : status === 'absent'
                          ? 'Ausente'
                          : 'Sem registro'
                    }
                  >
                    {attendanceCellLabel(status)}
                  </TableCell>
                );
              })}
              <TableCell className="text-right font-semibold sticky right-0 z-10 bg-card tabular-nums">
                {row.attendancePct.toFixed(1)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-[10px] text-muted-foreground px-3 py-2 border-t border-border">
        P = presente · A = ausente · — = sem chamada nesse dia
      </p>
    </div>
  );

  return (
    <Card className="border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="px-0 sm:px-6 pt-0 sm:pt-6">
        <CardTitle className="text-lg font-black tracking-tight">
          Relatórios
        </CardTitle>
        <CardDescription>
          Presença por dia de aula no período e frequência no final.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-0 sm:px-6 pb-0 sm:pb-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
          <div className="space-y-2">
            <Label htmlFor="report-start">Início</Label>
            <EbdDatePicker
              id="report-start"
              value={start}
              onChange={setStart}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-end">Fim</Label>
            <EbdDatePicker
              id="report-end"
              value={end}
              onChange={setEnd}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className={cn(
              'transition-colors duration-200 w-full min-h-11',
              canUseCurrentMonth
                ? 'cursor-pointer border-amber-500 bg-amber-400 text-amber-950 hover:bg-amber-300 shadow-md font-semibold dark:bg-amber-500 dark:text-amber-950 dark:hover:bg-amber-400'
                : 'cursor-default opacity-50 text-muted-foreground',
            )}
            disabled={!canUseCurrentMonth}
            onClick={handleCurrentMonth}
            title={
              isCurrentMonthRange
                ? 'O período já é o mês atual'
                : 'Restaurar início e fim para o mês atual'
            }
          >
            <FileSpreadsheet className="size-4" />
            Mês atual
          </Button>
          <Button
            type="button"
            className="cursor-pointer transition-colors duration-200 w-full min-h-11"
            disabled={loading}
            onClick={handleGenerate}
          >
            {loading ? 'Gerando…' : 'Gerar relatório'}
          </Button>
        </div>

        {hasGenerated ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                {reportStart && reportEnd
                  ? `Período: ${formatIsoDatePtBr(reportStart)} a ${formatIsoDatePtBr(reportEnd)}`
                  : null}
                {dates.length > 0
                  ? ` · ${dates.length} dia(s) com chamada`
                  : null}
              </p>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer w-full sm:w-auto min-h-10"
                disabled={loading}
                onClick={handleExportCsv}
              >
                <Download className="size-4" />
                Exportar CSV
              </Button>
            </div>
            {dates.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border rounded-xl">
                Nenhuma chamada salva neste período.
              </p>
            ) : (
              reportTable
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border rounded-xl">
            {loading
              ? 'Gerando relatório…'
              : 'Defina o período e clique em Gerar relatório.'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
