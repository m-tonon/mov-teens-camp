import mongoose from 'mongoose';

const EbdStudentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    age: { type: Number, min: 0, max: 99 },
  },
  { timestamps: true },
);

export const EbdStudentModel =
  mongoose.models.EbdStudent ||
  mongoose.model('EbdStudent', EbdStudentSchema, 'ebd-students');
