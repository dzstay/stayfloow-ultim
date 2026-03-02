'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth as getAuthInstance, Auth } from 'firebase/auth';
import { getFirestore as getFirestoreInstance, Firestore } from 'firebase/firestore';

// Instances mises en cache pour garantir la stabilité sur le client
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

/**
 * Initialise Firebase de manière stable et unique.
 * Garantit que les instances ne sont jamais recréées sur le client, évitant les erreurs "Unexpected state".
 */
export function initializeFirebase() {
  // Sur le client, on retourne les instances en cache si elles existent
  if (typeof window !== 'undefined' && firebaseApp && auth && firestore) {
    return { firebaseApp, auth, firestore };
  }

  // Initialisation de l'App
  if (getApps().length > 0) {
    firebaseApp = getApp();
  } else {
    try {
      // Tentative d'initialisation automatique (App Hosting)
      firebaseApp = initializeApp();
    } catch (e) {
      // Fallback vers la config explicite
      firebaseApp = initializeApp(firebaseConfig);
    }
  }

  // Initialisation des services
  auth = getAuthInstance(firebaseApp);
  firestore = getFirestoreInstance(firebaseApp);

  return { firebaseApp, auth, firestore };
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
