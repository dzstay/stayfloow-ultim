'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

export type Locale = 'fr' | 'en' | 'ar' | 'es';

const localeDetails: Record<Locale, { name: string; flag: string; dir: 'ltr' | 'rtl' }> = {
    fr: { name: 'Français', flag: '🇫🇷', dir: 'ltr' },
    en: { name: 'English', flag: '🇬🇧', dir: 'ltr' },
    ar: { name: 'العربية', flag: '🇩🇿', dir: 'rtl' },
    es: { name: 'Español', flag: '🇪🇸', dir: 'ltr' },
};

const translations: Record<string, Record<Locale, string>> = {
    // Navigation & Global
    "accommodations": { fr: "Hébergements", en: "Accommodations", ar: "أماكن الإقامة", es: "Alojamientos" },
    "car_rental": { fr: "Voitures", en: "Car Rental", ar: "تأجير السيارات", es: "Alquiler de Coches" },
    "tours": { fr: "Circuits", en: "Tours & Activities", ar: "الجولات والأنشطة", es: "Tours y Actividades" },
    "tours_title": { fr: "Nos Circuits & Excursions", en: "Our Tours & Excursions", ar: "جولاتنا ورحلاتنا", es: "Nuestros Tours y Excursiones" },
    "tours_subtitle": { fr: "Explorez les merveilles de l'Afrique avec nos guides certifiés StayFloow.", en: "Explore the wonders of Africa with our certified StayFloow guides.", ar: "استكشف عجائب أفريقيا مع مرشدينا المعتمدين.", es: "Explore las maravillas de África con nuestros guías certificados." },
    "list_property": { fr: "Listez votre bien", en: "List your property", ar: "أضف عقارك", es: "Publica tu propriété" },
    "login": { fr: "Se connecter", en: "Log In", ar: "تسجيل الدخول", es: "Iniciar sesión" },
    "register": { fr: "S'inscrire", en: "Sign Up", ar: "إنشاء حساب", es: "Registrarse" },
    "profile": { fr: "Profil", en: "Profile", ar: "الملف الشخصي", es: "Perfil" },
    "dashboard": { fr: "Tableau de bord", en: "Dashboard", ar: "لوحة التحكم", es: "Panel" },
    "logout": { fr: "Déconnexion", en: "Log Out", ar: "تسجيل الخروج", es: "Cerrar sesión" },
    "back": { fr: "Retour", en: "Back", ar: "رجوع", es: "Volver" },
    "continue": { fr: "Continuer", en: "Continue", ar: "استمرار", es: "Continuar" },
    "start": { fr: "Commencer", en: "Start", ar: "ابدأ", es: "Empezar" },
    "help": { fr: "Aide", en: "Help", ar: "مساعدة", es: "Ayuda" },

    // Composition
    "chambers": { fr: "Chambres", en: "Bedrooms", ar: "غرف نوم", es: "Dormitorios" },
    "bathrooms": { fr: "Salles de bain", en: "Bathrooms", ar: "حمامات", es: "Baños" },
    "kitchens": { fr: "Cuisines", en: "Kitchens", ar: "مابخ", es: "Cocinas" },
    "toilets": { fr: "Toilettes", en: "Toilets", ar: "مراحيض", es: "Aseos" },
    "living_rooms": { fr: "Salons", en: "Living Rooms", ar: "صالات", es: "Salones" },
    "gardens": { fr: "Jardins", en: "Gardens", ar: "حدائق", es: "Jardines" },

    // Circuit Specific Filters
    "Guide inclus (local arabe/français)": { fr: "Guide inclus (local arabe/français)", en: "Guide included (local Arabic/French)", ar: "دليل سياحي (عربي/فرنسي)", es: "Guía incluido (local árabe/francés)" },
    "Repas inclus (halal)": { fr: "Repas inclus (halal)", en: "Meals included (halal)", ar: "وجبات متوفرة (حلال)", es: "Comidas incluidas (halal)" },
    "Transport 4x4 (désert)": { fr: "Transport 4x4 (désert)", en: "4x4 Transport (desert)", ar: "نقل رباعي الدفع (صحراء)", es: "Transporte 4x4 (desierto)" },
    "Durée 1 jour": { fr: "Durée 1 jour", en: "Duration 1 day", ar: "لمدة يوم واحد", es: "Duración 1 día" },
    "Durée multi-jours (2-7 jours)": { fr: "Durée multi-jours (2-7 jours)", en: "Multi-day (2-7 days)", ar: "عدة أيام (2-7 أيام)", es: "Varios días (2-7 días)" },
    "Annulation gratuite": { fr: "Annulation gratuite", en: "Free cancellation", ar: "إلغاء مجاني", es: "Cancelación gratuita" },
    "Langue arabe": { fr: "Langue arabe", en: "Arabic language", ar: "اللغة العربية", es: "Idioma árabe" },
    "Langue français": { fr: "Langue français", en: "French language", ar: "اللغة الفرنسية", es: "Idioma francés" },
    "Thème désert/Sahara": { fr: "Thème désert/Sahara", en: "Desert/Sahara theme", ar: "موضوع الصحراء", es: "Tema desierto/Sahara" },
    "Thème culturel/historique (pyramides, ruines)": { fr: "Thème culturel/historique (pyramides, ruines)", en: "Cultural/Historical (pyramids, ruins)", ar: "ثقافي/تاريخي (أهرامات، آثار)", es: "Cultural/Histórico (pirámides, ruinas)" },
    "Thème Nil/croisière": { fr: "Thème Nil/croisière", en: "Nile/Cruise theme", ar: "موضوع النيل/كروازيير", es: "Tema Nilo/crucero" },
    "Groupe petit (max 10 pers)": { fr: "Groupe petit (max 10 pers)", en: "Small group (max 10 people)", ar: "مجموعة صغيرة (10 أشخاص كحد أقصى)", es: "Grupo pequeño (máx. 10 pers)" },
    "Assurance incluse": { fr: "Assurance incluse", en: "Insurance included", ar: "تأمين شامل", es: "Seguro incluido" },
    "Départ depuis aéroport (Alger/Caire)": { fr: "Départ depuis aéroport (Alger/Caire)", en: "Airport pickup (Algiers/Cairo)", ar: "انطلاق من المطار (الجزائر/القاهرة)", es: "Salida desde el aeropuerto (Argel/Cairo)" },
    "Rating guide 8+": { fr: "Rating guide 8+", en: "Guide rating 8+", ar: "تقييم المرشد 8+", es: "Valoración del guía 8+" },

    // Car Specific
    "car_hero_title": { fr: "Location de voitures pour tous les types de voyages", en: "Car rentals for every kind of trip", ar: "تأجير سيارات لجميع أنواع الرحلات", es: "Alquiler de coches para todo tipo de viajes" },
    "car_hero_subtitle": { fr: "De super voitures à des tarifs avantageux, proposées par les plus grandes sociétés de location de voitures.", en: "Great cars at great prices, from the biggest car rental companies.", ar: "سيارات رائعة بأسعار رائعة، من أكبر شركات تأجير السيارات.", es: "Grandes coches a grandes precios, de las mayores empresas de alquiler de coches." },
    "pickup_location": { fr: "Lieu de prise en charge", en: "Pick-up location", ar: "موقع الاستلام", es: "Lugar de recogida" },
    "pickup_date": { fr: "Date de prise en charge", en: "Pick-up date", ar: "تاريخ الاستلام", es: "Fecha de recogida" },
    "return_date": { fr: "Date de restitution", en: "Return date", ar: "تاريخ العودة", es: "Fecha de devolución" },
    "hour": { fr: "Heure", en: "Time", ar: "الوقت", es: "Hora" },

    // Amenities
    "WiFi gratuit": { fr: "WiFi gratuit", en: "Free WiFi", ar: "واي فاي مجاني", es: "WiFi gratis" },
    "Climatisation": { fr: "Climatisation", en: "Air Conditioning", ar: "تكييف هواء", es: "Aire acondicionado" },
    "Parking gratuit": { fr: "Parking gratuit", en: "Free Parking", ar: "موقف سيارات مجاني", es: "Parking gratis" },
    "Petit-déjeuner inclus": { fr: "Petit-déjeuner inclus", en: "Breakfast included", ar: "فطور شامل", es: "Desayuno incluido" },
    "Piscine": { fr: "Piscine", en: "Swimming Pool", ar: "مسبح", es: "Piscina" },
    "Restaurant sur place": { fr: "Restaurant sur place", en: "On-site Restaurant", ar: "مطعم في الموقع", es: "Restaurante en el sitio" },
    "Réception 24h/24": { fr: "Réception 24h/24", en: "24-hour Front Desk", ar: "استقبال على مدار 24 ساعة", es: "Recepción 24 horas" },
    "Animaux domestiques acceptés": { fr: "Animaux domestiques acceptés", en: "Pets allowed", ar: "يسمح باصطحاب الحيوانات الأليفة", es: "Se admiten mascotas" },
    "Terrasse / balcon / vue": { fr: "Terrasse / balcon / vue", en: "Terrace / balcony / view", ar: "تراس / شرفة / إطلالة", es: "Terraza / balcón / vista" },
    "Cuisine / coin cuisine": { fr: "Cuisine / coin cuisine", en: "Kitchen / kitchenette", ar: "مطبخ / مطبخ صغير", es: "Cocina / cocina americana" },
    "Prises électriques près du lit": { fr: "Prises électriques près du lit", en: "Socket near the bed", ar: "مقابس كهربائية بالقرب من السرير", es: "Enchufes cerca de la cama" },
    "Salle de bain privée": { fr: "Salle de bain privée", en: "Private Bathroom", ar: "حمام خاص", es: "Baño privado" },
    "Lit bébé / lit supplémentaire": { fr: "Lit bébé / lit supplémentaire", en: "Crib / extra bed", ar: "سرير أطفال / سرير إضافي", es: "Cuna / cama supletoria" },
    "Ascenseur": { fr: "Ascenseur", en: "Elevator", ar: "مصعد", es: "Ascensor" },
    "Accessibilité PMR": { fr: "Accessibilité PMR", en: "Wheelchair accessible", ar: "سهولة الوصول لذوي الاحتياجات الخاصة", es: "Accesibilidad para minusválidos" },

    // Home Page & Global
    "hero_title": { fr: "Des séjours inoubliables pour tous les budgets.", en: "Incredible stays for every budget.", ar: "إقامات لا تنسى لجميع الميزانيات.", es: "Estancias inolvidables para todos los presupuestos." },
    "hero_subtitle": { fr: "Économisez 15 % ou plus sur vos réservations de 2026 grâce aux offres StayFloow.", en: "Save 15% or more on 2026 bookings with StayFloow deals.", ar: "وفر 15% أو أكثر على حجوزات 2026 مع عروض StayFloow.", es: "Ahorra un 15% o más en reservas de 2026 con ofertas de StayFloow." },
    "hero_cta": { fr: "Se connecter ou créer un compte", en: "Sign in or create account", ar: "تسجيل الدخول أو إنشاء حساب", es: "Iniciar sesión o crear cuenta" },
    "property_types_title": { fr: "Rechercher par type d'hébergement", en: "Browse by property type", ar: "بحث حسب نوع الإقامة", es: "Buscar por tipo de alojamiento" },
    "unique_stays_title": { fr: "Séjournez dans nos hébergements uniques", en: "Stay in our unique accommodations", ar: "أقم في أماكن إقامتنا الفريدة", es: "Quédate en nuestros alojamientos únicos" },
    "unique_stays_desc": { fr: "Une sélection rigoureuse des établissements les mieux notés sur StayFloow.com", en: "A careful selection of top-rated properties on StayFloow.com", ar: "مجموعة مختارة بعناية من أفضل العقارات تقييمًا على StayFloow.com", es: "Una cuidada selección de las propiedades mejor valoradas en StayFloow.com" },
    "from_price": { fr: "À partir de", en: "Starting from", ar: "ابتداءً من", es: "Desde" },
    "per_night": { fr: "nuit", en: "night", ar: "ليلة", es: "noche" },
    "recently_viewed": { fr: "Consultés récemment", en: "Recently viewed", ar: "تمت مشاهدتها مؤخراً", es: "Vistos récemment" },
    "inspired_by_visit": { fr: "Inspirés par votre visite", en: "Inspired by your visit", ar: "مستوحى من زيارتك", es: "Inspirado por tu visita" },

    // Search Bar
    "where_to": { fr: "Où allez-vous ?", en: "Where to?", ar: "إلى أين أنت ذاهب؟", es: "¿A dónde vas?" },
    "dates_placeholder": { fr: "Arrivée — Départ", en: "Check-in — Check-out", ar: "الوصول — المغادرة", es: "Entrada — Salida" },
    "search_btn": { fr: "Rechercher", en: "Search", ar: "بحث", es: "Buscar" },
    "adults": { fr: "adultes", en: "adults", ar: "بالغين", es: "adultos" },
    "children": { fr: "enfants", en: "children", ar: "أطفال", es: "niños" },
    "rooms": { fr: "chambres", en: "rooms", ar: "غرف", es: "habitaciones" },
    "adult_short": { fr: "ad.", en: "ad.", ar: "بالغ", es: "ad." },
    "child_short": { fr: "enf.", en: "ch.", ar: "طفل", es: "ni." },
    "room_short": { fr: "ch.", en: "rm.", ar: "غرفة", es: "hab." },

    // Partner Hub
    "partner_hero_title": { fr: "Inscrivez votre établissement sur StayFloow.com", en: "List your property on StayFloow.com", ar: "سجل عقارك على StayFloow.com", es: "Publique su propiedad en StayFloow.com" },
    "partner_hero_subtitle": { fr: "Rejoignez la plus grande communauté de voyageurs en Afrique et boostez vos réservations gratuitement.", en: "Join the largest travel community in Africa and boost your bookings for free.", ar: "انضم إلى أكبر مجتمع للمسافرين في إفريقيا وعزز حجوزاتك مجانًا.", es: "Únase a la comunidad de viajeros más grande de África y aumente sus reservas gratis." },
    "partner_hero_cta": { fr: "Commencer gratuitement", en: "Start for free", ar: "ابدأ مجاناً", es: "Empezar gratis" },
    "register_my_property": { fr: "ENREGISTRER MON BIEN", en: "REGISTER MY PROPERTY", ar: "تسجيل عقاري", es: "REGISTRAR MI PROPIEDAD" },
    "registration": { fr: "Inscription", en: "Registration", ar: "تسجيل", es: "Registro" },
    "back_to_choice": { fr: "Retour au choix", en: "Back to choice", ar: "العودة للرئيسية", es: "Volver a elegir" },
    "step_info": { fr: "Informations", en: "Information", ar: "معلومات", es: "Información" },
    "step_loc": { fr: "Localisation", en: "Location", ar: "الموقع", es: "Ubicación" },
    "step_details": { fr: "Détails Pro", en: "Pro Details", ar: "تفاصيل مهنية", es: "Detalles Pro" },
    "step_photos_price": { fr: "Photos & Prix", en: "Photos & Price", ar: "الصور والسعر", es: "Fotos y Precio" },
    "first_name": { fr: "Prénom", en: "First Name", ar: "الاسم الأول", es: "Nombre" },
    "last_name": { fr: "Nom", en: "Last Name", ar: "اللقب", es: "Apellido" },
    "pro_email": { fr: "Email professionnel", en: "Professional Email", ar: "البريد الإلكتروني المهني", es: "Email profesional" },
    "phone_whatsapp": { fr: "Numéro de téléphone (WhatsApp)", en: "Phone Number (WhatsApp)", ar: "رقم الهاتف (واتساب)", es: "Número de téléphone (WhatsApp)" },
    "commercial_name": { fr: "Nom commercial de l'annonce", en: "Listing Commercial Name", ar: "الاسم التجari للإعلان", es: "Nombre comercial del anuncio" },
    "full_address": { fr: "Adresse complète", en: "Full Address", ar: "العنوان الكامل", es: "Dirección complète" },
    "map_preview": { fr: "Aperçu de la localisation", en: "Location Preview", ar: "معاينة الموقع", es: "Vista previa del mapa" },
    "map_hint": { fr: "* La carte s'ajuste automatiquement en fonction de la ville saisie.", en: "* Map adjusts automatically based on the city entered.", ar: "* الخريطة تتعدل تلقائياً حسب المدينة المدخلة.", es: "* El mapa se ajusta automáticamente según la ciudad introducida." },
    "listing_type_label": { fr: "Type d'offre", en: "Offer Type", ar: "نوع العرض", es: "Tipo de oferta" },
    "amenities_label": { fr: "Équipements & Inclusions", en: "Amenities & Inclusions", ar: "المرافق والمزايا", es: "Servicios e Inclusiones" },
    "description_label": { fr: "Description attractive", en: "Attractive Description", ar: "وصف جذاب", es: "Descripción atractiva" },
    "ai_improve_btn": { fr: "Améliorer avec l'IA", en: "Improve with AI", ar: "تحسين باستخدام الذكاء الاصطناعي", es: "Mejorar con IA" },
    "photos_label": { fr: "Photos de l'annonce (5 minimum)", en: "Listing Photos (Min 5)", ar: "صور الإعلان (5 كحد أدنى)", es: "Fotos del anuncio (Min 5)" },
    "base_price_label": { fr: "Prix de base", en: "Base Price", ar: "السعر الأساسي", es: "Precio base" },
    "ai_analyze_price_btn": { fr: "Analyser mon prix avec l'IA StayFloow", en: "Analyze my price with StayFloow AI", ar: "تحليل سعري بواسطة ذكاء StayFloow", es: "Analizar mi precio con la IA de StayFloow" },
    "recommended_price": { fr: "Prix recommandé", en: "Recommended price", ar: "السعر الموصى به", es: "Precio recomendado" },
    "confidence_label": { fr: "Indice de confiance", en: "Confidence index", ar: "مؤشر الثقة", es: "Índice de confiance" },
    "submit_review_btn": { fr: "Valider et envoyer pour examen", en: "Validate and send for review", ar: "تأكيد وإرسال للمراجعة", es: "Validar y enviar para revisión" },
    "success_msg_title": { fr: "Merci !", en: "Thank you!", ar: "شكراً لك!", es: "¡Gracias!" },
    "success_msg_desc": { fr: "Votre annonce est en cours de validation par nos experts.", en: "Your listing is being validated by our experts.", ar: "إعلانك قيد المراجعة من قبل خبرائنا.", es: "Su anuncio está siendo validado por nuestros expertos." },
    "back_home_btn": { fr: "Retour à l'accueil", en: "Back to Home", ar: "العودة للرئيسية", es: "Volver al inicio" },

    // Footer
    "footer_tagline": { fr: "Votre compagnon de voyage privilégié en Afrique. Réservez hébergements, voitures et circuits en toute simplicité.", en: "Your preferred travel companion in Africa. Book accommodations, cars, and tours with ease.", ar: "رفيقك المفضل للسفر في إفريقيا. احجز السكن والسيارات والجولات بكل سهولة.", es: "Su compañero de viaje preferido en África. Reserve alojamientos, coches y tours con facilidad." },
    "rights_reserved": { fr: "Tous droits réservés.", en: "All rights reserved.", ar: "كل الحقوق محفوظة.", es: "Todos los derechos reservados." },
    "navigation": { fr: "Navigation", en: "Navigation", ar: "التنقل", es: "Navegación" },
    "company": { fr: "Société", en: "Company", ar: "الشركة", es: "Empresa" },
    "about": { fr: "À propos", en: "About", ar: "معلومات عنا", es: "Sobre nosotros" },
    "contact": { fr: "Contact", en: "Contact", ar: "اتصل", es: "Contacto" },
    "legal": { fr: "Légal", en: "Legal", ar: "قانوني", es: "Legal" },
    "terms": { fr: "Conditions d'utilisation", en: "Terms of use", ar: "شروط الاستخدام", es: "Condiciones de uso" },
    "privacy": { fr: "Confidentialité", en: "Privacy", ar: "الخصوصية", es: "Privacidad" },
    "partner_cta_title": { fr: "Référencez votre établissement sur StayFloow.com", en: "List your property on StayFloow.com", ar: "أدرج عقارك على StayFloow.com", es: "Registra tu establecimiento en StayFloow.com" },
    "partner_cta_desc": { fr: "Rejoignez des milliers de partenaires en Afrique et commencez à recevoir des réservations dès aujourd'hui.", en: "Join thousands of partners in Africa and start receiving bookings today.", ar: "انضم إلى آلاف الشركاء في إفريقيا وابدأ في تلقي الحجوزات اليوم.", es: "Únase a miles de socios en África y comience a recibir reservas hoy." },
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  getLocaleDetails: (loc?: Locale) => { name: string; flag: string; dir: 'ltr' | 'rtl' };
  availableLocales: Locale[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('fr');

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDetails[locale].dir;
  }, [locale]);

  const t = useCallback((key: string): string => {
    return translations[key]?.[locale] || key;
  }, [locale]);

  const getLocaleDetails = (loc?: Locale) => {
    return localeDetails[loc || locale];
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, getLocaleDetails, availableLocales: Object.keys(localeDetails) as Locale[] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
