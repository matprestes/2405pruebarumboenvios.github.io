
"use client";

import { useState, useEffect } from "react";
import type { Company as CompanyType } from "@/lib/types";
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
import { getCompanies, createCompany, updateCompany, deleteCompany } from './actions';
import type { CompanyFormData } from "@/lib/schemas";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyType | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<CompanyType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      const fetchedCompanies = await getCompanies();
      setCompanies(fetchedCompanies);
      setIsLoading(false);
    };
    fetchCompanies();
  }, []);

  const handleAddNew = () => {
    setEditingCompany(null);
    setIsFormOpen(true);
  };

  const handleEdit = (company: CompanyType) => {
    setEditingCompany(company);
    setIsFormOpen(true);
  };

  const handleDeletePrompt = (company: CompanyType) => {
    setCompanyToDelete(company);
  };

  const handleDeleteConfirm = async () => {
    if (companyToDelete?.id) {
      const result = await deleteCompany(companyToDelete.id);
      if (result.error) {
        toast({ variant: "destructive", title: "Error", description: result.error });
      } else {
        setCompanies(companies.filter(c => c.id !== companyToDelete.id));
        toast({ title: "Empresa Eliminada", description: `La empresa ${companyToDelete.name} ha sido eliminada.` });
      }
      setCompanyToDelete(null);
    }
  };

  const handleSubmit = async (formData: CompanyFormData) => {
    let result;
    if (editingCompany && formData.id) {
      result = await updateCompany(formData.id, formData);
      if (result.error) {
        toast({ variant: "destructive", title: "Error al actualizar", description: result.error });
      } else {
        setCompanies(companies.map(c => c.id === formData.id ? { ...c, ...result.data } as CompanyType : c));
        toast({ title: "Empresa Actualizada", description: `La empresa ${formData.name} ha sido actualizada.` });
      }
    } else {
      result = await createCompany(formData);
      if (result.error) {
        toast({ variant: "destructive", title: "Error al crear", description: result.error });
      } else if (result.data) {
        setCompanies([result.data as CompanyType, ...companies]);
        toast({ title: "Empresa Agregada", description: `La empresa ${result.data.name} ha sido agregada.` });
      }
    }
    if (!result.error) {
      setIsFormOpen(false);
      setEditingCompany(null);
    }
  };

  const columns = getCompanyColumns(handleEdit, handleDeletePrompt);

  if (isLoading) {
    return <div className="container mx-auto py-8"><PageTitle>Gestión de Empresas</PageTitle><p>Cargando empresas...</p></div>;
  }

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
