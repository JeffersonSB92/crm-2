"use client";

import "./globals.css";
import SideBar from "@/components/SideBar";
import { Separator } from "@/components/ui/separator";
import { NewLeadButton } from "@/components/NewLead";
import { useState, useEffect } from "react";
import { StepWithLeads, LeadCard } from "@/models/Steps";
import { getKanbanData, moveLeadToNextStep, deleteLead } from "@/controllers/kanbanController";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  const [steps, setSteps] = useState<StepWithLeads[]>([]);

  return (
    <html lang="pt-br">
      <body className="flex h-screen overflow-hidden">
        <SideBar />

        <main className="flex-1 p-2 bg-[#0d1b2a] overflow-y-auto">
          <div className="flex items-center justify-between w-full p-4">
            <p className="text-5xl font-extrabold text-zinc-200 text-center flex-1">
              DASHBOARD
            </p>
            <NewLeadButton
              steps={steps}
              onLeadCreated={async () => {
                try {
                  const updatedSteps = await getKanbanData("de80ed4e-7d4d-4aad-8ae2-2af841beac63");
                  setSteps(updatedSteps);
                } catch (error) {
                  console.error("Erro ao recarregar dados:", error);
                }
              }}
            />
          </div>
          <Separator className="mb-4 my-2 bg-gray-400" />
          {children}
        </main>
      </body>
    </html>
  );
}
