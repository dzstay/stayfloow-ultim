
/**
 * @fileOverview Templates HTML premium pour StayFloow.com
 * Design épuré, mobile-responsive et aux couleurs de la marque.
 */

import { translations, Locale, localeDetails } from '@/lib/translations';


export type EmailTemplateName = 
  | 'partnerWelcome' 
  | 'registrationWelcome'
  | 'bookingConfirmation' 
  | 'partnerBookingNotification'
  | 'adminBookingNotification'
  | 'newBookingNotification' 
  | 'adminListingNotification'
  | 'partnerListingUpdate'
  | 'passwordReset'
  | 'prospectInvitation'
  | 'reviewRequest';

export interface EmailTemplate {
  subject: string;
  body: string;
}

const BRAND_COLOR = "#10B981";
const ACCENT_COLOR = "#39FF14";

export const defaultTemplates: Record<EmailTemplateName, EmailTemplate> = {
  registrationWelcome: {
    subject: "Bienvenue chez StayFloow ! 🌍",
    body: "<h1>Bienvenue ! 😍</h1><p>Nous sommes ravis de vous compter parmi nos nouveaux membres.</p>"
  },
  partnerWelcome: {
    subject: "Dossier reçu ! Bienvenue chez StayFloow Pro 🚀",
    body: "<h1>Bienvenue à bord ! 🤝</h1><p>Votre demande d'enregistrement a bien été réceptionnée.</p>"
  },
  bookingConfirmation: {
    subject: "Réservation Confirmée ! ✅",
    body: "<h1>C'est confirmé ! ✈️</h1><p>Votre réservation est validée.</p>"
  },
  partnerBookingNotification: {
    subject: "🎉 Nouvelle Réservation Confirmée !",
    body: "<h1>Nouvelle réservation reçue ! 💸</h1><p>Vous avez une nouvelle réservation.</p>"
  },
  adminBookingNotification: {
    subject: "🚨 [ADMIN] Nouvelle Réservation Payée",
    body: "<h1>Nouvelle Réservation Enregistrée ! 💰</h1>"
  },
  newBookingNotification: {
    subject: "Nouvelle notification",
    body: "<p>Vous avez une nouvelle notification.</p>"
  },
  adminListingNotification: {
    subject: "🚨 [ADMIN] Nouvelle Annonce à Valider",
    body: "<h1>Nouvelle Annonce Soumise ! 🔍</h1>"
  },
  partnerListingUpdate: {
    subject: "Mise à jour concernant votre annonce StayFloow",
    body: "<h1>État de votre annonce 🌍</h1>"
  },
  passwordReset: {
    subject: "Réinitialisation de votre mot de passe StayFloow 🔐",
    body: "<h1>Besoin d'un nouveau mot de passe ?</h1><p>Cliquez sur le lien pour réinitialiser.</p>"
  },
  prospectInvitation: {
    subject: "Développez vos réservations avec StayFloow en Afrique du Nord 🌍",
    body: "<h1>Rejoignez-nous</h1><p>Inscrivez votre hébergement gratuitement.</p>"
  },
  reviewRequest: {
    subject: "Comment s'est passé votre séjour ? 😊",
    body: "<h1>Votre avis compte !</h1>"
  }
};

