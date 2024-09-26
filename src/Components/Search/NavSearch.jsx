import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"; // Import the solid icons
import { useState } from "react";
function NavSearch() {
  const [isOpenTimeStart, setIsOpenTimeStart] = useState(false);
  const [isOpenCarType, setIsOpenCarType] = useState(false);
  const [isOpenTicketPrice, setIsOpenTicketPrice] = useState(false);
  return (
    <div
      className="top-navbar-container d-block shadow "
      style={{ minHeight: "auto" }}
    >
      <div className="Larger shadow py-1">
        <h5 className="m-2">Sắp Xếp</h5>
        <div className="m-2">
          <span>
            <input type="radio" name="sort" />
          </span>
          <label className="ps-1">Mặc định</label>
        </div>
        <div className="m-2">
          <span>
            <input type="radio" name="sort" />
          </span>
          <label className="ps-1">Giờ đi sớm nhất</label>
        </div>
        <div className="m-2">
          <span>
            <input type="radio" name="sort" />
          </span>
          <label className="ps-1">Giờ đi muộn nhất</label>
        </div>
        <div className="m-2">
          <span>
            <input type="radio" name="sort" />
          </span>
          <label className="ps-1">Đánh giá cao nhất</label>
        </div>
        <div className="m-2">
          <span>
            <input type="radio" name="sort" />
          </span>
          <label className="ps-1">Giá tăng dần</label>
        </div>
        <div className="m-2">
          <span>
            <input type="radio" name="sort" />
          </span>
          <label className="ps-1">Giá giảm dần</label>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 Larger shadow py-1" style={{ minWidth: "232px" }}>
        <h5 className="m-2">Lọc</h5>

        {/* Time filter */}
        <div>
          <div
            className="d-flex m-2 cursor-pointer"
            onClick={() => setIsOpenTimeStart(!isOpenTimeStart)}
          >
            <h6>Giờ đi</h6>
            <p className="ms-auto">
              {isOpenTimeStart ? (
                <FontAwesomeIcon icon={faChevronUp} />
              ) : (
                <FontAwesomeIcon icon={faChevronDown} />
              )}
            </p>
          </div>
          {isOpenTimeStart && (
            <div>
              <div className="d-flex m-2">
                <p className="d-flex align-items-center w-25">Từ:</p>
                <div className="form-control border-0">
                  <input
                    type="text"
                    defaultValue="00:00"
                    className="w-50 form-control"
                  />
                </div>
              </div>
              <div className="d-flex m-2">
                <p className="d-flex align-items-center w-25">Đến:</p>
                <div className="form-control border-0">
                  <input
                    type="text"
                    defaultValue="00:00"
                    className="w-50 form-control"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bus Type Filter */}
        <div>
          <div
            className="d-flex m-2"
            onClick={() => setIsOpenCarType(!isOpenCarType)}
          >
            <h6>Loại xe</h6>
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
              <div className="d-flex m-2 align-items-center">
                <input type="checkbox" className="me-2" />
                <p className="mb-0">Limousine 24 Phòng</p>
              </div>
              <div className="d-flex m-2 align-items-center">
                <input type="checkbox" className="me-2" />
                <p className="mb-0">Limousine 24 Phòng VIP</p>
              </div>
              {/* You can add more options here */}
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div>
          <div
            className="d-flex m-2"
            onClick={() => setIsOpenTicketPrice(!isOpenTicketPrice)}
          >
            <h6>Giá vé</h6>
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
                    defaultValue="0"
                    className="form-control me-2"
                  />
                  <p className="mb-0">VND</p>
                </div>
              </div>
              <div className="d-flex m-2 align-items-center">
                <p className="mb-0 w-25">Đến:</p>
                <div className="d-flex form-control border-0 align-items-center w-75 p-0">
                  <input
                    type="text"
                    defaultValue="2000000"
                    className="form-control me-2"
                  />
                  <p className="mb-0">VND</p>
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
