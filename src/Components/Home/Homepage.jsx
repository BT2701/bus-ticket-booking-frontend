import SearchInput from "../Search/SearchInput";
import PopularLine1 from "./PopularLine1";
import PopularLine from "./PopularLine";
import React, { useEffect, useState } from 'react'; // Make sure to import useState
import { Link } from "react-router-dom";
import axios from 'axios';

const Homepage = () => {
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        // Make the GET request to the Spring Boot API
        const response = await axios.get('http://localhost:8080/api/most-popular-route');
        // Set the response data to the routes state
        setRoutes(response.data);
        console.log('Fetched routes data:', response.data);
      } catch (error) {
        // Handle error
        setError('Error fetching routes');
        console.error(error);
      }
    };

    fetchRoutes();
  }, []);
  return (
    <div>
      <div className="row" style={{ position: "relative" }}>
        <img style={{ height: "450px", width: "100%", objectFit: "cover" }} src="https://yaatrisewa.com/yaatrisewa/slider/images/site/online-bus-ticket-booking-yaatri-sewa-travels-01.jpg" alt="" />
        <div className="col-md-6" style={{ position: "absolute", top: "0", bottom: "0",display:"flex",justifyContent:"center",alignItems:"center"}}>
          <div style={{width:"500px",height:"300px",color:"#fff"}}>
            <p style={{fontSize:"50px"}}>Giới thiệu về chúng tôi</p>
            <p style={{fontSize:"20px"}}>Về cơ bản chúng tôi cung cấp dịch vụ di chuyển cho khách hàng, với độ uy tín hàng đầu Việt Nam</p>
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
        <div className="row">
          {error && <p>{error}</p>}
          {routes.map((route) => (
            <PopularLine route={route} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Homepage;
