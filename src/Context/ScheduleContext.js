import React, { createContext, useState, useContext } from 'react';

// Tạo Context
const ScheduleContext = createContext();

// Tạo Provider để bao bọc các thành phần khác
export const ScheduleProvider = ({ children }) => {
  const [schedule, setSchedule] = useState(null);
  const [seatList, setSeatList]= useState([]);
  const [finalTotal, setFinalTotal]= useState(0);
  const [loader, setLoader] = useState(0);
  // Hàm cập nhật lịch trình
  const updateSchedule = (newSchedule) => {
    setSchedule(newSchedule);
  };
  const updateSeatList=(seatList)=>{
    setSeatList(seatList);
  };
  const updateTotal=(total)=>{
    setFinalTotal(total);
  };
  const getSeatCount=()=>{
    return seatList.length;
  }
  return (
    <ScheduleContext.Provider value={{ schedule,finalTotal,seatList,loader, updateSchedule, updateTotal, updateSeatList,getSeatCount, setLoader }}>
      {children}
    </ScheduleContext.Provider>
  );
};

// Custom hook để sử dụng ScheduleContext dễ dàng hơn
export const useSchedule = () => {
  return useContext(ScheduleContext);
};
