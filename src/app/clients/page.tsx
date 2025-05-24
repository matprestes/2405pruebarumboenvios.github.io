
"use client";

import { useState, useEffect } from "react";
import type { Client } from "@/lib/types";
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

const initialClients: Client[] = [
  { id: "1", name: "Ana García", email: "ana.garcia@example.com", phone: "555-0101", address: "Av. Siempre Viva 742" },
  { id: "2", name: "Carlos López", email: "carlos.lopez@example.com", phone: "555-0102", address: "Calle Falsa 123" },
  { id: "3", name: "Sofía Martínez", email: "sofia.martinez@example.com", phone: "555-0103", address: "Boulevard de los Sueños Rotos 45" },
];


export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setClients(initialClients);
  }, []);

  const handleAddNew = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleDeletePrompt = (client: Client) => {
    setClientToDelete(client);
  };

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      setClients(clients.filter(c => c.id !== clientToDelete.id));
      toast({ title: "Cliente Eliminado", description: `El cliente ${clientToDelete.name} ha sido eliminado.` });
      setClientToDelete(null);
    }
  };

  const handleSubmit = (data: Omit<Client, 'id'> & { id?: string }) => {
    if (editingClient && data.id) {
      setClients(clients.map(c => c.id === data.id ? { ...c, ...data } : c));
      toast({ title: "Cliente Actualizado", description: `El cliente ${data.name} ha sido actualizado.` });
    } else {
      const newClient = { ...data, id: String(Date.now()) }; // Simple ID generation
      setClients([...clients, newClient]);
      toast({ title: "Cliente Agregado", description: `El cliente ${newClient.name} ha sido agregado.` });
    }
    setIsFormOpen(false);
    setEditingClient(null);
  };
  
  const columns = getClientColumns(handleEdit, handleDeletePrompt);

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
