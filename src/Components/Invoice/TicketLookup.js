import { width } from '@fortawesome/free-brands-svg-icons/fa42Group';
import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
//npm install react-google-recaptcha


const TicketLookup = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ticketCode, setTicketCode] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleTicketCodeChange = (e) => {
    setTicketCode(e.target.value);
  };

  const handleCaptchaChange = (value) => {
    console.log('Captcha value:', value);
    setCaptchaValue(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!captchaValue) {
      alert('Please complete the CAPTCHA');
      return;
    }

    console.log('Tra cứu thông tin:', phoneNumber, ticketCode);
    // Xử lý logic tra cứu thông tin vé ở đây
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">TRA CỨU THÔNG TIN ĐẶT VÉ</h3>
      <form onSubmit={handleSubmit}>
        <div className='d-flex justify-content-center'>
          <div className="form-group mb-3 w-25">
            <h5>Số điện thoại</h5>
            <input
              type="text"
              className="form-control"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="Nhập số điện thoại"
              required
            />
          </div>
        </div>

        {/* ReCAPTCHA */}
        <div className="d-flex justify-content-center mb-3">
          <ReCAPTCHA
            sitekey="6LcUw1AqAAAAAHwzyKYP7FHjISMipkPBHMvvUszv" // Thay bằng Site Key từ Google
            onChange={handleCaptchaChange}
          />
        </div>

        <div className='d-flex justify-content-center'>
          <button type="submit" className="btn btn-primary btn-block "  style={{ width: "10%" }}>
            Tra cứu
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketLookup;
