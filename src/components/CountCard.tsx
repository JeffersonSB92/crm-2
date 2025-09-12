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
    <Card className="bg-[#262626] text-zinc-100 border-[#404040] border-1 min-h-[100px] p-3">
      <CardHeader className="pl-3 pb-0 font-bold p-0"> {title}
        {/* <CardTitle className="text-sm">Total de Leads</CardTitle> */}
        {/* <CardDescription>Card Description</CardDescription> */}
        <CardAction>
          <Icon />
        </CardAction>
      </CardHeader>
      <CardContent className="pl-3 pt-0">
        <h1 className="text-3xl font-bold pb-4">{count}</h1>
        <p className="text-xs text-[#a1a1a1]">{message} em relação ao mês anterior</p>
      </CardContent>
    </Card>
  );
}
