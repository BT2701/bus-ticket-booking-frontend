import React, { useState, useEffect } from "react";
import { Sidebar as MySidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../utils/theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined"; 
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { Link } from "react-router-dom";
import { useUserContext } from "../../../Context/UserProvider";
import ApiService from "../../../Components/Utils/apiService";
import notificationWithIcon from "../../../Components/Utils/notification";
import ScheduleIcon from '@mui/icons-material/Schedule';
import BookingIcon from '@mui/icons-material/Event';
import PrintIcon from '@mui/icons-material/Print';
import WorkIcon from '@mui/icons-material/Work';


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
        backgroundColor: selected === title ? colors.blueAccent[300] : "transparent", // Change background color when selected
        '&:hover': {
          backgroundColor: selected !== title ? colors.blueAccent[200] : colors.blueAccent[300], // Hover only changes color if not selected
        }
      }}
      onClick={() => setSelected(title)}
      icon={icon}
      component={<Link to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

function Sidebar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState("Bảng điều khiển");
  const { state: user } = useUserContext();
  const [role, setRole] = useState("");

  useEffect(() => {
    const userId = user.id || null;
    if(userId) {
      ApiService.get('/api/customers/details')
        .then(res => {
          setRole(res.data.role.name);
        }).catch((err) => {
            notificationWithIcon('error', 'Lỗi', 'Không thể lấy thông tin tài khoản vì : ' + (err?.response?.data?.message || err?.message));
        });
    }
  }, [user]);

  return (
    <div className="sidebar">
      <Box
        sx={{
          minWidth: isCollapsed ? "auto" : "350px",
          "& .pro-sidebar": {
            backgroundColor: "black !important",
          },
          "& .pro-sidebar-inner": {
            backgroundColor: `${colors.primary[400]} !important`,
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-menu-item.active": {
            color: "#6870fa !important",
          },
          "& .ps-menuitem-root:hover": {
            color: "yellow !important",
          },
        }}
      >
        <MySidebar
          collapsed={isCollapsed}
          backgroundColor={colors.primary[400]}
          height="100vh"
          style={{ height: "100vh" }}
        >
          <Menu
            iconShape="square"
            menuItemStyles={{
              button: {
                [`&:hover`]: {
                  backgroundColor: colors.blueAccent[300],
                },
                [`&.active`]: {
                  backgroundColor: "#fff",
                  color: "#b6c8d9",
                },
              },
            }}
          >
            <MenuItem
              onClick={() => setCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0px 20px 0px",
                color: colors.grey[700],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography variant="h3" color={colors.grey[100]}>
                    ADMIN
                  </Typography>
                  <IconButton onClick={() => setCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {!isCollapsed && (
              <Box mb="25px">
                <Box textAlign="center">
                  <Typography
                    variant="h3"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    {user.name}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="400"
                    color={colors.greenAccent[500]}
                  >
                    {role}
                  </Typography>
                </Box>
              </Box>
            )}
            
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="Bảng điều khiển"
                to="/staff"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0px 5px 20px" }}
              >
                Dữ liệu
              </Typography>
              <Item
                title="Quản lý người dùng"
                to="/staff/users"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Quản lý tài xế"
                to="/staff/drivers"
                icon={<AirlineSeatReclineNormalIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Quản lý xe"
                to="/staff/buses"
                icon={<DirectionsBusIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Quản lý lịch trình"
                to="/staff/schedule-management"
                icon={<ScheduleIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Quản lý đặt vé"
                to="/staff/booking-management"
                icon={<BookingIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="In vé"
                to="/staff/print-ticket"
                icon={<PrintIcon  />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Xử lý liên hệ"
                to="/staff/handle-contact"
                icon={<WorkIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Menu>
        </MySidebar>
      </Box>
    </div>
  );
}

export default Sidebar;
