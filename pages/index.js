import { useState, useEffect, useRef, useContext } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Banner, CreatorCard, Loader, NFTCard, SearchBar } from '../components';
import { getCreators } from '../utils/getTopCreators';

import { NFTContext } from '../context/NFTContext';
import images from '../assets';
import { shortenAddress } from '../utils/shortenAddress';

const Home = () => {
  const { fetchNFTs } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [activeSelect, setActiveSelect] = useState('Recently Added');
  const parentRef = useRef();

  const scrollRef = useRef();
  const { theme } = useTheme();

  useEffect(() => {
    fetchNFTs().then((data) => {
      setNfts(data.reverse());
      setNftsCopy(data);
      setIsLoading(false);
    });
  }, []);
  useEffect(() => {
    const sortedNfts = [...nfts];

    switch (activeSelect) {
      case 'Price (low to high)':
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        break;
      case 'Price (high to low)':
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;
      case 'Recently added':
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      default:
        setNfts(nfts);
        break;
    }
  }, [activeSelect]);
  const onHandleSearch = (value) => {
    const filteredNfts = nfts.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()));

    if (filteredNfts.length === 0) {
      setNfts(nftsCopy);
    } else {
      setNfts(filteredNfts);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };
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

  const topCreators = getCreators(nfts);

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner
          name={(
            <>
              Discover, collect, and sell <br />extraordinary NFTs
            </>
          )}
          childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left"
          parentStyle="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
        />
        {!isLoading && !nfts.length ? (
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
            That&apos;s weird... No NFTs for sale!
          </h1>
        ) : isLoading ? (
          <Loader />
        ) : (
          <>
            <div>
              <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
                Best Creators
              </h1>
            </div>
            <div
              className="relative flex-1 max-w-full flex mt-3"
              ref={parentRef}
            >
              <div
                className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none"
                ref={scrollRef}
              >
                {topCreators.map((creator, i) => (
                  <CreatorCard
                    key={creator?.seller}
                    rank={i + 1}
                    creatorImage={images[`creator${i + 1}`]}
                    creatorName={shortenAddress(creator?.seller)}
                    creatorEths={creator?.sumall}
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
                <h1 className="flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">
                  Hot Bids
                </h1>

                <div className="flex-2 sm:w-full flex flex-row sm:flex-col">
                  <SearchBar
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    handleSearch={onHandleSearch}
                    clearSearch={onClearSearch}
                  />
                </div>
              </div>
              <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
                {nfts.map((nft) => (
                  <NFTCard key={nft.tokenId} nft={nft} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
