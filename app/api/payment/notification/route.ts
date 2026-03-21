import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
import { connectToDatabase } from "@/lib/mongoose-connection";
import { RegistrationModel } from "@/shared/models/registration.model";
import nodemailer from "nodemailer";
import { confirmationTemplate } from "@/lib/confirmation-email-template";
import juice from "juice";

dotenv.config();

const GMAIL_USER = process.env.GMAIL_USER!;
const GMAIL_APP_PASS = process.env.GMAIL_APP_PASS!;

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    console.log("Payment notification received:", body);

    const charge = body.charges?.[0];
    if (!charge || charge.status !== "PAID") {
      console.log("No paid charge to process.");
      return NextResponse.json({
        message: "No payment confirmation to process",
      });
    }

    const referenceId = charge.reference_id;
    if (!referenceId) {
      return NextResponse.json(
        { error: "Missing referenceId" },
        { status: 400 },
      );
    }

    const updatedRegistration = await RegistrationModel.findOneAndUpdate(
      { "payment.referenceId": referenceId },
      { $set: { "payment.paymentConfirmed": true } },
      { returnDocument: "after" },
    );

    if (!updatedRegistration) {
      console.warn(`No registration found for referenceId: ${referenceId}`);
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 },
      );
    }

    const participant = {
      name: updatedRegistration.name,
      email: updatedRegistration.responsibleInfo?.email,
    };

    if (participant.email) {
      await sendConfirmationEmail(participant);
    } else {
      console.warn("No email found for participant", participant.name);
    }

    console.log(`Payment confirmed and MongoDB updated for ${referenceId}`);
    return NextResponse.json({ message: "Payment handled successfully" });
  } catch (error) {
    console.error("Error handling payment notification:", error);
    return NextResponse.json(
      { error: "Error updating payment status" },
      { status: 500 },
    );
  }
}

async function sendConfirmationEmail(participant: {
  name: string;
  email: string;
}) {
  const withName = confirmationTemplate.replace(
    "{{nomeParticipante}}",
    participant.name,
  );
  const html = juice(withName);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"IPVO MovTeens" <${GMAIL_USER}>`,
      to: participant.email,
      subject: "✅ Inscrição confirmada no 3º Acampa Teens!",
      html,
    });
    console.log(`Confirmation email sent to ${participant.email}`);
  } catch (emailError) {
    console.error("Failed to send confirmation email:", emailError);
  }
}
