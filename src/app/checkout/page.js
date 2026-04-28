// app/checkout/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useCartStore } from "@/stores";
import { useOrderStore } from "@/stores";
import OrderSummary from "./components/OrderSummary";
import ShippingForm from "./components/ShippingForm";
import PaymentSummary from "./components/PaymentSummary";
import DeliverySelector from "./components/DeliverySelector";
import { ShoppingCart, ArrowLeft, Loader2, Loader } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { isAuthenticated } from "../../../lib/axiosInstance";

const CheckoutPage = () => {
  const router = useRouter();
  const { userCart, loadingCart, fetchCart } = useCartStore();
  const { createOrderWithPayment, loadingMutation } = useOrderStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    deliveryCompanyId: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/cart");
      return;
    }
    fetchCart();
  }, [isAuthenticated]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!loadingCart && userCart.length === 0 && !isProcessing) {
      toast.info("Your cart is empty");
      router.push("/cart");
    }
  }, [userCart, loadingCart]);

  const calculateSubtotal = () => {
    return userCart.reduce((total, item) => {
      const price = item.product?.price || item.price || 0;
      const quantity = item.quantity || 0;
      return total + price * quantity;
    }, 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.1;
  };

  const calculateShipping = (subtotal) => {
    return subtotal > 50 ? 0 : 5.99;
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  const validateForm = () => {
    const newErrors = {};

    if (!shippingDetails.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!shippingDetails.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    if (!shippingDetails.streetAddress.trim()) {
      newErrors.streetAddress = "Street address is required";
    }
    if (!shippingDetails.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!shippingDetails.state.trim()) {
      newErrors.state = "State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingChange = (field, value) => {
    setShippingDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDeliveryCompanySelect = (companyId) => {
    handleShippingChange("deliveryCompanyId", companyId);
  };

  const handlePayNow = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (userCart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      const shippingAddress = `${shippingDetails.streetAddress}, ${shippingDetails.city}, ${shippingDetails.state} ${shippingDetails.zipCode}`;

      const result = await createOrderWithPayment({
        shippingAddress,
        shippingCost: shipping,
        tax,
        deliveryCompanyId: shippingDetails.deliveryCompanyId,
      });

      if (result?.payment?.authorization_url) {
        // Store order info in localStorage for safety
        localStorage.setItem(
          "pendingOrder",
          JSON.stringify({
            orderId: result.order?.id,
            reference: result.payment?.reference,
          }),
        );

        // Redirect to Paystack
        window.location.href = result.payment.authorization_url;
      } else {
        toast.error("Failed to initialize payment. Please try again.");
      }
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loadingCart) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader
            size={100}
            className="animate-spin text-primary-600 mx-auto mb-4"
          />
          <p className="text-secondary">Loading checkout...</p>
        </div>
      </main>
    );
  }

  if (userCart.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <main className="my-32 w-[90%] max-w-6xl mx-auto">
      {/* Back to Cart */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-secondary hover:text-primary-600 transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        Back to Cart
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold font-Montserrat mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Information */}
          <div className="card rounded-2xl p-6">
            <h2 className="text-xl font-bold font-Montserrat mb-6">
              Shipping Information
            </h2>
            <ShippingForm
              shippingDetails={shippingDetails}
              onChange={handleShippingChange}
              errors={errors}
            />
          </div>

          {/* Delivery Company Selection */}
          <div className="card rounded-2xl p-6">
            <h2 className="text-xl font-bold font-Montserrat mb-6">
              Delivery Company
            </h2>
            <DeliverySelector
              deliveryState={shippingDetails.state}
              onSelect={handleDeliveryCompanySelect}
            />
          </div>

          {/* Order Items */}
          <div className="card rounded-2xl p-6">
            <h2 className="text-xl font-bold font-Montserrat mb-6">
              Order Items
            </h2>
            <OrderSummary items={userCart} />
          </div>
        </div>

        {/* Right Column - Payment Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            <PaymentSummary
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
              itemsCount={userCart.length}
              onPayNow={handlePayNow}
              isProcessing={isProcessing || loadingMutation}
              disabled={userCart.length === 0}
            />

            {/* Security Badge */}
            <div className="card rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted mb-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Secured by Paystack
              </div>
              <div className="flex justify-center gap-2">
                <span className="text-xs text-muted">🔒 SSL Encrypted</span>
                <span className="text-xs text-muted">•</span>
                <span className="text-xs text-muted">🛡️ PCI Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
