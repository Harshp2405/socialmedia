import Link from "next/link";
import { HomeIcon, ArrowLeftIcon } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] grid place-items-center px-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <div className="text-center space-y-6">
                    {/* LARGE 404 TEXT */}
                    <p className="text-8xl font-bold text-blue-600 font-mono">404</p>

                    {/* MESSAGE */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight">User not found</h1>
                        <p className="text-gray-500">The user you're looking for doesn't exist.</p>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            <HomeIcon className="w-4 h-4 mr-2" />
                            Back to Home
                        </Link>

                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
