import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export interface CountCardProps {
  title: string,
  count: string,
  message: string,
  icon: React.ElementType;
}

export default function CountCard({ title, count, message, icon: Icon} : CountCardProps) {
  return (
    <Card className="bg-[#293b4a] text-zinc-100 border-[#555e6a] border-1 min-h-[100px] p-3">
      <CardHeader className="pl-3 pb-0 font-bold p-0"> {title}
        {/* <CardTitle className="text-sm">Total de Leads</CardTitle> */}
        {/* <CardDescription>Card Description</CardDescription> */}
        <CardAction>
          <Icon className="text-zinc-200 font-bold"/>
        </CardAction>
      </CardHeader>
      <CardContent className="pl-3 pt-0">
        <h1 className="text-3xl font-bold pb-4">{count}</h1>
        <p className="text-xs text-zinc-100">{message} em relação ao mês anterior</p>
      </CardContent>
    </Card>
  );
}
