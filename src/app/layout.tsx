"use client";

import "./globals.css";
import SideBar from "@/components/SideBar";
import CountCard from "@/components/CountCard";
import UserList from "@/components/UserList";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Columns3, Rows3, Inbox, Clock1, CircleCheckBig, CalendarClock } from "lucide-react";
import NewLead, { DrawerDialogDemo } from "@/components/NewLead";
import { useEffect, useState } from "react";
import { CardKanban } from "@/components/CardKanban";
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSteps } from "@/hooks/useSteps";
import { Step } from "@/models/Lead";
import { getLeadsBySteps } from "@/controllers/leadController";

export default function RootLayout({
  // children,
}: {
  children: React.ReactNode;
}) {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("list");
  const { steps, loading } = useSteps("de80ed4e-7d4d-4aad-8ae2-2af841beac63");
  const [ leads, setLeads ] = useState<Step[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getLeadsBySteps("de80ed4e-7d4d-4aad-8ae2-2af841beac63");
      console.log("Retorno cru do getLeadsByStep:", data);
      setLeads(data);
    }
    fetchData();
  }, []);
  
  return (
    <html lang="pt-br">
      <body className="flex h-screen overflow-hidden">
        {/* Sidebar fixa */}
        <SideBar />

        {/* Conteúdo principal */}
        <main className="flex-1 p-6 bg-[#161616] overflow-y-auto">
          <div className="text-right">
            <DrawerDialogDemo />
          </div>
          <Separator className="my-10 mt-4 bg-gray-400" />
          <div className="grid grid-cols-4 gap-4 w-full">
            <CountCard title="Total de Leads" count="245" message="+12 em relação ao mês anterior" icon={Inbox}/>
            <CountCard title="Leads em Andamento" count="145" message="59% do total de leads" icon={Clock1}/>
            <CountCard title="Leads Fechados" count="64" message="26% do total de leads" icon={CircleCheckBig}/>
            <CountCard title="Tarefas Pendentes" count="18" message="5 com vencimento hoje" icon={CalendarClock}/>
          </div>
          {/* <Separator className="mt-10 bg-gray-400" /> */}
          <div className="mt-10 grid-cols-2 text-right">
            <Button
              onClick={() => {
                setViewMode("kanban");
              }}
              className={`mr-2 ${
                viewMode === "kanban"
                  ? "bg-white text-black hover:bg-gray-200 hover:text-black"
                  : "bg-zinc-950 text-white hover:bg-zinc-950 hover:text-white"
              }`}
            >
              <Columns3 />
              Kanban
            </Button>
            <Button
              onClick={() => {
                setViewMode("list");
              }}
              className={`${
                viewMode === "list"
                  ? "bg-white text-black hover:bg-gray-200 hover:text-black"
                  : "bg-zinc-950 text-white hover:bg-zinc-950 hover:text-white"
              }`}
            >
              <Rows3 />
              List
            </Button>
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
                      <p className="text-white">{step.name}</p>
                      {/* Mapear leads do step */}
                        <CardKanban />
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
