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
import Schedule from "./Components/Schedule/Schedule";
import Homepage from "./Components/Home/Homepage";
import Header from "./Components/OutContent/Header";
import Footer from "./Components/OutContent/Footer";
import Contact from "./Components/Contact/Contact";
import About from "./Components/About/About";
import Detail from "./Components/Bus/Detail";
import ScheduleDetail from "./Components/Schedule/ScheduleDetail";

const App = () => {
  return (
    //   <UserProvider>
    <PageProvider>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Navigate to="/login" />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/*" element={<MainApp />} />
        </Routes>
      </Router>
    </PageProvider>

    //   </UserProvider>
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
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/schedule/detail" element={<ScheduleDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
