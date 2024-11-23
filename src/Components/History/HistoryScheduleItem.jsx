import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './HistoryScheduleItemstyle.css'; // Nhập file CSS
import { addFeedback } from './HandleHistory'; // Giả sử bạn đã tạo file HandleHistory.js
import notificationWithIcon from '../Utils/notification'; // Nhập hàm thông báo



// Hàm định dạng timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Không có thông tin giờ đi';
  const date = new Date(timestamp);
  const formattedTime = date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const formattedDate = `(${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()})`;
  return `${formattedTime} ${formattedDate}`;
};

// Hàm định dạng giá tiền
const formatPrice = (price) => {
  return price ? new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price) : 'Giá vé chưa có';
};

const HistoryScheduleItem = ({ scheduleData }) => {
  const [rating, setRating] = useState(0); // State để lưu đánh giá
  const [feedbackcontent, setFeedback] = useState(); // State để lưu đánh giá
  const [showModal, setShowModal] = useState(false); // State để điều khiển modal
  const [feedbackValue, setFeedbackValue] = useState(0); // 0: chưa đánh giá, 1: đã đánh giá

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

   // Cập nhật giá trị feedbackValue dựa trên feedback từ scheduleData
   useEffect(() => {
    const feedback = scheduleData[10];
    setFeedbackValue(feedback); // Cập nhật giá trị feedbackValue
  }, [scheduleData]);

  // Hàm gửi đánh giá
  const handleRatingSubmit = async () => {
    try {
      // Gọi hàm addFeedback để gửi phản hồi
      const response = await addFeedback(feedbackcontent, rating, ticketId);
      if (response) {
        setFeedbackValue(1); // Đánh giá thành công, cập nhật state
        notificationWithIcon('success', 'Đánh giá thành công', '');
      } else {
        alert('Có lỗi khi thêm đánh giá');
      }
    } catch (error) {
      notificationWithIcon('error', 'Có lỗi khi thêm đánh giá', 'Vui lòng thử lại sau.');
    }
  
    // Đóng modal sau khi gửi đánh giá
    handleClose();
  };
  // Kiểm tra dữ liệu scheduleData
  if (!scheduleData || !Array.isArray(scheduleData)) {
    return <div className="text-danger">Không có thông tin vé để hiển thị.</div>;
  }


  const busType = scheduleData[0] || 'Không có thông tin loại ghế';
  const fromStation = scheduleData[6] || 'Không có thông tin bến xe đi';
  const toStation = scheduleData[7] || 'Không có thông tin bến xe đến';
  const departureTime = scheduleData[1] ? formatTimestamp(scheduleData[1]) : 'Không có thông tin giờ đi';
  const price = formatPrice(scheduleData[3]);
  const seatNum = scheduleData[4] || 'Không có thông tin chỗ';
  const ticketId = scheduleData[9] || 'Không có mã vé';
  const feedback = scheduleData[10] ;

  return (
    <div className="container m-0 p-0 w-50">
      <div className="card mb-3 shadow-sm">
        <div className="row g-0">
          <div className="col-md-3 position-relative">
            <img
              src="https://media.istockphoto.com/id/1470218079/vector/completed-green-badge-label-of-mission-completed-isolated-on-white-flat-badge-banner-with.jpg?s=612x612&w=0&k=20&c=l4jcdcI_hgiRiPHVj3BeqPpSAn_cfTr-1YXdBISNq_Y="
              className="img-fluid"
              alt="Bus"
              style={{
                width: "90%",
                height: "100%",
                objectFit: "contain",
                marginLeft: "5px",
              }}
            />
          </div>
          <div className="col-md-6">
            <div className="card-body">
              <strong className="card-title mb-1 fs-4" style={{ color: 'red' }}>
                Nhà Xe Phương Trang
              </strong>
              <p className="text-muted mb-1">{busType}</p>
              <p className="mb-1">
                <span>Từ: </span><strong className='fs-5'>{fromStation}</strong>
              </p>
              <p className='mb-0'>
                <span>Đến: </span><strong className='fs-5'>{toStation}</strong>
              </p>
              <p className="text-muted mb-0">
                Thời gian khởi hành: <span className='fw-bold'>{departureTime}</span>
              </p>
            </div>
          </div>
          <div className="col-md-3 text-center d-flex flex-column justify-content-center align-items-center">
            <h4 className="text-primary fw-bold mb-0">{price}</h4>
            <strong className="text-muted mb-1">Mã ghế: {seatNum}</strong>
            <strong className="mb-1">Mã vé: {ticketId}</strong>
            <>
              {feedbackValue === 0 ? (
                <button className="btn btn-primary mt-2" onClick={handleShow}>Đánh giá</button>
              ) : feedbackValue === 1 ? (
                <strong style={{ color: 'green' }} className="mb-1">Bạn đã đánh giá</strong>
              ) : null}
            </>
                   
          </div>
        </div>
      </div>
    {/* Modal đánh giá */}
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Đánh Giá Chuyến Đi</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    <input
                      type="radio"
                      id={`star${star}`}
                      name="rating"
                      value={star}
                      onChange={() => setRating(star)}
                      style={{ display: 'none' }} // Ẩn input
                    />
                    <label
                      htmlFor={`star${star}`}
                      className={`star ${rating >= star ? 'filled' : ''}`}
                      onClick={() => setRating(star)} // Khi click vào label thì sẽ cập nhật rating
                    >
                      <i className={`fas fa-star ${rating >= star ? 'filled' : ''}`}></i> {/* Sử dụng biểu tượng sao */}
                    </label>
                  </span>
                ))}
              </div>
              <div className="mt-3">
                <textarea
                  id="feedback"
                  rows="3"
                  className="form-control"
                  placeholder="Nhập ý kiến của bạn tại đây..."
                  value={feedbackcontent}
                  onChange={(e) => setFeedback(e.target.value)} // Cập nhật giá trị feedback khi người dùng nhập
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Đóng</Button>
              <Button variant="primary" onClick={handleRatingSubmit}>Gửi Đánh Giá</Button>
            </Modal.Footer>
          </Modal>
  </div>
  );
};

export default HistoryScheduleItem;
