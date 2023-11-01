import React from 'react';
import Link from 'next/link';

export default function Admin() {
    return (
        <div className='mx-72'>
            <h1 className='text-5xl mt-5'>Admin Page</h1>
            <div className='flex gap-5'>
                <Link href={'/'}>Home</Link>
                <Link href={'/admin/pending'}>Pending Submissions</Link>
                <Link href={'/admin/approved'}>Approved submissions</Link>
                <Link href={'/admin/rejected'}>Rejected submissions</Link>
            </div>
        </div>
    )
}