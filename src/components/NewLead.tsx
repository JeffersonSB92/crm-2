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

export function DrawerDialogDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-zinc-100 text-black hover:bg-zinc-300">
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
        <NewLead />
      </DialogContent>
    </Dialog>
  );
}

export default function NewLead({ className }: React.ComponentProps<"form">) {
  return (
    <form className={cn("grid items-start gap-6", className)}>
      <div className="grid gap-3">
        <Label htmlFor="Nome">Nome</Label>
        <Input id="nome" placeholder="Insira o nome do lead..." />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="Insira o email do lead..."
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" placeholder="Insira o telefone do lead..." />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="company">Empresa</Label>
        <Input id="company" placeholder="Insira o nome da empresa do lead..." />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="occupation">Cargo</Label>
        <Input id="occupation" placeholder="Insira o cargo do lead..." />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="occupation">Status</Label>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o status..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="apple">Novo</SelectItem>
              <SelectItem value="banana">Em Andamento</SelectItem>
              <SelectItem value="blueberry">Proposta</SelectItem>
              <SelectItem value="grapes">Perdido</SelectItem>
              <SelectItem value="pineapple">Fechado</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );
}
