"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search as SearchIcon, Loader2, Map as MapIcon, 
  Star, ChevronRight, Grid, List as ListIcon, 
  Info, SlidersHorizontal
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property-card';
import { FilterSidebar } from '@/components/filter-sidebar';
import AdvancedSearchBar from '@/components/search/AdvancedSearchBar';
import { properties as mockProperties, type Property } from '@/lib/data';
import { Alert, AlertDescription } from '@/components/ui/alert';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const db = useFirestore();
  
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const locationParam = searchParams.get('dest') || '';

  useEffect(() => {
    const fetchApprovedListings = async () => {
      setLoading(true);
      try {
        // Query Firestore for approved listings
        const listingsRef = collection(db, 'listings');
        const q = query(listingsRef, where('status', '==', 'approved'));
        const querySnapshot = await getDocs(q);
        
        const dbListings = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.details?.name || 'Hébergement',
            location: data.location?.address || 'Non spécifié',
            price: data.price || 0,
            rating: data.rating || 8.0,
            description: data.details?.description || '',
            images: data.photos || [],
            amenities: data.details?.amenities || [],
            type: data.details?.type || 'Hôtel',
            isBoosted: data.isBoosted || false,
          } as Property;
        });

        // Combine with mock properties for demo purposes
        const allResults = [...mockProperties, ...dbListings];
        
        // Filter by location if provided
        const filtered = allResults.filter(p => 
          locationParam ? p.location.toLowerCase().includes(locationParam.toLowerCase()) : true
        );

        setResults(filtered);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setResults(mockProperties); // Fallback to mock on error
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };

    fetchApprovedListings();
  }, [locationParam, db]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Search Bar */}
      <div className="bg-[#10B981] pt-6 pb-10 px-4">
        <div className="max-w-[1100px] mx-auto">
          <AdvancedSearchBar />
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* SIDEBAR (25%) */}
        <aside className="w-full lg:w-[280px] shrink-0 space-y-4">
          <div className="relative h-24 rounded-lg overflow-hidden border shadow-sm cursor-pointer group">
            <div className="absolute inset-0 bg-slate-200 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <Button size="sm" className="bg-[#10B981] hover:bg-[#059669] text-white font-bold h-8">
                <MapIcon className="mr-2 h-4 w-4" /> Voir sur la carte
              </Button>
            </div>
          </div>

          <FilterSidebar resultCount={results.length} />
        </aside>

        {/* MAIN CONTENT (75%) */}
        <main className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {locationParam || 'Toutes les destinations'} : {results.length} établissements trouvés
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex border rounded-full p-1 bg-slate-50">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`rounded-full h-8 px-4 ${viewMode === 'list' ? 'bg-white shadow-sm text-[#10B981]' : 'text-slate-400'}`}
                  onClick={() => setViewMode('list')}
                >
                  <ListIcon className="h-4 w-4 mr-2" /> Liste
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`rounded-full h-8 px-4 ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#10B981]' : 'text-slate-400'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4 mr-2" /> Mosaïque
                </Button>
              </div>
            </div>
          </div>

          <Alert className="bg-slate-50 border-slate-200">
            <Info className="h-4 w-4 text-slate-400" />
            <AlertDescription className="text-xs text-slate-600">
              Le montant de la commission payée et d'autres facteurs peuvent affecter le classement d'un hébergement. <span className="text-[#10B981] cursor-pointer font-medium">En savoir plus.</span>
            </AlertDescription>
          </Alert>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-[#10B981]" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Recherche des meilleures offres StayFloow...</p>
            </div>
          ) : results.length > 0 ? (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex flex-col gap-4"}>
              {results.map((property) => (
                <PropertyCard key={property.id} property={property} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center bg-slate-50 rounded-xl border-2 border-dashed">
              <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <SearchIcon className="h-8 w-8 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-400">Aucun hébergement trouvé</h3>
              <p className="text-slate-500 mt-2">Essayez de modifier vos dates ou d'élargir votre zone de recherche.</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="flex justify-center pt-10 pb-20">
              <div className="flex gap-1">
                {[1, 2, 3].map(n => (
                  <Button key={n} variant={n === 1 ? "outline" : "ghost"} className={`w-10 h-10 rounded-md ${n === 1 ? 'border-[#10B981] text-[#10B981]' : ''}`}>{n}</Button>
                ))}
                <Button variant="ghost" className="w-10 h-10 rounded-md"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#10B981]" /></div>}>
      <SearchResultsContent />
    </Suspense>
  );
}