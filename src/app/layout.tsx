"use client";

import "./globals.css";
import SideBar from "@/components/SideBar";
import CountCard from "@/components/CountCard";
import UserList from "@/components/UserList";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Columns3, ListPlus, Rows3 } from "lucide-react";
import NewLead, { DrawerDialogDemo } from "@/components/NewLead";
import { useState } from "react";
import { CardKanban } from "@/components/CardKanban";
import { DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("list");

  return (
    <html lang="pt-br">
      <body className="flex h-screen overflow-hidden">
        {/* Sidebar fixa */}
        <SideBar />

        {/* Conteúdo principal */}
        <main className="flex-1 p-6 bg-zinc-950 overflow-y-auto">
          <div className="text-right">
            <DrawerDialogDemo />
          </div>
          <Separator className="my-10 mt-10 bg-gray-400" />
          <div className="grid grid-cols-4 gap-4 w-full">
            <CountCard />
            <CountCard />
            <CountCard />
            <CountCard />
          </div>
          {/* <Separator className="mt-10 bg-gray-400" /> */}
          <div className="mt-10 grid-cols-2 text-right">
            <Button
              onClick={() => { setViewMode("kanban"); console.log("Kanban selecionado"); console.log(viewMode) }}
              className={`mr-2 ${viewMode === "kanban"
                ? "bg-white text-black hover:bg-gray-200 hover:text-black"
                : "bg-zinc-950 text-white hover:bg-zinc-950 hover:text-white"
                }`}
            >
              <Columns3 />
              Kanban
            </Button>
            <Button
              onClick={() => { setViewMode("list"); console.log("List selecionado"); console.log(viewMode) }}
              className={`${viewMode === "list"
                ? "bg-white text-black hover:bg-gray-200 hover:text-black"
                : "bg-zinc-950 text-white hover:bg-zinc-950 hover:text-white"
                }`}
            >
              <Rows3 />
              List
            </Button>
          </div>
          <div className="text-white">
            {viewMode === "kanban" ? (
              <div className="grid grid-cols-6 gap-3">
                <div className="flex flex-col flex-wrap gap-2">
                  <p className="text-white">Novos Leads</p>
                  <CardKanban />
                  <CardKanban />
                  <CardKanban />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" className="bg-zinc-100 text-black hover:bg-zinc-300">
                        Adicionar Lead
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-zinc-100">
                      <DialogHeader>
                        <DialogTitle>Adicionar Lead</DialogTitle>
                        <DialogDescription>
                          Preencha as informações para criação do lead.
                        </DialogDescription>
                      </DialogHeader>
                      <NewLead />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex flex-col flex-wrap gap-2">
                  <p className="text-white">Em Contato</p>
                  <CardKanban />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" className="bg-zinc-100 text-black hover:bg-zinc-300">
                        Adicionar Lead
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-zinc-100">
                      <DialogHeader>
                        <DialogTitle>Adicionar Lead</DialogTitle>
                        <DialogDescription>
                          Preencha as informações para criação do lead.
                        </DialogDescription>
                      </DialogHeader>
                      <NewLead />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex flex-col flex-wrap gap-2">
                  <p className="text-white">Proposta Enviada</p>
                  <CardKanban />
                  <CardKanban />
                  <CardKanban />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" className="bg-zinc-100 text-black hover:bg-zinc-300">
                        Adicionar Lead
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-zinc-100">
                      <DialogHeader>
                        <DialogTitle>Adicionar Lead</DialogTitle>
                        <DialogDescription>
                          Preencha as informações para criação do lead.
                        </DialogDescription>
                      </DialogHeader>
                      <NewLead />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex flex-col flex-wrap gap-2">
                  <p className="text-white">Em Negociação</p>
                  <CardKanban />
                  <CardKanban />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" className="bg-zinc-100 text-black hover:bg-zinc-300">
                        Adicionar Lead
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-zinc-100">
                      <DialogHeader>
                        <DialogTitle>Adicionar Lead</DialogTitle>
                        <DialogDescription>
                          Preencha as informações para criação do lead.
                        </DialogDescription>
                      </DialogHeader>
                      <NewLead />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex flex-col flex-wrap gap-2">
                  <p className="text-white">Fechados</p>
                  <CardKanban />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" className="bg-zinc-100 text-black hover:bg-zinc-300">
                        Adicionar Lead
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-zinc-100">
                      <DialogHeader>
                        <DialogTitle>Adicionar Lead</DialogTitle>
                        <DialogDescription>
                          Preencha as informações para criação do lead.
                        </DialogDescription>
                      </DialogHeader>
                      <NewLead />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex flex-col flex-wrap gap-2">
                  <p className="text-white">Perdidos</p>
                  <CardKanban />
                  <CardKanban />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" className="bg-zinc-100 text-black hover:bg-zinc-300">
                        Adicionar Lead
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-zinc-100">
                      <DialogHeader>
                        <DialogTitle>Adicionar Lead</DialogTitle>
                        <DialogDescription>
                          Preencha as informações para criação do lead.
                        </DialogDescription>
                      </DialogHeader>
                      <NewLead />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ) : (
              <UserList />
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
