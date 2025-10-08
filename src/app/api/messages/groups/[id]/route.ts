import { NextResponse } from "next/server"
import { prisma } from "../../../../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/options"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any).catch(() => null)
  const userId = (session as any)?.user?.id
  const userRole = (session as any)?.user?.role

  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  if (userRole !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 })

  const groupId = params.id
  const { name, userIds } = await req.json()

  try {
    const updates: any = {}
    if (typeof name === 'string' && name.trim().length > 0) updates.name = name.trim()
    if (Array.isArray(userIds)) {
      // replace participants
      await prisma.conversationParticipant.deleteMany({ where: { conversationId: groupId } })
      await prisma.conversationParticipant.createMany({ data: userIds.map((id: string) => ({ conversationId: groupId, userId: id })) })
    }
    const group = await prisma.conversation.update({
      where: { id: groupId },
      data: updates,
      select: {
        id: true,
        name: true,
        isGroup: true,
        participants: { select: { user: { select: { id: true, name: true, email: true } } } }
      }
    })
    return NextResponse.json(group, { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } })
  } catch (e) {
    return NextResponse.json({ error: 'server error' }, { status: 500, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any).catch(() => null)
  const userId = (session as any)?.user?.id
  const userRole = (session as any)?.user?.role
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  if (userRole !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 })

  try {
    await prisma.conversation.delete({ where: { id: params.id } })
    return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } as any })
  } catch (e) {
    return NextResponse.json({ error: 'server error' }, { status: 500, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } })
  }
}



