import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { BookUser } from 'lucide-react';

export default function CountCard() {
  return (
    <Card className="bg-zinc-200 text-black border-zinc-700 border-2 min-h-[100px]">
      <CardHeader className="pl-3 pb-0"> Total de Leads
        {/* <CardTitle className="text-sm">Total de Leads</CardTitle> */}
        {/* <CardDescription>Card Description</CardDescription> */}
        <CardAction>
          <BookUser />
        </CardAction>
      </CardHeader>
      <CardContent className="pl-3 pt-0">
        <h1 className="text-xl font-bold">245</h1>
      </CardContent>
      <CardFooter className="pl-3 pt-0">
        <p className="text-xs text-black">+12% em relação ao mês anterior</p>
      </CardFooter>
    </Card>
  );
}
