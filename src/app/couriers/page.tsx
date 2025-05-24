
"use client";

import { useState, useEffect } from "react";
import type { Courier } from "@/lib/types";
import { PageTitle } from "@/components/ui/page-title";
import { DataTable } from "@/components/data-table";
import { getCourierColumns } from "@/components/couriers/courier-columns";
import { CourierFormDialog } from "@/components/couriers/courier-form-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const initialCouriers: Courier[] = [
  { id: "cour1", name: "Miguel Ángel", vehicleType: "Motorcycle", plateNumber: "MOTO-01", phone: "555-0301", status: "Available" },
  { id: "cour2", name: "Lucía Fernández", vehicleType: "Van", plateNumber: "VAN-007", phone: "555-0302", status: "On Delivery" },
  { id: "cour3", name: "David Jiménez", vehicleType: "Bicycle", plateNumber: "BICI-03", phone: "555-0303", status: "Offline" },
];

export default function CouriersPage() {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourier, setEditingCourier] = useState<Courier | null>(null);
  const [courierToDelete, setCourierToDelete] = useState<Courier | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setCouriers(initialCouriers);
  }, []);

  const handleAddNew = () => {
    setEditingCourier(null);
    setIsFormOpen(true);
  };

  const handleEdit = (courier: Courier) => {
    setEditingCourier(courier);
    setIsFormOpen(true);
  };

  const handleDeletePrompt = (courier: Courier) => {
    setCourierToDelete(courier);
  };

  const handleDeleteConfirm = () => {
    if (courierToDelete) {
      setCouriers(couriers.filter(c => c.id !== courierToDelete.id));
      toast({ title: "Repartidor Eliminado", description: `El repartidor ${courierToDelete.name} ha sido eliminado.` });
      setCourierToDelete(null);
    }
  };

  const handleSubmit = (data: Omit<Courier, 'id'> & { id?: string }) => {
    if (editingCourier && data.id) {
      setCouriers(couriers.map(c => c.id === data.id ? { ...c, ...data } as Courier : c));
      toast({ title: "Repartidor Actualizado", description: `El repartidor ${data.name} ha sido actualizado.` });
    } else {
      const newCourier = { ...data, id: String(Date.now()) } as Courier;
      setCouriers([...couriers, newCourier]);
      toast({ title: "Repartidor Agregado", description: `El repartidor ${newCourier.name} ha sido agregado.` });
    }
    setIsFormOpen(false);
    setEditingCourier(null);
  };

  const columns = getCourierColumns(handleEdit, handleDeletePrompt);

  return (
    <div className="container mx-auto py-8">
      <PageTitle>Gestión de Repartidores</PageTitle>
      <DataTable
        columns={columns}
        data={couriers}
        searchKey="name"
        searchPlaceholder="Buscar por nombre de repartidor..."
        addNewButtonLabel="Agregar Repartidor"
        onAddNew={handleAddNew}
      />
      <CourierFormDialog
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingCourier(null);}}
        onSubmit={handleSubmit}
        courier={editingCourier}
      />
      {courierToDelete && (
        <AlertDialog open={!!courierToDelete} onOpenChange={() => setCourierToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente al repartidor <span className="font-semibold">{courierToDelete.name}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCourierToDelete(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
