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
import { UserData } from "./context/UserContext";
import { useDriverDashboardC } from "./context/DriverDashboardContext.";

const App = () => {
  const { isAuth, isregistered, isAdmin, user } = UserData();
  if (user?.role == "driver") {
    const { setCurrentDriver } = useDriverDashboardC();
    setCurrentDriver(user);
  }
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
        <Route
          path="/rider-profile"
          element={isregistered ? <RiderProfile /> : <Login />}
        />
        <Route
          path="/driver-profile"
          element={isregistered ? <DriverProfile /> : <Login />}
        />
        <Route
          path="/ride-status"
          element={isAuth ? <RideStatusPage /> : <Login />}
        />
        <Route
          path="/driver-dashboard"
          element={isAuth ? <DriverDashboard user={user} /> : <Login />}
        />
        <Route
          path="/profile-page"
          element={isAuth ? <ProfilePage user={user} /> : <Login />}
        />
        <Route
          path="/admin/dashBoard"
          element={isAuth ? <AdminDashboard /> : <Login />}
        />
        <Route
          path="/payment-successful/:paymentId"
          element={isAuth ? <PaymentSuccess /> : <Login />}
        />
        <Route
          path="/ride-waiting"
          element={isAuth ? <RideWaitingPage /> : <Login />}
        />
        <Route
          path="/active-ride"
          element={isAuth ? <ActiveRidePage /> : <Login />}
        />
      </Routes>
    </Router>
  );
};

export default App;
