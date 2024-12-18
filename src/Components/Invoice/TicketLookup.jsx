import React, { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import InfoTicket from "./InfoTicket"; // Nhập component InfoTicket
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"; // Import the solid icons
import { handlePhoneNumberChange, handleCaptchaChange, lookupTicket } from './ticketUtils';
import './InfoTicket.css'; // Nhập file CSS
import notificationWithIcon from '../Utils/notification'; // Nhập hàm thông báo
import Pagination from '@mui/material/Pagination';

const TicketLookup = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [ticketData, setTicketData] = useState(null); // State để lưu trữ dữ liệu vé
  const [status, setStatus] = useState('unused'); // Trạng thái mặc định
  const [isSearching, setIsSearching] = useState(null); // Trạng thái tìm kiếm
  const [pageNum, setPageNum] = useState(1); 
  const [totalPages, setTotalPages] = useState(10);  // Tổng số trang
  const limit=5;

  const updateQueryParams = (e) => {
    e.preventDefault(); // Ngăn không cho form gửi theo cách thông thường
    if (!captchaValue) {
      notificationWithIcon('error', 'Vui lòng xác thực ReCAPTCHA.', '');
    }else{
      // Tạo đối tượng tham số URL
      const params = new URLSearchParams(window.location.search);
      if (phoneNumber && phoneNumber.length === 10) {
        params.set('phoneNumber', phoneNumber);
        params.set('status', status); // Sử dụng trạng thái hiện tại
        params.set('pageNum', pageNum); // Sử dụng trạng thái hiện tại
        params.set('limit', limit); // Sử dụng trạng thái hiện tại
    }
  
    // Thay đổi URL mà không làm mới trang
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  
    // Gọi hàm handleSubmit với status đã cập nhật
    handleSubmit(status, e);
    }
  };  

  const fetchData = async () => {
    if (phoneNumber.length === 10) { // Kiểm tra số điện thoại có 10 chữ số
      await handleSubmit(status, { preventDefault: () => {} }); // Gọi handleSubmit với status mới và một đối tượng sự kiện giả
    }
  };
  // Hàm xử lý sự kiện cho nút trở lại
  const handleBackClick = () => {
      window.location.href = 'http://localhost:3000/invoice?'; // Chuyển hướng đến URL mong muốn
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

  //hàm này được gọi khi tìm theo số điện thoại 
  const handleSubmit = async (newStatus, e) => {
    e.preventDefault();

    // Kiểm tra số điện thoại trước khi gửi
    if (!/^0\d{9}$/.test(phoneNumber)) { // Kiểm tra số điện thoại
      notificationWithIcon('error', 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số.', '');
      return; // Ngưng thực hiện nếu số điện thoại không hợp lệ
    }

    // Kiểm tra ReCAPTCHA trước khi gửi
    if (!captchaValue) {
      notificationWithIcon('error', 'Vui lòng xác thực ReCAPTCHA.', '');
      return; // Ngưng thực hiện nếu chưa xác thực
    }
    setStatus(newStatus); // Cập nhật trạng thái

    // Gọi hàm tra cứu vé với status
    const ticketData = await lookupTicket(phoneNumber); // Truyền chỉ số điện thoại 

    if (ticketData.data && ticketData.data.length > 0) {
      setTicketData(ticketData.data); // Cập nhật dữ liệu vé
      setTotalPages(ticketData.totalPages);
      setIsSearching(1); // Đặt trạng thái đã tìm kiếm
    } else {
      if(isSearching==null){
        notificationWithIcon('error', 'Không có thông tin', '');
      }
      setTicketData(null); // Reset dữ liệu vé nếu không tìm thấy
    }
  };

  useEffect(() => {
    if (phoneNumber && phoneNumber.length === 10) {
      // Tạo đối tượng URLSearchParams từ URL hiện tại
      const params = new URLSearchParams(window.location.search);

      // Cập nhật query string với pageNum mới
      params.set('pageNum', pageNum); // pageNum là state hoặc biến bạn đang theo dõi

      // Thay đổi URL mà không reload lại trang
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
      fetchData(); // Gọi hàm để tra cứu dữ liệu vé khi status thay đổi
      }
  }, [pageNum]);  // Chạy lại effect khi pageNum thay đổi

  // useEffect để đẩy số điện thoại lên URL query params khi phoneNumber thay đổi
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (phoneNumber && phoneNumber.length === 10) {
      params.set('phoneNumber', phoneNumber);
      params.set('status', status);
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    setPageNum(1);//set lại pageNum =1
    fetchData(); // Gọi hàm để tra cứu dữ liệu vé khi status thay đổi
  }, [status]);

  return (
    <div>
      {/* Hiển thị thanh điều hướng chỉ khi có dữ liệu vé */}
      {isSearching ?(
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
                </ul>
              </div>
            </div>
          </nav>
        </div>
      ):(
        <div className="container mt-5">
          <h3 className="text-center mb-4">TRA CỨU THÔNG TIN ĐẶT VÉ</h3>
          <form onSubmit={updateQueryParams}>
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

      {/* Hiển thị InfoTicket nếu có dữ liệu, ngược lại hiển thị thông báo */}
      
      {isSearching ? (
        ticketData ? (
          <>
            {ticketData?.map((ticket, index) => (
              <div className="d-flex justify-content-center" key={index}>
                <InfoTicket TicketData={ticket} />
              </div>
            ))}
            <div className="d-flex justify-content-center">
              {renderPagination()}
            </div>
          </>
        ) : (
          <div className='d-flex justify-content-center'>
            <h5>Không có thông tin vé</h5>
          </div>
        )
      ) : (
        <div></div>
      )}

    </div>
  );
};

export default TicketLookup;
