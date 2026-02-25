
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore as getFirestoreInstance, Firestore } from 'firebase/firestore';
import { getAuth as getAuthInstance, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

export function initializeFirebase() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuthInstance(app);
  const db = getFirestoreInstance(app);
  return { app, auth, db };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';
