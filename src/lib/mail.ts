
import { collection } from 'firebase/firestore';
import { initializeFirebase, addDocumentNonBlocking } from '@/firebase';
import { getEmailTemplate } from './email-templates';

/**
 * @fileOverview Système d'envoi d'emails StayFloow via l'extension Trigger Email de Firebase.
 * Utilise des écritures non-bloquantes pour une performance optimale de l'interface.
 */

const triggerEmail = async (to: string, subject: string, body: string) => {
  try {
    const { firestore } = initializeFirebase();
    if (!firestore) return;

    // La collection doit correspondre au nom configuré dans l'extension (par défaut 'mail')
    const mailCol = collection(firestore, 'mail');
    
    // Structure compatible avec l'extension Firebase Trigger Email
    addDocumentNonBlocking(mailCol, {
      to: to,
      message: {
        subject: subject,
        html: body,
      },
    });
    
    console.log(`[STAYFLOOW MAIL] Demande d'envoi générée pour : ${to}`);
    return { success: true };
  } catch (error) {
    console.error("[STAYFLOOW MAIL] Erreur lors de la génération de la demande:", error);
    return { success: false, error };
  }
};

/**
 * Envoie un email de bienvenue après l'inscription d'un nouveau client.
 */
export const sendRegistrationWelcomeEmail = async ({ userName, userEmail }: { userName: string, userEmail: string }) => {
  const { subject, body } = await getEmailTemplate("registrationWelcome", { userName });
  return triggerEmail(userEmail, subject, body);
};

/**
 * Envoie un email de bienvenue à un nouveau partenaire après sa soumission.
 */
export const sendWelcomeEmail = async ({
  hostName,
  submissionType,
  submissionName,
  hostEmail,
  referenceNumber,
}: any) => {
  const setupLink = "https://www.stayfloow.com/partners/dashboard";
  const { subject, body } = await getEmailTemplate("partnerWelcome", {
    hostName,
    submissionType,
    submissionName,
    referenceNumber,
    setupLink,
  });

  return triggerEmail(hostEmail, subject, body);
};

/**
 * Envoie une confirmation de réservation au client.
 */
export const sendBookingConfirmationEmail = async ({
  customerName,
  customerEmail,
  reservationNumber,
  itemName,
  itemType,
  hostName,
  hostEmail,
  hostPhone,
  bookingDetails,
}: any) => {
  let detailsHtml = "";
  if (bookingDetails.startDate) {
    detailsHtml += `<p><strong>Date de début :</strong> ${new Date(bookingDetails.startDate).toLocaleDateString("fr-FR")}</p>`;
  }
  if (bookingDetails.totalPrice) {
    detailsHtml += `<p><strong>Montant Total :</strong> ${bookingDetails.totalPrice.toLocaleString('fr-DZ')} DZD</p>`;
  }

  const { subject, body } = await getEmailTemplate("bookingConfirmation", {
    customerName,
    reservationNumber,
    itemName,
    detailsHtml,
    hostName,
    hostEmail,
    hostPhone,
    itemType,
  });

  return triggerEmail(customerEmail, subject, body);
};

/**
 * Envoie un lien de réinitialisation de mot de passe.
 */
export const sendPasswordResetEmail = async ({
  userEmail,
}: { userEmail: string; userType?: string }) => {
  const resetToken = "reset-" + Math.random().toString(36).substring(7);
  const resetLink = `https://www.stayfloow.com/auth/reset-password?token=${resetToken}`;

  const { subject, body } = await getEmailTemplate("passwordReset", { resetLink });
  return triggerEmail(userEmail, subject, body);
};
