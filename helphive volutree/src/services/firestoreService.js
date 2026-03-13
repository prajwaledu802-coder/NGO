import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import { db } from "../firebase";

export function watchCollection(name, callback) {
  const q = query(collection(db, name), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const docs = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      callback(docs);
    },
    () => callback([])
  );
}

export async function joinEvent(user, event) {
  await addDoc(collection(db, "activities"), {
    userId: user.uid,
    eventId: event.id,
    eventName: event.name,
    date: event.date,
    hours: 0,
    status: "Joined",
    createdAt: serverTimestamp()
  });
}

export async function respondToRequest(user, request) {
  await addDoc(collection(db, "volunteers"), {
    userId: user.uid,
    type: "responded",
    helpRequestId: request.id,
    location: request.location,
    createdAt: serverTimestamp()
  });
}

export async function updateProfile(userId, payload) {
  await setDoc(doc(db, "users", userId), payload, { merge: true });
}
