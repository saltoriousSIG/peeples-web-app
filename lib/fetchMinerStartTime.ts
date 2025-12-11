"use server";
import { ethers } from "ethers";

const MINER_ADDRESS = "0xF69614F4Ee8D4D3879dd53d5A039eB3114C794F6";
const MINER_ABI = [
  {
    "inputs": [],
    "name": "startTime",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

export const fetchMinerStartTime = async (): Promise<number | null> => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(MINER_ADDRESS, MINER_ABI, provider);
    const startTime = await contract.startTime();
    return Number(startTime);
  } catch (e) {
    console.error("Failed to fetch miner startTime:", e);
    return null;
  }
};
