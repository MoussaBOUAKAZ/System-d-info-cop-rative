import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const session = await getServerSession(authOptions as any).catch(() => null)
  const userId = (session as any)?.user?.id
  if (!userId) return NextResponse.json([], { status: 200 })

  const conversations = await prisma.conversation.findMany({
    where: { participants: { some: { userId } } },
    select: {
      id: true,
      isGroup: true,
      name: true,
      participants: { select: { user: { select: { id: true, name: true, email: true } } } },
    },
    orderBy: { updatedAt: "desc" }
  })
  return NextResponse.json(conversations, { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } })
}


