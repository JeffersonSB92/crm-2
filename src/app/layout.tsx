import "./globals.css";
import SideBar from "@/components/SideBar";
import CountCard from "@/components/CountCard";
import UserList from "@/components/UserList";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ListPlus } from "lucide-react";
import NewLead, { DrawerDialogDemo } from "@/components/NewLead";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="flex">
        {/* Sidebar fixa */}
        <SideBar />

        {/* Conteúdo principal */}
        <main className="flex-1 p-6 bg-gray-100 min-h-screen">
          <div className="text-right">
            {/* <Button variant="outline" size="lg" className="bg-gray-900 text-white">
              <ListPlus /> Novo Lead
            </Button> */}
            <DrawerDialogDemo />
          </div>
          <Separator className="my-4 mt-10 bg-gray-400" />
          <div className="flex grid-cols-4 gap-4">
            <CountCard />
            <CountCard />
            <CountCard />
            <CountCard />
          </div>
          <Separator className="my-4 mt-10 bg-gray-400" />
          <div className="mt-20">
            <UserList />
          </div>
        </main>
      </body>
    </html>
  );
}
