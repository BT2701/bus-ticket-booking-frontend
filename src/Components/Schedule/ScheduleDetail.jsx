import React, { useEffect, useState } from 'react';
import './schedule.css'; // Import CSS
import Booked from '../../Static/IMG/booked.png'
import Selected from '../../Static/IMG/selected.png'
import Available from '../../Static/IMG/available.png'
import BusDefault from '../../Static/IMG/bus.png'
import Guy from '../../Static/IMG/guy.jpg'
import { Button, Modal, Spinner } from 'react-bootstrap'; // For Bootstrap Button
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSyncAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useSchedule } from '../../Context/ScheduleContext';
import formatTimeFromDatabase from '../../sharedComponents/formatTimeFromDatabase';
import formatCurrency from '../../sharedComponents/formatMoney';
import NotificationDialog from '../../sharedComponents/notificationDialog';
import notificationWithIcon from '../Utils/notification';
import CarRouteMap from "../Map/CarRouteMap";
import { getCoordinatesFromAddress } from '../Map/geolocation';


const ScheduleDetail = () => {
  const { schedule, updateSchedule, updateSeatList, updateTotal } = useSchedule();
  const [seatIndexsUp, setSeatIndexsUp] = useState([]);
  const [seatIndexsDown, setSeatIndexsDown] = useState([]);
  const [seatCount, setSeatCount] = useState(0);
  const [bookingList, setBookingList] = useState([]);
  const [seatStatus, setSeatStatus] = useState({}); // Trạng thái ghế lưu bằng seat index
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [price, setPrice] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [pointA, setPointA] = useState(null);

  const [pointB, setPointB] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSelected = (seatIndex) => {
    // Kiểm tra nếu ghế đã được đặt trong bookingList
    const isBooked = bookingList.some((booking) => seatIndex === booking.seatnum);

    if (isBooked) {
      handleOpenDialog(true);
    } else if (seatStatus[seatIndex] === Selected) {
      // Nếu ghế đang là Selected, chuyển lại về Available
      setSeatStatus((prevStatus) => ({
        ...prevStatus,
        [seatIndex]: Available
      }));
      setSelectedSeats((prevSelected) =>
        prevSelected.filter((seat) => seat !== seatIndex)
      );
    } else {
      // Nếu ghế đang là Available, chuyển sang Selected
      setSeatStatus((prevStatus) => ({
        ...prevStatus,
        [seatIndex]: Selected
      }));
      setSelectedSeats((prevSelected) => [...prevSelected, seatIndex]);
    }
  };

  const is_booked = (seatIndex) => {
    // Kiểm tra nếu ghế có trong danh sách bookingList
    const isBooked = bookingList?.some((booking) => seatIndex === booking.seatnum);

    // Nếu ghế đã được đặt, trả về hình ảnh Booked
    if (isBooked) {
      return Booked;
    }

    // Nếu không, kiểm tra trạng thái hiện tại từ seatStatus
    return seatStatus[seatIndex] || Available;
  };
  const handleReplace = () => {
    // Hủy chọn tất cả các ghế đã chọn
    setSeatStatus((prevStatus) => {
      const newStatus = { ...prevStatus };
      selectedSeats.forEach((seat) => {
        newStatus[seat] = Available;
      });
      return newStatus;
    });
    // Làm trống danh sách ghế đã chọn
    setSelectedSeats([]);
  };
  const designSeatIndex = async (seatCount) => {
    try {
      const response = await fetch('/Seats.txt');
      const data = await response.json();
      console.log(data);
      // const data = JSON.parse(data1);
      if (seatCount === 24) {
        setSeatIndexsDown(data["24"].down);
        setSeatIndexsUp(data["24"].up);
      } else if (seatCount === 32) {
        setSeatIndexsDown(data["32"].down);
        setSeatIndexsUp(data["32"].up);
      } else {
        setSeatIndexsDown(data["default"].down);
      }
    } catch (error) {
      console.error("Error loading seat data:", error);
    }
  };

  const Total = () => {
    return price * selectedSeats.length;
  }
  const handleSubmit = () => {
    if (selectedSeats.length === 0) {
      notificationWithIcon('info', 'Information', 'Mời chọn ít nhất một chỗ!');
    }
    else {
      updateSeatList(selectedSeats);
      updateTotal(Total());
      localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
      localStorage.setItem('total', JSON.stringify(Total()));
      navigate('/schedule/detail/payment');
    }
  }
  useEffect(() => {
    if (!schedule) {
      const savedSchedule = localStorage.getItem('schedule');
      if (savedSchedule) {
        updateSchedule(JSON.parse(savedSchedule));
      } else {
        console.error('No schedule data found');
      }
    }
    setSeatCount(schedule?.bus.category.seat_count);
    designSeatIndex(seatCount);
    setBookingList(schedule?.bookings);
    setPrice(schedule?.price);
  }, [seatCount, schedule]);

  const fetchCoordinates = async () => {
    const pickup = JSON.parse(localStorage.getItem('pickup'));
    const dropoff = JSON.parse(localStorage.getItem('dropoff'));

    if (!pickup || !dropoff) {
      console.log('Không có địa chỉ pickup hoặc dropoff trong localStorage');
      return;
    }

    try {
      // Gọi API để lấy tọa độ
      const coordinatesA = await getCoordinatesFromAddress(pickup + ', Vietnam');
      const coordinatesB = await getCoordinatesFromAddress(dropoff + ', Vietnam');

      if (coordinatesA && coordinatesB) {
        const pointA = [parseFloat(coordinatesA.lat), parseFloat(coordinatesA.lon)];
        const pointB = [parseFloat(coordinatesB.lat), parseFloat(coordinatesB.lon)];

        // Lưu tọa độ vào localStorage
        localStorage.setItem('pointA', JSON.stringify(pointA));
        localStorage.setItem('pointB', JSON.stringify(pointB));

        // Cập nhật state sau khi lấy tọa độ thành công
        setPointA(pointA);
        setPointB(pointB);
      } else {
        console.log('Không tìm thấy tọa độ cho một trong các địa điểm');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  const toggleModal = async () => {
    setIsModalOpen(!isModalOpen);
    await fetchCoordinates();
  };


  if (!schedule) {
    return <div>Loading...</div>;
  }
  return (
    <div className="schedule-container">
      <div className="schedule-left">
        <div className="schedule-left-top">
          <img src={BusDefault} alt="bus" />
        </div>
        <div className="schedule-left-bot">
          <div className="schedule-left-bot-box">
            <label>Biển Số:</label>
            <span>{schedule?.bus.busnumber}</span>
          </div>
          <div className="schedule-left-bot-box">
            <label>Loại Xe:</label>
            <span>{schedule?.bus.category.name}</span>
          </div>
          <div className="schedule-left-bot-box">
            <label>Số Ghế:</label>
            <span>{schedule?.bus.category.seat_count}</span>
          </div>
          <div className="schedule-left-bot-box">
            <label>Tài Xế:</label>
            <div className="schedule-left-bot-box-driver">
              <img src={Guy} alt="driver" />
              <span>{schedule?.bus.driver.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="schedule-right">
        <div className="schedule-right-top">
          <div className="schedule-right-top-title">
            <h4>Điểm Đến Của Bạn</h4>
          </div>
          <div className="schedule-right-top-route">
            <div className="location">
              <label>Từ:</label>
              <span>{schedule?.route.from.name}</span>
            </div>
            <div className="schedule-right-top-route-line"></div>
            <div className="location">
              <label>Đến:</label>
              <span>{schedule?.route.to.name}<div className="route to"></div></span>
            </div>
            <button onClick={toggleModal}>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </button>
          </div>
          <div className="schedule-right</button>-top-timeline">
            <label>Xe Rời Bến Lúc:</label>
            <span>{formatTimeFromDatabase(schedule?.departure)}</span>
          </div>
        </div>
        {/* Modal */}
        <Modal show={isModalOpen} onHide={toggleModal} size="lg">
          {/* Modal Header */}
          <Modal.Header closeButton>
            <Modal.Title>Tuyến đường</Modal.Title>
          </Modal.Header>

          {/* Modal Body */}
          <Modal.Body>
            <div className="modal-content">
              {pointA && pointB ? (
                <CarRouteMap pointA={pointA} pointB={pointB} />
              ) : (
                <div className="text-center">
                  <Spinner animation="border" />
                  <p>Đang tải dữ liệu...</p>
                </div>
              )}
            </div>
          </Modal.Body>

          {/* Modal Footer */}
          <Modal.Footer>
            <Button variant="secondary" onClick={toggleModal}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="schedule-right-center">
          <div className="min-w-sm mx-auto flex w-[100%] max-w-2xl flex-col px-3 py-1 sm:px-6 2lg:mx-0 2lg:w-auto">
            <div className="flex max-w-xs items-start justify-between pt-5 text-xl font-medium text-black">
              <p className="flex flex-col schedule-choose-title">Chọn Chỗ</p>
              <p className="text-sm text-gray-500 mt-2" style={{ fontStyle: "italic", fontSize: "12px", color: "gray" }}>*Chọn lại để hủy</p>
            </div>
            <div className="my-4 flex flex-row text-center font-medium gap-4 sm:gap-6 schedule-seat-container ">
              <div className="flex min-w-[50%] flex-col md:min-w-[153px] schedule-seat">
                <div className="icon-gray flex w-full justify-center p-2 text-sm">
                  <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Tầng Dưới</span>
                </div>
                <div className="divide mb-4 2lg:hidden"></div>
                <table>
                  <tbody>
                    {seatIndexsDown?.map((row, rowIndex) => (
                      <tr key={rowIndex} className="flex items-center gap-1 justify-between">
                        {row.map((seat, seatIndex) => (
                          <td key={seatIndex} className="relative mt-1 flex justify-center text-center">
                            {seat ? (
                              <>
                                <img
                                  width="32"
                                  src={is_booked(seat)}
                                  alt="seat icon"
                                  className="schedule-seat-img"
                                  onClick={() => handleSelected(seat)}
                                />
                                <span
                                  className={`absolute text-sm font-semibold lg:text-[10px] text-[#A2ABB3] top-1 schedule-seat-name`}
                                >
                                  {seat}
                                </span>
                              </>
                            ) : (
                              // Empty <td> for spacing, maintain height for alignment
                              <div style={{ width: '32px', height: '32px' }}></div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {seatCount === 36 ? (<></>) : (<>
                <div className="schedule-seat-line"></div>
                <div className="flex min-w-[50%] flex-col md:min-w-[153px] schedule-seat">
                  <div className="icon-gray flex w-full justify-center p-2 text-sm">
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Tầng Trên</span>
                  </div>
                  <div className="divide mb-4 2lg:hidden"></div>
                  <table>
                    <tbody>
                      {seatIndexsUp?.map((row, rowIndex) => (
                        <tr key={rowIndex} className="flex items-center gap-1 justify-between">
                          {row.map((seat, seatIndex) => (
                            <td key={seatIndex} className="relative mt-1 flex justify-center text-center">
                              {seat ? (
                                <>
                                  <img width="32"
                                    src={is_booked(seat)}
                                    alt="seat icon" className='schedule-seat-img'
                                    onClick={() => handleSelected(seat)}
                                  />
                                  <span
                                    className={`absolute text-sm font-semibold lg:text-[10px] 'text-[#A2ABB3]' top-1 schedule-seat-name`}
                                  >
                                    {seat}
                                  </span>
                                </>
                              ) : (
                                // Empty <td> for spacing, maintain height for alignment
                                <div style={{ width: '32px', height: '32px' }}></div>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div></>
              )}

            </div>
            <div className="schedule-right-center-seat-note">
              <div className="ml-4 mt-5 flex flex-col gap-4 text-[13px] font-normal schedule-seat-note">
                <span className="mr-8 flex items-center seat-noted">
                  <img src={Available} alt="" />Trống
                </span><span className=" flex items-center seat-noted">
                  <img src={Selected} alt="" />
                  Đã Chọn
                </span>
                <span className="mr-8 flex items-center seat-noted">
                  <img src={Booked} alt="" />
                  Đã Được Đặt
                </span>


              </div>
            </div>
          </div>
        </div>
        <div className="schedule-right-bot">
          <div className="schedule-right-bot-h6" style={{ display: "flex" }}>
            <h6>Chỗ Đã Chọn:</h6>
            {selectedSeats.length > 0 && (
              <button className='schedule-right-bot-h6-btn'
                onClick={handleReplace}
              >
                <FontAwesomeIcon icon={faSyncAlt} className="mr-2" />
              </button>
            )}
          </div>
          <div className="schedule-selected-seat-container">
            {selectedSeats.length > 0 ? (
              selectedSeats.map((seat) => (
                <div key={seat} className="schedule-selected-seat-box">{seat}</div>
              ))
            ) : (
              <p style={{ fontSize: "12px" }}>Chưa chọn ghế nào.</p>
            )}
          </div>
          <div className="schedule-total-prices">
            <h6>Tổng Tiền:</h6> <span>{formatCurrency(Total())}</span>
          </div>
          <Button className='btn btn-primary' onClick={handleSubmit}>Xác Nhận</Button>
        </div>
      </div>
      <div className="schedule-back">
        <button onClick={() => navigate(-1)} className='btn btn-secondary schedule-back-btn'>
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '0.5em' }} />
        </button>
      </div>
      <NotificationDialog
        message="Chỗ đã được đặt!"
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default ScheduleDetail;
