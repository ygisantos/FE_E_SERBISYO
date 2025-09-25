import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { setLoadingContext } from "../axios";

const LoadingContext = createContext({
  loading: false,
  setLoading: () => {},
  show: () => {},
  hide: () => {},
});

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const show = useCallback(() => setLoading(true), []);
  const hide = useCallback(() => setLoading(false), []);

  useEffect(() => {
    setLoadingContext({ loading, setLoading, show, hide });
    return () => setLoadingContext(null);
  }, [loading, show, hide]);

  return (
    <LoadingContext.Provider value={{ loading, setLoading, show, hide }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);

export default LoadingContext;
