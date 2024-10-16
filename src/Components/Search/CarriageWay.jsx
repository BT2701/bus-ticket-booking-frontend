import { Link } from "react-router-dom";
import { useSchedule } from "../../Context/ScheduleContext";
import { useEffect } from "react";
import axios from "axios";


const CarriageWay = ({ busData }) => { // Nhận busData từ props
  const { schedule, updateSchedule } = useSchedule();
  const handleSelectSchedule= (scheduleId)=>{
    console.log(scheduleId);
    const fetchData = async () => {
      try {
        const schedulesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/schedule?id=${scheduleId}`);     //dat tam id
        updateSchedule(schedulesResponse.data);
        localStorage.setItem('schedule', JSON.stringify(schedulesResponse.data));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  };

  console.log("busData:", busData);
  return (
    <div className="container m-0 p-0">
      <div className="card mb-3 shadow-sm">
        <div className="row g-0">
          <div className="col-md-3 position-relative">
          <img
            src="https://kiengiangauto.com/wp-content/uploads/2022/09/tong-dai-so-dien-thoai-nha-xe-phuong-trang-rach-gia-kien-giang.jpg"
            className="img-fluid"
            alt="Bus"
            style={{
              width: "90%",
              height: "100%", // Đặt chiều cao bằng 100% chiều cao phần tử cha
              objectFit: "contain",
              marginLeft: "5px",
            }}
          />
            <span className="badge bg-success position-absolute top-0 start-0 m-1">
              Xác nhận tức thì
            </span>
          </div>
          <div className="col-md-6">
            <div className="card-body">
            <strong className="card-title mb-1 fs-4"  style={{ color: 'red' }} >
              Nhà Xe Phương Trang
            </strong>
              <p className="text-muted mb-1">{busData[0]}</p> {/* Hiển thị loại ghế */}
              <p className="mb-1">
                <strong className="fs-5">{busData[6]}</strong> {/* Hiển thị bến xe đi */}
                <br />
                <p className="text-muted mb-0">{busData[1]}</p>{/* Hiển thị giờ đi */}
                <p className="text-muted mb-0">{busData[2]}</p>{/* Hiển thị giờ đến */}
                <strong className="fs-5">{busData[7]}</strong> {/* Hiển thị bến xe đến */}
              </p>
            </div>
          </div>
          <div className="col-md-3 text-center d-flex flex-column justify-content-center align-items-center">
          <h4 className="text-primary fw-bold">{busData[3]}</h4> {/* Hiển thị giá vé */}
            <p className="text-muted mb-1">Còn {busData[4]} chỗ trống</p> {/* Hiển thị số chỗ còn lại */}
            <Link className="btn btn-warning text-white mb-2" to={'/schedule/detail'} onClick={() => handleSelectSchedule(busData[8])}>
              Chọn chuyến
            </Link>
            <p className="text-danger fw-bold">KHÔNG CẦN THANH TOÁN TRƯỚC</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarriageWay;
