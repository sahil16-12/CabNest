import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import { Toaster, toast } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(!!sessionStorage.getItem("token"));
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loginUser(email, password, currentLocation, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, {
        email,
        password,
        currentLocation,
      });
      toast.success(data.message);
      sessionStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      if (data.user.role === "rider") {
        navigate("/");
      } else if (data.user.role === "driver") {
        sessionStorage.setItem("driver", data.user.id);
        console.log("Id is " + data.user.id);
        navigate("/driver-dashboard");
      }
      navigate("/");
    } catch (error) {
      setIsAuth(false);
    } finally {
      setBtnLoading(false);
    }
  }

  async function RegisterUser(name, email, password, role, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, {
        name,
        email,
        role,
        password,
      });
      toast.success(data.message);
      sessionStorage.setItem("activationToken", data.activationToken);
      navigate("/verify");
    } catch (error) {
      // Handle registration error if needed
    } finally {
      setBtnLoading(false);
    }
  }

  async function verifyOtp(otp, navigate) {
    setBtnLoading(true);
    const activationToken = sessionStorage.getItem("activationToken");
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp,
        activationToken,
      });
      toast.success(data.message);
      setUser(data.user);
      sessionStorage.setItem("userId", data.userId);
      if (data.role === "rider") {
        navigate("/rider-profile");
      } else {
        navigate("/driver-profile");
      }
    } catch (error) {
      // Handle OTP verification error if needed
    } finally {
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: { token: sessionStorage.getItem("token") },
      });
      setUser(data.user);
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("activationToken");
    setUser(null);
    setIsAuth(false);
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        loginUser,
        btnLoading,
        loading,
        RegisterUser,
        verifyOtp,
        fetchUser,
        logout,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
