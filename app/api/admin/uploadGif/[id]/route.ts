import { NextRequest, NextResponse } from 'next/server';
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
        const giphyBody = {
            file: body.file,
            username: process.env.GIPHY_USERNAME || 'Pudgy Penguins',
            tags: body.tags,
            source_post_url: body.source_post_url,
            sticker: body.sticker,
        };

        const tweetBody = {
            tweet: body.tweetText,
            gifUrl: body.file
        };

        const headers = {
            'Content-Type': 'application/json',
            'Wallet-Address': walletAddress,
            'Signature': signature,
            'Signed-Message': signedMessage,
        };

        // Parallel execution of Giphy upload and Tweet send
        const [giphyUpload, sendTweet] = await Promise.all([
            fetch(`${BASE_URL}/api/admin/uploadToGiphy`, { method: 'POST', headers, body: JSON.stringify(giphyBody) }),
            fetch(`${BASE_URL}/api/admin/sendTweet`, { method: 'POST', headers, body: JSON.stringify(tweetBody) })
        ]);

        if (!giphyUpload.ok || !sendTweet.ok) {
            return NextResponse.json({ 
                error: "Failed to upload to Giphy or send Tweet",
                giphyFailed: !giphyUpload.ok,
                tweetFailed: !sendTweet.ok
            }, { status: 403 });
        }

        const [giphyUploadJson, sendTweetJson] = await Promise.all([
            giphyUpload.json(),
            sendTweet.json()
        ]);

        const giphyUrl = `https://giphy.com/gifs/${giphyUploadJson.giphyUpload.data.id}`;
        const tweetUrl = `https://twitter.com/${process.env.ACCOUNT_NAME}/status/${sendTweetJson.tweetId}`;

        // Parallel execution of status update and adding additional info
        const statusUpdate = fetch(`${BASE_URL}/api/admin/updateGif/${params.id}/uploaded`, { method: 'PUT', headers });
        const addInfo = fetch(`${BASE_URL}/api/admin/addGifInfo/${params.id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ giphyUrl, giphyId: giphyUploadJson.giphyUpload.data.id, tweetUrl })
        });

        await Promise.all([statusUpdate, addInfo]);

        return NextResponse.json({ uploaded: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 403 });
    }
}
