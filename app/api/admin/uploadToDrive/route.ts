import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import authorizeAdmin from '@/app/lib/authorizeAdmin';

async function uploadFileToDrive(fileName: string, mimeType: string, fileContent: Buffer) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      },
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  const drive = google.drive({ version: 'v3', auth });

  try {
    const res = await drive.files.list()
    const files = res.data.files

    console.log(files)
    return files
  } catch (error: any) {
    console.error("Error fetching files:", error.message)
    return null
  }
}

export async function POST(req: NextRequest) {
    // const authError = await authorizeAdmin(req);
    // if (authError) {
    //     return NextResponse.json({ error: authError.error }, { status: authError.status });
    // }
    
    try{
        const driveBody = await req.json();
        const upload = await uploadFileToDrive(driveBody.fileName, driveBody.mimeType, driveBody.fileContent);
        return NextResponse.json({ upload }, { status: 200 });
    } catch(error: any){
        console.error('Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
