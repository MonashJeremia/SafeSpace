import { createApp } from "vue";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import "./assets/accessibility.css";
import router from "./router";
import App from "./App.vue";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJJHBYuXQw4u8rWCc87xeLOBg0mCybvBo",
  authDomain: "safespace-80cba.firebaseapp.com",
  projectId: "safespace-80cba",
  storageBucket: "safespace-80cba.firebasestorage.app",
  messagingSenderId: "243792408421",
  appId: "1:243792408421:web:1ee2e0bd4709f0756b7b8c",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// Create and mount Vue app
const app = createApp(App);
app.use(router);
app.use(PrimeVue);
app.mount("#app");
