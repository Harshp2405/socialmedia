import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from '@/Action/profile.action';
import React from 'react'
import ProfilePageClient from './ProfilePageClient';
import { notFound } from 'next/navigation';

const ProfilePageServer = async ({ params }: { params: { username: string } }) => {

    const user = await getProfileByUsername(params.username);

    if (!user) return notFound();

    const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
        getUserPosts(user.id),
        getUserLikedPosts(user.id),
        isFollowing(user.id),
    ]);
    return (
        <div>
            <ProfilePageClient
                user={user}
                posts={posts}
                likedPosts={likedPosts}
                isFollowing={isCurrentUserFollowing}
            />
        </div>
    )
}

export default ProfilePageServer
