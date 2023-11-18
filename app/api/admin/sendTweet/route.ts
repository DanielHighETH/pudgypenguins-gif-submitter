import { NextRequest, NextResponse } from 'next/server';
import authorizeAdmin from '@/app/lib/authorizeAdmin';
import axios from 'axios';
import { client } from '@/app/lib/twitterClient';

async function sendTweet(firstTweetText: string, imageUrl: string, secondTweetText: string) {
    (async () => {
        try {
            const response = await axios.get(imageUrl, {
                responseType: 'arraybuffer',
            });
            const imageBuffer = Buffer.from(response.data, 'binary');

            //upload media

            const imageResponse = await client.v1.uploadMedia(imageBuffer, { mimeType: 'image/gif' });

            //send tweet

            const firstTweetData = {
                text: firstTweetText,
                media: {
                    media_ids: [imageResponse],
                }
            }

            const tweet = await client.v2.tweet(firstTweetData)

            const secondTweetData = {
                text: secondTweetText,
                reply: {
                    in_reply_to_tweet_id: tweet.data.id.toString(),
                }
            }

            const secondTweet = await client.v2.tweet(secondTweetData)

            return (secondTweet.data.id, tweet.data.id);
        } catch (error) {
            return error
            console.log(error);
        }
    })();
}

export async function POST(req: NextRequest) {
    const authError = await authorizeAdmin(req);

    if (authError) {
        return NextResponse.json({ error: authError.error }, { status: authError.status });
    }

    try {
        const tweetBody = await req.json();
        const tweet = await sendTweet(tweetBody.tweet, tweetBody.gifUrl, tweetBody.giphyUrl);

        return NextResponse.json({ tweet, success: true }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error }, { status: 403 });
    }
}