import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose-connection";
import { RegistrationModel } from "@/shared/models/registration.model";
import { Parser } from "json2csv";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    let registrations = await RegistrationModel.find({}).lean();

    const paymentOnly = req.nextUrl.searchParams.get("payment");
    if (paymentOnly === "true") {
      registrations = registrations.filter(
        (r) => r.payment?.paymentConfirmed === true,
      );
    }

    const flatRegistrations = registrations.map((r: any) => ({
      name: r.name,
      birthDate: r.birthDate,
      age: r.age,
      gender: r.gender,
      identityDocument: r.identityDocument,
      address: r.address,
      churchMembership: r.churchMembership,
      churchName: r.churchName,
      healthInsurance: r.healthInsurance,
      medications: r.medications,
      allergies: r.allergies,
      specialNeeds: r.specialNeeds,
      responsibleName: r.responsibleInfo?.name,
      responsiblePhone: r.responsibleInfo?.phone,
      responsibleRelation: r.responsibleInfo?.relation,
      responsibleDocument: r.responsibleInfo?.document,
      responsibleEmail: r.responsibleInfo?.email,
      parentalAuthorization: r.parentalAuthorization,
      paymentReferenceId: r.payment?.referenceId,
      paymentConfirmed: r.payment?.paymentConfirmed,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    if (req.nextUrl.searchParams.get("json") === "1") {
      return NextResponse.json(flatRegistrations);
    }

    const fields = [
      { label: "Nome do Adolescente", value: "name" },
      { label: "Data de Nascimento", value: "birthDate" },
      { label: "Idade", value: "age" },
      { label: "Gênero", value: "gender" },
      { label: "Documento do Adolescente", value: "identityDocument" },
      { label: "Endereço", value: "address" },
      { label: "Membro de Igreja", value: "churchMembership" },
      { label: "Nome da Igreja", value: "churchName" },
      { label: "Plano de Saúde", value: "healthInsurance" },
      { label: "Medicamentos", value: "medications" },
      { label: "Alergias", value: "allergies" },
      { label: "Necessidades Especiais", value: "specialNeeds" },
      { label: "Nome do Responsável", value: "responsibleName" },
      { label: "Telefone do Responsável", value: "responsiblePhone" },
      { label: "Relação com o Adolescente", value: "responsibleRelation" },
      { label: "Documento do Responsável", value: "responsibleDocument" },
      { label: "Email do Responsável", value: "responsibleEmail" },
      { label: "Autorização dos Pais", value: "parentalAuthorization" },
      { label: "ID do Pagamento", value: "paymentReferenceId" },
      { label: "Pagamento Confirmado", value: "paymentConfirmed" },
      { label: "Criado em", value: "createdAt" },
      { label: "Atualizado em", value: "updatedAt" },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(flatRegistrations);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          'attachment; filename="movteens-inscricoes2025.csv"',
      },
    });
  } catch (error) {
    console.error("Error in /api/registration/export:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
