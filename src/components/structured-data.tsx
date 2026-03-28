"use client";

import { usePathname } from 'next/navigation';

export default function StructuredData() {
  const pathname = usePathname();
  
  // Organization Schema is essential for Google to understand the business.
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "StayFloow",
    "url": "https://www.stayfloow.com",
    "logo": "https://www.stayfloow.com/logo.png",
    "email": "stayflow2025@gmail.com",
    "description": "La plateforme N°1 de réservation d'hébergements, voitures et circuits en Algérie et Égypte.",
    "areaServed": ["DZ", "EG"], // Algérie, Egypte
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "stayflow2025@gmail.com",
      "contactType": "customer support"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
    />
  );
}
