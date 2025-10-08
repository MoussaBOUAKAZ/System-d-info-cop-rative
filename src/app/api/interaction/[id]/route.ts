// app/api/interactions/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.interaction.delete({
      where: { id: Number(params.id) },
    })
    return NextResponse.json({ message: "Interaction supprimée" })
  } catch (error) {
    return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 })
  }
}
