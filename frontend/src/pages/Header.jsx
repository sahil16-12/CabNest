import { Link } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { useState } from "react"; // Import useState for dropdown functionality

const Header = () => {
  const { isAuth, logout } = UserData(); // Destructure logout from UserData
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown

  const handleLogout = () => {
    logout(); // Call the logout function
    setIsDropdownOpen(false); // Close the dropdown
  };

  return (
    <header className="bg-gray-900 text-gray-200 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-400">
          CabNest
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <Link
            to="/"
            className="text-gray-400 hover:text-blue-400 transition duration-200"
          >
            Home
          </Link>
          <Link
            to="/home"
            className="text-gray-400 hover:text-blue-400 transition duration-200"
          >
            Book a Cab
          </Link>
          <Link
            to="/about"
            className="text-gray-400 hover:text-blue-400 transition duration-200"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-400 hover:text-blue-400 transition duration-200"
          >
            Contact
          </Link>

          {isAuth && (
            <div className="relative">
              {/* Profile Dropdown Trigger */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-gray-400 hover:text-blue-400 transition duration-200 flex items-center gap-1 focus:outline-none"
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
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Call-to-Action Button */}
        <Link
          to="/home"
          className="hidden md:inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition duration-200"
        >
          Book a Cab
        </Link>

        {/* Mobile Menu Icon */}
        <button
          className="block md:hidden text-gray-400 hover:text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
