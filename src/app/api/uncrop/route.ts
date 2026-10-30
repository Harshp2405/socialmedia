import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const photo = form.get('image_file') as Blob | null;
    const extendLeft = form.get('extend_left') || '0';
    const extendDown = form.get('extend_down') || '0';
    const extendTop = form.get('extend_up') || '0';
    const extendright = form.get('extend_right') || '0';

    if (!photo || typeof photo !== 'object') {
      return NextResponse.json({ error: 'Missing or invalid image_file' }, { status: 400 });
    }

    const apiKey = process.env.CLIPDROP_API;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing ClipDrop API key' }, { status: 500 });
    }

    const formData = new FormData();
    formData.append('image_file', photo);
    formData.append('extend_left', extendLeft);
    formData.append('extend_down', extendDown);
    formData.append('extend_up', extendTop);
    formData.append('extend_right', extendright);

    const clipdropRes = await fetch('https://clipdrop-api.co/uncrop/v1', {
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

    const imageBuffer = await clipdropRes.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString('base64');
    const image64 = `data:image/jpeg;base64,${base64}`;

    return NextResponse.json({ image64 });
  } catch (err: any) {
    console.error('ClipDrop uncrop error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}


// import { NextResponse } from 'next/server';
// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();

//     const photo = formData.get('image_file') as Blob | null;
//     const extendLeft = formData.get('extend_left')?.toString() || '0';
//     const extendDown = formData.get('extend_down')?.toString() || '0';

//     if (!photo || typeof photo !== 'object') {
//       return NextResponse.json({ error: 'Missing or invalid image_file' }, { status: 400 });
//     }

//     const apiKey = process.env.CLIPDROP_API;
//     if (!apiKey) {
//       return NextResponse.json({ error: 'Missing ClipDrop API key' }, { status: 500 });
//     }

//     const form = new FormData();
//     form.append('image_file', photo);
//     form.append('extend_left', extendLeft);
//     form.append('extend_down', extendDown);

//     const clipdropRes = await fetch('https://clipdrop-api.co/uncrop/v1', {
//       method: 'POST',
//       headers: {
//         'x-api-key': apiKey,
//       },
//       body: form,
//     });

//     if (!clipdropRes.ok) {
//       const errorText = await clipdropRes.text();
//       return NextResponse.json({ error: errorText }, { status: clipdropRes.status });
//     }

//     const imageBuffer = await clipdropRes.arrayBuffer();
//     const base64 = Buffer.from(imageBuffer).toString('base64');
//     const image64 = `data:image/jpeg;base64,${base64}`;

//     return NextResponse.json({ image64 });
//   } catch (err: any) {
//     console.error('ClipDrop uncrop error:', err);
//     return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
//   }
// }
