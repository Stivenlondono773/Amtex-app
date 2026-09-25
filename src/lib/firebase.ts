import { getApp, getApps, initializeApp } from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyDz56hPAtHpLp-QowRIQroIzMs5zxNG06ys',
  authDomain: 'amtex-app-ede1d.firebaseapp.com',
  projectId: 'amtex-app-ede1d',
  storageBucket: 'amtex-app-ede1d.firebasestorage.app',
  messagingSenderId: '1029528528076',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '1:1029528528076:web:7a600cc1d966dbe55fce69',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const operatorEmail = (numeroOperario: string) => `${numeroOperario.trim().toLowerCase()}@amtex.app`;

type RegisterOperatorInput = {
  nombre: string;
  numeroOperario: string;
  password: string;
  confirmarPassword: string;
};

export async function registerOperator({
  nombre,
  numeroOperario,
  password,
  confirmarPassword,
}: RegisterOperatorInput) {
  if (password !== confirmarPassword) {
    throw new Error('Las contraseñas no coinciden');
  }

  const credential = await createUserWithEmailAndPassword(auth, operatorEmail(numeroOperario), password);

  await setDoc(doc(db, 'usuarios', credential.user.uid), {
    uid: credential.user.uid,
    nombre: nombre.trim(),
    numeroOperario: numeroOperario.trim(),
    createdAt: serverTimestamp(),
  });
}

export async function loginOperator(numeroOperario: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, operatorEmail(numeroOperario), password);
  const snapshot = await getDoc(doc(db, 'usuarios', credential.user.uid));
  const data = snapshot.data();

  return {
    numeroOperario: numeroOperario.trim(),
    nombre: typeof data?.nombre === 'string' ? data.nombre : numeroOperario.trim(),
  };
}

export function firebaseErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error)) return fallback;

  switch (error.message) {
    case 'Firebase: Error (auth/email-already-in-use).':
      return 'Ese número de operario ya está registrado';
    case 'Firebase: Error (auth/invalid-credential).':
    case 'Firebase: Error (auth/invalid-login-credentials).':
      return 'Usuario o contraseña incorrectos';
    case 'Firebase: Error (auth/network-request-failed).':
      return 'No hay conexión con Firebase';
    default:
      return error.message || fallback;
  }
}