import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const googleProvider = new GoogleAuthProvider();

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? serializeUser(user) : null);
  });
}

function serializeUser(firebaseUser) {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
  };
}

export async function loginViaEmailPassword(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return serializeUser(result.user);
}

export async function registerUser({ email, password }) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(result.user);
  return serializeUser(result.user);
}

export async function logout() {
  await signOut(auth);
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return serializeUser(result.user);
}

export async function resetPasswordRequest(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function resetPassword({ resetToken, newPassword }) {
  await confirmPasswordReset(auth, resetToken, newPassword);
}

export { onAuthStateChanged, auth };
