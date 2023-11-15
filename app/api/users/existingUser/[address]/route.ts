import { NextRequest, NextResponse } from 'next/server'
import connectToDB from '../../../../lib/connectToDb';

export async function GET(req: NextRequest, { params }: { params: { address: string } }) {
    const db = await connectToDB('submissions');
    const collection = db.collection('users');

    const address = params.address;

    const existingUser = await collection.findOne({ address });
    if (existingUser) {
        return NextResponse.json(existingUser);
    } else {
        return NextResponse.json({ error: "User not found" });
    }
}