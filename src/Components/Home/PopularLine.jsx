import "./PopularLine.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
const PopularLine = () => {
  return (
    <Link class="col-md-4 mt-1-9" to="/search">
      <div class="popularlineCard text-center">
        <img
          src="https://i.pinimg.com/564x/be/d9/5f/bed95f67a0643a9dcd08b39554c52f0e.jpg"
          className="card-img-top"
          alt="..."
        />
        <div class="popularlineCard-infor">
          <h5 class="m-0">
            <span class="">
              Phan Rang-Tháp Chàm
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{ padding: "0px 6px" }}
              />
              Bà Rịa-Vũng Tàu
            </span>
          </h5>
        </div>
        <div class="popularlineCard-overlay">
          <div class="d-table h-100 w-100">
            <div class="d-table-cell align-middle">
              <h5 className="m-0">
                <span class="text-white">
                  Phan Rang-Tháp Chàm
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    style={{ padding: "0px 6px" }}
                  />
                  Bà Rịa-Vũng Tàu
                </span>
              </h5>
              <p class="text-white mb-0">305km - 8 giờ - 01/10/2024</p>

              <p class="text-white">
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
