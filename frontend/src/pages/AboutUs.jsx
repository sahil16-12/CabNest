import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHandsHelping,
  FaRegSmile,
  FaRocket,
  FaCheckCircle,
} from "react-icons/fa";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CabNest
          </h1>
          {/* Optional navigation can be added here */}
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative w-full h-64 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://source.unsplash.com/1600x900/?city,transport')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        <div className="relative z-10 text-center">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            About Us
          </h2>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Discover how CabNest is redefining modern transportation with
            cutting-edge technology and customer-focused solutions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 flex-1">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-5xl w-full mx-auto">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">
            Who We Are
          </h2>
          <p className="text-gray-700 leading-8 text-lg mb-10 text-center">
            Welcome to{" "}
            <span className="font-semibold text-blue-600">CabNest</span>, where
            we transform transportation into a seamless, efficient, and reliable
            experience for everyone.
          </p>

          {/* Vision & Mission */}
          <div className="grid md:grid-cols-2 gap-10 mb-12">
            <div className="flex items-start space-x-4">
              <FaRocket className="text-blue-600 text-4xl" />
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Our Vision
                </h3>
                <p className="text-gray-600 leading-7">
                  To revolutionize urban mobility with innovative and
                  sustainable solutions that empower riders and drivers
                  globally.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <FaCheckCircle className="text-blue-600 text-4xl" />
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Our Mission
                </h3>
                <p className="text-gray-600 leading-7">
                  At CabNest, we strive to:
                  <ul className="list-disc ml-5 mt-3">
                    <li>Deliver hassle-free rides for all.</li>
                    <li>Empower drivers with fair opportunities.</li>
                    <li>
                      Promote trust, safety, and reliability in every journey.
                    </li>
                  </ul>
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center">
            Why Choose CabNest?
          </h3>
          <ul className="grid md:grid-cols-2 gap-8 text-gray-600 mb-10">
            <li className="flex items-center space-x-4">
              <FaHandsHelping className="text-blue-600 text-4xl" />
              <span>24/7 customer support for peace of mind.</span>
            </li>
            <li className="flex items-center space-x-4">
              <FaRegSmile className="text-blue-600 text-4xl" />
              <span>Real-time tracking and transparent pricing.</span>
            </li>
            <li className="flex items-center space-x-4">
              <FaHandsHelping className="text-blue-600 text-4xl" />
              <span>Secure and seamless payment options.</span>
            </li>
            <li className="flex items-center space-x-4">
              <FaRocket className="text-blue-600 text-4xl" />
              <span>Innovative technology for smooth rides.</span>
            </li>
          </ul>

          {/* Call to Action */}
          <p className="text-gray-600 text-lg text-center mb-10">
            Join the{" "}
            <span className="font-semibold text-blue-600">CabNest</span> family
            today to experience transportation redefined.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/")}
              className="relative inline-block px-8 py-3 font-semibold text-lg text-white rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-50 blur-md rounded-lg animate-pulse"></span>
              <span className="relative z-10">Go to Home</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} CabNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
