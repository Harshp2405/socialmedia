"use client";

import { getProfileByUsername, getUserPosts, updateProfile } from "@/Action/profile.action";
import { togglefollow } from "@/Action/user.action";
import PostCard from "@/Components/PostCard";
import { SignInButton, useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import {
    CalendarIcon,
    EditIcon,
    FileTextIcon,
    HeartIcon,
    LinkIcon,
    MapPinIcon,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type User = Awaited<ReturnType<typeof getProfileByUsername>>;
type Posts = Awaited<ReturnType<typeof getUserPosts>>;

interface ProfilePageClientProps {
    user: NonNullable<User>;
    posts: Posts;
    likedPosts: Posts;
    isFollowing: boolean;
}


const ProfilePageClient = ({
    isFollowing: initialIsFollowing,
    likedPosts,
    posts,
    user,
}: ProfilePageClientProps) => {
    const { user: currentUser } = useUser();
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
    const [activeTab, setActiveTab] = useState<"posts" | "likes">("posts");
    const [imagePreview, setImagePreview] = useState(user.image || "");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);


    const [editForm, setEditForm] = useState({
        name: user.name || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        image: user.image || "", 
    });

    const handleEditSubmit = async () => {
        try {
            // Optional: Add loading state if needed
            // setIsSubmitting(true);

            let imageUrl = user.image;

            // Upload image if a new file is selected
            if (selectedFile) {
                imageUrl = await uploadImage(selectedFile);
            }

            const updatedFormData = new FormData();
            Object.entries(editForm).forEach(([key, value]) => {
                updatedFormData.append(key, value);
            });
            updatedFormData.append("image", imageUrl || "");

            const result = await updateProfile(updatedFormData);

            if (result.success) {
                toast.success("Profile updated successfully");
                setShowEditDialog(false);
                // Optionally update local state with new data if you aren't refetching
                // setEditForm({ ...editForm, image: imageUrl });
                // setImagePreview(imageUrl);
            } else {
                toast.error("Update failed");
            }
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Something went wrong");
        } finally {
            // Optional: Reset loading state
            // setIsSubmitting(false);
        }
    };



    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data?.data?.secure_url) {
            throw new Error("Image upload failed");
        }

        return data.data.secure_url;
    };


    const handleFollow = async () => {
        if (!currentUser) return;

        try {
            setIsUpdatingFollow(true);
            await togglefollow(user.id);
            setIsFollowing(!isFollowing);
        } catch (error) {
            toast.error("Failed to update follow status");
        } finally {
            setIsUpdatingFollow(false);
        }
    };

    const isOwnProfile =
        currentUser?.username === user.username ||
        currentUser?.emailAddresses[0].emailAddress.split("@")[0] === user.username;

    const formattedDate = format(new Date(user.createdAt), "MMMM yyyy");


    return (
        <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 gap-6">
                <div className="w-full max-w-lg mx-auto">
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex flex-col items-center text-center">
                            <img
                                src={user.image ?? "/avatar.png"}
                                alt="User Avatar"
                                className="w-24 h-24 rounded-full"
                            />
                            <h1 className="mt-4 text-2xl font-bold">
                                {user.name ?? user.username}
                            </h1>
                            <p className="text-gray-500">@{user.username}</p>
                            <p className="mt-2 text-sm">{user.bio}</p>

                            {/* Profile Stats */}
                            <div className="w-full mt-6">
                                <div className="flex justify-between mb-4 text-center text-sm text-gray-600">
                                    <div>
                                        <div className="font-semibold text-black">
                                            {user._count.following.toLocaleString()}
                                        </div>
                                        <div>Following</div>
                                    </div>
                                    <div className="h-6 w-px bg-gray-300"></div>
                                    <div>
                                        <div className="font-semibold text-black">
                                            {user._count.followers.toLocaleString()}
                                        </div>
                                        <div>Followers</div>
                                    </div>
                                    <div className="h-6 w-px bg-gray-300"></div>
                                    <div>
                                        <div className="font-semibold text-black">
                                            {user._count.posts.toLocaleString()}
                                        </div>
                                        <div>Posts</div>
                                    </div>
                                </div>
                            </div>

                            {/* Follow / Edit Profile Button */}
                            {!currentUser ? (
                                <SignInButton mode="modal">
                                    <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                                        Follow
                                    </button>
                                </SignInButton>
                            ) : isOwnProfile ? (
                                <button
                                    className="w-full mt-4 bg-gray-200 hover:bg-gray-300 py-2 rounded flex items-center justify-center gap-2"
                                    onClick={() => setShowEditDialog(true)}
                                >
                                    <EditIcon className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    onClick={handleFollow}
                                    disabled={isUpdatingFollow}
                                    className={`w-full mt-4 py-2 rounded ${isFollowing
                                            ? "border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                >
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </button>
                            )}

                            {/* Edit Profile Pic */}

                        



                            {/* Location, Website, Joined */}
                            <div className="w-full mt-6 space-y-2 text-sm text-gray-500">
                                {user.location && (
                                    <div className="flex items-center">
                                        <MapPinIcon className="w-4 h-4 mr-2" />
                                        {user.location}
                                    </div>
                                )}
                                {user.website && (
                                    <div className="flex items-center">
                                        <LinkIcon className="w-4 h-4 mr-2" />
                                        <a
                                            href={
                                                user.website.startsWith("http")
                                                    ? user.website
                                                    : `https://${user.website}`
                                            }
                                            className="hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {user.website}
                                        </a>
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                    Joined {formattedDate}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="w-full">
                    <div className="flex border-b text-sm font-semibold">
                        <button
                            onClick={() => setActiveTab("posts")}
                            className={`px-6 py-2 ${activeTab === "posts"
                                    ? "border-b-2 border-blue-600 text-blue-600"
                                    : "text-gray-500"
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <FileTextIcon className="w-4 h-4" />
                                Posts
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("likes")}
                            className={`px-6 py-2 ${activeTab === "likes"
                                    ? "border-b-2 border-blue-600 text-blue-600"
                                    : "text-gray-500"
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <HeartIcon className="w-4 h-4" />
                                Likes
                            </div>
                        </button>
                    </div>

                    <div className="mt-6 space-y-6">
                        {activeTab === "posts" ? (
                            posts.length > 0 ? (
                                posts.map((post) => (
                                    <PostCard key={post.id} post={post} dbuserid={user.id} />
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400">No posts yet</div>
                            )
                        ) : likedPosts.length > 0 ? (
                            likedPosts.map((post) => (
                                <PostCard key={post.id} post={post} dbuserid={user.id} />
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                No liked posts to show
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Profile Dialog */}
                {showEditDialog && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
                            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, name: e.target.value })
                                        }
                                        className="w-full border rounded px-3 py-2 mt-1"
                                    />
                                </div>
                                {/* Profile pic */}

                                <div>
                                    <label className="block text-sm font-medium">Profile Picture</label>
                                    <div className="flex items-center gap-4 mt-2">
                                        <img
                                            src={imagePreview || "/avatar.png"}
                                            alt="Profile Preview"
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setSelectedFile(file);
                                                    setImagePreview(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                    </div>
                                </div>


                                {/*  */}
                                <div>
                                    <label className="block text-sm font-medium">Bio</label>
                                    <textarea
                                        value={editForm.bio}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, bio: e.target.value })
                                        }
                                        className="w-full border rounded px-3 py-2 mt-1 min-h-[100px]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Location</label>
                                    <input
                                        type="text"
                                        value={editForm.location}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, location: e.target.value })
                                        }
                                        className="w-full border rounded px-3 py-2 mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Website</label>
                                    <input
                                        type="text"
                                        value={editForm.website}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, website: e.target.value })
                                        }
                                        className="w-full border rounded px-3 py-2 mt-1"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    onClick={() => setShowEditDialog(false)}
                                    className="px-4 py-2 rounded border"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditSubmit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    )
}

export default ProfilePageClient
