import "./PopularLine.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
const PopularLine = ({ route }) => {
  return (
    <Link className="col-md-4 mt-1-9" to="/search">
      <div className="popularlineCard text-center">
        <img
          src="https://i.pinimg.com/564x/be/d9/5f/bed95f67a0643a9dcd08b39554c52f0e.jpg"
          className="card-img-top"
          alt="..."
        />
        <div className="popularlineCard-infor">
          <h5 className="m-0">
            <span className="">
              {route[4]}
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{ padding: "0px 6px" }}
              />
              {route[5]}
            </span>
          </h5>
        </div>
        <div className="popularlineCard-overlay">
          <div className="d-table h-100 w-100">
            <div className="d-table-cell align-middle">
              <h5 className="m-0">
                <span className="text-white">
                  {route[4]}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    style={{ padding: "0px 6px" }}
                  />
                  {route[5]}
                </span>
              </h5>
              <p className="text-white mb-0">{route[1]}km - {route[2]}giờ</p>

              <p className="text-white">
                {route[3]}đ
                <span>/Vé</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PopularLine;
