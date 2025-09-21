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
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Phone, Clock, MoveRight, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface CardKanbanProps {
  nome: string,
  empresa: string,
  ultima_atualizacao: string,
  atividade: string,
  iniciais: string,
  lead_id: string,
  step_id: string,
  onMoveLead?: (leadId: string, currentStepId: string) => void,
  onDeleteLead?: (leadId: string) => void,
  canMoveForward?: boolean,
  isMoving?: boolean,
}

export function CardKanban({ 
  nome, 
  empresa, 
  ultima_atualizacao, 
  atividade, 
  iniciais, 
  lead_id, 
  step_id, 
  onMoveLead, 
  onDeleteLead,
  canMoveForward = true,
  isMoving = false
} : CardKanbanProps) {
  
  const handleMoveForward = () => {
    if (onMoveLead && canMoveForward && !isMoving) {
      onMoveLead(lead_id, step_id)
    }
  };

  const handleDelete = () => {
    if (onDeleteLead && !isMoving) {
      onDeleteLead(lead_id);
    }
  };

  return (
    <Card className={`w-full max-w-sm bg-[#293b4a] ${isMoving ? 'opacity-50 animate-pulse' : ''}`}>
      <CardHeader>
        <CardTitle className="text-white">{nome}</CardTitle>
        <CardDescription className="text-white">{empresa}</CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-600">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900">Excluir Lead</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                      Tem certeza que deseja excluir o lead <strong className="text-gray-900">&quot;{nome}&quot;</strong>?
                      <br />
                      <br />
                      Esta ação não pode ser desfeita e o lead será removido permanentemente do sistema.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div>
        <p className="text-sm mt-4 text-white flex items-center gap-1">
          <Clock size={12} />
          {ultima_atualizacao}
        </p>
        <p className="text-sm text-white flex items-center gap-1">
          <MoveRight size={12} />
          {atividade}
        </p>
        </div>
      </CardContent>
      <CardFooter className="grid-col-2 justify-between">
        <div className="grid grid-cols-3 items-center">
          <Avatar className="mr-2">
            <AvatarFallback className="bg-white text-black">{iniciais}</AvatarFallback>
          </Avatar>
          <Button variant="ghost" className="text-white hover:text-black">
            <Phone size={18}/>
          </Button>
        </div>
        <Button 
          variant="ghost" 
          className="justify-end text-white"
          onClick={handleMoveForward}
          disabled={!canMoveForward || isMoving}
        >
          {isMoving ? "Movendo..." : "Avançar"}
        </Button>
      </CardFooter>
    </Card>
  );
}
