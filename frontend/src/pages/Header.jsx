import { Link } from "react-router-dom";

const Header = () => {
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
