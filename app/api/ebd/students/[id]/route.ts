import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongoose-connection';
import { EbdStudentModel } from '@/shared/models/ebd-student.model';
import { EbdAttendanceModel } from '@/shared/models/ebd-attendance.model';
import { updateStudentSchema } from '@/lib/validation/ebd-schema';
import { toEbdStudentDto } from '@/lib/ebd/student-api';
import { parseOptionalAge } from '@/lib/ebd/age-input';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: RouteContext) {
  await connectToDatabase();
  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid student id' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const parsed = updateStudentSchema.safeParse({
      fullName: body.fullName,
      age: parseOptionalAge(body.age),
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const setFields: Record<string, unknown> = {};
    const unsetFields: Record<string, 1> = {};

    if (parsed.data.fullName !== undefined) {
      setFields.fullName = parsed.data.fullName;
    }
    if (body.age === '' || body.age === null) {
      unsetFields.age = 1;
    } else if (parsed.data.age !== undefined) {
      setFields.age = parsed.data.age;
    }

    if (
      Object.keys(setFields).length === 0 &&
      Object.keys(unsetFields).length === 0
    ) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 },
      );
    }

    const updateQuery: {
      $set?: Record<string, unknown>;
      $unset?: Record<string, 1>;
    } = {};
    if (Object.keys(setFields).length > 0) updateQuery.$set = setFields;
    if (Object.keys(unsetFields).length > 0) updateQuery.$unset = unsetFields;

    const updated = await EbdStudentModel.findByIdAndUpdate(id, updateQuery, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json(toEbdStudentDto(updated));
  } catch (error) {
    console.error('PATCH /api/ebd/students/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  await connectToDatabase();
  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid student id' }, { status: 400 });
  }

  try {
    const deleted = await EbdStudentModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    await EbdAttendanceModel.deleteMany({
      studentId: new mongoose.Types.ObjectId(id),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/ebd/students/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 },
    );
  }
}
