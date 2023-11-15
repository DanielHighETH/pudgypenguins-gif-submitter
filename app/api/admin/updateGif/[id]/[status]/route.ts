import { NextRequest, NextResponse } from 'next/server'
import connectToDB from '../../../../../lib/connectToDb';
import { ObjectId } from 'mongodb';
import authorizeAdmin from '../../../../../lib/authorizeAdmin';

export async function PUT(req: NextRequest, { params }: { params: { id: string, status: string } }) {

    const authError = await authorizeAdmin(req);
    if (authError) {
        return NextResponse.json({ error: authError.error }, { status: authError.status });
    }

    try{
        const db = await connectToDB('submissions');
        const collection = db.collection('gifs');

        // Update the status for the provided ID
        const result = await collection.updateOne(
            { _id: new ObjectId(params.id) },
            { $set: { status: params.status } }
        );

        // Check if the update was successful
        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "No document found with the provided ID" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: 'Status updated successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