const baseLayout = (content: string, t?: (key: string) => string, dir: string = 'ltr') => `
<!DOCTYPE html>
<html dir="${dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding-bottom: 40px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; margin-top: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { padding: 40px 20px; text-align: center; background-color: ${BRAND_COLOR}; }
    .content { padding: 40px; }
    .footer { text-align: center; padding: 30px; font-size: 12px; color: #94a3b8; }
    .btn { display: inline-block; padding: 16px 40px; background-color: ${BRAND_COLOR}; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 800; margin: 30px 0; text-transform: uppercase; font-size: 14px; letter-spacing: 0.5px; }
    .card { background: #f1f5f9; border-radius: 16px; padding: 25px; margin: 25px 0; border: 1px solid #e2e8f0; }
    h1 { color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 20px; letter-spacing: -0.5px; }
    p { margin-bottom: 15px; font-size: 16px; color: #475569; }
    strong { color: #0f172a; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h2 style="color: #ffffff; font-weight: 900; letter-spacing: -1.5px; font-size: 32px; margin: 0;">StayFloow<span style="color: ${ACCENT_COLOR}">.com</span></h2>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p style="margin-bottom: 5px;">&copy; ${new Date().getFullYear()} StayFloow.com — ${t ? t("email.footer.tagline") : "Votre partenaire voyage en Afrique."}</p>
        <p>${t ? t("email.footer.support") : "Service Client"} • Hydra, Alger, Algérie</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const getEmailTemplate = async (name: EmailTemplateName, data: any, locale: Locale = 'fr'): Promise<{ subject: string; body: string }> => {
  const t = (key: string) => translations[key]?.[locale] || key;
  const dir = localeDetails[locale]?.dir || 'ltr';

  switch (name) {
    case 'registrationWelcome':
      return {
        subject: `Bienvenue chez StayFloow, ${data.userName} ! 🌍`,
        body: baseLayout(`
          <h1>Bienvenue dans l'aventure ! 😍</h1>
          <p>Bonjour <strong>${data.userName}</strong>,</p>
          <p>Nous sommes ravis de vous compter parmi nos nouveaux membres. StayFloow est conçu pour vous offrir les meilleures expériences de voyage en Algérie, au Maroc et en Égypte.</p>
          <div class="card">
            <p style="margin-bottom: 10px;"><strong>Ce que vous pouvez faire maintenant :</strong></p>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Réserver des Riads et Villas d'exception.</li>
              <li>Louer un véhicule pour vos déplacements.</li>
              <li>Participer à des circuits guidés inoubliables.</li>
            </ul>
          </div>
          <div style="text-align: center;">
            <a href="https://www.stayfloow.com" class="btn">Explorer les offres</a>
          </div>
          <p>À très bientôt sur notre plateforme !</p>
          <p>L'équipe StayFloow 🌍</p>
        `)
      };

    case 'partnerWelcome':
      return {
        subject: `Dossier reçu ! Bienvenue chez StayFloow Pro 🚀 [Réf: ${data.referenceNumber}]`,
        body: baseLayout(`
          <h1>Bienvenue à bord, ${data.hostName} ! 🤝</h1>
          <p>Votre demande d'enregistrement pour <strong>${data.submissionName}</strong> (${data.submissionType}) a bien été réceptionnée.</p>
          
          <div class="card">
            <p><strong>Prochaine étape :</strong> Nos experts vérifient votre annonce pour garantir une qualité optimale à nos voyageurs. Vous recevrez une notification dès que votre offre sera en ligne.</p>
            <p>En attendant, vous pouvez compléter votre profil sur votre tableau de bord.</p>
          </div>
          <div class="card" style="background: #fdf2f8; border-color: #fbcfe8;">
            <p><strong>Rappel de vos engagements :</strong></p>
            <p style="font-size: 14px; margin-bottom: 0;">En soumettant cette annonce, vous avez accepté nos conditions générales. Vous vous engagez à fournir le service tel qu'il a été décrit et choisi par le client, et vous assumez l'entière responsabilité de la qualité de cette prestation.</p>
          </div>

          <div style="text-align: center;">
            <a href="${data.setupLink}" class="btn">Mon Espace Partenaire</a>
          </div>

          <p>Merci de votre confiance.</p>
          <p>L'équipe StayFloow Business 🌍</p>
        `)
      };

    case 'bookingConfirmation':
      return {
        subject: `${t("email.booking.subject")}${data.itemName}`,
        body: baseLayout(`
          <h1>${t("email.booking.title")}</h1>
          <p>${t("email.booking.hello")} ${data.customerName}, ${t("email.booking.validated")} <strong>${data.itemName}</strong> ${t("email.booking.is_validated")}</p>
          
          <div class="card">
            <p style="margin-bottom: 5px;"><strong>${t("email.booking.ref")}</strong> #${data.reservationNumber}</p>
            ${data.detailsHtml}
          </div>

          <p><strong>${t("email.booking.host_contact")}</strong></p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <p style="margin: 0 0 5px 0;"><strong>${data.hostName}</strong></p>
            <p style="margin: 0 0 5px 0;">📞 <a href="tel:${data.hostPhone}" style="color: ${BRAND_COLOR}; text-decoration: none;">${data.hostPhone}</a></p>
            <p style="margin: 0 0 5px 0;">✉️ <a href="mailto:${data.hostEmail}" style="color: ${BRAND_COLOR}; text-decoration: none;">${data.hostEmail}</a></p>
            ${data.addressObj ? `<p style="margin: 15px 0 0 0;"><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.addressObj)}" style="background: #0f172a; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-size: 14px; display: inline-block;">📍 ${t("email.booking.view_map")}</a></p>` : ''}
          </div>

          <div style="text-align: center;">
            <a href="${data.calendarLink}" class="btn" style="background-color: #4285F4; margin-top: 10px;">📅 ${t("email.booking.add_calendar")}</a>
            <a href="https://www.stayfloow.com/profile/bookings" class="btn" style="margin-top: 10px;">${t("email.booking.view_booking")}</a>
          </div>
        `, t, dir)
      };

    case 'partnerBookingNotification':
      return {
        subject: `🎉 Nouvelle Réservation Confirmée ! - ${data.itemName}`,
        body: baseLayout(`
          <h1>Nouvelle réservation reçue ! 💸</h1>
          <p>Félicitations <strong>${data.hostName}</strong>,</p>
          <p>Vous avez une nouvelle réservation confirmée pour <strong>${data.itemName}</strong>.</p>
          
          <div class="card">
            <h3 style="margin-top: 0;">Coordonnées du Locataire</h3>
            <p style="margin: 0 0 5px 0;">👤 <strong>Nom :</strong> ${data.customerName}</p>
            <p style="margin: 0 0 5px 0;">📞 <strong>Téléphone :</strong> <a href="tel:${data.customerPhone}" style="color: ${BRAND_COLOR};">${data.customerPhone}</a></p>
            <p style="margin: 0 0 15px 0;">✉️ <strong>Email :</strong> <a href="mailto:${data.customerEmail}" style="color: ${BRAND_COLOR};">${data.customerEmail}</a></p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
            <p style="margin: 0 0 5px 0;"><strong>Référence :</strong> #${data.reservationNumber}</p>
            ${data.detailsHtml}
          </div>

          <div style="text-align: center;">
            <a href="${data.calendarLink}" class="btn" style="background-color: #4285F4;">📅 Ajouter à mon Calendrier</a>
            <br/>
            <a href="https://www.stayfloow.com/partners/dashboard" class="btn">Gérer mes réservations</a>
          </div>
        `)
      };

    case 'adminBookingNotification':
      return {
        subject: `🚨 [ADMIN] Nouvelle Réservation Payée - ${data.itemName}`,
        body: baseLayout(`
          <h1>Nouvelle Réservation Enregistrée ! 💰</h1>
          <div class="card">
            <p><strong>Ref :</strong> #${data.reservationNumber}</p>
            <p><strong>Item :</strong> ${data.itemName} (${data.itemType})</p>
            <p><strong>Partenaire :</strong> ${data.hostName} (${data.hostEmail})</p>
            <p><strong>Client :</strong> ${data.customerName} (${data.customerEmail})</p>
            ${data.detailsHtml}
          </div>
          <div style="text-align: center;">
            <a href="https://www.stayfloow.com/admin/catalog" class="btn">Dashboard Admin</a>
          </div>
        `)
      };

    case 'adminListingNotification':
      return {
        subject: `🚨 [ADMIN] NOUVELLE ANNONCE : ${data.itemName} (${data.itemType})`,
        body: baseLayout(`
          <h1>📦 Nouvelle Soumission Partenaire</h1>
          <p>Une nouvelle annonce a été soumise sur StayFloow et nécessite votre approbation.</p>
          
          <div class="card">
            <p style="margin-top: 0;"><strong>Établissement :</strong> ${data.itemName}</p>
            <p><strong>Type :</strong> ${data.itemType}</p>
            <p><strong>Partenaire :</strong> ${data.hostName} (${data.hostEmail})</p>
            <p><strong>Lieu :</strong> ${data.location}</p>
          </div>

          <div style="text-align: center;">
            <a href="https://www.stayfloow.com/admin/validate?id=${data.listingId}" class="btn">Auditer l'annonce</a>
          </div>
          
          <p>L'annonce est actuellement en statut <strong>PENDING</strong> et n'est pas visible publiquement.</p>
        `)
      };

    case 'partnerListingUpdate':
      const isApproved = data.status === 'approved';
      const isOnHold = data.status === 'on_hold';
      
      const statusTitle = isApproved ? "Annonce Approuvée ! 🎉" : isOnHold ? "Action Requise sur votre annonce ⚠️" : "Soumission Refusée ❌";
      const statusIcon = isApproved ? "✅" : isOnHold ? "📝" : "🚫";

      return {
        subject: `${statusIcon} ${statusTitle} - StayFloow`,
        body: baseLayout(`
          <h1>${statusTitle}</h1>
          <p>Bonjour ${data.hostName}, nous avons terminé l'audit de votre annonce <strong>${data.itemName}</strong>.</p>
          
          <div class="card">
            <p><strong>Statut actuel :</strong> ${data.statusLabel}</p>
            ${data.adminMessage ? `<div style="margin-top: 15px; padding: 15px; background: #fff; border-left: 4px solid #10B981; border-radius: 8px;">
               <p style="margin: 0; font-size: 14px;"><strong>Message de l'administrateur :</strong></p>
               <p style="margin: 5px 0 0 0; color: #475569;">${data.adminMessage}</p>
            </div>` : ''}
          </div>

          <div style="text-align: center;">
            ${isApproved 
              ? `<a href="https://www.stayfloow.com/properties/${data.listingId}" class="btn">Voir l'annonce en ligne</a>`
              : `<a href="https://www.stayfloow.com/partners/dashboard" class="btn">Accéder à mon espace</a>`}
          </div>

          <p>${isApproved ? "Félicitations, votre annonce est maintenant visible par tous les voyageurs." : "N'hésitez pas à nous contacter si vous avez des questions."}</p>
          <p>L'équipe StayFloow 🌍</p>
        `)
      };

    case 'passwordReset':
      return {
        subject: `Réinitialisation de votre mot de passe StayFloow 🔐`,
        body: baseLayout(`
          <h1>Besoin d'un nouveau mot de passe ?</h1>
          <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte StayFloow.com.</p>
          <p>Cliquez sur le bouton ci-dessous pour en choisir un nouveau. Ce lien est valable pendant 1 heure.</p>
          <div style="text-align: center;">
            <a href="${data.resetLink}" class="btn">Réinitialiser mon mot de passe</a>
          </div>
          <p style="font-size: 12px; color: #94a3b8;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.</p>
        `)
      };

    case 'prospectInvitation':
      return {
        subject: `Développez vos réservations avec StayFloow en Afrique du Nord 🌍`,
        body: baseLayout(`
          <h1>Bonjour ${data.prospectName},</h1>
          <p>Nous avons découvert votre propriété exceptionnelle sur <strong>${data.sourcePlatform}</strong> et nous serions absolument ravis de collaborer avec vous.</p>
          <p><strong>StayFloow.com</strong> est une nouvelle plateforme premium 100% pensée pour le tourisme en de la région MENA (Algérie, Maroc, Égypte). Nous connectons notre clientèle internationale et de la diaspora à des hébergements locaux de haute qualité.</p>
          
          <div class="card">
            <h3 style="margin-top: 0; color: #10B981;">Vos Avantages B2B Exclusifs :</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li><strong>0% de commission</strong> sur le premier mois pour essayer.</li>
              <li>Mise en avant sponsorisée sur notre catalogue.</li>
              <li>Synchronisation complète avec votre calendrier actuel.</li>
            </ul>
          </div>

          <p>Accepteriez-vous d'en discuter brièvement ou souhaitez-vous inscrire votre hébergement dès aujourd'hui et recevoir vos premières réservations ?</p>

          <div style="text-align: center;">
            <a href="https://www.stayfloow.com/become-partner" class="btn">Devenir Partenaire Gratuitement</a>
          </div>
          
          <p>À très bientôt,</p>
          <p>L'équipe d'acquisition StayFloow 🌍</p>
        `)
      };

    case 'reviewRequest':
      return {
        subject: `Comment s'est passé votre séjour à ${data.itemName} ? 😊`,
        body: baseLayout(`
          <h1 style="color: ${BRAND_COLOR};">Votre avis nous est précieux ! 😍</h1>
          <p>Bonjour <strong>${data.customerName}</strong>,</p>
          <p>Nous espérons que vous avez passé un excellent séjour chez <strong>${data.itemName}</strong> du ${data.startDate} au ${data.endDate}.</p>
          
          <div class="card" style="text-align: center;">
            <p style="font-weight: bold; margin-bottom: 20px;">Quelle est votre évaluation globale de cette expérience ?</p>
            <div style="margin: 20px 0;">
              <a href="${data.reviewLink}&initialRate=1" style="text-decoration: none; font-size: 40px; margin: 0 10px;">😞</a>
              <a href="${data.reviewLink}&initialRate=2" style="text-decoration: none; font-size: 40px; margin: 0 10px;">😐</a>
              <a href="${data.reviewLink}&initialRate=3" style="text-decoration: none; font-size: 40px; margin: 0 10px;">🙂</a>
              <a href="${data.reviewLink}&initialRate=4" style="text-decoration: none; font-size: 40px; margin: 0 10px;">😄</a>
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 10px;">Cliquez sur l'emoji qui correspond le mieux à votre ressenti.</p>
          </div>

          <p>Votre retour aide non seulement <strong>${data.itemName}</strong> à s'améliorer, mais il guide aussi les futurs voyageurs de la communauté StayFloow.</p>

          <div style="text-align: center;">
            <a href="${data.reviewLink}" class="btn">Évaluer mon séjour</a>
          </div>

          <p>À très bientôt pour de nouvelles aventures !</p>
          <p>L'équipe StayFloow 🌍</p>
          <div style="border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px; font-size: 11px; color: #cbd5e1;">
            <p>Vous recevez cet email car vous avez effectué une réservation sur StayFloow.com.</p>
            <p><a href="https://www.stayfloow.com/unsubscribe" style="color: #94a3b8;">Se désabonner</a></p>
          </div>
        `)
      };

    default:
      return { subject: "Message de StayFloow.com", body: "Contenu non disponible." };
  }
};
