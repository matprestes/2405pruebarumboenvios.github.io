
import { QuotationForm } from '@/components/quotation/quotation-form';
import { PageTitle } from '@/components/ui/page-title';

export default function QuotationPage() {
  return (
    <div className="container mx-auto py-8">
      <PageTitle>Cotización de Envíos</PageTitle>
      <p className="mb-6 text-muted-foreground">
        Ingrese los detalles de su envío para obtener una cotización estimada.
        Las ubicaciones de origen y destino se pueden visualizar en el mapa.
      </p>
      <QuotationForm />
    </div>
  );
}

