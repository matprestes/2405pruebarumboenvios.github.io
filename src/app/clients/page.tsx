
"use client";

import { useState, useEffect } from "react";
import type { Client as ClientType } from "@/lib/types";
import { PageTitle } from "@/components/ui/page-title";
import { DataTable } from "@/components/data-table";
import { getClientColumns } from "@/components/clients/client-columns";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
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
import { getClients, createClient, updateClient, deleteClient } from './actions';
import type { ClientFormData } from "@/lib/schemas";

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientType | null>(null);
  const [clientToDelete, setClientToDelete] = useState<ClientType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      const fetchedClients = await getClients();
      setClients(fetchedClients);
      setIsLoading(false);
    };
    fetchClients();
  }, []);

  const handleAddNew = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const handleEdit = (client: ClientType) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleDeletePrompt = (client: ClientType) => {
    setClientToDelete(client);
  };

  const handleDeleteConfirm = async () => {
    if (clientToDelete?.id) {
      const result = await deleteClient(clientToDelete.id);
      if (result.error) {
        toast({ variant: "destructive", title: "Error", description: result.error });
      } else {
        setClients(clients.filter(c => c.id !== clientToDelete.id));
        toast({ title: "Cliente Eliminado", description: `El cliente ${clientToDelete.name} ha sido eliminado.` });
      }
      setClientToDelete(null);
    }
  };

  const handleSubmit = async (formData: ClientFormData) => {
    let result;
    if (editingClient && formData.id) {
      result = await updateClient(formData.id, formData);
      if (result.error) {
        toast({ variant: "destructive", title: "Error al actualizar", description: result.error });
      } else {
        setClients(clients.map(c => c.id === formData.id ? { ...c, ...result.data } as ClientType : c));
        toast({ title: "Cliente Actualizado", description: `El cliente ${formData.name} ha sido actualizado.` });
      }
    } else {
      result = await createClient(formData);
       if (result.error) {
        toast({ variant: "destructive", title: "Error al crear", description: result.error });
      } else if (result.data){
        setClients([result.data as ClientType, ...clients]);
        toast({ title: "Cliente Agregado", description: `El cliente ${result.data.name} ha sido agregado.` });
      }
    }
    if (!result.error) {
      setIsFormOpen(false);
      setEditingClient(null);
    }
  };
  
  const columns = getClientColumns(handleEdit, handleDeletePrompt);

  if (isLoading) {
    return <div className="container mx-auto py-8"><PageTitle>Gestión de Clientes</PageTitle><p>Cargando clientes...</p></div>;
  }

  return (
    <div className="container mx-auto py-8">
      <PageTitle>Gestión de Clientes</PageTitle>
      <DataTable
        columns={columns}
        data={clients}
        searchKey="name"
        searchPlaceholder="Buscar por nombre..."
        addNewButtonLabel="Agregar Cliente"
        onAddNew={handleAddNew}
      />
      <ClientFormDialog
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingClient(null);}}
        onSubmit={handleSubmit}
        client={editingClient}
      />
      {clientToDelete && (
        <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente al cliente <span className="font-semibold">{clientToDelete.name}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setClientToDelete(null)}>Cancelar</AlertDialogCancel>
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
