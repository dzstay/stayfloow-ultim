'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Star, MessageSquare, Camera, CheckCircle2, ChevronRight, ChevronLeft,
  Briefcase, Users, ThumbsUp, ThumbsDown, Car, Plane, Train, Bus, Anchor, 
  MapPin, Loader2, AlertCircle, Info, Landmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useFirestore } from '@/firebase';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const BRAND_COLOR = "#00C896"; 

export default function ReviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const db = useFirestore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokenData, setTokenData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    travelType: '',
    companion: '',
    metExpectations: '',
    overallRating: 0,
    categories: {
      staff: 0,
      facilities: 0,
      cleanliness: 0,
      comfort: 0,
      location: 0
    },
    transport: '',
    commentLikes: '',
    commentDislikes: '',
    commentSummary: '',
    photos: [] as string[]
  });

  // Verify Token
  useEffect(() => {
    const verifyToken = async () => {
      if (!db || !token) return;
      try {
        const tokenRef = doc(db, 'review_tokens', token);
        const tokenSnap = await getDoc(tokenRef);

        if (!tokenSnap.exists()) {
          setError("Ce lien d'évaluation est invalide.");
          setLoading(false);
          return;
        }

        const data = tokenSnap.data();
        if (data.used) {
          setError("Vous avez déjà évalué ce séjour. Merci de votre retour !");
          setLoading(false);
          return;
        }

        const expiresAt = new Date(data.expiresAt);
        if (expiresAt < new Date()) {
          setError("Ce lien d'évaluation a expiré.");
          setLoading(false);
          return;
        }

        setTokenData(data);
        
        // Initialiser la note si l'url contient initialRate
        const initialRate = searchParams.get('initialRate');
        if (initialRate) {
          const rateMap: Record<string, number> = { '1': 2, '2': 5, '3': 8, '4': 10 };
          setFormData(prev => ({ ...prev, overallRating: rateMap[initialRate] || 0 }));
        }

        setLoading(false);
      } catch (err) {
        console.error("Error verifying token:", err);
        setError("Une erreur est survenue lors de la vérification de votre lien.");
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, db, searchParams]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const reviewId = `rev_${token}`;
      await setDoc(doc(db, 'reviews', reviewId), {
        ...formData,
        bookingId: tokenData.bookingId,
        listingId: tokenData.listingId,
        customerName: tokenData.customerName,
        customerEmail: tokenData.customerEmail,
        propertyName: tokenData.itemName,
        status: 'published',
        createdAt: new Date().toISOString()
      });

      await updateDoc(doc(db, 'review_tokens', token), {
        used: true,
        usedAt: new Date().toISOString()
      });

      toast({
        title: "Merci pour votre avis !",
        description: "Votre commentaire a été publié avec succès.",
      });

      setStep(5);
    } catch (err) {
      console.error("Error submitting review:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer votre avis. Veuillez réessayer.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-[#00C896] mb-4" />
        <p className="text-slate-500 font-medium">Chargement de votre formulaire...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <Card className="max-w-md w-full border-none shadow-2xl rounded-[2rem] text-center p-10 bg-white">
          <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">{error}</h2>
          <Button onClick={() => router.push('/')} className="bg-[#00C896] hover:bg-[#00C896]/90 text-white font-bold px-8 h-12 rounded-xl">
            Retour à l'accueil
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-4 md:px-0">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {step < 5 && (
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <div className="relative h-48 md:h-64 w-full">
              <div className="absolute inset-0 bg-slate-900/40 z-10 flex flex-col justify-end p-8">
                <h1 className="text-white text-2xl md:text-3xl font-black drop-shadow-lg">
                  Évaluez l'établissement {tokenData?.itemName}
                </h1>
                <p className="text-white/90 font-bold text-sm md:text-base mt-2">
                  Du {new Date(tokenData?.startDate).toLocaleDateString("fr-FR")} au {new Date(tokenData?.endDate).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="absolute top-0 right-0 p-6 z-20">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white text-xs font-black tracking-widest uppercase">
                   Étape {step} / 4
                </div>
              </div>
              <Image 
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80" 
                alt="Hotel" 
                fill 
                className="object-cover"
              />
            </div>
          </Card>
        )}

        {step === 1 && (
          <Card className="border-none shadow-2xl rounded-[2.5rem] p-8 md:p-12 animate-in slide-in-from-right duration-500 bg-white">
             <div className="space-y-10">
                <section className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 border-l-4 border-[#00C896] pl-4">1. Avez-vous voyagé pour le travail ?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {['Non', 'Oui'].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => setFormData({...formData, travelType: opt.toLowerCase()})}
                        className={cn(
                          "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all font-bold",
                          formData.travelType === opt.toLowerCase() ? "border-[#00C896] bg-[#00C896]/5 text-[#00C896]" : "border-slate-100 hover:border-slate-200 text-slate-500"
                        )}
                      >
                         <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center", formData.travelType === opt.toLowerCase() ? "border-[#00C896]" : "border-slate-300")}>
                          {formData.travelType === opt.toLowerCase() && <div className="w-3 h-3 bg-[#00C896] rounded-full" />}
                        </div>
                        {opt}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 border-l-4 border-[#00C896] pl-4">Avec qui avez-vous voyagé ?</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Seul(e)', 'Des amis', 'Partenaire', 'Famille', 'Un/des collègue(s)', 'Animal de compagnie'].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => setFormData({...formData, companion: opt})}
                        className={cn(
                          "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-2 text-center h-32",
                          formData.companion === opt ? "border-[#00C896] bg-[#00C896]/5 text-[#00C896]" : "border-slate-100 hover:border-slate-200 text-slate-500"
                        )}
                      >
                        <Users className={cn("h-6 w-6", formData.companion === opt ? "text-[#00C896]" : "text-slate-300")} />
                        <span className="text-xs font-black uppercase tracking-tight leading-tight">{opt}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 border-l-4 border-[#00C896] pl-4">L'établissement correspondait-il à vos attentes ?</h3>
                  <div className="space-y-3">
                    {['Non', 'Oui', 'Il était mieux que je l\'espérais'].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => setFormData({...formData, metExpectations: opt})}
                        className={cn(
                          "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all font-bold w-full text-left",
                          formData.metExpectations === opt ? "border-[#00C896] bg-[#00C896]/5 text-[#00C896]" : "border-slate-100 hover:border-slate-200 text-slate-500"
                        )}
                      >
                        <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center", formData.metExpectations === opt ? "border-[#00C896]" : "border-slate-300")}>
                          {formData.metExpectations === opt && <div className="w-3 h-3 bg-[#00C896] rounded-full" />}
                        </div>
                        {opt}
                      </button>
                    ))}
                  </div>
                </section>

                <div className="pt-8 border-t flex justify-end">
                   <Button onClick={handleNext} className="bg-[#00C896] hover:bg-[#00C896]/90 text-white font-black px-12 h-14 rounded-2xl text-lg shadow-xl shadow-[#00C896]/20">
                     Continuer <ChevronRight className="ml-2" />
                   </Button>
                </div>
             </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-none shadow-2xl rounded-[2.5rem] p-8 md:p-12 animate-in slide-in-from-right duration-500 bg-white">
             <div className="space-y-12">
                <section className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-black text-slate-900 mb-2">2. Évaluez cet établissement</h3>
                    <p className="text-slate-500 font-medium italic">Quelle note donneriez-vous à {tokenData?.itemName} ?</p>
                  </div>
                  
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-center">
                    <div className="flex justify-between items-end mb-4 px-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mauvais</span>
                       <span className="text-4xl font-black text-[#00C896]">{formData.overallRating || '-'} / 10</span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exceptionnel</span>
                    </div>
                    <div className="flex justify-between gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <button 
                          key={n}
                          onClick={() => setFormData({...formData, overallRating: n})}
                          className={cn(
                            "flex-1 h-12 md:h-16 rounded-lg font-black transition-all border-2",
                            formData.overallRating >= n ? "bg-[#00C896] border-[#00C896] text-white" : "bg-white border-slate-200 text-slate-300 hover:border-slate-300"
                          )}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-lg font-black text-slate-800">Évaluation par catégorie (facultatif)</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter mt-1">Cliquez sur l'émoticône qui correspond pour chaque critère</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'staff', label: 'Personnel' },
                      { id: 'facilities', label: 'Équipements' },
                      { id: 'cleanliness', label: 'Propreté' },
                      { id: 'comfort', label: 'Confort' },
                      { id: 'location', label: 'Situation géographique' }
                    ].map((cat) => (
                      <div key={cat.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-slate-50/30 border border-slate-100 last:border-0 hover:bg-slate-50 transition-colors rounded-3xl">
                        <span className="font-black text-slate-700 tracking-tight ml-2">{cat.label}</span>
                        <div className="flex gap-3">
                          {[
                            { val: 1, e: '😞' },
                            { val: 2, e: '😐' },
                            { val: 3, e: '🙂' },
                            { val: 4, e: '😄' }
                          ].map((emoji) => (
                            <button 
                              key={emoji.val}
                              onClick={() => setFormData({
                                ...formData, 
                                categories: { ...formData.categories, [cat.id]: emoji.val }
                              })}
                              className={cn(
                                "w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition-all border-2",
                                (formData.categories as any)[cat.id] === emoji.val 
                                  ? "bg-white border-[#00C896] shadow-lg scale-110" 
                                  : "bg-white border-slate-100 hover:border-slate-200 text-slate-400"
                              )}
                            >
                              {emoji.e}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="pt-8 border-t flex justify-between">
                   <Button variant="ghost" onClick={handleBack} className="font-bold text-slate-400">
                     ← Retour
                   </Button>
                   <Button onClick={handleNext} className="bg-[#00C896] hover:bg-[#00C896]/90 text-white font-black px-12 h-14 rounded-2xl text-lg shadow-xl shadow-[#00C896]/20">
                     Continuer <ChevronRight className="ml-2" />
                   </Button>
                </div>
             </div>
          </Card>
        )}

        {step === 3 && (
          <Card className="border-none shadow-2xl rounded-[2.5rem] p-8 md:p-12 animate-in slide-in-from-right duration-500 bg-white">
             <div className="space-y-12">
                <section className="space-y-6">
                   <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                     <Car className="h-6 w-6 text-[#00C896]" /> 3. Informations complémentaires
                   </h3>
                   <p className="text-sm font-medium text-slate-500 italic">Quel était votre moyen de transport principal pour ce séjour ?</p>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                     {[
                       { id: 'voiture', label: 'Voiture', icon: Car },
                       { id: 'bus', label: 'Bus', icon: Bus },
                       { id: 'train', label: 'Train', icon: Train },
                       { id: 'avion', label: 'Avion', icon: Plane },
                       { id: 'bateau', label: 'Bateau', icon: Anchor },
                       { id: 'autre', label: 'Autre', icon: Info }
                     ].map((t) => (
                       <button 
                         key={t.id}
                         onClick={() => setFormData({...formData, transport: t.id})}
                         className={cn(
                           "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 h-24",
                           formData.transport === t.id ? "border-[#00C896] bg-[#00C896]/5 text-[#00C896]" : "border-slate-100 text-slate-400 group"
                         )}
                       >
                         <t.icon className="h-5 w-5" />
                         <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                       </button>
                     ))}
                   </div>
                </section>

                <section className="space-y-8">
                   <div className="space-y-4">
                     <Label className="text-lg font-black text-slate-800 flex items-center gap-2">
                       <ThumbsUp className="h-5 w-5 text-green-500" /> Ce que vous avez aimé
                     </Label>
                     <Textarea 
                       value={formData.commentLikes}
                       onChange={e => setFormData({...formData, commentLikes: e.target.value})}
                       placeholder="Quels ont été les aspects positifs de votre séjour ?"
                       className="min-h-[100px] border-slate-200 rounded-2xl p-4 bg-slate-50/30"
                     />
                   </div>

                   <div className="space-y-4">
                     <Label className="text-lg font-black text-slate-800 flex items-center gap-2">
                       <ThumbsDown className="h-5 w-5 text-red-500" /> Ce que vous n'avez pas apprécié
                     </Label>
                     <Textarea 
                       value={formData.commentDislikes}
                       onChange={e => setFormData({...formData, commentDislikes: e.target.value})}
                       placeholder="Qu'est-ce qui pourrait être amélioré ?"
                       className="min-h-[100px] border-slate-200 rounded-2xl p-4 bg-slate-50/30"
                     />
                   </div>

                   <div className="space-y-4">
                     <Label className="text-lg font-black text-slate-800">Votre séjour en une phrase courte</Label>
                     <Input 
                       value={formData.commentSummary}
                       onChange={e => setFormData({...formData, commentSummary: e.target.value})}
                       placeholder="Ex: Un séjour inoubliable au coeur de la ville"
                       className="h-14 border-slate-200 rounded-2xl p-4 bg-slate-50/30 font-bold"
                     />
                   </div>
                </section>

                <div className="pt-8 border-t flex justify-between">
                   <Button variant="ghost" onClick={handleBack} className="font-bold text-slate-400">
                     ← Retour
                   </Button>
                   <Button onClick={handleNext} className="bg-[#00C896] hover:bg-[#00C896]/90 text-white font-black px-12 h-14 rounded-2xl text-lg shadow-xl shadow-[#00C896]/20">
                     Continuer <ChevronRight className="ml-2" />
                   </Button>
                </div>
             </div>
          </Card>
        )}

        {step === 4 && (
          <Card className="border-none shadow-2xl rounded-[2.5rem] p-8 md:p-12 animate-in slide-in-from-right duration-500 bg-white">
             <div className="space-y-12">
                <section className="space-y-6">
                   <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                     <Camera className="h-6 w-6 text-[#00C896]" /> 4. Partagez vos souvenirs
                   </h3>
                   <p className="text-sm font-medium text-slate-500 italic">Donnez aux autres voyageurs un aperçu de votre séjour (facultatif).</p>
                   
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.photos.map((p, i) => (
                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group">
                          <Image src={p} alt="User Review Photo" fill className="object-cover" />
                        </div>
                      ))}
                      <label className="aspect-square rounded-2xl border-2 border-dashed border-[#00C896]/30 bg-[#00C896]/5 flex flex-col items-center justify-center cursor-pointer hover:bg-[#00C896]/10 transition-colors">
                        <Camera className="h-8 w-8 text-[#00C896] mb-2 opacity-30" />
                        <span className="text-[9px] font-black uppercase text-[#00C896] tracking-widest">Ajouter</span>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                          onChange={async (e) => {
                            if (e.target.files) {
                              const files = Array.from(e.target.files);
                              const newPhotos: string[] = [];
                              for (const file of files) {
                                const reader = new FileReader();
                                const base64 = await new Promise<string>((resolve) => {
                                  reader.onloadend = () => resolve(reader.result as string);
                                  reader.readAsDataURL(file);
                                });
                                newPhotos.push(base64);
                              }
                              setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
                            }
                          }}
                        />
                      </label>
                   </div>
                </section>

                <div className="bg-slate-900 text-white rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                   <div className="relative z-10 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 bg-[#00C896] text-white font-black text-xl flex items-center justify-center rounded-2xl shadow-lg border-2 border-white/20">
                             {tokenData?.customerName?.charAt(0) || 'C'}
                           </div>
                           <div>
                             <h4 className="font-black text-lg">{tokenData?.customerName || 'Client StayFloow'}</h4>
                             <p className="text-[#00C896] font-bold text-xs uppercase tracking-tighter">Voyage {formData.travelType === 'oui' ? 'Professionnel' : 'de loisirs'}</p>
                           </div>
                        </div>
                        <div className="text-4xl font-black text-[#00C896] drop-shadow-[0_0_15px_rgba(0,200,150,0.5)]">
                          {formData.overallRating || '0'}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {formData.commentSummary ? (
                          <div className="space-y-3">
                             <p className="text-lg font-black leading-tight italic">"{formData.commentSummary}"</p>
                             <div className="flex flex-col gap-2 opacity-80 text-sm">
                               {formData.commentLikes && <p><span className="text-[#00C896] font-black mr-2">+</span> {formData.commentLikes}</p>}
                               {formData.commentDislikes && <p><span className="text-red-400 font-black mr-2">-</span> {formData.commentDislikes}</p>}
                             </div>
                          </div>
                        ) : (
                          <p className="text-slate-500 font-bold italic py-4">Aperçu de votre commentaire...</p>
                        )}
                      </div>

                      {formData.transport && (
                        <Badge className="bg-white/10 text-white border-white/20 px-4 py-1 rounded-full uppercase text-[9px] font-black tracking-widest">
                           Voyage en {formData.transport}
                        </Badge>
                      )}
                   </div>
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Landmark className="h-32 w-32" />
                   </div>
                </div>

                <div className="pt-8 border-t flex justify-between">
                   <Button variant="ghost" onClick={handleBack} className="font-bold text-slate-400">
                     ← Modifier
                   </Button>
                   <Button 
                    onClick={handleSubmit} 
                    disabled={submitting || !formData.overallRating}
                    className="bg-[#00C896] hover:bg-[#00C896]/90 text-white font-black px-12 h-14 rounded-2xl text-lg shadow-xl shadow-[#00C896]/40"
                   >
                     {submitting ? <Loader2 className="animate-spin" /> : "Envoyer mon commentaire"}
                   </Button>
                </div>
             </div>
          </Card>
        )}

        {step === 5 && (
          <Card className="border-none shadow-2xl rounded-[3rem] p-12 md:p-20 text-center animate-in zoom-in-95 duration-700 bg-white">
             <div className="bg-[#00C896]/10 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                <CheckCircle2 className="h-16 w-16 text-[#00C896]" />
             </div>
             <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Merci, {tokenData?.customerName} ! 😍</h2>
             <p className="text-xl text-slate-500 max-w-lg mx-auto font-medium leading-relaxed">
               Votre évaluation a été enregistrée avec succès. Votre retour est essentiel pour maintenir la qualité StayFloow et aider la communauté.
             </p>
             <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => router.push('/')} className="bg-[#00C896] hover:bg-[#00C896]/90 text-white font-black px-10 h-14 rounded-2xl shadow-xl shadow-[#00C896]/20">
                   Retour sur StayFloow
                </Button>
                <Button variant="ghost" className="font-bold text-slate-400 h-14" onClick={() => window.open('https://www.instagram.com/stayfloow', '_blank')}>
                   Suivre StayFloow
                </Button>
             </div>
          </Card>
        )}

      </div>
    </div>
  );
}
