"use client";

import { useEffect } from 'react';
import { useGlobalState } from './GlobalStateProvider';  // Import the custom hook

const DynamicTitle = () => {
  const { formData } = useGlobalState(); // Access the global state

  useEffect(() => {
    // Dynamically set the title based on the available formData
    const title = `${formData.fullName && `Welcome ${formData.fullName}`}` || `${formData.adminFullName && `Welcome ${formData.adminFullName}`}` || "";
    document.title = title; // Update the document title
  }, [formData]); // Re-run when formData changes

  return null;  // This component doesn't render anything
};

export default DynamicTitle;
