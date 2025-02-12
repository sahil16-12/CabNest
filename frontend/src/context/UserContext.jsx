import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import { Toaster, toast } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleError = (error, fallbackMessage) => {
    console.error(error);
    toast.error(error.response?.data?.message || fallbackMessage);
  };

  async function loginUser(email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, {
        email,
        password,
      });
      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      navigate("/home");
    } catch (error) {
      handleError(error, "Login failed.");
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
      localStorage.setItem("activationToken", data.activationToken);
      navigate("/verify");
    } catch (error) {
      handleError(error, "Registration failed.");
    } finally {
      setBtnLoading(false);
    }
  }

  async function verifyOtp(otp, navigate) {
    setBtnLoading(true);
    const activationToken = localStorage.getItem("activationToken");
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp,
        activationToken,
      });
      toast.success(data.message);
      navigate("/login");
      localStorage.clear();
    } catch (error) {
      handleError(error, "OTP verification failed.");
    } finally {
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: { token: localStorage.getItem("token") },
      });
      setUser(data.user);
      setIsAuth(true);
    } catch (error) {
      handleError(error, "Failed to fetch user data.");
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

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
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
