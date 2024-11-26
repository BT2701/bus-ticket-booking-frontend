import React, { useState } from 'react';

const SearchFilterBooking = ({ onFilter }) => {
    const [filters, setFilters] = useState({
        customerName: '',
        phoneNumber: '',
        bookingTime: '',
        status: '',
        from: '',
        to: '',
        departureTime: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    const handleReset = () => {
        setFilters({
            customerName: '',
            phoneNumber: '',
            bookingTime: '',
            status: '',
            from: '',
            to: '',
            departureTime: ''
        });
        onFilter({});
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3">
                <div className="col-md-3">
                    <label className="form-label">Tên Khách Hàng</label>
                    <input
                        type="text"
                        name="customerName"
                        className="form-control"
                        placeholder="Nhập tên khách hàng"
                        value={filters.customerName}
                        onChange={handleChange}
                        aria-label="Tên Khách Hàng"
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Số Điện Thoại</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        className="form-control"
                        placeholder="Nhập số điện thoại"
                        value={filters.phoneNumber}
                        onChange={handleChange}
                        aria-label="Số Điện Thoại"
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Thời Điểm Đặt</label>
                    <input
                        type="datetime-local"
                        name="bookingTime"
                        className="form-control"
                        value={filters.bookingTime}
                        onChange={handleChange}
                        aria-label="Thời Điểm Đặt"
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Trạng Thái</label>
                    <select
                        name="status"
                        className="form-select"
                        value={filters.status}
                        onChange={handleChange}
                        aria-label="Trạng Thái"
                    >
                        <option value="">Chọn trạng thái</option>
                        <option value="1">Đã thanh toán</option>
                        <option value="0">Chưa thanh toán</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label">Điểm Đi</label>
                    <input
                        type="text"
                        name="from"
                        className="form-control"
                        placeholder="Nhập điểm đi"
                        value={filters.from}
                        onChange={handleChange}
                        aria-label="Điểm Đi"
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Điểm Đến</label>
                    <input
                        type="text"
                        name="to"
                        className="form-control"
                        placeholder="Nhập điểm đến"
                        value={filters.to}
                        onChange={handleChange}
                        aria-label="Điểm Đến"
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Khởi Hành Lúc</label>
                    <input
                        type="datetime-local"
                        name="departureTime"
                        className="form-control"
                        value={filters.departureTime}
                        onChange={handleChange}
                        aria-label="Khởi Hành Lúc"
                    />
                </div>
                <div className="col-md-3 align-self-end d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary w-50 me-1">Tìm Kiếm</button>
                    <button type="button" className="btn btn-secondary w-50 ms-1" onClick={handleReset}>Reset</button>
                </div>
            </div>
        </form>
    );
};

export default SearchFilterBooking;
