import React, { useEffect, useState } from 'react'
import { pinJSONToIPFS } from "../components/utils/pinata.js";

import { Colors } from '../components/Cattributes/Colors';
import { Attributes } from '../components/Cattributes/Attributes';
import { ethers } from "ethers";
import { Cat } from '../components/Cattributes/Cat';
import Marketplace from "./artifacts/contracts/KittyCore.sol/KittyCore.json"
import NumericInput from 'react-numeric-input';
import { contractAddress } from '../components/utils/constants.js';


export default function kfactory() {
    const randomDNA = {
        headBodyColor: Math.floor(Math.random() * 99),
        bodyColor: Math.floor(Math.random() * 99),
        eyesColor: Math.floor(Math.random() * 99),
        earsPawColor: Math.floor(Math.random() * 99),
        eyeShape: Math.floor(Math.random() * 8) + 1,
        decorationPattern: Math.floor(Math.random() * 8) + 1,
        middleColor: Math.floor(Math.random() * 99),
        sidesColor: Math.floor(Math.random() * 99),
        animation: Math.floor(Math.random() * 6) + 1
    }
    const defaultDNA = {
        headBodyColor: 10,
        bodyColor: 13,
        eyesColor: 96,
        earsPawColor: 10,
        eyeShape: 1,
        decorationPattern: 1,
        middleColor: 13,
        sidesColor: 13,
        animation: 1,
        generation: 10
    };
    const [tab, setTab] = useState(0)
    const [jsonObject, setJsonObject] = useState(defaultDNA);
    const [price, setPrice] = useState();
    const [name, setName] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [generationLimit, setGenerationLimit] = useState();

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

    function getDna() {
        var dna = ''
        dna += (jsonObject.headBodyColor / 10) < 1 ? ("0" + jsonObject.headBodyColor.toString()) : jsonObject.headBodyColor.toString()
        dna += (jsonObject.bodyColor / 10) < 1 ? ("0" + jsonObject.bodyColor.toString()) : jsonObject.bodyColor.toString()
        dna += (jsonObject.eyesColor / 10) < 1 ? ("0" + jsonObject.eyesColor.toString()) : jsonObject.eyesColor.toString()
        dna += (jsonObject.earsPawColor / 10) < 1 ? ("0" + jsonObject.earsPawColor.toString()) : jsonObject.earsPawColor.toString()
        dna += jsonObject.eyeShape.toString()
        dna += jsonObject.decorationPattern.toString()
        dna += (jsonObject.middleColor / 10) < 1 ? ("0" + jsonObject.middleColor.toString()) : jsonObject.middleColor.toString()
        dna += (jsonObject.sidesColor / 10) < 1 ? ("0" + jsonObject.sidesColor.toString()) : jsonObject.sidesColor.toString()
        dna += jsonObject.animation.toString()
        return dna
    }

    const mintNFT = async (event) => {
        event.preventDefault()
        event.preventDefault();

        if (!price) {
            setError('Price is required');
            return;
        }

        if (!name) {
            setError('Name is required');
            return;
        }

        setError('');
        setIsLoading(true)
        const dna = getDna()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let contract = new ethers.Contract(contractAddress, Marketplace.abi, signer)
        let listingPrice = await contract.getListPrice()
        listingPrice = parseInt(listingPrice.toString()) / Math.pow(10, 18)
        const listPrice = ethers.utils.parseUnits((listingPrice / jsonObject.generation).toFixed(6), 'ether')
            //make metadata
        const metadata = new Object();
        metadata.dna = parseInt(dna);
        metadata.name = name;
        metadata.birthTime = Date.now();
        metadata.mumId = 0;
        metadata.dadId = 0;
        metadata.generation = jsonObject.generation;

        const pinataResponse = await pinJSONToIPFS(metadata);
        if (!pinataResponse.success) {
            return {
                success: false,
                status: "😢 Something went wrong while uploading your tokenURI.",
            };
        }
        const tokenURI = pinataResponse.pinataUrl;
        const txPrice = ethers.utils.parseUnits(price.toString(), 'ether')
        try {
            let transaction = await contract.createToken(tokenURI, txPrice, jsonObject.generation, { value: listPrice.toString() })
            await transaction.wait()
            setIsLoading(false)
            alert("Kitten created successfully!")
            return {
                success: true,
                status:
                    "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
                    transaction.hash,
            };
        } catch (error) {
            console.error(error)
            setIsLoading(false)
            alert("Something went wrong, Please try again later")
            return {
                success: false,
                status: "😥 Something went wrong: " + error.message,
            };
        }
    };


    const updateField = (fieldName, newValue) => {
        setJsonObject(prevObject => ({
            ...prevObject,
            [fieldName]: newValue
        }));
    };
    const getDefault = () => {
        setJsonObject(defaultDNA);
    };
    const getRandom = () => {
        setJsonObject(randomDNA);
        updateField("generation", generationLimit)
    };

    useEffect(() => {
        async function getLimit() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(contractAddress, Marketplace.abi, signer)
            const limit = await contract.getGenerationLimit()
            setGenerationLimit(limit)
        }
        getLimit()
    }, []);
    return (
        <>
            <div className="animation-wrapper">
                <div className="particle particle-1"></div>
            </div>
            <div className="cursor"></div>
            <div className="shadow-cursor"></div>
            <div className="flex flex-col p-5">
                <div align="center">
                    <h1 className="c-white">Kitties-Factory</h1>
                    <p className="c-white">Create your custom Kitty</p>
                </div>
                <div className="flex flex-wrap">
                    <div className="relative flex flex-col bg-emerald-100 p-12 rounded-lg">
                        <Cat data={jsonObject} />
                        <div className='absolute bottom-0'>
                            <p className='font-serif text-lg font-bold'>
                                DNA:
                                {/* <!-- Colors --> */}
                                <span id="dnabody"> {jsonObject.headBodyColor}</span>
                                <span id="dnamouth"> {jsonObject.bodyColor}</span>
                                <span id="dnaeyes"> {jsonObject.eyesColor}</span>
                                <span id="dnaears"> {jsonObject.earsPawColor}</span>
                                {/* <!-- Cattributes --> */}
                                <span id="dnashape"> {jsonObject.eyeShape}</span>
                                <span id="dnadecoration"> {jsonObject.decorationPattern}</span>
                                <span id="dnadecorationMid"> {jsonObject.middleColor}</span>
                                <span id="dnadecorationSides"> {jsonObject.sidesColor}</span>
                                <span id="dnadanimation"> {jsonObject.animation}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col cattributes">
                        <div className="btn-group mb-3">
                            <button className="btn btn-primary  tsp-1 m-1 light-b-shadow" onClick={() => setTab(0)}><b>Colors</b></button>
                            <button className="btn btn-primary  ml-2 tsp-1 m-1 light-b-shadow" onClick={() => setTab(1)} ><b>Cattributes</b></button>
                        </div>

                        {tab == 0 ? <Colors data={jsonObject} updateField={updateField} /> :
                            <Attributes data={jsonObject} updateField={updateField} />}
                    </div>

                </div>
                {/* <br> */}
                <div className='flex flex-wrap my-8'>
                    <div className='pr-4'>
                        <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input type="text" id="small-input" placeholder='Enter your kitty name' onChange={handleNameChange} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className=''>
                        <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price in ETH</label>
                        <NumericInput id="small-input" placeholder='min ETH is 0.01' step={0.00001} precision={5} min={0.00001} max={1000} onChange={handlePriceChange} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className=' pl-4'>
                        <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Generation</label>
                        {generationLimit ? <NumericInput id="small-input" placeholder='List price = 1/level' step={1} min={1} value={jsonObject.generation} max={generationLimit} onChange={(event) => updateField("generation", parseInt(event))} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" /> : null}
                    </div>
                </div>
                <div className='flex flex-wrap'>
                    <div className="flex flex-wrap">
                        <button className="btn btn-primary  tsp-1 m-1 light-b-shadow" onClick={getRandom}><b>Get random kitty</b></button>
                        <button className="btn btn-primary  ml-2 tsp-1 m-1 light-b-shadow" onClick={getDefault}><b>Default kitty</b></button>
                    </div>
                    {
                        isLoading ?
                            <div className="flex flex-1 justify-end items-center">
                                <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">loading...</div>
                            </div> :
                            <div className="flex flex-1 justify-start items-center sm:justify-end">
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                <button className="btn btn-success mr-5  tsp-1 m-1 light-b-shadow" onClick={mintNFT}><b>Create Kitty</b></button>
                            </div>
                    }

                    <div id="message" align="center"></div>

                </div>
            </div>
        </>
    );
}
