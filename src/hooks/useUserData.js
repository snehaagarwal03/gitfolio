import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getUserDocument,
  getPortfolioByUserId,
} from "../services/firestore";

export function useUserData() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setPortfolio(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      try {
        const doc = await getUserDocument(user.uid);
        if (!cancelled) setUserData(doc);

        const portfolioDoc = await getPortfolioByUserId(user.uid);
        if (!cancelled) setPortfolio(portfolioDoc);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [user]);

  return { userData, portfolio, loading, setUserData, setPortfolio };
}
