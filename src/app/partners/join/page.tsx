
import Link from 'next/link';
import Image from 'next/image';
import PartnerOnboardingForm from '@/components/partners/PartnerOnboardingForm';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ShieldCheck, TrendingUp, Users, Globe } from 'lucide-react';

export default function PartnerJoinPage() {
  const partnerImage = PlaceHolderImages.find(img => img.id === 'partner-join');

  return (
    <div className="min-h-screen bg-[#F9F9FA] flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white py-6 px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold tracking-tight">
            StayFloow<span className="text-secondary">.com</span> Partner
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-sm opacity-90 hidden md:inline">Prêt à booster vos réservations ?</span>
            <Button variant="outline" className="text-white border-white hover:bg-white/10" asChild>
               <Link href="/login">Espace Extranet</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero / Info Section */}
      <section className="relative h-64 md:h-80 flex items-center">
        <Image src={partnerImage?.imageUrl || ''} alt="Partner" fill className="object-cover" />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Devenir Partenaire StayFloow</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Rejoignez le premier réseau de voyage en Afrique. Inscrivez votre établissement, voiture ou circuit et commencez à recevoir des réservations dès aujourd'hui.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Benefits Column */}
          <div className="lg:col-span-1 space-y-8">
            <h2 className="text-3xl font-bold text-primary mb-8">Pourquoi nous ?</h2>
            <BenefitCard 
              icon={<Users className="h-6 w-6" />}
              title="Plus de visibilité"
              desc="Accédez à des milliers de voyageurs cherchant activement des séjours en Algérie et Égypte."
            />
            <BenefitCard 
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Sécurité garantie"
              desc="Paiements sécurisés et vérification rigoureuse des profils clients pour votre tranquillité."
            />
            <BenefitCard 
              icon={<TrendingUp className="h-6 w-6" />}
              title="Boostez vos revenus"
              desc="Nos outils marketing boostent votre taux d'occupation, surtout en basse saison."
            />
            <BenefitCard 
              icon={<Globe className="h-6 w-6" />}
              title="GPS Intégré"
              desc="Vos clients vous trouvent facilement grâce à notre intégration OpenStreetMap ultra-précise."
            />
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white p-2 rounded-2xl shadow-xl border-2 border-primary/5">
               <div className="bg-muted/30 p-8 rounded-xl">
                  <h3 className="text-2xl font-bold text-primary mb-2 text-center">Formulaire d'inscription intelligent</h3>
                  <p className="text-muted-foreground text-center mb-8">L'inscription est gratuite et ne prend que 5 minutes.</p>
                  <PartnerOnboardingForm />
               </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-border py-12 text-center text-sm text-muted-foreground">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-center gap-8 mb-6">
             <Link href="#" className="hover:text-primary transition-colors">Aide</Link>
             <Link href="#" className="hover:text-primary transition-colors">Confidentialité</Link>
             <Link href="#" className="hover:text-primary transition-colors">Conditions</Link>
          </div>
          <p>© 2025 StayFloow Partner Program. Plateforme Sécurisée et Fiable.</p>
        </div>
      </footer>
    </div>
  );
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4 p-6 bg-white rounded-xl shadow-sm border border-primary/5 hover:border-primary/20 transition-all">
      <div className="bg-primary/10 p-3 rounded-lg text-primary h-fit">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-lg text-primary mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Button({ children, className, variant, asChild, ...props }: any) {
  const Comp = asChild ? Link : 'button';
  const base = "px-6 py-2 rounded-lg font-bold transition-all inline-flex items-center justify-center";
  const variants: any = {
    primary: "bg-primary text-white hover:bg-primary/90",
    outline: "border-2 border-primary text-primary hover:bg-primary/5",
    ghost: "text-primary hover:bg-primary/5",
    link: "text-primary underline-offset-4 hover:underline"
  };
  return (
    <Comp className={`${base} ${variants[variant || 'primary']} ${className}`} {...props}>
      {children}
    </Comp>
  );
}
