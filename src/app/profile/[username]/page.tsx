import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
  getUserFollowing,
} from "@/Action/profile.action";
import ProfilePageClient from "./ProfilePageClient";
import Followinglist from "./Followinglist";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

const ProfilePageServer = async ({ params }: Props) => {
  const { username } = await params;

  const user = await getProfileByUsername(username);
  if (!user) return notFound();

  const [posts, likedPosts, isCurrentUserFollowing, followingUsers] =
    await Promise.all([
      getUserPosts(user.id),
      getUserLikedPosts(user.id),
      isFollowing(user.id),
      getUserFollowing(user.id),
    ]);

  const followingUsersWithState = followingUsers.map((u) => ({
    ...u,
    isFollowing: true,
  }));

  return (
    <>
      <ProfilePageClient
        user={user}
        posts={posts}
        likedPosts={likedPosts}
        isFollowing={isCurrentUserFollowing}
      />

      {/* <div className="rounded-lg shadow p-6">
        <Followinglist
          followingUsers={followingUsersWithState}
          currentUserId={user.id}
        />
      </div> */}
    </>
  );
};

export default ProfilePageServer;
