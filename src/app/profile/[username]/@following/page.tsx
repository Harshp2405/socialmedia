import {
  getProfileByUsername,
  getUserFollowing,
} from "@/Action/profile.action";
import Followinglist from "../Followinglist";
import { notFound } from "next/navigation";

type Props = {
  params: {
    username: string;
  };
};

export default async function Following({ params }: Props) {
  const { username } = params;

  const user = await getProfileByUsername(username);
  if (!user) return notFound();

  const followingUsers = await getUserFollowing(user.id);

  const followingUsersWithState = followingUsers.map((u) => ({
    ...u,
    isFollowing: true,
  }));

  return (
    <Followinglist
      followingUsers={followingUsersWithState}
      currentUserId={user.id}
    />
  );
}
