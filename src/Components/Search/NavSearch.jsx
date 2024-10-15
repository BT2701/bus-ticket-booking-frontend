import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"; // Import the solid icons
import { useState, useEffect } from "react";
import './NavSearch.css'; // Nhập file CSS


function NavSearch({ lowestPrice, highestPrice, busTypes ,   handleSearch}) {

  const [isOpenCarType, setIsOpenCarType] = useState(false);
  const [isOpenTicketPrice, setIsOpenTicketPrice] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    lowestPrice: 0,
    highestPrice: 9999999,
    busTypes: [],
    sort: 'earliestDeparture' // Mặc định giờ đi từ sớm đến trế
  });

  // Cập nhật URL khi có sự thay đổi trong selectedFilters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search); // Lấy các tham số hiện tại

    // Cập nhật các tham số như trước
    if (selectedFilters.lowestPrice) {
      params.set('lowestPrice', selectedFilters.lowestPrice);
    } else {
      params.delete('lowestPrice'); // Nếu không có giá trị, xóa tham số
    }

    if (selectedFilters.highestPrice) {
      params.set('highestPrice', selectedFilters.highestPrice);
    } else {
      params.delete('highestPrice'); // Nếu không có giá trị, xóa tham số
    }

    if (selectedFilters.busTypes.length > 0) {
      params.set('busTypes', selectedFilters.busTypes.join(',')); // Cập nhật bus types
    } else {
      params.delete('busTypes'); // Nếu không có bus types, xóa tham số
    }

    // Cập nhật tham số sắp xếp
    if (selectedFilters.sort) {
      params.set('sort', selectedFilters.sort);
    } else {
      params.delete('sort');
    }

    // Cập nhật URL
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [selectedFilters]);

  // Hàm xử lý thay đổi giá trị input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Hàm xử lý thay đổi bus type
  const handleBusTypeChange = (type) => {
    setSelectedFilters((prevFilters) => {
      const busTypes = prevFilters.busTypes.includes(type)
        ? prevFilters.busTypes.filter(t => t !== type) // Nếu đã được chọn, bỏ chọn
        : [...prevFilters.busTypes, type]; // Ngược lại, thêm vào danh sách

      return { ...prevFilters, busTypes };
    });
  };

  // Hàm xử lý thay đổi sắp xếp
  const handleSortChange = (sortOption) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      sort: sortOption // Cập nhật trường sort
    }));
  };

  return (
    <div
      className="top-navbar-container d-block shadow"
      style={{ minHeight: "auto" }}
    >
      <div className="Larger shadow py-1">
        <div className="d-flex align-items-center justify-content-between">
          <strong className="m-2 fs-4">Sắp Xếp</strong>
          <p className="m-2 apply-button" onClick={handleSearch}>Áp dụng</p>
        </div>
        <div className="m-2">
          <span>
            <input 
                type="radio" 
                name="sort" 
                value="earliestDeparture" 
                checked={selectedFilters.sort === 'earliestDeparture'} 
                onChange={() => handleSortChange('earliestDeparture')} 
              />          </span>
          <label className="ps-1">Giờ đi sớm nhất</label>
        </div>
        <div className="m-2">
          <span>
            <input 
                type="radio" 
                name="sort" 
                value="latestDeparture" 
                checked={selectedFilters.sort === 'latestDeparture'} 
                onChange={() => handleSortChange('latestDeparture')} 
              />          </span>
          <label className="ps-1">Giờ đi muộn nhất</label>
        </div>
        <div className="m-2">
          <span>
            <input 
                type="radio" 
                name="sort" 
                value="priceAsc" 
                checked={selectedFilters.sort === 'priceAsc'} 
                onChange={() => handleSortChange('priceAsc')} 
              />          </span>
          <label className="ps-1">Giá tăng dần</label>
        </div>
        <div className="m-2">
          <span>
            <input 
                type="radio" 
                name="sort" 
                value="priceDesc" 
                checked={selectedFilters.sort === 'priceDesc'} 
                onChange={() => handleSortChange('priceDesc')} 
              />          </span>
          <label className="ps-1">Giá giảm dần</label>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 Larger shadow py-1" style={{ minWidth: "232px" }}>

        <div className="d-flex align-items-center justify-content-between">
          <strong className="m-2 fs-4">Lọc</strong>
          <p className="m-2 apply-button" onClick={handleSearch}>Áp dụng</p>
        </div>
        
        {/* Bus Type Filter */}
        <div>
          <div
            className="d-flex m-2"
            onClick={() => setIsOpenCarType(!isOpenCarType)}
          >
            <strong>Loại xe</strong>
            <p className="ms-auto">
              {isOpenCarType ? (
                <FontAwesomeIcon icon={faChevronUp} />
              ) : (
                <FontAwesomeIcon icon={faChevronDown} />
              )}
            </p>
          </div>
          {isOpenCarType && (
            <div>
              {busTypes.map((type, index) => (
                <div key={index} className="d-flex m-2 align-items-center">
                  <input 
                    type="checkbox" 
                    className="me-2" 
                    onChange={() => handleBusTypeChange(type)} // Thêm hàm xử lý
                    checked={selectedFilters.busTypes.includes(type)} // Đánh dấu checkbox nếu đã được chọn
                  />
                  <p className="mb-0">{type}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div>
          <div
            className="d-flex m-2"
            onClick={() => setIsOpenTicketPrice(!isOpenTicketPrice)}
          >
            <strong>Giá vé</strong>
            <p className="ms-auto">
              {isOpenTicketPrice ? (
                <FontAwesomeIcon icon={faChevronUp} />
              ) : (
                <FontAwesomeIcon icon={faChevronDown} />
              )}
            </p>
          </div>
          {isOpenTicketPrice && (
            <div>
              <div className="d-flex m-2 align-items-center">
                <p className="mb-0 w-25">Từ:</p>
                <div className="d-flex form-control border-0 align-items-center w-75 p-0">
                  <input
                    type="text"
                    name="lowestPrice"
                    value={selectedFilters.lowestPrice}
                    onChange={handleInputChange} // Thêm hàm xử lý
                    className="form-control me-2"
                  />
                  <p className="mb-0">đ</p>
                </div>
              </div>
              <div className="d-flex m-2 align-items-center">
                <p className="mb-0 w-25">Đến:</p>
                <div className="d-flex form-control border-0 align-items-center w-75 p-0">
                  <input
                    type="text"
                    name="highestPrice"
                    value={selectedFilters.highestPrice}
                    onChange={handleInputChange} // Thêm hàm xử lý
                    className="form-control me-2"
                  />
                  <p className="mb-0">đ</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavSearch;
