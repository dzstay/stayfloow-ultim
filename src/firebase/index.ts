'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, FirebaseApp, getApp } from 'firebase/app';
import { getAuth as getAuthInstance, Auth } from 'firebase/auth';
import { getFirestore as getFirestoreInstance, Firestore } from 'firebase/firestore';

/**
 * @fileOverview Initialisation Firebase Singleton.
 * Garantit qu'une seule instance de chaque service est créée par application.
 */

let clientApp: FirebaseApp;
let clientAuth: Auth;
let clientFirestore: Firestore;

export function initializeFirebase() {
  // SSR : Retourne des instances fraîches pour chaque requête serveur
  if (typeof window === 'undefined') {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return {
      firebaseApp: app,
      auth: getAuthInstance(app),
      firestore: getFirestoreInstance(app),
    };
  }

  // CLIENT : Utilisation d'un singleton persistant pour éviter CA9
  if (!clientApp) {
    clientApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    clientAuth = getAuthInstance(clientApp);
    clientFirestore = getFirestoreInstance(clientApp);
  }

  return {
    firebaseApp: clientApp,
    auth: clientAuth,
    firestore: clientFirestore,
  };
}

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
