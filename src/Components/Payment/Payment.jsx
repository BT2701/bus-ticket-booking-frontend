import {React, useEffect, useState} from 'react'
import momo from '../../Static/IMG/momo.png'
import vnpay from '../../Static/IMG/vnpay.png'
import money from '../../Static/IMG/money.png'
import { Button } from 'react-bootstrap';
import './Payment.css'
import { width } from '@fortawesome/free-brands-svg-icons/fa42Group';
import { colors } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Payment = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState({
    value: 'normal',
    label: 'Thanh toán tại quầy',
    icon: money,
  });

  const options = [
    { value: 'normal', label: 'Thanh toán tại quầy', icon:money },
    { value: 'momo', label: 'Momo', icon: momo },
    { value: 'vnpay', label: 'Vnpay', icon: vnpay },
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="payment-container">
      <div className="payment-left">
        <h4>Thông Tin Khách Hàng</h4>
        <div className="payment-left-information">
          <label htmlFor="payment-fullname">Họ và Tên:</label>
          <input type="text" id='payment-fullname' className='form-control' placeholder='Nguyen Van A'/>
        </div>
        <div className="payment-left-information">
          <label htmlFor="payment-email">Email:</label>
          <input type="email" id='payment-email' className='form-control' placeholder='nva123@gmail.com'/>
        </div>
        <div className="payment-left-information">
          <label htmlFor="payment-phone">Số Điện Thoại:</label>
          <input type="number" id='payment-phone' className='form-control' placeholder='03xxxxxxxx'/>
        </div>
        <div className="payment-left-information">
          <label htmlFor="payment-wallet">Phương Thức Thanh Toán:</label>
          <div className="custom-select-container form-control" style={{ position: 'relative', width: '250px' }}>
      <div className="custom-select-display" onClick={toggleDropdown} style={styles.selectDisplay}>
        {selected.icon && <img src={selected.icon} alt={selected.label} style={styles.icon} />}
        {selected.label}
        <span style={{ float: 'right' }}>▼</span>
      </div>
      {isOpen && (
        <div className="custom-select-options" style={styles.optionsContainer}>
          {options.map((option) => (
            <div
              key={option.value}
              className="custom-select-option"
              onClick={() => handleSelect(option)}
              style={styles.option}
            >
              {option.icon && <img src={option.icon} alt={option.label} style={styles.icon} />}
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
        </div>
      </div>
      <div className="payment-right">
        <div className="payment-booking-status">
          <div className="payment-booking-status-title">
            <h5>Trạng Thái Đặt Xe</h5>
          </div>
          <div className="payment-booking-status-infor">
            <div className="payment-booking-status-content">
              <label>Từ:</label> <span>Location1</span>
              <div className="payment-booking-status-line1"></div>
              <label>Đến:</label> <span>Location2</span>
            </div>
            <div className="payment-booking-status-content">
            <label>Xuất phát lúc:</label> <span>4:00AM</span>
              <div className="payment-booking-status-line2"></div>
              <label>Dự kiến đến:</label> <span>3:00PM</span>
            </div>
            <div className="payment-booking-status-content">
              <label>Số ghế đã đặt:</label><span>10</span>
            </div>
            <div className="payment-booking-status-content">
              <label>Tổng tiền:</label><span className='payment-total'>500000VND</span>
            </div>
          </div>
        </div>
        <Button className='btn btn-primary payment-btn'>Thanh Toán</Button>
      </div>
      <div className="payment-back">
        <Link to={'/schedule/detail'} className='btn btn-secondary'><FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '0.5em' }}/></Link>
      </div>
    </div>
  );
};

const styles = {
  selectDisplay: {
    padding: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    left: '0',
    width: '100%',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    zIndex: '1000',
  },
  option: {
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  icon: {
    marginRight: '10px',
    width: '20px',
    height: '20px',
  },
};
export default Payment