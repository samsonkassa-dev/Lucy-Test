import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>

        <meta
          name="description"
          content="Lucy Coding is a robust online coding platform that offers a wide range of coding courses and tutorials for Kids between the age of 8-18."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="shortcut icon" href="/faviconLogo1.png" />
        {/* <link
          rel="preload"
          href="../../public/font/MonoSans/Mona-Sans.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        ></link> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
