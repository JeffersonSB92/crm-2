'use client'

import "./globals.css";
import SideBar from "@/components/SideBar";
import CountCard from "@/components/CountCard";
import UserList from "@/components/UserList";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Columns3, Rows3 } from "lucide-react";
import { DrawerDialogDemo } from "@/components/NewLead";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [viewMode, setViewMode] = useState<"kanban" | "list">("list");

  return (
    <html lang="pt-br">
      <body className="flex">
        {/* Sidebar fixa */}
        <SideBar />

        {/* Conteúdo principal */}
        <main className="flex-1 p-6 bg-zinc-950 min-h-screen">
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
          <Separator className="mt-10 bg-gray-400" />
          <div className="mt-10 grid-cols-2 text-right">
            <Button
              onClick={() => setViewMode("kanban")}
              className={`mr-2 ${viewMode === "kanban" ? "bg-zinc-950 text-white hover:bg-zinc-950 hover:text-white" : "bg-white text-black hover:bg-gray-200 hover:text-black"}`}
            >
              <Columns3 />
              Kanban</Button>
            <Button
              onClick={() => setViewMode("list")}
              className={`${viewMode === "list" ? "bg-zinc-950 text-white hover:bg-zinc-950 hover:text-white" : "bg-white text-black hover:bg-gray-200 hover:text-black"}`}
            >
              <Rows3 />
              List</Button>
          </div>
          <div className="text-white">
            <UserList />
          </div>
        </main>
      </body>
    </html>
  );
}
