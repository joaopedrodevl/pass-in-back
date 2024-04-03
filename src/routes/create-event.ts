import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { generateSlug } from "../utils/generate-slug";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/bad-request";

export async function createEvent(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post("/events", {
        schema: {
            summary: "Create an event",
            tags: ['events'],
            body: z.object({
                title: z.string({
                    required_error: "Title is required",
                    invalid_type_error: "Title must be a string",   
                }).min(4).max(100),
                details: z.string().max(1000).nullable(),
                maximumAttendees: z.number().int().positive().nullable(),
            }),
            response: {
                201: z.object({
                    sucess: z.literal(true),
                    eventId: z.string().uuid(),
                }),
            }
        }
    }, async (request, reply) => {
        const {
            title,
            details,
            maximumAttendees,
        } = request.body;

        const slug = generateSlug(title);

        const eventWithSlug = await prisma.event.findUnique({
            where: {
                slug,
            }
        })

        if (eventWithSlug !== null) {
            throw new BadRequest("Event with this title already exists");
        }

        const event = await prisma.event.create({
            data: {
                title,
                details,
                maximumAttendees,
                slug,
            }
        });

        return reply.status(201).send({
            sucess: true,
            eventId: event.id,
        });
    });
}