
"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { circuits as initialCircuits } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, CreditCard, ShieldCheck, Info, Calendar as CalendarIcon, Users } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useCurrency } from '@/context/currency-context';
import { sendBookingConfirmationEmail } from '@/lib/mail';

const bookingSchema = z.object({
    fullName: z.string().min(2, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    phone: z.string().min(6, "Numéro trop court"),
    dialCode: z.string().min(1, "Indicatif requis"),
    paymentMethod: z.string().min(1, "Méthode requise"),
    agreeToTerms: z.boolean().refine(val => val === true, "Obligatoire"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

function CircuitBookingForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const { formatPrice } = useCurrency();
    
    const [circuit, setCircuit] = useState<any>(null);
    const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
    const [reservationDetails, setReservationDetails] = useState({ number: '', email: '' });

    const tourId = searchParams.get('id');
    const tourDate = searchParams.get('date');
    const tickets = searchParams.get('tickets') ? JSON.parse(searchParams.get('tickets')!) : {};
    const totalAmount = Number(searchParams.get('total')) || 0;

    useEffect(() => {
        const found = initialCircuits.find(p => String(p.id) === String(tourId));
        if (found) setCircuit(found);
        else setCircuit(initialCircuits[0]);
    }, [tourId]);

    const form = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            dialCode: "+213",
            paymentMethod: 'card',
            agreeToTerms: false,
        },
    });

    if (!circuit) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto h-10 w-10 text-primary" /></div>;

    const onSubmit = async (values: BookingFormValues) => {
        const resNum = `ST-TICKET-${Math.floor(1000 + Math.random() * 8999)}`;
        setReservationDetails({ number: resNum, email: values.email });
        
        try {
            await sendBookingConfirmationEmail({
                customerName: values.fullName,
                customerEmail: values.email,
                reservationNumber: resNum,
                itemName: circuit.title,
                itemType: 'tour',
                hostName: circuit.guide?.name || "StayFloow Guide",
                hostEmail: circuit.guide?.email || "contact@stayfloow.com",
                hostPhone: circuit.guide?.phone || "+213 550 00 00 00",
                bookingDetails: { 
                    date: tourDate,
                    tickets: tickets,
                    total: totalAmount,
                    customerPhone: `${values.dialCode} ${values.phone}`
                }
            });
        } catch (e) { 
            console.error("Erreur d'envoi d'email:", e); 
        }

        setIsBookingConfirmed(true);
        toast({ title: "Réservation confirmée !" });
    };

    if (isBookingConfirmed) {
        return (
            <div className="container mx-auto px-4 py-20 text-center max-w-5xl animate-in fade-in zoom-in-95 duration-500">
                <Card className="max-w-2xl mx-auto border-none shadow-2xl rounded-3xl p-12 text-center bg-white">
                    <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle className="h-16 w-16 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black mb-4">Votre ticket est prêt !</h1>
                    <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                        Référence : <strong>{reservationDetails.number}</strong>. Les détails ont été envoyés à <strong>{reservationDetails.email}</strong>.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button className="bg-primary hover:bg-primary/90 h-12 px-8 font-black" asChild><Link href="/">Retour à l'accueil</Link></Button>
                      <Button variant="outline" className="border-primary text-primary h-12 px-8 font-black">Télécharger le ticket</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6 font-bold text-slate-600 hover:text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour
            </Button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <Card className="border-none shadow-lg">
                                <CardHeader className="bg-slate-900 text-white rounded-t-lg">
                                    <CardTitle className="text-lg font-black uppercase">1. Vos Informations</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-6">
                                    <FormField control={form.control} name="fullName" render={({ field }) => (
                                        <FormItem><FormLabel className="font-bold">Nom complet</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="email" render={({ field }) => (
                                            <FormItem><FormLabel className="font-bold">Email</FormLabel><FormControl><Input className="h-12 rounded-xl" type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                        <div className="space-y-2">
                                            <FormLabel className="font-bold">Téléphone (WhatsApp)</FormLabel>
                                            <div className="flex gap-2">
                                                <FormField control={form.control} name="dialCode" render={({ field }) => (
                                                    <FormItem className="w-24"><FormControl><Input className="h-12 text-center font-bold bg-slate-50 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                                                )}/>
                                                <FormField control={form.control} name="phone" render={({ field }) => (
                                                    <FormItem className="flex-1"><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                                                )}/>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-lg">
                                <CardHeader className="bg-slate-900 text-white rounded-t-lg">
                                    <CardTitle className="text-lg font-black uppercase">2. Mode de Paiement</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-6">
                                    <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Label htmlFor="card" className="flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer peer-data-[state=checked]:border-primary hover:bg-slate-50 transition-all">
                                                <RadioGroupItem value="card" id="card" className="sr-only" />
                                                <CreditCard className="h-6 w-6 text-primary" /> <span className="font-bold">Carte Bancaire</span>
                                            </Label>
                                            <Label htmlFor="paypal" className="flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer peer-data-[state=checked]:border-primary hover:bg-slate-50 transition-all">
                                                <RadioGroupItem value="paypal" id="paypal" className="sr-only" />
                                                <div className="h-6 w-16 bg-slate-200 rounded animate-pulse" /> <span className="font-bold">PayPal</span>
                                            </Label>
                                        </RadioGroup>
                                    )}/>
                                </CardContent>
                            </Card>

                            <FormField control={form.control} name="agreeToTerms" render={({ field }) => (
                                <FormItem className="flex items-start space-x-3 p-6 border-2 border-slate-100 rounded-xl bg-white">
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    <Label className="text-sm cursor-pointer leading-tight text-slate-600">J'accepte les conditions de StayFloow.com et je confirme que les informations sont exactes.</Label>
                                    <FormMessage />
                                </FormItem>
                            )}/>

                            <Button type="submit" className="w-full h-16 text-xl font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl">
                                Valider la réservation
                            </Button>
                        </form>
                    </Form>
                </div>

                <div className="lg:col-span-1">
                    <Card className="sticky top-24 shadow-2xl border-none overflow-hidden rounded-2xl">
                        <div className="relative h-40 w-full">
                            <Image src={circuit.images[0]} alt={circuit.title} fill className="object-cover" />
                        </div>
                        <CardHeader className="bg-white pb-2">
                            <CardTitle className="text-xl font-black text-slate-900 leading-tight">{circuit.title}</CardTitle>
                            <p className="text-xs text-slate-500 flex items-center gap-1 font-bold"><CalendarIcon className="h-3 w-3" /> {tourDate ? format(new Date(tourDate), "dd MMM yyyy", { locale: fr }) : "Date à confirmer"}</p>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0 bg-white">
                            <Separator />
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase">Résumé des tickets</p>
                                {Object.entries(tickets).map(([tid, count]) => {
                                  if (count === 0) return null;
                                  const ttype = circuit.ticketTypes.find((t: any) => t.id === tid);
                                  return (
                                    <div key={tid} className="flex justify-between text-sm font-bold text-slate-700">
                                      <span>{count} x {ttype?.name}</span>
                                      <span>{formatPrice((ttype?.price || 0) * (count as number))}</span>
                                    </div>
                                  );
                                })}
                            </div>
                            <Separator />
                            <div className="flex justify-between items-end">
                                <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase">Total TTC</p>
                                  <p className="text-2xl font-black text-[#10B981]">{formatPrice(totalAmount)}</p>
                                </div>
                                <ShieldCheck className="h-8 w-8 text-primary opacity-20" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function CircuitBookingPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center flex flex-col items-center gap-4"><Loader2 className="h-10 w-10 text-primary animate-spin" /> Chargement...</div>}>
            <CircuitBookingForm />
        </Suspense>
    );
}

function Loader2({ className }: { className?: string }) {
  return <div className={cn("border-2 border-primary border-t-transparent rounded-full animate-spin", className)} />;
}
