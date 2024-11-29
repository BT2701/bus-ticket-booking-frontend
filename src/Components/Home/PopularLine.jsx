import "./PopularLine.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faStar } from "@fortawesome/free-solid-svg-icons";
import formatCurrency from "../../sharedComponents/formatMoney";
import { useEffect } from "react";
const PopularLine = ({ route }) => {


  const handleFindTrip = (from, to) => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Chuyển đổi thành định dạng YYYY-MM-DD
    const url = `schedule?pickup=${encodeURIComponent(from)}&dropoff=${encodeURIComponent(to)}&departureDate=${formattedDate}`;
    window.location.href = url; // Điều hướng đến URL mới
  };
  return (
    <div className="col-md-4 mt-1-9" onClick={() => { handleFindTrip(route['fromAddress'], route['toAddress']) }} style={{ cursor: "pointer" }}>
      <div className="popularlineCard text-center">
        <img
          // src="https://i.pinimg.com/564x/be/d9/5f/bed95f67a0643a9dcd08b39554c52f0e.jpg"
          src={`http://localhost:8080/api/buses/img/${route['schedule']?.bus.img}` || "https://via.placeholder.com/150"}
          className="card-img-top"
          alt="..."
        />
        <div>
          {route['rank'] <= 3 ? (
            <p className={`badge ${route['rank'] === 1 ? 'badge-primary' : route['rank'] === 2 ? 'badge-secondary' : 'badge-tertiary'}`}>
              Top {route['rank']}
            </p>
          ) : (
            <p className="rank">Top {route['rank']}</p>
          )}
        </div>
        <div className="popularlineCard-infor">
          <h5 className="m-0">
            <span className="">
              {route['fromAddress']}
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{ padding: "0px 6px" }}
              />
              {route['toAddress']}
            </span>
          </h5>
        </div>
        <div className="popularlineCard-overlay">
          <div className="d-table h-100 w-100">
            <div className="d-table-cell align-middle">
              <h5 className="m-0">
                <span className="text-white">
                  {route['fromAddress']}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    style={{ padding: "0px 6px" }}
                  />
                  {route['toAddress']}
                </span>
              </h5>
              <h5 className="m-0">
                <span className="text-white">
                  {route['fromName']}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    style={{ padding: "0px 6px" }}
                  />
                  {route['toName']}
                </span>
              </h5>
              <p className="text-white mb-0">{route['distance']}km - {route['duration']}giờ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularLine;
