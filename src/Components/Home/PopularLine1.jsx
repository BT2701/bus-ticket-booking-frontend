import "./PopularLine1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
const PopularLine1 = () => {
  return (
    <Link className="col-md-4 mb-4 text-decoration-none" to="/search">
      <div className="card custom-card">
        <img
          src="https://cdn.futabus.vn/futa-busline-cms-dev/Rectangle_23_2_8bf6ed1d78/Rectangle_23_2_8bf6ed1d78.png"
          className="card-img-top"
          alt="Tp Hồ Chí Minh"
        />
        <div className="card-body">
          <h5 className="card-title">
            <span>Tp Hồ Chí Minh</span>
            <FontAwesomeIcon
              icon={faArrowRightArrowLeft}
              style={{ padding: "0px 14px" }}
            />
            <span>Đà Lạt</span>
          </h5>
          <p className="route-info">305km - 8 giờ - 01/10/2024</p>
          <p className="route-price">
            290.000đ
            <span>/Vé</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PopularLine1;
