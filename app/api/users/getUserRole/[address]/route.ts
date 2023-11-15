import { NextRequest, NextResponse } from 'next/server'
import connectToDB from '../../../../lib/connectToDb';

export async function GET(req: NextRequest, { params }: { params: { address: string } }) {
    const db = await connectToDB('submissions');
    const collection = db.collection('users');

    const address = params.address;

    try{
        const existingUser = await collection.findOne({ userWallet: address });
        if (existingUser && existingUser.role === 'admin') {
            return NextResponse.json({ role: existingUser.role });
        } else {
            return NextResponse.json({ role: 'user' });
        }
    } catch(error){
        return NextResponse.json({ error: "User not found", role: null });
    }
}