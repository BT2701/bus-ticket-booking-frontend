import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons"; // Import the solid icons
const SearchInput = () => {
  return (
    <div className="find-container d-flex justify-content-center">
      <div className="m-3 shadow rounded container">
        <form action="" method="">
          <div className="align-items-center d-flex justify-content-center">
            {/* Pickup Location */}
            <div className="col-md-2 d-flex align-items-center border m-4">
              <img
                src="https://229a2c9fe669f7b.cmccloud.com.vn/svgIcon/pickup_vex_blue_24dp.svg"
                width="24"
                height="24"
                alt=""
              />
              <div>
                <select name="" id="" className="form-control border-0">
                  <option value="saigon">Sai Gon</option>
                  <option value="hochiminh">Ho Chi Minh</option>
                </select>
              </div>
            </div>

            {/* Switch Icon */}
            <div>
              <a href="#">
                <FontAwesomeIcon icon={faArrowsRotate} />
              </a>
            </div>

            {/* Dropoff Location */}
            <div className="col-md-2 d-flex align-items-center border m-4">
              <img
                src="https://229a2c9fe669f7b.cmccloud.com.vn/svgIcon/dropoff_new_24dp.svg"
                width="24"
                height="24"
                alt=""
              />
              <select name="" id="" className="form-control border-0">
                <option value="saigon">Sai Gon</option>
                <option value="hochiminh">Ho Chi Minh</option>
              </select>
            </div>

            {/* Departure Date */}
            <div className="col-md-2 d-flex border m-4">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faCalendarDays} />
              </span>
              <input
                type="date"
                className="form-control border-0"
                id="departureDate"
                defaultValue="2024-09-25"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button type="submit" className="btn btn-warning m-4">
                Tìm kiếm
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchInput;
