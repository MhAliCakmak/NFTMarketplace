import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Banner, CreatorCard, NFTCard } from '../components';

import images from '../assets';
import { makeId } from '../utils/makeId';

const Home = () => {
  const [hideButton, setHideButton] = useState(false);
  const parentRef = useRef();
  const [ids, setIds] = useState([]);
  const scrollRef = useRef();
  const { theme } = useTheme();
  const createId = () => {
    const id = [];
    for (let i = 0; i < 16; i++) {
      id.push(`0x${makeId(3)}...${makeId(4)}`);
    }
    setIds(id);
  };
  useEffect(() => {
    createId();
  }, []);
  const handleScroll = (direction) => {
    const scroll = scrollRef.current;
    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;
    if (direction === 'right') {
      scroll.scrollLeft += scrollAmount;
    } else {
      scroll.scrollLeft -= scrollAmount;
    }
  };

  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;

    if (current?.scrollWidth >= parent?.offsetWidth) {
      setHideButton(false);
    } else {
      setHideButton(true);
    }
  };

  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);
    return () => {
      window.removeEventListener('resize', isScrollable);
    };
  });

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner
          name="Discover, collect, and sell extraordinary NFTs"
          childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left"
          parentStyle="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
        />
        <div>
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
            Best Creators
          </h1>
        </div>
        <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
          <div
            className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none"
            ref={scrollRef}
          >
            {[6, 7, 8, 9, 10].map((i) => (
              <CreatorCard
                key={`creator-${i}`}
                rank={i}
                creatorImage={images[`creator${i}`]}
                creatorName={
                  ids[i]
                }
                creatorEths={10 - i * 0.534}
              />
            ))}
            {!hideButton && (
              <>
                <div
                  onClick={() => handleScroll('left')}
                  className="absolute w-8 h-8 minlg:h-12 minlg:w-12 top-45 cursor-pointer left-0"
                >
                  <Image
                    src={images.left}
                    fill
                    style={{
                      objectFit: 'contain',
                    }}
                    alt="left_arrow"
                    className={theme === 'light' ? 'filter invert' : ''}
                  />
                </div>
                <div
                  onClick={() => handleScroll('right')}
                  className="absolute w-8 h-8 minlg:h-12 minlg:w-12 top-45 cursor-pointer right-0"
                >
                  <Image
                    src={images.right}
                    fill
                    style={{
                      objectFit: 'contain',
                    }}
                    alt="right_arrow"
                    className={theme === 'light' ? 'filter invert' : ''}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-10">
          <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
            <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold  sm:mb-4 flex-1 ">
              Hot Bids
            </h1>
            <div>
              SearchBar
            </div>
          </div>
          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (

              <NFTCard
                key={`nft-${i}`}
                nft={{
                  i,
                  name: `Nifty NFT ${i}`,
                  price: (10 - i * 0.5).toFixed(2),
                  seller: `${ids[i]}`,
                  owner: `${ids[i + 2]}`,
                  description: 'Cool NFT on Sale',
                }}
              />
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
