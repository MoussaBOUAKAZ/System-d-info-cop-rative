import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "email et password requis" },
        { status: 400 }
      );
    }

    // 🔒 Hash du mot de passe
    const hashed = await bcrypt.hash(password, 10);

    // 👤 Création de l’utilisateur
    const newUser = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashed,
        ...(role ? { role: String(role).toUpperCase() as any } : {}),
      },
      select: { id: true, name: true, email: true, role: true },
    });
    const otherUsers = await prisma.user.findMany({
      where: { id: { not: newUser.id } },
      select: { id: true },
    });

    for (const other of otherUsers) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          isGroup: false,
          participants: {
            some: { userId: newUser.id },
          },
          AND: {
            participants: {
              some: { userId: other.id },
            },
          },
        },
      });
      if (!existingConversation) {
        await prisma.conversation.create({
          data: {
            isGroup: false,
            participants: {
              create: [{ userId: newUser.id }, { userId: other.id }],
            },
          },
        });
      }
    }

    return NextResponse.json(newUser, {
      status: 201,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Erreur création utilisateur:", error);

    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Email déjà utilisé" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur" },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  }
}

// GET: liste ou recherche d'utilisateurs
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    let users;
    if (search) {
      users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, email: true, role: true },
        orderBy: { email: "asc" },
      });
    } else {
      users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true },
        orderBy: { email: "asc" },
      });
    }

    return NextResponse.json(users, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch {
    return NextResponse.json([], {
      status: 200,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  }
}