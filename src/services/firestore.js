import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Save or update a user's portfolio data in Firestore.
 * @param {string} userId - Firebase Auth user ID
 * @param {Object} portfolioData - The portfolio data to store
 */
export async function savePortfolio(userId, portfolioData) {
  const docRef = doc(db, "portfolios", userId);
  await setDoc(
    docRef,
    {
      ...portfolioData,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Get a user's portfolio data from Firestore.
 * @param {string} userId - Firebase Auth user ID
 * @returns {Promise<Object|null>} Portfolio data or null if not found
 */
export async function getPortfolio(userId) {
  const docRef = doc(db, "portfolios", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

/**
 * Get portfolio data by GitHub username (for public portfolio pages).
 * First looks up the userId from username mapping, then fetches the portfolio.
 * @param {string} username - GitHub username
 * @returns {Promise<Object|null>} Portfolio data or null if not found
 */
export async function getPortfolioByUsername(username) {
  // Step 1: Look up the userId from the username mapping
  const mappingRef = doc(db, "portfoliosByUsername", username.toLowerCase());
  const mappingSnap = await getDoc(mappingRef);

  if (!mappingSnap.exists()) {
    return null;
  }

  const { userId } = mappingSnap.data();
  if (!userId) {
    return null;
  }

  // Step 2: Fetch the actual portfolio data using the userId
  const portfolioRef = doc(db, "portfolios", userId);
  const portfolioSnap = await getDoc(portfolioRef);

  return portfolioSnap.exists() ? portfolioSnap.data() : null;
}

/**
 * Save the username-to-userId mapping for public portfolio lookup.
 * @param {string} username - GitHub username
 * @param {string} userId - Firebase Auth user ID
 */
export async function saveUsernameMapping(username, userId) {
  const docRef = doc(db, "portfoliosByUsername", username.toLowerCase());
  await setDoc(docRef, {
    userId,
    username,
    createdAt: serverTimestamp(),
  });
}

/**
 * Update specific fields in a user's portfolio.
 * @param {string} userId - Firebase Auth user ID
 * @param {Object} updates - Fields to update
 */
export async function updatePortfolio(userId, updates) {
  const docRef = doc(db, "portfolios", userId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Save resume data for a user.
 * @param {string} userId - Firebase Auth user ID
 * @param {Object} resumeData - Resume content and styling data
 */
export async function saveResume(userId, resumeData) {
  const docRef = doc(db, "resumes", userId);
  await setDoc(
    docRef,
    {
      ...resumeData,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Get resume data for a user.
 * @param {string} userId - Firebase Auth user ID
 * @returns {Promise<Object|null>} Resume data or null if not found
 */
export async function getResume(userId) {
  const docRef = doc(db, "resumes", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}
