import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const session = await getServerSession(authOptions as any).catch(() => null)
  const userId = (session as any)?.user?.id
  const userRole = (session as any)?.user?.role

  if (!userId) return NextResponse.json([], { status: 200 })
  if (userRole !== "ADMIN") return NextResponse.json([], { status: 200 })

  const groups = await prisma.conversation.findMany({
    where: { isGroup: true },
    select: {
      id: true,
      name: true,
      isGroup: true,
      participants: { select: { user: { select: { id: true, name: true, email: true } } } },
      updatedAt: true,
      createdAt: true
    },
    orderBy: { updatedAt: "desc" }
  })
  return NextResponse.json(groups, { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any).catch(() => null)
  const userId = (session as any)?.user?.id
  const userRole = (session as any)?.user?.role

  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  if (userRole !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  try {
    const { name, userIds } = await req.json()

    if (!name || !userIds || !Array.isArray(userIds) || userIds.length < 2) {
      return NextResponse.json({ error: "name and at least 2 userIds required" }, { status: 400 })
    }

    // Verify all users exist
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true }
    })

    if (users.length !== userIds.length) {
      return NextResponse.json({ error: "some users not found" }, { status: 400 })
    }

    // Create group conversation
    const conversation = await prisma.conversation.create({
      data: {
        isGroup: true,
        name: name.trim(),
        participants: {
          create: userIds.map((id: string) => ({ userId: id }))
        }
      },
      select: {
        id: true,
        name: true,
        isGroup: true,
        participants: {
          select: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    })

    return NextResponse.json(conversation, { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } })
  } catch (error) {
    console.error("Group creation error:", error)
    return NextResponse.json({ error: "server error" }, { status: 500, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } })
  }
}
