const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let appPromise = null;

/**
 * Lazily initialize the Firebase app (module-level cached promise).
 * Firebase modules are loaded on first call, keeping them out of the main chunk.
 */
export function initFirebase() {
  if (!appPromise) {
    appPromise = (async () => {
      const { initializeApp } = await import('firebase/app');
      const app = initializeApp(firebaseConfig);
      const { getAnalytics } = await import('firebase/analytics');
      if (typeof window !== 'undefined') {
        getAnalytics(app);
      }
      return app;
    })();
  }
  return appPromise;
}
