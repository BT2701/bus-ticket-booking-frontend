import "./Header.css"; // Optional: For additional custom styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons"; // Import the solid icons\
import { usePageContext } from "../../Context/PageProvider";
import { Link } from "react-router-dom";
import { useUserContext } from "../../Context/UserProvider";

const Header = () => {
  const { page, setPage } = usePageContext();
  const { state: user } = useUserContext();

  return (
    <div className="header-container">
      <header className=" bg-color-primary">
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
              <Link className="navbar-brand text-light" to="/">
                <h2 style={{ marginBottom: 0 }}> SGU Bus Lines</h2>
              </Link>
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
                      className={`nav-link homepage-nav-link ${page === "homepage" && "active"
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
                      className={`nav-link homepage-nav-link ${page === "search" && "active"
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
                      className={`nav-link homepage-nav-link ${page === "news" && "active"
                        }`}
                      onClick={() => {
                        setPage("news");
                      }}
                      to="/news"
                    >
                      Tin tức
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link homepage-nav-link ${page === "invoice" && "active"
                        }`}
                      onClick={() => {
                        setPage("invoice");
                      }}
                      to="invoice"
                    >
                      Hóa đơn
                    </Link>
                  </li>
                  <li className="nav-item">
                  {
                    user?.role?.name && (user?.role?.name === "ADMIN" || user?.role?.name === "STAFF" || user?.role?.name === "CUSTOMER") && (
                      <Link
                      className={`nav-link homepage-nav-link ${page === "history" && "active"
                        }`}
                      onClick={() => {
                        setPage("history");
                      }}
                      to="history"
                    >
                      Lịch sử chuyến đi
                    </Link>
                    )
                  }
                    
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link homepage-nav-link ${page === "contact" && "active"
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
                      className={`nav-link homepage-nav-link ${page === "about" && "active"
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
                  {
                    user?.role?.name && (user?.role?.name === "ADMIN" || user?.role?.name === "STAFF") && (
                      <Link
                        className={`nav-link homepage-nav-link ${
                          page === "staff" && "active"
                        }`}
                        style={{
                          marginRight: "25px"
                        }}
                        onClick={() => {
                          setPage("staff");
                        }}
                        to="staff"
                      >
                        Trang quản lý
                      </Link>
                    )
                  }
                  {
                    user?.id ? (
                      <Link to="/profile"
                        onClick={() => {
                          setPage("profile");
                        }}
                        className={`nav-link homepage-nav-link text-decoration-none text-white ${page === "profile" && "active"
                          } `}
                      >
                        {user?.name}
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => {
                          setPage("login");
                        }}
                        className="btn btn-light btn-secondary text-decoration-none"
                      >
                        <FontAwesomeIcon icon={faUser} className="me-1" />
                        Đăng nhập
                      </Link>
                    )
                  }

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
