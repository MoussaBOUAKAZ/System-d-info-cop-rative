import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma";

export async function GET() {
    const contacts = await prisma.contact.findMany();

  return NextResponse.json(contacts)
}
export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("📥 Données reçues pour création contact:", data);
    
    // Création du contact
    const newContact = await prisma.contact.create({
      data: {
        fullName: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        type: data.type,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
      },
    });

    return NextResponse.json(newContact, { status: 201 });
  } catch (error: any) {
    console.error("❌ Erreur création contact:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du contact." },
      { status: 500 }
    );
  }
}