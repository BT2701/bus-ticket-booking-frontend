
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "./subComponents/Header";
import StatBox from "./subComponents/StatBox";
import GeographyChart from "./subComponents/GeographyChart";
import BarChart from "./subComponents/BarChart";
import { tokens } from "../utils/theme";
import LineChartReChart from "./LineChartReChart";
import RankRoutes from "./RankRoutes"
import PieChart from "./PieChart"
import { useEffect, useState } from 'react';
import { fetchDataStatusBooking } from "./DataPrepare";
import { convertDataForPieChart } from "./Convertdata";



const AdminStatistics = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  //Chuẩn bị data cho piechart (xem tình trạng vé -đã thanh toan-chua thanh toán)
  const [PieData, setPieData] = useState([]);
  const [total, setToTal] = useState();

  useEffect(() => {
    fetchDataStatusBooking().then((response) => {
      const labels = ["Đã thanh toán", "Chưa thanh toán"];
      console.log("test", response);
      const dataPieChart = convertDataForPieChart(response[0], labels);
      dataPieChart.length !== 0 ? setPieData(dataPieChart) : setPieData([]);
      setToTal(dataPieChart.reduce((acc, item) => acc + item.value, labels.length))
    })
  }, [])

  return (
    <Box margin="0.5rem 1rem">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="BẢNG ĐIỀU KHIỂN" subtitle="Chào mừng đến với bảng điều khiển" />
      </Box>
      {/* Progress bars */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap="1rem !important"
        gridAutoRows="minmax(100px, auto)"
      >
        {/* first Row */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="12,361"
            subtitle="Doanh thu ngày"
            progress="0.75"
            increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="431,225"
            subtitle="Vé đã bán trong ngày"
            progress="0.50"
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="32,441"
            subtitle="Số tuyến đã chạy"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="1,325,134"
            subtitle="Lượng truy cập"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* second row */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          height="60vh !important"
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Thống kê doanh thu
              </Typography>
            </Box>

          </Box>
          <Box height="250px !important">
            <LineChartReChart />
          </Box>
        </Box>
        {/* transactions */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          height="60vh !important"

          className="transaction-container"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            colors={colors.grey[100]}
            p="15px 8px 15px 8px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Tuyến phổ biến theo vé đã bán
            </Typography>
          </Box>
          <RankRoutes />
        </Box>
        {/* third row */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Tình trạng vé
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <div style={{ height: 200, width: '100%' }}>
              <PieChart data={PieData} totalLablel={total} />
            </div>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box >
  );
};

export default AdminStatistics;
