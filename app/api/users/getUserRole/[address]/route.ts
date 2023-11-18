import { NextRequest, NextResponse } from 'next/server'
import connectToDB from '@/app/lib/connectToDb';

export async function GET(req: NextRequest, { params }: { params: { address: string } }) {
    const db = await connectToDB('submissions');
    const collection = db.collection('users');

    const address = params.address;

    try{
        const existingUser = await collection.findOne({ userWallet: address.toLowerCase() });
        if (existingUser && existingUser.role === 'admin') {
            return NextResponse.json({ role: existingUser.role, status: 200 });
        } else {
            return NextResponse.json({ role: 'user', status: 200 });
        }
    } catch(error: any){
        return NextResponse.json({ error: "User not found", role: null, status: 400});
    }
}