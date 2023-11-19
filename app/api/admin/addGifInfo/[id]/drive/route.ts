import { NextRequest, NextResponse } from 'next/server'
import connectToDB from '@/app/lib/connectToDb';
import { ObjectId } from 'mongodb';
import authorizeAdmin from '@/app/lib/authorizeAdmin';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {

    const authError = await authorizeAdmin(req);
    if (authError) {
        return NextResponse.json({ error: authError.error }, { status: authError.status });
    }

    try {
        const db = await connectToDB('submissions');
        const collection = db.collection('gifs');

        const body = await req.json();
        const { googleDriveUrl } = body;

        const result = await collection.updateOne(
            { _id: new ObjectId(params.id) },
            { 
              $set: { 
                googleDriveUrl: googleDriveUrl, 
              } 
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "No document found with the provided ID" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: 'Data added successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
