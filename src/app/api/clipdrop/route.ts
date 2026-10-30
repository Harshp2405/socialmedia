import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json({ error: 'Prompt is required and must be a string.' }, { status: 400 });
        }

        const apiKey = process.env.CLIPDROP_API;
        if (!apiKey) {
            return NextResponse.json({ error: 'Missing ClipDrop API key' }, { status: 500 });
        }

        const formData = new FormData();
        formData.append('prompt', prompt);

        const clipdropRes = await fetch('https://clipdrop-api.co/text-to-image/v1', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
            },
            body: formData,
        });

        if (!clipdropRes.ok) {
            const errorText = await clipdropRes.text();
            return NextResponse.json({ error: errorText }, { status: clipdropRes.status });
        }

        // Read buffer only once
        const imageBuffer = await clipdropRes.arrayBuffer();
        console.log(clipdropRes + " Response of clipdrop")
        console.log(imageBuffer + " Response of ImageBuffer")
        
        // Convert to base64
        const base64 = Buffer.from(imageBuffer).toString('base64');
        console.log(base64 + " Response of base64")
        const image64 = `data:image/jpeg;base64,${base64}`;

        // Return base64 image in JSON
        return NextResponse.json({ image64 });
    } catch (err: any) {
        console.error('ClipDrop error:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
