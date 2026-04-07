import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
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
 * Get portfolio data by GitHub username or custom URL mapping.
 * First looks up the userId from mapping, then fetches the portfolio.
 * @param {string} usernameOrCustomUrl - GitHub username or custom URL
 * @returns {Promise<Object|null>} Portfolio data or null if not found
 */
export async function getPortfolioByUsername(usernameOrCustomUrl) {
  const key = usernameOrCustomUrl.toLowerCase();
  
  // Step 1: Look up by custom URL alias first
  let mappingRef = doc(db, "portfoliosByCustomUrl", key);
  let mappingSnap = await getDoc(mappingRef);

  // Step 2: If not found, look up by GitHub username alias
  if (!mappingSnap.exists()) {
    mappingRef = doc(db, "portfoliosByUsername", key);
    mappingSnap = await getDoc(mappingRef);
  }

  if (!mappingSnap.exists()) {
    return null;
  }

  const { userId } = mappingSnap.data();
  if (!userId) {
    return null;
  }

  // Step 3: Fetch the actual portfolio data using the userId
  const portfolioRef = doc(db, "portfolios", userId);
  const portfolioSnap = await getDoc(portfolioRef);

  return portfolioSnap.exists() ? portfolioSnap.data() : null;
}

/**
 * Save a custom URL mapping for a user.
 * @param {string} customUrl - The custom URL slug chosen by the user
 * @param {string} userId - Firebase Auth user ID
 */
export async function saveCustomUrlMapping(customUrl, userId) {
  const key = customUrl.toLowerCase();
  const docRef = doc(db, "portfoliosByCustomUrl", key);
  const existingMapping = await getDoc(docRef);

  if (existingMapping.exists() && existingMapping.data().userId !== userId) {
    throw new Error("This custom URL is already taken by another user.");
  }

  // Also store it on the user's main portfolio document for quick reference
  const portfolioRef = doc(db, "portfolios", userId);
  await setDoc(portfolioRef, { customUrl: key }, { merge: true });

  await setDoc(docRef, {
    userId,
    customUrl: key,
    createdAt: serverTimestamp(),
  });
}

/**
 * Save the username-to-userId mapping for public portfolio lookup.
 * One portfolio per username - allows regeneration by same user, blocks others.
 * @param {string} username - GitHub username
 * @param {string} userId - Firebase Auth user ID
 * @param {boolean} isRegeneration - Whether this is a regeneration request
 * @throws {Error} If username is claimed by a different user
 * @returns {Object} { isNew: boolean, isOwner: boolean }
 */
export async function saveUsernameMapping(username, userId, _isRegeneration = false) {
  const docRef = doc(db, "portfoliosByUsername", username.toLowerCase());
  const existingMapping = await getDoc(docRef);

  if (existingMapping.exists()) {
    const existingUserId = existingMapping.data().userId;

    // Different user trying to claim this username
    if (existingUserId !== userId) {
      throw new Error(
        `The GitHub username "${username}" is already claimed by another user. ` +
        `Each GitHub username can only be linked to one GitFolio account.`
      );
    }

    // Same user - this is a regeneration
    return { isNew: false, isOwner: true };
  }

  // New portfolio
  await setDoc(docRef, {
    userId,
    username,
    createdAt: serverTimestamp(),
  });

  return { isNew: true, isOwner: true };
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
