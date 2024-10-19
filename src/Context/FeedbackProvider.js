import React, { createContext, useState, useContext } from 'react';

// Tạo Context
const FeedbackContext = createContext();

// Tạo Provider để bao bọc các thành phần khác
export const FeedbackProvider = ({ children }) => {
    const [isOpenFeedback, setIsOpenFeedback] = useState(false);
    const closeFeedback =()=>{
        setIsOpenFeedback(false);
    }
    const openFeedback =()=>{
        setIsOpenFeedback(true);
    }
  return (
    <FeedbackContext.Provider value={{isOpenFeedback,setIsOpenFeedback, closeFeedback ,openFeedback}}>
      {children}
    </FeedbackContext.Provider>
  );
};

// Custom hook để sử dụng FeedbackContext dễ dàng hơn
export const useFeedback = () => {
  return useContext(FeedbackContext);
};
