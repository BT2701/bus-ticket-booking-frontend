import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Modal from 'react-modal';
import './InfoTicket.css'; // Nhập file CSS
import { cancelTicket } from './ticketUtils'; // Import hàm fetch dữ liệu
import notificationWithIcon from '../Utils/notification'; // Nhập hàm thông báo

// Thiết lập modal cho React
Modal.setAppElement('#root');

const InfoTicket = ({ TicketData }) => { 
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [TicketStatus, setTicketStatus] = useState(TicketData[8]); // Khởi tạo state với trạng thái ban đầu
  
  const getStatusColor = (status) => {
    switch (status) {
      case 1: return 'text-success'; // Chưa sử dụng
      case 2: return 'text-warning'; // Đã sử dụng
      case 3: return 'text-danger'; // Đã hủy
      default: return 'text-muted'; // Trạng thái không xác định
    }
  };

  
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const formattedTime = date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const formattedDate = `(${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()})`; // Thêm năm vào đây
  return `${formattedTime} ${formattedDate}`;
};


// Hàm định dạng giá tiền
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price);
};

  const handleCancelClick = async (ticketId) => {
    // Xác nhận trước khi hủy vé
    const confirmed = window.confirm('Bạn có chắc chắn muốn hủy vé này?');
  
    if (confirmed) {
      const response = await cancelTicket(ticketId); // ID của yêu cầu đang được chọn
  
      if (response === true) {
        setTicketStatus(3);
        notificationWithIcon('success', 'Hủy vé thành công', '');
        // Xử lý giao diện sau khi hủy thành công
      } else {
        notificationWithIcon('error', 'Có lỗi xảy ra trong quá trình hủy vé', '');
      }
    } else {
      // Nếu người dùng không xác nhận, không làm gì cả
      notificationWithIcon('info', 'Đã hủy quá trình hủy vé', ''); // Thông báo tùy chọn nếu cần
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (!TicketData || !Array.isArray(TicketData) || TicketData.length < 9) {
    return <div className="text-danger">Không có thông tin vé để hiển thị.</div>;
  }

  // Tính toán thời gian hiện tại và thời gian vé khởi hành
  const currentTime = new Date().getTime();
  const ticketTime = TicketData[1]; // Giả sử TicketData[1] là timestamp

  // Kiểm tra điều kiện hiển thị nút Hủy
  const showCancelButton = (TicketStatus == 1 && ticketTime - currentTime < 12 * 60 * 60 * 1000); // Vé chưa sử dụng và cách giờ hiện tại dưới 12 tiếng


  return (
    <div className="container m-0 p-0 w-50">
      <div className="card mb-3 shadow-sm">
        <div className="row g-0">
          <div className="col-md-3 position-relative">
            <img
              src="https://media.istockphoto.com/id/1293064741/vector/ticket-vector-icon.jpg?s=612x612&w=0&k=20&c=8QDWEKhTj-38jB8aBYGiyhWXoHR9uy8x39Nojaowhvo="
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
              <p className="text-muted mb-1">{TicketData[0] ? TicketData[0] : 'Không có thông tin loại ghế'}</p>
              <p className="mb-1">
                <p><span>Từ: </span><strong className='fs-5'>{TicketData[6] ? TicketData[6] : 'Không có thông tin bến xe đi'}</strong></p>
                <p className='mb-0'><span>Đến: </span><strong className='fs-5'>{TicketData[7] ? TicketData[7] : 'Không có thông tin bến xe đến'}</strong></p>
                <p className="text-muted mb-0">Thời gian khởi hành: 
                    <span className='fw-bold'> {TicketData[1] ? formatTimestamp(TicketData[1]) : 'Không có thông tin giờ đi'}</span>
                </p>
              </p>
            </div>
          </div>
          <div className="col-md-3 text-center d-flex flex-column justify-content-center align-items-center">
            <h4 className="text-primary fw-bold mb-0">
              {TicketData[3] ? formatPrice(TicketData[3]) : 'Giá vé chưa có'}
            </h4>
            <strong className="text-muted mb-1">Mã ghế: {TicketData[4] ? TicketData[4] : 'Không có thông tin chỗ'}</strong>
            <strong className=" mb-1">Mã vé: {TicketData[9]}</strong> {/* Hiển thị mã vé */}
            <div onClick={openModal} style={{ cursor: 'pointer' }}>
              <QRCodeCanvas value={"TicketID:"+TicketData[9]} size={76} /> {/* Tạo mã QR cho mã vé */}
            </div>

            <>
              {TicketStatus === 1 ? (
                <strong className={`text-success fs-5`}>Chưa sử dụng</strong>
              ) : TicketStatus === 2 ? (
                <strong className={`text-warning fs-5`}>Đã sử dụng</strong>
              ) : TicketStatus === 3 ? (
                <strong className={`text-danger fs-5`}>Đã hủy</strong>
              ) : (
                <strong className={`text-muted fs-5`}>Trạng thái không xác định</strong>
              )}
            </>
            {/* Hiển thị nút Hủy nếu điều kiện đúng */}
            {showCancelButton && (
              <button className="btn btn-link btn-link-red"
              onClick={() => handleCancelClick(TicketData[9])}
              >
                Cancel Ticket
              </button>
            )}
          </div>
        </div>
      </div>

     {/* Modal hiển thị mã QR lớn */}
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Mã QR"
      className="Modal"
      overlayClassName="Overlay"
    >
      <div className="qr-container"> {/* Thêm div bao quanh mã QR */}
        <QRCodeCanvas value={"TicketID:"+TicketData[9]} size={396} /> {/* QR cho mã vé */}
      </div>
    </Modal>

    </div>
  );
};

export default InfoTicket;
