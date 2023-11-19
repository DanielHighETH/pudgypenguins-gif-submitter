'use client'
import React from 'react';
import Link from 'next/link';
import OnlyAdmin from '@/app/components/OnlyAdmin';

function Admin() {

    const adminLinks = [
        { title: 'Pending Submissions', href: '/admin/pending', icon: '🕒' },
        { title: 'Approved Submissions', href: '/admin/approved', icon: '✅' },
        { title: 'Rejected Submissions', href: '/admin/rejected', icon: '❌' },
        { title: 'Uploaded Submissions', href: '/admin/uploaded', icon: '📤' },
    ];

    return (
        <div className='mx-auto max-w-7xl p-5'>
            <h1 className='text-5xl text-left mb-10'>Admin Page</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {adminLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="border rounded p-6 shadow hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center text-2xl">
                            <span>{link.icon}</span>
                            <span>{link.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default OnlyAdmin(Admin);


