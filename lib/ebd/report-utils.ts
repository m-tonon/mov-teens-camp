import type {
  AttendanceMatrixReportRow,
  AttendanceStatus,
} from '@/shared/ebd.interface';
import { formatIsoDayMonthPtBr } from '@/lib/ebd/date-format';

type StudentLean = { _id: { toString(): string }; fullName: string };

type AttendanceLean = {
  studentId: { toString(): string };
  date: string;
  status: AttendanceStatus;
};

export function buildAttendanceMatrixReport(
  students: StudentLean[],
  attendanceInRange: AttendanceLean[],
): { dates: string[]; rows: AttendanceMatrixReportRow[] } {
  const dates = [...new Set(attendanceInRange.map((a) => a.date))].sort();

  const byStudentDate = new Map<string, Map<string, AttendanceStatus>>();
  for (const row of attendanceInRange) {
    const id = row.studentId.toString();
    if (!byStudentDate.has(id)) {
      byStudentDate.set(id, new Map());
    }
    byStudentDate.get(id)!.set(row.date, row.status);
  }

  const rows: AttendanceMatrixReportRow[] = students.map((s) => {
    const id = s._id.toString();
    const dayMap = byStudentDate.get(id);
    let present = 0;
    let absent = 0;
    const days: Record<string, AttendanceStatus | null> = {};

    for (const d of dates) {
      const status = dayMap?.get(d) ?? null;
      days[d] = status;
      if (status === 'present') present += 1;
      if (status === 'absent') absent += 1;
    }

    const totalClasses = present + absent;
    const attendancePct = totalClasses
      ? (present / totalClasses) * 100
      : 0;

    return {
      studentId: id,
      fullName: s.fullName,
      days,
      present,
      absent,
      attendancePct,
    };
  });

  rows.sort((a, b) => a.fullName.localeCompare(b.fullName, 'pt-BR'));

  return { dates, rows };
}

export function formatReportDayHeader(isoDate: string): string {
  return formatIsoDayMonthPtBr(isoDate);
}

export function attendanceCellLabel(
  status: AttendanceStatus | null | undefined,
): string {
  if (status === 'present') return 'P';
  if (status === 'absent') return 'A';
  return '—';
}
