"use client"

import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { createPost } from "@/Action/post.action";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";
import { uploadImageToCloudinary } from "@/lib/uploadImageToCloudinary";

const Createpost = () => {
  
    const { user } = useUser();
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [showImageUpload, setShowImageUpload] = useState(false);
    
    const handleSubmit = async () => {
        if (!content.trim() && !imageFile) return;

        setIsPosting(true);
        try {
            let uploadedUrl = imageUrl;

            if (imageFile) {
                uploadedUrl = await uploadImageToCloudinary(imageFile);
                setImageUrl(uploadedUrl);
            }

            const result = await createPost(content, uploadedUrl);
            if (result?.success) {
                setContent("");
                setImageFile(null);
                setImageUrl("");
                setShowImageUpload(false);
                toast.success("Post created successfully");
            }
        } catch (error) {
            console.error("Failed to create post:", error);
            toast.error("Failed to create post");
        } finally {
            setIsPosting(false);
        }
    };




    return (
        <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 space-y-4 mb-6 shadow-sm">
            <div className="flex space-x-4">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                        src={user?.imageUrl || "/avatar.png"}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                    />
                </div>
                <textarea
                    placeholder="What's on your mind?"
                    className="flex-1 text-base resize-none border-none outline-none bg-transparent text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-500 min-h-[80px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isPosting}
                />
            </div>

            {(showImageUpload || imageFile) && (
                <div className="border rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800">
                    <ImageUpload
                        onImageUpload={(file) => {
                            setImageFile(file);
                            if (!file) setShowImageUpload(false);
                        }}
                    />
                </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t">
                <button
                    type="button"
                    className="flex items-center text-zinc-500 hover:text-blue-600 text-sm"
                    onClick={() => setShowImageUpload(!showImageUpload)}
                    disabled={isPosting}
                >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Photo
                </button>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center text-sm disabled:opacity-50"
                    onClick={handleSubmit}
                    disabled={(!content.trim() && !imageFile) || isPosting}
                >
                    {isPosting ? (
                        <>
                            <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                            Posting...
                        </>
                    ) : (
                        <>
                            <SendIcon className="w-4 h-4 mr-2" />
                            Post
                        </>
                    )}
                </button>
            </div>
        </div>

  )
}

export default Createpost
