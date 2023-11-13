export interface FilterProps {
    submissions: Submission[];
    setFilteredSubmissions: (filtered: Submission[]) => void;
}

export interface Submission {
    _id: string;
    twitterUsername: string;
    gifIdea: string;
    penguinID: string;
    userWallet: string;
}