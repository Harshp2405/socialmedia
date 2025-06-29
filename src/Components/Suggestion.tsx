import { getRandomUser } from "@/Action/user.action"
import Link from "next/link"
import FollowButton from "./FollowButton"


const Suggestion = async () => {
    const manyuser = await getRandomUser()

    if(manyuser?.length === 0 ) return null


  return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Who to Follow</h2>
            <div className="space-y-4">
              {manyuser?.map((data) => (
                    <div key={data.id} className="flex gap-2 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Link href={`/profile/${data.username}`}>
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                    <img
                                        src={data.image ?? "/avatar.png"}
                                        
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </Link>
                            <div className="text-xs">
                                <Link
                                    href={`/profile/${data.username}`}
                                    className="font-medium cursor-pointer hover:underline"
                                >
                                    {data.name}
                                </Link>
                                <p className="text-gray-500">@{data.username}</p>
                                <p className="text-gray-500">{data._count.followers} followers</p>
                            </div>
                        </div>
                      <FollowButton userId={data.id} />
                    </div>
                ))}
            </div>
        </div>

  )
}

export default Suggestion
