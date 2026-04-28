// app/orders/[...orderId]/payment-callback/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentFailed from "./components/PaymentFailed";
import PaymentProcessing from "./components/PaymentProcessing";
import PaymentInvalid from "./components/PaymentInvalid";
import { useOrderStore } from "@/stores";

const PaystackCallbackPage = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const { verifyPayment: verifyPaystackPayment } = useOrderStore();
  const [paymentStatus, setPaymentStatus] = useState("processing"); // processing, success, failed, invalid
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const reference =
      searchParams.get("reference") || searchParams.get("trxref");

    // Handle catch-all route: params.orderId is an array
    const orderId = Array.isArray(params.orderId)
      ? params.orderId[0] // Take the first element
      : params.orderId; // Fallback if it's somehow a string

    if (!reference) {
      setPaymentStatus("invalid");
      return;
    }

    if (!orderId) {
      setPaymentStatus("invalid");
      return;
    }

    verifyPayment(orderId, reference);
  }, [searchParams, params]);

  const verifyPayment = async (orderId, reference) => {
    setPaymentStatus("processing");

    try {
      // Call your Zustand store to verify the payment
      const data = await verifyPaystackPayment(orderId, reference);

      // The store already returns the parsed data
      if (data && data.status === "success") {
        setPaymentDetails({
          reference: data.reference,
          amount: data.amount,
          channel: data.channel,
          orderId: orderId,
        });
        setPaymentStatus("success");
      } else {
        setPaymentDetails({
          reference: reference,
          message: data?.message || "Payment verification failed",
        });
        setPaymentStatus("failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setPaymentDetails({
        reference: reference,
        message:
          error?.response?.data?.detail ||
          "Unable to verify payment. Please contact support.",
      });
      setPaymentStatus("failed");
    }
  };

  if (paymentStatus === "processing") {
    return <PaymentProcessing />;
  }

  if (paymentStatus === "invalid") {
    return <PaymentInvalid />;
  }

  if (paymentStatus === "failed") {
    return <PaymentFailed details={paymentDetails} />;
  }

  return <PaymentSuccess details={paymentDetails} />;
};

export default PaystackCallbackPage;
