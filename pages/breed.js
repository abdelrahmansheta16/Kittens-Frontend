import { Button, Modal } from 'flowbite-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Cat } from '../components/Cattributes/Cat';
import Marketplace from "./artifacts/contracts/KittyCore.sol/KittyCore.json";
import axios from "axios";
import { contractAddress } from '../components/utils/constants.js';
import { ethers } from 'ethers';
import { GetIpfsUrlFromPinata, pinJSONToIPFS } from '../components/utils/pinata';
import NumericInput from 'react-numeric-input';

const App = () => {
    const [dameCat, setDameCat] = useState();
    const [sireCat, setSireCat] = useState();
    const [openModal, setOpenModal] = useState();
    const [openModal2, setOpenModal2] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [breedingDisabled, setBreedingDisabled] = useState(true);
    const router = useRouter();
    const { encodedArray } = router.query;
    const nfts = encodedArray ? JSON.parse(decodeURIComponent(encodedArray)) : [];
    const [price, setPrice] = useState();
    const [name, setName] = useState();

    const handleNameChange = (event) => {
        const newValue = event.target.value;
        // Check if the input is a valid number and within the specified range
        setName(newValue);
    };

    const handlePriceChange = (event) => {
        const newValue = event;

        // Check if the input is a valid number and within the specified range
        if (!isNaN(newValue) && newValue >= 0.00001 && newValue <= 1000) {
            setPrice(newValue);
        }
    };
    const handleBreedClick = async () => {
        setIsLoading(true)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let contract = new ethers.Contract(contractAddress, Marketplace.abi, signer)
        var dadTokenURI = await contract.tokenURI(dameCat.tokenId);
        dadTokenURI = GetIpfsUrlFromPinata(dadTokenURI);
        let dadMeta = await axios.get(dadTokenURI);
        dadMeta = dadMeta.data;
        var momTokenURI = await contract.tokenURI(sireCat.tokenId);
        momTokenURI = GetIpfsUrlFromPinata(momTokenURI);
        let momMeta = await axios.get(momTokenURI);
        momMeta = momMeta.data;
        const newKitten = await contract.Breeding(dameCat.tokenId, sireCat.tokenId, dadMeta.dna, momMeta.dna, dadMeta.generation, momMeta.generation)
        let listingPrice = await contract.getListPrice()
        listingPrice = parseInt(listingPrice.toString()) / Math.pow(10, 18)
        const listPrice = ethers.utils.parseUnits((listingPrice / parseInt(newKitten.generation.toString())).toFixed(6), 'ether')
            //make metadata
        const metadata = new Object();
        metadata.dna = parseInt(newKitten.genes.toString());
        metadata.name = name;
        metadata.birthTime = newKitten.birthTime.toString();
        metadata.mumId = newKitten.mumId.toString();
        metadata.dadId = newKitten.dadId.toString();
        metadata.generation = newKitten.generation.toString();

        const pinataResponse = await pinJSONToIPFS(metadata);
        if (!pinataResponse.success) {
            setIsLoading(false)
            alert("Something went wrong, please try again later")
            return {
                success: false,
                status: "😢 Something went wrong while uploading your tokenURI.",
            };
        }
        const tokenURI = pinataResponse.pinataUrl;
        const txPrice = ethers.utils.parseUnits(price.toString(), 'ether')
        try {
            let transaction = await contract.createToken(tokenURI, txPrice, parseInt(newKitten.generation.toString()), { value: listPrice.toString() })
            await transaction.wait()
            setIsLoading(false)
            alert("Kitten created successfully!")
            return {
                success: true,
                status:
                    "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
                    txHash,
            };
        } catch (error) {
            setIsLoading(false)
            alert("Something went wrong, please try again later")
            return {
                success: false,
                status: "😥 Something went wrong: " + error.message,
            };
        }

    };

    // const handleCatSelection = (catId, role) => {
    //     if (role === 'Dame') {
    //         setDameCatId(catId);
    //     } else if (role === 'Sire') {
    //         setSireCatId(catId);
    //     }
    //     setBreedingDisabled(false);
    // };

    return (
        <div className="container mx-auto py-10">
            <h2 className="text-2xl font-semibold mb-5">Cats breeding</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <p className="font-semibold">Dame</p>
                    <p className="text-gray-500">This kitty will be preggers</p>
                    {dameCat ? <div className='-z-30 p-10'>
                        <Cat dna={dameCat.dna.toString()} />
                    </div> : null}
                    <button type="button" className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={() => setOpenModal("dismissible")}>Select a cat as Dame</button>
                    <Modal className='z-30' dismissible show={openModal === 'dismissible'} onClose={() => setOpenModal(undefined)}>
                        <Modal.Header>Choose a cat</Modal.Header>
                        <Modal.Body>
                            <div className="nft-grid">
                                {nfts.map((nftData, index) => (
                                    <div className='z-0 p-5'>
                                        <button onClick={() => {
                                            setDameCat(nftData)
                                            setOpenModal(undefined)
                                        }}>
                                            {sireCat ? sireCat.dna != nftData.dna ? <Cat key={index} dna={nftData.dna.toString()} /> : null : <Cat key={index} dna={nftData.dna.toString()} />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Modal.Body>
                    </Modal>

                    <div id="catDNADame"></div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <p className="font-semibold">Sire</p>
                    <p className="text-gray-500">This kitty will be the sire</p>
                    {sireCat ? <div className='-z-30 p-10'>
                        <Cat dna={sireCat.dna.toString()} />
                    </div> : null}
                    <button type="button" className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={() => setOpenModal2("dismissible")}>Select a cat as Sire</button>
                    <Modal className='z-30' dismissible show={openModal2 === 'dismissible'} onClose={() => setOpenModal2(undefined)}>
                        <Modal.Header>Choose a cat</Modal.Header>
                        <Modal.Body>
                            <div className="nft-grid">
                                {nfts.map((nftData, index) => (
                                    <div className='z-0 p-5'>
                                        <button onClick={() => {
                                            setSireCat(nftData)
                                            setOpenModal2(undefined)
                                        }}>
                                            {dameCat ? dameCat.dna != nftData.dna ? <Cat key={index} dna={nftData.dna.toString()} /> : null : <Cat key={index} dna={nftData.dna.toString()} />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Modal.Body>
                    </Modal>

                    <div id="catDNADame"></div>
                </div>
            </div>
            <div className='flex flex-row my-8'>
                <div className='basis-1/3 pr-4'>
                    <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                    <input type="text" id="small-input" placeholder='Enter your kitty name' onChange={handleNameChange} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div className='basis-1/3'>
                    <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price in ETH</label>
                    <NumericInput id="small-input" placeholder='min ETH is 0.01' step={0.00001} precision={5} min={0.00001} max={1000} onChange={handlePriceChange} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
            </div>
            {
                isLoading ?
                    <div className="flex flex-1 justify-end items-center">
                        <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">loading...</div>
                    </div> :
                    <div className='m-3'>
                        <button type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={handleBreedClick}>Ok, Give them some privacy</button>
                    </div>
            }

            <div id="message" className="text-center"></div>
        </div>
    );
};

export default App;
