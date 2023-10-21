import { useState, useMemo, useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Input, Button } from '../components';
import { NFTContext } from '../context/NFTContext';

import images from '../assets';

const CreateNFT = () => {
  const { theme } = useTheme();

  const [imageUrl, setImageUrl] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [image, setImage] = useState(null);
  const [imgName, setImgName] = useState('');
  const [formInput, setFormInput] = useState({
    price: '',
    name: '',
    description: '',
  });
  const { createNFT } = useContext(NFTContext);

  const onImageChange = (event) => {
    const { type, name } = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      const fileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
      if (fileTypes.includes(type)) {
        setImageUrl(URL.createObjectURL(event.target.files[0]));
        setImageType(event.target.files[0].type);
        setImage(event.target.files[0]);
        setImgName(name);
      } else {
        alert('Please select an image file (png , gif, jpeg or jpg)');
      }
    }
  };

  const fileStyle = useMemo(
    () => ' dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed',
  );
  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold  sm:mb-4 flex-1 ">
          Create new NFT
        </h1>
        <div className="mt-16">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Upload File
          </p>
          <div className="mt-4">
            <label className="cursor-pointer">
              <div className={fileStyle}>

                {image ? (
                  <aside>
                    <div>
                      <img src={imageUrl} alt="asset_file" />
                    </div>
                  </aside>
                ) : (
                  <div className="flexCenter flex-col text-center">

                    <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
                      JPG, PNG, GIF, SVG, WEBM Max 100mb.
                    </p>
                    <div className="my-12 w-full flex justify-center">
                      <Image
                        src={images.upload}
                        alt="upload"
                        width={100}
                        height={100}
                        style={{
                          objectFit: 'contain',
                        }}
                        className={theme === 'light' ? 'filter invert' : ''}
                      />
                    </div>
                    <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">
                      Drag and Drop File
                    </p>
                    <p className="font-poppins dark:text-white text-nft-black-1 mt-2 font-semibold text-sm">
                      or Browse media on your device
                    </p>

                  </div>
                )}
              </div>
              <input type="file" className="hidden" onChange={onImageChange} />
            </label>
          </div>
        </div>
        <div className="mt-16">
          <Input
            inputType="input"
            title="Name"
            placeholder="NFT Name"
            handleClick={(e) => setFormInput({ ...formInput, name: e.target.value })}
          />
          <Input
            inputType="textarea"
            title="Description"
            placeholder="NFT Description"
            handleClick={(e) => setFormInput({ ...formInput, description: e.target.value })}
          />
          <Input
            inputType="number"
            title="Price"
            placeholder="NFT PRice"
            handleClick={(e) => setFormInput({ ...formInput, price: e.target.value })}
          />
          <div className="mt-7 w-full flex justify-end">
            <Button
              btnName="Create NFT"
              classStyles="rounded-xl"
              handleClick={() => createNFT(imageUrl, imageType, formInput)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
