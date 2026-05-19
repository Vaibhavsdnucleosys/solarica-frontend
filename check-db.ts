import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const qCount = await prisma.quotation.count();
    const iCount = await prisma.invoice.count();
    console.log(`Quotations: ${qCount}`);
    console.log(`Invoices: ${iCount}`);
    const latestQ = await prisma.quotation.findFirst({ orderBy: { createdAt: 'desc' } });
    console.log('Latest Quotation:', latestQ);
}
main().catch(console.error).finally(() => prisma.$disconnect());
