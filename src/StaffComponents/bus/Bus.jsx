import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Header from "../dashboard/subComponents/Header";
import "../main.css";
import "./bus.css";
import {viLocaleText} from '../utils/viLocaleText';
import ApiService from "../../Components/Utils/apiService";
import notificationWithIcon from "../../Components/Utils/notification";
import UpdateBusDialog from "./UpdateBusDialog";
import AddBusDialog from "./AddBusDialog";


function Bus() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [cars, setCars] = useState([]);
  const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.get(`http://localhost:8080/api/buslist?pageNo=${page}&pageSize=${pageSize}&sortBy=id&sortDir=asc`);
        setCars(response?.content || []);
        setRowCount(response?.totalElements || 0); 
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, [openDialog, isOpenAddDialog, openConfirmDialog, page, pageSize]);

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
    setSelectedCar(params.row);
  };

  const handleUpdateClick = () => {
    if (selectedCar) {
      setOpenDialog(true);
    } else {
      alert("Vui lòng chọn dòng muốn chỉnh sửa !");
    }
  };

  const handleDeleteClick = () => {
    if (selectedCar) {
      setOpenConfirmDialog(true);
    } else {
      alert("Vui lòng chọn dòng muốn xóa !");
    }
  };

  const handleConfirmDelete = () => {
    ApiService.delete("/api/buses/" + selectedCar.id).then((res) => {
      notificationWithIcon("success", "Xóa", "Xóa xe thành công!");
      setOpenConfirmDialog(false);
    }).catch(err => {
      notificationWithIcon("error", "Xóa", "Xóa xe thất bại vì : " +  + (err?.response?.data?.message || err?.message));
    });
  };
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "img", headerName: "Ảnh", flex: 1,
      renderCell: (params) => (
        <div style={{ width: "100%", height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src={params.value !== null ? `http://localhost:8080/api/buses/img/${params.value}` : "https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko="}
            alt={params.row.name}
            style={{ width: "60px", height: "60px", borderRadius: "50%" }} // Bạn có thể chỉnh sửa CSS tùy ý
          />
        </div>
      ),
    },
    {
      field: "busnumber",
      headerName: "Biển số xe",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "category-name", headerName: "Loại xe", flex: 1, renderCell: (params) => {
        if(params.row.category.name) {
          return <span>{params.row.category.name}</span>
        } else {
          return <span style={{ color: "blue "}}>Không xác định</span>
        }
      }
    },
    { field: "category-seat-count", headerName: "Số lượng ghế", flex: 1, renderCell: (params) => {
        if(params.row.category.seat_count) {
          return <span>{params.row.category.seat_count}</span>
        } else {
          return <span style={{ color: "blue "}}>Không xác định</span>
        }
      }
    },
    { field: "category-price", headerName: "Giá vé/KM", flex: 1, renderCell: (params) => {
      if(params.row.category.price) {
        return <span>{params.row.category.price}</span>
      } else {
        return <span style={{ color: "blue "}}>Không xác định</span>
      }
    }
  },
    { field: "driver", headerName: "Tài xế của chuyến xe", flex: 1 ,renderCell: (params) => {
      if(params.row.driver && params.row.driver.name) {
        return <span>{params.row.driver.name}</span>
      } else {
        return <span style={{ color: "blue "}}>Xe chưa được chỉ định</span>
      }
    }},
  ];

  return (
    <Box m="0.5rem 1rem">
      <div className="data_table">
        <div className="table-header">
          <Header title="XE" subtitle="Quản lý xe" />
          <div className="btnn">
            <button className="primary-btn" type="button" onClick={handleClickOpenAddDialog}>
              Thêm
            </button>
            <button type="button" onClick={handleUpdateClick}>
              Cập nhật
            </button>
            <button className="error-btn" type="button" onClick={handleDeleteClick}>
              Xóa
            </button>
          </div>
        </div>

        <DataGrid 
          className="data_grid"
          rows={cars || []}  
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

        <UpdateBusDialog open={openDialog} onClose={handleClose} busData={selectedCar} />
        <AddBusDialog open={isOpenAddDialog} onClose={handleClickCloseAddDialog} />

        {/* Xác nhận xóa */}
        <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có muốn xóa xe với id: {selectedCar?.id}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog}>Hủy</Button>
            <Button onClick={handleConfirmDelete} color="primary">Xóa</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Box>
  );
}

export default Bus;
