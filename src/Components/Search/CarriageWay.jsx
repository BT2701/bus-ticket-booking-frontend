import { Link } from "react-router-dom";
import FeedbackButton from '../Feedback/FeedbackButton';
import FeedbackItem from '../Feedback/FeedbackItem';
import { faAnglesRight, faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { getAllFeedback, getAvgAndTotalFeedback, getTotalFeedbackCount } from '../Feedback/HandleFeedback'; // Import hàm fetch dữ liệu
import { useSchedule } from "../../Context/ScheduleContext";
import axios from "axios";
import ApiService from "../Utils/apiService";


const CarriageWay = ({ busData }) => { // Nhận busData từ props
  const [isOpenFeedback, setIsOpenFeedback] = useState(false); // State độc lập cho mỗi CarriageWay
  const [firstClick, setfirstClick] = useState(false); // Số sao trung bình
  const [feedbackData, setFeedbackData] = useState([]); // State cho dữ liệu đánh giá
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [pageSize, setPageSize] = useState(2); // Kích thước mỗi trang
  const [totalFeedback, setTotalFeedback] = useState(0); // Tổng số đánh giá
  const [averageRating, setAverageRating] = useState(0); // Số sao trung bình
  const [ratingFilter, setRatingFilter] = useState(0); // State để lưu số sao cần lọc
  const { schedule, updateSchedule } = useSchedule();
  const [busImg, setBusImg] = useState("");

  const handleSelectSchedule = (scheduleId) => {
    const fetchData = async () => {
      try {
        // setIsOpenFeedback(true);
        const schedulesResponse = await ApiService.get(`/api/schedule?id=${scheduleId}`);     //dat tam id
        updateSchedule(schedulesResponse);
        localStorage.setItem('schedule', JSON.stringify(schedulesResponse));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  };

  // Hàm này sẽ được truyền vào component con để nhận dữ liệu đánh giá
  const setFeedbackDataFromChild = (data) => {
    //chỉ gọi trong lần đầu nhấn
    if (firstClick == false) {
      fetchAvgAndTotalFeedback(busData[8]);
    }

    setFeedbackData(data); // Cập nhật state feedbackData với dữ liệu từ con
    setIsOpenFeedback(!isOpenFeedback);
    // openFeedback();
  };
  // Hàm để gọi dữ liệu phản hồi
  const getFeedback = async (scheduleId, page, size, ratingFilter) => {
    setFeedbackData([]);
    try {
      const response = await getAllFeedback(scheduleId, page, size, ratingFilter);
      const feedbacks = response.map(feedback => ({
        content: feedback[0],
        rating: feedback[1],
        date: feedback[2],
        Cusname: feedback[3]
      }));
      setFeedbackData(feedbacks);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  // Hàm để gọi tổng số phản hồi và số sao trung bình chỉ gọi trong lần đầu nhấn
  const fetchAvgAndTotalFeedback = async (scheduleId) => {
    setfirstClick(true);
    try {
      const result = await getAvgAndTotalFeedback(scheduleId);
      if (result && result.length > 0) {
        const [totalFeedback, averageRating] = result[0]; // Lấy dữ liệu từ mảng con đầu tiên
        setTotalFeedback(totalFeedback); // Tổng số phản hồi
        setAverageRating(averageRating); // Số sao trung bình
      }
    } catch (error) {
      console.error('Error fetching feedback summary:', error);
    }
  };

  // Hàm để điều hướng trang
  const handlePageChange = (newPage) => {
    if (newPage >= 0) {
      setCurrentPage(newPage);
      getFeedback(busData[8], newPage, pageSize, ratingFilter); // Gọi lại dữ liệu phản hồi với trang mới
      setIsOpenFeedback(true); // Đảm bảo rằng phản hồi sẽ được mở
    }
  };

  const handleFilterRating = async (rating) => {
    var newPage = 0;
    setCurrentPage(newPage);

    if (rating > 0) {
      // Gọi hàm lấy phản hồi
      await getFeedback(busData[8], newPage, pageSize, rating);

      try {
        // Chờ kết quả từ getTotalFeedbackCount
        var total = await getTotalFeedbackCount(busData[8], rating);
        setTotalFeedback(total);  // Cập nhật tổng số phản hồi
        setfirstClick(false);
      } catch (error) {
        console.error('Error fetching total feedback count:', error);
        // Bạn có thể hiển thị thông báo lỗi cho người dùng ở đây nếu cần
      }

      setIsOpenFeedback(true);  // Đảm bảo rằng phản hồi sẽ được mở
    } else {
      // Gọi hàm lấy phản hồi
      await getFeedback(busData[8], newPage, pageSize, rating);

      try {
        // Chờ kết quả từ getTotalFeedbackCount
        var total = await getTotalFeedbackCount(busData[8], rating);
        setTotalFeedback(total);  // Cập nhật tổng số phản hồi
        setfirstClick(true);
      } catch (error) {
        console.error('Error fetching total feedback count:', error);
        // Bạn có thể hiển thị thông báo lỗi cho người dùng ở đây nếu cần
      }

      setIsOpenFeedback(true);  // Đảm bảo rằng phản hồi sẽ được mở
    }
  };

  useEffect(() => {
    // Mỗi lần busData thay đổi, đóng feedback
    setIsOpenFeedback(false);
    setFeedbackData([]); // Xóa dữ liệu feedback cũ để tránh hiển thị nhầm
    setfirstClick(false); // Đặt lại trạng thái lần nhấn đầu tiên
    setTotalFeedback(0); // Đặt lại tổng số feedback
    setAverageRating(0); // Đặt lại số sao trung bình
    setRatingFilter(0); // Đặt lại bộ lọc sao
    setBusImg(`http://localhost:8080/api/buses/img/${busData[9]}`);
  }, [busData]);


  return (
    <div className="container m-0 p-0">
      <div className="card mb-3 shadow-sm">
        <div className="row g-0">
          <div className="col-md-3 position-relative">
            <img
            src={busImg || "https://via.placeholder.com/150"}
            className="img-fluid"
              alt="Bus"
              style={{
                width: "90%",
                height: "100%", // Đặt chiều cao bằng 100% chiều cao phần tử cha
                objectFit: "contain",
                marginLeft: "5px",
              }}
            />

            <span className="badge bg-success position-absolute top-0 start-0 m-1">
              Xác nhận tức thì
            </span>

          </div>
          <div className="col-md-6">
            <div className="card-body">
              <strong className="card-title mb-1 fs-4" style={{ color: 'red' }} >
                Nhà Xe Phương Trang
              </strong>
              <p className="text-muted mb-1">{busData[0]}</p> {/* Hiển thị loại ghế */}
              <p className="mb-1">
                <strong className="fs-5">{busData[6]}</strong> {/* Hiển thị bến xe đi */}
                <br />
                <p className="text-muted mb-0">{busData[1]}</p>{/* Hiển thị giờ đi */}
                <p className="text-muted mb-0">{busData[2]}</p>{/* Hiển thị giờ đến */}
                <strong className="fs-5">{busData[7]}</strong> {/* Hiển thị bến xe đến */}
              </p>
            </div>
          </div>
          <div className="col-md-3 text-center d-flex flex-column justify-content-center align-items-center">
            <h4 className="text-primary fw-bold">{busData[3]}</h4> {/* Hiển thị giá vé */}
            <p className="text-muted mb-1">Còn {busData[4]} chỗ trống</p> {/* Hiển thị số chỗ còn lại */}
            <Link className="btn btn-warning text-white mb-2" to={'/schedule/detail'} onClick={() => handleSelectSchedule(busData[8])}>
              Chọn chuyến
            </Link>
            <p className="text-danger fw-bold m-0">KHÔNG CẦN THANH TOÁN TRƯỚC</p>
            {/* <FeedbackButton scheduleId={busData[8]}/>   */}
            <FeedbackButton
              scheduleId={busData[8]}
              onFeedbackUpdate={setFeedbackDataFromChild}
              page={currentPage} // Truyền trang hiện tại
              size={pageSize} // Truyền kích thước trang
              isOpenFeedback={isOpenFeedback} // Truyền state độc lập
              setIsOpenFeedback={setIsOpenFeedback} // Truyền hàm để quản lý
            />
          </div>
        </div>
        {isOpenFeedback ? (
          <>
            <hr />
            <div className="row g-0">
              <FeedbackItem feedbackData={feedbackData}
                averageRating={averageRating}
                handleFilterRating={handleFilterRating}
              /> {/* Truyền thêm averageRating */}
            </div>
            {/* Phân trang */}
            {totalFeedback > 0 && (
              // Phân trang
              <div className="d-flex justify-content-center">
                <button
                  className="border-0" style={{ width: "30px", height: "30px", marginRight: "6px" }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0 || feedbackData.length === 0} // Vô hiệu hóa nếu là trang đầu
                >
                  <FontAwesomeIcon icon={faAnglesLeft} style={{ width: "30px", height: "30px" }} />
                </button>
                <button
                  className="border-0" style={{ width: "30px", height: "30px", marginLeft: "6px" }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={(currentPage + 1) * pageSize >= totalFeedback || feedbackData.length === 0}
                >
                  <FontAwesomeIcon icon={faAnglesRight} style={{ width: "30px", height: "30px" }} />
                </button>
              </div>
            )}
          </>
        ) : (
          <p />
        )}

      </div>
    </div>
  );
};

export default CarriageWay;
