import React, { useEffect, useState } from 'react';
import { fetchPastBookings } from './HandleHistory'; // Giả sử bạn đã tạo file HandleHistory.js
import HistoryScheduleItem from './HistoryScheduleItem'; // Nhập component HistoryScheduleItem
import Pagination from '@mui/material/Pagination';
import { useUserContext } from '../../Context/UserProvider';

const History = ({ }) => {
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm loading để theo dõi trạng thái tải dữ liệu
  const [pageNum, setPageNum] = useState(1); 
  const [totalPages, setTotalPages] = useState(10);  // Tổng số trang
  const limit=10;
  const { state: user } = useUserContext();

  // Hàm lấy dữ liệu từ API và cập nhật state
  const loadPastBookings = async () => {
    const bookings = await fetchPastBookings(user?.id,pageNum, limit); 
    setPastBookings(bookings.data); // Cập nhật state với dữ liệu lấy được
    setTotalPages(bookings.totalPages);
    setLoading(false); // Đặt trạng thái loading thành false khi dữ liệu đã được tải
  };

  const handlePageChange = (newPageNum) => {
      setPageNum(newPageNum);
  };
  const renderPagination = () => {
      return (
          <Pagination
              count={totalPages}  // Tổng số trang
              page={pageNum}  // Trang hiện tại
              onChange={(event, value) => handlePageChange(value)}  // Cập nhật trang khi người dùng click
              shape="rounded"  // Hình dạng của các nút phân trang
              color="primary"  // Màu sắc cho nút phân trang
              siblingCount={2}  // Số lượng trang hiển thị ở gần trang hiện tại
              boundaryCount={1}  // Số lượng trang hiển thị ở đầu và cuối
          />
      );
  };

  useEffect(() => {
    // Gọi lại fetchAllRoutes() khi pageNum thay đổi
    loadPastBookings();
  }, [pageNum]);  // Chạy lại effect khi pageNum thay đổi

  // Sử dụng useEffect để lấy dữ liệu khi component mount
  useEffect(() => {
    if (user?.id) {
      loadPastBookings();
    }
    // loadPastBookings();

  }, []);

  return (
    <>
        <strong className='d-flex justify-content-center fs-2'>Lịch sử</strong>
        <div className='d-flex flex-column align-items-center'>
        {loading ? (
            <p>Đang tải dữ liệu...</p> // Hiển thị thông báo khi đang tải dữ liệu
        ) : pastBookings.length === 0 ? (
            <p>Không có chuyến đi nào.</p>
        ) : (
            pastBookings?.map((ticketData, index) => (
            <HistoryScheduleItem key={index} scheduleData={ticketData} />
            ))
        )
        }
        </div>
        {/* Hiển thị phân trang chỉ khi có dữ liệu */}
        {pastBookings.length > 0 && (
            <div className="d-flex justify-content-center">
                {renderPagination()}
            </div>
        )}
    </>
  
  );
};

export default History;
