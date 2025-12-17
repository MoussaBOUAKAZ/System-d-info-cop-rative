import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions as any);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Fetch interactions (and use them as proxy for timeline)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

        const interactions = await prisma.interaction.findMany({
            where: {
                createdAt: {
                    gte: sixMonthsAgo
                }
            },
            include: {
                product: true
            }
        });

        // 2. Fetch contacts (just status/type, no createdAt usage)
        const contacts = await prisma.contact.findMany({
            select: {
                id: true,
                type: true,
                Statut: true
            }
        });

        // --- Aggregation Logic ---
        const getMonthName = (date: Date) => date.toLocaleString('default', { month: 'short' });
        const now = new Date();

        // Initialize Buckets
        const revenueMap = new Map<string, number>();
        const interactionsMap = new Map<string, number>(); // Not used in charts? used "Interactions by Type"

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            revenueMap.set(getMonthName(d), 0);
        }

        // Timeline Proxy: Map contactId -> First Interaction Date
        const contactFirstInteraction = new Map<number, Date>();

        let totalRevenue = 0;

        interactions.forEach(interaction => {
            // Revenue Aggregation
            if (interaction.product) {
                const month = getMonthName(interaction.createdAt);
                if (revenueMap.has(month)) {
                    revenueMap.set(month, (revenueMap.get(month) || 0) + (interaction.product.price || 0));
                }
                totalRevenue += (interaction.product.price || 0);
            }

            // Contact Creation Proxy
            const cId = interaction.contactId;
            if (!contactFirstInteraction.has(cId) || interaction.createdAt < contactFirstInteraction.get(cId)!) {
                contactFirstInteraction.set(cId, interaction.createdAt);
            }
        });

        const revenueData = Array.from(revenueMap.entries()).map(([month, revenue]) => ({
            month,
            revenue,
            target: 50000
        }));

        // Growth Aggregation (using proxy dates)
        const sixMonthsData: { month: string, contacts: number }[] = [];
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        let newClientsCount = 0;

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = getMonthName(d);
            const nextMonthStart = new Date(d.getFullYear(), d.getMonth() + 1, 1);

            let count = 0;
            contactFirstInteraction.forEach((date) => {
                if (date < nextMonthStart) count++;
            });
            sixMonthsData.push({ month: monthName, contacts: count });
        }

        // Calculate "New Clients" (Clients created this month)
        contacts.forEach(c => {
            const firstDate = contactFirstInteraction.get(c.id);
            // If contact is Client and their first interaction was this month
            if (firstDate && firstDate >= currentMonthStart && (c.type === 'Client' || c.Statut === 'Client')) {
                newClientsCount++;
            }
        });


        // Interactions by Type
        const typeMap = new Map<string, number>();
        interactions.forEach(i => {
            const type = i.type || 'Autre';
            typeMap.set(type, (typeMap.get(type) || 0) + 1);
        });
        const interactionsByTypeData = Array.from(typeMap.entries()).map(([name, value], index) => ({
            name,
            value,
            color: `hsl(var(--chart-${(index % 5) + 1}))`
        }));


        // Conversion Funnel
        const statusMap = new Map<string, number>();
        contacts.forEach(c => {
            const status = c.Statut || 'Aucun';
            statusMap.set(status, (statusMap.get(status) || 0) + 1);
        });
        const conversionOrder = ["Prospect", "Qualifié", "Proposition", "Négociation", "Client"];
        const conversionData = conversionOrder.map(stage => ({
            stage,
            count: statusMap.get(stage) || statusMap.get(stage + 's') || 0
        })).filter(d => d.count > 0 || conversionOrder.includes(d.stage));


        // Top Performers (Empty)
        const topPerformers: any[] = [];


        // KPIs
        // Refetch strict total revenue if needed, or use windowed sum. 
        // For MVP, windowed sum (totalRevenue above) is safer as it matches chart.
        // But previously I did a separate query. Let's stick to the windowed sum to be fast and safe.
        // Actually, user wants "Total", maybe all time?
        // Let's do a quick separate query for ALL time revenue if cheap.
        const allRevenue = await prisma.interaction.findMany({
            where: { productId: { not: null } },
            select: { product: { select: { price: true } } }
        });
        const realTotalRevenue = allRevenue.reduce((sum, i) => sum + (i.product?.price || 0), 0);

        const totalInteractionsCount = interactions.length;
        const totalClients = contacts.filter(c => c.type === 'Client' || c.Statut === 'Client').length;
        const conversionRate = contacts.length > 0 ? ((totalClients / contacts.length) * 100).toFixed(1) : "0.0";

        return NextResponse.json({
            revenueData,
            contactsGrowthData: sixMonthsData,
            interactionsByTypeData,
            conversionData,
            topPerformers,
            kpi: {
                totalRevenue: realTotalRevenue,
                conversionRate,
                newClients: newClientsCount,
                totalInteractions: totalInteractionsCount
            }
        });

    } catch (error) {
        console.error("Analytics API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
