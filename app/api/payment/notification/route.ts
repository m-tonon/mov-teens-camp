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

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    console.log('Payment notification received:', body);

    const charge = body.charges?.[0];
    if (!charge || charge.status !== 'PAID') {
      console.log('No paid charge to process.');
      return NextResponse.json({
        message: 'No payment confirmation to process',
      });
    }

    const referenceId = charge.reference_id;
    if (!referenceId) {
      return NextResponse.json(
        { error: 'Missing referenceId' },
        { status: 400 },
      );
    }

    // Update main registration
    const mainRegistration = await RegistrationModel.findOneAndUpdate(
      { 'payment.referenceId': referenceId },
      { $set: { 'payment.paymentConfirmed': true } },
      { returnDocument: 'after' },
    );

    if (!mainRegistration) {
      console.warn(`No registration found for referenceId: ${referenceId}`);
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 },
      );
    }

    // If this is a suite registration, also mark the partner as paid
    if (
      mainRegistration.isSuiteRegistration &&
      mainRegistration.suitePartnerId
    ) {
      await RegistrationModel.findByIdAndUpdate(
        mainRegistration.suitePartnerId,
        { $set: { 'payment.paymentConfirmed': true } },
      );
      console.log(
        `Suite partner registration marked as paid: ${mainRegistration.suitePartnerId}`,
      );
    }

    // Send confirmation email to main registrant
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

    console.log(`Payment confirmed and MongoDB updated for ${referenceId}`);
    return NextResponse.json({ message: 'Payment handled successfully' });
  } catch (error) {
    console.error('Error handling payment notification:', error);
    return NextResponse.json(
      { error: 'Error updating payment status' },
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
      subject: '✅ Inscrição confirmada no 3º Acampa Teens!',
      html,
    });
    console.log(`Confirmation email sent to ${participant.email}`);
  } catch (emailError) {
    console.error('Failed to send confirmation email:', emailError);
  }
}
