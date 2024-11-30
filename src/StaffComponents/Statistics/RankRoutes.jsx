import React from 'react';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import { Box, IconButton, Typography, useTheme, Button } from "@mui/material";
import { tokens } from "../utils/theme";
import { validateDateForStatisticst } from './Validation';
import "./LineChartReChart.css"
import axios from 'axios';
import { useEffect, useState } from 'react';
import ApiService from "../../Components/Utils/apiService";
const RankRoutes = () => {
    const theme = useTheme();
    const [routesData, setRoutesData] = useState([]);
    const [timeStart, setTimeStart] = useState(new Date().toISOString().split('T')[0]);
    const [timeEnd, setTimeEnd] = useState(new Date().toISOString().split('T')[0]);
    //Xử lý lỗi.
    const [errorChooseDate, setErrorChooseDate] = useState("");

    // Styled TableCell
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));


    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Generates random color
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    //Check lỗi mỗi khi chọn ngày 
    useEffect(() => {
        setErrorChooseDate(validateDateForStatisticst(timeStart, timeEnd));
        const fetchData = async () => {
            try {
                const response = await ApiService.get(`/api/statistic/tuyenxephobien/${timeStart}/${timeEnd}`);
                if (response) {
                    console.log("data test ", response);
                    response && response.length !== 0 ? setRoutesData(response) : setRoutesData([]);
                }

            } catch (error) {
                setRoutesData([]);
                console.error("Error fetching data:", error);
            }
        };
        validateDateForStatisticst(timeStart, timeEnd) === "" ? fetchData() : setRoutesData([]);
    }, [timeStart, timeEnd])

    const handleDateStartChange = (event) => {
        setTimeStart(event.target.value);
    }

    const handleDateEndChange = (event) => {
        setTimeEnd(event.target.value);
    }

    const handleReset = () => {
        setTimeStart(new Date().toISOString().split('T')[0]);
        setTimeEnd(new Date().toISOString().split('T')[0]);
    }




    return (
        <div>
            <div style={{ padding: "8px" }}>
                <div style={{ padding: "0 0 10px 0" }}>
                    <div>
                        Từ<input type="date" value={timeStart} onChange={(e) => { handleDateStartChange(e) }} style={{ margin: "0 5px 0 5px" }} className={errorChooseDate ? 'isError' : ""} min="1000-01-01" max="9999-12-31" />
                        Đến<input type="date" value={timeEnd} onChange={(e) => { handleDateEndChange(e) }} style={{ margin: "0 5px 0 5px" }} className={errorChooseDate ? 'isError' : ""} min="1000-01-01" max="9999-12-31" />
                        <button onClick={handleReset} className='btn-for-all'>Làm mới</button>
                    </div>
                    {errorChooseDate ? (
                        <label className='text-noted text-noted-isError'>{errorChooseDate}</label>
                    ) : (
                        <label className='text-noted'>Lưu ý: Được giới hạn trong 30 ngày</label>
                    )}
                </div>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <TableContainer component={Paper} sx={{ maxHeight: 280, overflowY: 'auto' }}>
                        <Table sx={{
                            width: "100%",
                            borderSpacing: "0",
                            border: "2px solid black",
                            borderCollapse: "collapse"
                        }} aria-label="customized table">
                            <TableHead sx={{ position: "sticky", top: "0px" }}>
                                <TableRow>
                                    <StyledTableCell sx={{ width: '10%', textAlign: 'center' }}>Xếp hạng</StyledTableCell>
                                    <StyledTableCell align="left" sx={{ width: '60%' }}>Tên tuyến</StyledTableCell>
                                    <StyledTableCell align="center" sx={{ width: '30%' }}>Số lượng vé đã bán</StyledTableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {routesData.length === 0 ? (
                                    <TableRow>
                                        <StyledTableCell colSpan={3} sx={{ textAlign: "center", height: 200 }}>
                                            Chưa bán được vé nào vào khoảng ngày này
                                        </StyledTableCell>
                                    </TableRow>
                                ) : (
                                    routesData.map((row) => (
                                        <StyledTableRow key={row.routeId}>
                                            <StyledTableCell align="center" component="th" scope="row">
                                                {row.rank}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {`${row.fromAddress} - ${row.toAddress}`}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{row.quantityTicket}</StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>


                </Box>
            </div>
        </div >

    );
}


export default RankRoutes;