import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } })
  const header = ['id','name','email','role']
  const rows = users.map(u => [u.id, u.name ?? '', u.email ?? '', (u as any).role ?? 'USER'])
  const csv = [header.join(','), ...rows.map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(','))].join('\n')
  return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="users.csv"' }})
}







