import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB0EOHIxD2yuQxdfOGsnQ4F0eKBBxIcOe4",
  authDomain: "server-app-job-76e6a.firebaseapp.com",
  projectId: "server-app-job-76e6a",
  storageBucket: "server-app-job-76e6a.firebasestorage.app",
  messagingSenderId: "995976870515",
  appId: "1:995976870515:web:7624649904109f99bac806"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
