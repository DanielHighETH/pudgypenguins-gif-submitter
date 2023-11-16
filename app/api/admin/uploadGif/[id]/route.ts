import { NextRequest, NextResponse } from 'next/server'
import authorizeAdmin from '@/app/lib/authorizeAdmin';

export async function POST(req: NextRequest, { params }: { params: { id: string, status: string } }) {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

    const authError = await authorizeAdmin(req);
    if (authError) {
        return NextResponse.json({ error: authError.error }, { status: authError.status });
    }

    const body = await req.json();
    const walletAddress = req.headers.get('Wallet-Address');
    const signature = req.headers.get('Signature');
    const signedMessage = req.headers.get('Signed-Message');

    if (!walletAddress || !signature || !signedMessage) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        //giphy upload
        const giphyBody = {
            file: body.file,
            username: body.username,
            tags: body.tags,
            source_post_url: body.source_post_url,
            sticker: body.sticker,
        }

        const giphyUpload = await fetch(`${BASE_URL}/api/admin/uploadToGiphy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Wallet-Address': walletAddress,
                'Signature': signature,
                'Signed-Message': signedMessage,
            },
            body: JSON.stringify(giphyBody),
        });

        if (!giphyUpload.ok) {
            return NextResponse.json({ error: giphyUpload, giphyFailed: true }, { status: 403 });
        }

        return NextResponse.json({ giphyUpload, giphyFailed: false }, { status: 200 });

        //google disk upload here -> tweet -> update status
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error}, { status: 403 });
    }


    //update status
    //     try{
    //     const response = await fetch(`${BASE_URL}/api/admin/updateGif/${params.id}/uploaded`, {
    //         method: 'GET',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //       });

    //       if (response.ok) {
    //         //this will be finish of an upload            
    //       } else {
    //         return NextResponse.json({ error: response }, { status: 403 });
    //     }
    // } catch(error){
    //     return NextResponse.json({ error: error }, { status: 403 });
    // }
}
