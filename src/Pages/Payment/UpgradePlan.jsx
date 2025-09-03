import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router-dom';
import setcurrentuser from '../../action/currentuser';

const plans = [
  { name: "Bronze", price: 10, watchLimit: "7 mins", id: "bronze" },
  { name: "Silver", price: 50, watchLimit: "10 mins", id: "silver" },
  { name: "Gold", price: 100, watchLimit: "Unlimited", id: "gold" },
];

const UpgradePlan = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.currentuserreducer?.result);
  const currentPlan = user?.plan || "free";
  const token = JSON.parse(localStorage.getItem("Profile"))?.token;

  const handlePayment = async (plan) => {
    if (!user || !token) {
      toast.error("⚠️ Please login to upgrade your plan.");
      return;
    }

    try {
  const base = 'https://yourtube-wtq4.onrender.com';
      const { data } = await axios.post(
        `${base}/api/payment/create-order`,
        { amount: plan.price, planType: plan.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Require a configured Razorpay key to avoid accidental test-mode fallbacks
      const rzpKey = 'rzp_test_RCgWFmNud49T66';
      if (!rzpKey) {
        toast.error("Razorpay key not configured. Set REACT_APP_RAZORPAY_KEY in client .env");
        return;
      }

      const options = {
        key: rzpKey,
        amount: data.order.amount,
        currency: "INR",
        name: "YourTube Premium",
        description: `Upgrade to ${plan.name} Plan`,
        order_id: data.order.id,

        handler: async (response) => {
          try {
            await axios.post(
              `${base}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planType: plan.id,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            // ✅ Update localStorage and Redux
            const updatedProfile = {
              result: { ...user, plan: plan.id },
              token,
            };
            localStorage.setItem("Profile", JSON.stringify(updatedProfile));
            dispatch(setcurrentuser(updatedProfile));

            toast.success(`${plan.name} Plan Activated 🎉`);
            setTimeout(() => window.location.reload(), 1200);
          } catch (err) {
            console.error("❌ Payment verification failed:", err);
            toast.error("❌ Payment verification failed");
          }
        },

        prefill: {
          name: user.name,
          email: user.email,
        },

        theme: { color: "#3ea6ff" },

        modal: {
          ondismiss: () => {
            toast.info("❌ Payment cancelled.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Payment initiation failed:", err);
      toast.error("❌ Payment initiation failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="mb-4 text-start">
        <Link to="/" className="btn btn-outline-primary">
          ← Back to Home
        </Link>
      </div>

      <h2 className="text-center mb-3">🚀 Upgrade Your Plan</h2>
      <p className="text-center mb-4">
        Current Plan: <span className="fw-bold text-primary">{currentPlan.toUpperCase()}</span>
      </p>

      <div className="row justify-content-center">
        {plans.map((plan) => (
          <div className="col-md-4 mb-4" key={plan.id}>
            <div className={`card shadow-sm ${currentPlan === plan.id ? 'border-success' : ''}`}>
              <div className="card-body text-center">
                {currentPlan === plan.id && (
                  <div className="badge bg-success mb-2">Current Plan</div>
                )}
                <h5 className="card-title">{plan.name} Plan</h5>
                <h6 className="card-subtitle mb-2 text-muted">₹{plan.price}</h6>
                <p className="card-text">Watch Time Limit: {plan.watchLimit}</p>

                <button
                  className={`btn ${currentPlan === plan.id ? 'btn-secondary' : 'btn-primary'}`}
                  disabled={currentPlan === plan.id}
                  onClick={() => handlePayment(plan)}
                >
                  {currentPlan === plan.id ? "Current Plan" : "Upgrade"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpgradePlan;
