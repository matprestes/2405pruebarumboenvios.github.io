
"use client";

import { useState, useEffect } from "react";
import type { ShipmentWithRelations } from "@/lib/types";
import { PageTitle } from "@/components/ui/page-title";
import { DataTable } from "@/components/data-table";
import { getShipmentColumns } from "@/components/shipments/shipment-columns";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getShipments, deleteShipment as deleteShipmentAction } from './actions'; 
// Placeholder for Shipment Detail Dialog/Modal and Edit/Delete Modals
// import { ShipmentFormDialog } from "@/components/shipments/shipment-form-dialog"; 

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<ShipmentWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [selectedShipment, setSelectedShipment] = useState<ShipmentWithRelations | null>(null);
  // const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  // const [isFormOpen, setIsFormOpen] = useState(false);
  // const [editingShipment, setEditingShipment] = useState<ShipmentWithRelations | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchShipments = async () => {
      setIsLoading(true);
      const fetchedShipments = await getShipments();
      setShipments(fetchedShipments);
      setIsLoading(false);
    };
    fetchShipments();
  }, []);

  const handleViewDetails = (shipment: ShipmentWithRelations) => {
    // setSelectedShipment(shipment);
    // setIsDetailDialogOpen(true);
    toast({ title: "Ver Detalles", description: `Mostrando detalles para envío ${shipment.id}. (Funcionalidad de diálogo pendiente)`});
  };

  const handleEdit = (shipment: ShipmentWithRelations) => {
    // setEditingShipment(shipment);
    // setIsFormOpen(true);
    toast({ title: "Editar Envío", description: `Funcionalidad de edición para ${shipment.id} próximamente.` });
  };

  const handleDelete = async (shipment: ShipmentWithRelations) => {
    // Implement confirmation dialog before deleting
    const confirmed = confirm(`¿Estás seguro de que quieres eliminar el envío ${shipment.id}?`);
    if (confirmed && shipment.id) {
      const result = await deleteShipmentAction(shipment.id);
      if (result.error) {
        toast({ variant: "destructive", title: "Error al eliminar", description: result.error });
      } else {
        setShipments(shipments.filter(s => s.id !== shipment.id));
        toast({ title: "Envío Eliminado", description: `El envío ${shipment.id} ha sido eliminado.` });
      }
    }
  };
  
  const handleAddNewShipment = () => {
    // setEditingShipment(null);
    // setIsFormOpen(true);
    toast({ title: "Nuevo Envío", description: "Funcionalidad para crear nuevo envío próximamente." });
  };

  const columns = getShipmentColumns(handleViewDetails, handleEdit, handleDelete);
  
  if (isLoading) {
    return <div className="container mx-auto py-8"><PageTitle>Gestión de Envíos</PageTitle><p>Cargando envíos...</p></div>;
  }

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
        searchKey="id" 
        searchPlaceholder="Buscar por ID, cliente, destino..."
      />
      {/* 
      {isFormOpen && (
        <ShipmentFormDialog 
          isOpen={isFormOpen} 
          onClose={() => { setIsFormOpen(false); setEditingShipment(null); }} 
          onSubmit={handleFormSubmit} // Implement this
          shipment={editingShipment} 
        />
      )}
      {selectedShipment && isDetailDialogOpen && (
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
