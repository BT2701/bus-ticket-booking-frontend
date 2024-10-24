import React, { useEffect, useState } from "react";
import { Box, useTheme, Typography} from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { AdminPanelSettingsOutlined } from "@mui/icons-material";
import { LockOpenOutlined } from "@mui/icons-material";
import { SecurityOutlined } from "@mui/icons-material";
import Header from "../dashboard/subComponents/Header";
import { tokens } from "../utils/theme";
import "../main.css";
import "./team.css";
import {viLocaleText} from '../utils/viLocaleText';
import UserDialog from "./UserDialog";
import ApiService from "../../Components/Utils/apiService";
import notificationWithIcon from "../../Components/Utils/notification";


function Team() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Gọi API khi component được mount
    const fetchData = async () => {
      try {
        const response = await ApiService.get("http://localhost:8080/api/customers");
        setUsers(response.data);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, [openDialog]);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleRowClick = (params) => {
    setSelectedUser(params.row);
  };

  const handleUpdateClick = () => {
    if (selectedUser) {
      setOpenDialog(true);
    } else {
      alert("Vui lòng chọn dòng muốn chỉnh sửa !");
    }
  };

  const handleLockButton = (userId) => {
    const confirmLock = window.confirm(`Bạn có chắc chắn muốn khóa người dùng có ID: ${userId}?`);
    if (confirmLock) {
      ApiService.put('/api/customers/lock/' + userId)
      .then((response) => {
          console.log(response);

          setUsers((prevUsers) => 
            prevUsers.map(user => 
              user.id === userId ? { ...user, active: false } : user
            )
          );
          notificationWithIcon('success', 'Update', 'Đã khóa người dùng có ID: ' + userId);
      })
      .catch((err) => {
          console.log(err?.response?.data?.message || err?.message)
          notificationWithIcon('error', 'Lỗi', 'Không thể khóa người dùng vì : ' + (err?.response?.data?.message || err?.message));
      });
    }
  };

  const handleUnLockButton = (userId) => {
    const confirmUnlock = window.confirm(`Bạn có chắc chắn muốn mở khóa người dùng có ID: ${userId}?`);
    if (confirmUnlock) {
      ApiService.put('/api/customers/unlock/' + userId)
      .then((response) => {
          console.log(response);

          setUsers((prevUsers) => 
            prevUsers.map(user => 
              user.id === userId ? { ...user, active: true } : user
            )
          );
          notificationWithIcon('success', 'Update', 'Đã mở khóa cho người dùng có ID: ' + userId);
      })
      .catch((err) => {
          console.log(err?.response?.data?.message || err?.message)
          notificationWithIcon('error', 'Lỗi', 'Không thể mở khóa cho người dùng vì : ' + (err?.response?.data?.message || err?.message));
      });
    }
  };

  // const handleDeleteClick = () => {
  //   if (selectedUser) {
  //     alert("Đã xóa thành công !");
  //   } else {
  //     alert("Vui lòng chọn dòng muốn xóa !");
  //   }
  // };

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Tên",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Tuổi",
      type: "number",
      align: "left",
      headerAlign: "left",
      renderCell: (params) => {
        if (params && params.row && params.row.birth) {
          const birthDate = new Date(params.row.birth);
          const currentYear = new Date().getFullYear();
          const age = currentYear - birthDate.getFullYear();
          
          return <span>{age}</span>;  
        }
        
        return <span>Không xác định</span>;  
      },
    },
    { field: "phone", headerName: "Số điện thoại", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "access",
      headerName: "Quyền truy cập",
      flex: 1,
      renderCell: ({ row: { role } }) => (
        <Box
          width="60%"
          m="0 auto"
          p="0.2rem"
          display="flex"
          justifyContent="center"
          backgroundColor={colors.greenAccent[600]} // Chỉ định màu cho từng role
          borderRadius="5px"
        >
          {role.name === "ADMIN" && <AdminPanelSettingsOutlined />}
          {role.name === "STAFF" && <SecurityOutlined />}
          {role.name === "CUSTOMER" && <LockOpenOutlined />}
          <Typography color={colors.grey[100]} sx={{ ml: "0.2rem" }}>
            {role.name}
          </Typography>
        </Box>
      ),
    },
    { field: "active", headerName: "Trạng thái", flex: 1,
      renderCell: (params) => {
        if (params && params.row && typeof params.row.active === "boolean") {
          if (params.row.active === true) {
            return <span>Hoạt động</span>;
          } else {
            return <span>Bị khóa</span>;
          }
        }
        return <span>Không xác định</span>;
      },
    },
    {
        field: 'lock',
        headerName: 'Khóa/Mở khóa',
        flex: 1,
        renderCell: (params) => {
            if (params && params.row && typeof params.row.active === "boolean") {
              if (params.row.active === true) {
                return (
                  <button 
                    onClick={() => handleLockButton(params.row.id)} 
                    className="btn-link error-btn-link" 
                    type="button">
                    Khóa
                  </button>
                );
              } else {
                return (
                  <button 
                    onClick={() => handleUnLockButton(params.row.id)} 
                    className="btn-link success-btn-link" 
                    type="button">
                    Mở khóa
                  </button>
                );
              }
            }
            return <span>Không xác định</span>;
        },
    },
  ];

  return (
    <Box m="0.5rem 1rem">
      <div className="data_table">
        <div className="table-header">
          <Header title="NGƯỜI DÙNG" subtitle="Quản lý người dùng" />
          <div className="btnn">
            <button type="button" onClick={handleUpdateClick}>
              Cập nhật
            </button>
          </div>
        </div>

        <DataGrid 
          className="data_grid"
          rows={users || []}  // Đảm bảo rằng mockDataTeam không bị null hoặc undefined
          columns={columns} 
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 20, 30]}
          rowsPerPageOptions={[10]}
          localeText={viLocaleText}
          components={{ Toolbar: GridToolbar }} // Hiển thị toolbar với các tùy chọn
          onRowClick={handleRowClick}
        />

        <UserDialog open={openDialog} onClose={handleClose} user={selectedUser} />
      </div>
    </Box>
  );
}

export default Team;
