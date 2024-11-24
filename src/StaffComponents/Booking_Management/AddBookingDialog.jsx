import axios from "axios";
import React, { useState, useEffect } from "react";
import formatTimeFromDatabase from "../../sharedComponents/formatTimeFromDatabase";
import ApiService from "../../Components/Utils/apiService";
import notificationWithIcon from "../../Components/Utils/notification";

const AddBookingDialog = ({ onClose }) => {
    const [phone, setPhone] = useState(""); // Số điện thoại
    const [userName, setUserName] = useState(""); // Tên người dùng
    const [email, setEmail] = useState(""); // Email
    const [selectedSchedule, setSelectedSchedule] = useState(""); // Lịch trình đã chọn
    const [route, setRoute] = useState(""); // Lộ trình
    const [departure, setDeparture] = useState(""); // Thời gian khởi hành
    const [seats, setSeats] = useState([]); // Danh sách ghế đã chọn
    const [schedules, setSchedules] = useState([]); // Danh sách lịch trình
    const [userExists, setUserExists] = useState(false); // Kiểm tra người dùng đã tồn tại
    const [seatOptions, setSeatOptions] = useState([]); // Các ghế có thể chọn
    const [seatCount, setSeatCount] = useState(0); // Số lượng ghế
    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        phone: ''
    });
    const [bookedSeats, setBookedSeats] = useState([]); // Danh sách ghế đã đặt

    useEffect(() => {
        fetchUserByPhone(phone);
    }, [phone]);
    useEffect(() => {
        fetchSchedules();
    }, []);
    useEffect(() => {
        const designSeats = () => {
            if (seatCount === 0) {
                return;
            }
            const half = Math.ceil(seatCount / 2);
            const firstHalf = Array.from({ length: half }, (_, i) => `A${i + 1}`);
            const secondHalf = Array.from({ length: seatCount - half }, (_, i) => `B${i + 1}`);
            const seats = [...firstHalf, ...secondHalf];
            setSeatOptions(seats);
        };
        designSeats();
    }, [seatCount]);
    useEffect(() => {
        if (selectedSchedule) {
            fetchBookedSeats(selectedSchedule);
        }
    }, [selectedSchedule]);
    const fetchBookedSeats = async (scheduleId) => {
        const response = await axios.get(`http://localhost:8080/api/booked-seats?scheduleId=${scheduleId}`);
        if (response.status === 200) {
            setBookedSeats(response.data);
        }
    };
    const fetchUserByPhone = async (phone) => {
        const response = await axios.get(`http://localhost:8080/api/user?phone=${phone}`);
        if (response.status === 200) {
            setEmail(response.data.email);
            setUserName(response.data.name);
        }
    };
    const fetchSchedules = async () => {
        const response = await axios.get(`http://localhost:8080/api/schedules`);
        if (response.status === 200) {
            setSchedules(response.data.schedules);
        }
    };


    const isBooked = (seat) => {
        return bookedSeats.includes(seat);
    };

    const handlePhoneChange = async (value) => {
        setPhone(value);

        if (value.length >= 10) { // Giả sử số điện thoại cần tối thiểu 10 ký tự
            const user = await fetchUserByPhone(value); // Hàm fetch từ server
            if (user) {
                setUserName(user.name);
                setEmail(user.email);
                setUserExists(true); // Người dùng đã tồn tại
            } else {
                setUserName("");
                setEmail("");
                setUserExists(false); // Người dùng chưa tồn tại
            }
        } else {
            setUserName("");
            setEmail("");
            setUserExists(false);
        }
    };

    const handleScheduleChange = (scheduleId) => {
        setSelectedSchedule(scheduleId);
        const schedule = schedules.find((s) => String(s.id) === String(scheduleId));
        if (schedule) {
            setRoute(`${schedule.route.from.name} - ${schedule.route.to.name}`);
            setDeparture(formatTimeFromDatabase(schedule?.departure));
            setSeatCount(schedule.bus.category.seat_count);
        }
    };

    const handleSeatToggle = (seat) => {
        setSeats((prevSeats) =>
            prevSeats.includes(seat)
                ? prevSeats.filter((s) => s !== seat)
                : [...prevSeats, seat]
        );
    };

    const handleAddBooking = () => {
        if (!phone || !userName || !email || !selectedSchedule || seats.length === 0) {
            notificationWithIcon('info', 'Thông Báo', 'Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        // Reset các lỗi trước khi kiểm tra
        setErrors({ fullName: '', email: '', phone: '' });

        let newErrors = {};
        // Kiểm tra các trường input
        if (!userName) newErrors.fullName = 'Vui lòng nhập họ và tên';

        // Kiểm tra định dạng email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!emailPattern.test(email)) {
            newErrors.email = 'Email không hợp lệ. Ví dụ đúng: example@gmail.com';
        }

        // Kiểm tra số điện thoại
        if (!phone) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (phone.length !== 10) {
            newErrors.phone = 'Số điện thoại phải có 10 số';
        }

        // Kiểm tra xem có lỗi hay không
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        const schedule = schedules.find((s) => String(s.id) === String(selectedSchedule));
        ApiService.post('/api/booking', {
            email: email,
            name: userName,
            phone: phone,
            schedule: schedule,
            seats: seats
        })
            .then(response => {
                console.log('Success:', response.data);
                notificationWithIcon('success', 'Booked', 'Đặt chỗ thành công!');
                onClose();
            })
            .catch(error => {
                console.error('Error:', error);
                notificationWithIcon('error', 'Fail', 'Đặt chỗ thất bại!');
            });
    };


    return (
        <div className="modal" style={{ display: "block" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thêm Mới Booking</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label>Số Điện Thoại:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={phone}
                                onChange={(e) => handlePhoneChange(e.target.value)}
                                placeholder="Nhập số điện thoại"
                            />
                            {errors.phone && <div className="error-message" style={{ color: 'red' }}>{errors.phone}</div>}

                        </div>
                        <div className="mb-3">
                            <label>Tên Người Dùng:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                disabled={userExists}
                                placeholder="Tên người dùng"
                            />
                            {errors.fullName && <div className="error-message" style={{ color: 'red' }}>{errors.fullName}</div>}

                        </div>
                        <div className="mb-3">
                            <label>Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={userExists}
                                placeholder="Email"
                            />
                            {errors.email && <div className="error-message" style={{ color: 'red' }}>{errors.email}</div>}

                        </div>
                        <div className="mb-3">
                            <label>Lịch Trình:</label>
                            <select
                                className="form-select"
                                value={selectedSchedule}
                                onChange={(e) => handleScheduleChange(e.target.value)}
                            >
                                <option value="">Chọn lịch trình</option>
                                {schedules.map((schedule) => (
                                    <option key={schedule.id} value={schedule.id}>
                                        {formatTimeFromDatabase(schedule?.departure)} - {schedule.route.from.name} - {schedule.route.to.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {route && (
                            <div className="mb-3">
                                <label>Lộ Trình:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={route}
                                    disabled
                                />
                            </div>
                        )}
                        {departure && (
                            <div className="mb-3">
                                <label>Khởi Hành Lúc:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={departure}
                                    disabled
                                />
                            </div>
                        )}
                        {seatOptions.length > 0 && (
                            <div className="mb-3">
                                <label>Chọn Ghế:</label>
                                <div className="d-flex flex-wrap">
                                    {seatOptions.map((seat) => (
                                        <div key={seat} className="form-check me-3">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id={`seat-${seat}`}
                                                checked={seats.includes(seat)}
                                                onChange={() => handleSeatToggle(seat)}
                                                disabled={isBooked(seat)}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={`seat-${seat}`}
                                                style={{ color: isBooked(seat) ? 'red' : 'black' }}
                                            >
                                                {seat}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <span style={{ color: 'red', fontStyle: 'italic' }}>*Những vị trí màu đỏ đã được đặt</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleAddBooking}
                            disabled={!selectedSchedule || seats.length === 0}
                        >
                            Thêm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBookingDialog;
