import React, { useEffect, useState, useContext } from "react";
import Page1 from "./FormComponents/Parent";
import Page2 from "./FormComponents/Name";
import Page3 from "./FormComponents/Recommended";
import Page5 from "./FormComponents/CheckOut";
import Page4 from "./FormComponents/FreqDateTimeSelection";

import state from "./../feature/studentRegistration/store";
import Page8 from './FormComponents/DateAndTimePicker';

import Page6 from "./FormComponents/ThankYou";
import Page7 from "./FormComponents/Canceled";
import { useRouter } from "next/router";
import Head from "next/head";
import localeData from "../i18n/index.json";

import FormContext from "./FormComponents/FormContext";

const isValidTabNumber = (tab) => {
  return parseInt(tab) && parseInt(tab) > 1 && parseInt(tab) < 8;
};

export default function FormPage() {
  const router = useRouter();
  const { status } = router.query;
  const [progress, setProgress] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedLocale, setselectedLocale] = useState(localeData.labels[0]);
  const selectedTap = state.getState().selectedTap;

  useEffect(() => {
    setselectedLocale(
      localeData.labels.filter((l) => l.locale === router.locale)[0]
    );
  }, [router.locale]);

  const nextPage = () => {
    setProgress(pages[page].progress);
    setPage(page + 1);
  };

  const prevPage = () => {
    setProgress(pages[page - 2].progress);
    setPage(page - 1);
  };

  const pages = [
    {
      name: "Page 1",
      component: <Page1 next={nextPage} selectedLocale={selectedLocale} />,
      progress: 0,
    },
    {
      name: "Page 2",
      component: (
        <Page2
          prev={prevPage}
          next={nextPage}
          selectedLocale={selectedLocale}
        />
      ),
      progress: 25,
    },
    {
      name: "Page 3",
      component: (
        <Page3
          prev={prevPage}
          next={nextPage}
          selectedLocale={selectedLocale}
        />
      ),
      progress: 50,
    },

    {
      name: "Page 4",
      component: (
        <Page4
          prev={prevPage}
          next={nextPage}
          selectedLocale={selectedLocale}
        />
      ),
      progress: 75,
    },
    ...(selectedTap === 2
      ? [
          {
            name: "Page 8",
            component: (
              <Page8
                prev={prevPage}
                next={nextPage}
                selectedLocale={selectedLocale}
              />
            ),
            progress: 60,
          },

          {
            name: "Page 5",
            component: (
              <Page5
                prev={prevPage}
                next={nextPage}
                selectedLocale={selectedLocale}
              />
            ),
            progress: 75,
          },
        ]
      : []),
      {
        name: "Page 5",
        component: (
          <Page5
            prev={prevPage}
            next={nextPage}
            selectedLocale={selectedLocale}
          />
        ),
        progress: 85,
      },

    {
      name: "Page 6",
      component: (
        <Page6
          prev={prevPage}
          next={nextPage}
          selectedLocale={selectedLocale}
        />
      ),
      progress: 100,
    },
    {
      name: "Page 7",
      component: (
        <Page7
          prev={prevPage}
          next={nextPage}
          selectedLocale={selectedLocale}
        />
      ),
      progress: 100,
    },
  ];

  useEffect(() => {
    // console.log(router.query);
    if (router.query.tab && isValidTabNumber(router.query.tab)) {
      setPage(parseInt(router.query.tab));
      setProgress(pages[parseInt(router.query.tab) - 1].progress);
      router.replace({
        pathname: router.pathname,
      });
    }
  }, [router.query]);

  return (
    <>
      <Head>
        <title>Registration Form - Lucy</title>
      </Head>
      <div className=" px-5 max-w-screen-2xl mx-auto justify-items-center">
        <div className="  overflow-hidden h-auto mt-24">
          <div className="flex items-center">
            <div className="w-full lg:h-full  lg:mb-0 mb-10">
              <div className="mx-auto md:max-w-screen-md mt-10 h-2 bg-gray">
                <div
                  className={`bg-yellow text-xs leading-none py-1 text-center h-2 text-white ${
                    page > 1 ? "w-50/50" : "w-25/50"
                  } transition-all ease-out duration-1000`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {status === "success" && (
                <Page6
                  prev={prevPage}
                  next={nextPage}
                  selectedLocale={selectedLocale}
                />
              )}
              {status === "cancel" && (
                <Page7
                  prev={prevPage}
                  next={nextPage}
                  selectedLocale={selectedLocale}
                />
              )}

              <FormContext.Provider value={{ nextPage, prevPage, selectedLocale }}>
                {!status && pages[page - 1].component}
              </FormContext.Provider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
