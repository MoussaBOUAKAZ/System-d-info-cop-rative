import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { name, email } = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    return NextResponse.json({
      message: "Profil mis à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erreur update profil :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
