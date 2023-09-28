import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import Marketplace from "../pages/artifacts/contracts/KittyCore.sol/KittyCore.json"
import axios from "axios"
import { ethers } from "ethers";
import { GetIpfsUrlFromPinata } from "../components/utils/pinata";
import NFTCard from "../components/NFTTile";
import { contractAddress } from "../components/utils/constants";

export default function mykitties() {
  const [nfts, setNfts] = useState([]);
  const [fetchMethod, setFetchMethod] = useState("wallet");
  const [dataFetched, updateFetched] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const { address, isConnected } = useAccount();
  const router = useRouter()
  const fetchNFTs = async (pagekey) => {
    setIsloading(true)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(contractAddress, Marketplace.abi, signer)
      const Nfts = await contract.getMyNFTs()
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
      console.error(e);
      alert("Something went wrong, please try again later")
    }

    setIsloading(false);
  };

  useEffect(() => {
    fetchNFTs();
  }, [fetchMethod]);
  return (
    <div>
      <div className="header text-center py-5">
        <div className="container">
          <h2 className="menu-title">My Kitties</h2>
        </div>
      </div>
      {nfts.length > 0 ? <div className="container p-3">
        <button type="button" className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={() => {
          if (nfts.length > 1) {
            const nftsEncoded = encodeURIComponent(JSON.stringify(nfts))
            router.push(`/breed?encodedArray=${nftsEncoded}`);
          } else {
            alert("You must have more than one Kitty to breed")
          }
        }}>Breed</button>
        <div className="nft-grid">
          {nfts.map((nftData, index) => (
            <NFTCard key={index} nftData={nftData} />
          ))}
        </div>
      </div> :
        <div className="text-center">
          <p className="text-lg mb-2">Oops, your NFT cat collection is still purr-fectly empty!</p>
          <p className="text-gray-500">Time to add some digital furballs to your virtual kingdom.</p>
        </div>
      }

    </div>
  );
}
