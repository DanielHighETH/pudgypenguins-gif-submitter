import { NextRequest, NextResponse } from 'next/server'
import authorizeAdmin from '@/app/lib/authorizeAdmin';

export async function POST(req: NextRequest, { params }: { params: { id: string, status: string } }) {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

    const authError = await authorizeAdmin(req);
    if (authError) {
        return NextResponse.json({ error: authError.error }, { status: authError.status });
    }

    const body = await req.json();
    const walletAddress = req.headers.get('Wallet-Address');
    const signature = req.headers.get('Signature');
    const signedMessage = req.headers.get('Signed-Message');

    if (!walletAddress || !signature || !signedMessage) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const headers = {
            'Content-Type': 'application/json',
            'Wallet-Address': walletAddress,
            'Signature': signature,
            'Signed-Message': signedMessage,
        };


        //giphy upload
        const giphyBody = {
            file: body.file,
            username: process.env.GIPHY_USERNAME || 'Pudgy Penguins',
            tags: body.tags,
            source_post_url: body.source_post_url,
            sticker: body.sticker,
        }

        const giphyUpload = await fetch(`${BASE_URL}/api/admin/uploadToGiphy`, {
            method: 'POST',
            headers,
            body: JSON.stringify(giphyBody),
        });

        if (!giphyUpload.ok) {
            return NextResponse.json({ error: giphyUpload, giphyFailed: true }, { status: 403 });
        }

        const giphyUploadJson = await giphyUpload.json();
        const giphyUrl = `https://giphy.com/gifs/${giphyUploadJson.giphyUpload.data.id}`;


        //SEND TWEET
        const tweetBody = {
            tweet: body.tweetText,
            gifUrl: body.file,
            giphyUrl,
        }

        const sendTweet = await fetch(`${BASE_URL}/api/admin/sendTweet`, {
            method: 'POST',
            headers,
            body: JSON.stringify(tweetBody),
        });
        
        const sendTweetJson = await sendTweet.json();
        const tweetUrl = `https://twitter.com/${process.env.ACCOUNT_NAME}/status/${sendTweetJson.tweetId}`

        if (!sendTweet.ok) {
            return NextResponse.json({ error: sendTweet, giphyFailed: false, tweetFailed: true }, { status: 403 });
        }

        //update status
        const statusUpdatePromise = fetch(`${BASE_URL}/api/admin/updateGif/${params.id}/uploaded`, { method: 'PUT', headers });
        const addInfoPromise = fetch(`${BASE_URL}/api/admin/addGifInfo/${params.id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ giphyUrl, giphyId: giphyUploadJson.giphyUpload.data.id, tweetUrl })
        });

        await Promise.all([statusUpdatePromise, addInfoPromise]);

         return NextResponse.json({ uploaded: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 403 });
    }
}
