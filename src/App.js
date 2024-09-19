import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Buses from './Components/Bus/Bus';
import Login from './Components/LRF/Login';
import Register from './Components/LRF/Register';
import Forgot from './Components/LRF/Forgot';
import Profile from './Components/User/Profile';
import Statistic from './Components/Statistic/Statistic';
import Schedule from './Components/Schedule/Schedule';
import Homepage from './Components/Home/Homepage';
import Header from './Components/OutContent/Header';
import Footer from './Components/OutContent/Footer';



const App = () => {
  return (
      <UserProvider>
      <CartProvider>
      <Router>
          <Routes>
              {/* <Route path="/" element={<Navigate to="/login" />} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot" element={<Forgot/>}/>
              <Route path="/*" element={<MainApp />} />
          </Routes>
      </Router>
      </CartProvider>
      </UserProvider>
  );
};

const MainApp = () => {
  return (
      <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex flex-grow">
              <Routes>
                  <Route path="/" element={<Navigate to="/homepage" />} />
                  <Route path='/buses' element={<Bus />}/>
                  <Route path='/profile' element={<Profile />}/>
                  <Route path='/statistic' element={<Statistic />}/>
                  <Route path='/profile' element={<Profile />}/>
                  <Route path='/schedule' element={<Schedule />}/>
                  <Route path='/homepage' element={<Homepage />}/>                  
              </Routes>
          </div>
          <Footer />
      </div>
  );
};

export default App;

