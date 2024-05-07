import Link from "next/link";
import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import countries from "countries-list";
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useLogin } from "../hooks/useLogin";
import { toast } from "react-toastify";
import state from "../feature/studentRegistration/store";
import { useGetUserCountryCallingCode } from '../hooks/useGetUserCountryCallingCode'
export default function Home() {

  const setRecommendation = state.getState().actions.setStudentRecommendation;
  const setStudents = state.getState().actions.setStudents

  const router = useRouter();
  const { code, country } = useGetUserCountryCallingCode()
  const [PhoneNumber, setPhoneNumber] = useState("");
  const countryCodes = Object.keys(countries.countries);
  const countryNames = countryCodes.map(code => {
    return { country: countries.countries[code].name, code: countries.countries[code].phone.split(',')[0], emoji: countries.countries[code].emoji }
  }).sort(c => c.country);
  const [selectedAreaCode, setSelectedAreaCode] = useState(countryNames.filter(c => c.code === "1")[0]);

  const { login } = useLogin();


  useEffect(() => {
    handleAreaCodeChange({ country, code })
  }, [country])

  const handleAreaCodeChange = (userCountry) => {
    if (userCountry?.code === undefined) return setSelectedAreaCode(countryNames.filter(c => c.code === "1")[0])
    if (userCountry.hasOwnProperty("code") && !userCountry.hasOwnProperty("emoji")) {
      const selected = countryNames.find(c => c.code === userCountry.code && c.country === userCountry.country)
      return setSelectedAreaCode(selected)
    }
    return setSelectedAreaCode(userCountry)
  }

  const handleLogin = (e) => {
    e.preventDefault();

    toast.promise(
      login(`${selectedAreaCode.code},${PhoneNumber}`)
      // login(PhoneNumber)
      , {
        success: "Login Success",
        pending: "Logging in",
        error: {
          render({ data }) {
            return `${data?.response?.data?.message ?? "Unable to login"}`
          }
        }
      }
    ).then(res => {
      console.log(res)
      setRecommendation(res.Recommendation);
      res.UserData.studentIds = res.UserData.Students
      delete res.UserData.Students

      setStudents(res.UserData)
      router.push("/form?tab=2");
    })

  };
  const handleSetPhoneNumber = (e) => {
    setPhoneNumber(e.target.value);
  };

  const wrapperStyle = {
    boxSizing: "border-box",
    border: "1px solid #000000",
    borderRadius: "5px",
  };



  return (
    <>
      <Head>
        <title>Login - Lucy</title>
      </Head>
      <section className="banner-bg-img w-100%  pt-44 h-screen  ">
        <div className="max-w-[1230px] bg-transparent lg:mx-auto md:mx-16 mx-4  grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-black font-semibold text-[30px] md:text-[40px]">
              Let's Get You Started.
            </h2>
            <h5 className="text-black text-[18px] md:text-[24px] font-normal">
              Please enter your phone number to begin,
            </h5>

            <div className="pt-4">
              <div className="flex justify-start">
                <div>
                  <Listbox value={selectedAreaCode} onChange={handleAreaCodeChange}>
                    <div className="relative mr-1 ">
                      <Listbox.Button className="relative w-full cursor-default border rounded-md border-black/10  bg-white py-3 pl-3 pr-10 text-left  focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="block truncate">{selectedAreaCode.emoji + "   +" + selectedAreaCode.code}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-80 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {countryNames.map((country, countryIdx) => (
                            <Listbox.Option
                              key={countryIdx}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-2 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                }`
                              }
                              value={country}
                            >
                              {({ selected }) => (
                                <div className="flex">
                                  <span
                                    className={`block truncate w-1/12 mr-[2px] ${selected ? 'font-medium' : 'font-normal'
                                      }`}
                                  >
                                    {country.emoji}
                                  </span>
                                  <span
                                    className={`block truncate w-1/5 ${selected ? 'font-medium' : 'font-normal'
                                      }`}
                                  >
                                    {" +" + country.code}
                                  </span>
                                  <span
                                    className={`block truncate w-1/2 ${selected ? 'font-medium' : 'font-normal'
                                      }`}
                                  >
                                    {country.country}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </div>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>

                </div>
                <input
                  type="PhoneNumber"
                  name="PhoneNumber"
                  id="PhoneNumber"
                  autoComplete="PhoneNumber"
                  className="px-4 border rounded-md border-black/10 py-2" value={PhoneNumber}
                  onChange={handleSetPhoneNumber}
                />
              </div>
            </div>
            <div className="pt-8 flex ">
              <button
                className="lg:w-48 md:w-64 w-full py-3.5 font-semibold rounded bg-yellow cursor-pointer flex justify-center items-center space-x-2 group"
                onClick={handleLogin}
              >
                Log In
                {/* {isLoading ? 'Loading...' : 'Log In'} */}
              </button>
              {/* {error && (
              <p className="text-red-400">{error.response?.data?.message}</p>
            )} */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
