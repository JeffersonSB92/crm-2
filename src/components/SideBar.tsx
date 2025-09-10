"use client";

import Link from "next/link";
import { Home, Funnel, Users, Settings, Mail, MessageSquareMore, FileChartPie } from "lucide-react";

export default function SideBar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-8">Meu CRM</h2>
      <nav className="space-y-4">
        <Link href="/" className="flex items-center gap-2 hover:text-gray-300">
          <Home size={20} /> Dashboard
        </Link>
        <Link href="/pessoas" className="flex items-center gap-2 hover:text-gray-300">
          <Funnel size={20} /> Funis
        </Link>
        <Link href="/config" className="flex items-center gap-2 hover:text-gray-300">
          <Users size={20} /> Equipe
        </Link>
        <Link href="/config" className="flex items-center gap-2 hover:text-gray-300">
          <Mail size={20} /> Emails
        </Link>
        <Link href="/config" className="flex items-center gap-2 hover:text-gray-300">
          <MessageSquareMore size={20} /> Mensagens
        </Link>
        <Link href="/config" className="flex items-center gap-2 hover:text-gray-300">
          <FileChartPie size={20} /> Relatórios
        </Link>
      </nav>
    </aside>
  );
}
