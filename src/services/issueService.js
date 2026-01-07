import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  Timestamp
} from "firebase/firestore";
import { db } from "../config/firebase";

export const getAllIssues = async () => {
  const q = query(collection(db, "issues"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addIssue = (data) =>
  addDoc(collection(db, "issues"), {
    ...data,
    createdAt: Timestamp.now()
  });

export const updateStatus = (id, status) =>
  updateDoc(doc(db, "issues", id), { status });
