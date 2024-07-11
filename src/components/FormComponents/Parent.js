import { useState, useEffect, Fragment } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { useForm, useFieldArray } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import { useLocalStorage } from "@mantine/hooks";
import countries from "countries-list";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useGetUserCountryCallingCode } from "../../hooks/useGetUserCountryCallingCode";
import { usePostParentInformation } from "../../hooks/usePostParentInformation";
import { useStudentStoreSelector } from "../../feature/studentRegistration/store";

export default function ParentPage(props) {
  const [loading, setLoading] = useState(false);
  const { setUserId } = useStudentStoreSelector();
  const countryCodes = Object.keys(countries.countries);
  const countryNames = countryCodes
    .map((code) => {
      return {
        country: countries.countries[code].name,
        code: countries.countries[code].phone.split(",")[0],
        emoji: countries.countries[code].emoji,
      };
    })
    .sort((c) => c.country);

  const { code, country } = useGetUserCountryCallingCode();
  const [selectedAreaCode, setSelectedAreaCode] = useState(
    countryNames.filter((c) => c.code === "1")[0]
  );

  const [userInfo, setUserInfo, removeItem] = useLocalStorage({
    key: "parentInfo",
    defaultValue: {
      Email: "",
      PhoneNumber: "",
      FirstName: "",
      LastName: "",
      agrees: false,
    },
  });

  const {
    control,
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...userInfo,
    },
  });

  useEffect(() => {
    if (country && code) {
      handleAreaCodeChange({ code, country });
    }
  }, [country, code]);

  useEffect(() => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("student-storage");
  }, []);

  useEffect(() => {
    reset(userInfo);
  }, [userInfo]);

  const handleAreaCodeChange = (userCountry) => {
    if (!userCountry?.code) {
      setSelectedAreaCode(countryNames.filter((c) => c.code === "1")[0]);
    } else if (userCountry.hasOwnProperty("code") && !userCountry.hasOwnProperty("emoji")) {
      const selected = countryNames.find(
        (c) => c.code === userCountry.code && c.country === userCountry.country
      );
      if (selected) {
        setSelectedAreaCode(selected);
      } else {
        setSelectedAreaCode(countryNames.filter((c) => c.code === "1")[0]);
      }
    } else {
      setSelectedAreaCode(userCountry);
    }
  };

  const handleNext = async (data) => {
    setUserInfo(data);
    const dataWithAreaCode = {
      ...data,
      PhoneNumber: `${selectedAreaCode.code},${data.PhoneNumber}`,
    };
    toast.promise(usePostParentInformation(dataWithAreaCode), {
        loading: "Loading...",
        success: "Parent information saved successfully",
        error: "Error saving parent information",
      })
      .then((result) => {
        const parentId = result?.data;
        setUserId(parentId);
        props.next();
      });
  };

  return (
    <div className="flex flex-row items-center justify-center">
      <form
        className="flex flex-col items-center justify-center"
        onSubmit={handleSubmit(handleNext)}
      >
        <div className="text-center mt-20 lg:mt-0">
          <h2 className="text-lg md:text-2xl font-bold my-5">
            {props.selectedLocale.registerPage.parentComponent.title}
          </h2>
          <div className="flex px-1 flex-col space-y-7 md:space-y-0 lg:gap-5  mt-5 mb-5">
            <div className="flex lg:flex-row space-y-7 md:space-y-0 flex-col">
              <div className="flex flex-col items-start mr-2 w-full">
                <label htmlFor="first-name" className="font-bold">
                  {props.selectedLocale.registerPage.parentComponent.name}{" "}
                </label>
                <input
                  {...register("FirstName", { required: true })}
                  type="text"
                  placeholder={
                    props.selectedLocale.registerPage.parentComponent.name
                  }
                  id="first-name"
                  className=" bg-white border w-full border-gray-300 border-black/10 shadow-xs   border-1 py-2 px-4 rounded-md"
                />
                {/* <ErrorMessage errors={errors} name="FirstName" /> */}
              </div>
              <div className="flex flex-col w-full items-start">
                <label htmlFor="last-name" className="font-bold">
                  {props.selectedLocale.registerPage.parentComponent.lastName}{" "}
                </label>
                <input
                  type="text"
                  {...register("LastName", { required: true })}
                  placeholder={
                    props.selectedLocale.registerPage.parentComponent.lastName
                  }
                  id="last-name"
                  className=" bg-white border w-full border-gray-300 border-black/10 shadow-xs  border-1 py-2 px-4 rounded-md"
                />
                {/* <ErrorMessage errors={errors} name="LastName" /> */}
              </div>
            </div>
            <div className="flex flex-col w-full pb-1 items-start ">
              <label className="font-bold ">
                {props.selectedLocale.registerPage.parentComponent.phone}
              </label>
              <div className="flex w-full lg:w-auto flex-col">
                <div className="">
                  <div className="flex justify-start">
                    <div>
                      <Listbox
                        value={selectedAreaCode}
                        onChange={handleAreaCodeChange}
                      >
                        <div className="relative mr-1 ">
                          <Listbox.Button className="relative w-full cursor-default border rounded-md border-black/10  bg-white py-3 pl-3 pr-10 text-left  focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                            <span className="block truncate">
                              {selectedAreaCode.emoji +
                                "   +" +
                                selectedAreaCode.code}
                            </span>
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
                                    `relative cursor-default select-none py-2 pl-2 pr-4 ${
                                      active
                                        ? "bg-amber-100 text-amber-900"
                                        : "text-gray-900"
                                    }`
                                  }
                                  value={country}
                                >
                                  {({ selected }) => (
                                    <div className="flex">
                                      <span
                                        className={`block truncate w-1/12 mr-[2px] ${
                                          selected
                                            ? "font-medium"
                                            : "font-normal"
                                        }`}
                                      >
                                        {country.emoji}
                                      </span>
                                      <span
                                        className={`block truncate w-1/5 ${
                                          selected
                                            ? "font-medium"
                                            : "font-normal"
                                        }`}
                                      >
                                        {" +" + country.code}
                                      </span>
                                      <span
                                        className={`block truncate w-1/2 ${
                                          selected
                                            ? "font-medium"
                                            : "font-normal"
                                        }`}
                                      >
                                        {country.country}
                                      </span>
                                      {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
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
                      style={{
                        WebkitAppearance: "textfield",
                        MozAppearance: "textfield",
                        appearance: "textfield",
                      }}
                      className="border border-black/10 rounded p-2"
                      placeholder="Phone number"
                      {...register("PhoneNumber", {
                        required: "Phone number is required",
                        minLength: {
                          value: 7,
                          message: "Phone number must be grater than 7",
                        },
                        pattern: {
                          value: /^(0|[1-9]\d*)(\.\d+)?$/,
                          message: "Invalid Phone number",
                        },
                      })}
                    />
                  </div>
                </div>
              </div>
              <ErrorMessage
                errors={errors}
                name="PhoneNumber"
                render={({ message }) => (
                  <p className="text-xs italic text-red-600">{message} </p>
                )}
              />
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col pb-2 items-start ">
                <label className="font-bold ">
                  {props.selectedLocale.registerPage.parentComponent.email}
                </label>
                <div className="flex flex-col w-full lg:w-full">
                  <input
                    type="email"
                    placeholder="Email"
                    className="border border-black/10 rounded p-2"
                    {...register("Email", {
                      required: "Email address is required",
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="Email"
                    render={({ message }) => (
                      <p className="text-xs italic text-red-600">{message} </p>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start">
            <div className="flex items-center mb-1">
              <input
                type="checkbox"
                id="privacy-policy"
                className="mr-2 w-5 h-5 "
                {...register("agrees", {
                  required: "You must agree to out Terms and Conditions",
                })}
              />
              <label htmlFor="privacy-policy" className="font-sans">
                {props.selectedLocale.registerPage.parentComponent.agree}
                &nbsp;
                <span className="text-black/50 hover:text-black">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer hover:underline"
                    href="https://app.termly.io/document/terms-of-service/0785e265-ff92-4227-894a-b00f7deb2b6b"
                  >
                    {props.selectedLocale.registerPage.parentComponent.terms}
                  </a>
                </span>
                &nbsp;
                <span className="text-black/50 hover:text-black">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer hover:underline"
                    href="https://app.termly.io/document/privacy-policy/b71ad4f9-b77e-482c-a1e8-f060e0645f9f"
                  >
                    {props.selectedLocale.registerPage.parentComponent.privacy}
                  </a>
                </span>
              </label>
            </div>
            <ErrorMessage
              errors={errors}
              name="agrees"
              render={({ message }) => (
                <p className="text-xs italic text-red-600">{message} </p>
              )}
            />
          </div>
        </div>

        <button
          type="submit"
          // onClick={props.next}
          onClick={() => {
            if (typeof gtag === "function") {
              gtag("event", "click", {
                event_category: "Button",
                event_label: "Next Button",
                value: "1",
              });
            }
          }}
          className="py-2 w-245 h-11 my-10 text-center font-bold bg-yellow rounded-md focus:outline-none"
          style={{
            backgroundColor: "#EFC35A",
            width: "230px",
            boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
            borderRadius: "8px",
          }}
          disabled={loading}
        >
          {props.selectedLocale.registerPage.next}
        </button>
      </form>
      <Toaster/>
    </div>
  );
}
