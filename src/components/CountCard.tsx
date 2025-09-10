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
    <Card>
      <CardHeader>
        <CardTitle>Total de Leads</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
        <CardAction>
          <BookUser />
        </CardAction>
      </CardHeader>
      <CardContent>
        <h1>245</h1>
      </CardContent>
      <CardFooter>
        <p>+12% em relação ao mês anterior</p>
      </CardFooter>
    </Card>
  );
}
