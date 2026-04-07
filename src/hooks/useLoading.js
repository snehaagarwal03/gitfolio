import { useState, useCallback } from "react";

export function useLoading(initialState = false) {
  const [loading, setLoading] = useState(initialState);
  const [error, setError] = useState(null);

  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const setErrorState = useCallback((err) => {
    setError(err instanceof Error ? err.message : err);
    setLoading(false);
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return { loading, error, startLoading, stopLoading, setErrorState, reset };
}
