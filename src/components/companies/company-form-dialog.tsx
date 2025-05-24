
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
import type { Company } from "@/lib/types";
import { companySchema, type CompanyFormData } from "@/lib/schemas";
import { useEffect } from "react";

interface CompanyFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyFormData) => void;
  company?: Company | null;
}

export function CompanyFormDialog({ isOpen, onClose, onSubmit, company }: CompanyFormDialogProps) {
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: company || { name: "", contact_person: "", email: "", phone: "", address: "" },
  });

  useEffect(() => {
    if (isOpen) {
      if (company) {
        form.reset({
          id: company.id,
          name: company.name,
          contact_person: company.contact_person || "",
          email: company.email,
          phone: company.phone || "",
          address: company.address || "",
        });
      } else {
        form.reset({ name: "", contact_person: "", email: "", phone: "", address: "" });
      }
    }
  }, [company, form, isOpen]);

  const handleFormSubmit = (data: CompanyFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{company ? "Editar Empresa" : "Agregar Nueva Empresa"}</DialogTitle>
          <DialogDescription>
            {company ? "Modifique los datos de la empresa." : "Complete los campos para agregar una nueva empresa."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Logística Express S.A." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Persona de Contacto</FormLabel>
                  <FormControl>
                    <Input placeholder="Laura Gómez" {...field} value={field.value ?? ""} />
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
                    <Input type="email" placeholder="contacto@logistica.com" {...field} />
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
                    <Input placeholder="987654321" {...field} value={field.value ?? ""} />
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
                    <Input placeholder="Parque Industrial 123, Ciudad" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit">{company ? "Guardar Cambios" : "Agregar Empresa"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
