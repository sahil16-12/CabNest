import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { UserData } from "../context/UserContext";
import {
  CheckIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  DevicePhoneMobileIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const Landing = () => {
  const { isAuth, setIsAuth } = UserData();

  const features = [
    {
      title: "Instant Booking",
      desc: "Get your ride in minutes with our instant booking system",
      icon: ClockIcon,
    },
    {
      title: "Safe Rides",
      desc: "Verified drivers and 24/7 safety monitoring",
      icon: ShieldCheckIcon,
    },
    {
      title: "Fixed Pricing",
      desc: "Know your fare upfront with no surprise charges",
      icon: CurrencyRupeeIcon,
    },
  ];

  const steps = [
    { title: "Choose Ride", desc: "Select from various vehicle options" },
    { title: "Confirm Location", desc: "Pick your pickup and drop points" },
    { title: "Make Payment", desc: "Cashless and secure payment options" },
    { title: "Get Picked Up", desc: "Track your driver in real-time" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1502877338535-766e1452684a"
          alt="Taxi"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ride With Confidence
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Book affordable, safe, and comfortable rides across the city.
            Available 24/7 for your convenience.
          </p>

          {!isAuth && (
            <div className="flex gap-4 justify-center">
              <a
                href="/signup"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Get Started
              </a>
              <a
                href="/login"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all"
              >
                Sign In
              </a>
            </div>
          )}

          {/* Quick Booking Form */}
          <div className="mt-12 max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 text-blue-600" />
                <input
                  type="text"
                  placeholder="Enter pickup location"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1 flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 text-blue-600" />
                <input
                  type="text"
                  placeholder="Enter destination"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose CabNest?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Ride?
          </h2>
          <p className="text-xl mb-8">Download our app for exclusive offers!</p>
          <div className="flex justify-center gap-4">
            <button className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-all">
              <DevicePhoneMobileIcon className="w-6 h-6" />
              App Store
            </button>
            <button className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-all">
              <DevicePhoneMobileIcon className="w-6 h-6" />
              Google Play
            </button>
          </div>
        </div>
      </section> */}

      {/* <Footer /> */}
    </div>
  );
};

export default Landing;
