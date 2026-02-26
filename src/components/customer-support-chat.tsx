"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Send, Headset } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function CustomerSupportChat() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Bouton flottant */}
      <div
        className={cn(
          "fixed bottom-8 right-8 z-50 transition-all duration-500 ease-in-out transform",
          isOpen ? "scale-0 opacity-0 rotate-90" : "scale-100 opacity-100 rotate-0"
        )}
      >
        <Button
          onClick={handleToggle}
          className="rounded-full shadow-2xl w-16 h-16 flex items-center justify-center bg-primary hover:bg-primary/90 text-white border-4 border-white active:scale-95 transition-all"
        >
          <MessageSquare className="h-8 w-8" />
        </Button>
      </div>

      {/* Fenêtre de chat */}
      <div
        className={cn(
          "fixed bottom-8 right-8 z-50 w-80 md:w-96 transition-all duration-500 ease-in-out transform origin-bottom-right",
          isOpen 
            ? "translate-y-0 scale-100 opacity-100" 
            : "translate-y-10 scale-90 opacity-0 pointer-events-none"
        )}
      >
        <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white ring-1 ring-black/5">
          <CardHeader className="bg-slate-900 text-white p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-xl">
                  <Headset className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black tracking-tight">Support StayFloow</CardTitle>
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">En ligne • Réponse en 5 min</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleToggle}
                className="text-white hover:bg-white/10 rounded-full h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                Bonjour ! Comment pouvons-nous vous aider dans l'organisation de votre voyage aujourd'hui ?
              </p>
            </div>

            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-xs font-bold border-slate-200 hover:border-primary hover:text-primary rounded-xl h-10"
                onClick={() => alert("Redirection vers FAQ...")}
              >
                Comment réserver un circuit ?
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-xs font-bold border-slate-200 hover:border-primary hover:text-primary rounded-xl h-10"
                onClick={() => alert("Redirection vers annulations...")}
              >
                Politique d'annulation
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button
                onClick={() => window.open('https://wa.me/213550000000', '_blank')}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" /> Discuter sur WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
