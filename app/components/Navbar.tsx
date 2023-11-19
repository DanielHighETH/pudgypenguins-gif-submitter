'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import connectWallet from '../lib/connectWallet';
import Link from 'next/link';

function Navbar() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
      fetchUserRole(savedAddress);
    }
  }, []);

  const handleConnectWallet = async () => {
    try {
      const connectedAddress = await connectWallet("metamask");
      if (connectedAddress) {
        localStorage.setItem("walletAddress", connectedAddress);
        setWalletAddress(connectedAddress);
        fetchUserRole(connectedAddress);
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
        setUserRole(data.role);
        localStorage.setItem("userRole", data.role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-sky-blue text-white">
      <div className="font-typeType text-4xl navbarText">
        <Link href="/">PudgyGIFs</Link>
      </div>
      <div className="flex gap-4">
        <button
          className="main-button py-2 px-4"
          onClick={() => router.push('/')}
        >
          Home
        </button>
        {(userRole === 'admin' || userRole === 'uploader') && (
          <button
            className="main-button py-2 px-4"
            onClick={() => router.push('/admin')}
          >
            Admin
          </button>
        )}
        {!walletAddress && (
          <button
            id="connectWallet"
            className="main-button py-2 px-4"
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </button>
        )}
        {walletAddress && (
          <button
            className="main-button py-2 px-4"
            onClick={() => router.push('/profile')}
          >
            Profile
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
