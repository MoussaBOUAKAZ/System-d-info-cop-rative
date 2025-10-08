const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const plainPassword = 'aze'; // Mot de passe en clair
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.create({
    data: {
      name: 'Bouakaz',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Utilisateur inséré :', user);
  console.log('Mot de passe en clair :', plainPassword);
  console.log('Mot de passe hashé :', hashedPassword);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());