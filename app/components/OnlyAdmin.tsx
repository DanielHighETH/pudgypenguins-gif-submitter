'use client'
import React, { useEffect, useState, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import Loader from './Loader';
import connectWallet from '@/app/lib/connectWallet';

type WithAdminProps = {
};

function OnlyAdmin<T extends WithAdminProps>(Component: ComponentType<T>) {
  return function WithAdminComponent(props: T) {
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const userRole = localStorage.getItem('userRole');
      const signature = sessionStorage.getItem('userSignature');
      const signedMessage = sessionStorage.getItem('signedMessage');

      if (userRole === 'admin') {
        if(!signature || !signedMessage) {
          connectWallet("metamask");
        }
        setIsAdmin(true);
      } else {
        router.push('/');
      }
    }, [router]);

    if (!isAdmin) {
      return <Loader />;
    }

    return <Component {...props} />;
  };
}

export default OnlyAdmin;
