import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import { UserData } from "./context/UserContext";
import Register from "./pages/Register";
import Verify from "./pages/Verify";

const App = () => {
  const { isAuth, user, loading } = UserData();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={isAuth ? <Home /> : <Login />} />
        <Route path="/signup" element={isAuth ? <Home /> : <Register />} />
        <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </Router>
  );
};

export default App;
