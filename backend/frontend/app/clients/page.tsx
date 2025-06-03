"use client";

import { useEffect, useState } from "react";

type Client = {
    id: number;
    name: string;
    email: string;
    status: boolean; // backend agora envia boolean: true/false
};

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"active" | "inactive">("active");

    useEffect(() => {
        fetchClients();
    }, []);

    async function fetchClients() {
        try {
            const res = await fetch("/api/clients"); // <-- NÃO usar http://localhost:3333 direto aqui
            const data = await res.json();
            console.log("CLIENTES RECEBIDOS DO BACKEND:", data); // <- IMPORTANTE
            setClients(data);
        } catch (err) {
            console.error("Erro ao buscar clientes:", err);
            alert("Erro ao buscar clientes");
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch("/api/clients", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                status: status === "active", // Converte para boolean
            }),
        });

        if (res.ok) {
            alert("Cliente cadastrado com sucesso!");
            setName("");
            setEmail("");
            setStatus("active");
            fetchClients();
        } else {
            const error = await res.json();
            alert("Erro: " + JSON.stringify(error, null, 2));
        }
    }

    async function handleDelete(id: number) {
        const confirmDelete = confirm(
            "Tem certeza que deseja excluir este cliente?"
        );
        if (!confirmDelete) return;

        try {
            const res = await fetch(`/api/clients/${id}`, {
                method: "DELETE",
            });

            if (res.status === 204) {
                setClients((prev) => prev.filter((client) => client.id !== id));
            } else {
                const error = await res.json();
                alert("Erro ao excluir cliente: " + error.message);
            }
        } catch (err) {
            alert("Erro de conexão com o servidor.");
        }
    }

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-xl font-bold">Cadastro de Cliente</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 w-full"
                    required
                />
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full"
                    required
                />
                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value as "active" | "inactive")
                    }
                    className="border p-2 w-full"
                >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                </select>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Cadastrar
                </button>
            </form>

            <div className="pt-6">
                <h2 className="text-lg font-semibold mb-2">
                    Clientes Cadastrados
                </h2>
                {clients.length === 0 && <p>Nenhum cliente cadastrado.</p>}
                {clients.map((client) => (
                    <div
                        key={client.id}
                        className="border p-4 rounded mb-2 flex justify-between items-center"
                    >
                        <div>
                            <p>
                                <strong>Nome:</strong> {client.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {client.email}
                            </p>
                            <p>
                                <strong>Status:</strong>{" "}
                                {client.status ? "Ativo" : "Inativo"}
                            </p>
                        </div>
                        <button
                            onClick={() => handleDelete(client.id)}
                            className="text-red-600 hover:underline"
                        >
                            Excluir
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
