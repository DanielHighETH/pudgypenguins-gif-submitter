'use client'
import React from 'react';
import { useAlert } from '@/app/components/UseAlert';

const Alert: React.FC = () => {
    const { message, clearMessage } = useAlert();

    if (!message) return null;

    return (
        <div className="fixed top-40 right-5 p-2 pr-10 pl-6 bg-sky-blue text-white rounded-lg uppercase" style={{ animation: 'slideInRight 0.5s forwards', border: '3px solid #00142d' }}>
            {message}
            <button onClick={clearMessage} className="absolute text-2xl pl-4" style={{ top: '5.5px'}}>
                ×
            </button>
        </div>  
    );
};

export default Alert;
