import { NextRequest, NextResponse } from 'next/server'
import connectToDB from '../../../../lib/connectToDb';
import authorizeAdmin from '../../../../lib/authorizeAdmin';

export async function GET(req: NextRequest, { params }: { params: { status: string } }) {

    const authError = await authorizeAdmin(req);
    if (authError) {
        return NextResponse.json({ error: authError.error }, { status: authError.status });
    }

    const db = await connectToDB('submissions');
    const collection = db.collection('gifs');

    if(params.status === 'all'){
        const data = await collection.find({}).toArray();
        return NextResponse.json(data);
    } else {
        const data = await collection.find({ status: params.status }).toArray();
        return NextResponse.json(data);
    }
}
