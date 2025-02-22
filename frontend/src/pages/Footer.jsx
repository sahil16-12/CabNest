import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-8 px-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">About CabNest</h3>
          <p className="text-sm">
            CabNest is your trusted partner for seamless cab booking services.
            Whether you need a ride to the airport or a city tour, we've got you
            covered with reliable and affordable transportation solutions.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-blue-400 transition duration-200"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/pricing"
                className="text-gray-400 hover:text-blue-400 transition duration-200"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-blue-400 transition duration-200"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-gray-400 hover:text-blue-400 transition duration-200"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3">
            <li className="text-gray-400">
              <span className="font-semibold text-white">Phone:</span> +91
              9898557401,
              8866239180
            </li>
            <li className="text-gray-400">
              <span className="font-semibold text-white">Email:</span>{" "}
              sahil16december@gmail.com,
              sahiltarofawala59@gmail.com
            </li>
            <li className="text-gray-400">
              <span className="font-semibold text-white">Address:</span> D-2,
              Al-Saad Park , Anand, India
            </li>
          </ul>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="border-t border-gray-700 mt-8 pt-4">
        <div className="container mx-auto flex justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} CabNest. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition duration-200"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition duration-200"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition duration-200"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition duration-200"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
