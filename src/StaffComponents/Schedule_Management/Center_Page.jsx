import React, { useState } from 'react';
import ScheduleManagement from './Schedule_Management';
import RouteManagement from './Route_Management';

const CenterPage = () => {
  // State để theo dõi trang hiện tại
  const [activePage, setActivePage] = useState('schedule'); // Mặc định là 'schedule'

  const handleNavigation = (page) => {
    setActivePage(page);
  };

  return (
    <div className="center-page">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <span className="navbar-brand">Trang Quản Lý</span>
          <div className="navbar-nav">
            <button
              className={`nav-link ${activePage === 'schedule' ? 'active' : ''}`}
              onClick={() => handleNavigation('schedule')}
            >
              Quản Lý Lịch Trình
            </button>
            <button
              className={`nav-link ${activePage === 'route' ? 'active' : ''}`}
              onClick={() => handleNavigation('route')}
            >
              Quản Lý Tuyến Đường
            </button>
          </div>
        </div>
      </nav>

      {/* Dựa trên activePage để hiển thị trang tương ứng */}
      {activePage === 'schedule' && <ScheduleManagement />}
      {activePage === 'route' && <RouteManagement />}
    </div>
  );
};

export default CenterPage;
