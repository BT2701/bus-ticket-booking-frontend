import React from 'react';
import './schedule.css'; // Import CSS
import Booked from '../../Static/IMG/booked.png'
import Selected from '../../Static/IMG/selected.png'
import Available from '../../Static/IMG/available.png'
import BusDefault from '../../Static/IMG/bus.png'
import Guy from '../../Static/IMG/guy.jpg'
import { Button } from 'react-bootstrap'; // For Bootstrap Button
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ScheduleDetail = () => {
  return (
    <div className="schedule-container">
      <div className="schedule-left">
        <div className="schedule-left-top">
          <img src={BusDefault} alt="bus" />
        </div>
        <div className="schedule-left-bot">
          <div className="schedule-left-bot-box">
            <label>Biển Số:</label>
            <span>78E1.08743</span>
          </div>
          <div className="schedule-left-bot-box">
            <label>Loại Xe:</label>
            <span>Vip</span>
          </div>
          <div className="schedule-left-bot-box">
            <label>Số Ghế:</label>
            <span>24</span>
          </div>
          <div className="schedule-left-bot-box">
            <label>Tài Xế:</label>
            <div className="schedule-left-bot-box-driver">
              <img src={Guy} alt="driver" />
              <span>Trưởng BT</span>
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
              <span>Location1</span>
            </div>
            <div className="schedule-right-top-route-line"></div>
            <div className="location">
              <label>Đến:</label>
              <span>Location2</span>
            </div>
          </div>
          <div className="schedule-right-top-timeline">
            <label>Xe Rời Bến Lúc:</label>
            <span>4:00 AM</span>
          </div>
        </div>
        <div className="schedule-right-center">
          <div className="min-w-sm mx-auto flex w-[100%] max-w-2xl flex-col px-3 py-1 sm:px-6 2lg:mx-0 2lg:w-auto">
            <div className="flex max-w-xs items-start justify-between pt-5 text-xl font-medium text-black">
              <p className="flex flex-col schedule-choose-title">Chọn Chỗ</p>
            </div>
            <div className="my-4 flex flex-row text-center font-medium gap-4 sm:gap-6 schedule-seat-container ">
              <div className="flex min-w-[50%] flex-col md:min-w-[153px] schedule-seat">
                <div className="icon-gray flex w-full justify-center p-2 text-sm">
                  <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Tầng Dưới</span>
                </div>
                <div className="divide mb-4 2lg:hidden"></div>
                <table>
            <tbody>
                {[
                    ['A03', '', 'A02', '', 'A01'],
                    ['A06', '', 'A05', '', 'A04'],
                    ['A09', '', 'A08', '', 'A07'],
                    ['A12', '', 'A11', '', 'A10'],
                    ['A15', '', 'A14'],
                    ['A17', '', '', '', 'A16'],
                    ['A22', 'A21', 'A20', 'A19', 'A18']
                ].map((row, rowIndex) => (
                    <tr key={rowIndex} className="flex items-center gap-1 justify-between">
                        {row.map((seat, seatIndex) => (
                            <td key={seatIndex} className="relative mt-1 flex justify-center text-center">
                                {seat ? (
                                    <>
                                        <img width="32" src={Available} alt="seat icon" className='schedule-seat-img' />
                                        <span
                                            className={`absolute text-sm font-semibold lg:text-[10px]  'text-[#A2ABB3]' top-1 schedule-seat-name`}
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
              <div className="schedule-seat-line"></div>
              <div className="flex min-w-[50%] flex-col md:min-w-[153px] schedule-seat">
                <div className="icon-gray flex w-full justify-center p-2 text-sm">
                  <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Tầng Trên</span>
                </div>
                <div className="divide mb-4 2lg:hidden"></div>
                <table>
                  <tbody>
                    {[
                      ['B03','', 'B02','', 'B01'],
                      ['B06','', 'B05','', 'B04'],
                      ['B09','', 'B08','', 'B07'],
                      ['B12','', 'B11','', 'B10'],
                      ['B15','', 'B14','', 'B13'],
                      ['B17','','','', 'B16'],
                      ['B22', 'B21', 'B20', 'B19', 'B18']
                    ].map((row, rowIndex) => (
                      <tr key={rowIndex} className="flex items-center gap-1 justify-between">
                          {row.map((seat, seatIndex) => (
                              <td key={seatIndex} className="relative mt-1 flex justify-center text-center">
                                  {seat ? (
                                      <>
                                          <img width="32" src={Available} alt="seat icon" className='schedule-seat-img'/>
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
              </div>

            </div>
            <div className="schedule-right-center-seat-note">
              <div className="ml-4 mt-5 flex flex-col gap-4 text-[13px] font-normal schedule-seat-note">
                <span className="mr-8 flex items-center seat-noted">
                  <img src={Booked} alt="" />
                  Đã Được Đặt
                </span>
                <span className="mr-8 flex items-center seat-noted">
                  <img src={Available} alt="" />Trống
                </span><span className=" flex items-center seat-noted">
                  <img src={Selected} alt="" />
                  Đã Chọn
                </span>

              </div>
            </div>
          </div>
        </div>
        <div className="schedule-right-bot">
          <h6>Chỗ Đã Chọn:</h6>
          <div className="schedule-selected-seat-container">
            <div className="schedule-selected-seat-box">1</div>
            <div className="schedule-selected-seat-box">2</div>
            <div className="schedule-selected-seat-box">3</div>
          </div>
          <div className="schedule-total-prices">
            <h6>Tổng Tiền:</h6> <span>500000VND</span>
          </div>
          <Link className='btn btn-primary' to={'/schedule/detail/payment'}>Xác Nhận</Link>
        </div>
      </div>
      <div className="schedule-back">
        <Link to={'/schedule'} className='btn btn-secondary'><FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '0.5em' }}/>Quay lại</Link>
      </div>
    </div>
    
  );
};

export default ScheduleDetail;
