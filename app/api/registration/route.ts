import { NextRequest, NextResponse } from 'next/server';
import dotenv from 'dotenv';
import { RegistrationFormData } from '@/shared/registration.interface';
import { connectToDatabase } from '@/lib/mongoose-connection';
import { RegistrationModel } from '@/shared/models/registration.model';

dotenv.config();

export async function POST(req: NextRequest) {
  console.log('Registration API called');

  await connectToDatabase();
  console.log('Database connected');

  try {
    const formData: RegistrationFormData = await req.json();
    console.log('Received registration data:', {
      name: formData.name,
      identityDocument: formData.identityDocument,
      hasPayment: !!formData.payment,
      paymentReferenceId: formData.payment?.referenceId,
    });

    if (
      !formData.name ||
      !formData.responsibleInfo.name ||
      !formData.responsibleInfo.document ||
      !formData.responsibleInfo.phone
    ) {
      console.log('Missing required fields:', {
        name: !!formData.name,
        responsibleName: !!formData.responsibleInfo?.name,
        responsibleDocument: !!formData.responsibleInfo?.document,
        responsiblePhone: !!formData.responsibleInfo?.phone,
      });
      return NextResponse.json(
        { error: 'Missing required fields or payment not confirmed' },
        { status: 400 },
      );
    }

    console.log(
      'Checking for existing registration by payment referenceId:',
      formData.payment?.referenceId,
    );
    let updatedRegistration = await RegistrationModel.findOneAndUpdate(
      { 'payment.referenceId': formData.payment?.referenceId },
      { $set: formData },
      { returnDocument: 'after' },
    );

    if (!updatedRegistration) {
      console.log(
        'No registration found by payment referenceId, trying identityDocument:',
        formData.identityDocument,
      );
      updatedRegistration = await RegistrationModel.findOneAndUpdate(
        { identityDocument: formData.identityDocument },
        { $set: formData },
        { returnDocument: 'after' },
      );
    }

    if (updatedRegistration) {
      console.log(
        'Registration updated successfully, referenceId:',
        updatedRegistration.payment.referenceId,
      );
      return NextResponse.json({
        message: 'Registration updated successfully',
        referenceId: updatedRegistration.payment.referenceId,
      });
    }

    console.log('Creating new registration document');
    const registration = new RegistrationModel(formData);
    await registration.save();
    console.log(
      'New registration saved successfully, referenceId:',
      registration.payment.referenceId,
    );

    return NextResponse.json({
      message: 'Data successfully saved to MongoDB',
      referenceId: registration.payment.referenceId,
    });
  } catch (error) {
    console.error('Error in /api/registration:', error);
    return NextResponse.json(
      { error: 'Failed to save data to MongoDB' },
      { status: 500 },
    );
  }
}
