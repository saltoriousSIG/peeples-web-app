"use server"
import { ethers } from "ethers";

const SUBGRAPH_ID = "8LAXZsz9xTzGMH2HB1F78AkoXD9yvxm2epLGr48wDhrK";
const GRAPH_API_KEY = process.env.GRAPH_API_KEY;
const GRAPH_URL = `https://gateway.thegraph.com/api/${GRAPH_API_KEY}/subgraphs/id/${SUBGRAPH_ID}`;

console.log("Using The Graph URL:", GRAPH_URL);

export const fetchGraphData = async (userAddress?: string) => {
  const userQuery = (userAddress && userAddress !== ethers.ZeroAddress)
    ? `account(id: "${userAddress.toLowerCase()}") { id spent earned mined }`
    : "";

  const query = `
    {
      miners(first: 1) {
        revenue
        minted
      }
      glazes(first: 20, orderBy: startTime, orderDirection: desc) {
        id
        uri
        spent
        startTime
        account {
          id
        }
      }
      ${userQuery}
    }
  `;
  try {
    const res = await fetch(GRAPH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const json = await res.json();
    return json.data;
  } catch (e) {
    console.error("Graph Error:", e);
    return null;
  }
};
