import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore as getFirestoreInstance, Firestore } from 'firebase/firestore';
import { getAuth as getAuthInstance, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuthInstance(app);
db = getFirestoreInstance(app);

export { app, auth, db };

export function initializeFirebase() {
  return { app, auth, db };
}
