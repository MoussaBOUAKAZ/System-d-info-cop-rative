import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🟢 GET /api/contacts/[id]
 * Récupère un contact spécifique par son ID
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const contactId = parseInt(params.id, 10);

    if (isNaN(contactId)) {
      return NextResponse.json(
        { error: "ID invalide." },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: {
        interactions: true, // tu peux supprimer si tu ne veux pas charger les interactions
      },
    });

    if (!contact) {
      return NextResponse.json(
        { error: "Contact introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur récupération contact:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du contact." },
      { status: 500 }
    );
  }
}
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const contactId = parseInt(params.id, 10);
    const data = await req.json();

    if (isNaN(contactId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data,
    });

    return NextResponse.json(updatedContact, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur update contact:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du contact." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const contactId = parseInt(params.id);
  if (isNaN(contactId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  // Vérifier si le contact existe
  const existing = await prisma.contact.findUnique({
    where: { id: contactId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Contact introuvable" }, { status: 404 });
  }

  try {
    // Supprimer d'abord toutes les interactions liées
    await prisma.interaction.deleteMany({
      where: { contactId: contactId },
    });

    // Supprimer le contact
    await prisma.contact.delete({
      where: { id: contactId },
    });

    return NextResponse.json(
      { message: "✅ Contact supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur suppression contact:", error);
    return NextResponse.json(
      { error: "Impossible de supprimer le contact" },
      { status: 500 }
    );
  }
}
