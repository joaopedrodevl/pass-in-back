import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEventAttendees(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get("/events/:eventId/attendees", {
        schema: {
            summary: "GET event attendees",
            tags: ['events'],
            params: z.object({
                eventId: z.string().uuid(),
            }),
            querystring: z.object({
                query: z.string().nullish(),
                pageIndex: z.string().nullish().default('0').transform(Number),
            }),
            response: {
                200: z.object({
                    attendees: z.array(
                        z.object({
                            id: z.number(),
                            name: z.string(),
                            email: z.string().email(),
                            createdAt: z.date(),
                            checkInAt: z.date().nullable()
                        })
                    ),
                    total: z.number(),
                }), 
            },
        },
    }, async (request, reply) => {
        const { eventId } = request.params;
        const { pageIndex, query } = request.query;

        const attendees = await prisma.attendee.findMany({
            where: query ? {
                eventId,
                name: {
                    contains: query,
                }
            } : {
                eventId
            },
            take: 8,
            skip: pageIndex * 8,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                checkIn: {
                    select: {
                        createdAt: true
                    }
                }
            }
        });

        return reply.send({
            attendees: attendees.map((attendee) => {
                return {
                    id: attendee.id,
                    name: attendee.name,
                    email: attendee.email,
                    createdAt: attendee.createdAt,
                    checkInAt: attendee.checkIn?.createdAt ?? null,
                }
            }),
            total: await prisma.attendee.count({
                where: query ? {
                    eventId,
                    name: {
                        contains: query,
                    }
                } : {
                    eventId
                }
            })
        });
    });
}