
'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

/**
 * Provider client qui initialise Firebase une seule fois du côté navigateur.
 * Cela évite de passer des instances circulaires ou complexes depuis le serveur,
 * ce qui cause des erreurs de sérialisation dans Next.js 15.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const { app, db, auth } = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider app={app} firestore={db} auth={auth}>
      {children}
    </FirebaseProvider>
  );
}
