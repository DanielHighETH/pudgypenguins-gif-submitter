import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const getViews = await fetch(`https://giphy.com/api/v1/proxy-gif/${params.id}/view-count/`);

        if (getViews.status === 204) {
            // Handle the no-content scenario [happens when the gif is just uploaded]
            return NextResponse.json({ viewCount: 0 }, { status: 200 });
        }
        const data = await getViews.json();
        const viewCount = data.viewCount;
        return NextResponse.json({ viewCount: viewCount }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
