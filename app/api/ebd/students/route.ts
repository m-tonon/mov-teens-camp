import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose-connection';
import { EbdStudentModel } from '@/shared/models/ebd-student.model';
import { createStudentSchema } from '@/lib/validation/ebd-schema';
import { toEbdStudentDto } from '@/lib/ebd/student-api';
import { parseOptionalAge } from '@/lib/ebd/age-input';

export async function GET() {
  await connectToDatabase();
  try {
    const students = await EbdStudentModel.find()
      .collation({ locale: 'pt', strength: 2 })
      .sort({ fullName: 1 })
      .lean();
    return NextResponse.json(students.map((s) => toEbdStudentDto(s as never)));
  } catch (error) {
    console.error('GET /api/ebd/students:', error);
    return NextResponse.json(
      { error: 'Failed to load students' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const parsed = createStudentSchema.safeParse({
      fullName: body.fullName,
      age: parseOptionalAge(body.age),
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const { fullName, age } = parsed.data;
    const created = await EbdStudentModel.create({
      fullName,
      ...(age !== undefined ? { age } : {}),
    });
    return NextResponse.json(toEbdStudentDto(created), { status: 201 });
  } catch (error) {
    console.error('POST /api/ebd/students:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 },
    );
  }
}
