import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function PUT(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await _req.json()
    const data: any = {}
    if (typeof body.name === 'string') data.name = body.name
    if (typeof body.email === 'string') data.email = body.email
    if (typeof body.role === 'string') data.role = String(body.role).toUpperCase()
    if (typeof body.password === 'string' && body.password.length > 0) data.password = await bcrypt.hash(body.password, 10)

    const user = await prisma.user.update({ where: { id }, data, select: { id: true, name: true, email: true, role: true } })
    return NextResponse.json(user, { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } })
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await prisma.user.delete({ where: { id } })
    return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } as any })
  } catch (e: any) {
    if (e?.code === 'P2025') {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } })
  }
}


