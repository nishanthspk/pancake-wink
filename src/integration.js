import { ethers } from "ethers";
import Abi from "./abi.json";

const HARD_CODED_EPOCH = 306602; // Hard-coded epoch value

const weiValue = "1000000000000000";
const etherValue = ethers.utils.formatEther(weiValue);

// Function to convert BigInt to a JSON-serializable format (string)
function serializeBigInt(data) {
  if (typeof data === "bigint") {
    return data.toString();
  } else if (Array.isArray(data)) {
    return data.map(serializeBigInt);
  } else if (typeof data === "object" && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, serializeBigInt(value)])
    );
  }
  return data;
}

const BSC_MAINNET_RPC_URL = import.meta.env.VITE_RPC_URL;

export async function initializeContract() {
  try {
    // Initialize provider using BSC Mainnet RPC

    const provider = new ethers.providers.JsonRpcProvider(BSC_MAINNET_RPC_URL);

    // Replace with your actual private key
    const privateKey = "2fe19645fa8f2036d77bd9a459478fcd92655899df2cb3d876b9d02aaf6c9ef3";

    // Create signer from private key
    const signer = new ethers.Wallet(privateKey, provider);

    // Get the address from the signer
    const address = await signer.getAddress();

    // Fetch the chain ID for BSC Mainnet (it should return 56 for BSC Mainnet)
    const chainId = await provider.getNetwork().then((network) => network.chainId);

  //   const provider = new ethers.providers.Web3Provider(window.ethereum);

  // const signer = provider.getSigner(); // Get the signer from the provider


  //   // Contract address for PancakeSwap
    const ContractAddress = "0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA";

    // Assuming you have the ABI for the contract
    const contract = new ethers.Contract(ContractAddress, Abi, signer);

    return { provider, signer, contract };
  } catch (error) {
    console.error("Error initializing contract:", error);
    throw error;
  }
}

export async function getBalance(contract, address) {
  const balance = await contract.balanceOf(address); // This might return a BigInt
  return serializeBigInt(balance); // Ensure the balance is JSON-serializable
}

export async function betBull(value) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []); // Request access to MetaMask accounts

  const signer = provider.getSigner(); // Get the signer from the provider
  const address = await signer.getAddress(); // Get the address from the signer

  const ContractAddress = "0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA";
  const contract = new ethers.Contract(ContractAddress, Abi, signer);

  const parsedValue = ethers.utils.parseEther(value);



  const actual_epoch = await contract.currentEpoch();


  const epoch_in_string = actual_epoch.toString();

  const BetBull = await contract.betBull(epoch_in_string, {
    value: parsedValue
  });
  await BetBull.wait();
}



export async function betBear(value) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []); // Request access to MetaMask accounts

  const signer = provider.getSigner(); // Get the signer from the provider
  const address = await signer.getAddress(); // Get the address from the signer

  const ContractAddress = "0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA";
  const contract = new ethers.Contract(ContractAddress, Abi, signer);

  const parsedValue = ethers.utils.parseEther(value);



  const actual_epoch = await contract.currentEpoch();


  const epoch_in_string = actual_epoch.toString();

  const BetBear = await contract.betBear(epoch_in_string, {
    value: parsedValue,
  });
  await BetBear.wait();
}
export async function getRound(value) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []); // Request access to MetaMask accounts

  const signer = provider.getSigner(); // Get the signer from the provider
  const address = await signer.getAddress(); // Get the address from the signer

  const ContractAddress = "0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA";
  const contract = new ethers.Contract(ContractAddress, Abi, signer);








  const roundvalues = await contract.rounds(value)
  await roundvalues.wait();

  return roundvalues;
}


export async function currentEpoch(contract) {
  const epoch = await contract.currentEpoch(); // This might return a BigInt
  return serializeBigInt(epoch);
  // Ensure the epoch is JSON-serializable
}
