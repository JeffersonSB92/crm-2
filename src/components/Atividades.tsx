'use client';

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Clock } from "lucide-react";
import { Button } from "./ui/button";

type Task = {
  id: string
  title: string
  time: string
  date: string
  contact: {
    name: string
    avatar: string
  }
}

export default function AtividadesPage() {
  const [viewMode, setViewMode] = useState<"dia" | "semana" | "mes">("dia");
  const tasks: Task[] = [
    {
      id: "1",
      title: "Reunião com Carlos Silva",
      time: "10:00 - 11:00",
      date: "Hoje",
      contact: {
        name: "Carlos Silva",
        avatar: "",
      },
    },
    {
      id: "2",
      title: "Ligar para Ana Oliveira",
      time: "14:30 - 15:00",
      date: "Hoje",
      contact: {
        name: "Ana Oliveira",
        avatar: "",
      },
    },
    {
      id: "3",
      title: "Enviar proposta para Roberto",
      time: "16:00 - 16:30",
      date: "Amanhã",
      contact: {
        name: "Roberto Almeida",
        avatar: "",
      },
    },
    {
      id: "4",
      title: "Acompanhamento com Juliana",
      time: "11:00 - 12:00",
      date: "Quinta-feira",
      contact: {
        name: "Juliana Costa",
        avatar: "",
      },
    },
  ]

  const filteredTasks = tasks.filter((task) => {
    if (viewMode === "dia") return task.date === "Hoje";
    if (viewMode === "semana") return ["Hoje", "Amanhã", "Quinta-feira"].includes(task.date);
    return true; // mês = todas
  });

  return (
    <div className="p-2">
      <h1 className="text-3xl font-bold">Agenda e Atividades</h1>
      <div className="mt-4 grid-cols-2 text-left">
        <Tabs defaultValue="dia">
          <TabsList className="bg-zinc-200">
            <TabsTrigger value="dia" className="data-[state=active]:bg-[#232323] data-[state=active]:text-white" onClick={() => setViewMode("dia")}>Hoje</TabsTrigger>
            <TabsTrigger value="semana" className="data-[state=active]:bg-[#232323] data-[state=active]:text-white" onClick={() => setViewMode("semana")}>Esta Semana</TabsTrigger>
            <TabsTrigger value="mes" className="data-[state=active]:bg-[#232323] data-[state=active]:text-white" onClick={() => setViewMode("mes")}>Este Mês</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-6 space-y-4">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500">Nenhuma atividade encontrada.</p>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className="overflow-hidden">
              <CardContent className="">
                <div className="flex items-start gap-3">
                  <Avatar className="mt-1 h-8 w-8">
                    <AvatarImage src={task.contact.avatar} alt={task.contact.name} />
                    <AvatarFallback className="text-xs">
                      {task.contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="font-medium leading-none">{task.title}</div>
                    <div className="flex">
                      <div className="text-sm text-muted-foreground">{task.date}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground ml-4">
                        <Clock className="h-3 w-3" />
                        <span>{task.time}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8">
                    Concluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
