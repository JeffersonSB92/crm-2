"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  SlidersHorizontal,
  Users,
  Mail,
  MessageSquare,
  FileChartPie,
  Funnel,
  ChevronDown,
  Boxes,
  Building2,
  UserCircle2,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function SideBar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <LayoutDashboard className="h-4 w-4" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      {/* Desktop Sidebar */}
      <div className="hidden w-[200px] flex-col border-r bg-background md:flex">
        <SidebarContent />
      </div>
    </>
  )
}

function SidebarContent() {
  const pathname = usePathname()

  const linkClasses = (href: string) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all 
    ${pathname === href ? "bg-gray-600 text-white" : "text-white hover:bg-accent hover:text-accent-foreground"}`

  return (
    <div className="flex h-full flex-col w-52 h-screen bg-[#293b4a] text-white flex flex-col p-2">
      {/* Header */}
      <div className="flex h-14 items-center border-b px-2">
        <Image src="/slothIcon.svg" alt="Seedly CRM" width={40} height={40} />
        <h2 className="text-1xl font-bold ml-2">Seedly CRM</h2>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {/* Dashboard */}
          <Link href="/" className={linkClasses("/")}>
            <Home className="h-4 w-4" />
            Dashboard
          </Link>

          {/* Gestão */}
          <Collapsible className="group">
            <CollapsibleTrigger
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 transition-all ${
                pathname.startsWith("/gestao")
                  ? "bg-[#293b4a] text-white"
                  : "text-white hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Gestão</span>
              </div>
              <ChevronDown className="h-4 w-4 transition-all group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-10 text-xs">
              <nav className="grid gap-1 py-2">
                <Link href="/gestao/empresas" className={linkClasses("/gestao/empresas")}>
                  <Building2 className="h-4 w-4" />
                  Empresas
                </Link>
                <Link href="/gestao/pessoas" className={linkClasses("/gestao/pessoas")}>
                  <UserCircle2 className="h-4 w-4" />
                  Pessoas
                </Link>
                <Link href="/gestao/produtos" className={linkClasses("/gestao/produtos")}>
                  <Boxes className="h-4 w-4" />
                  Produtos
                </Link>
              </nav>
            </CollapsibleContent>
          </Collapsible>

          {/* Funis */}
          <Link href="/funis" className={linkClasses("/funis")}>
            <Funnel className="h-4 w-4" />
            Funis
          </Link>

          {/* Equipe */}
          <Link href="/equipe" className={linkClasses("/equipe")}>
            <Users className="h-4 w-4" />
            Equipe
          </Link>

          {/* Emails */}
          <Link href="/emails" className={linkClasses("/emails")}>
            <Mail className="h-4 w-4" />
            Emails
          </Link>

          {/* Mensagens */}
          <Link href="/mensagens" className={linkClasses("/mensagens")}>
            <MessageSquare className="h-4 w-4" />
            Mensagens
          </Link>

          {/* Relatórios */}
          <Link href="/relatorios" className={linkClasses("/relatorios")}>
            <FileChartPie className="h-4 w-4" />
            Relatórios
          </Link>
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t p-4">
        <nav className="grid gap-1">
          <Link href="/config" className={linkClasses("/config")}>
            <Settings className="h-4 w-4" />
            Configurações
          </Link>
          <Link href="/logout" className={linkClasses("/logout")}>
            <LogOut className="h-4 w-4" />
            Sair
          </Link>
        </nav>
      </div>
    </div>
  )
}
