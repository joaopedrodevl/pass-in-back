import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { promise, z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function registerForEvent(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .post("/events/:eventId/attendees", {
            schema: {
                summary: "Register an attendee",
                tags: ['attendees'],
                params: z.object({
                    eventId: z.string().uuid(),
                }),
                body: z.object({
                    name: z.string().min(3).max(100),
                    email: z.string().email(),
                }),
                response: {
                    201: z.object({
                        success: z.literal(true),
                        attendeeId: z.number(),
                    }),
                }
            }
        }, async (request, reply) => {
            const { eventId } = request.params;
            const { name, email } = request.body;

            const attendeeFromEmail = await prisma.attendee.findUnique({
                where: {
                    eventId_email: {
                        email,
                        eventId,
                    }
                }
            })

            if (attendeeFromEmail !== null) {
                throw new BadRequest("Attendee with this email already exists")
            }

            const [event, amountOfAttendeesForEvent] = await Promise.all([
                prisma.event.findUnique({
                    where: {
                        id: eventId,
                    }
                }),
                prisma.attendee.count({
                    where: {
                        eventId,
                    }
                })
            ])

            if (event?.maximumAttendees && amountOfAttendeesForEvent >= event?.maximumAttendees) {
                throw new Error("Maximum amount of attendees reached")
            }

            const attendee = await prisma.attendee.create({
                data: {
                    name,
                    email,
                    eventId,
                }
            })

            reply.status(201).send({
                success: true,
                attendeeId: attendee.id,
            })
        })
}