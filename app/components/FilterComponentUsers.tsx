'use client'
import React, { useState, useEffect } from 'react'
import { FilterProps } from './interfaces';

function FilterComponentUsers({ submissions, setFilteredSubmissions }: FilterProps): React.ReactElement {
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const filtered = submissions.filter(submission => 
            submission.gifIdea.toLowerCase().includes(filter.toLowerCase()) ||
            submission.penguinID.toLowerCase().includes(filter.toLowerCase()) ||
            submission.status.toLowerCase().includes(filter.toLowerCase())
        );

        setFilteredSubmissions(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, submissions]);

    return (
        <input
            type="text"
            placeholder="Filter by idea, penguin ID, or status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-2 border-2 border-gray-300 rounded mb-4"
        />
    );
};

export default FilterComponentUsers;
