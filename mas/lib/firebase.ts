import { getApps, initializeApp } from "firebase/app"
import { getStorage, ref } from "firebase/storage"

const firebaseConfig = {
    apiKey: process.env.FIREBASEAPIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.BUCKET,
    messagingSenderId: "694310601633",
    appId: "1:694310601633:web:eb64d2381574acd28ec1e0",
    measurementId: "G-6MKS0744KJ"
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const storage = getStorage(app)
export const storageRef = (token: string) => ref(storage, token)