// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { server } from "../main";
// import { Toaster, toast } from "react-hot-toast";
// import { useDriver } from "./DriverContext";

// const UserContext = createContext();

// export const UserContextProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuth, setIsAuth] = useState(false);
//   const [isregistered, setIsRegistered] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [btnLoading, setBtnLoading] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const { fetchDriverProfile, driver, setDriver } = useDriver();
//   console.log(user);
//   async function loginUser(email, password, currentLocation, navigate) {
//     setBtnLoading(true);
//     try {
//       const { data } = await axios.post(`${server}/api/user/login`, {
//         email,
//         password,
//         currentLocation,
//       });
//       toast.success(data.message);
//       sessionStorage.setItem("token", data.token);
//       setUser(data.user);
//       console.log(user);
//       setIsAuth(true);
//       sessionStorage.setItem("USER", JSON.stringify(data.user));
//       if (data.user.role === "rider") {
//         sessionStorage.setItem("rider", JSON.stringify(data.user));
//         navigate("/admin/dashboard");
//       } else if (data.user.role === "driver") {
//         const response = await axios.get(
//           `${server}/api/driver/${data.user.id}`
//         );
//         sessionStorage.setItem("driver", JSON.stringify(response.data));
//         const driver2 = response.data;
//         setDriver(driver2);
//         console.log(driver);
//         await fetchDriverProfile(driver2._id);
//         navigate("/driver-dashboard");
//       } else if (data.user.role === "admin") {
//         setIsAdmin(true);
//         navigate("/");
//       }
//     } catch (error) {
//       setIsAuth(false);
//       toast.error("Login failed");
//     } finally {
//       setBtnLoading(false);
//     }
//   }
//   useEffect(() => {
//     const user = JSON.parse(sessionStorage.getItem("USER"));
//     if (user) {
//       setUser(user);
//       setIsAuth(true);
//       if (user.role === "rider") {
//         setIsRegistered(true);
//       } else if (user.role === "driver") {
//         setIsRegistered(true);
//       } else if (user.role === "admin") {
//         setIsAdmin(true);
//       }
//     }
//     setLoading(false);
//   }, [setUser]);
//   async function RegisterUser(name, email, password, role, navigate) {
//     setBtnLoading(true);
//     try {
//       const { data } = await axios.post(`${server}/api/user/register`, {
//         name,
//         email,
//         role,
//         password,
//       });
//       toast.success(data.message);
//       sessionStorage.setItem("activationToken", data.activationToken);
//       navigate("/verify");
//     } catch (error) {
//       // Handle registration error if needed
//     } finally {
//       setBtnLoading(false);
//     }
//   }

//   async function verifyOtp(otp, navigate) {
//     setBtnLoading(true);
//     const activationToken = sessionStorage.getItem("activationToken");
//     try {
//       const { data } = await axios.post(`${server}/api/user/verify`, {
//         otp,
//         activationToken,
//       });
//       toast.success(data.message);
//       setIsRegistered(true);
//       setIsAuth(true);
//       setUser(data.user);
//       sessionStorage.setItem("userId", data.userId);
//       if (data.role === "rider") {
//         navigate("/rider-profile");
//       } else {
//         navigate("/driver-profile");
//       }
//     } catch (error) {
//       // Handle OTP verification error if needed
//     } finally {
//       setBtnLoading(false);
//     }
//   }

//   async function fetchUser() {
//     setLoading(true);
//     try {
//       const { data } = await axios.get(`${server}/api/user/me`, {
//         headers: { token: sessionStorage.getItem("token") },
//       });
//       setUser(data.user);
//       setIsAuth(true);
//     } catch (error) {
//       setIsAuth(false);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const logout = () => {
//     sessionStorage.removeItem("token");
//     sessionStorage.removeItem("userId");
//     sessionStorage.removeItem("activationToken");
//     setUser(null);
//     setIsAuth(false);
//     toast.success("Logged out successfully");
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   return (
//     <UserContext.Provider
//       value={{
//         user,
//         setUser,
//         isAuth,
//         setIsAuth,
//         loginUser,
//         btnLoading,
//         loading,
//         isAdmin,
//         setIsAdmin,
//         isregistered,
//         setIsRegistered,
//         RegisterUser,
//         verifyOtp,
//         fetchUser,
//         logout,
//       }}
//     >
//       {children}
//       <Toaster />
//     </UserContext.Provider>
//   );
// };

// export const UserData = () => useContext(UserContext);
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import { Toaster, toast } from "react-hot-toast";
import { useDriver } from "./DriverContext";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isregistered, setIsRegistered] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { fetchDriverProfile, driver, setDriver } = useDriver();
  console.log(user);
  console.log(userId);
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
      setUserId(data.user.id);

      setIsAuth(true);
      sessionStorage.setItem("USER", JSON.stringify(data.user));
      if (data.user.role === "rider") {
        sessionStorage.setItem("rider", JSON.stringify(data.user));
        navigate("/admin/dashboard");
      } else if (data.user.role === "driver") {
        const response = await axios.get(
          `${server}/api/driver/${data.user.id}`
        );
        sessionStorage.setItem("driver", JSON.stringify(response.data));
        const driver2 = response.data;
        setDriver(driver2);
        console.log(driver);
        await fetchDriverProfile(driver2._id);
        navigate("/driver-dashboard");
      } else if (data.user.role === "admin") {
        setIsAdmin(true);
        navigate("/");
      }
    } catch (error) {
      setIsAuth(false);
      // toast.error("Login failed");
    } finally {
      setBtnLoading(false);
    }
  }
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("USER"));
    if (user) {
      setUser(user);
      setIsAuth(true);
      if (user.role === "rider") {
        setIsRegistered(true);
      } else if (user.role === "driver") {
        setIsRegistered(true);
      } else if (user.role === "admin") {
        setIsAdmin(true);
      }
    }
    setLoading(false);
  }, [setUser]);
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
      setIsRegistered(true);
      setIsAuth(true);
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
        isAdmin,
        setIsAdmin,
        isregistered,
        setIsRegistered,
        RegisterUser,
        verifyOtp,
        fetchUser,
        userId,
        logout,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
