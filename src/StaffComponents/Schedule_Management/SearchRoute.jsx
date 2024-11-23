// src/StaffComponents/SearchFilterRoute.jsx
import React, { useState } from 'react';

const SearchFilterRoute = ({ onFilter }) => {
    const [filterCriteria, setFilterCriteria] = useState({
        startPoint: '',
        endPoint: '',
        distance: ''
    });

    const handleChange = (e) => {
        setFilterCriteria({
            ...filterCriteria,
            [e.target.name]: e.target.value
        });
    };

    const handleFilter = () => {
        onFilter(filterCriteria);
    };

    const handleReset = () => {
        const resetCriteria = {
            startPoint: '',
            endPoint: '',
            distance: ''
        };
        setFilterCriteria(resetCriteria);
        onFilter(resetCriteria);  // Call onFilter with empty criteria to show all routes
    };

    return (
        <div className="mb-4">
            <div className="row">
                <div className="col">
                    <input
                        type="text"
                        name="startPoint"
                        className="form-control"
                        placeholder="Điểm Xuất Phát"
                        value={filterCriteria.startPoint}
                        onChange={handleChange}
                    />
                </div>
                <div className="col">
                    <input
                        type="text"
                        name="endPoint"
                        className="form-control"
                        placeholder="Điểm Đến"
                        value={filterCriteria.endPoint}
                        onChange={handleChange}
                    />
                </div>
                <div className="col">
                    <input
                        type="number"
                        name="distance"
                        className="form-control"
                        placeholder="Khoảng Cách"
                        value={filterCriteria.distance}
                        onChange={handleChange}
                    />
                </div>
                <div className="col d-flex align-items-center">
                    <button className="btn btn-primary me-2" onClick={handleFilter} style={{ height: '40px' }}>
                        Tìm Kiếm
                    </button>
                    <button className="btn btn-secondary" onClick={handleReset} style={{ height: '40px' }}>
                        Đặt Lại
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchFilterRoute;
