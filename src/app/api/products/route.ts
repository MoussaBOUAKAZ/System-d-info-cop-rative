import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { _count: { select: { clients: true } } },
      orderBy: { createdAt: "desc" },
    })

    const withCounts = products.map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      category: p.category,
      price: p.price,
      status: p.status,
      stock: p.stock,
      description: p.description,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      clientsCount: p._count.clients,
    }))

    return NextResponse.json(withCounts)
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors du chargement des produits" }, { status: 500 })
  }
}

// POST /api/products
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const formattedData: any = {
      name: data.name,
      type: String(data.type || '').toUpperCase(),
      category: data.category,
      price: Number(data.price),
      status: String(data.status || '').toUpperCase(),
      stock: data.type === 'PRODUCT' ? (data.stock != null ? Number(data.stock) : null) : null,
      description: data.description,
    }

    const newProduct = await prisma.product.create({
      data: formattedData,
    })

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création du produit" }, { status: 500 })
  }
}
