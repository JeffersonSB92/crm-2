"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

type Email = {
  id: string;
  subject: string;
  from: string;
  date: string;
  body: string;
};

export default function GmailIntegration() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [prevPageTokens, setPrevPageTokens] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);

  // Checa se a conta está conectada
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("http://localhost:4000/emails/status");
        const data = await res.json();
        setConnected(data.connected);

        if (data.connected) fetchEmails(); // carrega primeira página
      } catch {
        setConnected(false);
      }
    }
    checkStatus();
  }, []);

  // Função para buscar e-mails do backend
  async function fetchEmails(pageToken?: string) {
    const url = new URL("http://localhost:4000/emails/list");
    url.searchParams.set("pageSize", "10");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    try {
      const res = await fetch(url.toString());
      const data = await res.json();

      setEmails(data.emails || []);
      setNextPageToken(data.nextPageToken || null);
      if (!pageToken) setPrevPageTokens([]); // primeira página limpa histórico
    } catch (err) {
      console.error("Erro ao buscar emails:", err);
    }
  }

  // Conectar Gmail
  async function connectGmail() {
    const res = await fetch("http://localhost:4000/emails/login");
    const data = await res.json();
    window.location.href = data.url;
  }

  if (connected === null) return <p>Carregando...</p>;
  if (!connected)
    return (
      <button
        onClick={connectGmail}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Conectar Gmail
      </button>
    );

  return (
    <div className="flex flex-col h-[80vh] border rounded overflow-hidden">
      {/* Lista de emails + paginação */}
      <div className="flex flex-1 overflow-hidden">
        {/* Coluna de lista */}
        <div ref={listRef} className="w-1/3 border-r overflow-y-auto">
          {emails.length === 0 ? (
            <p className="p-4">Nenhum email encontrado.</p>
          ) : (
            emails.map((email) => (
              <Card
                key={email.id}
                className={`cursor-pointer border-b hover:bg-zinc-100 transition gap-2 ${
                  selectedEmail?.id === email.id ? "bg-zinc-200" : ""
                }`}
                onClick={() => setSelectedEmail(email)}
              >
                <CardContent className="p-2">
                  <p className="font-semibold text-sm">
                    {email.subject || "(sem assunto)"}
                  </p>
                  <p className="text-xs text-zinc-600 truncate">{email.from}</p>
                  <p className="text-xs text-zinc-400">{email.date}</p>
                </CardContent>
              </Card>
            ))
          )}

          {/* Paginação */}
          <div className="p-2 flex justify-between">
            <button
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              disabled={prevPageTokens.length === 0}
              onClick={() => {
                const prevToken = prevPageTokens.pop();
                setPrevPageTokens([...prevPageTokens]);
                fetchEmails(prevToken);
                setCurrentPage((p) => p - 1);
                listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Anterior
            </button>

            <span className="text-sm font-bold self-center text-zinc-200">Página {currentPage}</span>

            <button
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
              disabled={!nextPageToken}
              onClick={() => {
                if (nextPageToken) {
                  setPrevPageTokens((prev) => [...prev, nextPageToken]);
                  fetchEmails(nextPageToken);
                  setCurrentPage((p) => p + 1);
                  listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              Próxima
            </button>
          </div>
        </div>

        {/* Coluna de visualização */}
        <div className="flex-1 p-4 overflow-y-auto bg-zinc-100">
          {selectedEmail ? (
            <>
              <h2 className="text-lg font-bold mb-2">{selectedEmail.subject}</h2>
              <p className="text-sm text-zinc-600 mb-1">{selectedEmail.from}</p>
              <p className="text-xs text-zinc-400 mb-4">{selectedEmail.date}</p>
              <div
                className="prose max-w-full"
                dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
              />
            </>
          ) : (
            <p className="text-center text-zinc-500 mt-20">
              Selecione um email para ler
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
