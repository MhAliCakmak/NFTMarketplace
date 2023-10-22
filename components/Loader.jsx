import React from 'react';
import Image from 'next/image';

import images from '../assets';

const Loader = () => (
  <div className="flexCenter w-full my-4">
    <Image src={images.loader} alt="loader" width={100} height={100} />
  </div>
);

export default Loader;
