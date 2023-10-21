import React, { useContext } from 'react';
import { NFTContext } from '../context/NFTContext';

const Input = ({ inputType, title, placeholder, handleClick }) => {
  const { nftCurrency } = useContext(NFTContext);
  return (
    <div className="mt-10 w-full">
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
        {title}
      </p>
      {
        inputType === 'number' ? (
          <div className="dark:bg-nft-black-1 bg-white flex-row flexBetween border rounded-lg dark:border-nft-black-1 border-nft-gray-2 w-full outline-none font-poppins dark:text-white text-nft-gray-2 nft-base mt-4 px-4 py-3 ">
            <input className="flex w-full dark:bg-nft-black-1 bg-white outline-none" type="number" placeholder={placeholder} onChange={handleClick} />
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">{nftCurrency}</p>
          </div>
        ) : inputType === 'textarea' ? (
          <textarea rows={10} className="dark:bg-nft-black-1 bg-white border rounded-lg dark:border-nft-black-1 border-nft-gray-2 w-full outline-none font-poppins dark:text-white text-nft-gray-2 nft-base mt-4 px-4 py-3 " placeholder={placeholder} onChange={handleClick} />
        )
          : <input type="text" className="dark:bg-nft-black-1 bg-white border rounded-lg dark:border-nft-black-1 border-nft-gray-2 w-full outline-none font-poppins dark:text-white text-nft-gray-2 nft-base mt-4 px-4 py-3 " placeholder={placeholder} onChange={handleClick} />

    }
    </div>
  );
};

export default Input;
