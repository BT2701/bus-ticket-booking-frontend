import React, { useEffect } from "react";
import { Sidebar as MySidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../utils/theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../../../Context/UserProvider";
import ApiService from "../../../Components/Utils/apiService";
import notificationWithIcon from "../../../Components/Utils/notification";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
      component={<Link to={to} />}
    >
      <Typography>{title}</Typography>

      <Link to={to} />
    </MenuItem>
  );
};

function Sidebar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState("dashboard");
  const { state: user } = useUserContext();
  const [role, setRole] = useState("");

  useEffect(() => {
    console.log(user);
    const userId = user.id || null;
    if(userId) {
      ApiService.get('/api/customers/details')
        .then(res => {
          setRole(res.data.role.name);
        }).catch((err) => {
            notificationWithIcon('error', 'Lỗi', 'Không thể đăng xuất tài khoản vì : ' + (err?.response?.data?.message || err?.message));
        });
    }
  }, [user])

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
          "& .pro-inner-item": {
            // padding: "5px 35px 5px 20px !important",
          },
          "& .pro-inner-item:hover": {
            // color: `${colors.grey[700]} !important`,
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
                title="Quản lý tài khoản"
                to="/staff/team"
                icon={<PeopleOutlinedIcon />}
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
