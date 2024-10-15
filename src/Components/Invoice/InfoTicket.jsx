import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Modal from 'react-modal';
import './InfoTicket.css'; // Nhập file CSS


// Thiết lập modal cho React
Modal.setAppElement('#root');

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

const InfoTicket = ({ TicketData }) => { 
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (!TicketData || !Array.isArray(TicketData) || TicketData.length < 9) {
    return <div className="text-danger">Không có thông tin vé để hiển thị.</div>;
  }

  // Kiểm tra tình trạng vé dựa vào TicketData[8]
  let ticketStatus, ticketStatusColor;
  if (TicketData[8] === 1) {
    ticketStatus = 'Chưa sử dụng';
    ticketStatusColor = 'text-success';
  } else if (TicketData[8] === 2) {
    ticketStatus = 'Đã sử dụng';
    ticketStatusColor = 'text-danger';
  } else {
    ticketStatus = 'Trạng thái không xác định';
    ticketStatusColor = 'text-muted';
  }

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
            <strong className={`${ticketStatusColor} mb-1 fs-5`}>{ticketStatus}</strong> 
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
