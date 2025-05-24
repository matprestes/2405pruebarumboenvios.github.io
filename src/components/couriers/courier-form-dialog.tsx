
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
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
import { useEffect } from "react";

const courierFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "El nombre del repartidor debe tener al menos 2 caracteres." }),
  vehicleType: z.enum(['Motorcycle', 'Car', 'Van', 'Bicycle', 'Truck'], { required_error: "El tipo de vehículo es requerido."}),
  plateNumber: z.string().min(3, { message: "La matrícula debe tener al menos 3 caracteres." }),
  phone: z.string().min(7, { message: "El teléfono debe tener al menos 7 caracteres." }),
  status: z.enum(['Available', 'On Delivery', 'Offline'], { required_error: "El estado es requerido."}),
});

type CourierFormData = z.infer<typeof courierFormSchema>;

interface CourierFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CourierFormData) => void;
  courier?: Courier | null;
}

export function CourierFormDialog({ isOpen, onClose, onSubmit, courier }: CourierFormDialogProps) {
  const form = useForm<CourierFormData>({
    resolver: zodResolver(courierFormSchema),
    defaultValues: courier || { 
      name: "", 
      vehicleType: "Motorcycle", 
      plateNumber: "", 
      phone: "", 
      status: "Available" 
    },
  });
  
  useEffect(() => {
    if (courier) {
      form.reset(courier);
    } else {
      form.reset({ name: "", vehicleType: "Motorcycle", plateNumber: "", phone: "", status: "Available" });
    }
  }, [courier, form, isOpen]);

  const handleFormSubmit = (data: CourierFormData) => {
    onSubmit(data);
    onClose();
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
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Vehículo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              name="plateNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrícula</FormLabel>
                  <FormControl>
                    <Input placeholder="XYZ-123" {...field} />
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
                    <Input placeholder="1122334455" {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
