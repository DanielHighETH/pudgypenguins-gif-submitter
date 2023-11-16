import { NextRequest, NextResponse } from 'next/server';
import authorizeAdmin from '@/app/lib/authorizeAdmin';

type GiphyUploadBody = {
    source_image_url: string;
    username: string;
    tags: string;
    source_post_url: string;
}

async function uploadToGiphy(uploadBody: GiphyUploadBody, apiKey: string) {
    try{
        const response = await fetch(`https://upload.giphy.com/v1/gifs?api_key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadBody),
        });

        return response.json();
    } catch(error){
        return NextResponse.json({ error: error, test: "test" }, { status: 403 });
    }
}

export async function POST(req: NextRequest) {
    const authError = await authorizeAdmin(req);
    if (authError) {
        return NextResponse.json({ error: authError.error }, { status: authError.status });
    }

    try {
        const giphyBody = await req.json();        
        const apiKey = process.env.GIPHY_API_KEY as string;

        // Upload the main file
        const giphyUpload = await uploadToGiphy({
            source_image_url: giphyBody.file,
            username: giphyBody.username,
            tags: giphyBody.tags,
            source_post_url: giphyBody.source_post_url,
        }, apiKey);

        // If a sticker is provided, upload it
        let stickerUpload = null;
        if (giphyBody.sticker !== "") {
            stickerUpload = await uploadToGiphy({
                source_image_url: giphyBody.sticker,
                username: giphyBody.username,
                tags: giphyBody.tags,
                source_post_url: giphyBody.source_post_url,
            }, apiKey);
        }

        return NextResponse.json({ giphyUpload, stickerUpload }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
