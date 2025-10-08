import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/products
export async function GET() {
  try {
    const products = await prisma.product.findMany()
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors du chargement des produits" }, { status: 500 })
  }
}

// POST /api/products
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const formattedData = {
      ...data,
      type: data.type?.toUpperCase(),       // "service" → "SERVICE"
      status: data.status?.toUpperCase(),   // "active" → "ACTIVE"
    }

    const newProduct = await prisma.product.create({
      formattedData,
    })
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création du produit" }, { status: 500 })
  }
}
