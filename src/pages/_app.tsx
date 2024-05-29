import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import { DefaultSeo } from "next-seo";
import "react-toastify/dist/ReactToastify.css";
import localFont from "next/font/local";
import { ToastContainer } from "react-toastify";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import { Indie_Flower } from "next/font/google";
import { UserProvider } from '@auth0/nextjs-auth0/client';

const indie = Indie_Flower({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-indie",
});

const MonoSans = localFont({
  src: "../../public/font/MonoSans/Mona-Sans-Regular.woff2",
});
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <DefaultSeo
        title="Lucy: Coding Education for Ethiopian Diaspora | After-School Programs."
        description="Lucy Coding is a robust online coding platform that offers a wide range of coding courses and tutorials for Kids between the age of 8-18."
        openGraph={{
          type: "website",
          url: "https://www.lucycoding.com/",
          locale: "en_IE",
          siteName: "LucyCoding",
          images: [
            {
              url: "https://lucycoding.com/faviconLogo1.png",
              width: 325,
              height: 512,
            },
          ],
        }}
      />
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=G-18J5SV2HN6`}
      />
      <Script strategy="lazyOnload">
        {`  
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
    
       gtag('config', 'G-18J5SV2HN6');
       `}
      </Script>
      <main className={`${indie.variable} ${MonoSans.className}`}>
        <NavBar setActive={() => {}} />
        <Banner />
        <ToastContainer />

        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </main>
    </>
  );
}
