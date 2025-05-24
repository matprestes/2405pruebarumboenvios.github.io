
"use client";

import { useState, useEffect } from "react";
import type { Shipment } from "@/lib/types";
import { PageTitle } from "@/components/ui/page-title";
import { DataTable } from "@/components/data-table";
import { getShipmentColumns } from "@/components/shipments/shipment-columns";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Placeholder for Shipment Detail Dialog/Modal and Edit/Delete Modals
// import { ShipmentDetailDialog } from "@/components/shipments/shipment-detail-dialog"; 

const initialShipments: Shipment[] = [
  { id: "ENV001", origin: "Bodega Central, CDMX", destination: "Cliente A, Guadalajara", clientName: "Empresa XYZ", courierName: "Pedro Páramo", status: "In Transit", creationDate: "2024-07-15T10:00:00Z", estimatedDeliveryDate: "2024-07-18T17:00:00Z", packageDetails: { weightKg: 5, dimensionsCm: "30x20x10", description: "Electrónicos", type: 'Medium Box'}, cost: 150.00 },
  { id: "ENV002", origin: "Almacén Norte, Monterrey", destination: "Oficina Sur, Puebla", clientName: "Particular Juan Pérez", status: "Delivered", creationDate: "2024-07-10T14:30:00Z", estimatedDeliveryDate: "2024-07-12T12:00:00Z", packageDetails: { weightKg: 1.5, dimensionsCm: "15x10x5", description: "Documentos Urgentes", type: 'Envelope'}, cost: 80.50 },
  { id: "ENV003", origin: "Tienda Centro, Querétaro", destination: "Sucursal Este, León", clientName: "Comercializadora Sol", status: "Pending", creationDate: "2024-07-16T09:15:00Z", packageDetails: { weightKg: 22, dimensionsCm: "60x40x30", description: "Material de Oficina", type: 'Large Box'}, cost: 220.00 },
];

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  // const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setShipments(initialShipments);
  }, []);

  const handleViewDetails = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    // setIsDetailDialogOpen(true);
    toast({ title: "Ver Detalles", description: `Mostrando detalles para envío ${shipment.id}. (Funcionalidad de diálogo pendiente)`});
  };

  const handleEdit = (shipment: Shipment) => {
    toast({ title: "Editar Envío", description: `Funcionalidad de edición para ${shipment.id} próximamente.` });
  };

  const handleDelete = (shipment: Shipment) => {
    toast({ title: "Eliminar Envío", description: `Funcionalidad de eliminación para ${shipment.id} próximamente.`, variant: "destructive" });
  };
  
  const handleAddNewShipment = () => {
    // This would typically open a form or navigate to a new shipment page
    toast({ title: "Nuevo Envío", description: "Funcionalidad para crear nuevo envío próximamente." });
  };

  const columns = getShipmentColumns(handleViewDetails, handleEdit, handleDelete);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <PageTitle>Gestión de Envíos</PageTitle>
        <Button onClick={handleAddNewShipment}>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Envío
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={shipments}
        searchKey="id" // Or clientName, destination etc.
        searchPlaceholder="Buscar por ID, cliente, destino..."
      />
      {/* 
      {selectedShipment && (
        <ShipmentDetailDialog 
          isOpen={isDetailDialogOpen} 
          onClose={() => setIsDetailDialogOpen(false)} 
          shipment={selectedShipment} 
        />
      )}
      */}
    </div>
  );
}
