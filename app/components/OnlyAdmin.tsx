'use client'
import React, { useEffect, useState, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import Loader from './Loader';

type WithAdminProps = {
};

function OnlyAdmin<T extends WithAdminProps>(Component: ComponentType<T>) {
  return function WithAdminComponent(props: T) {
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const userRole = localStorage.getItem('userRole');

      if (userRole === 'admin') {
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
