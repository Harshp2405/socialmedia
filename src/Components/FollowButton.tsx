"use client"

import { togglefollow } from "@/Action/user.action"
import { Loader2Icon } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"


const FollowButton = ({userId} :{userId:string}) => {

    const [isLoading, setisLoading] = useState(false)


  const handleFunction = async ()=>{
    try {
      await togglefollow(userId)
      toast.success("following")
    } catch (error) {
      console.log("Error in follow button" , error)
      toast.error("follow button error")
    }finally{
      setisLoading(false)
    }
    }
    return (
    <div>
        <button
          type="button"
          onClick={handleFunction}
          disabled={isLoading}
          className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 disabled:opacity-50"
        >
          {isLoading ? <Loader2Icon className="animate-spin w-4 h-4" /> : "Follow"}
        </button>
    </div>
  )
}

export default FollowButton
