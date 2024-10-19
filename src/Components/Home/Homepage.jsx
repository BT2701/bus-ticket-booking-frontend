import SearchInput from "../Search/SearchInput";
import PopularLine from "./PopularLine";
import React, { useEffect, useState } from 'react'; // Make sure to import useState
import { Link } from "react-router-dom";
import { faAnglesRight, faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ApiService from '../Utils/apiService';


const Homepage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const routesPerPage = 3;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? 0 : prevIndex - routesPerPage
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + routesPerPage >= routes.length
        ? prevIndex
        : prevIndex + routesPerPage
    );
  };

  const [limit, setLimit] = useState(3); // State for the limit
  const [routes, setRoutes] = useState([]); // State for storing the fetched routes
  const [error, setError] = useState(''); // State for storing errors
  useEffect(() => {
    const fetchRoutes = async () => {
      if (limit > 0) { // Ensure that limit is positive before making the request
        try {
          const response = await ApiService.get(`http://localhost:8080/api/most-popular-route/${limit}`);
          setRoutes(response);
        } catch (error) {
          setError('Error fetching routes');
          console.error(error);
        }
      }
    };

    fetchRoutes();
  }, [limit]); // The effect runs every time `limit` changes
  return (
    <div>
      <div className="row" style={{ position: "relative" }}>
        <img style={{ height: "450px", width: "100%", objectFit: "cover" }} src="https://yaatrisewa.com/yaatrisewa/slider/images/site/online-bus-ticket-booking-yaatri-sewa-travels-01.jpg" alt="" />
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
        <h2 className="text-center mt-5">Tìm Kiếm Tuyến Xe</h2>
        <SearchInput />
      </div>
      <div className="container p-0">
        <h2 className="section-title text-center my-5">Tuyến Phổ Biến</h2>
        <div class="mb-3 homepage-limit">
          <input
          className="homepage-btn--limit"
            type="number"
            onChange={(e) => setLimit(e.target.value)} // Update limit state on input change
            placeholder="Số lượng tuyến"
            min="1"
            max="10"
          />
          <p>*Xem thêm các tuyến phổ biến khác</p>
        </div>

        <div >

          <div className="row">
            {routes
              .slice(currentIndex, currentIndex + routesPerPage)
              .map((route) => (

                <PopularLine route={route} />

              ))}
          </div>



          {routes.length > routesPerPage && (
            <div className="slider-controls text-center">
              <button onClick={handlePrev} disabled={currentIndex === 0} className="border-0" style={{ width: "30px", height: "30px", marginRight: "6px" }}>
                <FontAwesomeIcon icon={faAnglesLeft} style={{ width: "30px", height: "30px" }} />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex + routesPerPage >= routes.length}
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
