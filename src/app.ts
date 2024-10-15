import { swaggerUI } from '@hono/swagger-ui'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { logger } from 'hono/logger'
import { getUsersWithProject } from './database'
import { ProjectSchema, UserSchema } from './zod.type'

const app = new OpenAPIHono()
app.use(logger())

app.openapi(
    createRoute({
        method: 'get',
        path: '/hello',
        responses: {
            200: {
                description: 'Respond a message',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            },
        },
    }),
    (c) => {
        return c.json({
            message: 'hello',
        })
    },
)

app.openapi(
    createRoute({
        method: 'get',
        path: '/users',
        responses: {
            200: {
                description: 'Create new User with Project',
                content: {
                    'application/json': {
                        schema: z.object({
                            data: z.array(
                                UserSchema.extend({
                                    projects: z.array(ProjectSchema),
                                }),
                            ),
                        }),
                    },
                },
            },
        },
    }),
    async (c) => {
        const res = await getUsersWithProject()

        return c.json({ data: res })
    },
)

app.get(
    '/ui',
    swaggerUI({
        url: '/doc',
    }),
)

app.doc('/doc', {
    info: {
        title: 'An API',
        version: 'v1',
    },
    openapi: '3.1.0',
})

// Export the Hono app
export default app
