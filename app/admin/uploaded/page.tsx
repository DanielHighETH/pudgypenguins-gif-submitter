'use client'
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import FilterComponent from '@/app/components/FilterComponent';
import Loader from '@/app/components/Loader';
import { Submission } from '@/app/components/interfaces';
import OnlyAdmin from "@/app/components/OnlyAdmin";
import useAuthenticatedFetch from '@/app/lib/authenticatedFetch';

function Pending() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(false);
    const fetchWithAuth = useAuthenticatedFetch();


    const router = useRouter()


    useEffect(() => {
        setLoading(true);
        fetchWithAuth('/api/admin/getGifs/uploaded')
            .then((response) => response.json())
            .then((data) => {
                setSubmissions(data);
                setLoading(false);
            });
    }, [fetchWithAuth]);

    return (
        <div className='xl:mx-44 md:mx-24 mx-8'>
            <h1 className='text-4xl text-cemter md:text-5xl md:text-left mt-5 mb-5'>Uploaded Submissions</h1>

            <FilterComponent
                submissions={submissions}
                setFilteredSubmissions={setFilteredSubmissions}
            />

            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className="flex flex-wrap -mx-2 mt-5">
                        {filteredSubmissions.map((submission) => (
                            <div key={submission._id} className="w-full md:w-1/2 xl:w-1/3 px-2 mb-4">
                                <div className="border-2 border-oxford-blue rounded-lg p-4 bg-white h-full">
                                    <p className="text-sky-blue hover:text-oxford-blue mb-2">
                                        <a href={`https://twitter.com/${submission.twitterUsername}`} target='_blank' rel='noopener noreferrer'>
                                            @{submission.twitterUsername}
                                        </a>
                                    </p>
                                    <div className="mb-4 overflow-auto h-28 md:h-48 text-justify">
                                        {submission.gifIdea}
                                    </div>
                                    <p className="mb-4 text-sky-blue">{submission.penguinID}</p>

                                    <div className="hidden">{submission.userWallet}</div>

                                    <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                                        <button className="px-3 py-2 rounded-md bg-white text-oxford-blue border-2 border-oxford-blue hover:bg-sky-blue hover:text-dark"
                                            onClick={() => router.push(`/uploaded/${submission._id}`)}>Detail</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

        </div>
    )
}

export default OnlyAdmin(Pending);