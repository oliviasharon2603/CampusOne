import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBdbcga7s2UGoHmGSautJ5rRYOjP0TV1w8",
  authDomain: "campusone-nn.firebaseapp.com",
  projectId: "campusone-nn",
  storageBucket: "campusone-nn.firebasestorage.app",
  messagingSenderId: "1021886592327",
  appId: "1:1021886592327:web:6c4623ce3d0745ce378862",
  measurementId: "G-VEN9JGXV9H"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
