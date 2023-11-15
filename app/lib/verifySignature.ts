import { ethers } from 'ethers';

export default function verifySignature(walletAddress: string, signedMessage: string, signature: string) {
    try {
        const recoveredAddress = ethers.utils.verifyMessage(signedMessage, signature);
        return recoveredAddress.toLowerCase() === walletAddress;
    } catch (error) {
        return false;
    }
}
