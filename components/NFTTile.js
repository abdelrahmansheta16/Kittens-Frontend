import Link from "next/link";
import { Cat } from "./Cattributes/Cat";

const NFTCard = ({ nftData }) => {
    const { tokenId, dna, price, name, seller } = nftData;
    return (
        <Link className="no-underline text-black" href="/NFTDetails/[nftId]" as={`/NFTDetails/${tokenId}`}>
            <div className="nft-card">
                <Cat dna={dna.toString()} />
                <div className="nft-details">
                    <p className="text-base">Price: <span className="text-lg text-black font-bold">{price}</span> ETH</p>
                    <p className="text-base">Name: <span className="text-lg text-black font-bold">{name}</span></p>
                </div>
            </div>
        </Link>
    );
};

export default NFTCard;
