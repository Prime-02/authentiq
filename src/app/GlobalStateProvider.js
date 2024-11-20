'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    userId: '',
    fullName: '',
    email: '',
    password: '',
    dateJoined: '',
    gender: '',
    IP: '',
    lastLoginIP: '',
    referalCode: '',
    referredBy: '',
    userWallet: {},
    walletAddresses: {},
    totalBalance: 0,
    referralLink: '',
    notification: [],
    plans: [],
    investments: [],


  // Admin-specific fields
  adminFullName: '',
  adminEmail: '',
  adminPassword: '',
  adminDateJoined: '',
  adminGender: '',
  adminIP: '',
  adminLastLogin: '',
  adminReferralCode: '',
  adminReferredBy: '',
  adminNotification: [],
  });

 // utils/format.js
 const formatBalance = (balance) => {
  if (balance !== null && !isNaN(Number(balance))) {
    return Number(balance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return "0.00";
};

  return (
   <>
   <ToastContainer/>
    <GlobalStateContext.Provider value={{ formData, setFormData, }}>
      {children}
    </GlobalStateContext.Provider>
   </>
  );
};

// Custom hook to use the GlobalStateContext
export const useGlobalState = () => useContext(GlobalStateContext);
