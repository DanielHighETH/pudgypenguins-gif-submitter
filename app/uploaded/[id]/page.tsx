'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Loader from '@/app/components/Loader';

type GifSubmission = {
    twitterUsername: string;
    userWallet: string;
    gifIdea: string;
    penguinID: string;
    status: string;
    giphyUrl: string;
    giphyId: string;
    tweetUrl: string;
    googleDriveUrl: string;
};

function UploadedDetail({ params }: { params: { id: string } }) {
    const [gif, setGif] = useState<GifSubmission | null>(null);
    const [loading, setLoading] = useState(true);

    const [gifViews, setGifViews] = useState<number>(0);

    const router = useRouter();

    useEffect(() => {
        fetch(`/api/getUploadedGif/${params.id}`)
            .then((response) => response.json())
            .then(async (data) => {
                setGif(data.submission);
                setLoading(false);
            });
    }, [params.id]);

    useEffect(() => {
        if (gif) {
            fetch(`/api/getGiphyViews/${gif.giphyId}`)
                .then((response) => response.json())
                .then(async (data) => {
                    setGifViews(data.viewCount);
                });
        }
    }, [gif]);

    if (loading) {
        return <Loader />;
    }

    if (!gif) {
        return <div>No submission found.</div>;
    }

    return (
        <div className='mx-4 md:mx-10 lg:mx-72'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl mt-10 mb-10'>
                Uploaded GIF Details
            </h1>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className='bg-white shadow-lg rounded-lg p-6'>
                        <p className="mb-4">
                            <strong>Twitter: </strong><a href={`https://twitter.com/${gif.twitterUsername}`} target='_blank' rel='noopener noreferrer' className="text-sky-blue hover:text-oxford-blue">
                                @{gif.twitterUsername}
                            </a>
                        </p>                <p className='mb-4'><strong>GIF Idea:</strong> {gif.gifIdea}</p>
                        <p className='mb-4'><strong>Penguin #:</strong> {gif.penguinID}</p>
                        <p className='mb-4'><strong>Wallet Address:</strong> {gif.userWallet}</p>
                        <p className='mb-4'><strong><a href={gif.giphyUrl} target='_blank' rel='noopener noreferrer' className="text-sky-blue hover:text-oxford-blue">Giphy</a></strong></p>
                        <p className='mb-4'><strong><a href={gif.tweetUrl} target='_blank' rel='noopener noreferrer' className="text-sky-blue hover:text-oxford-blue">Tweet</a></strong></p>
                        <p className='mb-4'><strong><a href={gif.googleDriveUrl} target='_blank' rel='noopener noreferrer' className="text-sky-blue hover:text-oxford-blue">Google Drive</a></strong></p>
                        <p className="mb-8"><strong>Giphy views:</strong> {gifViews} views</p>
                    </div>

                </>
            )}
        </div>
    )
}

export default UploadedDetail;