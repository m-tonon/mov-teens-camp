import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
import { RegistrationFormData } from "@/shared/registration.interface";
import { connectToDatabase } from "@/lib/mongoose-connection";
import { RegistrationModel } from "@/shared/models/registration.model";

dotenv.config();

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const formData: RegistrationFormData = await req.json();
    console.log("Registration data:", formData);

    if (
      !formData.name ||
      !formData.responsibleInfo.name ||
      !formData.responsibleInfo.document ||
      !formData.responsibleInfo.phone ||
      !formData.parentalAuthorization
    ) {
      return NextResponse.json(
        { error: "Missing required fields or payment not confirmed" },
        { status: 400 },
      );
    }

    let updatedRegistration = await RegistrationModel.findOneAndUpdate(
      { "payment.referenceId": formData.payment?.referenceId },
      { $set: formData },
      { new: true },
    );

    if (!updatedRegistration) {
      updatedRegistration = await RegistrationModel.findOneAndUpdate(
        { identityDocument: formData.identityDocument },
        { $set: formData },
        { new: true },
      );
    }

    if (updatedRegistration) {
      return NextResponse.json({
        message: "Registration updated successfully",
        referenceId: updatedRegistration.payment.referenceId,
      });
    }

    const registration = new RegistrationModel(formData);
    await registration.save();

    return NextResponse.json({
      message: "Data successfully saved to MongoDB",
      referenceId: registration.payment.referenceId,
    });
  } catch (error) {
    console.error("Error in /api/registrations:", error);
    return NextResponse.json(
      { error: "Failed to save data to MongoDB" },
      { status: 500 },
    );
  }
}
