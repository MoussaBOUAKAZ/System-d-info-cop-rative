import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any).catch(() => null)
  const userId = (session as any)?.user?.id
  if (!userId) return NextResponse.json([], { status: 200 })
  const conversationId = params.id
  const isMember = await prisma.conversationParticipant.findFirst({ where: { conversationId, userId } })
  if (!isMember) return NextResponse.json([], { status: 200 })
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    select: { 
      id: true, 
      content: true, 
      createdAt: true, 
      senderId: true,
      sender: { select: { id: true, name: true, email: true } }
    }
  })
  return NextResponse.json(messages, { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } })
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any).catch(() => null)
  const userId = (session as any)?.user?.id
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const conversationId = params.id
  const isMember = await prisma.conversationParticipant.findFirst({ where: { conversationId, userId } })
  if (!isMember) return NextResponse.json({ error: "forbidden" }, { status: 403 })
  const { content } = await req.json()
  if (!content || String(content).trim().length === 0) return NextResponse.json({ error: "empty" }, { status: 400 })
  const msg = await prisma.message.create({ data: { conversationId, senderId: userId, content: String(content) } })
  await prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } })
  return NextResponse.json({ id: msg.id }, { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } })
}


