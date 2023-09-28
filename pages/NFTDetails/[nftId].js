import MarketplaceJSON from "../artifacts/contracts/KittyCore.sol/KittyCore.json";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetIpfsUrlFromPinata } from "../../components/utils/pinata";
import { Cat } from "../../components/Cattributes/Cat";
import { contractAddress } from "../../components/utils/constants";
import { ethers } from "ethers";

export default function NFTPage(props) {

    const router = useRouter();
    const tokenId = router.query.nftId;

    const [data, updateData] = useState({});
    const [message, updateMessage] = useState("");
    const [currAddress, updateCurrAddress] = useState("0x");
    const [isLoading, setIsLoading] = useState(false);

    function getPriceInETher(wei) {
        const price = (parseInt(wei) / Math.pow(10, 18)).toString()
        return price
    }
    async function getNFTData() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(contractAddress, MarketplaceJSON.abi, signer)
        // //create an NFT Token
        var tokenURI = await contract.tokenURI(parseInt(tokenId));
        const listedToken = await contract.getListedTokenForId(tokenId);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;
        const date = new Date(meta.birthTime);
        const formattedDate = date.toLocaleDateString();
        let item = {
            price: listedToken.price.toString(),
            tokenId: tokenId.toString(),
            seller: listedToken.seller.toString(),
            owner: listedToken.owner,
            name: meta.name,
            generation: meta.generation,
            birth: formattedDate,
            dna: meta.dna.toString(),
        }
        updateData(item);
        updateCurrAddress(addr);
    }

    async function buyNFT(tokenId) {
        setIsLoading(true)
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            //Pull the deployed contract instance
            let contract = new ethers.Contract(contractAddress, MarketplaceJSON.abi, signer);
            const _price = getPriceInETher(data.price)
            const salePrice = ethers.utils.parseUnits(_price, 'ether')
            updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
            //run the executeSale function
            let transaction = await contract.executeSale(tokenId, { value: salePrice });
            await transaction.wait();
            await getNFTData();
            setIsLoading(false)
            alert('You successfully bought the NFT!');
            updateMessage("");
        }
        catch (e) {
            setIsLoading(false)
            alert("Something went wrong, please try again later")
        }
    }
    useEffect(() => {
        if (tokenId) {
            getNFTData()
        }
    }, [tokenId]);

    return (
        <div>
            {data.name ? <div className="flex ml-20 mt-20">
                <Cat dna={data.dna} />
                <div className="text-xl ml-20 space-y-8 text-black shadow-2xl rounded-lg border-2 p-5">
                    <div>
                        Name: {data.name ?? ""}
                    </div>
                    <div>
                        Price: <span className="">{getPriceInETher(data.price) + " ETH"}</span>
                    </div>
                    <div>
                        Birth Date: {data.birth ?? ""}
                    </div>
                    <div>
                        DNA: {data.dna ?? ""}
                    </div>
                    <div>
                        Generation: {data.generation ?? ""}
                    </div>
                    <div>
                        Owner: <span className="text-sm">{data.seller}</span>
                    </div>
                    <div>
                        {currAddress != data.owner && currAddress != data.seller ?
                            isLoading ?
                                <div className="flex flex-1 justify-end items-center">
                                    <div div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">loading...</div>
                                </div> :
                                <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => buyNFT(tokenId)}>Buy this NFT</button>
                            : <div className="text-emerald-700">You are the owner of this NFT</div>
                        }

                        <div className="text-green text-center mt-3">{message}</div>
                    </div>
                </div>
            </div> : null}

        </div>
    )
}