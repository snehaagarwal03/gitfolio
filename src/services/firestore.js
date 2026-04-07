import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { FIRESTORE_COLLECTIONS } from "../constants";

export async function createUserDocument(uid, data) {
  const userRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid);
  const existing = await getDoc(userRef);

  if (existing.exists()) {
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return existing.data();
  }

  const userData = {
    firebaseUid: uid,
    displayName: data.displayName || "",
    email: data.email || "",
    authProvider: data.authProvider || "password",
    profileImage: data.profileImage || "",
    githubUsername: data.githubUsername || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(userRef, userData);
  return userData;
}

export async function getUserDocument(uid) {
  const userRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function updateUserDocument(uid, data) {
  const userRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid);
  await updateDoc(userRef, { ...data, updatedAt: serverTimestamp() });
}

export async function checkUsernameAvailable(username) {
  const portfoliosRef = collection(db, FIRESTORE_COLLECTIONS.PORTFOLIOS);
  const q = query(portfoliosRef, where("slug", "==", username));
  const snapshot = await getDocs(q);
  return snapshot.empty;
}

export async function getPortfolioByUsername(username) {
  const portfoliosRef = collection(db, FIRESTORE_COLLECTIONS.PORTFOLIOS);
  const q = query(portfoliosRef, where("slug", "==", username));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

export async function getPortfolioByUserId(uid) {
  const portfoliosRef = collection(db, FIRESTORE_COLLECTIONS.PORTFOLIOS);
  const q = query(portfoliosRef, where("userId", "==", uid));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

export async function createPortfolio(uid, data) {
  const portfolioData = {
    userId: uid,
    slug: data.slug,
    githubUsername: data.githubUsername,
    title: data.title || "",
    summary: data.summary || "",
    themeMode: data.themeMode || "dark",
    status: data.status || "draft",
    publicUrl: "",
    isPublic: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastGeneratedAt: serverTimestamp(),
  };

  const docRef = await addDoc(
    collection(db, FIRESTORE_COLLECTIONS.PORTFOLIOS),
    portfolioData
  );
  return { id: docRef.id, ...portfolioData };
}

export async function updatePortfolio(portfolioId, data) {
  const portfolioRef = doc(db, FIRESTORE_COLLECTIONS.PORTFOLIOS, portfolioId);
  await updateDoc(portfolioRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function getPortfolioSections(portfolioId) {
  const sectionsRef = collection(db, FIRESTORE_COLLECTIONS.PORTFOLIO_SECTIONS);
  const q = query(sectionsRef, where("portfolioId", "==", portfolioId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addPortfolioSection(portfolioId, sectionData) {
  const section = {
    portfolioId,
    type: sectionData.type,
    title: sectionData.title || "",
    content: sectionData.content || {},
    order: sectionData.order || 0,
    enabled: sectionData.enabled !== false,
    source: sectionData.source || "manual",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(
    collection(db, FIRESTORE_COLLECTIONS.PORTFOLIO_SECTIONS),
    section
  );
  return { id: docRef.id, ...section };
}

export async function updatePortfolioSection(sectionId, data) {
  const sectionRef = doc(db, FIRESTORE_COLLECTIONS.PORTFOLIO_SECTIONS, sectionId);
  await updateDoc(sectionRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deletePortfolioSection(sectionId) {
  const { deleteDoc } = await import("firebase/firestore");
  const sectionRef = doc(db, FIRESTORE_COLLECTIONS.PORTFOLIO_SECTIONS, sectionId);
  await deleteDoc(sectionRef);
}

export async function getResumeConfig(portfolioId) {
  const configsRef = collection(db, FIRESTORE_COLLECTIONS.RESUME_CONFIGS);
  const q = query(configsRef, where("portfolioId", "==", portfolioId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

export async function saveResumeConfig(portfolioId, configData) {
  const existing = await getResumeConfig(portfolioId);

  if (existing) {
    const configRef = doc(db, FIRESTORE_COLLECTIONS.RESUME_CONFIGS, existing.id);
    await updateDoc(configRef, { ...configData, updatedAt: serverTimestamp() });
    return { ...existing, ...configData };
  }

  const config = {
    portfolioId,
    templateName: configData.templateName || "default",
    fontFamily: configData.fontFamily || "Inter",
    fontSize: configData.fontSize || 14,
    headingColor: configData.headingColor || "#1a1a1a",
    textStyle: configData.textStyle || "normal",
    showHyperlinks: configData.showHyperlinks !== false,
    paperStyle: "white",
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(
    collection(db, FIRESTORE_COLLECTIONS.RESUME_CONFIGS),
    config
  );
  return { id: docRef.id, ...config };
}

export async function addGenerationHistory(portfolioId, userId, action, status, message) {
  await addDoc(collection(db, FIRESTORE_COLLECTIONS.GENERATION_HISTORY), {
    portfolioId,
    userId,
    action,
    status,
    message,
    createdAt: serverTimestamp(),
  });
}
