import mongoose from 'mongoose';

const EbdAttendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EbdStudent',
      required: true,
    },
    date: { type: String, required: true },
    status: {
      type: String,
      enum: ['present', 'absent'],
      required: true,
    },
  },
  { timestamps: true },
);

EbdAttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

export const EbdAttendanceModel =
  mongoose.models.EbdAttendance ||
  mongoose.model('EbdAttendance', EbdAttendanceSchema, 'ebd-attendances');
