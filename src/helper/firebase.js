// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "@firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAqMp8Zao5qXfDRllFFW00fyy1Sys-dL78",
  authDomain: "blog-fb8fe.firebaseapp.com",
  projectId: "blog-fb8fe",
  storageBucket: "blog-fb8fe.appspot.com",
  messagingSenderId: "1011142574241",
  appId: "1:1011142574241:web:872419d682c8d7d69830e0"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);






export { storage }