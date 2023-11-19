'use client'
import React from 'react';
import Link from 'next/link';
import connectWallet from '../lib/connectWallet';
import { useEffect, useState } from 'react';


function Profile() {

    const [walletAddress, setWalletAddress] = useState<string>('');

    const handleConnectWallet = async () => {
        try {
          const connectedAddress = await connectWallet("metamask");
          if (connectedAddress) {
            localStorage.setItem("walletAddress", connectedAddress);
          }
        } catch (error) {
          console.error("Error connecting to wallet:", error);
        }
      };

    const fetchUserRole = async (address: string) => {
        try {
          const response = await fetch(`/api/users/getUserRole/${address}`);
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("userRole", data.role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      };

      useEffect(() => {
        const savedAddress = localStorage.getItem("walletAddress");
        if (savedAddress) {
          setWalletAddress(savedAddress);
          fetchUserRole(savedAddress);
        } else {
            handleConnectWallet();
        }
      }, []);

    const profileLinks = [
        { title: 'My Submissions', href: `/profile/submissions/`, icon: '🕒' },
        { title: 'My uploaded GIFs', href: `/profile/uploaded/`, icon: '📤' },
    ];

    return (
        <div className='mx-auto max-w-7xl p-5'>
            <h1 className='text-5xl text-left mb-10'>Profile</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {profileLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="border rounded p-6 shadow hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center text-2xl">
                            <span>{link.icon}</span>
                            <span>{link.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Profile;


