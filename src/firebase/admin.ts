import 'server-only';
import * as admin from 'firebase-admin';
import { getApps, initializeApp as adminInitializeApp, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

/**
 * @fileOverview Initialisation du SDK Admin Firebase pour bypasser les Security Rules en SSR/API.
 */

let _adminApp: any = null;

function getAdminApp() {
  if (getApps().length === 0) {
    _adminApp = adminInitializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || "studio-6933176808-a0512",
    });
  } else {
    _adminApp = getApps()[0];
  }
  return _adminApp;
}

export const getAdminDb = () => {
  try {
    return getFirestore(getAdminApp());
  } catch (e) {
    console.error("Firestore Admin error:", e);
    return null;
  }
};

export const getAdminAuth = () => {
  try {
    return getAuth(getAdminApp());
  } catch (e) {
    console.error("Auth Admin error:", e);
    return null;
  }
};

// Keep old exports for compatibility
export const adminDb = typeof window === 'undefined' ? getAdminDb() : null;
export const adminAuth = typeof window === 'undefined' ? getAdminAuth() : null;
export const adminApp = typeof window === 'undefined' ? getAdminApp() : null;


