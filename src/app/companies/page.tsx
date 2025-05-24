
"use client";

import { useState, useEffect } from "react";
import type { Company } from "@/lib/types";
import { PageTitle } from "@/components/ui/page-title";
import { DataTable } from "@/components/data-table";
import { getCompanyColumns } from "@/components/companies/company-columns";
import { CompanyFormDialog } from "@/components/companies/company-form-dialog";
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

const initialCompanies: Company[] = [
  { id: "comp1", name: "Tech Solutions Ltd.", contactPerson: "Juan Rodriguez", email: "juan.r@techsolutions.com", phone: "555-0201", address: "Silicon Valley 101" },
  { id: "comp2", name: "Global Goods Inc.", contactPerson: "Maria Sanchez", email: "maria.s@globalgoods.com", phone: "555-0202", address: "World Trade Center 50" },
];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setCompanies(initialCompanies);
  }, []);

  const handleAddNew = () => {
    setEditingCompany(null);
    setIsFormOpen(true);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsFormOpen(true);
  };

  const handleDeletePrompt = (company: Company) => {
    setCompanyToDelete(company);
  };

  const handleDeleteConfirm = () => {
    if (companyToDelete) {
      setCompanies(companies.filter(c => c.id !== companyToDelete.id));
      toast({ title: "Empresa Eliminada", description: `La empresa ${companyToDelete.name} ha sido eliminada.` });
      setCompanyToDelete(null);
    }
  };

  const handleSubmit = (data: Omit<Company, 'id'> & { id?: string }) => {
    if (editingCompany && data.id) {
      setCompanies(companies.map(c => c.id === data.id ? { ...c, ...data } : c));
      toast({ title: "Empresa Actualizada", description: `La empresa ${data.name} ha sido actualizada.` });
    } else {
      const newCompany = { ...data, id: String(Date.now()) };
      setCompanies([...companies, newCompany]);
      toast({ title: "Empresa Agregada", description: `La empresa ${newCompany.name} ha sido agregada.` });
    }
    setIsFormOpen(false);
    setEditingCompany(null);
  };

  const columns = getCompanyColumns(handleEdit, handleDeletePrompt);

  return (
    <div className="container mx-auto py-8">
      <PageTitle>Gestión de Empresas</PageTitle>
      <DataTable
        columns={columns}
        data={companies}
        searchKey="name"
        searchPlaceholder="Buscar por nombre de empresa..."
        addNewButtonLabel="Agregar Empresa"
        onAddNew={handleAddNew}
      />
      <CompanyFormDialog
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingCompany(null);}}
        onSubmit={handleSubmit}
        company={editingCompany}
      />
      {companyToDelete && (
         <AlertDialog open={!!companyToDelete} onOpenChange={() => setCompanyToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente la empresa <span className="font-semibold">{companyToDelete.name}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCompanyToDelete(null)}>Cancelar</AlertDialogCancel>
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
