
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ShipmentWithRelations } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const getShipmentColumns = (
    onViewDetails: (shipment: ShipmentWithRelations) => void,
    onEdit: (shipment: ShipmentWithRelations) => void,
    onDelete: (shipment: ShipmentWithRelations) => void
): ColumnDef<ShipmentWithRelations>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        ID Envío <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium uppercase">{row.original.id.substring(0,8)}</div>
  },
  {
    accessorKey: "clients.name", // Access nested client name
    header: "Cliente",
    cell: ({ row }) => row.original.clients?.name || 'N/A',
  },
  {
    accessorKey: "origin",
    header: "Origen",
    cell: ({ row }) => <div className="truncate max-w-[150px]">{row.original.origin}</div>
  },
  {
    accessorKey: "destination",
    header: "Destino",
    cell: ({ row }) => <div className="truncate max-w-[150px]">{row.original.destination}</div>
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
      let className = "";
      switch (status) {
        case "Pending": variant = "secondary"; break;
        case "In Transit": variant = "outline"; className = "border-accent text-accent"; break;
        case "Delivered": variant = "default"; break;
        case "Cancelled": variant = "destructive"; break;
        case "Issue": variant = "destructive"; className = "bg-yellow-500 text-white border-yellow-500"; break;
      }
      return <Badge variant={variant} className={className}>{status}</Badge>;
    },
  },
  {
    accessorKey: "created_at", // Changed from creationDate
    header: "Fecha Creación",
    cell: ({ row }) => format(new Date(row.original.created_at), "dd MMM yyyy", { locale: es }),
  },
  {
    accessorKey: "cost",
    header: "Costo",
    cell: ({row}) => row.original.cost ? `$${Number(row.original.cost).toFixed(2)}` : 'N/A'
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const shipment = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onViewDetails(shipment)}>
              <Eye className="mr-2 h-4 w-4" /> Ver Detalles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(shipment)}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(shipment)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
