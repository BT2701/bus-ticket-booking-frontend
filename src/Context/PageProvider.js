import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Create the context
const PageContext = createContext();

// Custom hook to use the PageContext
export const usePageContext = () => useContext(PageContext);

// Provider component
export const PageProvider = ({ children }) => {
  // Change 'Children' to 'children'
  const [page, setPage] = useState(".");

  const location = useLocation();
  useEffect(() => {
    const path = location.pathname.split('/')[1];
    setPage(path === "" ? "homepage" : path)
  }, [location])

  return (
    <PageContext.Provider value={{ page, setPage }}>
      {children}
    </PageContext.Provider>
  );
};
