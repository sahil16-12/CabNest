import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const RideWaitingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ride } = location.state || {};
  const initialDriver = location.state?.driver || null;
  const initialOtp = location.state?.otp || null;

  const [status, setStatus] = useState("waiting"); // waiting | accepted | rejected
  const [otp, setOtp] = useState(initialOtp);
  const [driverDetails, setDriverDetails] = useState(initialDriver);
  const [socket, setSocket] = useState(null);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const funFacts = [
    "Did you know? The first taxi was a horse-drawn carriage! 🐎",
    "Fun Fact: In ancient Rome, chariots were the taxi service of the day! 🏛️",
    "Did you know? Self-driving cars are already being tested in many cities. 🤖",
    "Fun Fact: The term 'taxicab' comes from 'taximeter' and 'cabriolet'. 📝",
    "Did you know? The world's first ridesharing app launched in 2009! 📱",
    "Fun Fact: Electric vehicles produce zero tailpipe emissions! 🌱",
    "Did you know? The average driver spends 310 hours per year behind the wheel! ⏱️",
    "Fun Fact: The first speeding ticket was issued in 1896 at 8 mph! 🎫",
  ];

  // Cycle through fun facts
  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % funFacts.length);
    }, 5000);

    return () => clearInterval(factInterval);
  }, []);

  useEffect(() => {
    // Initialize WebSocket connection to your server
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Register rider with the WebSocket server using sessionStorage info
    const rider = JSON.parse(sessionStorage.getItem("rider"));
    if (rider) {
      newSocket.emit("register-rider", rider.id);
    }

    // Listen for ride request responses from the server
    newSocket.on("ride-request-response", (data) => {
      // Check if the response corresponds to our ride
      if (data.ride._id !== ride?._id) return;
      if (data.response === "accepted") {
        setStatus("accepted");
        setOtp(data.otp);
        setDriverDetails(data.recipient);
      } else if (data.response === "rejected") {
        setStatus("rejected");
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [ride]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 p-6">
      {status === "waiting" && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full overflow-hidden relative">
          {/* Car moving animation at top */}
          <div className="h-24 bg-gray-100 rounded-xl mb-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-300"></div>
            <div
              className="absolute top-0 left-0 w-full h-1 bg-gray-300"
              style={{ top: "33%" }}
            ></div>
            <div
              className="absolute top-0 left-0 w-full h-1 bg-gray-300"
              style={{ top: "66%" }}
            ></div>
            <div className="h-12 w-16 bg-blue-500 rounded-md absolute top-6 animate-car-move flex items-center justify-center">
              <span className="text-2xl">🚗</span>
            </div>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="animate-bounce mx-2 text-3xl">⏳</div>
              <div className="animate-pulse mx-2 text-3xl delay-75">🔍</div>
              <div className="animate-bounce mx-2 text-3xl delay-150">🚕</div>
            </div>

            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Looking for your perfect ride...
            </h2>

            <div className="flex justify-center space-x-2 mb-4">
              <span className="animate-pulse delay-0 text-xl">·</span>
              <span className="animate-pulse delay-150 text-xl">·</span>
              <span className="animate-pulse delay-300 text-xl">·</span>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-6 border-l-4 border-blue-500">
              <p className="text-gray-700 italic">
                {funFacts[currentFactIndex]}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                alt="location pin"
                className="w-6 h-6 mr-2"
              />
              <p className="text-gray-600">
                Finding drivers near your location
              </p>
            </div>

            <div className="mt-6 flex justify-center items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping mr-2"></div>
              <p className="text-sm text-gray-500">Your request is active</p>
            </div>
          </div>
        </div>
      )}

      {status === "accepted" && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">✅</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">
            Awesome! Ride Accepted! 🎉
          </h2>

          {driverDetails && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">👨‍✈️</span>
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {driverDetails._id.name}
                  </p>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★★★★★</span>
                    <span className="text-sm text-gray-500">
                      {driverDetails.overallRating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-2">
                <span className="text-xl mr-3">🚘</span>
                <p className="text-gray-700">
                  <span className="font-medium">Vehicle:</span>{" "}
                  {driverDetails.vehicleMake}
                </p>
              </div>

              <div className="flex items-center">
                <span className="text-xl mr-3">📱</span>
                <p className="text-gray-700">
                  <span className="font-medium">Contact:</span>{" "}
                  {driverDetails.phoneNumber}
                </p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
            <p className="text-center text-gray-700 mb-2">Your OTP</p>
            <div className="flex justify-center space-x-2">
              {otp && (
                <div className="w-12 h-14 bg-white rounded-lg shadow-md flex items-center justify-center border-2 border-blue-300">
                  <span className="text-2xl font-bold text-blue-600">
                    {otp}
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Share this code with your driver
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/ride-status", {
                state: { ride, driver: driverDetails, otp },
              })
            }
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition duration-300 flex items-center justify-center"
          >
            <span className="mr-2">🚀</span>
            Proceed to Ride
          </button>
        </div>
      )}

      {status === "rejected" && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">😕</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
            Ride Request Declined
          </h2>

          <div className="bg-red-50 rounded-xl p-4 mb-6 border-l-4 border-red-400">
            <p className="text-gray-700">
              Don't worry! Drivers may be busy or unavailable. Let's find you
              another ride!
            </p>
          </div>

          <button
            onClick={() => navigate("/ride-book")}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition duration-300 flex items-center justify-center"
          >
            <span className="mr-2">🔍</span>
            Find Another Ride
          </button>
        </div>
      )}

      {/* Custom animation for car movement */}
      <style>{`
        @keyframes carMove {
          0% { left: -40px; }
          100% { left: calc(100% + 40px); }
        }
        .animate-car-move {
          animation: carMove 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RideWaitingPage;
