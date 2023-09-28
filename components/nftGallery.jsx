import { useEffect, useState } from "react";
import Web3 from 'web3';
import { useAccount } from "wagmi";
import Marketplace from "../pages/artifacts/contracts/KittyCore.sol/KittyCore.json"
import axios from "axios"
import { ethers } from "ethers";
import { GetIpfsUrlFromPinata } from "./utils/pinata";
import NFTCard from "./NFTTile";
import { contractAddress } from "./utils/constants";

export default function NFTGallery() {
  const [nfts, setNfts] = useState([]);
  const [fetchMethod, setFetchMethod] = useState("wallet");
  const [dataFetched, updateFetched] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const { address, isConnected } = useAccount();
  const [networkId,setNetworkId] = useState();
  const fetchNFTs = async (pagekey) => {
    setIsloading(true)
    try {
			const web3 = new Web3(window.ethereum)
			const networkId = await web3.eth.net.getId()
      setNetworkId(networkId) 
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(contractAddress, Marketplace.abi, signer)
      const Nfts = await contract.getAllNFTs()
      //Fetch all the details of every NFT from the contract and display
      const items = await Promise.all(Nfts.map(async i => {
        var tokenURI = await contract.tokenURI(i.tokenId);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          dna: meta.dna,
          name: meta.name,
        }
        return item;
      }))
      updateFetched(true)
      if (items?.length) {
        setNfts(items);
      }
    } catch (e) {
      setIsloading(false)
      console.error(e);
    }

    setIsloading(false);
  };

  useEffect(() => {
    fetchNFTs();
  }, [fetchMethod]);
  return (
    <div className="nft-grid">
      {address == undefined || networkId !== 11155111n?<div className="text-2xl font-semibold mb-5">Connect to Sepolia Test Network</div>:isLoading ?
        <div className="flex flex-1 justify-end items-center">
            <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">loading...</div>
        </div> : nfts.map((nftData, index) => (
        <NFTCard key={index} nftData={nftData} />
      ))}
    </div>
  );
}
