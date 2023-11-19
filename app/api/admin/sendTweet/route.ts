import { NextRequest, NextResponse } from 'next/server';
import authorizeAdmin from '@/app/lib/authorizeAdmin';
import axios from 'axios';
import { client } from '@/app/lib/twitterClient';
async function sendTweet(firstTweetText: string, imageUrl: string, secondTweetText: string) {
    try {
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
        });
        const imageBuffer = Buffer.from(response.data, 'binary');

        // Upload media
        const imageResponse = await client.v1.uploadMedia(imageBuffer, { mimeType: 'image/gif' });

        // Send first tweet
        const firstTweetData = {
            text: firstTweetText,
            media: {
                media_ids: [imageResponse],
            }
        }

        const tweet = await client.v2.tweet(firstTweetData)

        // Send second tweet
        const secondTweetData = {
            text: secondTweetText,
            reply: {
                in_reply_to_tweet_id: tweet.data.id.toString(),
            }
        }

        await client.v2.tweet(secondTweetData)
        return tweet.data.id;
    } catch (error) {
        throw error;
    }
}

export async function POST(req: NextRequest) {
    const authError = await authorizeAdmin(req);

    if (authError) {
        return NextResponse.json({ error: authError.error }, { status: authError.status });
    }

    try {
        const tweetBody = await req.json();
        const tweetId = await sendTweet(tweetBody.tweet, tweetBody.gifUrl, tweetBody.giphyUrl);
        return NextResponse.json({ tweetId, success: true }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 403 });
    }
}
