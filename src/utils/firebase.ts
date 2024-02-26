import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
    apiKey: "AIzaSyDwSUeu569U37KoMt_MIL8cgFeiAwZFe6s",
    authDomain: "aiupeducators.firebaseapp.com",
    projectId: "aiupeducators",
    storageBucket: "aiupeducators.appspot.com",
    messagingSenderId: "332054940514",
    appId: "1:332054940514:web:eff5ae65489887a37c3a3b",
    measurementId: "G-NVZYJP5DTZ",
};
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
const usersCollectionData = collection(firestore, "RegisteredUsers");
const auth = getAuth(firebaseApp);
const analytics = getAnalytics(firebaseApp);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({   
    prompt : "select_account "
});
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export { firebaseApp, firestore, auth, usersCollectionData, onSnapshot, analytics };
