import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface FetchOptions extends RequestInit {}

function useAuthenticatedFetch() {
    const router = useRouter();

    const authenticatedFetch = useCallback(async (url: string, options: FetchOptions = {}): Promise<Response> => {
        const walletAddress = localStorage.getItem('walletAddress');
        const signature = sessionStorage.getItem('userSignature');
        const signedMessage = sessionStorage.getItem('signedMessage');

        if (!walletAddress || !signature || !signedMessage) {
            router.push('/');
            throw new Error('Authentication details not found');
        }

        // Merge headers with the authentication headers
        const headers = {
            ...options.headers,
            'Wallet-Address': walletAddress,
            'Signature': signature,
            'Signed-Message': signedMessage,
        };

        return fetch(url, { ...options, headers });
    }, [router]);

    return authenticatedFetch;
}

export default useAuthenticatedFetch;
