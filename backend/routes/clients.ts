import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function clientRoutes(app: FastifyInstance) {
    // ROTA GET
    app.get("/clients", async () => {
        const clients = await prisma.client.findMany();

        // CONVERSÃO PARA BOOLEANO
        const formattedClients = clients.map((client) => ({
            ...client,
            status: !!client.status, // Converte para booleano explicitamente
        }));

        return formattedClients;
    });

    // ROTA POST
    app.post("/clients", async (request, reply) => {
        const createClientSchema = z.object({
            name: z.string(),
            email: z.string().email(),
            status: z.boolean(), // AGORA É BOOLEANO
        });

        const { name, email, status } = createClientSchema.parse(request.body);

        const client = await prisma.client.create({
            data: {
                name,
                email,
                status,
            },
        });

        return reply.status(201).send(client);
    });

    // ROTA DELETE
    app.delete("/clients/:id", async (request, reply) => {
        const deleteClientSchema = z.object({
            id: z.coerce.number(),
        });

        const { id } = deleteClientSchema.parse(request.params);

        try {
            await prisma.client.delete({
                where: { id },
            });

            return reply.status(204).send();
        } catch (error) {
            return reply
                .status(404)
                .send({ message: "Cliente não encontrado." });
        }
    });
}
