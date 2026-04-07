import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../config/firebase";
import { AUTH_PROVIDERS } from "../constants";

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const getAuthProvider = () => {
    if (!user) return null;
    if (user.providerData.some((p) => p.providerId === "github.com")) {
      return AUTH_PROVIDERS.GITHUB;
    }
    if (user.providerData.some((p) => p.providerId === "google.com")) {
      return AUTH_PROVIDERS.GOOGLE;
    }
    return AUTH_PROVIDERS.PASSWORD;
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  const signInWithGithub = async () => {
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
  };

  const signInWithEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const signUpWithEmail = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    authProvider: getAuthProvider(),
    signInWithGoogle,
    signInWithGithub,
    signInWithEmail,
    signUpWithEmail,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
