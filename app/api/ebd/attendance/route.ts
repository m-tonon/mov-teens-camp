import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongoose-connection';
import { EbdStudentModel } from '@/shared/models/ebd-student.model';
import { EbdAttendanceModel } from '@/shared/models/ebd-attendance.model';
import {
  attendanceBulkSchema,
  attendanceDateQuerySchema,
} from '@/lib/validation/ebd-schema';
import type {
  AttendanceRollCallRow,
  AttendanceStatus,
} from '@/shared/ebd.interface';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const date = req.nextUrl.searchParams.get('date');
  const parsed = attendanceDateQuerySchema.safeParse({ date });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
  }

  try {
    const students = await EbdStudentModel.find()
      .collation({ locale: 'pt', strength: 2 })
      .sort({ fullName: 1 })
      .lean();

    const records = await EbdAttendanceModel.find({
      date: parsed.data.date,
    }).lean();

    const statusByStudent = new Map<string, AttendanceStatus>();
    for (const r of records) {
      statusByStudent.set(
        r.studentId.toString(),
        r.status as AttendanceStatus,
      );
    }

    const rows: AttendanceRollCallRow[] = students.map((s) => ({
      studentId: s._id.toString(),
      fullName: s.fullName,
      age: s.age,
      status: statusByStudent.get(s._id.toString()) ?? 'absent',
    }));

    return NextResponse.json({
      date: parsed.data.date,
      rows,
      hasSavedAttendance: records.length > 0,
    });
  } catch (error) {
    console.error('GET /api/ebd/attendance:', error);
    return NextResponse.json(
      { error: 'Failed to load attendance' },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const parsed = attendanceBulkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { date, records } = parsed.data;
    const ops = records.map((rec) => {
      if (!mongoose.Types.ObjectId.isValid(rec.studentId)) {
        throw new Error(`Invalid studentId: ${rec.studentId}`);
      }
      return {
        updateOne: {
          filter: {
            studentId: new mongoose.Types.ObjectId(rec.studentId),
            date,
          },
          update: {
            $set: { status: rec.status },
            $setOnInsert: {
              studentId: new mongoose.Types.ObjectId(rec.studentId),
              date,
            },
          },
          upsert: true,
        },
      };
    });

    await EbdAttendanceModel.bulkWrite(ops);
    return NextResponse.json({ success: true, date });
  } catch (error) {
    console.error('PUT /api/ebd/attendance:', error);
    return NextResponse.json(
      { error: 'Failed to save attendance' },
      { status: 500 },
    );
  }
}
