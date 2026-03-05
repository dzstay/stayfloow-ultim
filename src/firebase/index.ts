'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, FirebaseApp, getApp } from 'firebase/app';
import { getAuth as getAuthInstance, Auth } from 'firebase/auth';
import { getFirestore as getFirestoreInstance, Firestore } from 'firebase/firestore';

/**
 * @fileOverview Initialisation Firebase Singleton Ultra-Robuste.
 * Utilise globalThis pour persister les instances à travers les rechargements HMR de Next.js,
 * ce qui est la seule solution fiable pour éviter l'erreur d'état interne ca9 de Firestore.
 */

declare global {
  var _firebaseApp: FirebaseApp | undefined;
  var _firebaseAuth: Auth | undefined;
  var _firebaseFirestore: Firestore | undefined;
}

export function initializeFirebase() {
  // SSR : Toujours créer une instance fraîche pour le rendu serveur
  if (typeof window === 'undefined') {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return {
      firebaseApp: app,
      auth: getAuthInstance(app),
      firestore: getFirestoreInstance(app),
    };
  }

  // CLIENT : Utilisation du cache global persistant
  if (!globalThis._firebaseApp) {
    const apps = getApps();
    globalThis._firebaseApp = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  }

  if (!globalThis._firebaseAuth) {
    globalThis._firebaseAuth = getAuthInstance(globalThis._firebaseApp);
  }

  if (!globalThis._firebaseFirestore) {
    globalThis._firebaseFirestore = getFirestoreInstance(globalThis._firebaseApp);
  }

  return {
    firebaseApp: globalThis._firebaseApp,
    auth: globalThis._firebaseAuth,
    firestore: globalThis._firebaseFirestore,
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
