import React, { useState } from "react";
import axios from "axios";
import { server } from "../main";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TempPay = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkoutHandler = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    const rider_id = "67c17ab4ef1f08fe388e434d";
    const {
      data: { order },
    } = await axios.post(`${server}/api/ride/checkout/${rider_id}`, {});

    const option = {
      key: "rzp_test_RktGm4504pCbPL",
      amount: order.id,
      currency: "INR",
      name: "CabNest",
      description: "Test Transaction",
      image: "../../public/taxi-booking-rgb-color-icon-vector.jpg",
      order_id: order.id,
      handler: async function (response) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
          response;

        try {
          const { data } = await axios.post(
            `${server}/api/ride/verification/${rider_id}`,
            {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            }
          );
          toast.success(data.message);
          setLoading(false);
          navigate(`/payment-successfull/${razorpay_payment_id}`);
        } catch (error) {
          toast.error(error.response.data.message);
          setLoading(false);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(option);
    razorpay.open();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          TempPay
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Click the button below to proceed with the payment
        </p>
        <button
          onClick={checkoutHandler}
          className={`w-full py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md transition-all hover:bg-blue-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Make Payment"}
        </button>
      </div>
    </div>
  );
};

export default TempPay;
