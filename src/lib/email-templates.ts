/**
 * @fileOverview Templates HTML premium pour StayFloow.com
 */

export type EmailTemplateName = 
  | 'partnerWelcome' 
  | 'bookingConfirmation' 
  | 'newBookingNotification' 
  | 'favoriteReminder' 
  | 'newSubmissionAdminNotification' 
  | 'passwordReset';

const BRAND_COLOR = "#10B981";
const BRAND_LOGO_URL = "https://www.stayfloow.com/logo.png"; // Placeholder

const baseLayout = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', Helvetica, Arial, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #94a3b8; }
    .btn { display: inline-block; padding: 14px 30px; background-color: ${BRAND_COLOR}; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: bold; margin: 20px 0; }
    .card { background: #f8fafc; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; margin: 20px 0; }
    h1 { color: #0f172a; font-size: 24px; font-weight: 800; }
    strong { color: #0f172a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="color: ${BRAND_COLOR}; font-weight: 900; letter-spacing: -1px; margin: 0;">StayFloow<span style="color: #39FF14">.com</span></h2>
    </div>
    ${content}
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} StayFloow.com — Le partenaire de vos voyages en Afrique.</p>
      <p>Hydra, Alger, Algérie</p>
    </div>
  </div>
</body>
</html>
`;

export const getEmailTemplate = async (name: EmailTemplateName, data: any): Promise<{ subject: string; body: string }> => {
  switch (name) {
    case 'partnerWelcome':
      return {
        subject: `Bienvenue chez StayFloow ! Référence : ${data.referenceNumber}`,
        body: baseLayout(`
          <h1>Bienvenue dans la communauté, ${data.hostName} !</h1>
          <p>Nous avons bien reçu votre demande pour enregistrer votre <strong>${data.submissionType}</strong> : <strong>${data.submissionName}</strong>.</p>
          <div class="card">
            <p><strong>Prochaine étape :</strong> Nos experts vérifient actuellement vos informations. En attendant, vous pouvez configurer votre mot de passe partenaire pour accéder à votre tableau de bord.</p>
          </div>
          <a href="${data.setupLink}" class="btn">Activer mon compte partenaire</a>
          <p style="font-size: 13px; color: #64748b;">Si vous n'avez pas fait cette demande, veuillez ignorer cet email.</p>
        `)
      };

    case 'bookingConfirmation':
      return {
        subject: `Confirmation de réservation - ${data.itemName}`,
        body: baseLayout(`
          <h1>Félicitations ${data.customerName} !</h1>
          <p>Votre réservation pour <strong>${data.itemName}</strong> est confirmée.</p>
          <div class="card">
            <p><strong>Numéro de réservation :</strong> ${data.reservationNumber}</p>
            ${data.detailsHtml}
          </div>
          <p>Votre <strong>${data.itemType}</strong> (${data.hostName}) vous attend. Vous pouvez le contacter au <strong>${data.hostPhone}</strong> ou par email à ${data.hostEmail}.</p>
          <p>Préparez vos valises, StayFloow s'occupe du reste !</p>
        `)
      };

    case 'newBookingNotification':
      return {
        subject: `Nouvelle réservation reçue ! - #${data.reservationNumber}`,
        body: baseLayout(`
          <h1>Bonne nouvelle ${data.partnerName} !</h1>
          <p>Vous venez de recevoir une nouvelle réservation pour <strong>${data.itemName}</strong> via StayFloow.com.</p>
          <div class="card">
            <p><strong>Client :</strong> ${data.customerName}</p>
            <p><strong>Contact :</strong> ${data.customerEmail} / ${data.customerPhone}</p>
            ${data.detailsHtml}
          </div>
          <p>Un fichier calendrier (.ics) est joint à cet email pour synchroniser automatiquement cette réservation avec votre agenda.</p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/partners/dashboard" class="btn">Gérer sur mon tableau de bord</a>
        `)
      };

    case 'favoriteReminder':
      return {
        subject: `Votre coup de cœur vous attend sur StayFloow !`,
        body: baseLayout(`
          <h1>Il est toujours là pour vous...</h1>
          <div style="text-align: center; margin: 20px 0;">
            <img src="${data.propertyImage}" alt="${data.propertyName}" style="width: 100%; border-radius: 12px; max-height: 200px; object-cover: cover;">
          </div>
          <p>Bonjour ${data.customerName}, vous avez ajouté <strong>${data.propertyName}</strong> à vos favoris il y a quelques jours.</p>
          <p>C'est l'un de nos établissements les plus demandés. Ne manquez pas l'occasion de réserver votre séjour au meilleur prix !</p>
          <a href="${data.propertyUrl}" class="btn">Réserver maintenant</a>
        `)
      };

    case 'newSubmissionAdminNotification':
      return {
        subject: `[ADMIN] Nouvelle soumission : ${data.submissionName}`,
        body: baseLayout(`
          <h1>Alerte Nouvelle Inscription</h1>
          <p>Un nouveau partenaire souhaite rejoindre la plateforme.</p>
          <div class="card">
            <p><strong>Type :</strong> ${data.submissionType}</p>
            <p><strong>Nom :</strong> ${data.submissionName}</p>
            <p><strong>Partenaire :</strong> ${data.partnerName} (${data.partnerEmail})</p>
            <p><strong>Tél :</strong> ${data.partnerPhone}</p>
          </div>
          <a href="${data.adminUrl}" class="btn">Accéder à la validation</a>
        `)
      };

    case 'passwordReset':
      return {
        subject: `Réinitialisation de votre mot de passe - StayFloow`,
        body: baseLayout(`
          <h1>Sécurité de votre compte</h1>
          <p>Vous avez demandé la réinitialisation de votre mot de passe StayFloow.com.</p>
          <p>Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
          <a href="${data.resetLink}" class="btn">Réinitialiser mon mot de passe</a>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
        `)
      };

    default:
      return { subject: "Message de StayFloow.com", body: "Contenu non disponible." };
  }
};
