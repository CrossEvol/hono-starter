import * as z from 'zod'

export const ProjectSchema = z.object({
    id: z.number().nullable(),
    name: z.string().nullable(),
    ownerId: z.number().nullable(),
})
export type Projects = z.infer<typeof ProjectSchema>

export const UserSchema = z.object({
    id: z.number().nullable(),
    fullName: z.string().nullable(),
})
export type Users = z.infer<typeof UserSchema>

export const UserWithProjectsSchema = UserSchema.extend({
    projects: z.array(ProjectSchema),
})

export type UserWithProjects = z.infer<typeof UserWithProjectsSchema>
