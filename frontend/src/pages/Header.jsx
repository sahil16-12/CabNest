import { Link } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { useState } from "react";

const Header = () => {
  const { isAuth, logout, user } = UserData();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white text-gray-800 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-500">
          CabNest
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-500 transition duration-200"
          >
            Home
          </Link>
          <Link
            to="/ride-book"
            className="text-gray-700 hover:text-blue-500 transition duration-200"
          >
            Book a Cab
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-blue-500 transition duration-200"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-blue-500 transition duration-200"
          >
            Contact
          </Link>

          {/* Admin Link */}
          {user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="text-gray-700 hover:text-blue-500 transition duration-200"
            >
              Admin Dashboard
            </Link>
          )}

          {/* User Profile or Auth Links */}
          {isAuth ? (
            <div className="relative">
              {/* Profile Dropdown Trigger */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-gray-700 hover:text-blue-500 transition duration-200 flex items-center gap-1 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Profile
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                  <Link
                    to="/profile-page"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-500 transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-gray-700 hover:text-blue-500 transition duration-200"
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Call-to-Action Button */}
        <Link
          to="/ride-book"
          className="hidden md:inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full transition duration-200"
        >
          Book a Cab
        </Link>

        {/* Mobile Menu Icon */}
        <button
          className="block md:hidden text-gray-700 hover:text-blue-500 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
