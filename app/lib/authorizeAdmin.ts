import { NextRequest } from 'next/server';
import verifySignature from '@/app/lib/verifySignature';
import getUserRole from '@/app/lib/getUserRole';

async function authorizeAdmin(req: NextRequest) {
    const walletAddress = req.headers.get('Wallet-Address');
    const signature = req.headers.get('Signature');
    const signedMessage = req.headers.get('Signed-Message');

    if (!walletAddress || !signature || !signedMessage) {
        return { error: "Unauthorized", status: 401 };
    }

    if (!verifySignature(walletAddress, signedMessage, signature)) {
        return { error: "Invalid signature", status: 401 };
    }

    const userRole = await getUserRole(walletAddress);
    if (userRole.role !== 'admin') {
        return { error: "Unauthorized: Admin role required", status: 401 };
    }

    return null;
}

export default authorizeAdmin;
