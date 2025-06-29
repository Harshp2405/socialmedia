"use client"

import { getnotification, marknotification } from "@/Action/notification.action"
import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";
type notification = Awaited<ReturnType<typeof getnotification>>;
type Notification = NonNullable<notification>[number];

const getNotificationIcon = (type: string) => {
    switch (type) {
        case "LIKE":
            return <HeartIcon className="size-4 text-red-500" />;
        case "COMMENT":
            return <MessageCircleIcon className="size-4 text-blue-500" />;
        case "FOLLOW":
            return <UserPlusIcon className="size-4 text-green-500" />;
        default:
            return null;
    }
};

const Notification = () => {
    const [notifications, setnotifications] = useState<Notification[]>([])
    const [isLoading, setisLoading] = useState(true)


    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const data = await getnotification()
                if (data){setnotifications(data)}
                const unreadid = data ? data.filter(d => !d.read).map(n => n.id) : [];

                if (unreadid.length > 0) {
                    await marknotification(unreadid)
                }

            } catch (error) {
                toast.error("Error to page.tsx notification")
                console.log(error, "Error to page.tsx notification")
            } finally {
                setisLoading(false)
            }
        }
        fetchNotification()
    }, [])

    if(isLoading) return "Loading.."

    return (
        <div>
            <div className="space-y-4">
                <div className="border rounded-lg shadow-sm">
                    {/* Header */}
                    <div className="border-b p-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Notifications</h2>
                        <span className="text-sm text-muted-foreground">
                            {notifications.filter((n) => !n.read).length} unread
                        </span>
                    </div>

                    {/* Content */}
                    <div className="h-[calc(100vh-12rem)] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`flex items-start gap-4 p-4 border-b hover:bg-muted/25 transition-colors ${!notification.read ? "bg-muted/50" : ""
                                        }`}
                                >
                                    {/* Profile Image */}
                                    <img
                                        src={notification.creator.image ?? "/avatar.png"}
                                        alt="Avatar"
                                        className="w-10 h-10 rounded-full mt-1"
                                    />

                                    {/* Notification Body */}
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            {getNotificationIcon(notification.type)}
                                            <span>
                                                <span className="font-medium">
                                                    {notification.creator.name ?? notification.creator.username}
                                                </span>{" "}
                                                {notification.type === "FOLLOW"
                                                    ? "started following you"
                                                    : notification.type === "LIKE"
                                                        ? "liked your post"
                                                        : "commented on your post"}
                                            </span>
                                        </div>

                                        {/* Post Preview */}
                                        {notification.post &&
                                            (notification.type === "LIKE" || notification.type === "COMMENT") && (
                                                <div className="pl-6 space-y-2">
                                                    <div className="text-sm text-muted-foreground rounded-md p-2 bg-muted/30 mt-2">
                                                        <p>{notification.post.content}</p>
                                                        {notification.post.image && (
                                                            <img
                                                                src={notification.post.image}
                                                                alt="Post content"
                                                                className="mt-2 rounded-md w-full max-w-[200px] h-auto object-cover"
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Comment */}
                                                    {notification.type === "COMMENT" && notification.comment && (
                                                        <div className="text-sm p-2 bg-accent/50 rounded-md">
                                                            {notification.comment.content}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                        {/* Timestamp */}
                                        <p className="text-sm text-muted-foreground pl-6">
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Notification
