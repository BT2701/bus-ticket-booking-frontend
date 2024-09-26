import React, { createContext, useContext, useState } from "react";

// Create the context
const PageContext = createContext();

// Custom hook to use the PageContext
export const usePageContext = () => useContext(PageContext);

// Provider component
export const PageProvider = ({ children }) => {
  // Change 'Children' to 'children'
  const [page, setPage] = useState("homepage");

  return (
    <PageContext.Provider value={{ page, setPage }}>
      {children}
    </PageContext.Provider>
  );
};
