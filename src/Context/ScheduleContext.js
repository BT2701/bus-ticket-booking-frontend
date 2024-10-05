import React, { createContext, useState, useContext } from 'react';

// Tạo Context
const ScheduleContext = createContext();

// Tạo Provider để bao bọc các thành phần khác
export const ScheduleProvider = ({ children }) => {
  const [schedule, setSchedule] = useState(null);

  // Hàm cập nhật lịch trình
  const updateSchedule = (newSchedule) => {
    setSchedule(newSchedule);
  };

  return (
    <ScheduleContext.Provider value={{ schedule, updateSchedule }}>
      {children}
    </ScheduleContext.Provider>
  );
};

// Custom hook để sử dụng ScheduleContext dễ dàng hơn
export const useSchedule = () => {
  return useContext(ScheduleContext);
};
