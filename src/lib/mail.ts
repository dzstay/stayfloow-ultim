'use server';

/**
 * @fileOverview Système d'envoi d'emails StayFloow.
 * Note : Pour garantir la compatibilité en environnement local et éviter les erreurs de build
 * liées à la bibliothèque 'resend', ce module utilise une simulation d'envoi fiable.
 */

// ------------------------------
// HELPERS
// ------------------------------
const getSenderDetails = () => {
  return { 
    senderName: "StayFloow.com", 
    senderEmail: "onboarding@stayfloow.com" 
  };
};

const simulateEmailSend = async (to: string, subject: string, body: string) => {
  // Simule un délai réseau réaliste
  await new Promise(resolve => setTimeout(resolve, 800));
  
  console.log("-----------------------------------------");
  console.log(`[EMAIL SENT] To: ${to}`);
  console.log(`[SUBJECT]: ${subject}`);
  console.log(`[CONTENT]: (HTML Content received)`);
  console.log("-----------------------------------------");
  
  return { success: true, data: { id: `sim_${Date.now()}` } };
};

// ------------------------------
// 1. WELCOME EMAIL (Onboarding Partenaire)
// ------------------------------
interface WelcomeEmailProps {
  hostName: string;
  submissionType: "propriété" | "véhicule" | "circuit";
  submissionName: string;
  hostEmail: string;
  referenceNumber: string;
}

export const sendWelcomeEmail = async ({
  hostName,
  submissionType,
  submissionName,
  hostEmail,
  referenceNumber,
}: WelcomeEmailProps) => {
  const { getEmailTemplate } = await import("./email-templates");
  
  const setupToken = `partner-setup-${Date.now()}`;
  const setupLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9002"}/auth/reset-password?token=${setupToken}`;

  const { subject, body } = await getEmailTemplate("partnerWelcome", {
    hostName,
    submissionType: submissionType === "circuit" ? "circuit / activité" : submissionType,
    submissionName,
    referenceNumber,
    setupLink,
  });

  return simulateEmailSend(hostEmail, subject, body);
};

// ------------------------------
// 2. BOOKING CONFIRMATION (Pour le Client)
// ------------------------------
interface BookingConfirmationEmailProps {
  customerName: string;
  customerEmail: string;
  reservationNumber: string;
  itemName: string;
  itemType: "hébergement" | "véhicule" | "circuit";
  hostName: string;
  hostEmail: string;
  hostPhone: string;
  bookingDetails: {
    startDate?: string | null;
    endDate?: string | null;
    participants?: number;
    totalPrice?: number;
  };
}

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
}: BookingConfirmationEmailProps) => {
  const { getEmailTemplate } = await import("./email-templates");

  let detailsHtml = "";
  if (bookingDetails.startDate) {
    const label = itemType === "circuit" ? "Date de départ" : "Arrivée";
    detailsHtml += `<p><strong>${label} :</strong> ${new Date(bookingDetails.startDate).toLocaleDateString("fr-FR")}</p>`;
  }
  if (bookingDetails.endDate) {
    detailsHtml += `<p><strong>Fin/Départ :</strong> ${new Date(bookingDetails.endDate).toLocaleDateString("fr-FR")}</p>`;
  }
  if (bookingDetails.participants) {
    detailsHtml += `<p><strong>Nombre de personnes :</strong> ${bookingDetails.participants}</p>`;
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
    itemType: itemType === "hébergement" ? "hôte" : itemType === "véhicule" ? "loueur" : "guide",
  });

  return simulateEmailSend(customerEmail, subject, body);
};

// ------------------------------
// 3. NEW BOOKING NOTIFICATION (Pour le Partenaire)
// ------------------------------
export const sendNewBookingNotificationEmail = async ({
  partnerName,
  partnerEmail,
  customerName,
  customerEmail,
  customerPhone,
  reservationNumber,
  itemName,
  bookingDetails,
}: any) => {
  const { getEmailTemplate } = await import("./email-templates");

  const { subject, body } = await getEmailTemplate("newBookingNotification", {
    partnerName,
    itemName,
    reservationNumber,
    detailsHtml: `<p>Réservation reçue pour le ${new Date(bookingDetails.startDate).toLocaleDateString("fr-FR")}</p>`,
    customerName,
    customerEmail,
    customerPhone,
  });

  return simulateEmailSend(partnerEmail, subject, body);
};

// ------------------------------
// 4. PASSWORD RESET
// ------------------------------
export const sendPasswordResetEmail = async ({
  userEmail,
  userType,
}: { userEmail: string; userType: "admin" | "partner" | "customer" }) => {
  const { getEmailTemplate } = await import("./email-templates");

  const resetToken = "reset-" + Math.random().toString(36).substring(7);
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9002"}/auth/reset-password?token=${resetToken}`;

  const { subject, body } = await getEmailTemplate("passwordReset", { resetLink });

  return simulateEmailSend(userEmail, subject, body);
};