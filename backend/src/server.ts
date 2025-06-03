import Fastify from "fastify";
import cors from "@fastify/cors";
import { clientRoutes } from "../routes/clients";

async function start() {
    const app = Fastify();

    await app.register(cors, {
        origin: ["http://localhost:3000"],
        credentials: true,
    });

    app.register(clientRoutes);

    app.listen({ port: 3333 }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`🚀 Servidor rodando em ${address}`);
    });
}

start();
