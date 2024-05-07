import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import localeData from "../i18n/index.json";

export default function Home({ setActive }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocale, setselectedLocale] = useState(localeData.labels[0]);
  const router = useRouter();

  const dropdown = useRef(null);

  const { pathname, locale, locales, asPath, defaultLocale } = router;

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(event) {
      if (dropdown.current && !dropdown.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isOpen]);

  useEffect(() => {
    setselectedLocale(
      localeData.labels.filter((l) => l.locale === router.locale)[0]
    );
  }, [router.locale]);

  return (
    <>
      <nav className="bg-white  fixed w-full z-20 top-0 px-0">
        <div
          onClick={setActive}
          className="bg-purple flex justify-between items-center"
        >
          <div className="flex justify-center flex-grow">
            <Link
              className="flex justify-items-center text-white items-center py-1 font-semibold cursor-pointer"
              href="/#discount"
            >
              <p>{selectedLocale.discount}</p>
            </Link>
          </div>
          <ul className="flex items-end">
            <li className="flex items-start">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://instagram.com/lucy__coding?igshid=ZGUzMzM3NWJiOQ=="
              >
                <img
                  src="/instagram (1).png"
                  alt="Instagram"
                  className="sm:mr-3 mr-1 w-6 sm:w-8"
                />
              </a>
            </li>
            <li className="flex items-start">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.facebook.com/lucycoding"
              >
                <img
                  src="/facebook (4).png"
                  alt="Facebook"
                  className="sm:mr-3 mr-1 w-6 sm:w-8"
                />
              </a>
            </li>
            <li className="flex items-start">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.linkedin.com/company/lucycoding/"
              >
                <img
                  src="/linkedin (1).png"
                  alt="Facebook"
                  className="sm:mr-3 mr-1 w-6 sm:w-8"
                />
              </a>
            </li>
          </ul>
        </div>

        <div className="md:px-10 px-0 pt-4 font-indie">
          <div className="flex justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex px-2 lg:px-0">
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="block cursor-pointer lg:hidden h-16 w-auto"
                  src="/mainlogo.png"
                  alt="Logo"
                  onClick={() => router.push("/")}
                />
                <img
                  className="hidden cursor-pointer lg:block h-16 w-auto"
                  src="/mainlogo.png"
                  alt="Logo"
                  onClick={() => router.push("/")}
                />
              </div>
            </div>
            <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
              <Link legacyBehavior href="/">
                <a
                  className={`${
                    pathname === "/"
                      ? "font-black text-black"
                      : "text-gray-500 font-bold"
                  } border-transparent  inline-flex items-center px-1 pt-1 border-b-2 text-[20px]`}
                >
                  <div
                    className="flex flex-col items-center"
                    style={{ minHeight: "40px" }}
                  >
                    <div>{selectedLocale.navbarComponents.home}</div>
                    {pathname === "/" && (
                      <div className="flex">
                        <img src="/curr.png" alt="Indicator" />
                      </div>
                    )}
                  </div>
                </a>
              </Link>

              <Link legacyBehavior href="/form">
                <a
                  className={`${
                    pathname === "/form"
                      ? "font-black text-black"
                      : "text-gray-500 font-bold"
                  } border-transparent  inline-flex items-center px-1 pt-1 border-b-2 text-[20px]`}
                >
                  <div
                    className="flex flex-col items-center"
                    style={{ minHeight: "40px" }}
                  >
                    <div>{selectedLocale.navbarComponents.register}</div>
                    {pathname === "/form" && (
                      <div className="flex">
                        <img src="/curr.png" alt="Indicator" />
                      </div>
                    )}
                  </div>
                </a>
              </Link>

              <Link legacyBehavior href="/formEnroll">
                <a
                  className={`${
                    pathname === "/formEnroll"
                      ? "font-black text-black"
                      : "text-gray-500 font-bold"
                  } border-transparent  inline-flex items-center px-1 pt-1 border-b-2 text-[20px]`}
                >
                  <div
                    className="flex flex-col items-center"
                    style={{ minHeight: "40px" }}
                  >
                    <div>{selectedLocale.navbarComponents.courses}</div>
                    {pathname === "/formEnroll" && (
                      <div className="flex">
                        <img src="/curr.png" alt="Indicator" />
                      </div>
                    )}
                  </div>
                </a>
              </Link>
              
              <Link legacyBehavior href="/About">
                <a
                  className={`${
                    pathname === "/About"
                      ? "font-black text-black"
                      : "text-gray-500 font-bold"
                  } border-transparent  inline-flex items-center px-1 pt-1 border-b-2 text-[20px]`}
                >
                  <div
                    className="flex flex-col items-center"
                    style={{ minHeight: "40px" }}
                  >
                    <div>{selectedLocale.navbarComponents.aboutUs}</div>
                    {pathname === "/About" && (
                      <div className="flex">
                        <img src="/curr.png" alt="Indicator" />
                      </div>
                    )}
                  </div>
                </a>
              </Link>

              <Link legacyBehavior href="/Blog">
                <a
                  className={`${
                    pathname === "/Blog"
                      ? "font-black text-black"
                      : "text-gray-500 font-bold"
                  } border-transparent  inline-flex items-center px-1 pt-1 border-b-2 text-[20px]`}
                >
                  <div
                    className="flex flex-col items-center"
                    style={{ minHeight: "40px" }}
                  >
                    <div>{selectedLocale.navbarComponents.blog}</div>
                    {pathname === "/Blog" && (
                      <div className="flex">
                        <img src="/curr.png" alt="Indicator" />
                      </div>
                    )}
                  </div>
                </a>
              </Link>

              <Link legacyBehavior href="/contact">
                <a
                  className={`${
                    pathname === "/contact"
                      ? "font-black text-black"
                      : "text-gray-500 font-bold"
                  } border-transparent  inline-flex items-center px-1 pt-1 border-b-2 text-[20px]`}
                >
                  <div
                    className="flex flex-col items-center"
                    style={{ minHeight: "40px" }}
                  >
                    <div>{selectedLocale.navbarComponents.contactUs}</div>
                    {pathname === "/contact" && (
                      <div className="flex">
                        <img src="/curr.png" alt="Indicator" />
                      </div>
                    )}
                  </div>
                </a>
              </Link>
    
    
           
              <Link
                href={asPath}
                locale={locales.filter((l) => l !== locale)[0]}
              >
                <p className="text-[20px] lg:ml-5 lg:mt-3 hover:underline font-bold text-yellow ">
                  {locales.filter((l) => l !== locale)[0].includes("am")
                    ? "አማ"
                    : "En"}
                </p>
              </Link>
            </div>
            <div className="-mr-2 flex items-center lg:hidden">
              <Link
                href={asPath}
                locale={locales.filter((l) => l !== locale)[0]}
              >
                <p className="text-[20px] mr-5 lg:mt-3 hover:underline font-bold text-yellow">
                  {locales.filter((l) => l !== locale)[0].includes("am")
                    ? "አማ"
                    : "En"}
                </p>
              </Link>

              <button
                ref={dropdown}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-[rgba(239, 195, 90, 1)] focus:outline-none focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <img src="/hamburger.png" alt="Menu icon" />
                ) : (
                  <img src="/Xicon.png" alt="Close icon" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isOpen ? (
          <div className="lg:hidden" id="mobile-menu">
            <div className=" pb-3 pt-12 space-y-2 pl-4">
              <Link legacyBehavior href="/">
                <a
                  onClick={() => setIsOpen(false)}
                  className="block pl-3 pr-4   font-semibold text-[20px]  sm:border-transparent  sm:hover:text-white "
                >
                  {selectedLocale.navbarComponents.home}
                </a>
              </Link>

              <Link legacyBehavior href="/form">
                <a
                  onClick={() => setIsOpen(false)}
                  className="block pl-3 pr-4   font-semibold text-[20px]  sm:border-transparent  sm:hover:text-white "
                >
                  {selectedLocale.navbarComponents.register}
                </a>
              </Link>

              <Link legacyBehavior href="/formEnroll">
                <a
                  onClick={() => setIsOpen(false)}
                  className="block pl-3 pr-4   font-semibold text-[20px]  sm:border-transparent  sm:hover:text-white "
                >
                  {selectedLocale.navbarComponents.courses}
                </a>
              </Link>
                 
              <Link legacyBehavior href="/About">
                <a
                  onClick={() => setIsOpen(false)}
                  className="<PhoneNumber> block pl-3 pr-4   font-semibold text-[20px]  sm:border-transparent  sm:hover:text-white "
                >
                  {selectedLocale.navbarComponents.aboutUs}
                </a>
              </Link>

              <Link legacyBehavior href="/Blog">
                <a
                  onClick={() => setIsOpen(false)}
                  className="block pl-3 pr-4 font-semibold text-[20px] sm:border-transparent sm:hover:text-white "
                >
                  {selectedLocale.navbarComponents.blog}
                </a>
              </Link>
   

              <Link legacyBehavior href="/contact">
                <a
                  onClick={() => setIsOpen(false)}
                  className="block pl-3 pr-4 font-semibold text-[20px] sm:border-transparent sm:hover:text-white "
                >
                  {selectedLocale.navbarComponents.contactUs}
                </a>
              </Link>
   
            </div>
          </div>
        ) : null}
      </nav>
    </>
  );
}
