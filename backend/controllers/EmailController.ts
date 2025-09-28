import { Request, Response } from "express";
import { getAuthUrl, getTokens, setCredentials } from "../services/GmailService";

let savedTokens: any = null; // ⚠️ em produção, salvar no banco

export const EmailController = {
    // Passo 1: Login
    login: (req: Request, res: Response) => {
        const url = getAuthUrl();
        res.json({ url });
    },

    // Passo 2: Callback do Google
    callback: async (req: Request, res: Response) => {
        const code = req.query.code as string;
        const tokens = await getTokens(code);
        savedTokens = tokens;
        res.redirect("http://localhost:3000/emails");
    },

    // Listar emails
    list: async (req: Request, res: Response) => {
        if (!savedTokens) return res.status(401).send("Não autenticado");

        try {
            const gmail = setCredentials(savedTokens);

            const pageSize = parseInt(req.query.pageSize as string) || 10;
            const pageToken = req.query.pageToken as string | undefined;

            // Listar mensagens
            const response = await gmail.users.messages.list({
                userId: "me",
                maxResults: pageSize,
                pageToken,
            });

            const messages = response.data.messages || [];

            const emails = await Promise.all(
                messages.map(async (msg) => {
                    const emailRes = await gmail.users.messages.get({
                        userId: "me",
                        id: msg.id!,
                        format: "full",
                    });

                    const headers = emailRes.data.payload?.headers || [];
                    const subject = headers.find((h) => h.name === "Subject")?.value || "";
                    const from = headers.find((h) => h.name === "From")?.value || "";
                    const date = headers.find((h) => h.name === "Date")?.value || "";

                    let body = "";
                    if (emailRes.data.payload?.parts) {
                        const part = emailRes.data.payload.parts.find(
                            (p) => p.mimeType === "text/html" || p.mimeType === "text/plain"
                        );
                        if (part?.body?.data) {
                            body = Buffer.from(part.body.data, "base64").toString("utf-8");
                        }
                    } else if (emailRes.data.payload?.body?.data) {
                        body = Buffer.from(emailRes.data.payload.body.data, "base64").toString("utf-8");
                    }

                    return { id: msg.id, subject, from, date, body };
                })
            );

            res.json({
                emails,
                nextPageToken: response.data.nextPageToken || null, // Para frontend buscar próxima página
            });
        } catch (err) {
            console.error("Erro ao listar emails:", err);
            res.status(500).json({ error: "Erro ao listar emails" });
        }
    },

    // Enviar email
    send: async (req: Request, res: Response) => {
        if (!savedTokens) return res.status(401).send("Não autenticado");

        const { to, subject, message } = req.body;

        const gmail = setCredentials(savedTokens);
        const raw = Buffer.from(
            `To: ${to}\r\nSubject: ${subject}\r\n\r\n${message}`
        ).toString("base64");

        await gmail.users.messages.send({
            userId: "me",
            requestBody: { raw },
        });

        res.send("Email enviado!");
    },

    status: (req: Request, res: Response) => {
        if (savedTokens) {
            res.json({ connected: true });
        } else {
            res.json({ connected: false });
        }
    },
};
