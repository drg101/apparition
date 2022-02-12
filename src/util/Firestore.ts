import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { createRequire } from "module"; 
const require = createRequire(import.meta.url); 
const serviceAccount = require("../../keys/troll.json" ) 

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

export const add_to_firestore = async (collection: string, data: any) => {
    await db.collection(collection).add(data)
}

export const get_from_firestore = async (collection: string, query: string[]) => {

}