// /app/api/upload/route.ts

import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

// POST /api/upload
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as Blob;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const stream = Readable.from(buffer);

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "socialmedia" },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error("Cloudinary returned no result"));
                    resolve(result);
                }
            );

            stream.pipe(uploadStream);
        });

        const { secure_url, public_id, width, height, format } = result as any;

        if (!secure_url) {
            return NextResponse.json({ error: "Upload succeeded but no URL returned" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: {
                secure_url,
                public_id,
                width,
                height,
                format,
            },
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
