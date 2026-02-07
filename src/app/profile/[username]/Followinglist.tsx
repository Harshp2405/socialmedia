"use client";

import React, { useState } from "react";
import { togglefollow } from "@/Action/user.action";
import toast from "react-hot-toast";
import { LinkIcon } from "lucide-react";

interface User {
  id: string;
  username: string;
  name?: string | null;
  image?: string | null;
  isFollowing?: boolean;
}
interface Props {
  followingUsers: User[];
  currentUserId: string;
}

const Followinglist: React.FC<Props> = ({ followingUsers, currentUserId }) => {
  const [localFollowing, setLocalFollowing] = useState(followingUsers);

  const handleFollowToggle = async (targetUserId: string) => {
    try {
      await togglefollow(targetUserId);

      // Update local state to reflect change
      setLocalFollowing((prev) =>
        prev.map((u) =>
          u.id === targetUserId ? { ...u, isFollowing: !u.isFollowing } : u
        )
      );
    } catch (error) {
      toast.error("Failed to update follow status");
    }
  };

  if (localFollowing.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Following</h2>
        <p className="text-gray-500">This user isn’t following anyone yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Following</h2>
      <ul className="space-y-3">
        {localFollowing.map((u) => (
          <li
            key={u.id}
            className="flex items-center justify-between space-x-4 hover:bg-gray-50 p-2 rounded transition"
          >
            <div className="flex items-center space-x-4">
              <img
                src={u.image || "/default-avatar.png"}
                alt={u.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">{u.username}</p>
                {u.name && <p className="text-sm text-gray-500">{u.name}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
            
              {u.id !== currentUserId && (
                <button
                  onClick={() => handleFollowToggle(u.id)}
                  className={`py-1 px-3 rounded text-sm ${
                    u.isFollowing
                      ? "border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {u.isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Followinglist;



