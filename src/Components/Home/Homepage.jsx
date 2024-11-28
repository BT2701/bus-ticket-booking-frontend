import SearchInput from "../Search/SearchInput";
import PopularLine from "./PopularLine";
import React, { useEffect, useState } from 'react'; // Make sure to import useState
import { Link } from "react-router-dom";
import { faAnglesRight, faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ApiService from '../Utils/apiService';


const Homepage = () => {
  //mặc định lần đầu tiên vào web thì số lượng trang là 1, trang ở đây là số lượng trang để hiển thị tuyến xe phổ biến 
  const [numberPage, setNumberPage] = useState(1);
  //Tại sao set trang hiện tại khi mới vào web là 0 mà không phải 1? Không phải số lượng trang lúc đầu là 1 sao?
  //Vì trong backend lấy dữ liệu có sử dụng offset để phân trang, JPA có hỗ trợ Pageable để thực hiện điều đó (trong RouteSV)
  //Và Pageable set trang bắt đầu = 0. 
  const [currentPage, setCurrenPage] = useState(0);
  //numberRoute là số lượng tuyến xe mà người dùng muốn xem 
  const [numberRoute, setNumberRoute] = useState(3);
  const routesPerPage = 3;
  const [routes, setRoutes] = useState([]); // State for storing the fetched routes
  const [error, setError] = useState(''); // State for storing errors
  const [isShow, setIsShow] = useState();
  const handlePrev = () => {
    setCurrenPage(prev => prev - 1);
  };
  const handleNext = () => {
    setCurrenPage(prev => prev + 1);
  };



  useEffect(() => {
    const fetchRoutes = async () => {
      if (numberRoute > 0) { // Ensure that limit is positive before making the request
        try {
          const response = await ApiService.get(`http://localhost:8080/api/routes/popular/${currentPage}/${numberRoute}`);
          setRoutes(Array.isArray(response.data) ? response.data : []);
          setNumberPage(Math.ceil(response.totalElements / routesPerPage));
        } catch (error) {
          setError('Error fetching routes');
          console.error(error);

        }
      }
      else {
        setRoutes([]);
        setCurrenPage(0);
        setNumberPage(0);
      }
    };
    fetchRoutes();
  }, [numberRoute, currentPage]); // The effect runs every time `limit` changes

  return (
    <div>
      <div className="row" style={{ position: "relative", margin: "0" }}>
        <img style={{ height: "450px", width: "100%", objectFit: "cover", padding: "0" }} src="https://yaatrisewa.com/yaatrisewa/slider/images/site/online-bus-ticket-booking-yaatri-sewa-travels-01.jpg" alt="" />
        <div className="col-md-6" style={{ position: "absolute", top: "0", bottom: "0", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: "500px", height: "300px", color: "#fff" }}>
            <p style={{ fontSize: "50px" }}>Giới thiệu về chúng tôi</p>
            <p style={{ fontSize: "20px" }}>Về cơ bản chúng tôi cung cấp dịch vụ di chuyển cho khách hàng, với độ uy tín hàng đầu Việt Nam</p>
            <Link to="/about" className="btn bg-color-primary" style={{ color: "#fff", fontWeight: "500", width: "122px" }}>Xem chi tiết</Link>
          </div>
        </div>
        <div className="col"></div>
      </div>
      <div>
        \        <SearchInput />
      </div>
      <div className="container p-0">
        <h2 className="section-title text-center my-5"></h2>
        <div className='d-flex justify-content-center'>
          <strong className='fs-2' style={{ color: '#1E90FF ' }}>Tuyến Phổ Biến</strong>
        </div>
        <div class="mb-3 homepage-limit">
          <input
            className="homepage-btn--limit"
            type="number"
            value={numberRoute}
            onChange={(e) => { setIsShow(Math.ceil(e.target.value / routesPerPage)); setNumberRoute(e.target.value) }} // Update limit state on input change
            placeholder="Số lượng tuyến"
            pattern="[3-10]*" name="cost"
          />
          <p>*Xem thêm các tuyến phổ biến khác</p>
        </div>

        <div >

          <div className="row">
            {routes
              .map((route) => (
                <PopularLine route={route} />
              ))}
          </div>



          {isShow > 1 && (
            <div className="slider-controls text-center">
              <button onClick={handlePrev} disabled={currentPage === 0} className="border-0" style={{ width: "30px", height: "30px", marginRight: "6px" }}>
                <FontAwesomeIcon icon={faAnglesLeft} style={{ width: "30px", height: "30px" }} />
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage >= numberPage - 1}
                className="border-0" style={{ width: "30px", height: "30px", marginLeft: "6px" }}>
                <FontAwesomeIcon icon={faAnglesRight} style={{ width: "30px", height: "30px" }} />
              </button>
            </div>
          )}
        </div>

      </div>
    </div >
  );
};
export default Homepage;
