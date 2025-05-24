
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { Client } from "@/lib/types";
import { clientSchema, type ClientFormData } from "@/lib/schemas";
import { useEffect } from "react";

interface ClientFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => void;
  client?: Client | null; 
}

export function ClientFormDialog({ isOpen, onClose, onSubmit, client }: ClientFormDialogProps) {
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: client || { name: "", email: "", phone: "", address: "" },
  });

  useEffect(() => {
    if (isOpen) { // Reset form only when dialog opens
      if (client) {
        form.reset({
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone || "",
          address: client.address || ""
        });
      } else {
        form.reset({ name: "", email: "", phone: "", address: "" });
      }
    }
  }, [client, form, isOpen]);


  const handleFormSubmit = (data: ClientFormData) => {
    onSubmit(data);
    // onClose will be called by parent on successful submission
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{client ? "Editar Cliente" : "Agregar Nuevo Cliente"}</DialogTitle>
          <DialogDescription>
            {client ? "Modifique los datos del cliente." : "Complete los campos para agregar un nuevo cliente."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="juan.perez@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Calle Falsa 123, Ciudad" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit">{client ? "Guardar Cambios" : "Agregar Cliente"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
