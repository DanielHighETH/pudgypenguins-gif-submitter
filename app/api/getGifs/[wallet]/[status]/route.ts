import { NextRequest, NextResponse } from 'next/server'
import connectToDB from '@/app/lib/connectToDb';

export async function GET(req: NextRequest, { params }: { params: { wallet: string, status: string } }) {

    const db = await connectToDB('submissions');
    const collection = db.collection('gifs');

    if(params.status === 'all'){
        const data = await collection.find({ userWallet: params.wallet.toLowerCase() }).toArray();
        return NextResponse.json(data);
    } else {
        const data = await collection.find({ userWallet: params.wallet.toLowerCase(), status: params.status }).toArray();
        return NextResponse.json(data);
    }
}
