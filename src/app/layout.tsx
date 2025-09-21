"use client";

import "./globals.css";
import SideBar from "@/components/SideBar";
import CountCard from "@/components/CountCard";
import UserList from "@/components/UserList";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Columns3,
  Rows3,
  Inbox,
  Clock1,
  CircleCheckBig,
  CalendarClock,
} from "lucide-react";
import NewLead, { DrawerDialogDemo } from "@/components/NewLead";
import { Key, useEffect, useState } from "react";
import { CardKanban } from "@/components/CardKanban";
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StepWithLeads } from "@/models/Steps"; // novo type com leads embutidos
import { getKanbanData } from "@/controllers/kanbanController"; // novo controller
import { Menubar } from "@/components/ui/menubar";
import { MenubarMenu, MenubarTrigger } from "@radix-ui/react-menubar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RootLayout({}: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [steps, setSteps] = useState<StepWithLeads[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const steps = await getKanbanData(
          "de80ed4e-7d4d-4aad-8ae2-2af841beac63"
        );
        setSteps(steps);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <html lang="pt-br">
      <body className="flex h-screen overflow-hidden">
        <SideBar />

        <main className="flex-1 p-6 bg-[#0d1b2a] overflow-y-auto">
          <div className="text-right">
            <DrawerDialogDemo />
          </div>
          <Separator className="my-10 mt-4 bg-gray-400" />
          <div className="grid grid-cols-4 gap-4 w-full">
            <CountCard
              title="Total de Leads"
              count="245"
              message="+12 em relação ao mês anterior"
              icon={Inbox}
            />
            <CountCard
              title="Leads em Andamento"
              count="145"
              message="59% do total de leads"
              icon={Clock1}
            />
            <CountCard
              title="Leads Fechados"
              count="64"
              message="26% do total de leads"
              icon={CircleCheckBig}
            />
            <CountCard
              title="Tarefas Pendentes"
              count="18"
              message="5 com vencimento hoje"
              icon={CalendarClock}
            />
          </div>

          <div className="mt-10 grid-cols-2 text-left">

            <Tabs defaultValue="kanban">
              <TabsList className="bg-zinc-200">
                <TabsTrigger value="kanban" className="data-[state=active]:bg-[#232323] data-[state=active]:text-white" onClick={() => setViewMode("kanban")}>Kanban</TabsTrigger>
                <TabsTrigger value="lista" className="data-[state=active]:bg-[#232323] data-[state=active]:text-white" onClick={() => setViewMode("list")}>Lista</TabsTrigger>
              </TabsList>
            </Tabs>

          </div>

          <div className="text-white mt-6">
            {viewMode === "kanban" ? (
              loading ? (
                <p>Carregando etapas...</p>
              ) : (
                <div
                  className="grid gap-4 w-full"
                  style={{
                    gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
                  }}
                >
                  {steps.map((step) => (
                    <div
                      key={step.step_id}
                      className="flex flex-col flex-wrap gap-2"
                    >
                      <p className="text-white font-bold">{step.name}</p>

                      {/* Leads já estão dentro do step */}
                      {step.leads.map((lead: { lead_id: Key | null | undefined; nome: string; empresa: string; ultima_atualizacao: string; atividade: string; iniciais: string; }) => (
                        <CardKanban
                          key={lead.lead_id}
                          nome={lead.nome}
                          empresa={lead.empresa}
                          ultima_atualizacao={lead.ultima_atualizacao}
                          atividade={lead.atividade}
                          iniciais={lead.iniciais}
                        />
                      ))}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="lg"
                            className="bg-zinc-100 text-black hover:bg-zinc-300"
                          >
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
                  ))}
                </div>
              )
            ) : (
              <UserList />
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
