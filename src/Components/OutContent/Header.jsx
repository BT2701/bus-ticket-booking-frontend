import "./Header.css"; // Optional: For additional custom styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons"; // Import the solid icons\
import { usePageContext } from "../../Context/PageProvider";
import { Link } from "react-router-dom";
import { useEffect } from "react";
const Header = () => {
  const { page, setPage } = usePageContext();

  useEffect(() => {
    console.log(page);
  }, [page]);

  return (
    <div className="header-container">
      <header className=" bg-color-primary">
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
              <a className="navbar-brand text-light" to="/">
                <h2> SGU Bus Lines</h2>
              </a>
              <button
                className="navbar-toggler homepage-navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav mx-auto">
                  <li className="nav-item">
                    <Link
                      aria-current="page"
                      to="/"
                      className={`nav-link homepage-nav-link ${
                        page == "homepage" && "active"
                      }`}
                      onClick={() => {
                        setPage("homepage");
                      }}
                    >
                      Trang chủ
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link homepage-nav-link ${
                        page == "search" && "active"
                      }`}
                      onClick={() => {
                        setPage("search");
                      }}
                      to="/schedule"
                    >
                      Tuyến xe
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link homepage-nav-link ${
                        page == "news" && "active"
                      }`}
                      onClick={() => {
                        setPage("news");
                      }}
                      to="#"
                    >
                      Tin tức
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link homepage-nav-link ${
                        page == "invoice" && "active"
                      }`}
                      onClick={() => {
                        setPage("invoice");
                      }}
                      to="#"
                    >
                      Hóa đơn
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link homepage-nav-link ${
                        page == "contact" && "active"
                      }`}
                      onClick={() => {
                        setPage("contact");
                      }}
                      to="/contact"
                    >
                      Liên hệ
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link homepage-nav-link ${
                        page == "about" && "active"
                      }`}
                      onClick={() => {
                        setPage("about");
                      }}
                      to="about"
                    >
                      Về chúng tôi
                    </Link>
                  </li>
                </ul>
                <div className="d-flex align-items-center">
                  {/* //TRƯỜNG HỢP NGƯỜI DÙNG CHƯA ĐĂNG NHẬP */}

                  <Link
                    to="/login"
                    class="btn btn-light btn-secondary text-decoration-none"
                  >
                    <FontAwesomeIcon icon={faUser} className="me-1" />
                    Đăng nhập
                  </Link>

                  {/* TRƯỜNG HỢP NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP */}

                  {/* <a to="/profile" class="text-decoration-none text-white">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiT0TLBPK2bzBTKolVX9yY_x9OUnBOaZTSyvYvHszi4VFM5hJRZujkit66lVorSj2lSPs&usqp=CAU"
                      alt="avatar"
                      class="img-fluid rounded-circle me-3"
                      width="35"
                    />
                    PHAM VAN DU
                  </a> */}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
};
export default Header;
