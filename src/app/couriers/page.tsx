
"use client";

import { useState, useEffect } from "react";
import type { Courier as CourierType } from "@/lib/types";
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
import { getCouriers, createCourier, updateCourier, deleteCourier } from './actions';
import type { CourierFormData } from "@/lib/schemas";

export default function CouriersPage() {
  const [couriers, setCouriers] = useState<CourierType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourier, setEditingCourier] = useState<CourierType | null>(null);
  const [courierToDelete, setCourierToDelete] = useState<CourierType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCouriers = async () => {
      setIsLoading(true);
      const fetchedCouriers = await getCouriers();
      setCouriers(fetchedCouriers);
      setIsLoading(false);
    };
    fetchCouriers();
  }, []);

  const handleAddNew = () => {
    setEditingCourier(null);
    setIsFormOpen(true);
  };

  const handleEdit = (courier: CourierType) => {
    setEditingCourier(courier);
    setIsFormOpen(true);
  };

  const handleDeletePrompt = (courier: CourierType) => {
    setCourierToDelete(courier);
  };

  const handleDeleteConfirm = async () => {
    if (courierToDelete?.id) {
      const result = await deleteCourier(courierToDelete.id);
      if (result.error) {
        toast({ variant: "destructive", title: "Error", description: result.error });
      } else {
        setCouriers(couriers.filter(c => c.id !== courierToDelete.id));
        toast({ title: "Repartidor Eliminado", description: `El repartidor ${courierToDelete.name} ha sido eliminado.` });
      }
      setCourierToDelete(null);
    }
  };

  const handleSubmit = async (formData: CourierFormData) => {
    let result;
    if (editingCourier && formData.id) {
      result = await updateCourier(formData.id, formData);
      if (result.error) {
        toast({ variant: "destructive", title: "Error al actualizar", description: result.error });
      } else {
        setCouriers(couriers.map(c => c.id === formData.id ? { ...c, ...result.data } as CourierType : c));
        toast({ title: "Repartidor Actualizado", description: `El repartidor ${formData.name} ha sido actualizado.` });
      }
    } else {
      result = await createCourier(formData);
      if (result.error) {
        toast({ variant: "destructive", title: "Error al crear", description: result.error });
      } else if (result.data){
        setCouriers([result.data as CourierType, ...couriers]);
        toast({ title: "Repartidor Agregado", description: `El repartidor ${result.data.name} ha sido agregado.` });
      }
    }
    if (!result.error) {
      setIsFormOpen(false);
      setEditingCourier(null);
    }
  };

  const columns = getCourierColumns(handleEdit, handleDeletePrompt);

  if (isLoading) {
    return <div className="container mx-auto py-8"><PageTitle>Gestión de Repartidores</PageTitle><p>Cargando repartidores...</p></div>;
  }

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
