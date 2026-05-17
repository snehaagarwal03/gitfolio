import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../services/firebase";

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authProvider, setAuthProvider] = useState(null); // "github" | "google" | "email"
  const [githubAccessToken, setGithubAccessToken] = useState(() => {
    // Restore token from sessionStorage on initial load
    return sessionStorage.getItem("githubAccessToken") || null;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Determine the auth provider from providerData
        const providerData = currentUser.providerData;
        if (providerData.length > 0) {
          const providerId = providerData[0].providerId;
          if (providerId === "github.com") {
            setAuthProvider("github");
          } else if (providerId === "google.com") {
            setAuthProvider("google");
          } else {
            setAuthProvider("email");
          }
        }
      } else {
        setAuthProvider(null);
        setGithubAccessToken(null);
        sessionStorage.removeItem("githubAccessToken");
      }

      setLoading(false);
    });

    // Check for redirect result (OAuth callback after redirect flow)
    getRedirectResult(auth).then((result) => {
      if (result) {
        // Extract GitHub access token if available
        const credential = result._tokenResponse;
        if (credential?.oauthAccessToken) {
          setGithubAccessToken(credential.oauthAccessToken);
          sessionStorage.setItem("githubAccessToken", credential.oauthAccessToken);
        }
      }
    }).catch((error) => {
      console.error("Redirect result error:", error);
    });

    return unsubscribe;
  }, []);

  // Sign in with Google
  async function loginWithGoogle() {
    await signInWithRedirect(auth, googleProvider);
    // After redirect, getRedirectResult in useEffect handles the result
  }

  // Sign in with GitHub
  async function loginWithGithub() {
    await signInWithRedirect(auth, githubProvider);
    // After redirect, getRedirectResult in useEffect handles the result
  }

  // Sign in with Email/Password
  async function loginWithEmail(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    setAuthProvider("email");
    return result;
  }

  // Sign up with Email/Password
  async function signupWithEmail(email, password, displayName) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Set the display name on the user profile
    await updateProfile(result.user, { displayName });
    setAuthProvider("email");
    return result;
  }

  // Logout
  async function logout() {
    await signOut(auth);
    setUser(null);
    setAuthProvider(null);
    setGithubAccessToken(null);
    sessionStorage.removeItem("githubAccessToken");
  }

  const value = {
    user,
    loading,
    authProvider,
    githubAccessToken,
    loginWithGoogle,
    loginWithGithub,
    loginWithEmail,
    signupWithEmail,
    logout,
    isGithubAuth: authProvider === "github",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
