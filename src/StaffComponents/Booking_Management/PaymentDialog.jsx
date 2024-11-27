import React, { useState } from 'react';
import notificationWithIcon from '../../Components/Utils/notification';
import axios from 'axios';
import { useBooking } from '../../Context/BookingContex';

const PaymentDialog = ({ booking, onClose }) => {
    const [selectedMethod, setSelectedMethod] = useState(null); // Phương thức thanh toán
    const [cashAmount, setCashAmount] = useState(''); // Số tiền nếu chọn Cash
    const [cashReturn, setCashReturn] = useState(0); // Số tiền trả lại
    const {setLoader } = useBooking();

    if (!booking) return null;

    const handleMethodSelect = (method) => {
        setSelectedMethod(method);
        if (method !== 'cash') setCashAmount(''); 
    };

    const handleConfirm = () => {
        if (selectedMethod === 'cash' && !cashAmount) {
            notificationWithIcon('info', 'Lưu Ý', 'Vui lòng nhập số tiền thanh toán');
            return;
        }
        if (selectedMethod === 'momo' || selectedMethod === 'vnpay') {
            return; // de tam
        }
        if (cashAmount < booking.schedule.price) {
            notificationWithIcon('info', 'Lưu Ý', 'Số tiền thanh toán không đủ');
            return;
        }
        payment();
    };
    const payment = async () => {
        await axios.post('http://localhost:8080/api/payment', {
            bookingId: booking.bookingId,
            method: selectedMethod,
            amount: cashAmount,
        }).then((res) => {
            if (res.status === 200) {
                notificationWithIcon('success', 'Thành Công', 'Thanh toán thành công');
                setLoader(1);
                onClose();
            }
        }).catch((error) => {
            notificationWithIcon('error', 'Lỗi', 'Thanh toán thất bại');
        });
    };

    const handleCashAmountChange = (e) => {
        setCashAmount(e.target.value);
        if (e.target.value - booking.schedule.price < 0) {
            setCashReturn(0);
        }
        else{
            setCashReturn(e.target.value - booking.schedule.price);
        }
    }

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thanh Toán Vé</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p><strong>Tên Khách Hàng:</strong> {booking.customerName}</p>
                        <p><strong>Số Điện Thoại:</strong> {booking.phone}</p>
                        <p><strong>Số Tiền Cần Thanh Toán:</strong> {booking.schedule.price.toLocaleString()} VND</p>

                        <h6>Chọn Phương Thức Thanh Toán:</h6>
                        <div className="btn-group" role="group" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button
                                className={`btn ${selectedMethod === 'cash' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => handleMethodSelect('cash')}
                            >
                                Tiền Mặt
                            </button>
                            <button
                                className={`btn ${selectedMethod === 'momo' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => handleMethodSelect('momo')}
                            >
                                Momo
                            </button>
                            <button
                                className={`btn ${selectedMethod === 'vnpay' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => handleMethodSelect('vnpay')}
                            >
                                VNPay
                            </button>
                        </div>

                        {selectedMethod === 'cash' && (
                            <div className="mt-3">
                                <label>Nhập Số Tiền:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={cashAmount}
                                    onChange={(e) => handleCashAmountChange(e)}
                                    placeholder="Nhập số tiền thanh toán"
                                />
                                <label style={{marginTop: '0.5em'}}>Số Tiền Trả Lại:</label>
                                <input type="text" 
                                    className='form-control'
                                    value={cashReturn.toLocaleString()+" VND"}
                                    disabled 
                                    style={{backgroundColor: '#f8f9fa', color: 'red'}}
                                    />
                            </div>
                        )}

                        {(selectedMethod === 'momo' || selectedMethod === 'vnpay') && (
                            <div className="mt-3">
                                <p><strong>Số Tài Khoản:</strong> 123456789</p>
                                <p><strong>Ngân Hàng:</strong> Vietcombank</p>
                                <p><strong>Mã QR:</strong></p>
                                <img src="/path/to/qr-code.png" alt="QR Code" style={{ width: '150px' }} />
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button className="btn btn-primary" onClick={handleConfirm} disabled={!selectedMethod}>
                            Xác Nhận
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentDialog;
