import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserData } from "../context/UserContext";
import {
  CheckIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/20/solid";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const Landing = () => {
  const { isAuth, logout, user } = UserData();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const features = [
    {
      title: "Instant Booking",
      desc: "Get your ride in minutes with our instant booking system",
      icon: ClockIcon,
      color: "bg-blue-100",
    },
    {
      title: "Safe Rides",
      desc: "Verified drivers and 24/7 safety monitoring",
      icon: ShieldCheckIcon,
      color: "bg-green-100",
    },
    {
      title: "Fixed Pricing",
      desc: "Know your fare upfront with no surprise charges",
      icon: CurrencyRupeeIcon,
      color: "bg-purple-100",
    },
  ];

  const steps = [
    { title: "Choose Ride", desc: "Select from various vehicle options" },
    { title: "Confirm Location", desc: "Pick your pickup and drop points" },
    { title: "Make Payment", desc: "Cashless and secure payment options" },
    { title: "Get Picked Up", desc: "Track your driver in real-time" },
  ];

  const testimonials = [
    {
      text: "Best cab service I've ever used! The app is so intuitive and drivers are always professional.",
      author: "Sarah Johnson",
      role: "Frequent Traveler",
    },
    {
      text: "Reliable and affordable. Their premium vehicles are worth every penny!",
      author: "Michael Chen",
      role: "Business Executive",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              CabNest
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/ride-book"
                className="hover:text-blue-600 transition-colors font-medium"
              >
                Book Ride
              </Link>
              <Link
                to="/about"
                className="hover:text-blue-600 transition-colors font-medium"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="hover:text-blue-600 transition-colors font-medium"
              >
                Contact
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Admin
                </Link>
              )}

              {isAuth ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <UserCircleIcon className="w-6 h-6" />
                    <ChevronDownIcon className="w-4 h-4 mt-0.5" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2">
                      <Link
                        to="/profile-page"
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-1/2"
            >
              <h1 className="text-5xl font-bold leading-tight mb-6">
                Premium Cab Service in{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Your City
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Experience luxury travel with our premium fleet and professional
                chauffeurs. Available 24/7 for your convenience.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/ride-book"
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-transform hover:scale-105"
                >
                  Book Now
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 bg-white text-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative z-10 transform hover:rotate-3 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1559136555-9303baea8ebd"
                  alt="Luxury Cab"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">5000+</p>
                      <p className="text-gray-600">Happy Customers</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Why Choose CabNest?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the perfect blend of comfort, safety, and reliability in
              every ride
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="p-8 rounded-2xl hover:shadow-xl transition-all cursor-pointer group"
              >
                <div
                  className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}
                >
                  <feature.icon className="w-8 h-8 text-gray-900" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get your ride in just 4 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl text-center hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied
              customers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-2xl relative"
              >
                <div className="absolute top-0 left-8 -translate-y-1/2 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center">
                  “
                </div>
                <p className="text-gray-600 mb-6">{testimonial.text}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-white font-bold mb-4">CabNest</h3>
              <p className="text-sm">
                Revolutionizing urban mobility with premium transportation
                solutions.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Services</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/ride-book" className="hover:text-white">
                    City Rides
                  </Link>
                </li>
                <li>
                  <Link to="/ride-book" className="hover:text-white">
                    Airport Transfer
                  </Link>
                </li>
                <li>
                  <Link to="/ride-book" className="hover:text-white">
                    Corporate Travel
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/safety" className="hover:text-white">
                    Safety Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} CabNest. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
