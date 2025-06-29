"use client"
import { createComment, deletePost, getPost, toggleLike } from "@/Action/post.action"
import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from "react"
import toast from "react-hot-toast"
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {  HeartIcon, LogInIcon, MessageCircleIcon, SendIcon, Trash2Icon } from "lucide-react";

type userposts = Awaited<ReturnType<typeof getPost>>
type Post = userposts[number]

const PostCard = ({ post, dbuserid }: { post: Post, dbuserid: string | null }) => {
    const {user} = useUser()
    const [newComment, setnewComment] = useState("")
    const [isCommanting, setisCommanting] = useState(false)
    const [isLiking, setisLiking] = useState(false)
    const [isDeleting, setisDeleting] = useState(false)
    const [hasLiked, sethasLiked] = useState(post.likes.some((like) => like.userId === dbuserid))
    const [Likes, setLikes] = useState(post._count.likes)
    const [showComments, setShowComments] = useState(false);

    const handlelike = async ()=>{
        if (isLiking) {
            return
        }
        try {
            setisLiking(true)
            sethasLiked(prev => !prev)
            setLikes(prev => prev + (hasLiked ? -1 :1))
            await toggleLike(post.id)
        } catch (error) {
            setLikes(post._count.likes)
            sethasLiked(post.likes.some((like) => like.userId === dbuserid))
        }finally{
            setisLiking(false)
        }

    }

    const handlcomment = async ()=>{
        if(!newComment.trim() || isCommanting) return
        try{
            setisCommanting(true)
            const res = await createComment(post.id , newComment)
            if(res?.success){
                toast.success("Commented successfully")
                setnewComment("")
        }
    }
        catch(error){
            toast.error("Failed to comment")
            console.log("Error in handlcomment function", error)
        }finally{
            setisCommanting(false)
        }
    }

    const handledeletepost = async ()=>{
        if (isDeleting) return
        try {
            setisDeleting(true)
            const res = await deletePost(post.id)
            if (res?.success) {
                toast.success("Post deleted successfully")
                return
            }
        } catch (error) {
            toast.error("Failed to delete post")
            console.log("Error in handledeletepost function", error)
        } finally {
            setisDeleting(false)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 sm:p-6 space-y-4">
                {/* HEADER */}
                <div className="flex space-x-4">
                    {/* <Link href={`/profile/${post.author.username}`}> */}
                    <Link href={`/`}>
                        <img
                            src={post.author.image ?? "/avatar.png"}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    </Link>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div className="truncate">
                                <Link href={`/}`} className="font-semibold block truncate">
                                {/* <Link href={`/profile/${post.author.username}`} className="font-semibold block truncate"> */}
                                    {post.author.username}
                                </Link>
                                <div className="text-sm text-gray-500 flex space-x-2">
                                    {/* <Link href={`/`}>@{post.author.username}</Link> */}
                                    {/* <Link href={`/profile/${post.author.username}`}>@{post.author.username}</Link> */}
                                    {/* <span>•</span> */}
                                    <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                                </div>
                            </div>
                            {dbuserid === post.author.id && (
                                <button onClick={handledeletepost} disabled={isDeleting} className="text-red-500 text-sm">
                                    {isDeleting ? "Deleting..." : <Trash2Icon size={15} />}
                                </button>
                            )}
                        </div>
                        <p className="mt-2 text-sm text-gray-900 break-words">{post.content}</p>
                    </div>
                </div>

                {/* POST IMAGE */}
                {post.image && (
                    <div className="rounded-lg overflow-hidden">
                        <img src={post.image} alt="Post content" className="w-full h-auto object-cover" />
                    </div>
                )}

                {/* LIKE & COMMENT BUTTONS */}
                <div className="flex items-center pt-2 space-x-4">
                    {user && dbuserid ? (
                        <button
                            onClick={handlelike}
                            className={`flex items-center text-sm gap-1 ${hasLiked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-red-500"
                                }`}
                        >
                            <HeartIcon className="w-4 h-4" fill={hasLiked ? "currentColor" : "none"} />
                            <span>{Likes}</span>
                        </button>
                    ) : (
                        <SignInButton mode="modal">
                            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm flex items-center gap-1">
                                <LogInIcon className="w-4 h-4" />
                                Sign in to like
                            </button>
                        </SignInButton>
                    )}

                    <button
                        onClick={() => setShowComments((prev) => !prev)}
                        className={`flex items-center text-sm gap-1 ${showComments ? "text-blue-500" : "text-gray-500 hover:text-blue-500"
                            }`}
                    >
                        <MessageCircleIcon className="w-4 h-4" />
                        <span>{post.comments.length}</span>
                    </button>
                </div>

                {/* COMMENTS SECTION */}
                {showComments && (
                    <div className="space-y-4 pt-4 border-t">
                        {post.comments.map((comment) => (
                            <div key={comment.id} className="flex space-x-3">
                                <img
                                    src={comment.author.image ?? "/avatar.png"}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-500">
                                        <span className="font-medium text-gray-900">{comment.author.name}</span>
                                        <span>@{comment.author.username}</span>
                                        <span>·</span>
                                        <span>{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                                    </div>
                                    <p className="text-sm text-gray-800">{comment.content}</p>
                                </div>
                            </div>
                        ))}

                        {user ? (
                            <div className="flex space-x-3">
                                <img
                                    src={user?.imageUrl || "/avatar.png"}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <textarea
                                        placeholder="Write a comment..."
                                        value={newComment}
                                        onChange={(e) => setnewComment(e.target.value)}
                                        className="w-full min-h-[80px] resize-none p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button
                                            onClick={handlcomment}
                                            disabled={!newComment.trim() || isCommanting}
                                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-1"
                                        >
                                            {isCommanting ? "Posting..." : (
                                                <>
                                                    <SendIcon className="w-4 h-4" />
                                                    Comment
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center p-4 border rounded-lg bg-gray-100">
                                <SignInButton mode="modal">
                                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm flex items-center gap-2">
                                        <LogInIcon className="w-4 h-4" />
                                        Sign in to comment
                                    </button>
                                </SignInButton>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

    )
}

export default PostCard
