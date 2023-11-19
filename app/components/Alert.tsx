'use client'
import React, { useEffect } from 'react';
import { useAlert } from '@/app/components/UseAlert';

const Alert: React.FC = () => {
    const { message, clearMessage } = useAlert();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                clearMessage();
            }, 5000); // 5 seconds

            return () => clearTimeout(timer);
        }
    }, [message, clearMessage]);

    if (!message) return null;

    return (
        <div className="fixed top-40 right-5 p-2 pr-10 pl-6 bg-sky-blue text-white rounded-lg uppercase" style={{ animation: 'slideInRight 0.5s forwards', border: '3px solid #00142d' }}>
            {message}
            <button onClick={clearMessage} className="absolute text-2xl pl-4" style={{ top: '5.5px' }}>
                ×
            </button>
        </div>
    );
};

export default Alert;
