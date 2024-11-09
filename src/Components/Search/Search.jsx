import React, { useEffect,useState } from 'react';
import NavSearch from "./NavSearch";
import CarriageWay from "./CarriageWay";
import SearchInput from "./SearchInput";
import BusRouteTable from "./BusRouteTable";
import { search,getAllRoutes } from './HandleSearch'; // Import hàm fetch dữ liệu
import { useFeedback } from "../../Context/FeedbackProvider";


const Search = () => {
  const { openFeedback, closeFeedback} = useFeedback();
  const [filtersExist, setFiltersExist] = useState(false);
  const [searchResults, setSearchResults] = useState({
    formattedResults: [],
    lowestPrice: null,
    highestPrice: null,
    busTypes: []
  }); 
  const [allRoutes, setAllRoutes] = useState([]); // Thêm state cho tất cả các tuyến đường
  const [isSearching, setIsSearching] = useState(null); // Trạng thái tìm kiếm

  const handleSearch = async (event) => {
    closeFeedback();
    setIsSearching(1);
    // Lấy giá trị từ URL params cho các filters
    const params = new URLSearchParams(window.location.search);
    const lowestPrice = params.get('lowestPrice') || undefined;
    const highestPrice = params.get('highestPrice') || undefined;
    const busTypes = params.get('busTypes') ? params.get('busTypes').split(',') : undefined;
    const sortParam = params.get('sort') || undefined;
    const pickup = params.get('pickup') || undefined;
    const dropoff = params.get('dropoff') || undefined;
    const departureDate = params.get('departureDate') || undefined;

    // Tạo đối tượng filters chỉ với các tham số có giá trị
    const filters = {
        ...(lowestPrice && { lowestPrice }),
        ...(highestPrice && { highestPrice }),
        ...(busTypes && { busTypes }),
        ...(sortParam && { sort: sortParam }),
    };
    // Gọi API để lấy dữ liệu tìm kiếm, truyền filters nếu có
    const results = await search(pickup, dropoff, departureDate, filters);

    if (results && results.length > 0) {
      let lowestPrice = Number.MAX_VALUE;
      let highestPrice = Number.MIN_VALUE;
      const busTypes = new Set();

      const formattedResults = results.map(result => {
        const departure = result[1];
        const price = result[3]?.price;
        busTypes.add(result[0]);

        if (price < lowestPrice) lowestPrice = price;
        if (price > highestPrice) highestPrice = price;


        return [
          result[0], // busType
          formatTimestamp(departure), // departure
          formatTimestamp(result[2]), // arrival
          formatPrice(price), // price
          result[4], // remainingSeats
          result[5], // duration
          result[6], // từ
          result[7], // đến
          result[8],//id schedule

        ];
      });

      const busTypesArray = Array.from(busTypes);
      // Cập nhật state với kết quả tìm kiếm
      setSearchResults({
        formattedResults,
        lowestPrice,
        highestPrice,
        busTypes: busTypesArray
      });
    } else {
      setSearchResults({
        formattedResults: [],
        lowestPrice: null,
        highestPrice: null,
        busTypes: []
      });
    }

  };
  // Hàm định dạng timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const formattedDate = `(${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')})`;
    return `${formattedTime} ${formattedDate}`;
  };

  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    // Kiểm tra các filters có tồn tại hay không
    const lowestPrice = searchParams.get('lowestPrice');
    const highestPrice = searchParams.get('highestPrice');
    const sort = searchParams.get('sort');
    const busTypes = searchParams.get('busTypes');

    if (lowestPrice || highestPrice  || busTypes||sort) {
      setFiltersExist(true);
    } else {
      setFiltersExist(false);
    }
  }, [window.location.search]);


  const fetchAllRoutes = async () => {
    try {
        const response = await getAllRoutes(); // Giả định bạn có hàm này để lấy dữ liệu
        const routes = response.map(route => ({
            busType: route[0],           // Tên loại xe
            price: route[3]?.price,             // Giá vé
            distance: route[1],          // Thời gian khởi hành (có thể chuyển đổi sang định dạng khác nếu cần)
            duration: route[2],          // Số ghế còn lại
            from: route[4],              // Điểm xuất phát
            to: route[5],                // Điểm đến
            adressFrom:route[6],
            adressTo:route[7]
        }));
        setAllRoutes(routes); // Cập nhật state với dữ liệu mới
    } catch (error) {
        console.error('Error fetching all routes:', error);
    }
};


  // Trong useEffect, gọi fetchAllRoutes
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    // Kiểm tra các filters có tồn tại hay không
    const lowestPrice = searchParams.get('lowestPrice');
    const highestPrice = searchParams.get('highestPrice');
    const sort = searchParams.get('sort');
    const busTypes = searchParams.get('busTypes');
    const pickup = searchParams.get('pickup');
    const dropoff = searchParams.get('dropoff');
    const departureDate = searchParams.get('departureDate');
    if (pickup && dropoff && departureDate) {
      handleSearch(); // Gọi hàm handleSearch nếu có đủ tham số
    }

    // Kiểm tra nếu có tham số tồn tại
    if (lowestPrice || highestPrice || busTypes || sort) {
        setFiltersExist(true);
    } else {
        setFiltersExist(false);
        // Kiểm tra nếu isFetchRoutes là giá trị mặc định (null) mới gọi fetchAllRoutes
        fetchAllRoutes(); // Gọi hàm fetchAllRoutes
    }
  }, []); // Chỉ chạy khi component mount lần đầu tiên

    

  return (
    <div>
      {/* Main form for bus ticket search */}
      <SearchInput handleSearch={handleSearch} />
      <div className="d-flex container p-0">
        <div>
        {(searchResults.formattedResults.length > 0 || filtersExist) ? (
            <NavSearch 
              lowestPrice={searchResults.lowestPrice}
              highestPrice={searchResults.highestPrice}
              busTypes={searchResults.busTypes}
              handleSearch={handleSearch}
            />
           ) : <p></p>}
        </div>
        <div className="flex-grow-1 ps-3">
          {searchResults.formattedResults.length > 0 ? (
            <>
              {searchResults.formattedResults?.map((result, index) => (
                <CarriageWay key={index} busData={result} />
              ))}
            </>
          ) : (
           (allRoutes.length > 0 && isSearching==null) ? (
              <div className="container mt-5">
              <h3 className="text-center mb-4">Thông tin các tuyến xe</h3>
              <table className="table table-bordered">
                <thead className="thead-light">
                  <tr>
                    <th>Tuyến xe</th>
                    <th>Loại xe</th>
                    <th>Quảng đường</th>
                    <th>Thời gian hành trình</th>
                    <th>Giá vé</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <BusRouteTable routes={allRoutes} />
                </tbody>
              </table>
              </div>
            ) : (
              <div className='d-flex justify-content-center'>
                <img
                  src="https://th.bing.com/th/id/OIG3.iP1aUpDvDQ8iy7k4zlXx?w=1024&h=1024&rs=1&pid=ImgDetMain"
                  className="img-fluid"
                  alt="Bus"
                  style={{
                    width: "70%",
                    height: "70%",
                    objectFit: "contain",
                  }} 
                />
              </div>
            )          
          )
        }
        </div>
      </div>
    </div>
  );
};

export default Search;
