import React, { useState, useEffect } from 'react'
import { FilterProps } from './interfaces';

const FilterComponent: React.FC<FilterProps> = ({ submissions, setFilteredSubmissions }) => {
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const filtered = submissions.filter(submission => 
            submission.twitterUsername.toLowerCase().includes(filter.toLowerCase()) ||
            submission.penguinID.toLowerCase().includes(filter.toLowerCase()) ||
            submission.userWallet.toLowerCase().includes(filter.toLowerCase())
        );

        setFilteredSubmissions(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, submissions]);

    return (
        <input
            type="text"
            placeholder="Filter by Username, Penguin ID, or Wallet"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-2 border-2 border-gray-300 rounded mb-4"
        />
    );
};

export default FilterComponent;
