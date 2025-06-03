import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    if (req.method === "DELETE") {
        const response = await fetch(`http://localhost:3333/clients/${id}`, {
            method: "DELETE",
        });

        if (response.status === 204) {
            return res.status(204).end();
        } else {
            const data = await response.json();
            return res.status(response.status).json(data);
        }
    }

    return res.status(405).json({ message: "Método não permitido." });
}
