import { NextRequest, NextResponse } from 'next/server'
import connectToDB from '@/app/lib/connectToDb';

type UserSubmission = {
    address: string;
    signature: string;
};

export async function POST(req: NextRequest) {
    const db = await connectToDB('submissions');
    const collection = db.collection('users');

    const data = await req.json();

    if (!data) {
        return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const { address, signature } = data as UserSubmission;
    if (!address || !signature) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }


    const existingUser = await collection.findOne({ address });
    if (existingUser) {
        await collection.updateOne({ address }, { $set: { signature } });
    } else {
        const dataToInsert = {
            userWallet: address,
            signature,
            role: 'user',
            date: new Date()
        };

        const result = await collection.insertOne(dataToInsert);
        if (result.insertedCount === 0) {
            console.error("Failed to insert user into database.");
            return NextResponse.json({ error: "Failed to insert user into database." });
        }
    }

    return NextResponse.json({ success: true });
}