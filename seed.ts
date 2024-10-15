import Database from 'better-sqlite3'
import { count } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { projects, users } from './src/schema'

const sqlite = new Database('sqlite.db')
const db = drizzle(sqlite, { logger: true })

const initializeUsers = async () => {
    const usersCount = (await db.select({ count: count() }).from(users))[0]
        .count
    if (usersCount === 0) {
        Array.from({ length: 3 }).forEach((_) => {
            db.insert(users)
                .values([
                    {
                        fullName: 'User_' + Date.now().toString(),
                    },
                ])
                .run()
        })
        return true
    } else {
        return false
    }
}

const initializeProjects = async () => {
    const usersCount = (await db.select({ count: count() }).from(users))[0]
        .count
    const projectsCount = (
        await db.select({ count: count() }).from(projects)
    )[0].count
    if (usersCount !== 0 && projectsCount === 0) {
        Array.from({ length: 15 }).forEach((_) => {
            db.insert(projects)
                .values([
                    {
                        name: 'Project_' + Date.now().toString(),
                        ownerId: Math.ceil(Math.random() * 3),
                    },
                ])
                .run()
        })
        return true
    } else {
        return false
    }
}

const main = async () => {
    if (await initializeUsers()) {
        await initializeProjects()
    }
}

await main()
