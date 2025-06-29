"use server"

import prisma from "@/lib/prisma"
import { getDatabaseUserId } from "./user.action"

export const getnotification = async ()=>{
    try {
        const userId = await getDatabaseUserId()
        if(!userId) return []   
        const notification = await prisma.notification.findMany({
            where:{
                userId
            },
            include:{
                creator:{
                    select:{
                        id:true,
                        name:true,
                        username:true,
                        image:true
                    },
                },
                post:{
                    select:{
                        id:true,
                        content:true,
                        image:true
                    },
                },
                comment:{
                    select:{
                        id:true,
                        content:true,
                        createdAt:true
                    },
                },
            },
            orderBy:{
                createdAt:"desc"
            }
        })

        return notification
    } catch (error) {
        console.log("Error in Notification.ts" , error)

    }
}

export const marknotification = async (notification :string[]) =>{
    try {
        await prisma.notification.updateMany({
            where:{
                id:{
                    in:notification,
                }
            },
            data:{
                read:true
            },
        })
        return {success:true}
    } catch (error) {
        console.log("Error in Mark Notification", error)
        return { success: false }
    }
}