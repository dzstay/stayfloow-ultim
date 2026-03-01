'use client';

import React from 'react';
import { app, db, auth } from './init';
import { FirebaseProvider } from './provider';

/**
 * Provider client qui utilise les instances déjà initialisées dans init.ts.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider app={app} firestore={db} auth={auth}>
      {children}
    </FirebaseProvider>
  );
}
