import "./Header.css"; // Optional: For additional custom styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBell } from "@fortawesome/free-solid-svg-icons"; // Import the solid icons\
import { usePageContext } from "../../Context/PageProvider";
import { Link } from "react-router-dom";
import { useUserContext } from "../../Context/UserProvider";
import React, { useState, useRef, useEffect } from 'react';
import ApiService from "../Utils/apiService";
const Header = () => {
  const { page, setPage } = usePageContext();
  const { state: user } = useUserContext();
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  // Reference for the notification box
  const notificationRef = useRef(null);
  const [notiData, setNotiData] = useState([]);

  // Xử lý khi click vào một thông báo bất kì 
  const handleNotificationClick = async (notification) => {
    try {
      const notificationId = notification.id;
      // const response = await axios.put(`http://localhost:8080/api/notification/${notificationId}`);
      const response = await ApiService.put(`/api/notification/${notificationId}`);
      setSelectedNotification(notification);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  }
  //Đóng modal 
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = user?.id ? await axios.get(`http://localhost:8080/api/notification/${user?.id}`) : [];
        const response = user?.id ? await ApiService.get(`/api/notification/${user.id}`) : [];
        setNotiData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

  }, [showNotifications])



  //Hiển thị box thông báo 
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Đóng box thông báo khi người dùng click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target) && !event.target.closest('button')) {
        setShowNotifications(false);
      }
    };
    // Add event listener to the document
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts


  return (
    <div className="header-container">
      <header className=" bg-color-primary">
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
              <Link className="navbar-brand text-light" to="/">
                <h3 style={{ marginBottom: 0, fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}> SGU BUS LINES</h3>
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
                      className={`nav-link homepage-nav-link ${page === "schedule" && "active"
                        }`}
                      onClick={() => {
                        setPage("schedule");
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
                <div >
                  {
                    user?.id ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div className="nav-item dropdown-wrapper">
                          <div className="text-truncate" style={{ color: "white", fontSize: '18px', maxWidth: '200px', cursor: 'pointer' }}> {user?.name}</div>
                          <div className="dropdown-content">
                            {
                              user?.role?.name && (user?.role?.name === "ADMIN" || user?.role?.name === "STAFF") && (
                                <Link
                                  className={`dropdown-link text-white ${page === "staff" && "active"
                                    }`}
                                  onClick={() => {
                                    setPage("staff");
                                  }}
                                  to="staff"
                                >
                                  Trang quản lý
                                </Link>
                              )
                            }
                            <Link
                              to="/profile"
                              onClick={() => setPage("profile")}
                              className={`dropdown-link text-white ${page === "profile" ? "active" : ""}`}
                            >
                              Profile
                            </Link>
                          </div>
                        </div>

                        <FontAwesomeIcon icon={faBell} className="notification-icon" onClick={toggleNotifications} />
                      </div>
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
      </header >
      {
        showNotifications && (
          <div
            ref={notificationRef}
            style={{
              position: 'absolute',
              top: '55px',
              right: '20px',
              width: '300px',
              backgroundColor: '#f9f9f9',
              border: '1px solid #ccc',
              borderRadius: '5px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              padding: '10px',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 1
            }}
          >
            <h4>Thông báo</h4>
            <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
              {notiData.length ? (
                notiData.map((notification, index) => (
                  <li
                    key={index}
                    className={notification.readAt ? "notification-item notification-item_readed" : "notification-item"}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {notification.title}
                  </li>
                ))
              ) : (
                <li style={{ textAlign: "center" }}>
                  Chưa có thông báo
                </li>
              )}
            </ul>

            {/* Modal to display the selected notification details */}
            {isModalOpen && selectedNotification && (
              <div className="modal notification-modal">
                <div className="modal-content notification-modal-content">
                  <span style={{ backgroundColor: "#f0f0f0", width: "30px", textAlign: "center", borderRadius: "3px" }} className="close-btn" onClick={handleCloseModal}>&times;</span>
                  <h5>Chi tiết thông báo</h5>
                  <p>{selectedNotification.message}</p>
                  {/* Add more notification details as needed */}
                </div>
              </div>
            )}
          </div>)
      }
    </div >
  );
};
export default Header;
