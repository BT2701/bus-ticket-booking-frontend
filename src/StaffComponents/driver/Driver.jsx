import React, { useEffect, useState } from "react";
import { Box} from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Header from "../dashboard/subComponents/Header";
import "../main.css";
import "./driver.css";
import {viLocaleText} from '../utils/viLocaleText';
import UpdateDriverDialog from "./UpdateDriverDialog";
import ApiService from "../../Components/Utils/apiService";
import AddDriverDialog from "./AddDriverDialog";
import AssignmentDialog from "./AssignmentDialog";
import ScheduleDialog from "./ScheduleDialog ";
import notificationWithIcon from "../../Components/Utils/notification";


function Driver() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
  const [isOpenAssignmentDialog, setIsOpenAssignmentDialog] = useState(false);

  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const handleOpenScheduleDialog = (driverId) => {
    setSelectedDriverId(driverId);
    setOpenScheduleDialog(true);
  };

  const handleCloseScheduleDialog = () => {
    setOpenScheduleDialog(false);
    setSelectedDriverId(null);
  };

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0); 

  useEffect(() => {
    // Gọi API khi component được mount
    const fetchData = async () => {
      try {
        const response = await ApiService.get(`http://localhost:8080/api/drivers?pageNo=${page}&pageSize=${pageSize}&sortBy=id&sortDir=asc`);
        setDrivers(response?.content || []);
        setRowCount(response?.totalElements || 0); 
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, [openDialog, isOpenAddDialog, page, pageSize]);

  const handleClickOpenAddDialog = () => {
    setIsOpenAddDialog(true);
  };
  const handleClickCloseAddDialog = () => {
    setIsOpenAddDialog(false);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleRowClick = (params) => {
    setSelectedDriver(params.row);
  };

  const handleUpdateClick = () => {
    if (selectedDriver) {
      setOpenDialog(true);
    } else {
      notificationWithIcon('warning', 'Cảnh báo', 'Vui lòng chọn dòng muốn chỉnh sửa !');
    }
  };

  const handleClickOpenAssignmentDialog = () => {
    if (selectedDriver  && selectedDriver.id) {
      setIsOpenAssignmentDialog(true);
    } else {
      notificationWithIcon('warning', 'Cảnh báo', 'Vui lòng chọn tài xế muốn phân công !');
    }
  }
  const handleClickCloseAssignmentDialog = () => {
    setIsOpenAssignmentDialog(false);
  }


  const columns = [
    { field: "id", headerName: "ID" },
    { field: "img", headerName: "Ảnh", flex: 1,
      renderCell: (params) => (
        <div style={{ width: "100%", height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src={params?.value !== null ? `http://localhost:8080/api/drivers/avatar/${params?.value}` : "https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko="}
            alt={params?.row?.name}
            style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }} 
          />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Tên",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "phone", headerName: "Số điện thoại", flex: 1 },
    { field: "license", headerName: "Giấy phép lái xe", flex: 1 },
    {
      field: 'schedule',
      headerName: 'Xem lịch trình',
      flex: 1,
      renderCell: (params) => {
          return (
            <button 
              onClick={() => handleOpenScheduleDialog(params.row.id)} 
              className="btn-link success-btn-link" 
              type="button"
            >
              Lịch trình
            </button>
          )
      },
    },
  ];

  return (
    <Box m="0.5rem 1rem">
      <div className="data_table">
        <div className="table-header">
          <Header title="TÀI XẾ" subtitle="Quản lý tài xế" />
          <div className="btnn">
            <button className="primary-btn" type="button" onClick={handleClickOpenAddDialog}>
              Thêm
            </button>
            <button type="button" onClick={handleUpdateClick}>
              Cập nhật
            </button>
            <button type="button" className="success-btn" onClick={handleClickOpenAssignmentDialog}>
              Phân công lái xe
            </button>
          </div>
        </div>

        <DataGrid 
          className="data_grid"
          rows={drivers || []}  
          columns={columns} 
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 20, 30]}
          rowsPerPageOptions={[10]}
          localeText={viLocaleText}
          components={{ Toolbar: GridToolbar }} 
          onRowClick={handleRowClick}
          rowHeight={80}
          paginationMode="server" // Đặt chế độ phân trang là server
          rowCount={rowCount} // Cung cấp tổng số hàng
          paginationModel={{ pageSize: pageSize, page: page }}
          onPaginationModelChange={({ page, pageSize }) => {
            setPage(page);
            setPageSize(pageSize);
          }}
        />

        <UpdateDriverDialog open={openDialog} onClose={handleClose} driver={selectedDriver} />
        <AddDriverDialog open={isOpenAddDialog} onClose={handleClickCloseAddDialog} />
        <AssignmentDialog open={isOpenAssignmentDialog} onClose={handleClickCloseAssignmentDialog} driver={selectedDriver} />
        <ScheduleDialog
          open={openScheduleDialog}
          onClose={handleCloseScheduleDialog}
          driverId={selectedDriverId}
        />
      </div>
    </Box>
  );
}

export default Driver;
