"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListPlus } from "lucide-react";
import { createOrg, CreateOrgData } from "@/controllers/organizationController"; // <<< usa o controller novo

interface DrawerDialogDemoProps {
  onOrgCreated: () => void
}

export function NewOrgButton({ onOrgCreated }: DrawerDialogDemoProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-zinc-200 text-black hover:bg-zinc-300">
          Adicionar Organização
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-100">
        <DialogHeader>
          <DialogTitle>Adicionar Organização</DialogTitle>
          <DialogDescription>
            Preencha as informações para criação da organização.
          </DialogDescription>
        </DialogHeader>
        <NewOrg 
          onOrgCreated={() => {
            onOrgCreated()
            setOpen(false)
          }} 
        />
      </DialogContent>
    </Dialog>
  );
}

interface NewOrgProps {
  className?: string
  onOrgCreated?: () => void
}

export default function NewOrg({ className, onOrgCreated }: NewOrgProps) {
  const [formData, setFormData] = React.useState({
    nome: "",
    email: "",
    segmento: "",
    numero_colaboradores: "",
  });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.email) {
      alert("Por favor, preencha pelo menos Nome e Email");
      return;
    }

    setLoading(true);

    try {
      const orgData: CreateOrgData = {
        nome: formData.nome,
        email: formData.email,
        segmento: formData.segmento,
        numero_colaboradores: Number(formData.numero_colaboradores) || 0,
      };

      const result = await createOrg(orgData);

      if (result) {
        // Limpar formulário
        setFormData({
          nome: "",
          email: "",
          segmento: "",
          numero_colaboradores: "",
        });

        // Notificar componente pai
        onOrgCreated?.();
      } else {
        alert("Erro ao criar organização. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao criar organização:", error);
      alert("Erro ao criar organização. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={cn("grid items-start gap-6", className)} onSubmit={handleSubmit}>
      <div className="grid gap-3">
        <Label htmlFor="nome">Nome *</Label>
        <Input 
          id="nome" 
          placeholder="Insira o nome da organização..." 
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="email">Email *</Label>
        <Input
          type="email"
          id="email"
          placeholder="Insira o email da organização..."
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="segmento">Segmento</Label>
        <Input 
          id="segmento" 
          placeholder="Ex: Tecnologia, Saúde, Educação..." 
          value={formData.segmento}
          onChange={(e) => setFormData({ ...formData, segmento: e.target.value })}
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="numero_colaboradores">Número de Colaboradores</Label>
        <Input 
          type="number"
          id="numero_colaboradores" 
          placeholder="Ex: 50"
          value={formData.numero_colaboradores}
          onChange={(e) => setFormData({ ...formData, numero_colaboradores: e.target.value })}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Criando..." : "Criar Organização"}
      </Button>
    </form>
  );
}
