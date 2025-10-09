// app/api/interactions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Données reçues :", data);
    const interaction = await prisma.interaction.create({
      data: {
        type: data.type,
        subject: data.subject,
        content: data.content,
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        duration: data.duration,
        status: data.status || "completed",
        contactId: data.contactId,
        productId: data.productId ?? null,
      },
      include: { contact: true, product: true },
    });

    return NextResponse.json(interaction);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const interactions = await prisma.interaction.findMany({
      include: { contact: true, product: true },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(interactions);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}
