import React, { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css'; // Make sure this import is included

const SearchFilter = ({ onFilter }) => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [status, setStatus] = useState('');

    const handleFilterChange = () => {
        onFilter({ from, to, departureTime, status });
    };

    return (
        <div className="mb-4">
            <h5 className="mb-3">Tìm Kiếm</h5>
            <div className="d-flex">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Từ"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    style={{ height: '38px' }} // Standard height for all input fields
                />
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Đến"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    style={{ height: '38px' }} // Standard height for all input fields
                />
                <input
                    type="time"
                    className="form-control me-2"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    style={{ height: '38px' }} // Standard height for all input fields
                />
                <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ height: '38px' }} // Standard height for select element
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="Pending">Đang chờ</option>
                    <option value="Confirmed">Xác nhận</option>
                    <option value="Cancelled">Hủy</option>
                </select>
                <button className="btn btn-primary d-flex align-items-center justify-content-center" onClick={handleFilterChange} style={{ height: '38px' }}>
                    <i className="fa fa-search"></i>
                </button>            
            </div>
        </div>
    );
};

export default SearchFilter;
