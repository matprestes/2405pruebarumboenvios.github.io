
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Courier } from "@/lib/types";
import { courierSchema, type CourierFormData } from "@/lib/schemas";
import { useEffect } from "react";

interface CourierFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CourierFormData) => void;
  courier?: Courier | null;
}

export function CourierFormDialog({ isOpen, onClose, onSubmit, courier }: CourierFormDialogProps) {
  const form = useForm<CourierFormData>({
    resolver: zodResolver(courierSchema),
    defaultValues: courier || { 
      name: "", 
      vehicle_type: "Motorcycle", 
      plate_number: "", 
      phone: "", 
      status: "Available" 
    },
  });
  
  useEffect(() => {
    if(isOpen) {
      if (courier) {
        form.reset({
          id: courier.id,
          name: courier.name,
          vehicle_type: courier.vehicle_type || "Motorcycle",
          plate_number: courier.plate_number || "",
          phone: courier.phone || "",
          status: courier.status || "Available",
        });
      } else {
        form.reset({ name: "", vehicle_type: "Motorcycle", plate_number: "", phone: "", status: "Available" });
      }
    }
  }, [courier, form, isOpen]);

  const handleFormSubmit = (data: CourierFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{courier ? "Editar Repartidor" : "Agregar Nuevo Repartidor"}</DialogTitle>
          <DialogDescription>
            {courier ? "Modifique los datos del repartidor." : "Complete los campos para agregar un nuevo repartidor."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Repartidor</FormLabel>
                  <FormControl>
                    <Input placeholder="Pedro Gómez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicle_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Vehículo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione tipo de vehículo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Motorcycle">Motocicleta</SelectItem>
                      <SelectItem value="Car">Automóvil</SelectItem>
                      <SelectItem value="Van">Furgoneta</SelectItem>
                      <SelectItem value="Bicycle">Bicicleta</SelectItem>
                      <SelectItem value="Truck">Camión</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plate_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrícula</FormLabel>
                  <FormControl>
                    <Input placeholder="XYZ-123" {...field} value={field.value ?? ""} />
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
                    <Input placeholder="1122334455" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Available">Disponible</SelectItem>
                      <SelectItem value="On Delivery">En Entrega</SelectItem>
                      <SelectItem value="Offline">Desconectado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit">{courier ? "Guardar Cambios" : "Agregar Repartidor"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
