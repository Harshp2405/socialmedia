import { getUserBtClerkId } from '@/Action/user.action'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { LinkIcon, MapPinIcon } from 'lucide-react';
import Link from "next/link";

const Sidebar = async () => {
    const authUser = await currentUser()

    if (!authUser) return <UnAuthSideBar />


    const user = await getUserBtClerkId(authUser.id)

    if(!user) return null
    console.log(user)
    return (
        <div className="sticky top-20">
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                <div className="flex flex-col items-center text-center">
                    <Link
                        href={`/profile/${user.username}`}
                        className="flex flex-col items-center justify-center"
                    >
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300">
                            <img
                                src={user.image || "/avatar.png"}
                                className="object-cover w-full h-full"
                            />
                        </div>

                        <div className="mt-4 space-y-1">
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.username}</p>
                        </div>
                    </Link>

                    {user.bio && (
                        <p className="mt-3 text-sm text-gray-500 text-center">{user.bio}</p>
                    )}

                    <div className="w-full">
                        <hr className="my-4 border-gray-200" />
                        <div className="flex justify-between items-center">
                            <div className="text-center flex-1">
                                <p className="font-medium">{user._count.following}</p>
                                <p className="text-xs text-gray-500">Following</p>
                            </div>
                            <div className="h-6 w-px bg-gray-200 mx-4" />
                            <div className="text-center flex-1">
                                <p className="font-medium">{user._count.followers}</p>
                                <p className="text-xs text-gray-500">Followers</p>
                            </div>
                        </div>
                        <hr className="my-4 border-gray-200" />
                    </div>

                    <div className="w-full space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-2" />
                            {user.location || "No location"}
                        </div>
                        <div className="flex items-center">
                            <LinkIcon className="w-4 h-4 mr-2 shrink-0" />
                            {user.website ? (
                                <a
                                    href={user.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline truncate"
                                >
                                    {user.website}
                                </a>
                            ) : (
                                "No website"
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Sidebar


const UnAuthSideBar = () => {
    return (
        <div className="max-w-md mx-auto mt-10 p-6 border border-gray-200 rounded-lg shadow-md bg-white">
            <div className="mb-4">
                <h2 className="text-center text-xl font-semibold">Welcome Back!</h2>
            </div>
            <div>
                <p className="text-center text-gray-500 mb-4">
                    Login to access your profile and connect with others.
                </p>
                <SignInButton mode="modal">
                    <button
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                        type="button"
                    >
                        Login
                    </button>
                </SignInButton>
                <SignUpButton mode="modal">
                    <button
                        className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        type="button"
                    >
                        Sign Up
                    </button>
                </SignUpButton>
            </div>
        </div>

    )
}

