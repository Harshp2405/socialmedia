import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import Createpost from "../Components/CreatePost";
import Suggestion from "@/Components/Suggestion";
import PostCard from "@/Components/PostCard";
import { getPost } from "@/Action/post.action";
import { getDatabaseUserId } from "@/Action/user.action";

export default async function Home() {
  const user = await currentUser()
  // await prisma
  const userpost = await getPost()
  const dbuserid = await getDatabaseUserId();
  console.log(userpost)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        {user ? <Createpost /> : null}

        {user ? <div className="space-y-6">
          {userpost.map((pst) => (
            <PostCard key={pst.id} post={pst} dbuserid={dbuserid} />
          ))}
        </div> : null}
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <Suggestion />
      </div>
    </div>

  );
}
