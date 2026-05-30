import mongoose from 'mongoose';

const WordSubmissionSchema = new mongoose.Schema(
  {
    word: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const WordSubmissionModel =
  mongoose.models.WordSubmission ||
  mongoose.model('WordSubmission', WordSubmissionSchema);
