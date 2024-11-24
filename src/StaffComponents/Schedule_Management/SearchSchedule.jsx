import React, { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css'; // Make sure this import is included
import { width } from '@fortawesome/free-brands-svg-icons/fa42Group';

const SearchFilter = ({ onFilter }) => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');

    const handleFilterChange = () => {
        onFilter({ from, to, departureTime, arrivalTime });
    };

    return (
        <div className="mb-4">
            <h5 className="mb-3">Tìm Kiếm</h5>
            <div className="d-flex align-items-end">
                <div className="col-md-3" style={{width: '23%', marginRight: '0.5em'}}>
                    <label className="form-label">Điểm Đi</label>
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Từ"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        style={{ height: '38px' }}
                    />
                </div>
                <div className="col-md-3" style={{width: '23%', marginRight: '0.5em'}}>
                    <label className="form-label">Điểm Đến</label>
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Đến"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        style={{ height: '38px'}}
                    />
                </div>
                <div className="col-md-3" style={{width: '23%', marginRight: '0.5em'}}>
                    <label className="form-label">Khởi Hành Lúc</label>
                    <input
                        type="datetime-local"
                        className="form-control me-2"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        style={{ height: '38px'}}
                    />
                </div>
                <div className="col-md-3" style={{width: '23%', marginRight: '0.5em'}}>
                    <label className="form-label">Dự Kiến Đến</label>
                    <input
                        type="datetime-local"
                        className="form-control me-2"
                        value={arrivalTime}
                        onChange={(e) => setArrivalTime(e.target.value)}
                        style={{ height: '38px' }}
                    />
                </div>
                <div>
                    <button
                        className="btn btn-primary d-flex align-items-center justify-content-center"
                        onClick={handleFilterChange}
                        style={{ height: '38px', width: '40px' }} // Thêm width để đảm bảo căn chỉnh
                    >
                        <i className="fa fa-search"></i>
                    </button>
                </div>
            </div>
        </div>

    );
};

export default SearchFilter;
