
"use client";

import React, { useState, useMemo } from "react";
import { useCollection, useFirestore, useUser } from "@/firebase";
import { collection, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { 
  Building, Car, Compass, Search, Filter, 
  MoreVertical, Trash2, CheckCircle, XCircle, 
  ArrowLeft, Loader2, ExternalLink, MapPin, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCurrency } from "@/context/currency-context";
import { cn } from "@/lib/utils";

export default function AdminCatalogPage() {
  const router = useRouter();
  const db = useFirestore();
  const { formatPrice } = useCurrency();
  const { user, loading: authLoading } = useUser();
  
  const listingsRef = collection(db, 'listings');
  const { data: listings, loading } = useCollection(listingsRef);
  
  const [searchTerm, setSearchName] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredListings = useMemo(() => {
    if (!listings) return [];
    return listings.filter(l => {
      const matchesSearch = (l.details?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (l.partnerInfo?.email || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = filterCategory === "all" || l.category === filterCategory;
      const matchesStatus = filterStatus === "all" || l.status === filterStatus;
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [listings, searchTerm, filterCategory, filterStatus]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cette annonce ?")) {
      await deleteDoc(doc(db, 'listings', id));
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateDoc(doc(db, 'listings', id), { status: newStatus });
  };

  if (loading || authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      <header className="bg-slate-800 text-white py-6 px-8 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/admin')} className="text-white hover:bg-white/10">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight">Gestion du Catalogue</h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Contrôle total des annonces StayFloow</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-700 p-1 rounded-xl border border-slate-600">
            <FilterButton active={filterCategory === 'all'} onClick={() => setFilterCategory('all')}>Toutes</FilterButton>
            <FilterButton active={filterCategory === 'accommodation'} onClick={() => setFilterCategory('accommodation')}><Building className="h-3 w-3 mr-1" /> Hôtels</FilterButton>
            <FilterButton active={filterCategory === 'car_rental'} onClick={() => setFilterCategory('car_rental')}><Car className="h-3 w-3 mr-1" /> Voitures</FilterButton>
            <FilterButton active={filterCategory === 'circuit'} onClick={() => setFilterCategory('circuit')}><Compass className="h-3 w-3 mr-1" /> Circuits</FilterButton>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10 space-y-8">
        {/* Barre de recherche et statuts */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Rechercher par nom ou email partenaire..." 
              value={searchTerm}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-12 h-14 bg-white border-none shadow-sm rounded-2xl font-bold"
            />
          </div>
          <div className="flex gap-2">
            {['pending', 'approved', 'rejected'].map(status => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                onClick={() => setFilterStatus(filterStatus === status ? 'all' : status)}
                className={cn(
                  "h-14 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest",
                  filterStatus === status ? "bg-primary" : "bg-white border-none shadow-sm"
                )}
              >
                {status === 'pending' ? 'En attente' : status === 'approved' ? 'Actives' : 'Rejetées'}
              </Button>
            ))}
          </div>
        </div>

        {/* Liste des annonces */}
        <div className="grid grid-cols-1 gap-4">
          {filteredListings.length > 0 ? (
            filteredListings.map((l) => (
              <Card key={l.id} className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all group">
                <CardContent className="p-0 flex flex-col md:flex-row items-center">
                  <div className="relative w-full md:w-48 h-32 shrink-0">
                    <Image 
                      src={l.photos?.[0] || "https://placehold.co/400x300?text=No+Image"} 
                      alt="Listing" 
                      fill 
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className={cn(
                        "font-black text-[8px] uppercase",
                        l.status === 'approved' ? "bg-green-600" : l.status === 'pending' ? "bg-amber-500" : "bg-red-600"
                      )}>
                        {l.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-black text-slate-900 truncate">{l.details?.name || 'Annonce sans nom'}</h3>
                      <p className="text-xs text-slate-400 font-bold flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-primary" /> {l.location?.address}
                      </p>
                    </div>

                    <div className="flex flex-col justify-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Partenaire</p>
                      <p className="text-sm font-bold text-slate-700">{l.partnerInfo?.firstName} {l.partnerInfo?.lastName}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{l.partnerInfo?.email}</p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-8">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix</p>
                        <p className="text-lg font-black text-primary">{formatPrice(l.price)}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 border-none shadow-2xl">
                            <DropdownMenuItem onClick={() => router.push(`/admin/validate?id=${l.id}`)} className="font-bold py-3 cursor-pointer rounded-lg">
                              <ExternalLink className="h-4 w-4 mr-3 text-blue-500" /> Voir Détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(l.id, l.status === 'approved' ? 'pending' : 'approved')} className="font-bold py-3 cursor-pointer rounded-lg">
                              {l.status === 'approved' ? (
                                <><XCircle className="h-4 w-4 mr-3 text-amber-500" /> Désactiver</>
                              ) : (
                                <><CheckCircle className="h-4 w-4 mr-3 text-green-500" /> Approuver</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(l.id)} className="font-bold py-3 text-red-600 cursor-pointer rounded-lg hover:bg-red-50">
                              <Trash2 className="h-4 w-4 mr-3" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-3xl shadow-sm border-2 border-dashed">
              <Tag className="h-16 w-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-black text-slate-400">Aucune annonce trouvée</h3>
              <p className="text-slate-500">Essayez de modifier vos filtres ou d'ajouter de nouveaux partenaires.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function FilterButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all flex items-center",
        active ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}
