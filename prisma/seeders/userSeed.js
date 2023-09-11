const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const bcrypt = require('bcrypt');

async function seed() {
    try{
        await prisma.user.createMany({
            data: [
                {
                    name: 'abdelkabir',   
                    email: 'abdelkabir@gmail.com',   
                    password:  await bcrypt.hash('12345678', 10), 
                },
                {
                    name: 'ahmed',   
                    email: 'ahmed@gmail.com',   
                    password: await bcrypt.hash('123456', 10), 
                },
            ]
        })
        console.log('Seeding completed.');
    }catch(err){
        console.error('Error seeding the database:', err);
    }
}

seed();
