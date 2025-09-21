import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEmpresas, createEmpresa } from "@/controllers/leadsController";

interface Empresa {
  empresa_id: string;
  nome: string;
}

interface EmpresaSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function EmpresaSelector({ value, onValueChange, placeholder = "Selecione uma empresa..." }: EmpresaSelectorProps) {
  const [open, setOpen] = useState(false);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEmpresaNome, setNewEmpresaNome] = useState("");

  // Carregar empresas ao montar o componente
  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = async () => {
    setLoading(true);
    try {
      const empresasData = await getEmpresas();
      setEmpresas(empresasData);
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmpresa = async () => {
    if (!newEmpresaNome.trim()) return;

    setLoading(true);
    try {
      const result = await createEmpresa(newEmpresaNome.trim());
      if (result) {
        // Recarregar lista de empresas
        await loadEmpresas();
        // Selecionar a nova empresa
        onValueChange(result.empresa_id);
        // Fechar modais
        setShowCreateModal(false);
        setOpen(false);
        // Limpar input
        setNewEmpresaNome("");
      }
    } catch (error) {
      console.error("Erro ao criar empresa:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedEmpresa = empresas.find(empresa => empresa.empresa_id === value);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedEmpresa ? selectedEmpresa.nome : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar empresa..." />
            <CommandList>
              <CommandEmpty>
                <div className="py-6 text-center text-sm">
                  <p className="mb-2">Nenhuma empresa encontrada.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateModal(true)}
                    className="mt-2"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar nova empresa
                  </Button>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {empresas.map((empresa) => (
                  <CommandItem
                    key={empresa.empresa_id}
                    value={empresa.nome}
                    onSelect={() => {
                      onValueChange(empresa.empresa_id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === empresa.empresa_id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {empresa.nome}
                  </CommandItem>
                ))}
                <CommandItem
                  onSelect={() => setShowCreateModal(true)}
                  className="text-blue-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Criar nova empresa
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Modal para criar nova empresa */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-100">
          <DialogHeader>
            <DialogTitle>Criar Nova Empresa</DialogTitle>
            <DialogDescription>
              Adicione uma nova empresa ao sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="empresa-nome">Nome da Empresa</Label>
              <Input
                id="empresa-nome"
                placeholder="Digite o nome da empresa..."
                value={newEmpresaNome}
                onChange={(e) => setNewEmpresaNome(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateEmpresa();
                  }
                }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setNewEmpresaNome("");
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateEmpresa}
              disabled={!newEmpresaNome.trim() || loading}
            >
              {loading ? "Criando..." : "Criar Empresa"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
