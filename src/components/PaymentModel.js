import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { cancelPayment, getClientSecret } from "../services/Api";
import { useSnackbar } from "./Helpers/SnackbarContext";
import { ALERTS } from "./Constants/Constants";

function CheckoutForm({ onSuccessPayment }) {
  const showSnackbar = useSnackbar();
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    email: "",
    name: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const paymentResult = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        payment_method_data: {
          billing_details: billingDetails,
        },
      },
    });

    setProcessing(false);

    if (paymentResult.error) {
      showSnackbar(
        `Payment failed: ${paymentResult.error.message}`,
        ALERTS.ERROR
      );
    } else {
      if (paymentResult.paymentIntent.status === "succeeded") {
        showSnackbar("Payment succeeded!", ALERTS.SUCCESS);
        onSuccessPayment();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={billingDetails.email}
          onChange={(e) =>
            setBillingDetails({ ...billingDetails, email: e.target.value })
          }
        />
      </div>

      <div>
        <PaymentElement />
      </div>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Cardholder name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Full name on card"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={billingDetails.name}
          onChange={(e) =>
            setBillingDetails({ ...billingDetails, name: e.target.value })
          }
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {processing ? "Processing..." : "Pay"}
      </button>
      <p className="text-xs text-center text-gray-500">
        You can reach out to us at +1 (361) 983-4923.
      </p>
    </form>
  );
}

export default function PaymentModel({
  isPayOpen,
  handleClose,
  onSuccessPayment,
  orderId,
  paymentItemsList,
  tipAmount,
}) {
  const [clientSecret, setClientSecret] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [stripePromise, setStripePromise] = useState();

  useEffect(() => {
    setStripePromise(loadStripe(process.env.REACT_APP_STRIPE_KEY));
    const fetchClientSecret = async () => {
      const response = await getClientSecret(orderId, tipAmount);
      setClientSecret(response.data.clientSecret);
      setPaymentId(response.data.id);
    };

    fetchClientSecret();
  }, [orderId, tipAmount]);

  return (
    <Dialog
      open={isPayOpen}
      onClose={() => {
        cancelPayment(paymentId);
        handleClose();
      }}
      aria-labelledby="pay-model"
      PaperProps={{
        style: {
          backgroundColor: "#fff8e1",
          borderRadius: "1rem",
          boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
          maxWidth: "800px",
          width: "90%",
        },
      }}
    >
      <DialogTitle id={"pay-model_id"}>
        <IconButton
          aria-label="close"
          onClick={() => {
            cancelPayment(paymentId);
            handleClose();
          }}
          style={{ position: "absolute", right: 16, top: 10 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Payment Summary</h2>
            <div className="text-4xl font-bold mb-6">
              ${" "}
              {paymentItemsList.reduce(
                (acc, item) => acc + Number(item.amount),
                0
              )}
            </div>
            <div className="space-y-4">
              {paymentItemsList.map((item, index) => {
                return (
                  <div className="flex justify-between" key={index}>
                    <div>
                      <div className="font-semibold">{item.label}</div>
                    </div>
                    <div className="font-semibold">${item.amount}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-1">
            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm onSuccessPayment={onSuccessPayment} />
              </Elements>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
