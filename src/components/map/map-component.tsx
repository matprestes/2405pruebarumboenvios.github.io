
"use client";

import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import type { FC } from 'react';

interface MapComponentProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: { lat: number; lng: number; key: string; label?: string }[];
  style?: React.CSSProperties;
  className?: string;
}

const MapComponent: FC<MapComponentProps> = ({ 
  center, 
  zoom = 12, 
  markers, 
  style,
  className 
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className={`flex items-center justify-center h-full bg-muted/50 rounded-md p-4 text-center ${className}`} style={style}>
        <p className="text-destructive">
          La clave API de Google Maps no está configurada. Por favor, configure la variable de entorno 
          <code className="mx-1 p-1 bg-destructive/20 rounded text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>.
        </p>
      </div>
    );
  }

  return (
    <div className={className} style={{ ...style, minHeight: '300px' }}>
      <Map
        defaultCenter={center}
        defaultZoom={zoom}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapId="rumbosenvios-map" // Optional: for custom map styling in Google Cloud Console
        className="rounded-md"
      >
        {markers?.map((marker) => (
          <AdvancedMarker position={{ lat: marker.lat, lng: marker.lng }} key={marker.key} title={marker.label}>
            <Pin 
              background={'hsl(var(--primary))'} 
              borderColor={'hsl(var(--primary-foreground))'} 
              glyphColor={'hsl(var(--primary-foreground))'}
            />
          </AdvancedMarker>
        ))}
      </Map>
    </div>
  );
};

export default MapComponent;
