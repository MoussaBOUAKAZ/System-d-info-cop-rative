import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const firstNames = ["Marie", "Pierre", "Sophie", "Thomas", "Julie", "Nicolas", "Camille", "Julien", "Lea", "Alexandre"];
const lastNames = ["Dubois", "Martin", "Laurent", "Bernard", "Petit", "Durand", "Leroy", "Moreau", "Simon", "Michel"];
const companies = ["TechCorp", "Innovate SAS", "WebSolutions", "Consulting Group", "Green Energy", "SoftDev", "Marketing Pro", "Data Systems"];
const statuses = ["Prospect", "Qualifié", "Proposition", "Négociation", "Client"];
const interactionTypes = ["Email", "Appel", "Réunion"];
const products = [
    { name: "Consulting SEO", price: 1500, type: "SERVICE", category: "Marketing" },
    { name: "Licence CRM (Annuel)", price: 1200, type: "PRODUCT", category: "Logiciel" },
    { name: "Audit Sécurité", price: 3500, type: "SERVICE", category: "Securité" },
    { name: "Formation React", price: 2500, type: "SERVICE", category: "Formation" },
    { name: "Support Premium", price: 500, type: "SERVICE", category: "Support" }
];

function getRandomItem(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
    console.log('Start seeding ...')

    // 1. Create Products
    const createdProducts = [];
    for (const p of products) {
        const product = await prisma.product.create({
            data: {
                name: p.name,
                price: p.price,
                type: p.type as any,
                category: p.category,
                description: "Description pour " + p.name,
                stock: 100
            }
        });
        createdProducts.push(product);
        console.log(`Created product: ${product.name}`);
    }

    // 2. Create Contacts
    const createdContacts = [];
    for (let i = 0; i < 20; i++) {
        const firstName = getRandomItem(firstNames);
        const lastName = getRandomItem(lastNames);
        const contact = await prisma.contact.create({
            data: {
                fullName: `${firstName} ${lastName}`,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
                phone: "06" + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
                company: getRandomItem(companies),
                position: "Manager",
                type: Math.random() > 0.6 ? "Client" : "Prospect",
                Statut: getRandomItem(statuses),
                city: "Paris",
                country: "France"
            }
        });
        createdContacts.push(contact);
        console.log(`Created contact: ${contact.fullName}`);
    }

    // 3. Create Interactions (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const now = new Date();

    for (let i = 0; i < 50; i++) {
        const contact = getRandomItem(createdContacts);
        const hasProduct = Math.random() > 0.5; // 50% chance of product linked (Sale)
        const product = hasProduct ? getRandomItem(createdProducts) : null;

        await prisma.interaction.create({
            data: {
                type: getRandomItem(interactionTypes),
                subject: "Discussion projet",
                content: "Compte rendu de l'échange...",
                date: getRandomDate(sixMonthsAgo, now), // display date
                createdAt: getRandomDate(sixMonthsAgo, now), // aggregation date (proxy)
                contactId: contact.id,
                productId: product ? product.id : null,
                status: "completed"
            }
        });
    }
    console.log('Seeding interactions... done.')

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
