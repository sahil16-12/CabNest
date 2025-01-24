const TaxiLoader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000]">
      <div className="flex flex-col items-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3144/3144794.png"
          alt="Loading taxi"
          className="w-24 h-24 animate-bounce"
        />
        <p className="mt-4 text-white text-lg font-semibold">
          Searching for the best cab for you...
        </p>
      </div>
    </div>
  );
};

export default TaxiLoader;
