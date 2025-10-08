import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"; // adjust if needed
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { password } = await req.json();
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères" },
        { status: 400 }
      );
    }

 
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: password },
    });

    return NextResponse.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
