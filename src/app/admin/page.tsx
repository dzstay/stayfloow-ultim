import { PerformanceAnalyzer } from "@/components/performance-analyzer";
import Link from "next/link";
import { LayoutDashboard, Users, CheckSquare, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Admin */}
      <header className="bg-slate-900 text-white py-6 px-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-2 rounded-xl">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">StayFloow Admin</h1>
              <p className="text-xs text-white/50 font-bold uppercase tracking-widest">Portail de Gestion Globale</p>
            </div>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Quitter le mode admin</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Navigation Rapide */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Menu Navigation</h2>
            <div className="grid grid-cols-1 gap-3">
              <AdminNavLink 
                href="/admin/validate" 
                icon={<CheckSquare className="h-5 w-5" />} 
                title="Validation Annonces" 
                desc="Approuver les nouveaux partenaires"
              />
              <AdminNavLink 
                href="/admin/settings/seo" 
                icon={<Search className="h-5 w-5" />} 
                title="Optimiseur SEO" 
                desc="Gérer les méta-données IA"
              />
              <AdminNavLink 
                href="#" 
                icon={<Users className="h-5 w-5" />} 
                title="Utilisateurs" 
                desc="Gestion de la communauté"
                disabled
              />
            </div>

            <div className="p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden shadow-2xl">
              <h3 className="text-xl font-black mb-2 relative z-10">Mode Édition Directe</h3>
              <p className="text-white/60 text-sm mb-6 relative z-10 leading-relaxed">
                Vous avez les pleins pouvoirs. Toute modification est répercutée en direct sur la plateforme StayFloow.com.
              </p>
              <div className="h-1 w-12 bg-secondary rounded-full relative z-10" />
              {/* Décoration */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Analyseur de Performance IA */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Intelligence & Data</h2>
            <PerformanceAnalyzer />
          </div>

        </div>
      </main>

      <footer className="mt-auto py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-tighter">
        StayFloow Engine v2.5 — Propriété exclusive de StayFloow.com
      </footer>
    </div>
  );
}

function AdminNavLink({ href, icon, title, desc, disabled = false }: { href: string, icon: any, title: string, desc: string, disabled?: boolean }) {
  return (
    <Link 
      href={disabled ? "#" : href} 
      className={`p-5 rounded-2xl border-2 border-transparent transition-all flex items-center gap-4 shadow-sm ${
        disabled 
          ? "bg-slate-100 opacity-50 cursor-not-allowed" 
          : "bg-white hover:border-primary hover:shadow-xl group"
      }`}
    >
      <div className={`p-3 rounded-xl transition-colors ${disabled ? "bg-slate-200 text-slate-400" : "bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white"}`}>
        {icon}
      </div>
      <div>
        <h4 className="font-black text-slate-900 text-sm">{title}</h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase">{desc}</p>
      </div>
    </Link>
  );
}
