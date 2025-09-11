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

export function CardKanban() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Fernanda Lima</CardTitle>
        <CardDescription>Consultoria empresarial</CardDescription>
        <CardAction>
          <Button variant="ghost">...</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1">
          <Badge variant="outline">R$ 18.000</Badge>
          <Badge variant="secondary">Serviços</Badge>
          <Badge variant="secondary">Consultoria</Badge>
        </div>
        <p className="text-sm mt-4 text-zinc-500 flex items-center gap-1">
          <Clock size={12} />
          Hoje
        </p>
        <p className="text-sm text-zinc-500 flex items-center gap-1">
          <MoveRight size={12} />
          Qualificar Lead
        </p>
      </CardContent>
      <CardFooter className="grid-col-2 justify-between">
        <div className="grid grid-cols-3 items-center">
          <Avatar className="mr-2">
            <AvatarFallback>FL</AvatarFallback>
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
