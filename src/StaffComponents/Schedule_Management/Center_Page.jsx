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
          <div className="navbar-nav">
            <button
              className={`nav-link ${activePage === 'schedule' ? 'active' : ''}`}
              onClick={() => handleNavigation('schedule')}
              style={{
                backgroundColor: activePage === 'schedule' ? '#6c757d' : 'transparent',
                color: activePage === 'schedule' ? '#fff' : 'inherit',
                border: activePage === 'schedule' ? '1px solid #6c757d' : 'none',
                clipPath: 'polygon(0 0, 90% 0, 100% 100%, 0% 100%)',
              }}
              onMouseEnter={(e) => {
                if (activePage !== 'schedule') {
                  e.target.style.backgroundColor = '#007bff';
                  e.target.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (activePage !== 'schedule') {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'inherit';
                }
              }
            }
            >
              Quản Lý Lịch Trình
            </button>
            <button
              className={`nav-link ${activePage === 'route' ? 'active' : ''}`}
              onClick={() => handleNavigation('route')}
              style={{
                backgroundColor: activePage === 'route' ? '#6c757d' : 'transparent',
                color: activePage === 'route' ? '#fff' : 'inherit',
                border: activePage === 'route' ? '1px solid #6c757d' : 'none',
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 10% 100%)',
              }}
              onMouseEnter={(e) => {
                if (activePage !== 'route') {
                e.target.style.backgroundColor = '#007bff';
                e.target.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (activePage !== 'route') {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'inherit';
                }
              }}
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
