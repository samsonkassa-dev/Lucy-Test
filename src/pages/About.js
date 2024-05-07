import Head from "next/head";
import Image from "next/image";
import localeData from "../i18n/index.json";
import { useState, useEffect } from "react";
import {useRouter} from "next/router";
import Footer from "../components/Footer";
export default function About() {
  const [selectedLocale, setselectedLocale] = useState(localeData.labels[0]);
  const router = useRouter();


  useEffect(() => {
    setselectedLocale(
      localeData.labels.filter((l) => l.locale === router.locale)[0]
    );
  }, [router.locale]);

  return (
    <>
      <Head>
        <title>About Us - Lucy</title>
      </Head>

      <div className="pt-36 px-4 md:px-8 lg:px-36">
        <div class="w-full flex justify-center items-center">
          <div className="relative transform rotate-12 lg:h-8 lg:w-8 w-5 h-5 lg:-top-10 -top-5">
            <Image
              fill
              style={{ objectFit: "contain" }}
              alt=""
              src="/Vector (6).png"
            />
          </div>
          <h1 class="text-black font-indie font-bold text-4xl font-indie-flower">
            {selectedLocale.aboutPage.title} 
          </h1>
          <div className="relative lg:h-8 lg:w-8 w-5 h-5 md:-mt-10 -mt-12 lg:-bottom-10 -bottom-10 pb-10">
            <Image
              fill
              style={{ objectFit: "contain" }}
              alt=""
              src="/Vector (1).png"
            />
          </div>
        </div>
        <p class="text-center text-lg mt-8 font-mona-sans">
          {selectedLocale.aboutPage.desc} <span><a href="https://www.youtube.com/watch?v=jeRJwxRX3iQ" className="text-yellow font-semibold underline"> click here to see a message from our founder.</a></span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 ">
          <div className="col-span-1 grid grid-rows-2 gap-4 h-full">
            <div className="md:row-span-1 flex flex-col justify-center items-center md:items-start  text-center md:text-left">
              <h1 className="font-extrabold text-4xl font-indie text-black">
                {selectedLocale.aboutPage.contentSubtitleOne}
              </h1>
              <div className="relative flex  h-2 w-3/4 ">
                <div className="">
                  <Image
                    fill
                    style={{ objectFit: "fill" }}
                    alt=""
                    src="/Vector (2).png"
                  />
                </div>
              </div>

              <p className="mt-6">
               {selectedLocale.aboutPage.contentParagraphOne}
              </p>
            </div>

            <div className="md:row-span-1 flex flex-col justify-center items-center md:items-start  text-center md:text-left">
              <h1 className="font-extrabold text-4xl font-indie text-black">
                {selectedLocale.aboutPage.contentSubtitleTwo}
              </h1>
              <div className="relative flex h-2 md:w-1/3 w-1/2 ">
                <div className="">
                  <Image
                    fill
                    style={{ objectFit: "fill" }}
                    alt=""
                    src="/Vector (2).png"
                  />
                </div>
              </div>
              <p className="mt-6">
                {selectedLocale.aboutPage.contentParagraphTwo}
              </p>
            </div>
          </div>

          <div className="hidden md:block col-span-1 pl-44">
            <div className="relative h-full">
              <Image
                className="object-cover w-full h-full"
                alt=""
                src="/aboutE.png"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>
        <div className="pt-10 px-5">
          <div className="bg-purple flex flex-col items-center justify-center my-10 py-10 px-4 md:px-8 lg:px-24 text-center text-md lg:text-lg text-white relative">
            <div className="absolute md:w-20 md:h-20 w-10 h-10 top-0 left-0 transform -translate-x-1/2 -translate-y-1/2">
              <Image
                fill
                style={{ objectFit: "contain" }}
                alt=""
                src="/flower.png"
              />
            </div>
            <div className="absolute md:w-20 md:h-20 w-10 h-10  top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
              <Image
                fill
                style={{ objectFit: "contain" }}
                alt=""
                src="/flower.png"
              />
            </div>
            <h2 class="font-extrabold text-3xl font-indie mt-6 ">
              {selectedLocale.aboutPage.contentThreeTitle}
            </h2>
            <div className="relative flex  h-2 w-1/2 ">
              <div className="">
                <Image
                  fill
                  style={{ objectFit: "fill" }}
                  alt=""
                  src="/Vector (2).png"
                />
              </div>
            </div>
            <p class="">
              {selectedLocale.aboutPage.contentThreePragraph}
            </p>{" "}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
