import "./PopularLine.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
const PopularLine = () => {
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
              Phan Rang-Tháp Chàm
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{ padding: "0px 6px" }}
              />
              Bà Rịa-Vũng Tàu
            </span>
          </h5>
        </div>
        <div className="popularlineCard-overlay">
          <div className="d-table h-100 w-100">
            <div className="d-table-cell align-middle">
              <h5 className="m-0">
                <span className="text-white">
                  Phan Rang-Tháp Chàm
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    style={{ padding: "0px 6px" }}
                  />
                  Bà Rịa-Vũng Tàu
                </span>
              </h5>
              <p className="text-white mb-0">305km - 8 giờ - 01/10/2024</p>

              <p className="text-white">
                290.000đ
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
