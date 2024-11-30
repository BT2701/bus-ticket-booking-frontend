import React, { useEffect, useRef } from "react";
import { Container, Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Button, Paper } from "@mui/material";
import { useLocation } from "react-router-dom";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ApiService from "../Utils/apiService";


const PaymentSuccess = () => {
    const location = useLocation();

    // Lấy query string từ URL
    const query = new URLSearchParams(location.search);

    // Trích xuất các tham số cần thiết
    const orderId = query.get("vnp_OrderInfo");
    const totalPrice = query.get("vnp_Amount");
    const paymentTime = query.get("vnp_PayDate");
    const transactionId = query.get("vnp_TransactionNo");
    const status = query.get("vnp_TransactionStatus");

    const email = localStorage.getItem('email');
    const fullName = localStorage.getItem('name');
    const phone = localStorage.getItem('phone');
    const schedule = JSON.parse(localStorage.getItem('schedule'));
    const seatList = JSON.parse(localStorage.getItem('seats'));
    const hasRun = useRef(false); // Flag để kiểm tra

    useEffect(() => {    
        if (!hasRun.current && transactionId !== null && transactionId !== '0') {
            const savePaymentDetails = async () => {
                const paymentDetails = {
                    email: email,
                    phone: phone,
                    name: fullName,
                    schedule: schedule,
                    seats: seatList,
                    method: "VNPAY",
                    provider: "VNPAY",
                    transactionId: transactionId,
                };
    
                await ApiService.post("/api/vnpay/payment", paymentDetails)
                    .then((response) => {
                        console.log(response);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            };
    
            savePaymentDetails();
            hasRun.current = true; // Đặt flag là true sau khi chạy
        }
    }, []);

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "[payment time]";
        const year = dateTime.substring(0, 4);
        const month = dateTime.substring(4, 6);
        const day = dateTime.substring(6, 8);
        const hour = dateTime.substring(8, 10);
        const minute = dateTime.substring(10, 12);
        const second = dateTime.substring(12, 14);
        return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    };
    const formatCurrency = (amount) => {
        if (!amount) return "[total price]";
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount / 100);
    };
    if (transactionId === null || transactionId === '0'){
        return (
            <Box py={5}>
                <Container maxWidth="sm">
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h4" color="error" gutterBottom>
                            Thanh toán thất bại
                        </Typography>
                        <ErrorOutlineIcon  color="error" style={{ fontSize: 60 }} />
                        <Typography variant="h6">Vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ</Typography>
                    </Box>
                    <Box textAlign="center">
                        <Button variant="contained" color="primary" href="/schedule">
                            Thoát
                        </Button>
                    </Box>
                </Container>
            </Box>
        );
    }
    return (
        <Box py={5}>
            <Container maxWidth="sm">
                <Box textAlign="center" mb={4}>
                    <Typography variant="h4" color="success.main" gutterBottom>
                        Thanh toán thành công
                    </Typography>
                    <CheckCircleOutlineIcon color="success" style={{ fontSize: 60 }} />
                    <Typography variant="h6">Chi tiết đơn hàng</Typography>
                </Box>
                <TableContainer component={Paper} sx={{ mb: 4 }}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Thông tin đơn hàng:</TableCell>
                                <TableCell>{orderId || "[order ID]"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Tổng tiền:</TableCell>
                                <TableCell>{formatCurrency(totalPrice) || "[total price]"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Thời gian thanh toán:</TableCell>
                                <TableCell>{formatDateTime(paymentTime) || "[payment time]"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Mã giao dịch:</TableCell>
                                <TableCell>{transactionId || "[transaction ID]"}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box textAlign="center">
                    <Button variant="contained" color="primary" href="/schedule">
                        Thoát
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default PaymentSuccess;
