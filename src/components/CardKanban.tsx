import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Phone, Clock, MoveRight } from "lucide-react";

export interface CardKanbanProps {
  nome: string,
  empresa: string,
  ultima_atualizacao: string,
  atividade: string,
  iniciais: string,
}

export function CardKanban({ nome, empresa, ultima_atualizacao, atividade, iniciais } : CardKanbanProps) {
  return (
    <Card className="w-full max-w-sm bg-[#e5e5e5]">
      <CardHeader>
        <CardTitle>${nome}</CardTitle>
        <CardDescription>${empresa}</CardDescription>
        <CardAction>
          <Button variant="ghost">...</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div>
        <p className="text-sm mt-4 text-zinc-500 flex items-center gap-1">
          <Clock size={12} />
          ${ultima_atualizacao}
        </p>
        <p className="text-sm text-zinc-500 flex items-center gap-1">
          <MoveRight size={12} />
          ${atividade}
        </p>
        </div>
      </CardContent>
      <CardFooter className="grid-col-2 justify-between">
        <div className="grid grid-cols-3 items-center">
          <Avatar className="mr-2">
            <AvatarFallback className="bg-zinc-800 text-zinc-100">${iniciais}</AvatarFallback>
          </Avatar>
          <Button variant="ghost">
            <Phone size={18} />
          </Button>
        </div>
        <Button variant="ghost" className="justify-end">
          Avançar
        </Button>
      </CardFooter>
    </Card>
  );
}
