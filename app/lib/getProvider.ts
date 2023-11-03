import { ethers, providers } from "ethers";

export type ConnectionType = "metamask";

const getProvider = async (connectionType: ConnectionType): Promise<providers.Web3Provider | undefined> => {
  let provider: providers.Web3Provider | undefined;

  switch (connectionType) {
    case 'metamask':
      if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.enable();
      } else {
        console.error("Metamask not detected!");
      }
      break;
    default:
      console.error("Unknown connection type");
      break;
  }

  return provider;
}

export default getProvider;
