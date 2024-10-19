import React from 'react';

const BusRouteTable = ({ routes }) => {
  const formatDuration = (duration) => {
    if (!duration) {
      return 'Chưa có dữ liệu'; // Hoặc giá trị mặc định khác bạn muốn hiển thị
    }
    
    // Tách chuỗi thời gian thành giờ, phút và giây
    const [hours, minutes] = duration.split(':');
    return `${parseInt(hours)} giờ ${parseInt(minutes)} phút`;
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  const handleFindTrip = (from, to) => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Chuyển đổi thành định dạng YYYY-MM-DD
    const url = `schedule?pickup=${encodeURIComponent(from)}&dropoff=${encodeURIComponent(to)}&departureDate=${formattedDate}`;
    window.location.href = url; // Điều hướng đến URL mới
  };
  return (
        routes.length > 0 ? (
        routes.map((route, index) => (
          <tr key={index}>
            <td>{route.from} ⇒ {route.to}</td>
            <td>{route.busType}</td>
            <td>{route.distance} km</td>
            <td>{formatDuration(route.duration)}</td>
            <td>{formatPrice(route.price)}</td>
            <td>
              <button 
                className="btn btn-light text-danger" 
                onClick={() => handleFindTrip(route.adressFrom, route.adressTo)} // route[4] là 'from', route[5] là 'to'
              >
                Tìm chuyến xe
              </button>        
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="text-center">Không có dữ liệu tuyến xe.</td>
        </tr>
      )
  );
};

export default BusRouteTable;
