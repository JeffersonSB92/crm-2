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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListPlus } from "lucide-react";
import { createLead, CreateLeadData } from "@/controllers/kanbanController";
import { StepWithLeads } from "@/models/Steps";
import { EmpresaSelector } from "@/components/EmpresaSelector";

interface DrawerDialogDemoProps {
  steps: StepWithLeads[]
  onLeadCreated: () => void
}

export function DrawerDialogDemo({ steps, onLeadCreated }: DrawerDialogDemoProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-zinc-200 text-black hover:bg-zinc-300">
          <ListPlus /> Novo Lead
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
          onLeadCreated={() => {
            onLeadCreated()
            setOpen(false)
          }} 
        />
      </DialogContent>
    </Dialog>
  );
}

interface NewLeadProps {
  className?: string
  steps: StepWithLeads[]
  onLeadCreated: () => void
}

export default function NewLead({ className, steps, onLeadCreated }: NewLeadProps) {
  const [formData, setFormData] = React.useState({
    nome: "",
    email: "",
    telefone: "",
    empresa_id: "",
    cargo: "",
    step_id: ""
  });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.step_id || !formData.empresa_id) {
      alert("Por favor, preencha pelo menos Nome, Email, Empresa e Etapa");
      return;
    }

    setLoading(true);
    
    try {
      const leadData: CreateLeadData = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        empresa_id: formData.empresa_id,
        cargo: formData.cargo,
        step_id: formData.step_id
      };

      const result = await createLead(leadData);
      
      if (result) {
        // Limpar formulário
        setFormData({
          nome: "",
          email: "",
          telefone: "",
          empresa_id: "",
          cargo: "",
          step_id: ""
        });
        
        // Notificar componente pai
        onLeadCreated();
      } else {
        alert("Erro ao criar lead. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao criar lead:", error);
      alert("Erro ao criar lead. Tente novamente.");
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
          placeholder="Insira o nome do lead..." 
          value={formData.nome}
          onChange={(e) => setFormData({...formData, nome: e.target.value})}
          required
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="email">Email *</Label>
        <Input
          type="email"
          id="email"
          placeholder="Insira o email do lead..."
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="telefone">Telefone</Label>
        <Input 
          id="telefone" 
          placeholder="Insira o telefone do lead..." 
          value={formData.telefone}
          onChange={(e) => setFormData({...formData, telefone: e.target.value})}
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="empresa">Empresa *</Label>
        <EmpresaSelector
          value={formData.empresa_id}
          onValueChange={(value) => setFormData({...formData, empresa_id: value})}
          placeholder="Selecione uma empresa..."
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="cargo">Cargo</Label>
        <Input 
          id="cargo" 
          placeholder="Insira o cargo do lead..." 
          value={formData.cargo}
          onChange={(e) => setFormData({...formData, cargo: e.target.value})}
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="etapa">Etapa *</Label>
        <Select value={formData.step_id} onValueChange={(value) => setFormData({...formData, step_id: value})}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione a etapa..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Etapas</SelectLabel>
              {steps.map((step) => (
                <SelectItem key={step.step_id} value={step.step_id}>
                  {step.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Criando..." : "Criar Lead"}
      </Button>
    </form>
  );
}
