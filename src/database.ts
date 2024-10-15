import Database from 'better-sqlite3'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { projects, users } from './schema'
import { UserWithProjects } from './zod.type'

const sqlite = new Database('./sqlite.db')
const db = drizzle(sqlite, { logger: true })

export const getUsersWithProject = async () => {
    const rows = db
        .select()
        .from(users)
        .leftJoin(projects, eq(users.id, projects.ownerId))
        .groupBy(projects.id)
        .all()

    const result = rows.reduce<Record<number, UserWithProjects>>((acc, row) => {
        const user = row.users
        const project = row.projects
        if (!acc[user.id]) {
            acc[user.id] = { ...user, projects: [] }
        }
        if (project?.ownerId === user.id) {
            acc[user.id].projects.push(project)
        }
        return acc
    }, {})

    return Object.values(result)
}
