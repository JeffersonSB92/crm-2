"use client";

import "./globals.css";
import SideBar from "@/components/SideBar";
import CountCard from "@/components/CountCard";
import UserList from "@/components/UserList";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Inbox,
  Clock1,
  CircleCheckBig,
  CalendarClock,
} from "lucide-react";
import NewLead, { DrawerDialogDemo } from "@/components/NewLead";
import { useEffect, useState } from "react";
import { CardKanban } from "@/components/CardKanban";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StepWithLeads, LeadCard } from "@/models/Steps"; // novo type com leads embutidos
import { getKanbanData, moveLeadToNextStep, deleteLead } from "@/controllers/kanbanController"; // novo controller
// import { deleteLead } from "@/controllers/leadsController";
import { supabase } from "@/lib/supabaseClient";
import { DroppableArea } from "@/components/DroppableArea";
import { DraggableItem } from "@/components/DraggableItem";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RootLayout({ }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [steps, setSteps] = useState<StepWithLeads[]>([]);
  const [loading, setLoading] = useState(true);
  const [movingLead, setMovingLead] = useState<string | null>(null);
  const [activeLead, setActiveLead] = useState<LeadCard | null>(null);

  // Configuração dos sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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

  // Função para mover lead para próxima etapa
  const handleMoveLead = async (leadId: string, currentStepId: string) => {
    setMovingLead(leadId);

    try {
      const success = await moveLeadToNextStep(leadId, currentStepId, steps);

      if (success) {
        // Atualizar estado local
        setSteps(prevSteps => {
          const newSteps = [...prevSteps];

          // Encontrar índices das etapas
          const currentStepIndex = newSteps.findIndex(step => step.step_id === currentStepId);
          const nextStepIndex = currentStepIndex + 1;

          if (currentStepIndex !== -1 && nextStepIndex < newSteps.length) {
            // Encontrar o lead na etapa atual
            const leadIndex = newSteps[currentStepIndex].leads.findIndex(lead => lead.lead_id === leadId);

            if (leadIndex !== -1) {
              // Remover lead da etapa atual
              const [movedLead] = newSteps[currentStepIndex].leads.splice(leadIndex, 1);

              // Atualizar step_id do lead
              movedLead.step_id = newSteps[nextStepIndex].step_id;

              // Adicionar lead na próxima etapa
              newSteps[nextStepIndex].leads.push(movedLead);
            }
          }

          return newSteps;
        });
      }
    } catch (error) {
      console.error("Erro ao mover lead:", error);
    } finally {
      setMovingLead(null);
    }
  };

  // Funções para drag and drop
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const leadId = active.id as string;
    const lead = steps.flatMap(step => step.leads).find(l => l.lead_id === leadId);
    setActiveLead(lead || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !activeLead) {
      setActiveLead(null);
      return;
    }

    const leadId = active.id as string;
    const targetStepId = over.id as string;
    const currentStepId = activeLead.step_id;

    // Se o lead já está na mesma coluna, não faz nada
    if (currentStepId === targetStepId) {
      setActiveLead(null);
      return;
    }

    setMovingLead(leadId);

    try {
      // Atualizar no banco de dados
      const { error } = await supabase
        .from("lead")
        .update({
          step_id: targetStepId,
          ultima_atualizacao: new Date().toISOString()
        })
        .eq("lead_id", leadId);

      if (error) {
        console.error("Erro ao mover lead:", error);
        return;
      }

      // Atualizar estado local
      setSteps(prevSteps => {
        const newSteps = [...prevSteps];

        // Encontrar índices das etapas
        const currentStepIndex = newSteps.findIndex(step => step.step_id === currentStepId);
        const targetStepIndex = newSteps.findIndex(step => step.step_id === targetStepId);

        if (currentStepIndex !== -1 && targetStepIndex !== -1) {
          // Encontrar o lead na etapa atual
          const leadIndex = newSteps[currentStepIndex].leads.findIndex(lead => lead.lead_id === leadId);

          if (leadIndex !== -1) {
            // Remover lead da etapa atual
            const [movedLead] = newSteps[currentStepIndex].leads.splice(leadIndex, 1);

            // Atualizar step_id do lead
            movedLead.step_id = targetStepId;

            // Adicionar lead na nova etapa
            newSteps[targetStepIndex].leads.push(movedLead);
          }
        }

        return newSteps;
      });
    } catch (error) {
      console.error("Erro ao mover lead:", error);
    } finally {
      setMovingLead(null);
      setActiveLead(null);
    }
  };

  // Função para excluir lead
  const handleDeleteLead = async (leadId: string) => {
    setMovingLead(leadId);

    try {
      const success = await deleteLead(leadId);

      if (success) {
        // Atualizar estado local
        setSteps(prevSteps => {
          const newSteps = [...prevSteps];

          // Encontrar e remover o lead de todas as etapas
          newSteps.forEach(step => {
            step.leads = step.leads.filter(lead => lead.lead_id !== leadId);
          });

          return newSteps;
        });
      }
    } catch (error) {
      console.error("Erro ao excluir lead:", error);
    } finally {
      setMovingLead(null);
    }
  };

  return (
    <html lang="pt-br">
      <body className="flex h-screen overflow-hidden">
        <SideBar />

        <main className="flex-1 p-6 bg-[#0d1b2a] overflow-y-auto">
          <div className="flex items-center justify-center max-w-screen">
            <p className="text-5xl font-extrabold text-zinc-200">DASHBOARD</p>
            <div className="absolute right-8">
              <DrawerDialogDemo
                steps={steps}
                onLeadCreated={async () => {
                  // Recarregar dados do Kanban
                  try {
                    const updatedSteps = await getKanbanData("de80ed4e-7d4d-4aad-8ae2-2af841beac63");
                    setSteps(updatedSteps);
                  } catch (error) {
                    console.error("Erro ao recarregar dados:", error);
                  }
                }}
              />
            </div>
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

          <div className="text-white mt-6 flex-1 flex flex-col">
            {viewMode === "kanban" ? (
              loading ? (
                <p>Carregando etapas...</p>
              ) : (
                <DndContext
                  sensors={sensors}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex gap-6 w-full flex-1">
                    {steps.map((step) => (
                      <DroppableArea
                        key={step.step_id}
                        id={step.step_id}
                        className="flex flex-col flex-1 bg-[#1e293b] rounded-lg p-4 min-h-[600px]"
                      >
                        {/* Cabeçalho da coluna */}
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-white font-bold text-lg">{step.name}</h3>
                          <span className="text-gray-400 text-sm bg-gray-600 px-2 py-1 rounded">
                            {step.leads.length}
                          </span>
                        </div>

                        {/* Lista de cards dos leads */}
                        <div className="flex flex-col gap-3 mb-4">
                          {step.leads.map((lead: LeadCard) => {
                            const isLastStep = steps.indexOf(step) === steps.length - 1;
                            const isMoving = movingLead === lead.lead_id;
                            const formatedDate = new Date(lead.ultima_atualizacao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

                            return (
                              <DraggableItem
                                key={lead.lead_id}
                                id={lead.lead_id}
                              >
                                <CardKanban
                                  nome={lead.nome}
                                  empresa={lead.empresa}
                                  ultima_atualizacao={formatedDate}
                                  atividade={lead.atividade}
                                  iniciais={lead.iniciais}
                                  lead_id={lead.lead_id}
                                  step_id={lead.step_id}
                                  onMoveLead={handleMoveLead}
                                  onDeleteLead={handleDeleteLead}
                                  canMoveForward={!isLastStep && !isMoving}
                                  isMoving={isMoving}
                                />
                              </DraggableItem>
                            );
                          })}
                        </div>

                        {/* Botão para adicionar lead */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="lg"
                              className="bg-zinc-100 text-black hover:bg-zinc-300 w-full"
                            >
                              + Adicionar Lead
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] bg-zinc-100">
                            <DialogHeader>
                              <DialogTitle>Adicionar Lead</DialogTitle>
                              <DialogDescription>
                                Preencha as informações para criação do lead.
                              </DialogDescription>
                            </DialogHeader>
                            <NewLead
                              steps={steps}
                              onLeadCreated={async () => {
                                // Recarregar dados do Kanban
                                try {
                                  const updatedSteps = await getKanbanData("de80ed4e-7d4d-4aad-8ae2-2af841beac63");
                                  setSteps(updatedSteps);
                                } catch (error) {
                                  console.error("Erro ao recarregar dados:", error);
                                }
                              }}
                            />
                          </DialogContent>
                        </Dialog>
                      </DroppableArea>
                    ))}
                  </div>
                </DndContext>
              )
            ) : (
              <UserList
                data={steps.flatMap(step =>
                  step.leads.map((lead: LeadCard) => ({
                    lead_id: lead.lead_id,
                    nome: lead.nome,
                    iniciais: lead.iniciais,
                    empresa: lead.empresa,
                    status: step.name,
                    valor: lead.valor ?? 0,
                    email: lead.email
                  }))
                )}
              />
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
