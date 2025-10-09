import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await prisma.product.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (e: any) {
    if (e?.code === 'P2025') {
      return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await req.json()
    const data: any = {}
    if (typeof body.name === 'string') data.name = body.name
    if (typeof body.type === 'string') data.type = String(body.type).toUpperCase()
    if (typeof body.category === 'string') data.category = body.category
    if (typeof body.price !== 'undefined') data.price = Number(body.price)
    if (typeof body.status === 'string') data.status = String(body.status).toUpperCase()
    if (typeof body.stock !== 'undefined') data.stock = body.stock === null ? null : Number(body.stock)
    if (typeof body.description === 'string') data.description = body.description

    const updated = await prisma.product.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (e: any) {
    if (e?.code === 'P2025') {
      return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}


