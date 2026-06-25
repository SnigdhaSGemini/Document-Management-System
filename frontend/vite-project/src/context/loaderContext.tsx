import { createContext, useContext, useState, useCallback } from "react";

const LoaderContext = createContext(null); 

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

const withLoader = useCallback(async (asyncFunc) => {
  try {
    startLoading();
    
    const result = await asyncFunc();
    return result;
  } finally {
    stopLoading();
  }
}, []);


  return (
    <LoaderContext.Provider
      value={{ loading, startLoading, stopLoading, withLoader }}
    >
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => { return useContext(LoaderContext)};
