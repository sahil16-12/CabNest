import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import RideBookPage from "./pages/RideBookPage";
import RideStatusPage from "./pages/RideStatusPage";
import RiderProfile from "./pages/RiderProfile";
import DriverProfile from "./pages/DriverProfile";
import ProfilePage from "./pages/ProfilePage";
import DriverDashboard from "./pages/DriverDashboard";
import AdminDashboard from "./pages/AdminDashBoard";
import PaymentSuccess from "./pages/PaymentSuccess";
import RideWaitingPage from "./pages/RideWaitingPage";
import ActiveRidePage from "./pages/ActiveRidePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ride-book" element={<RideBookPage />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/rider-profile" element={<RiderProfile />} />
        <Route path="/driver-profile" element={<DriverProfile />} />
        <Route path="/ride-status" element={<RideStatusPage />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/profile-page" element={<ProfilePage />} />
        <Route path="/admin/dashBoard" element={<AdminDashboard />} />
        <Route
          path="/payment-successful/:paymentId"
          element={<PaymentSuccess />}
        />
        <Route path="/ride-waiting" element={<RideWaitingPage />} />
        <Route path="/active-ride" element={<ActiveRidePage />} />
      </Routes>
    </Router>
  );
};

export default App;
