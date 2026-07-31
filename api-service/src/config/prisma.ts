import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg';
import { config } from "dotenv"
config()

const PrismaClientSingleton = ()=>{
    const connectionString = process.env.DIRECT_URL
    const pool = new Pool({
        connectionString : connectionString
    })
    const adapter = new PrismaPg(pool)

    return new PrismaClient({ adapter : adapter})
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof PrismaClientSingleton>
}

export const prisma = globalThis.prismaGlobal ?? PrismaClientSingleton()

// if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma