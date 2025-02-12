import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import { UserData } from "./context/UserContext";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import HomePage from "./pages/Home";
import SelectCab from "./pages/SelectCab";

import RideRequestPage from "./pages/RideRequestPage";
import RideStatusPage from "./pages/RideStatusPage";

import RiderProfile from "./pages/RiderProfile";
import DriverProfile from "./pages/DriverProfile";


const App = () => {
  const { isAuth, user, loading } = UserData();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/rider-profile" element={<RiderProfile />} />
        <Route path="/driver-profile" element={<DriverProfile />} />
        <Route path="/select-cab" element={<SelectCab />} />
        <Route path="/ride-request" element={<RideRequestPage />} />
        <Route path="/ride-status" element={<RideStatusPage />} />
      </Routes>
    </Router>
  );
};

export default App;
