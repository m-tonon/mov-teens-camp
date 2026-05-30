import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose-connection';
import { normalizeWord } from '@/lib/deepfake/parse-words';
import { WordSubmissionModel } from '@/shared/models/word-submission.model';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { word } = await req.json();

    const normalized = normalizeWord(typeof word === 'string' ? word : '');
    if (!normalized) {
      return NextResponse.json(
        { error: 'Digite uma palavra válida (2–30 caracteres)' },
        { status: 400 },
      );
    }

    await WordSubmissionModel.create({ word: normalized });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Word submission error:', error);
    return NextResponse.json({ error: 'Erro ao salvar palavra' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const submissions = await WordSubmissionModel.find()
      .sort({ createdAt: 1 })
      .lean();

    const words = submissions.map((s) => s.word);
    const unique = new Set(words.map((w) => w.toLocaleLowerCase('pt-BR'))).size;

    return NextResponse.json({
      submissions: submissions.map((s) => ({
        word: s.word,
        createdAt: s.createdAt,
      })),
      words,
      total: words.length,
      unique,
    });
  } catch (error) {
    console.error('Word fetch error:', error);
    return NextResponse.json({ error: 'Erro ao buscar palavras' }, { status: 500 });
  }
}
