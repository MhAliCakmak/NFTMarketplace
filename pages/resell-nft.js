import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import { NFTContext } from '../context/NFTContext';
import { Button, Input, Loader } from '../components';

const ResellNFT = () => {
  const { createSale, isLoadingNFT } = useContext(NFTContext);
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const router = useRouter();
  const { tokenId, tokenURI, img } = router.query;

  const fetchNFT = async () => {
    setImage(img);
    console.log(image);
  };

  useEffect(() => {
    fetchNFT();
  }, [tokenId]);

  const resell = async () => {
    await createSale(tokenURI, price, true, tokenId);
    router.push('/');
  };

  if (isLoadingNFT) {
    return (
      <div className="flexCenter" style={{ height: '51vh' }}>
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl">Resell NFT</h1>

        <Input
          inputType="number"
          title="Price"
          placeholder="Asset Price"
          handleClick={(e) => setPrice(e.target.value)}
        />

        {image && <img className="rounded mt-4" width="350" src={image} />}

        <div className="mt-7 w-full flex justify-end">
          <Button
            btnName="List NFT"
            btnType="primary"
            classStyles="rounded-xl"
            handleClick={resell}
          />
        </div>
      </div>
    </div>
  );
};

export default ResellNFT;
