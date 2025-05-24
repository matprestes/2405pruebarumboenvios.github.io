
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";
import { DollarSign, Package, Truck, Users } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const stats = [
    { title: "Ingresos Totales", value: "$12,345", icon: DollarSign, change: "+20.1% desde el mes pasado", dataAiHint: "money graph" },
    { title: "Envíos Activos", value: "235", icon: Truck, change: "+180.1% desde el mes pasado", dataAiHint: "delivery truck" },
    { title: "Clientes Nuevos", value: "45", icon: Users, change: "+19% desde el mes pasado", dataAiHint: "people meeting" },
    { title: "Paquetes Pendientes", value: "89", icon: Package, change: "+5 desde ayer", dataAiHint: "boxes packages" },
  ];

  return (
    <div className="flex flex-col space-y-6">
      <PageTitle>Dashboard RumbosEnvios</PageTitle>
      <p className="text-muted-foreground">Bienvenido al panel de control de RumbosEnvios. Aquí puedes ver un resumen de la actividad reciente.</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No hay actividad reciente para mostrar.</p>
            {/* Placeholder for recent activity feed */}
            <div className="mt-4 h-48 rounded-md border border-dashed border-border flex items-center justify-center">
              <span className="text-muted-foreground">Gráfico de actividad</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mapa de Envíos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Mapa de envíos placeholder" 
              width={600} 
              height={400}
              className="rounded-md object-cover"
              data-ai-hint="world map"
            />
            <p className="text-sm text-muted-foreground mt-2">Visualización de ubicaciones de envío activas.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
