
export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-10">
      <div className="bg-white p-12 rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full text-center animate-in fade-in zoom-in-95 duration-500">
        <h1 className="text-4xl font-black text-primary mb-6 tracking-tight">
          Mode Édition — StayFloow<span className="text-secondary">.com</span>
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed font-medium">
          Bienvenue dans votre espace de gestion. Ici, vous allez pouvoir modifier votre site en live et piloter l'ensemble de la plateforme.
        </p>
        <div className="mt-10 h-1 w-20 bg-secondary mx-auto rounded-full" />
      </div>
    </div>
  );
}
