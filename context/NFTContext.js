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
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const nftCurrency = 'tBNB';

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      return;
    }
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x61',
              chainName: 'BSC Testnet',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18,
              },
              rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
              blockExplorerUrls: ['https://testnet.bscscan.com/'],
            },
          ],
        });
      }
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];

      setCurrentAccount(account);
    }
  };
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [currentAccount]);

  const connectWallet = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      return;
    }
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x61' }],
    });
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    setCurrentAccount(accounts[0]);
    window.location.reload();
  };

  const uploadToIPFS = async (imageUrl, imgType, imgName, description) => {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      const data = Buffer.from(response.data);
      // delete space for imgname
      const { ipnft } = await nftStorage.store({
        name: imgName,
        description,
        image: new File([data], 'image', { type: imgType }),
      });

      const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`;

      return url;
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };
  const createSale = async (url, formInputPrice, isReselling, id) => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(MarketAddress, MarketAbi, signer);
      const price = ethers.utils.parseUnits(formInputPrice, 'ether');
      const listingPrice = await contract.getListingPrice();
      const transaction = !isReselling
        ? await contract.createToken(url, price, {
          value: listingPrice.toString(),
        })
        : await contract.resellToken(id, price, {
          value: listingPrice.toString(),
        });
      setIsLoadingNFT(true);
      await transaction.wait();
      router.push('/');
    } catch (error) {
      alert(error);
    }
  };

  const createNFT = async (imageUrl, imgType, formInput) => {
    try {
      const { name, description, price } = formInput;
      if (!name || !description || !price) {
        alert('Please fill all the fields');
        return;
      }
      const fileUrl = uploadToIPFS(imageUrl, imgType, name, description);
      fileUrl.then((url) => {
        createSale(url, price);
      });
    } catch (error) {
      alert(error);
    }
  };

  const ipfsToHttps = (ipfsURL, image) => {
    const urlParts = ipfsURL.split('/');
    if (image) {
      const cid = urlParts[2];
      const httpsURL = `https://${cid}.ipfs.dweb.link/image`;
      return httpsURL;
    }
    const cid = urlParts[4];
    const httpsURL = `https://${cid}.ipfs.dweb.link/metadata.json`;
    return httpsURL;
  };
  const fetchNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://data-seed-prebsc-1-s1.binance.org:8545/',
    );
    const tokenContract = new ethers.Contract(
      MarketAddress,
      MarketAbi,
      provider,
    );
    const data = await tokenContract.fetchMarketItems();
    const allItems = [];
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const httpsUri = ipfsToHttps(tokenUri);
        const meta = await axios.get(httpsUri);

        const price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        const item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: ipfsToHttps(meta.data.image, true),
          name: meta.data.name,
          description: meta.data.description,
        };

        allItems.push(item);
      }),
    );
    return allItems;
  };

  const fetchMyNFTsOrCreatedNFTs = async (type) => {
    try {
      setIsLoadingNFT(false);
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(MarketAddress, MarketAbi, signer);

      const data = type === 'fetchItemsListed'
        ? await contract.fetchItemsListed()
        : await contract.fetchMyNFTs();
      const allItems = [];
      const items = await Promise.all(
        data.map(async (i) => {
          const tokenUri = await contract.tokenURI(i.tokenId);
          const httpsUri = ipfsToHttps(tokenUri);
          const meta = await axios.get(httpsUri);

          const price = ethers.utils.formatUnits(i.price.toString(), 'ether');
          const item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: ipfsToHttps(meta.data.image, true),
            name: meta.data.name,
            description: meta.data.description,
            tokenURI: tokenUri,
          };

          allItems.push(item);
        }),
      );
      return allItems;
    } catch (error) {
      alert(error);
    }
  };

  const buyNFT = async (nft) => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(MarketAddress, MarketAbi, signer);
      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });
      setIsLoadingNFT(true);
      await transaction.wait();
      setIsLoadingNFT(false);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <NFTContext.Provider
      value={{
        nftCurrency,
        connectWallet,
        currentAccount,
        createNFT,
        createSale,
        fetchNFTs,
        fetchMyNFTsOrCreatedNFTs,
        buyNFT,
        isLoadingNFT,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};
