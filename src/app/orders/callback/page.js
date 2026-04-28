// app/payment/callback/page.jsx or pages/payment/callback.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentFailed from "./components/PaymentFailed";
import PaymentProcessing from "./components/PaymentProcessing";
import PaymentInvalid from "./components/PaymentInvalid";

const PaystackCallbackPage = () => {
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState("processing"); // processing, success, failed, invalid
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref");

    if (!reference && !trxref) {
      setPaymentStatus("invalid");
      return;
    }

    verifyPayment(reference || trxref);
  }, [searchParams]);

  const verifyPayment = async (reference) => {
    setPaymentStatus("processing");

    try {
      // Call your backend to verify the payment
      const response = await fetch(`/api/payments/verify/${reference}`);
      const data = await response.json();

      if (data.status === "success" && data.data.status === "success") {
        setPaymentDetails({
          reference: data.data.reference,
          amount: data.data.amount / 100, // Convert from kobo to naira
          currency: data.data.currency,
          email: data.data.customer?.email,
          orderId: data.data.metadata?.order_id,
          items: data.data.metadata?.items || [],
          paidAt: data.data.paid_at,
          channel: data.data.channel,
          transactionDate: data.data.transaction_date,
        });
        setPaymentStatus("success");
      } else {
        setPaymentDetails({
          reference: reference,
          message: data.message || "Payment verification failed",
        });
        setPaymentStatus("failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setPaymentDetails({
        reference: reference,
        message: "Unable to verify payment. Please contact support.",
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
