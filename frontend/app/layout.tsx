// app/layout.tsx
import "./globals.css";

export const metadata = {
    title: "Anka Clients",
    description: "Cadastro de clientes para o case Anka Tech",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body className="bg-zinc-100 text-zinc-900 p-8">{children}</body>
        </html>
    );
}
