import { ethers } from "ethers";
import Marketplace from "../artifacts/contracts/KittyCore.sol/KittyCore.json"


export default async function handler(req, res) {
  const { address, provider } = JSON.parse(req.body);
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  try {
    const signer = provider.getSigner();
    let contract = new ethers.Contract(address, Marketplace.abi, signer)
    const nfts = await contract.getAllNFTs()
    const formattedNfts = nfts.nfts.map((nft) => {
      const { contract, title, tokenType, tokenId, description, media } = nft;

      return {
        contract: contract.address,
        symbol: contract.symbol,
        media: media[0]?.gateway
          ? media[0]?.gateway
          : "https://via.placeholder.com/500",
        collectionName: contract.openSea?.collectionName,
        verified: contract.openSea?.safelistRequestStatus,
        tokenType,
        tokenId,
        title,
        description,
        format: media[0]?.format ? media[0]?.format : "png",
      };
    });


    const filteredNfts = formattedNfts.filter(
      (nft) => nft.title.length && nft.description.length && nft.media
    );

    res.status(200).json({
      nfts: filteredNfts.length ? filteredNfts : null,
      pageKey: nfts.pageKey,
    });
    // the rest of your code
  } catch (e) {
    alert("Something went wrong, please try again later")
    console.warn(e);
    res.status(500).send({
      message: "something went wrong, check the log in your terminal",
    });
  }
}
