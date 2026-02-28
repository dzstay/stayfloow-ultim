'use server';

/**
 * @fileOverview Système d'envoi d'emails StayFloow via Resend API.
 * Utilise des imports dynamiques pour éviter les erreurs de résolution au build.
 */

// ------------------------------
// LAZY INITIALIZATION (ANTI-CRASH & BUILD FIX)
// ------------------------------
const getResendInstance = async () => {
  // Import dynamique pour empêcher Next.js d'inclure 'resend' dans le bundle client
  const { Resend } = await import("resend");
  const apiKey = process.env.RESEND_API_KEY;
  return new Resend(apiKey || "re_dummy_key_for_build");
};

// ------------------------------
// HELPERS
// ------------------------------
const getSenderDetails = () => {
  return { 
    senderName: "StayFloow.com", 
    senderEmail: "onboarding@resend.dev" 
  };
};

const getRecipientEmail = (intendedRecipient: string) => {
  console.log(`[MAIL] Originally intended for ${intendedRecipient}. Redirecting to admin for testing.`);
  return "stayflow2025@gmail.com";
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
  const resend = await getResendInstance();
  const { getEmailTemplate } = await import("./email-templates");
  const { senderName, senderEmail } = getSenderDetails();
  const fromAddress = `${senderName} <${senderEmail}>`;

  const setupToken = `partner-setup-${Date.now()}`;
  const setupLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9002"}/auth/reset-password?token=${setupToken}`;

  const { subject, body } = await getEmailTemplate("partnerWelcome", {
    hostName,
    submissionType: submissionType === "circuit" ? "circuit / activité" : submissionType,
    submissionName,
    referenceNumber,
    setupLink,
  });

  const toAddress = getRecipientEmail(hostEmail);

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [toAddress],
      subject,
      html: body,
    });

    if (error) return { success: false, error };
    return { success: true, data };
  } catch (error) {
    return { success: false, error: { message: (error as Error).message } };
  }
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
  const resend = await getResendInstance();
  const { getEmailTemplate } = await import("./email-templates");
  const { senderName, senderEmail } = getSenderDetails();
  const fromAddress = `${senderName} <booking@resend.dev>`;

  const toAddress = getRecipientEmail(customerEmail);

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

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [toAddress],
      subject: subject.replace("{{reservationNumber}}", reservationNumber),
      html: body,
    });

    if (error) return { success: false, error };
    return { success: true, data };
  } catch (error) {
    return { success: false, error: { message: (error as Error).message } };
  }
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
  const resend = await getResendInstance();
  const { getEmailTemplate } = await import("./email-templates");
  const { senderName, senderEmail } = getSenderDetails();
  const fromAddress = `${senderName} <partners@resend.dev>`;

  const toAddress = getRecipientEmail(partnerEmail);

  const { subject, body } = await getEmailTemplate("newBookingNotification", {
    partnerName,
    itemName,
    reservationNumber,
    detailsHtml: `<p>Réservation reçue pour le ${new Date(bookingDetails.startDate).toLocaleDateString("fr-FR")}</p>`,
    customerName,
    customerEmail,
    customerPhone,
  });

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [toAddress],
      subject: subject.replace("{{itemName}}", itemName).replace("{{reservationNumber}}", reservationNumber),
      html: body,
    });

    if (error) return { success: false, error };
    return { success: true, data };
  } catch (error) {
    return { success: false, error: { message: (error as Error).message } };
  }
};

// ------------------------------
// 4. PASSWORD RESET
// ------------------------------
export const sendPasswordResetEmail = async ({
  userEmail,
  userType,
}: { userEmail: string; userType: "admin" | "partner" | "customer" }) => {
  const resend = await getResendInstance();
  const { getEmailTemplate } = await import("./email-templates");
  const { senderName, senderEmail } = getSenderDetails();
  const fromAddress = `${senderName} <security@resend.dev>`;

  const resetToken = "reset-" + Math.random().toString(36).substring(7);
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9002"}/auth/reset-password?token=${resetToken}`;

  const { subject, body } = await getEmailTemplate("passwordReset", { resetLink });

  const toAddress = getRecipientEmail(userEmail);

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [toAddress],
      subject,
      html: body,
    });

    if (error) return { success: false, error };
    return { success: true, data };
  } catch (error) {
    return { success: false, error: { message: (error as Error).message } };
  }
};