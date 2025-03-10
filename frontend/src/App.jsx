import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import RideBookPage from "./pages/RideBookPage";
import RideRequestPage from "./pages/RideRequestPage";
import RideStatusPage from "./pages/RideStatusPage";
import RiderProfile from "./pages/RiderProfile";
import DriverProfile from "./pages/DriverProfile";
import DriverStatus from "./pages/DriverStatus";
import ProfilePage from "./pages/ProfilePage";
import DriverDashboard from "./pages/DriverDashboard";
import DriverRideRequests from "./pages/DriverRideRequests";
import RideCompletionPage from "./pages/RideCompleted";
import AdminDashboard from "./pages/AdminDashBoard";
import PaymentSuccess from "./pages/PaymentSuccess";
import DriverDashboardTest from "./pages/DriverDashboardTest";

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
        <Route path="/ride-request" element={<RideRequestPage />} />
        <Route path="/ride-status" element={<RideStatusPage />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/ride-requests" element={<DriverRideRequests />} />
        <Route path="/driver-status" element={<DriverStatus />} />
        <Route path="/profile-page" element={<ProfilePage />} />
        <Route path="/ride-completed" element={<RideCompletionPage />} />
        <Route path="/admin/dashBoard" element={<AdminDashboard />} />
        <Route path="/payment-successfull" element={<PaymentSuccess />} />
        <Route path="/dashboard-test" element={<DriverDashboardTest />} />
        {/* <Route path="/payment-successfull/:id" element={<PaymentSuccess />} /> */}
        <Route path="/ride-waiting" element={<RideWaitingPage />} />
        <Route path="/active-ride" element={<ActiveRidePage />} />
      </Routes>
    </Router>
  );
};

export default App;
