"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { MountainSnow, Menu, LogOut, User as UserIcon, Heart, LayoutDashboard } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const { t } = useLanguage();
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur StayFloow.com !",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de se déconnecter.",
      });
    }
  };

  const navLinks = [
    { href: "/search", label: t("accommodations") },
    { href: "/cars", label: t("car_rental") },
    { href: "/circuits", label: t("tours") },
    { href: "/partners/onboarding", label: t("become_partner") },
  ];

  if (!isClient) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm h-16" />
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 mr-8 group">
          <div className="bg-primary p-1.5 rounded-lg group-hover:scale-110 transition-transform">
            <MountainSnow className="h-6 w-6 text-white" />
          </div>
          <span className="font-headline text-2xl font-black tracking-tighter text-primary">
            StayFloow<span className="text-secondary">.com</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-500 transition-colors hover:text-primary relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {/* Desktop user menu */}
          {!userLoading && (
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border-2 border-slate-100 hover:border-primary transition-colors">
                      <Avatar className="h-full w-full">
                        <AvatarImage
                          src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`}
                          alt={user.displayName || "Utilisateur"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-black">
                          {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-64 p-2 rounded-xl mt-2" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal p-4">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-black text-slate-900 leading-none">
                          {user.displayName || "Utilisateur StayFloow"}
                        </p>
                        <p className="text-xs text-slate-400 font-medium truncate">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-slate-100" />

                    <div className="p-1 space-y-1">
                      <DropdownMenuItem asChild className="rounded-lg font-bold py-2.5 cursor-pointer">
                        <Link href="/profile" className="flex items-center gap-3">
                          <UserIcon className="h-4 w-4 text-primary" /> Mon Profil
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild className="rounded-lg font-bold py-2.5 cursor-pointer">
                        <Link href="/partners/dashboard" className="flex items-center gap-3">
                          <LayoutDashboard className="h-4 w-4 text-primary" /> Tableau de bord
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem className="rounded-lg font-bold py-2.5 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Heart className="h-4 w-4 text-primary" /> Mes Favoris
                        </div>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="bg-slate-100" />

                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="rounded-lg font-bold py-2.5 cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700"
                    >
                      <div className="flex items-center gap-3">
                        <LogOut className="h-4 w-4" /> Se déconnecter
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/auth/login" passHref>
                    <Button variant="ghost" className="font-bold text-slate-600 hover:text-primary hover:bg-primary/5">
                      {t("login")}
                    </Button>
                  </Link>
                  <Link href="/auth/register" passHref>
                    <Button className="bg-primary text-white font-black px-6 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all rounded-xl">
                      {t("signup")}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 border rounded-xl bg-slate-50 hover:bg-slate-100">
                  <Menu className="h-6 w-6 text-primary" />
                  <span className="sr-only">{t("open_menu")}</span>
                </Button>
              </SheetTrigger>

              <SheetContent
                className="w-[85%] sm:w-[400px] border-l-0 p-0"
              >
                <div className="flex flex-col h-full bg-white">
                  <div className="p-6 border-b flex items-center justify-between">
                    <Link
                      href="/"
                      className="flex items-center gap-2"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <div className="bg-primary p-1.5 rounded-lg">
                        <MountainSnow className="h-6 w-6 text-white" />
                      </div>
                      <span className="font-headline text-2xl font-black text-primary tracking-tighter">
                        StayFloow
                      </span>
                    </Link>
                  </div>

                  <nav className="flex flex-col gap-2 p-6 overflow-y-auto">
                    {user && (
                      <div className="mb-6 p-4 bg-primary/5 rounded-2xl flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarImage src={user.photoURL || ""} />
                          <AvatarFallback className="font-black text-primary bg-white">{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-black text-slate-900 leading-none mb-1">{user.displayName || "Voyageur"}</p>
                          <Link href="/profile" className="text-xs font-bold text-primary underline" onClick={() => setIsSheetOpen(false)}>Gérer mon profil</Link>
                        </div>
                      </div>
                    )}

                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="p-4 text-lg font-bold text-slate-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto p-6 border-t bg-slate-50">
                    {user ? (
                      <Button
                        className="w-full h-14 border-2 border-red-100 bg-white text-red-600 font-black text-lg rounded-xl hover:bg-red-50"
                        onClick={() => {
                          handleLogout();
                          setIsSheetOpen(false);
                        }}
                      >
                        <LogOut className="h-5 w-5 mr-3" /> Se déconnecter
                      </Button>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <Link href="/auth/login" className="block" onClick={() => setIsSheetOpen(false)}>
                          <Button variant="outline" className="w-full h-14 border-primary text-primary font-black rounded-xl">
                            {t("login")}
                          </Button>
                        </Link>

                        <Link href="/auth/register" className="block" onClick={() => setIsSheetOpen(false)}>
                          <Button className="w-full h-14 bg-primary text-white font-black rounded-xl">
                            {t("signup")}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
