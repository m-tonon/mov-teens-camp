import { z } from 'zod';

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createStudentSchema = z.object({
  fullName: z.string().trim().min(1, 'Nome completo é obrigatório'),
  age: z
    .number()
    .int()
    .min(0)
    .max(99)
    .optional()
    .nullable()
    .transform((v) => (v === null ? undefined : v)),
});

export const updateStudentSchema = createStudentSchema.partial();

export const attendanceBulkSchema = z.object({
  date: z.string().regex(isoDateRegex, 'Data inválida'),
  records: z
    .array(
      z.object({
        studentId: z.string().min(1),
        status: z.enum(['present', 'absent']),
      }),
    )
    .min(1),
});

export const reportQuerySchema = z
  .object({
    start: z.string().regex(isoDateRegex).optional(),
    end: z.string().regex(isoDateRegex).optional(),
    month: z.literal('current').optional(),
  })
  .refine(
    (data) => {
      if (data.month === 'current') return true;
      return Boolean(data.start && data.end);
    },
    { message: 'Informe start e end ou month=current' },
  )
  .refine(
    (data) => {
      if (!data.start || !data.end) return true;
      return data.start <= data.end;
    },
    { message: 'Data inicial deve ser anterior ou igual à final' },
  );

export const attendanceDateQuerySchema = z.object({
  date: z.string().regex(isoDateRegex, 'Data inválida'),
});
