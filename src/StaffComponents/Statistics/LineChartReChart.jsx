import { convertDataForLineChartRechar, transformDataForLineChartMutil } from './Convertdata';
import React, { useEffect, useState } from 'react';
import { tokens } from "../utils/theme";
import { useTheme } from "@mui/material";
import { LineChart, Line, Legend, Tooltip, YAxis, XAxis, CartesianGrid } from 'recharts';
import { validateDateForStatisticst } from './Validation';
import "./LineChartReChart.css";
import ApiService from "../../Components/Utils/apiService";
const LineChartReChart = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    //Data cho line chart 
    const [lineChartData, setLineChartData] = useState([]);

    //giá trị mặc định cho thời gian(doanh thu theo ngày, tuần, tháng) 
    //giá trị mặc định cho loại doanh thu (doanh thu hệ thống, doanh thu theo loại xe, doanh thu theo tuyến xe)
    //giá trị mặc định cho sô lượng thời gian (bao nhiêu ngày, bao nhiêu tuần, bao nhiêu tháng)
    const [typeRevenue, setTypeRevenue] = useState("doanhthuhethong");
    const [typeTime, setTypeTime] = useState("doanhthutheongay");
    const [defaultTime, setDefaultTime] = useState(7); //mới vào trang luôn luôn thời gian là ngày, và mặc định là 7 ngày

    //Dành cho trường hợp người chọn tùy chọn (họ sẽ chọn ngày để xem thống kê doanh thu).
    const [timeStart, setTimeStart] = useState(new Date().toISOString().split('T')[0]);
    const [timeEnd, setTimeEnd] = useState(new Date().toISOString().split('T')[0]);

    //Định nghĩa mảng chứa tên của line(đường) trong line chart. 
    const [lineNames, setLineNames] = useState([]);

    //Xử lý lỗi.
    const [errorChooseDate, setErrorChooseDate] = useState(null);

    useEffect(() => {
        // Không thực hiện gì nếu typeTime là "doanhthutuychon"
        if (typeTime === "doanhthutuychon") {
            return;
        }
        // Fetch data from backend API
        const fetchData = async () => {
            try {
                const response = await ApiService.get(`/api/statistic/${typeRevenue}/${typeTime}/${defaultTime}`);
                if (response) {
                    const transformedData = typeRevenue === "doanhthuhethong" ? convertDataForLineChartRechar(response, typeTime) : transformDataForLineChartMutil(response);
                    setLineChartData(transformedData);
                    const objectWithMostFields = transformedData.reduce((maxObj, currentObj) => {
                        return Object.keys(currentObj).length > Object.keys(maxObj).length ? currentObj : maxObj;
                    }, {});
                    setLineNames(Object.keys(objectWithMostFields).filter(key => key !== "name"));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [typeRevenue, typeTime, defaultTime]);

    const handleDropdownChange = (event) => {
        //set giá trị select
        setTypeTime(() => {
            const selected = event.target.value;
            if (selected === "doanhthutuychon")
                setLineNames([]);
            event.target.value === "doanhthutheongay" ? setDefaultTime(7) : setDefaultTime(3);// 3 là giá trị 3 tháng.
            return event.target.value
        }
        );
    };

    const handleDropdownChange1 = (event) => {
        setTypeRevenue(event.target.value);
    }

    const handleDateStartChange = (event) => {
        setTimeStart(event.target.value);
    }

    const handleDateEndChange = (event) => {
        setTimeEnd(event.target.value);
    }

    const handleSubmit = () => {
        setErrorChooseDate(validateDateForStatisticst(timeStart, timeEnd));
        //make retuest
        const fetchData = async () => {
            try {
                const response = await ApiService.get(`/api/statistic/${typeRevenue}/${typeTime}/${timeStart}/${timeEnd}`);
                if (response) {
                    const transformedData = typeRevenue === "doanhthuhethong" ? convertDataForLineChartRechar(response, typeTime) : transformDataForLineChartMutil(response);

                    setLineChartData(transformedData);
                    const objectWithMostFields = transformedData.reduce((maxObj, currentObj) => {
                        return Object.keys(currentObj).length > Object.keys(maxObj).length ? currentObj : maxObj;
                    }, {});
                    setLineNames(Object.keys(objectWithMostFields).filter(key => key !== "name"));
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        validateDateForStatisticst(timeStart, timeEnd) === "" ? fetchData() : setLineNames([]);
    };


    return (
        <div>
            <div style={{ marginLeft: "30px", padding: "15px 0 30px 0" }}>
                {/* Dropdown */}
                <select value={typeRevenue} onChange={handleDropdownChange1} className='select-for-all' style={{ margin: "0 5px 5px 0" }}>
                    <option value="doanhthuhethong">Doanh thu hệ thống</option>
                    <option value="doanhthutheotuyen">Doanh thu theo tuyến</option>
                    {/* <option value="doanhthutheoloaixe">Doanh thu theo loại xe</option> */}
                </select>
                {/* Dropdown */}
                <select value={typeTime} className='select-for-all' onChange={handleDropdownChange}>
                    <option value="doanhthutheongay">Doanh thu ngày</option>
                    {/* <option value="donhthutheotuan">Doanh thu tuần</option> */}
                    <option value="doanhthutheothang">Doanh thu tháng</option>
                    <option value="doanhthutuychon">Tùy chọn</option>
                </select>

                {typeTime === "doanhthutheongay" && (
                    <div>
                        <button onClick={() => setDefaultTime(7)} className={defaultTime === 7 ? "isSelected btn-for-all" : "btn-for-all"}>7 ngày</button>
                        <button style={{ margin: "0 3px" }} onClick={() => setDefaultTime(14)} className={defaultTime === 14 ? "isSelected btn-for-all" : "btn-for-all"}>14 ngày</button>
                        <button onClick={() => setDefaultTime(30)} className={defaultTime === 30 ? "isSelected btn-for-all" : "btn-for-all"}>30 ngày</button>
                    </div>
                )}

                {typeTime === "doanhthutheothang" && (
                    <div>
                        <button onClick={() => setDefaultTime(3)} className={defaultTime === 3 ? "isSelected btn-for-all" : "btn-for-all"}>3 thang</button>
                        <button style={{ margin: "0 3px" }} onClick={() => setDefaultTime(6)} className={defaultTime === 6 ? "isSelected btn-for-all" : "btn-for-all"}>6 thang</button>
                        <button onClick={() => setDefaultTime(12)} className={defaultTime === 12 ? "isSelected btn-for-all" : "btn-for-all"}>12 thang</button>
                    </div>
                )}
                {typeTime === "doanhthutuychon" && (
                    <div >
                        <div>  Từ<input type="date" value={timeStart} onChange={(e) => { handleDateStartChange(e) }} className={errorChooseDate ? 'isError' : ""} style={{ margin: "0 5px 0 5px" }} />
                            Đến<input type="date" value={timeEnd} onChange={(e) => { handleDateEndChange(e) }} className={errorChooseDate ? 'isError' : ""} style={{ margin: "0 5px 0 5px" }} />
                            <button onClick={handleSubmit} className='btn-for-all'>Áp dụng</button></div>
                        {errorChooseDate ? (
                            <label className='text-noted text-noted-isError'>{errorChooseDate}</label>
                        ) : (
                            <label className='text-noted'>*Giới hạn trong 30 ngày</label>
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
                            lineNames.map((line, key) => (
                                <Line
                                    key={key}
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
