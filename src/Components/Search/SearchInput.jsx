import React, { useState, useEffect } from 'react'; // Import useState và useEffect
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons"; // Import the solid icons
import { fetchUniqueRoutes } from './HandleSearch'; // Import hàm fetch dữ liệu

const SearchInput = ({  handleSearch }) => { // Nhận handleSearch từ component cha
  const [fromLocations, setFromLocations] = useState([]); // Tách mảng 'from'
  const [toLocations, setToLocations] = useState([]); // Tách mảng 'to'
  const [pickup, setPickup] = useState('0');
  const [dropoff, setDropoff] = useState('0');
  const [departureDate, setDepartureDate] = useState('2024-09-25');

  // Hàm xử lý form submit
  const handleFormSubmit = (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    // Xây dựng query string từ các tham số
    const searchParams = new URLSearchParams({
      pickup,
      dropoff,
      departureDate,
    }).toString();

    // Cập nhật URL với query string mới
    window.history.pushState(null, '', `?${searchParams}`);
    
    // Gọi hàm handleSearch để thực hiện tìm kiếm
    handleSearch(); 
  };

  useEffect(() => {
    const getRoutes = async () => {
      const data = await fetchUniqueRoutes(); // Gọi hàm để fetch dữ liệu

      // Kiểm tra nếu data là đối tượng và có các trường 'from' và 'to'
      if (data && data.from && data.to) {
        setFromLocations(data.from); // Lưu địa điểm 'from' vào state
        setToLocations(data.to); // Lưu địa điểm 'to' vào state
      } else {
        console.error("Data is not in the expected format:", data); // Log lỗi nếu không đúng định dạng
      }
    };

    getRoutes(); // Gọi hàm này khi component mount

    // Lấy giá trị từ URL params
    const params = new URLSearchParams(window.location.search);
    const pickupParam = params.get('pickup');
    const dropoffParam = params.get('dropoff');
    const departureDateParam = params.get('departureDate');

    // Cập nhật state với giá trị từ params nếu có
    if (pickupParam) setPickup(pickupParam);
    if (dropoffParam) setDropoff(dropoffParam);
    // Kiểm tra và đặt giá trị departureDate
    if (departureDateParam) {
      setDepartureDate(departureDateParam);
    } else {
      // Đặt ngày mặc định là hôm nay + 1 ngày
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1); // Cộng thêm 1 ngày
      const formattedDate = tomorrow.toISOString().split('T')[0]; // Chuyển đổi sang định dạng YYYY-MM-DD
      setDepartureDate(formattedDate);
    }

  }, []); // [] nghĩa là chỉ gọi 1 lần khi component mount

  // Lấy ngày hiện tại và định dạng
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0]; // Định dạng yyyy-mm-dd

  return (
    <div className="find-container d-flex justify-content-center">
      <div className="m-3 shadow rounded container">
        <div className='d-flex justify-content-center'>
          <strong className='fs-2' style={{ color: '#1E90FF ' }}>Tìm Kiếm Tuyến Xe</strong>
        </div>
        
        <form onSubmit={handleFormSubmit}> {/* Thêm onSubmit cho form */}
          <div className="align-items-center d-flex justify-content-center">
            {/* Pickup Location */}
            <div className="col-md-2 d-flex align-items-center border m-4">
              <img
                src="https://229a2c9fe669f7b.cmccloud.com.vn/svgIcon/pickup_vex_blue_24dp.svg"
                width="24"
                height="24"
                alt=""
              />
              <select
                name="pickup"
                id="pickup"
                className="form-control border-0"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
              >
                <option value="0">Chọn Điểm Đi</option>
                {fromLocations.map((location, index) => ( // Sử dụng mảng 'fromLocations'
                  <option key={index} value={location}>
                    {location} {/* Hiển thị điểm đón */}
                  </option>
                ))}
              </select>
            </div>

            {/* Switch Icon */}
            <div>
              <FontAwesomeIcon icon={faArrowRight} style={{ color: 'deepskyblue', fontSize: '24px' }} />
            </div>

            {/* Dropoff Location */}
            <div className="col-md-2 d-flex align-items-center border m-4">
              <img
                src="https://229a2c9fe669f7b.cmccloud.com.vn/svgIcon/dropoff_new_24dp.svg"
                width="24"
                height="24"
                alt=""
              />
                <select
                name="dropoff"
                id="dropoff"
                className="form-control border-0"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
              >
                <option value="0">Chọn Điểm Đến</option>
                {toLocations.map((location, index) => ( // Sử dụng mảng 'toLocations'
                  <option key={index} value={location}>
                    {location} {/* Hiển thị điểm trả */}
                  </option>
                ))}
              </select>
            </div>

            {/* Departure Date */}
            <div className="col-md-2 d-flex border m-4">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faCalendarDays} />
              </span>
              <input
                type="date"
                className="form-control border-0"
                id="departureDate"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={formattedToday} // Thiết lập min là ngày hiện tại
              />
            </div>  
            <button type="submit" className="btn btn-primary ">Tìm </button> {/* Đặt type là submit */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchInput;
