import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      date,
      startTime,
      endTime,
      type,
      location,
      description,
      participantIds, // array of user IDs
    } = body;

    // Vérifier que les participants existent
    let participants = [];
    if (participantIds && participantIds.length > 0) {
      participants = await prisma.user.findMany({
        where: { id: { in: participantIds } },
        select: { id: true },
      });
      if (participants.length !== participantIds.length) {
        return NextResponse.json({ error: "Un ou plusieurs participants sont invalides." }, { status: 400 });
      }
    }

    // Création de l'événement
    const event = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        startTime: startTime || "",
        endTime: endTime || "",
        type,
        location,
        description,
        participants: {
          connect: participantIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: { participants: true },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: { participants: { select: { id: true, name: true, email: true } } },
      orderBy: { date: "asc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération des événements" }, { status: 500 });
  }
}