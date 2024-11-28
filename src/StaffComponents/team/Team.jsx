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
import { useUserContext } from "../../Context/UserProvider";
import { Modal } from "antd";
import { convertTimestampToDateReversed } from "../../Components/Utils/TransferDate";
import { getSessionUser } from "../../Components/Utils/authentication";


function Team() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const { state } = useUserContext();

  // const [searchParams, setSearchParams] = useState({
  //   id: "",
  //   name: "",
  //   email: "",
  //   phone: ""
  // });
  // const handleSearch = () => {
  //   if (searchParams.phone && !/^\d{10}$/.test(searchParams.phone)) {
  //     notificationWithIcon('error', 'Lỗi', 'Số điện thoại phải gồm 10 chữ số.');
  //     return;
  //   }
  
  //   if (
  //     searchParams.email &&
  //     !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(searchParams.email)
  //   ) {
  //     notificationWithIcon('error', 'Lỗi', 'Email không hợp lệ.');
  //     return;
  //   }
  
  //   // setPage(0); 
  //   // fetchData(); 
  // };
  // const fetchData = async () => {
  //   try {
  //     const query = new URLSearchParams({
  //       ...searchParams, 
  //       pageNo: page,
  //       pageSize: pageSize,
  //       sortBy: "id",
  //       sortDir: "asc"
  //     }).toString();
  
  //     const response = await ApiService.get(`/api/customers?${query}`);
  //     setUsers(response?.content || []);
  //     setRowCount(response?.totalElements || 0); 
  //   } catch (error) {
  //     console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
  //   }
  // };
  
  const { state: user } = useUserContext();
  const [role, setRole] = useState("");
  useEffect(() => {
    const userId = user.id || null;
    const userSS = getSessionUser();
    if(userId && userSS) {
      ApiService.get('/api/customers/details')
        .then(res => {
            setRole(res?.data?.role.name)
        }).catch((err) => {
            notificationWithIcon('error', 'Lỗi', 'Không thể lấy thông tin tài khoản vì : ' + ((typeof err === 'string') ? err : (err?.response?.data?.message || err?.message)));
        });
    }
  }, [user]);

  useEffect(() => {
    // Gọi API khi component được mount
    const fetchData = async () => {
      try {
        const response = await ApiService.get(
          `/api/customers?pageNo=${page}&pageSize=${pageSize}&sortBy=id&sortDir=asc`
        );

        setUsers(response?.content?.filter(u => u.id !== state?.id) || []);
        setRowCount(response?.totalElements || 0); 
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, [openDialog, page, pageSize]);

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
      notificationWithIcon('warning', 'Cảnh báo', 'Vui lòng chọn dòng muốn chỉnh sửa !');
    }
  };

  const handleLockButton = (userId) => {
    Modal.confirm({
      title: 'Bạn có muốn khóa người dùng có id = ' + userId +' không?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => {
          ApiService.put('/api/customers/lock/' + userId)
          .then((response) => {
              // console.log(response);
    
              setUsers((prevUsers) => 
                prevUsers.map(user => 
                  user.id === userId ? { ...user, active: false } : user
                )
              );
              notificationWithIcon('success', 'Update', 'Đã khóa người dùng có ID: ' + userId);
          })
          .catch((err) => {
              console.log((typeof err === 'string') ? err : (err?.response?.data?.message || err?.message))
              notificationWithIcon('error', 'Lỗi', 'Không thể khóa người dùng vì : ' + ((typeof err === 'string') ? err : (err?.response?.data?.message || err?.message)));
          });
      },
    });
  };

  const handleUnLockButton = (userId) => {
    Modal.confirm({
      title: 'Bạn có muốn mở khóa cho người dùng có id = ' + userId +' không?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => {
        ApiService.put('/api/customers/unlock/' + userId)
        .then((response) => {
            // console.log(response);
  
            setUsers((prevUsers) => 
              prevUsers.map(user => 
                user.id === userId ? { ...user, active: true } : user
              )
            );
            notificationWithIcon('success', 'Update', 'Đã mở khóa cho người dùng có ID: ' + userId);
        })
        .catch((err) => {
            console.log((typeof err === 'string') ? err : (err?.response?.data?.message || err?.message))
            notificationWithIcon('error', 'Lỗi', 'Không thể mở khóa cho người dùng vì : ' + ((typeof err === 'string') ? err : (err?.response?.data?.message || err?.message)));
        });
      },
    });
  };

  const columns = [
    { field: "id", headerName: "ID", headerClassName: 'center-header', cellClassName: 'center-cell' },
    {
      field: "name",
      headerName: "Tên",
      flex: 1,
      cellClassName: "name-column--cell", 
    },
    {
      field: "birth",
      headerName: "Năm sinh",
      flex: 1,
      renderCell: (params) => {
        if (params && params.row && params.row.birth) {
          return <span>{convertTimestampToDateReversed(params.row.birth)}</span>;
        }
  
        return <span>Không xác định</span>;
      },
      headerClassName: 'center-header',
      cellClassName: 'center-cell'
    },
    { 
      field: "phone", 
      headerName: "Số điện thoại", 
      flex: 1,
      headerClassName: 'center-header',
      cellClassName: 'center-cell'
    },
    { 
      field: "address", 
      headerName: "Địa chỉ", 
      flex: 1,
      headerClassName: 'center-header',
      cellClassName: 'center-cell'
    },
    { 
      field: "email", 
      headerName: "Email", 
      flex: 1,
      headerClassName: 'center-header',
      cellClassName: 'center-cell'
    },
    {
      field: "access",
      headerName: "Quyền truy cập",
      flex: 1,
      renderCell: ({ row: { role } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="0.2rem"
            display="flex"
            justifyContent="center"
            backgroundColor={role ? colors.greenAccent[600] : colors.grey[700]}
            borderRadius="5px"
          >
            {role && role.name ? (
              <>
                {role.name === "ADMIN" && <AdminPanelSettingsOutlined />}
                {role.name === "STAFF" && <SecurityOutlined />}
                {role.name === "CUSTOMER" && <LockOpenOutlined />}
                <Typography color={colors.grey[100]} sx={{ ml: "0.2rem" }}>
                  {role.name === "ADMIN" && "Quản trị viên"}
                  {role.name === "CUSTOMER" && "Khách hàng"}
                  {role.name === "STAFF" && "Nhân viên"}
                </Typography>
              </>
            ) : (
              <Typography color={colors.grey[100]} sx={{ ml: "0.2rem" }}>
                Không xác định
              </Typography>
            )}
          </Box>
        );
      },
      headerClassName: 'center-header',
      cellClassName: 'center-cell'
    }
  ];
  
  if (role === "ADMIN") {
    columns.push({
      field: "lock",
      headerName: "Khóa/Mở khóa",
      flex: 1,
      renderCell: (params) => {
        if (params.row.active) {
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
      },
      headerClassName: 'center-header',
      cellClassName: 'center-cell'
    });
  }

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

        {/* <div className="search-container">
          <input 
            type="number" 
            placeholder="Tìm theo ID" 
            value={searchParams.id}
            onChange={(e) => setSearchParams({ ...searchParams, id: e.target.value })}
          />
          <input 
            type="text" 
            placeholder="Tìm theo tên" 
            value={searchParams.name}
            onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
          />
          <input 
            type="text" 
            placeholder="Tìm theo email" 
            value={searchParams.email}
            onChange={(e) => setSearchParams({ ...searchParams, email: e.target.value })}
          />
          <input 
            type="number" 
            placeholder="Tìm theo SĐT" 
            value={searchParams.phone}
            onChange={(e) => setSearchParams({ ...searchParams, phone: e.target.value })}
          />
          <button onClick={handleSearch}>Tìm kiếm</button>
        </div> */}

        <DataGrid
          className="data_grid"
          rows={users}
          columns={columns}
          paginationMode="server" // Đặt chế độ phân trang là server
          rowCount={rowCount} // Cung cấp tổng số hàng
          paginationModel={{ pageSize: pageSize, page: page }}
          onPaginationModelChange={({ page, pageSize }) => {
            setPage(page);
            setPageSize(pageSize);
          }}
          pageSizeOptions={[10, 20, 30]} // Tùy chọn kích thước trang
          localeText={viLocaleText}
          components={{ Toolbar: GridToolbar }}
          onRowClick={handleRowClick}
        />

        <UserDialog open={openDialog} onClose={handleClose} user={selectedUser} role={role} />
      </div>
    </Box>
  );
}

export default Team;
