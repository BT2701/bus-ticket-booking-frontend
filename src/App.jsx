import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Static/css/base.css";
import { PageProvider } from "./Context/PageProvider";
import Buses from "./Components/Bus/Bus";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Forgot from "./Components/Auth/Forgot";
import Profile from "./Components/User/Profile";
import Search from "./Components/Search/Search";
import Homepage from "./Components/Home/Homepage";
import Header from "./Components/OutContent/Header";
import Footer from "./Components/OutContent/Footer";
import Contact from "./Components/Contact/Contact";
import About from "./Components/About/About";
import Detail from "./Components/Bus/Detail";
import ScheduleDetail from "./Components/Schedule/ScheduleDetail";
import Payment from "./Components/Payment/Payment";
import Invoice from "./Components/Invoice/TicketLookup";
import { UserProvider, useUserContext } from "./Context/UserProvider";
import { useEffect } from "react";
import ResetPassword from "./Components/Auth/ResetPassword";
import { ScheduleProvider } from "./Context/ScheduleContext";
import HistorySchedules from "./Components/History/HistorySchedules";
import HandleContact from "./Components/Staff/Contact/HandleContact";
import PrintTicket from "./Components/Staff/PrintTicket/PrintTicket";
import { ColorModeContext, useMode } from "./StaffComponents/utils/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

import Test from "./Components/News/NewsPage";
import { FeedbackProvider } from "./Context/FeedbackProvider";
import Dashboard from "./StaffComponents/dashboard/Dashboard";
import Team from "./StaffComponents/team/Team";
import Sidebar from "./StaffComponents/dashboard/gloabal/Sidebar";
import Topbar from "./StaffComponents/dashboard/gloabal/Topbar";
import Driver from "./StaffComponents/driver/Driver";
import Bus from "./StaffComponents/bus/Bus";
import BookingManagement from "./StaffComponents/Booking_Management/Booking_management";
import ScheduleManagement from "./StaffComponents/Schedule_Management/Schedule_Management";

const App = () => {
  const { state } = useUserContext();

  useEffect(() => {

    console.log('State updated:', state);
  }, [state]);


  return (
    <Router>
      <FeedbackProvider>
        <PageProvider>
          <UserProvider>
            <ScheduleProvider>
              <Routes>
                <Route path="/*" element={<MainApp />} />
                <Route path="/staff/*" element={<StaffLayout />}>
                  <Route path="" element={<Dashboard />} />
                  <Route path="users" element={<Team />} />
                  <Route path="drivers" element={<Driver />} />
                  <Route path="buses" element={<Bus />} />
                  <Route path="booking-management" element={<BookingManagement />} />
                  <Route path="schedule-management" element={<ScheduleManagement/>} /> 
                </Route>
              </Routes>
            </ScheduleProvider>
          </UserProvider>
        </PageProvider>
      </FeedbackProvider>
    </Router>
  );
};

const MainApp = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <Routes>
          <Route path="/" element={<Navigate to="/homepage" />} />
          <Route path="/buses" element={<Buses />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/schedule" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/schedule/detail" element={<ScheduleDetail />} />
          <Route path="/schedule/detail/payment" element={<Payment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/invoice" element={<Invoice />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/news" element={<Test />} />
          <Route path="/history" element={<HistorySchedules />} />
          <Route path="/staff/handleContact" element={<HandleContact />} />
          <Route path="/staff/PrintTicket" element={<PrintTicket />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

function StaffLayout() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Topbar />
            <Outlet />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
