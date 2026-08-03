import { NextRequest, NextResponse } from 'next/server';
import dotenv from 'dotenv';
import { connectToDatabase } from '@/lib/mongoose-connection';
import { RegistrationModel } from '@/shared/models/registration.model';
import nodemailer from 'nodemailer';
import { confirmationTemplate } from '@/lib/confirmation-email-template';
import juice from 'juice';

dotenv.config();

const GMAIL_USER = process.env.GMAIL_USER!;
const GMAIL_APP_PASS = process.env.GMAIL_APP_PASS!;
const ADMIN_PASS = process.env.ADMIN_PASS!;

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { id, password, confirmed } = await req.json();

    if (!id || !password) {
      return NextResponse.json(
        { error: 'ID e senha são obrigatórios' },
        { status: 400 },
      );
    }

    if (password !== ADMIN_PASS) {
      return NextResponse.json(
        { error: 'Senha de autorização inválida' },
        { status: 401 },
      );
    }

    const targetStatus = confirmed !== false; // defaults to true unless explicitly false

    // Update main registration
    const mainRegistration = await RegistrationModel.findByIdAndUpdate(
      id,
      { $set: { 'payment.paymentConfirmed': targetStatus } },
      { new: true },
    );

    if (!mainRegistration) {
      return NextResponse.json(
        { error: 'Inscrição não encontrada' },
        { status: 404 },
      );
    }

    // If this is a suite registration, also sync the partner
    if (
      mainRegistration.isSuiteRegistration &&
      mainRegistration.suitePartnerId
    ) {
      await RegistrationModel.findByIdAndUpdate(
        mainRegistration.suitePartnerId,
        { $set: { 'payment.paymentConfirmed': targetStatus } },
      );
      console.log(
        `Suite partner registration payment status updated to ${targetStatus}: ${mainRegistration.suitePartnerId}`,
      );
    }

    // Send confirmation email to main registrant if marking as confirmed
    if (targetStatus) {
      const participant = {
        name: mainRegistration.name,
        email: mainRegistration.responsibleInfo?.email,
      };

      if (participant.email) {
        await sendConfirmationEmail(
          participant,
          mainRegistration.isSuiteRegistration,
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: targetStatus
        ? 'Inscrição confirmada com sucesso'
        : 'Inscrição marcada como pendente com sucesso',
    });
  } catch (error: any) {
    console.error('Error updating registration payment status manually:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar status da inscrição' },
      { status: 500 },
    );
  }
}

async function sendConfirmationEmail(
  participant: { name: string; email: string },
  isSuite: boolean,
) {
  const emailContent = confirmationTemplate
    .replace('{{nomeParticipante}}', participant.name)
    .replace(
      '{{additionalInfo}}',
      isSuite
        ? '<p>Inscrição confirmada para suíte (2 pessoas).</p>'
        : '<p>Inscrição individual confirmada.</p>',
    );

  const html = juice(emailContent);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"IPVO MovTeens" <${GMAIL_USER}>`,
      to: participant.email,
      subject: '✅ Inscrição confirmada no Acampa Deep Fake!',
      html,
    });
    console.log(`Confirmation email sent to ${participant.email}`);
  } catch (emailError) {
    console.error('Failed to send confirmation email:', emailError);
  }
}
