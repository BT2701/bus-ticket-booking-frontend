import React, { useEffect, useState } from 'react';
import { fetchPastBookings } from './HandleHistory'; // Giả sử bạn đã tạo file HandleHistory.js
import HistoryScheduleItem from './HistoryScheduleItem'; // Nhập component HistoryScheduleItem

const History = ({ customerId }) => {
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm loading để theo dõi trạng thái tải dữ liệu

  // Hàm lấy dữ liệu từ API và cập nhật state
  const loadPastBookings = async () => {


    const bookings = await fetchPastBookings(2); //thay customerid vào đây


    setPastBookings(bookings); // Cập nhật state với dữ liệu lấy được
    setLoading(false); // Đặt trạng thái loading thành false khi dữ liệu đã được tải
  };

  // Sử dụng useEffect để lấy dữ liệu khi component mount
  useEffect(() => {
    // if (customerId) {
    //   loadPastBookings();
    // }
    loadPastBookings();

  }, []);

  return (
    <>
        <strong className='d-flex justify-content-center fs-2'>Lịch sử</strong>
        <div className='d-flex flex-column align-items-center'>
        {loading ? (
            <p>Đang tải dữ liệu...</p> // Hiển thị thông báo khi đang tải dữ liệu
        ) : pastBookings.length === 0 ? (
            <p>Không có chuyến đi nào trong lịch sử.</p>
        ) : (
            pastBookings.map((ticketData, index) => (
            <HistoryScheduleItem key={index} scheduleData={ticketData} />
            ))
        )}
        </div>
    </>
  
  );
};

export default History;
