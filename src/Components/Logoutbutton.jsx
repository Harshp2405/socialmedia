// File: components/LogoutButton.js
"use client";

import { useClerk } from "@clerk/nextjs"; // Client-side only
import React from "react";

const Logoutbutton = () => {
  const { signOut } = useClerk(); // Clerk's signOut method

  const handleLogout = () => {
    signOut(); // Logout user when button is clicked
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
    >
      Logout
    </button>
  );
};

export default Logoutbutton;
