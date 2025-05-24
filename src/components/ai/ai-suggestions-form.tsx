
"use client";

import { useState, type FC } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { DeliveryOptionSuggestion, PackageSize, DeliveryUrgency } from '@/lib/types';
import { getAISuggestions } from '@/app/ai-suggestions/actions'; // Updated import path
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { suggestDeliveryOptionsInputSchema, type AISuggestionsFormData } from '@/lib/schemas';


export const AiSuggestionsForm: FC = () => {
  const [suggestions, setSuggestions] = useState<DeliveryOptionSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, control, formState: { errors } } = useForm<AISuggestionsFormData>({
    resolver: zodResolver(suggestDeliveryOptionsInputSchema),
  });

  const onSubmit: SubmitHandler<AISuggestionsFormData> = async (data) => {
    setIsLoading(true);
    setSuggestions(null);
    const result = await getAISuggestions({
      packageSize: data.packageSize as PackageSize, // Casting is okay if enums match
      deliveryUrgency: data.deliveryUrgency as DeliveryUrgency, // Casting is okay if enums match
      deliveryLocation: data.deliveryLocation,
    });
    setIsLoading(false);

    if ('error' in result) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else if (result) {
      setSuggestions(result);
      toast({
        title: "Sugerencias Generadas",
        description: "Se han obtenido nuevas sugerencias de entrega.",
      });
    } else {
       toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron obtener sugerencias. Intente nuevamente.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Obtener Sugerencias de Entrega</CardTitle>
          <CardDescription>Completa los detalles para recibir sugerencias optimizadas por IA.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="packageSize">Tamaño del Paquete</Label>
              <Select 
                onValueChange={(value) => control._fields.packageSize!.onChange(value)}
                defaultValue={control._defaultValues?.packageSize}
              >
                <SelectTrigger id="packageSize">
                  <SelectValue placeholder="Seleccione tamaño" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Pequeño</SelectItem>
                  <SelectItem value="medium">Mediano</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                </SelectContent>
              </Select>
              {errors.packageSize && <p className="text-sm text-destructive mt-1">{errors.packageSize.message}</p>}
            </div>

            <div>
              <Label htmlFor="deliveryUrgency">Urgencia de Entrega</Label>
               <Select 
                onValueChange={(value) => control._fields.deliveryUrgency!.onChange(value)}
                defaultValue={control._defaultValues?.deliveryUrgency}
              >
                <SelectTrigger id="deliveryUrgency">
                  <SelectValue placeholder="Seleccione urgencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Estándar</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
              {errors.deliveryUrgency && <p className="text-sm text-destructive mt-1">{errors.deliveryUrgency.message}</p>}
            </div>

            <div>
              <Label htmlFor="deliveryLocation">Ubicación de Entrega</Label>
              <Input id="deliveryLocation" {...register('deliveryLocation')} placeholder="Ej: Calle Falsa 123, Springfield" />
              {errors.deliveryLocation && <p className="text-sm text-destructive mt-1">{errors.deliveryLocation.message}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? <LoadingSpinner className="mr-2" /> : null}
              {isLoading ? 'Obteniendo Sugerencias...' : 'Obtener Sugerencias'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {suggestions && (
        <Card className="mt-6 bg-secondary/50">
          <CardHeader>
            <CardTitle>Resultados de la Sugerencia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Courier Sugerido:</Label>
              <p className="text-foreground">{suggestions.courierSuggestion}</p>
            </div>
            <div>
              <Label>Ruta Sugerida:</Label>
              <Textarea value={suggestions.routeSuggestion} readOnly rows={3} className="bg-background" />
            </div>
            <div>
              <Label>Tiempo Estimado de Entrega:</Label>
              <p className="text-foreground">{suggestions.estimatedDeliveryTime}</p>
            </div>
            <div>
              <Label>Costo Estimado:</Label>
              <p className="text-foreground font-semibold">{suggestions.estimatedCost}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

