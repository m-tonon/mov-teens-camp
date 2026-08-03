export type AttendanceStatus = 'present' | 'absent';

export interface EbdStudentDto {
  _id: string;
  fullName: string;
  age?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceRecordInput {
  studentId: string;
  status: AttendanceStatus;
}

export interface AttendanceRollCallRow {
  studentId: string;
  fullName: string;
  age?: number;
  status: AttendanceStatus;
}

/** Grid report: one column per class day in range, plus frequency. */
export interface AttendanceMatrixReportRow {
  studentId: string;
  fullName: string;
  days: Record<string, AttendanceStatus | null>;
  present: number;
  absent: number;
  attendancePct: number;
}
