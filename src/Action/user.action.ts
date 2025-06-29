"use server"

import prisma from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function syncUser() {
    try {
        const { userId } = await auth()
        const user = await currentUser()

        if (!userId || !user) return

        const existUser = await prisma.user.findUnique({
            where: {
                clerkId: userId
            }
        })

        if (existUser) return existUser;

        const dbuser = await prisma.user.create({
            data: {
                clerkId: userId,
                name: `${user.firstName || ""} ${user.lastName || ""}`,
                username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
                email: user.emailAddresses[0].emailAddress,
                image: user.imageUrl,
            }
        })

        return dbuser
    } catch (error) {
        console.log("Error in user Action ", error)
    }
}


export async function getUserBtClerkId(clerkId: string) {
    return prisma.user.findUnique({
        where: {
            clerkId,
        },
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                    posts: true,
                }
            }
        }
    })
}


export async function getDatabaseUserId(): Promise<string | null> {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
        return null
    }

    const user = await getUserBtClerkId(clerkId);

    if (!user) {
        throw new Error("User Not Found");
    }

    return user.id;
}

export async function getRandomUser(){
    try {
        const userId = await getDatabaseUserId();

        if(!userId){ return [] }
        const randomuser = await prisma.user.findMany({
            where:{
                AND:[
                    {NOT:{id:userId}},
                    {
                        NOT:{
                            followers:{
                                some:{
                                    followerId:userId
                                }
                            }
                        }
                    }
                ]
            },

            select:{
                id:true,
                name:true,
                username:true,
                image:true,
                _count:{
                    select:{
                        followers:true
                    }
                }
            }, 

            take:4
        })

        return randomuser
    } catch (error) {
        console.log("Error in getRandomUser Function" , error)
    }
}


export const togglefollow = async (targetuserId:string)=>{
    try {
        const userId = await getDatabaseUserId()

        if(userId === targetuserId) throw new Error("Cant follow self")
        if (!userId) { return  }
        const exist = await prisma.follows.findUnique({
            where:{
                followerId_followingId:{
                    followerId:userId,
                    followingId:targetuserId
                }
            }
        })

        if(exist){
            //unfollow
            await prisma.follows.delete({
                where:{
                    followerId_followingId: {
                        followerId: userId,
                        followingId: targetuserId
                    }
                }
            })
        }else{
            //follow
            await prisma.$transaction([
                prisma.follows.create({
                    data:{
                        followerId: userId,
                        followingId: targetuserId
                    }
                }),
                prisma.notification.create({
                    data:{
                        type:"FOLLOW",
                        userId:targetuserId,
                        creatorId:userId
                    }
                })
            ])
        }

        revalidatePath("/")
        return {success:true}
    } catch (error) {
        console.log("Error in toggleFollow function" , error)
        
    }
} 