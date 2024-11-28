import axios from 'axios';
import { ResponsiveLine } from '@nivo/line';
import { convertDataForLineChartRechar, transformDataForLineChartMutil } from './Convertdata';
import React, { useEffect, useState } from 'react';
import { tokens } from "../utils/theme";
import { useTheme } from "@mui/material";
import { LineChart, Line, Legend, Tooltip, YAxis, XAxis, CartesianGrid } from 'recharts';
import { isDateGreaterThan, isDifferenceMoreThan30Days } from './Validation';
const LineChartReChart = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    //Data cho line chart 
    const [lineChartData, setLineChartData] = useState([]);

    //giá trị mặc định cho thời gian(doanh thu theo ngày, tuần, tháng) 
    //giá trị mặc định cho loại doanh thu (doanh thu hệ thống, doanh thu theo loại xe, doanh thu theo tuyến xe)
    //giá trị mặc định cho sô lượng thời gian (bao nhiêu ngày, bao nhiêu tuần, bao nhiêu tháng)
    const [selectedOption1, setSelectedOption1] = useState("doanhthuhethong");
    const [selectedOption, setSelectedOption] = useState("doanhthutheongay");
    const [defaultTime, setDefaultTime] = useState(7); //mới vào trang luôn luôn thời gian là ngày, và mặc định là 7 ngày

    //Dành cho trường hợp người chọn tùy chọn (họ sẽ chọn ngày để xem thống kê doanh thu).
    const [timeStart, setTimeStart] = useState(null);
    const [timeEnd, setTimeEnd] = useState(null);

    //Định nghĩa mảng chứa tên của line(đường) trong line chart. 
    const [lineNames, setLineNames] = useState([]);

    //Xử lý lỗi.
    const [errorChooseDate, setErrorChooseDate] = useState(null);

    useEffect(() => {
        // Không thực hiện gì nếu selectedOption là "doanhthutuychon"
        if (selectedOption === "doanhthutuychon") {
            return;
        }
        // Fetch data from backend API
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/statistic/${selectedOption1}/${selectedOption}/${defaultTime}`);
                const transformedData = selectedOption1 === "doanhthuhethong" ? convertDataForLineChartRechar(response.data, selectedOption) : transformDataForLineChartMutil(response.data);
                setLineChartData(transformedData);
                const objectWithMostFields = transformedData.reduce((maxObj, currentObj) => {
                    return Object.keys(currentObj).length > Object.keys(maxObj).length ? currentObj : maxObj;
                }, {});
                setLineNames(Object.keys(objectWithMostFields).filter(key => key !== "name"));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [selectedOption1, selectedOption, defaultTime]);

    const handleDropdownChange = (event) => {
        //set giá trị select
        setSelectedOption(() => {
            event.target.value === "doanhthutheongay" ? setDefaultTime(7) : setDefaultTime(3);// 3 là giá trị 3 tháng.
            return event.target.value
        }
        );
    };

    const handleDropdownChange1 = (event) => {
        setSelectedOption1(event.target.value);
    }

    const handleDateStartChange = (event) => {
        setTimeStart(event.target.value);
    }

    const handleDateEndChange = (event) => {
        setTimeEnd(event.target.value);
    }

    const handleSubmit = () => {
        if (!timeStart || !timeEnd) {
            setErrorChooseDate("Lỗi-Ngày bắt đầu hoặc kết thúc trống");
            return;
        }
        else if (isDateGreaterThan(timeStart, timeEnd)) {
            setErrorChooseDate("Lỗi-Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
            return;
        }
        else if (isDifferenceMoreThan30Days(timeEnd, timeStart, 30)) {
            setErrorChooseDate("Lỗi-Chỉ giới hạn trong 30 ngày");
            return;
        }
        else {
            setErrorChooseDate(null);
        }
        //make retuest
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/statistic/${selectedOption1}/${selectedOption}/${timeStart}/${timeEnd}`);
                const transformedData = selectedOption1 === "doanhthuhethong" ? convertDataForLineChartRechar(response.data, selectedOption) : transformDataForLineChartMutil(response.data);
                setLineChartData(transformedData);
                const objectWithMostFields = transformedData.reduce((maxObj, currentObj) => {
                    return Object.keys(currentObj).length > Object.keys(maxObj).length ? currentObj : maxObj;
                }, {});
                setLineNames(Object.keys(objectWithMostFields).filter(key => key !== "name"));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    };

    return (
        <div>
            <div style={{ marginLeft: "30px", padding: "15px 0 30px 0" }}>
                {/* Dropdown */}
                <select value={selectedOption1} onChange={handleDropdownChange1} style={{ margin: "0 5px 5px 0" }}>
                    <option value="doanhthuhethong">Doanh thu hệ thống</option>
                    <option value="doanhthutheotuyen">Doanh thu theo tuyến</option>
                    {/* <option value="doanhthutheoloaixe">Doanh thu theo loại xe</option> */}
                </select>
                {/* Dropdown */}
                <select value={selectedOption} onChange={handleDropdownChange}>
                    <option value="doanhthutheongay">Doanh thu ngày</option>
                    {/* <option value="donhthutheotuan">Doanh thu tuần</option> */}
                    <option value="doanhthutheothang">Doanh thu tháng</option>
                    <option value="doanhthutuychon">Tùy chọn</option>
                </select>

                {selectedOption === "doanhthutheongay" && (
                    <div>
                        <button onClick={() => setDefaultTime(7)}>7 ngày</button>
                        <button style={{ margin: "0 3px" }} onClick={() => setDefaultTime(14)}>14 ngày</button>
                        <button onClick={() => setDefaultTime(30)}>30 ngày</button>
                    </div>
                )}

                {selectedOption === "doanhthutheothang" && (
                    <div>
                        <button onClick={() => setDefaultTime(3)}>3 thang</button>
                        <button style={{ margin: "0 3px" }} onClick={() => setDefaultTime(6)}>6 thang</button>
                        <button onClick={() => setDefaultTime(12)}>12 thang</button>
                    </div>
                )}
                {selectedOption === "doanhthutuychon" && (
                    <div >
                        <div>  Từ<input type="date" value={timeStart} onChange={(e) => { handleDateStartChange(e) }} style={{ margin: "0 5px 0 5px" }} />
                            Đến<input type="date" value={timeEnd} onChange={(e) => { handleDateEndChange(e) }} style={{ margin: "0 5px 0 5px" }} />
                            <button onClick={handleSubmit} style={{ borderRadius: "5px", border: "1px solid black", padding: "0 2px" }}>Áp dụng</button></div>
                        {errorChooseDate ? (
                            <label style={{ color: "red" }}>{errorChooseDate}</label>
                        ) : (
                            <label style={{ fontStyle: "italic", fontWeight: "600", fontSize: "12px" }}>*Giới hạn trong 30 ngày</label>
                        )}

                    </div>
                )}
            </div>

            <div style={{ height: '400px' }}>
                {lineNames.length === 0 ? (
                    <div style={{ width: 730, height: 300, textAlign: "center" }}>
                        Chưa bán được vé nào vào khoảng ngày này
                    </div>
                ) : (
                    <LineChart width={730} height={250} data={lineChartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {
                            lineNames.map((line) => (
                                <Line
                                    type="monotone"
                                    dataKey={line}
                                    stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random color
                                />
                            ))
                        }
                    </LineChart>
                )}

            </div>
        </div >
    );
};

export default LineChartReChart;
