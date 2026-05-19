import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const groupCount = await prisma.accountGroup.count();
    console.log(`Account Groups Count: ${groupCount}`);
    if (groupCount > 0) {
        const firstFew = await prisma.accountGroup.findMany({ take: 5 });
        console.log('Sample Groups:', firstFew);
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
