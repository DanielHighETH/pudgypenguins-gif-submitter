'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Loader from "@/components/Loader"
import OnlyAdmin from '@/components/OnlyAdmin';
import useAuthenticatedFetch from '@/app/lib/authenticatedFetch';

type GifSubmission = {
    twitterUsername: string;
    userWallet: string;
    gifIdea: string;
    penguinID: string;
    status: string;
};

function PendingDetail({ params }: { params: { id: string } }) {
    const [gif, setGif] = useState<GifSubmission | null>(null);
    const [loading, setLoading] = useState(true);
    const fetchWithAuth = useAuthenticatedFetch();

    const router = useRouter();

    useEffect(() => {
        fetchWithAuth(`/api/admin/getGifByID/${params.id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setGif(data.submission);
                setLoading(false);
            });
    }, [params.id, fetchWithAuth]);

    const uploadGif = (id: string) => {
        //upload logic
    };

    const rejectGif = (id: string) => {
        fetchWithAuth(`/api/admin/updateGif/${id}/rejected`, {
            method: 'PUT',
        }).then((response) => {
            if (response.ok) {
                router.push('/admin/approved');
                //alert response
            }
        })
    };

    if (loading) {
        return <Loader />;
    }

    if (!gif) {
        return <div>No submission found.</div>;
    }

    return (
        <div className='mx-4 md:mx-10 lg:mx-72'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl mt-10 mb-10'>
                Gif Submission Detail
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
                        </p>                <p className='mb-4'><strong>Idea for new GIF:</strong> {gif.gifIdea}</p>
                        <p className='mb-4'><strong>Penguin #:</strong> {gif.penguinID}</p>
                        <p className='mb-4'><strong>Wallet Address:</strong> {gif.userWallet}</p>
                        <p className='mb-4'><strong>Status:</strong> {gif.status}</p>
                        
                        <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                            <button className="px-3 py-2 rounded-md bg-white text-oxford-blue border-2 border-oxford-blue hover:bg-sky-blue hover:text-dark"
                                onClick={() => router.back}>Back</button>

                            <button className="px-3 py-2 rounded-md bg-white text-oxford-blue border-2 border-oxford-blue hover:bg-sky-blue hover:text-dark"
                                onClick={() => uploadGif(params.id)}>Upload</button>

                            <button className="px-3 py-2 rounded-md bg-white text-oxford-blue border-2 border-oxford-blue hover:bg-sky-blue hover:text-dark"
                                onClick={() => rejectGif(params.id)}>Reject</button>
                        </div>

                    </div>
                </>
            )}
        </div>
    )
}

export default OnlyAdmin(PendingDetail);