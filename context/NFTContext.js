import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import { NFTStorage, File } from 'nft.storage';
import { Buffer } from 'buffer';
import { useRouter } from 'next/router';
import { MarketAbi, MarketAddress } from './constants';

const nftStorage = new NFTStorage({
  token: process.env.NEXT_PUBLIC_NFT_STORAGE_API,
});
export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState('');
  const nftCurrency = 'BNB';

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert('Make sure you have metamask!');
      return;
    }
    console.log('We have the ethereum object', ethereum);

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert('Make sure you have metamask!');
      return;
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    setCurrentAccount(accounts[0]);
    window.location.reload();
  };

  const uploadToIPFS = async (imageUrl, imgType, imgName, description) => {
    try {
      console.log(imageUrl);
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      const data = Buffer.from(response.data);
      console.log(data, response);
      const { ipnft } = await nftStorage.store({
        name: imgName,
        description,
        image: new File([data], imgName, { type: imgType }),
      });
      console.log(ipnft);
      const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`;
      console.log(url);
      return url;
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };
  const createSale = async (url, formInputPrice) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(MarketAddress, MarketAbi, signer);
    const price = ethers.utils.parseUnits(formInputPrice, 'ether');
    const listingPrice = await contract.getListingPrice();
    const transaction = await contract.createToken(url, price, { value: listingPrice.toString() });
    await transaction.wait();
  };

  const createNFT = async (imageUrl, imgType, formInput) => {
    const { name, description, price } = formInput;
    if (!name || !description || !price) {
      alert('Please fill all the fields');
      return;
    }
    const fileUrl = uploadToIPFS(imageUrl, imgType, name, description);
    fileUrl.then((url) => {
      createSale(url, price);
      router.push('/');
    });
  };

  const fetcNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(MarketAddress, MarketAbi, provider);
    const data = await tokenContract.fetchMarketItems();
  };
  return (
    <NFTContext.Provider
      value={{ nftCurrency, connectWallet, currentAccount, createNFT }}
    >
      {children}
    </NFTContext.Provider>
  );
};
