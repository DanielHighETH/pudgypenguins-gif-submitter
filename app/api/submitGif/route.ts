import { NextResponse, NextRequest } from 'next/server'
import connectToDB from '@/app/lib/connectToDb';

type GifSubmission = {
    twitterUsername: string;
    userWallet: string;
    gifIdea: string;
    penguinID: string;
};

function processedTwitterUsername(input: string): string {
    // Remove leading '@' if it exists
    if (input.startsWith('@')) {
        input = input.substring(1);
    }

    // Extract username from a full Twitter URL
    const twitterUrlPattern = /twitter\.com\/([a-zA-Z0-9_]+)/;
    const twitterMatch = input.match(twitterUrlPattern);
    if (twitterMatch && twitterMatch[1]) {
        return twitterMatch[1];
    }

    // Extract username from a custom URL format like x.com/username
    const xUrlPattern = /x\.com\/([a-zA-Z0-9_]+)/;
    const xMatch = input.match(xUrlPattern);
    if (xMatch && xMatch[1]) {
        return xMatch[1];
    }

    return input;
}


// Named export for the POST method
export async function POST(req: NextRequest) {
    try {
        const db = await connectToDB('submissions');
        const collection = db.collection('gifs');

        const data = await req.json()


        if (!data) {
            return NextResponse.json({ error: "No data provided" }, { status: 400 });
        }

        const { twitterUsername, userWallet, gifIdea, penguinID } = data as GifSubmission;
        if (!twitterUsername || !userWallet || !gifIdea || !penguinID) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const extractedTwitterUsername = processedTwitterUsername(twitterUsername);

        const dataToInsert = {
            twitterUsername: extractedTwitterUsername,
            userWallet,
            gifIdea,
            penguinID,
            status: 'pending',
            date: new Date(),
        };

        await collection.insertOne(dataToInsert);

        return NextResponse.json({ success: true, message: 'Gif was successfully submitted', data: dataToInsert }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
