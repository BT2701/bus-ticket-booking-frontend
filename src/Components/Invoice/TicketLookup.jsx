import React, { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import InfoTicket from "./InfoTicket"; // Nhập component InfoTicket
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"; // Import the solid icons
import { handlePhoneNumberChange, handleCaptchaChange, lookupTicket } from './ticketUtils';
import './InfoTicket.css'; // Nhập file CSS


const TicketLookup = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [ticketData, setTicketData] = useState(null); // State để lưu trữ dữ liệu vé
  const [status, setStatus] = useState('unused'); // Trạng thái mặc định

  // useEffect để đẩy số điện thoại lên URL query params khi phoneNumber thay đổi
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (phoneNumber && phoneNumber.length === 10) {
      params.set('phoneNumber', phoneNumber);
      params.set('status', status);
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [phoneNumber, status]);

  const handleSubmit = async (newStatus, e) => {
    e.preventDefault();

     // Kiểm tra số điện thoại trước khi gửi
    if (!/^0\d{9}$/.test(phoneNumber)) { // Kiểm tra số điện thoại
      alert('Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số.');
      return; // Ngưng thực hiện nếu số điện thoại không hợp lệ
    }

    // Kiểm tra ReCAPTCHA trước khi gửi
    if (!captchaValue) {
      alert('Vui lòng xác thực ReCAPTCHA.');
      return; // Ngưng thực hiện nếu chưa xác thực
    }

    setStatus(newStatus); // Cập nhật trạng thái

    // Gọi hàm tra cứu vé với status
    const ticketData = await lookupTicket(phoneNumber); // Truyền chỉ số điện thoại 

    if (ticketData && ticketData.length > 0) {
      setTicketData(ticketData); // Cập nhật dữ liệu vé
    } else {
      setTicketData(null); // Reset dữ liệu vé nếu không tìm thấy
      alert('Không tìm thấy thông tin vé.');
    }
  };
  // Theo dõi sự thay đổi của status
  useEffect(() => {
    const fetchData = async () => {
      if (phoneNumber.length === 10) { // Kiểm tra số điện thoại có 10 chữ số
        await handleSubmit(status, { preventDefault: () => {} }); // Gọi handleSubmit với status mới và một đối tượng sự kiện giả
      }
    };

    fetchData(); // Gọi hàm để tra cứu dữ liệu vé khi status thay đổi
  }, [status]); // Chỉ theo dõi status

  // Hàm xử lý sự kiện cho nút trở lại
  const handleBackClick = () => {
      window.location.href = 'http://localhost:3000/invoice?'; // Chuyển hướng đến URL mong muốn
  };


  return (
    <div>
      {/* Hiển thị thanh điều hướng chỉ khi có dữ liệu vé */}
      {ticketData && (
        <div className='d-flex justify-content-center'>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              {/* Icon mũi tên trở lại */}
              <a className="navbar-brand" href="#" onClick={handleBackClick}>
                <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'deepskyblue', fontSize: '24px' }} />
              </a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <a className={`nav-link ${status === 'all' ? 'selected' : ''}`} href="#" onClick={(e) => handleSubmit('all', e)}>Tất cả</a>
                  </li>
                  <li className="nav-item">
                    <a className={`nav-link ${status === 'unused' ? 'selected' : ''}`} href="#" onClick={(e) => handleSubmit('unused', e)}>Chưa sử dụng</a>
                  </li>
                  <li className="nav-item">
                    <a className={`nav-link ${status === 'used' ? 'selected' : ''}`} href="#" onClick={(e) => handleSubmit('used', e)}>Đã sử dụng</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Hiển thị InfoTicket nếu có dữ liệu, ngược lại hiển thị thông báo */}
      {ticketData ? (
        ticketData.map((ticket, index) => (
          <div className='d-flex justify-content-center' key={index}>
            <InfoTicket TicketData={ticket} />
          </div>
        ))
      ) : (
        <div className="container mt-5">
          <h3 className="text-center mb-4">TRA CỨU THÔNG TIN ĐẶT VÉ</h3>
          <form onSubmit={(e) => handleSubmit(status, e)}>
            <div className='d-flex justify-content-center'>
              <div className="form-group mb-3 w-25">
                <h5>Số điện thoại</h5>
                <input
                  type="text"
                  className="form-control"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange(setPhoneNumber)}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
            </div>

            {/* ReCAPTCHA */}
            <div className="d-flex justify-content-center mb-3">
              <ReCAPTCHA
                sitekey="6LcUw1AqAAAAAHwzyKYP7FHjISMipkPBHMvvUszv" // Thay bằng Site Key từ Google
                onChange={handleCaptchaChange(setCaptchaValue)}
              />
            </div>
            <div className='d-flex justify-content-center'>
              <button type="submit" className="btn btn-primary btn-block" style={{ width: "10%" }}>
                Tra cứu
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TicketLookup;
