import { NextRequest, NextResponse } from 'next/server'
import connectToDB from '@/app/lib/connectToDb';
import { ObjectId } from 'mongodb';
import authorizeAdmin from '@/app/lib/authorizeAdmin';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

    const authError = await authorizeAdmin(req);
    if (authError) {
        return NextResponse.json({ error: authError.error }, { status: authError.status });
    }

    const db = await connectToDB('submissions');
    const collection = db.collection('gifs');

    const _id = new ObjectId(params.id);

    try {
        const submission = await collection.findOne({ _id });

        if (!submission) {
            return NextResponse.json({ error: "No submission found" }, { status: 400 });
        }

        return NextResponse.json({ submission }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
