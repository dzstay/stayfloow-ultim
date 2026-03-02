'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth as getAuthInstance, Auth } from 'firebase/auth';
import { getFirestore as getFirestoreInstance, Firestore } from 'firebase/firestore';

/**
 * Retourne les services Firebase initialisés pour une application donnée.
 */
export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuthInstance(firebaseApp),
    firestore: getFirestoreInstance(firebaseApp)
  };
}

/**
 * Initialise Firebase de manière idempotente.
 * Supporte l'initialisation automatique de Firebase App Hosting ou le fallback vers la config locale.
 */
export function initializeFirebase() {
  if (!getApps().length) {
    let firebaseApp;
    try {
      // Tentative d'initialisation via les variables d'environnement (App Hosting)
      firebaseApp = initializeApp();
    } catch (e) {
      // Fallback vers la configuration manuelle (Développement)
      firebaseApp = initializeApp(firebaseConfig);
    }
    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

/**
 * Helpers pour obtenir les instances hors contexte React (ex: API Routes)
 */
export function getAuth(): Auth {
  return initializeFirebase().auth;
}

export function getFirestore(): Firestore {
  return initializeFirebase().firestore;
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
