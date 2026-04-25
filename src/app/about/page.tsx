
import React from 'react';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle2, Globe, Sparkles, UserCheck, Zap, MapPin, Building, Car, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'À propos de StayFloow | La Plateforme N°1 en Algérie & Égypte',
  description: 'Découvrez comment StayFloow réinvente le voyage en Algérie et en Égypte. Connectez-vous avec les meilleurs hébergements, voitures et circuits locaux.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-primary pt-24 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-secondary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 text-secondary-foreground font-black text-xs uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="h-3 w-3" />
            N°1 en Algérie & Égypte
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
            La plateforme qui réinvente le voyage en <span className="text-secondary">Algérie</span> et en <span className="text-secondary">Égypte</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 font-medium max-w-3xl mx-auto leading-relaxed">
            StayFloow est née d'un constat simple : nos destinations méritent une plateforme à leur hauteur. 
            Un espace conçu par et pour les locaux, où chaque hôte a le contrôle, et chaque voyageur trouve ce qu'il cherche vraiment.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Notre mission</h2>
              <h3 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Rendre le voyage accessible, fluide et authentique.
              </h3>
            </div>
            
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-medium">
              <p>
                Nous connectons les voyageurs avec les meilleurs hébergements, voitures et circuits locaux — le tout en quelques clics, sans friction.
              </p>
              <p>
                StayFloow est la première plateforme dédiée à ces destinations, pensée pour les hôtes qui veulent gérer leurs biens comme ils l'entendent, et pour les voyageurs qui veulent vivre une expérience vraie.
              </p>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
            <div className="relative aspect-square rounded-[2.5rem] bg-slate-100 overflow-hidden border border-slate-200">
              <img 
                src="https://images.unsplash.com/photo-1549194388-2469d59ec69c?q=80&w=1000&auto=format&fit=crop" 
                alt="Exploration Algérie" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-2xl font-black italic">"Le voyage commence ici."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers Section */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { num: '2', label: 'pays couverts', icon: <Globe className="h-6 w-6" /> },
              { num: '3', label: 'services disponibles', icon: <Sparkles className="h-6 w-6" /> },
              { num: '1ère', label: 'plateforme du genre en Algérie', icon: <CheckCircle2 className="h-6 w-6" /> },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-4 p-8 rounded-3xl bg-white shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500">
                <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-4">
                  {stat.icon}
                </div>
                <div className="text-5xl font-black text-slate-900">{stat.num}</div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why StayFloow Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Engagement</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Pourquoi StayFloow ?</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Hébergements, voitures & circuits",
              desc: "Tout ce dont vous avez besoin pour votre voyage, en un seul endroit.",
              icon: <div className="flex gap-2"><Building className="h-5 w-5" /><Car className="h-5 w-5" /><Compass className="h-5 w-5" /></div>
            },
            {
              title: "Hôtes maîtres de leurs biens",
              desc: "Gérez vos réservations, disponibilités et tarifs comme vous le souhaitez.",
              icon: <UserCheck className="h-6 w-6" />
            },
            {
              title: "Simple à utiliser",
              desc: "Une interface pensée pour être intuitive, que vous soyez hôte ou voyageur.",
              icon: <Zap className="h-6 w-6" />
            },
            {
              title: "Connaissance locale",
              desc: "Des partenaires vérifiés, des adresses authentiques, une vraie expertise terrain.",
              icon: <MapPin className="h-6 w-6" />
            }
          ].map((card, i) => (
            <div key={i} className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:border-primary/20 hover:shadow-2xl transition-all duration-500 flex gap-8 items-start">
              <div className="p-4 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                {card.icon}
              </div>
              <div className="space-y-3">
                <h4 className="text-xl font-black text-slate-900">{card.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="relative rounded-[3rem] bg-primary overflow-hidden p-12 md:p-24 text-center space-y-10">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 space-y-6">
            <h3 className="text-3xl md:text-6xl font-black text-white leading-tight">
              Vous avez un bien à proposer ?
            </h3>
            <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
              Rejoignez StayFloow et mettez votre hébergement, voiture ou circuit en avant dès aujourd'hui.
            </p>
          </div>
          
          <div className="relative z-10">
            <Button size="lg" className="h-16 px-10 rounded-2xl bg-secondary hover:bg-secondary/90 text-primary font-black text-xl shadow-xl hover:scale-105 transition-all" asChild>
              <Link href="/partners/join">
                S'inscrire comme partenaire
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
