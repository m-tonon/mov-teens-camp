import type { EbdStudentDto } from '@/shared/ebd.interface';

export function toEbdStudentDto(doc: {
  _id: { toString(): string };
  fullName: string;
  age?: number;
  createdAt?: Date;
  updatedAt?: Date;
}): EbdStudentDto {
  return {
    _id: doc._id.toString(),
    fullName: doc.fullName,
    age: doc.age,
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}
