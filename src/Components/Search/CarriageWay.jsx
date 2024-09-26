import { Link } from "react-router-dom";

const CarriageWay = () => {
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
                height: "80%",
                objectFit: "contain",
                marginLeft: "5px",
              }}
            />
            <span className="badge bg-success position-absolute top-0 start-0 m-1">
              Xác nhận tức thì
            </span>
            <div className="position-absolute bottom-0 start-0 m-1 p-1 bg-warning text-dark">
              <strong>FLASH SALE</strong> 24.9
            </div>
          </div>
          <div className="col-md-6">
            <div className="card-body">
              <h5 className="card-title mb-1">
                Thuận Tâm Nguyen Nhat Ttruowng
                <span className="badge bg-primary">3.8 (129)</span>
              </h5>
              <p className="text-muted mb-1">Giường nằm 41 chỗ</p>
              <p className="mb-1">
                <i className="fas fa-clock"></i> <strong>12:00</strong> - Bãi xe
                39 KCN Vĩnh...
                <br />
                <i className="fas fa-clock"></i> <strong>06:05</strong> - Cảng
                Sa Kỳ (26/09)
              </p>
              <p className="text-success mb-1">
                8 người đặt trong 6 tiếng gần đây
              </p>
              <a href="#" className="text-decoration-none">
                Thông tin chi tiết
              </a>
            </div>
          </div>
          <div className="col-md-3 text-center d-flex flex-column justify-content-center align-items-center">
            <h4 className="text-primary fw-bold">400.000đ</h4>
            <span className="badge bg-light text-success border">
              Giảm 50% tới đa 250K
            </span>
            <p className="text-muted mb-1">Còn 22 chỗ trống</p>
            <Link className="btn btn-warning text-white mb-2" to={'/schedule/detail'}>
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
