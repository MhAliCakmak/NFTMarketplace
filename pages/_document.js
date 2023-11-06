import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>NFT Marketplace | Buy and Sell Non-Fungible Tokens</title>
        <meta
          name="description"
          content="NFT Marketplace to buy and sell Non-Fungible Tokens"
        />
        <meta
          property="og:title"
          content="NFT Marketplace | Buy and Sell Non-Fungible Tokens"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
