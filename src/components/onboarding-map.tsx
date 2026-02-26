"use client";

console.log("DEBUG: OnboardingMap loaded");

import { Card } from "./ui/card";
import { cityCoordinates } from "@/lib/data";
import { useEffect, useState } from "react";

export function OnboardingMap({ location }: { location?: string }) {
  console.log("DEBUG: Rendering OnboardingMap with location:", location);

  // Protection SSR : éviter un rendu différent entre serveur et client
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const defaultCoords = { lat: 36.775, lon: 3.058 }; // Algiers
  let mapCoords = defaultCoords;

  if (location && cityCoordinates[location]) {
    mapCoords = cityCoordinates[location];
  } else if (location) {
    // Si la location ne correspond pas exactement à une clé, on cherche si elle contient une ville connue
    const foundCity = Object.keys(cityCoordinates).find(city => 
      location.toLowerCase().includes(city.toLowerCase())
    );
    if (foundCity) {
      mapCoords = cityCoordinates[foundCity];
    }
  }

  const { lat, lon } = mapCoords;
  // Bounding box approximative pour centrer la ville
  const bbox = `${lon - 0.05},${lat - 0.05},${lon + 0.05},${lat + 0.05}`;

  const mapSrc = location
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=0.5,33,8.5,37.5&layer=mapnik`;

  // Empêche le SSR de rendre l'iframe (évite mismatch)
  if (!isClient) {
    return (
      <Card className="w-full aspect-video rounded-xl overflow-hidden relative mt-4 bg-slate-100 animate-pulse" />
    );
  }

  return (
    <Card className="w-full aspect-video rounded-xl overflow-hidden relative mt-4 shadow-inner border-2 border-slate-100">
      {location ? (
        <iframe
          key={location} // Force re-render on location change
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={mapSrc}
          className="opacity-90 hover:opacity-100 transition-opacity"
        ></iframe>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 gap-3">
          <div className="bg-white p-3 rounded-full shadow-sm">
            <svg className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Saisissez une ville pour visualiser
          </p>
        </div>
      )}
    </Card>
  );
}
