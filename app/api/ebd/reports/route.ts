import { NextRequest, NextResponse } from 'next/server';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Parser } from 'json2csv';
import { connectToDatabase } from '@/lib/mongoose-connection';
import { EbdStudentModel } from '@/shared/models/ebd-student.model';
import { EbdAttendanceModel } from '@/shared/models/ebd-attendance.model';
import { reportQuerySchema } from '@/lib/validation/ebd-schema';
import {
  attendanceCellLabel,
  buildAttendanceMatrixReport,
  formatReportDayHeader,
} from '@/lib/ebd/report-utils';

function resolveDateRange(searchParams: URLSearchParams): {
  start: string;
  end: string;
} | null {
  const month = searchParams.get('month');
  if (month === 'current') {
    const now = new Date();
    return {
      start: format(startOfMonth(now), 'yyyy-MM-dd'),
      end: format(endOfMonth(now), 'yyyy-MM-dd'),
    };
  }
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  if (!start || !end) return null;
  return { start, end };
}

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const range = resolveDateRange(req.nextUrl.searchParams);
  const csvMode = req.nextUrl.searchParams.get('csv') === '1';

  const parsed = reportQuerySchema.safeParse({
    start: range?.start,
    end: range?.end,
    month: req.nextUrl.searchParams.get('month') ?? undefined,
  });

  if (!parsed.success || !range) {
    return NextResponse.json({ error: 'Invalid report query' }, { status: 400 });
  }

  const { start, end } = range;

  try {
    const students = await EbdStudentModel.find()
      .collation({ locale: 'pt', strength: 2 })
      .sort({ fullName: 1 })
      .lean();

    const attendance = await EbdAttendanceModel.find({
      date: { $gte: start, $lte: end },
    }).lean();

    const { dates, rows } = buildAttendanceMatrixReport(
      students as never,
      attendance as never,
    );

    if (csvMode) {
      const flat = rows.map((r) => {
        const row: Record<string, string> = {
          fullName: r.fullName,
        };
        for (const d of dates) {
          row[d] = attendanceCellLabel(r.days[d]);
        }
        row.frequencia = `${r.attendancePct.toFixed(1)}%`;
        return row;
      });
      const fields = [
        { label: 'Nome', value: 'fullName' },
        ...dates.map((d) => ({
          label: formatReportDayHeader(d),
          value: d,
        })),
        { label: 'Frequência', value: 'frequencia' },
      ];
      const csv = new Parser({ fields }).parse(flat);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="ebd-relatorio-${start}-${end}.csv"`,
        },
      });
    }

    return NextResponse.json({ start, end, dates, rows });
  } catch (error) {
    console.error('GET /api/ebd/reports:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 },
    );
  }
}
