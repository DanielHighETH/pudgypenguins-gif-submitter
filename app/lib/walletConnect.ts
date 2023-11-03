import getProvider, { ConnectionType } from './getProvider';
import { providers } from 'ethers';

//TODO: Instead of returning null, return an custom error alert

async function connectWallet(connectionType: ConnectionType): Promise<string | null> {
  try {
    const provider = await getProvider(connectionType);
    if (!provider) {
      console.error("Provider not initialized");
      return null;
    }
    const network = await provider.getNetwork();
    if (network.chainId !== 80001) {
        console.error("Please connect to the Polygon Mumbai testnet");
        return null
      }
      // if (network.chainId !== 137) {
      //   console.error("Please connect to the Polygon Mainnet");
      //   return null
      // }

    const signer: providers.JsonRpcSigner = provider.getSigner();
    const accounts: string[] = await provider.send('eth_requestAccounts', []);
    const address: string = accounts[0];

    const message = "Hello! Welcome to PudgyProfile please sign this message to prove ownership of your wallet.";
    const signature = await signer.signMessage(message);

    if (!signature) {
      console.error("Failed to sign the message.");
      return null;
    }

    return address;
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    return null;
  }
}

export default connectWallet;
