export const shortenAddress = (address) => `${address.slice(0, 6)}...${address.slice(
  address.length - 4,
  address.length,
)}`;
