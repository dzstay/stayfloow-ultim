
import { collection } from 'firebase/firestore';
import { initializeFirebase, addDocumentNonBlocking } from '@/firebase';
import { getEmailTemplate } from './email-templates';

/**
 * @fileOverview Système d'envoi d'emails StayFloow via l'extension Trigger Email de Firebase.
 * Utilise des écritures non-bloquantes pour une meilleure performance UI.
 */

const triggerEmail = async (to: string, subject: string, body: string) => {
  try {
    const { firestore } = initializeFirebase();
    if (!firestore) return;

    const mailCol = collection(firestore, 'mail');
    
    // Utiliser une écriture non-bloquante pour ne pas ralentir le tunnel de vente
    addDocumentNonBlocking(mailCol, {
      to: to,
      message: {
        subject: subject,
        html: body,
      },
    });
    
    console.log(`[STAYFLOOW MAIL] Ordre d'envoi initié pour : ${to}`);
    return { success: true };
  } catch (error) {
    console.error("[STAYFLOOW MAIL] Erreur lors de l'initiation de l'envoi:", error);
    return { success: false, error };
  }
};

export const sendRegistrationWelcomeEmail = async ({ userName, userEmail }: { userName: string, userEmail: string }) => {
  const { subject, body } = await getEmailTemplate("registrationWelcome", { userName });
  return triggerEmail(userEmail, subject, body);
};

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
    detailsHtml += `<p><strong>Début :</strong> ${new Date(bookingDetails.startDate).toLocaleDateString("fr-FR")}</p>`;
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

export const sendPasswordResetEmail = async ({
  userEmail,
}: { userEmail: string; userType?: string }) => {
  const resetToken = "reset-" + Math.random().toString(36).substring(7);
  const resetLink = `https://www.stayfloow.com/auth/reset-password?token=${resetToken}`;

  const { subject, body } = await getEmailTemplate("passwordReset", { resetLink });
  return triggerEmail(userEmail, subject, body);
};
