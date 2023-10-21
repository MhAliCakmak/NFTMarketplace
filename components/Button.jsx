import React from 'react';

const Button = ({ btnName, classStyles, handleClick }) => (
  <button onClick={handleClick} type="button" className={`nft-gradient text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-poppins font-semibold text-white ${classStyles}`}>

    {btnName}
  </button>
);

export default Button;
