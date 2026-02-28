
"use client";

import { useUser, useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  LogOut, 
  Settings, 
  Shield, 
  Clock, 
  ArrowLeft,
  Loader2,
  Calendar,
  Sparkles,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur StayFloow.com !",
      });
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de se déconnecter.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-primary text-white py-6 px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-black tracking-tight">
            StayFloow<span className="text-secondary">.com</span>
          </Link>
          <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sidebar Profil */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl overflow-hidden rounded-3xl bg-white">
              <div className="h-24 bg-primary" />
              <CardContent className="pt-0 text-center -mt-12">
                <div className="inline-block p-1 bg-white rounded-full mb-4 shadow-lg">
                  <div className="bg-slate-100 h-24 w-24 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-slate-400" />
                  </div>
                </div>
                <h2 className="text-xl font-black text-slate-900 truncate">
                  {user.displayName || "Voyageur StayFloow"}
                </h2>
                <p className="text-sm text-slate-500 font-medium truncate mb-6">{user.email}</p>
                <Button 
                  variant="outline" 
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                </Button>
              </CardContent>
            </Card>

            <nav className="space-y-2">
              <ProfileNavItem icon={<Settings />} label="Paramètres du compte" active />
              <ProfileNavItem icon={<Clock />} label="Mes Réservations" />
              <ProfileNavItem icon={<Shield />} label="Sécurité" />
            </nav>
          </div>

          {/* Contenu Principal */}
          <div className="md:col-span-2 space-y-8">
            {/* CARTE SUGGESTION PARTENAIRE */}
            <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-slate-900 text-white relative group cursor-pointer hover:scale-[1.01] transition-all">
              <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="space-y-4">
                  <div className="bg-primary/20 text-primary w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="h-3 w-3" /> Nouveau : Louez votre bien
                  </div>
                  <h3 className="text-3xl font-black tracking-tight leading-none">Vous avez un hébergement ou une voiture ?</h3>
                  <p className="text-white/60 font-medium max-w-md">
                    Devenez partenaire StayFloow et commencez à générer des revenus dès aujourd'hui en proposant vos services à notre communauté.
                  </p>
                  <Button className="bg-primary hover:bg-primary/90 text-white font-black px-8 h-14 rounded-xl shadow-xl shadow-primary/20" asChild>
                    <Link href="/partners/join">Commencer maintenant <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                </div>
                <div className="bg-primary/10 p-8 rounded-3xl group-hover:scale-110 transition-transform">
                  <Sparkles className="h-20 w-20 text-primary opacity-50" />
                </div>
              </CardContent>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            </Card>

            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-xl font-black text-slate-800">Détails personnels</CardTitle>
                <CardDescription>Gérez vos informations de contact et de sécurité.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoField label="Email de connexion" value={user.email || ""} icon={<Mail />} />
                  <InfoField label="Date d'inscription" value={new Date(user.metadata.creationTime || "").toLocaleDateString('fr-FR')} icon={<Calendar />} />
                </div>
                
                <div className="pt-6 border-t border-slate-100">
                  <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">Statut du compte</h4>
                  <div className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-2xl border border-green-100">
                    <Shield className="h-5 w-5" />
                    <span className="text-sm font-bold">Compte vérifié et sécurisé</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-primary text-white py-12 px-8 text-center mt-12">
        <p className="opacity-50 text-sm">© 2025 StayFloow.com. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

function ProfileNavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm",
      active ? "bg-primary text-white shadow-lg" : "bg-white text-slate-600 hover:bg-slate-100 shadow-sm"
    )}>
      <span className={active ? "text-secondary" : "text-primary"}>{icon}</span>
      {label}
    </button>
  );
}

function InfoField({ label, value, icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
        {icon} {label}
      </p>
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 font-bold text-slate-700">
        {value}
      </div>
    </div>
  );
}
