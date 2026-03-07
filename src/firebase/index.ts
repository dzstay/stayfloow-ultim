'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, FirebaseApp, getApp } from 'firebase/app';
import { getAuth as getAuthInstance, Auth } from 'firebase/auth';
import { getFirestore as getFirestoreInstance, Firestore } from 'firebase/firestore';

/**
 * @fileOverview Initialisation Firebase Singleton ultra-résiliente.
 * Cette structure empêche la création d'instances multiples des services, 
 * ce qui est la cause principale de l'erreur "INTERNAL ASSERTION FAILED (ID: ca9)".
 */

let memoApp: FirebaseApp | undefined;
let memoAuth: Auth | undefined;
let memoFirestore: Firestore | undefined;

export function initializeFirebase() {
  if (typeof window === 'undefined') {
    // Côté serveur, on retourne des instances fraîches ou null
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return {
      firebaseApp: app,
      auth: getAuthInstance(app),
      firestore: getFirestoreInstance(app),
    };
  }

  // Côté client (Navigateur), on utilise un cache strict
  if (!memoApp) {
    if (getApps().length > 0) {
      memoApp = getApp();
    } else {
      memoApp = initializeApp(firebaseConfig);
    }
  }

  if (!memoAuth) {
    memoAuth = getAuthInstance(memoApp);
  }

  if (!memoFirestore) {
    memoFirestore = getFirestoreInstance(memoApp);
  }

  return {
    firebaseApp: memoApp,
    auth: memoAuth,
    firestore: memoFirestore,
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
