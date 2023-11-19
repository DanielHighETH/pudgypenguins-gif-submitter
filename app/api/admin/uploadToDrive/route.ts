import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import authorizeAdmin from '@/app/lib/authorizeAdmin';
import { Readable } from 'stream';

function bufferToStream(buffer: Buffer) {
  const stream = new Readable({
    read() {}
  });

  stream.push(buffer);
  stream.push(null);

  return stream;
}

const auth = new google.auth.GoogleAuth({
  credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    },
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

async function uploadFileToDrive(fileName: string, mimeType: string, fileContent: string) {
  const buffer = Buffer.from(fileContent, 'base64')
  const stream = bufferToStream(buffer)
  const folderId = process.env.GOOGLE_FOLDER_ID as string;
  try {
    const res = await drive.files.create({
     requestBody: {
        name: fileName,
        mimeType,
        parents: [folderId],
      },
      media: {
        mimeType,
        body: stream,
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Error fetching files:", error.message)
    return null
  }
}

async function createShareableLinkAndGetDetails(fileId: string) {
  try {
    // Change the permission to 'reader' for view-only or 'writer' for editable access
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    const file = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink, webContentLink'
    });

    return file.data;
  } catch (error: any) {
    console.error("Error creating shareable link:", error.message);
    return null;
  }
}

export async function POST(req: NextRequest) {
    const authError = await authorizeAdmin(req);
    if (authError) {
        return NextResponse.json({ error: authError.error }, { status: authError.status });
    }
    
    try{
        const driveBody = await req.json();
        const uploadedFileData = await uploadFileToDrive(driveBody.fileName, driveBody.mimeType, driveBody.fileContent);
        if (uploadedFileData && uploadedFileData.id) {
          // Get file details
          const details = await createShareableLinkAndGetDetails(uploadedFileData.id);
        
          return NextResponse.json({ details: details }, { status: 200 });
        } else{
          return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
        }
        
    } catch(error: any){
        console.error('Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
