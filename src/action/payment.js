// import axios from "axios";
// import { toast } from "react-toastify";

// // 🔐 Securely create order and open Razorpay payment
// export const createOrderAndPay = (planType, amount) => async (dispatch) => {
//   try {
//     dispatch({ type: "PAYMENT_REQUEST" });

//     const profile = JSON.parse(localStorage.getItem("Profile"));
//     const token = profile?.token;

//     if (!token) {
//       toast.error("⚠️ Please login to upgrade your plan.");
//       return;
//     }

//     // 🔹 Step 1: Backend creates Razorpay Order
//     const { data } = await axios.post(
//       "http://localhost:5000/api/payment/create-order",
//       { amount, planType },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     // ✅ Step 2: Razorpay Options
//     const options = {
//       key: process.env.REACT_APP_RAZORPAY_KEY, // Your Razorpay test key from .env
//       amount: data.order.amount,
//       currency: "INR",
//       name: "YourTube Premium",
//       description: `Upgrade to ${planType.toUpperCase()} Plan`,
//       order_id: data.order.id,

//       handler: async function (response) {
//         try {
//           // 🔹 Step 3: Verify payment with backend
//           const verifyRes = await axios.post(
//             "http://localhost:5000/api/payment/verify",
//             { ...response, planType },
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );

//           dispatch({ type: "PAYMENT_SUCCESS", payload: { plan: planType } });
//           toast.success(`🎉 ${planType.toUpperCase()} Plan Activated!`);

//           setTimeout(() => {
//             window.location.reload();
//           }, 1000);
//         } catch (error) {
//           dispatch({ type: "PAYMENT_FAIL", payload: error.message });
//           toast.error("❌ Payment verification failed.");
//         }
//       },

//       prefill: {
//         name: profile?.result?.name || "User",
//         email: profile?.result?.email || "",
//       },

//       theme: {
//         color: "#f44336",
//       },
//     };

//     const razorpay = new window.Razorpay(options);
//     razorpay.open();
//   } catch (error) {
//     console.error("💥 Razorpay Init Error:", error.message);
//     dispatch({ type: "PAYMENT_FAIL", payload: error.message });
//     toast.error("❌ Failed to initiate payment.");
//   }
// };


import axios from "axios";
import { toast } from "react-toastify";

// 🔐 Initiate payment & handle full Razorpay flow
export const createOrderAndPay = (planType, amount) => async (dispatch) => {
  try {
    dispatch({ type: "PAYMENT_REQUEST" });

    const profile = JSON.parse(localStorage.getItem("Profile"));
    const token = profile?.token;

    if (!token) {
      toast.error("⚠️ Please login to upgrade your plan.");
      dispatch({ type: "PAYMENT_FAIL", payload: "No auth token" });
      return;
    }

  const base = 'https://yourtube-wtq4.onrender.com';
    // 🧾 Step 1: Create order on backend
    const { data } = await axios.post(
      `${base}/api/payment/create-order`,
      { amount, planType },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // ✅ Step 2: Razorpay config
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "YourTube Premium",
      description: `Upgrade to ${planType.toUpperCase()} Plan`,
      order_id: data.order.id,
      theme: { color: "#f44336" },

      prefill: {
        name: profile?.result?.name || "User",
        email: profile?.result?.email || "user@example.com",
      },

      handler: async (response) => {
        try {
          // 🛡️ Step 3: Verify payment
          const verifyRes = await axios.post(
            `${base}/api/payment/verify`,
            { ...response, planType },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          dispatch({ type: "PAYMENT_SUCCESS", payload: { plan: planType } });
          toast.success(`🎉 ${planType.toUpperCase()} Plan Activated!`);

          // Optional reload or redirect
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } catch (err) {
          console.error("❌ Verification failed:", err.message);
          dispatch({ type: "PAYMENT_FAIL", payload: err.message });
          toast.error("❌ Payment verification failed.");
        }
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (err) {
    console.error("💥 Razorpay Init Error:", err.message);
    dispatch({ type: "PAYMENT_FAIL", payload: err.message });
    toast.error("❌ Failed to initiate payment.");
  }
};
