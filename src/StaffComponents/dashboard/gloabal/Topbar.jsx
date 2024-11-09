import React from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import {  tokens } from "../../utils/theme";
import { Home, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import notificationWithIcon from "../../../Components/Utils/notification";
import { removeSessionAndLogoutUser } from "../../../Components/Utils/authentication";
import { useUserContext } from "../../../Context/UserProvider";
import ApiService from "../../../Components/Utils/apiService";

export default function Topbar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const { dispatch } = useUserContext();

  const handleLogout = () => {
    ApiService.post('/api/customers/logout')
      .then((response) => {
          removeSessionAndLogoutUser();
          dispatch({
              type: 'LOGOUT_USER'
          });

          notificationWithIcon('success', 'Logout', 'Đăng xuất tài khoản thành công!');
          navigate("/login");
      })
      .catch((err) => {
          notificationWithIcon('error', 'Lỗi', 'Không thể đăng xuất tài khoản vì : ' + (err?.response?.data?.message || err?.message));
      });
  }

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
      </Box>
      <Box display="flex">
        {/* <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlined />
          ) : (
            <DarkModeOutlined />
          )}
        </IconButton> */}
        <IconButton onClick={() => navigate("/homepage")}>
          <Home />
        </IconButton>
        <IconButton onClick={handleLogout}>
          <Logout />
        </IconButton>
      </Box>
    </Box>
  );
}
