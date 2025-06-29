"use client";

import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { useAuth, SignInButton, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import clsx from "clsx";

const MobileNavbar = () => {
  const { isSignedIn } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <div className="flex md:hidden items-center space-x-2">
        <button
          onClick={() => setDrawerOpen(true)}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={clsx(
          "fixed top-0 right-0 z-50 h-screen w-64 p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800 md:hidden", 
          drawerOpen ? "translate-x-0" : "translate-x-full",
          "transform duration-300 ease-in-out"
        )}
      >
        {/* Close Button */}
        <button
          onClick={() => setDrawerOpen(false)}
          className="text-gray-400 hover:text-gray-900 dark:hover:text-white absolute top-2.5 right-2.5"
        >
          ✕
        </button>

        <h5 className="mt-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
          Menu
        </h5>

        {/* Navigation Items */}
        <nav className="flex flex-col space-y-4 mt-6">
          <Link
            href="/"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
            onClick={() => setDrawerOpen(false)}
          >
            <HomeIcon className="w-4 h-4" />
            Home
          </Link>

          {isSignedIn ? (
            <>
              <Link
                href="/notifications"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                onClick={() => setDrawerOpen(false)}
              >
                <BellIcon className="w-4 h-4" />
                Notifications
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                onClick={() => setDrawerOpen(false)}
              >
                <UserIcon className="w-4 h-4" />
                Profile
              </Link>
              <SignOutButton>
                <button
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white w-full"
                  onClick={() => setDrawerOpen(false)}
                >
                  <LogOutIcon className="w-4 h-4" />
                  Logout
                </button>
              </SignOutButton>
            </>
          ) : (
            <SignInButton mode="modal">
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign In
              </button>
            </SignInButton>
          )}
        </nav>
      </div>
    </>
  );
};

export default MobileNavbar;
