
import { AiSuggestionsForm } from '@/components/ai/ai-suggestions-form';
import { PageTitle } from '@/components/ui/page-title';

export default function AiSuggestionsPage() {
  return (
    <div className="container mx-auto py-8">
      <PageTitle>Sugerencias de Entrega IA</PageTitle>
      <p className="mb-6 text-muted-foreground">
        Utiliza nuestra herramienta de inteligencia artificial para obtener las mejores opciones de entrega
        basadas en el tamaño del paquete, la urgencia y la ubicación.
      </p>
      <AiSuggestionsForm />
    </div>
  );
}
