import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
import { useUserContext } from "./Context/UserProvider";
import { useEffect } from "react";
import { getSessionUser } from "./Components/Utils/authentication";
import ResetPassword from "./Components/Auth/ResetPassword";


const App = () => {
  const { dispatch } = useUserContext();
  useEffect(() => {
    const user = getSessionUser();
    dispatch({
      type: 'SET_USER',
      payload: user
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Router>
      <PageProvider>
        <Routes>
          <Route path="/*" element={<MainApp />} />
        </Routes>
      </PageProvider>
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
          <Route path="/schedule/detail/payment" element={<Payment/>}/>
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/invoice" element={<Invoice />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
