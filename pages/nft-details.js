import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { NFTContext } from '../context/NFTContext';
import { Loader, NFTCard, Button, Modal } from '../components';

import images from '../assets';
import { shortenAddress } from '@/utils/shortenAddress';

const PaymentBodyCmp = ({ nft, nftCurrency }) => (
  <div className="flex flex-col">
    <div className="flexBetween">
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl ">
        item
      </p>
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl ">
        Subtotal
      </p>
    </div>
    <div className="flexBetweenStart my-5">
      <div className="flex-1 flexStartCenter">
        <div className="relative w-28 h-28">
          <img
            src={nft.image || images[`nft${nft.i}`]}
            className="object-cover"
          />
        </div>
        <div className="flexCenterStart flex-col ml-5">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">
            {shortenAddress(nft.seller)}
          </p>
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">
            {nft.name}
          </p>
        </div>
      </div>
      <div>
        <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl">
          {nft.price} <span className="font-semibold">{nftCurrency}</span>
        </p>
      </div>
    </div>
    <div className="flexBetween mt-10">
      <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl">
        Total
      </p>
      <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl">
        {nft.price} <span className="font-semibold">{nftCurrency}</span>
      </p>
    </div>
  </div>
);
const NFTDetails = () => {
  const { currentAccount, nftCurrency, buyNFT } = useContext(NFTContext);
  const [isLoading, setIsLoading] = useState(true);
  const [successModal, setSuccessModal] = useState(false);
  const [nft, setNft] = useState({
    image: '',
    tokenId: '',
    name: '',
    owner: '',
    price: '',
    seller: '',
    description: '',
    tokenURI: '',
  });
  const router = useRouter();
  const [paymentModal, setPaymentModal] = useState(false);
  useEffect(() => {
    if (!router.isReady) return;
    setNft(router.query);
    setIsLoading(false);
  }, [router.isReady]);

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }
  const checkout = async () => {
    await buyNFT(nft);
    setPaymentModal(false);
    setSuccessModal(true);
  };
  return (
    <div className="relative flex justify-center md:flex-col min-h-screen">
      <div className="relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:border-nft-black-1 border-nft-gray-1">
        <div className="relative w-557 minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300 h-547 ">
          <img
            src={nft.image || images[`nft${nft.i}`]}
            className=" rounded-xl shadow-lg object-cover"
          />
        </div>
      </div>

      <div className="flex-1 justify-start sm:px-4 p-12 sm:pb-4">
        <div className="flex flex-row sm:flex-col">
          <h2 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl">
            {nft.name}
          </h2>
        </div>

        <div className="mt-10">
          <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-normal">
            Creator
          </p>
          <div className="flex flex-row items-center mt-3">
            <div className="relative w-12 h-12 minlg:w-20 minlg:h-20 mr-2">
              <Image
                src={images.creator1}
                className="rounded-full object-cover"
              />
            </div>
            <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-lg font-semibold">
              {shortenAddress(nft.seller)}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col">
          <div className="w-full border-b dark:border-nft-black-1 border-nft-gray-1 flex flex-row">
            <p className="font-poppins dark:text-white text-nft-black-1 font-medium text-base mb-2">
              Details
            </p>
          </div>
          <div className="mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-base">
              {nft.description}
            </p>
          </div>
        </div>

        <div className="flex flex-row sm:flex-col mt-10 ">
          {currentAccount === nft.seller.toLowerCase() ? (
            <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-base border border-gray p-2">
              You cannot buy your own NFT
            </p>
          ) : currentAccount === nft.owner.toLowerCase() ? (
            <Button
              btnName="List on Marketplace"
              classStyles="mr-5 sm:mr-0 rounded-xl"
              handleClick={() => router.push(`/resell-nft?tokenId=${nft.tokenId}&tokenUri=${nft.tokenURI}&img=${nft.image}`)}
            />
          ) : (
            <Button
              btnName={`Buy for ${nft.price} ${nftCurrency}`}
              classStyles="mr-5 sm:mr-0 rounded-xl "
              handleClick={() => setPaymentModal(true)}
            />
          )}
        </div>
      </div>
      {paymentModal && (
        <Modal
          header="Check Out"
          body={<PaymentBodyCmp nft={nft} nftCurrency={nftCurrency} />}
          footer={(
            <div className="flex flex-row  sm:flex-col">
              <Button
                btnName="Checkout"
                classStyles="mr-5 sm:mb-5 sm:mr-0 rounded-xl"
                handleClick={checkout}
              />
              <Button
                btnName="Cancel"
                classStyles="mr-5 sm:mr-0 rounded-xl"
                handleClick={() => setPaymentModal(false)}
              />
            </div>
          )}
          handleClose={() => setPaymentModal(false)}
        />
      )}
      {successModal && (
        <Modal
          header="Payment Successful"
          body={(
            <div className="flexCenter flex-col text-center" onClick={() => setSuccessModal(false)}>
              <div className="relative w-52 h-52">
                <img src={nft.image || images[`nft${nft.i}`]} className="object-cover" />
              </div>
              <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal mt-10"> You successfully purchased <span className="font-semibold">{nft.name}</span> from <span className="font-semibold">{shortenAddress(nft.seller)}</span>.</p>
            </div>
          )}
          footer={(
            <div className="flexCenter flex-col">
              <Button
                btnName="Check it out"
                btnType="primary"
                classStyles="sm:mr-0 sm:mb-5 rounded-xl"
                handleClick={() => router.push('/my-nfts')}
              />
            </div>
          )}
          handleClose={() => setSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default NFTDetails;
