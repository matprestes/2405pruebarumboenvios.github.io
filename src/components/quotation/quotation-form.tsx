
"use client";

import { useState, type FC, useEffect } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import MapComponent from '@/components/map/map-component'; // Lazy load if needed
import { GMAPS_LIBRARIES } from '@/lib/constants';
import { useApiIsLoaded, useMapsLibrary } from '@vis.gl/react-google-maps';


const quotationFormSchema = z.object({
  origin: z.string().min(5, { message: "El origen debe tener al menos 5 caracteres." }),
  destination: z.string().min(5, { message: "El destino debe tener al menos 5 caracteres." }),
  packageType: z.enum(['Envelope', 'Small Box', 'Medium Box', 'Large Box', 'Custom'], { required_error: "El tipo de paquete es requerido."}),
  weightKg: z.number().positive({ message: "El peso debe ser un número positivo." }),
  serviceType: z.enum(['standard', 'express', 'urgent'], { required_error: "El tipo de servicio es requerido."}),
});

type QuotationFormData = z.infer<typeof quotationFormSchema>;

interface GeocodedLocation {
  address: string;
  lat: number;
  lng: number;
}

export const QuotationForm: FC = () => {
  const [quote, setQuote] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [originCoords, setOriginCoords] = useState<{lat: number, lng: number} | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{lat: number, lng: number} | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 23.6345, lng: -102.5528 }); // Mexico center
  const [mapZoom, setMapZoom] = useState(5);

  const apiIsLoaded = useApiIsLoaded();
  const geocodingService = useMapsLibrary('geocoding');
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (apiIsLoaded && geocodingService) {
      setGeocoder(new geocodingService.Geocoder());
    }
  }, [apiIsLoaded, geocodingService]);


  const { register, handleSubmit, control, formState: { errors }, watch } = useForm<QuotationFormData>({
    resolver: zodResolver(quotationFormSchema),
  });

  const originAddress = watch("origin");
  const destinationAddress = watch("destination");

  const geocodeAddress = async (address: string, type: 'origin' | 'destination'): Promise<GeocodedLocation | null> => {
    if (!geocoder || !address || address.length < 5) return null;
    
    try {
      const response = await geocoder.geocode({ address });
      if (response.results && response.results.length > 0) {
        const location = response.results[0].geometry.location;
        const coords = { lat: location.lat(), lng: location.lng() };
        if (type === 'origin') setOriginCoords(coords);
        else setDestinationCoords(coords);
        
        // Adjust map view
        if (originCoords && destinationCoords) {
           // Simple average, can be improved with bounds
           setMapCenter({
             lat: (originCoords.lat + destinationCoords.lat) / 2,
             lng: (originCoords.lng + destinationCoords.lng) / 2,
           });
           setMapZoom(7); // Zoom out slightly to see both
        } else {
           setMapCenter(coords);
           setMapZoom(12);
        }
        return { address, ...coords };
      } else {
        toast({ variant: 'destructive', title: 'Error de Geocodificación', description: `No se pudo encontrar la ubicación para: ${address}` });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast({ variant: 'destructive', title: 'Error de Geocodificación', description: `Ocurrió un error al buscar: ${address}` });
    }
    return null;
  };


  const onSubmit: SubmitHandler<QuotationFormData> = async (data) => {
    setIsLoading(true);
    setQuote(null);

    // Mock distance calculation and quote generation
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

    let distanceKm = 0;
    if (originCoords && destinationCoords) {
        // Basic Haversine distance calculation (approximation)
        const R = 6371; // Radius of the earth in km
        const dLat = (destinationCoords.lat - originCoords.lat) * Math.PI / 180;
        const dLon = (destinationCoords.lng - originCoords.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(originCoords.lat * Math.PI / 180) * Math.cos(destinationCoords.lat * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        distanceKm = R * c;
    } else {
        // Fallback if geocoding fails or not used
        distanceKm = Math.random() * 500 + 50; // Random distance if no coords
    }


    let baseRate = 10; // Base MXN
    let perKmRate = 2.5; // MXN per km
    let weightFactor = data.weightKg * 1.2;
    
    if (data.serviceType === 'express') perKmRate *= 1.5;
    if (data.serviceType === 'urgent') perKmRate *= 2.0;

    if (data.packageType === 'Medium Box') baseRate *= 1.2;
    if (data.packageType === 'Large Box') baseRate *= 1.5;
    if (data.packageType === 'Custom') baseRate *= 1.3;


    const calculatedQuote = baseRate + (distanceKm * perKmRate) + weightFactor;
    
    setQuote(calculatedQuote);
    setIsLoading(false);
    toast({
      title: "Cotización Generada",
      description: `El costo estimado del envío es $${calculatedQuote.toFixed(2)} MXN.`,
    });
  };
  
  const mapMarkers = [];
  if (originCoords) mapMarkers.push({ ...originCoords, key: 'origin', label: 'Origen' });
  if (destinationCoords) mapMarkers.push({ ...destinationCoords, key: 'destination', label: 'Destino' });


  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calcular Cotización de Envío</CardTitle>
            <CardDescription>Completa los detalles para obtener una cotización estimada.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="origin">Origen</Label>
                <Input id="origin" {...register('origin')} placeholder="Ej: Calle Falsa 123, Ciudad de México" onBlur={() => geocodeAddress(originAddress, 'origin')}/>
                {errors.origin && <p className="text-sm text-destructive mt-1">{errors.origin.message}</p>}
              </div>
              <div>
                <Label htmlFor="destination">Destino</Label>
                <Input id="destination" {...register('destination')} placeholder="Ej: Av. Siempre Viva 742, Guadalajara" onBlur={() => geocodeAddress(destinationAddress, 'destination')} />
                {errors.destination && <p className="text-sm text-destructive mt-1">{errors.destination.message}</p>}
              </div>
              <div>
                <Label htmlFor="packageType">Tipo de Paquete</Label>
                <Controller
                  name="packageType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="packageType"><SelectValue placeholder="Seleccione tipo" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Envelope">Sobre</SelectItem>
                        <SelectItem value="Small Box">Caja Pequeña</SelectItem>
                        <SelectItem value="Medium Box">Caja Mediana</SelectItem>
                        <SelectItem value="Large Box">Caja Grande</SelectItem>
                        <SelectItem value="Custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.packageType && <p className="text-sm text-destructive mt-1">{errors.packageType.message}</p>}
              </div>
              <div>
                <Label htmlFor="weightKg">Peso (kg)</Label>
                <Input id="weightKg" type="number" step="0.1" {...register('weightKg', { valueAsNumber: true })} placeholder="Ej: 2.5" />
                {errors.weightKg && <p className="text-sm text-destructive mt-1">{errors.weightKg.message}</p>}
              </div>
              <div>
                <Label htmlFor="serviceType">Tipo de Servicio</Label>
                 <Controller
                  name="serviceType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="serviceType"><SelectValue placeholder="Seleccione servicio" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Estándar</SelectItem>
                        <SelectItem value="express">Express</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.serviceType && <p className="text-sm text-destructive mt-1">{errors.serviceType.message}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <LoadingSpinner className="mr-2" /> : null}
                {isLoading ? 'Calculando...' : 'Calcular Cotización'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Mapa de Ruta (Visualización)</CardTitle>
                <CardDescription>Las ubicaciones de origen y destino se mostrarán aquí.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                 <MapComponent center={mapCenter} zoom={mapZoom} markers={mapMarkers} className="h-full min-h-[400px] rounded-md" />
            </CardContent>
        </Card>

      </div>

      {quote !== null && (
        <Card className="mt-6 bg-primary/10 border-primary">
          <CardHeader>
            <CardTitle className="text-primary">Cotización Estimada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">${quote.toFixed(2)} <span className="text-lg font-normal">MXN</span></p>
            <p className="text-sm text-muted-foreground mt-1">Este es un costo estimado y puede variar.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
