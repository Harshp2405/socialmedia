import Link from 'next/link'
import React from 'react'
import { BellIcon, HomeIcon, UserIcon } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";

const DesktopNavbar = async () => {
    const user = await currentUser();

    return (
        <div className="hidden md:flex items-center space-x-4">
            {/* Home Button */}
            <Link href="/">
                <button className="text-white bg-[#2557D6] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center space-x-2">
                    <HomeIcon className="w-4 h-4" />
                    <span className="hidden lg:inline">Home</span>
                </button>
            </Link>

            {/* Authenticated User Buttons */}
            {user ? (
                <>
                    <Link href="/Notification">
                        <button className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center space-x-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                            <BellIcon className="w-4 h-4" />
                            <span className="hidden lg:inline">Notifications</span>
                        </button>
                    </Link>

                    <Link
                        href={`/profile/${user.username ?? user.emailAddresses[0].emailAddress.split('@')[0]}`}
                    
                    >
                        <button className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center space-x-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                            <UserIcon className="w-4 h-4" />
                            <span className="hidden lg:inline">Profile</span>
                        </button>
                    </Link>

                    <UserButton />
                </>
            ) : (
                <SignInButton mode="modal">
                    <button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5">
                        Sign In
                    </button>
                </SignInButton>
            )}
        </div>
  )
}

export default DesktopNavbar
