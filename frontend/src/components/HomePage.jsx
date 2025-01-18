import React from "react";

const HomePage = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-blue-500 text-white py-4 px-6">
        <h1 className="text-2xl font-bold">CabNest</h1>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Welcome to CabNest
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Book a ride or register as a driver to start earning!
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/signup"
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Sign Up
            </a>
            <a
              href="/login"
              className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Login
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
