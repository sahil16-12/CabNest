import React from "react";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 px-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center">CabNest</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 lg:px-16">
        <div className="bg-white p-10 rounded-lg shadow-lg max-w-4xl w-full">
          <h2 className="text-4xl font-bold text-blue-600 mb-6 text-center">
            About Us
          </h2>
          <p className="text-gray-700 leading-8 text-lg mb-8 text-center">
            Welcome to{" "}
            <span className="font-semibold text-blue-600">CabNest</span>, your
            trusted partner in modern cab booking solutions. We’re here to make
            transportation seamless, efficient, and reliable for riders and
            drivers alike.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Our Vision */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-7">
                To revolutionize urban mobility by offering innovative,
                sustainable, and user-friendly transportation solutions that
                empower riders and drivers globally.
              </p>
            </div>

            {/* Our Mission */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-7">
                At CabNest, we aim to:
                <ul className="list-disc ml-5 mt-3 text-gray-600">
                  <li>Deliver hassle-free transportation for all.</li>
                  <li>Provide drivers with fair earnings and opportunities.</li>
                  <li>Promote safety, trust, and reliability in every ride.</li>
                </ul>
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Why Choose CabNest?
          </h3>
          <ul className="list-disc ml-5 text-gray-600 mb-6">
            <li>Easy-to-use platform for both riders and drivers.</li>
            <li>Real-time tracking and transparent pricing.</li>
            <li>Secure payment options for convenience.</li>
            <li>24/7 customer support for your peace of mind.</li>
          </ul>

          <p className="text-gray-600 text-lg text-center">
            Join the{" "}
            <span className="font-semibold text-blue-600">CabNest</span> family
            today and experience transportation redefined. We’re committed to
            making every ride safer, better, and more enjoyable.
          </p>

          {/* Back to Home Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold text-lg"
            >
              Go to Home
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4">
        <p>© {new Date().getFullYear()} CabNest. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
