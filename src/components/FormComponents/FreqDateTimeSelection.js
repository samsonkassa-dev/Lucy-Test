import { Fragment, useEffect, useState, useContext } from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import state from "../../feature/studentRegistration/store";
import { toast, toaster } from "react-hot-toast";
import axios from "../../api/axios";
import { useRouter } from "next/router";
import { usePostFrequencyInfo } from "../../hooks/usePostFrequencyInfo";
import moment from "moment";
import { useGetTimezone } from "../../hooks/useGetTimezone";
import { timeZones } from "../../data/timezones";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import timeParser from "dayjs/plugin/customParseFormat";
import Frequency from "./Frequency";
import FormContext from "./FormContext";
import { Toaster } from "react-hot-toast";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(timeParser);
dayjs.tz.setDefault("America/New_York");

const defaultTimes = ["06:00 PM - 1:30 PM", "11:00 PM - 5:30 PM"];
const availableTimes = [
  {
    time: "3:00 PM", // Time given in UTC.
    utcTimeStamp: "1650142800000",
  },
  {
    time: "7:00 PM", //
    utcTimeStamp: "1650157200000",
  },
  {
    time: "8:00 PM", //
    utcTimeStamp: "1650160800000",
  },
];

const availableTimes2 = [
  {
    time: "9:00 PM",
    utcTimeStamp: "1650142800000",
  },
  {
    time: "10:00 PM",
    utcTimeStamp: "1650142800000",
  },
];

const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export default function DatePickerPage(props) {
  //   const trainingFrequency = state.getState()?.studentTrainingFrequency;
  const router = useRouter();
  const minDate = addDays(new Date(), 2);
  const [selectedTime, setSelectedTime] = useState([]);
  const [students, setStudents] = useState([]);
  const { userOffset, userTimeZone } = useGetTimezone();
  const [selectedSession, setSelectedSession] = useState("");
  const [userDefaultTimezone, setUserDefaultTimezone] = useState(
    "AddisAbaba/Ethiopia"
  );
  const [times, setTimes] = useState(availableTimes || []);
  const [originalTimes, setOriginalTimes] = useState(availableTimes);
  const [selectedTimezone, setSelectedTimezone] = useState(userDefaultTimezone);
  const [activeTab, setActiveTab] = useState(0);
  const { nextPage, prevPage, selectedLocale } = useContext(FormContext);
  const [clickedPrice, setClickedPrice] = useState("");

  useEffect(() => {
    setSelectedSession("Session1");
  }, []);

  useEffect(() => {
    let newTimes;
    if (selectedSession.startsWith("Session1")) {
      newTimes = availableTimes;
    } else if (selectedSession.startsWith("Session2")) {
      newTimes = availableTimes2;
    }
    setOriginalTimes(newTimes);
    const convertedTimes = timeConverter(newTimes, "AddisAbaba/Ethiopia");
    setTimes(convertedTimes);
    setUserDefaultTimezone("AddisAbaba/Ethiopia");
  }, [selectedSession]);

  // re-run this effect when `selectedSession` changes
  // re-run this effect when `isInputClicked` changes

  const recommendationArray = state.getState().studentRecommendation;
  const userId =
    state.getState()?.students?.userId || state.getState()?.students?._id;
  const studentIds = state.getState()?.students?.studentIds;

  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
  const [selectedValues, setSelectedValues] = useState([]);

  const [showFrequency, setShowFrequency] = useState(false);

  const setSelectedTap = state.getState().actions.setSelectedTap;
  const selectedTap = state.getState().selectedTap;

  const setStudentTrainingFrequency =
    state.getState()?.actions?.setStudentTrainingFrequency;

  const handleCourseSelection = (index) => {
    setActiveTab(index);
    setSelectedCourseIndex(index);
  };

  const timeConverter = (timesArray, userTimeZone) => {
    if (!timesArray) {
      return [];
    }
    if (userTimeZone === "AddisAbaba/Ethiopia") {
      userTimeZone = "+03:00";
    }
    const convertedTimes = timesArray.map((time) => {
      const singleTime = time.time;
      const sourceTime = moment.utc(singleTime, "h:mm A");
      // sourceTime.utcOffset("+00 :00");
      console.log({ sourceTime }); // UTC offset for Addis Ababa
      const userTime = userTimeZone
        ? sourceTime.clone().utcOffset(userTimeZone)
        : sourceTime.clone();
      return {
        time: userTime.format("h:mm A"),
        utcTimeStamp: time.utcTimeStamp,
      };
    });

    return convertedTimes;
  };

  const handleTimezoneChange = (e) => {
    const newTimes = timeConverter(originalTimes, e.offset);
    console.log({ e });
    setTimes(newTimes);
    setUserDefaultTimezone(e.ianaTimeZone);
  };

  const handleNextFreq = async (e) => {
    // const cleanArray = (arr) =>
    //   Array.isArray(arr) && arr.filter((item) => item);
    // if (cleanArray(selectedValues).length !== recommendationArray.length) {
    //   return toast.error("Make sure you selected all fields");
    // }
    const dataToSend = selectedValues?.map((value) => {
      return {
        trainingFrequency: value.split(".")[0],
        courseId: value.split(".")[1],
        studentId: value.split(".")[2],
        userId,
      };
    });
    setStudentTrainingFrequency(dataToSend);

    const trainingFrequency = dataToSend;

    try {
      await toast.promise(
        new Promise((resolve, reject) =>
          setTimeout(() => resolve("Success"), 1000)
        ),
        {
          pending: "Updating Information user",
          success: "Success",
          error: {
            render({ data }) {
              return `${
                data?.response?.data?.message ?? "something went wrong "
              }`;
            },
          },
        }
      );

      handleNext(trainingFrequency);
    } catch (error) {
      // Handle error
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleNext = async (trainingFrequency) => {
    const cleanArray = (arr) =>
      Array.isArray(arr) && arr.filter((item) => item);
    const filteredStudents = students.filter(
      (student) => student && student.time
    );

    // if (
    //   cleanArray(students).length !== recommendationArray.length ||
    //   filteredStudents.length !== recommendationArray.length
    // ) {
    //   return toast.error("Make sure you selected all fields");
    // }

    const data = students.map((student) => {
      return {
        UserId: userId,
        StudentId: student.time.split(".")[3],
        CourseId: student.time.split(".")[2],
        Time: student.time.split(".")[0],
        Timezone: userDefaultTimezone,
        timeIndex: student.time.split(".")[1],
        StartDate: dayjs(student.selectedDate).utc().format(),
        PaymentId: "1234",
      };
    });

    const mergedData = data.map((item) => {
      const found = trainingFrequency.find(
        (element) =>
          element.studentId === item.StudentId &&
          element.courseId === item.CourseId
      );
      return { ...item, TrainingFrequency: found?.trainingFrequency };
    });

    try {
      await toast.promise(usePostFrequencyInfo(mergedData), {
        loading: "Updating Information",
        success: "Success",
        error: {
          render({ data }) {
            return `${
              data?.response?.data?.message ?? "Something went wrong "
            }`;
          },
        },
      });
      state.getState().actions.setStudentTrainingFrequency(trainingFrequency);
      createCheckOutSession(trainingFrequency);
    } catch (error) {
      // Handle error
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const createCheckOutSession = async (trainingFrequency) => {
    const recommendationArray = state.getState().studentRecommendation;

    const courseData = recommendationArray.map((item) => ({
      name: item.name,
      price: item.prices[0].unitAmount / 100,
      quantity: 1,
      image: item.images[0],
      courseId: item._id,
      clickedPrice: clickedPrice,
      RecommendedFor: item.RecommendedFor,
    }));

    const trainingFrequencyArr = trainingFrequency.map((item) => {
      const found = courseData.find(
        (element) => element.courseId === item.courseId
      );
      console.log(found, "found");
      return { ...item, ...found };
    });
    // console.log(trainingFrequencyArr, "trainingFrequencyArr");
    state.getState().actions.setCheckoutSession(trainingFrequencyArr);
    // console.log(state.getState().checkoutSession);

    {
      /* 
  the below is for the checkout page

    if(clickedPrice==="100$") {
      props.next();
    }else if(clickedPrice==="285$") {
      try {
        const { data } = await axios.post("/v1/order/createCheckout", {
          items: trainingFrequencyArr,
        });
  
        const resetSelectedCourse = state.getState().actions.resetSelectedCourse;
        resetSelectedCourse();
  
        router.push(data?.url);
      } catch (error) {
        // Handle error
        console.error(error);
        toast.error("An error occurred. Please try again.");
      }
      }
    }*/
    }

    try {
      const { data } = await axios.post("/v1/order/createCheckout", {
        items: trainingFrequencyArr,
      });

      const resetSelectedCourse = state.getState().actions.resetSelectedCourse;
      resetSelectedCourse();

      // router.push(data?.url);
    } catch (error) {
      // Handle error
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleRadioChange = (e) => {
    // Get the new value from the clicked radio button
    const newTime = e.target.value;

    // Create a new array with the new value for all items
    const newValues = recommendationArray.map((course) => {
      const studentId =
        studentIds &&
        studentIds.filter(
          (student) =>
            (student.firstname || student.FirstName) === course.RecommendedFor
        )[0].id;

      return `${newTime}.${course._id}.${studentId}`;
    });

    // Update the state
    setSelectedTime(newValues);
    // console.log(newValues);

    // Update the students state
    setStudents((prevStudents) => {
      return prevStudents.map((student, index) => {
        return {
          ...student,
          time: newValues[index],
        };
      });
    });
  };

  const handleRadioChangeFreq = (e) => {
    // Get the new value from the clicked radio button
    const newValue = e.target.value;

    // Split the new value into its components
    const [trainingFrequency, courseId, studentId] = newValue.split(".");

    // Create a new array with the new value for all items
    const newValues = recommendationArray.map((course) => {
      const studentId =
        studentIds &&
        studentIds.filter(
          (student) =>
            (student.firstname || student.FirstName) === course.RecommendedFor
        )[0].id;

      return `${trainingFrequency}.${course._id}.${studentId}`;
    });

    // Update the state
    setSelectedValues(newValues);
  };

  const handleDateChange = (value) => {
    setStudents((prevStudents) => {
      return prevStudents.map((student) => {
        return {
          ...student,
          selectedDate: value,
        };
      });
    });
  };

  const handleTapSelection = (tap) => {
    setSelectedTap(tap);

    setSelectedCourseIndex(tap === 1 ? 0 : 1);
  };

  useEffect(() => {
    console.log(clickedPrice);
  }, [clickedPrice]);

  return (
    <>
      <div className="flex flex-col items-center mx-auto max-w-screen-lg justify-center">
        <h3 className="text-2xl text-center mx-auto font-normal mt-6">
          {props.selectedLocale.registerPage.chooseTime}
        </h3>

        <div className="flex justify-center mt-6">
          <div className="flex justify-center mt-6">
            <div className="flex items-center bg-[#cab7f6] rounded-full">
              {/* Left button */}
              <button
                className={`md:w-1/2 w-full md:min-w-[18rem] min-w-[10rem] text-[12px] md:text-lg font-semibold h-14 rounded-full flex items-center justify-center cursor-pointer ${
                  selectedTap === 1
                    ? "bg-[#6743EE] text-white"
                    : "bg-[#cab7f6] text-[#a37ff9]"
                }`}
                onClick={() => handleTapSelection(1)}
              >
                {props.selectedLocale.registerPage.classFull}
              </button>

              {/* Right button */}
              <button
                className={`md:w-1/2 w-full md:min-w-[18rem] min-w-[10rem] text-[12px] md:text-lg font-semibold h-14 rounded-full flex items-center justify-center cursor-pointer ${
                  selectedTap === 2
                    ? "bg-[#6743EE] text-white"
                    : "bg-[#cab7f6] text-[#a37ff9]"
                }`}
                onClick={() => handleTapSelection(2)}
              >
                {props.selectedLocale.registerPage.classNow}
              </button>
            </div>
          </div>
        </div>
        {selectedTap === 1 && (
          <>
            {/* <div className="flex flex-wrap justify-center mt-6">
              {recommendationArray.map((course, index) => (
                <button
                  key={index}
                  className={`pb-2 w-115 h-30 text-gray-2 font-medium text-lg text-center mt-3 hover:text-black 
      ${
        selectedCourseIndex === index
          ? " text-black rounded-md bg-[#eedc82]" // Added a light gray background for the active tab
          : "border-none bg-white" // Added a white background for the inactive tabs
      }
    pt-1 focus:outline-none`}
                  onClick={() => handleCourseSelection(index)}
                >
                  {course.RecommendedFor}
                </button>
              ))}
            </div> */}

            <div>
              <div className="flex sm:flex-row flex-col mt-10 sm:gap-x-32 sm:ml-10 justify-center items-center mb-10 w-full">
                <div className=" h-auto flex flex-col mx-auto mt-5">
                  <div className="self-center relative flex justify-center items-center">
                    <input
                      type="radio"
                      id={`Session1`}
                      name={`Session`}
                      dateValue="2023/06/28"
                      onChange={(e) => {
                        const dateValue = e.target.getAttribute("dateValue");
                        handleRadioChangeFreq(e);
                        handleDateChange(dateValue);
                        setClickedPrice("300$");
                        console.log("radio button value", e.target.value);
                      }}
                      value={`1`}
                      className={`cursor-pointer absolute top-0 bottom-0 w-72 h-24 text-center mx-auto mt-6 border appearance-none checked:border-2 checked:border-yellow  checked:text-black checked:font-semibold border-gray-600 text-gray-2 rounded-md  focus:outline-none  hover:border-yellow`}
                    />
                    <label
                      htmlFor={`Session1`}
                      className={`mt-8 ${"text-black font-semibold"}`}
                    >
                      <div className="w-full flex flex-col gap-y-1 items-center cursor-pointer justify-center text-center">
                        <p>
                          {
                            props.selectedLocale.registerPage.frequency
                              .session[0].title
                          }
                        </p>
                        <p className="text-sm text-yellow font-semibold">
                          {
                            props.selectedLocale.registerPage.frequency
                              .session[0].time
                          }
                        </p>
                        <div className="flex items-center flex-wrap">
                          <p>
                            {
                              props.selectedLocale.registerPage.frequency
                                .session[0].price
                            }
                            &nbsp;{" "}
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                  <div className="self-center relative flex justify-center items-center">
                    <input
                      type="radio"
                      id={`Session2`}
                      name={`Session`}
                      dateValue="2023/07/06"
                      onChange={(e) => {
                        const dateValue = e.target.getAttribute("dateValue");
                        handleRadioChangeFreq(e);
                        handleDateChange(dateValue);
                        console.log("Price clicked two");
                        setClickedPrice("300$");
                      }}
                      value={`2`}
                      className={`cursor-pointer absolute top-0 bottom-0 w-72 h-24 text-center mx-auto mt-6 border appearance-none checked:border-2 checked:border-yellow  checked:text-black checked:font-semibold border-gray-600 text-gray-2 rounded-md  focus:outline-none  hover:border-yellow`}
                    />
                    <label
                      htmlFor={`Session2`}
                      className={`mt-8 ${"text-black font-semibold"}`}
                    >
                      <div className="w-full flex flex-col gap-y-1 items-center cursor-pointer justify-center text-center">
                        <p>
                          {
                            props.selectedLocale.registerPage.frequency
                              .session[1].title
                          }
                        </p>
                        <p className="text-sm text-yellow font-semibold">
                          {
                            props.selectedLocale.registerPage.frequency
                              .session[1].time
                          }
                        </p>
                        <div className="flex items-center flex-wrap">
                          <p>
                            {
                              props.selectedLocale.registerPage.frequency
                                .session[1].price
                            }
                            &nbsp;{" "}
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-10 md:pt-0">
                  <h3 className="font-semibold">
                    {props.selectedLocale.registerPage.timezone}
                  </h3>
                  <div className="flex items-center justify-start">
                    <div className="pt-4">
                      <div className="flex justify-start">
                        <div>
                          <Listbox onChange={handleTimezoneChange}>
                            <div className="relative mr-1 z-50 ">
                              <Listbox.Button className="relative flex min-w-[15rem] w-full cursor-default border rounded-md border-transparent bg-white -mt-2 text-left focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                <img
                                  className="w-4 h-4 mr-2"
                                  alt=""
                                  src="/Icon.png"
                                />
                                <span className="block truncate">
                                  {userDefaultTimezone}
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
                                <Listbox.Options className="absolute mt-1 max-h-60 w-96 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {timeZones.map((tz, tzIdx) => (
                                    <Listbox.Option
                                      key={tzIdx}
                                      className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-2 pr-4 ${
                                          active
                                            ? "bg-amber-100 text-amber-900"
                                            : "text-gray-900"
                                        }`
                                      }
                                      value={tz}
                                    >
                                      {({ selected }) => (
                                        <div className="flex">
                                          <span
                                            className={`block mr-[2px] ${
                                              selected
                                                ? "font-medium"
                                                : "font-normal"
                                            }`}
                                          >
                                            {tz.abbreviation}
                                          </span>
                                          <span
                                            className={`block ${
                                              selected
                                                ? "font-medium"
                                                : "font-normal"
                                            }`}
                                          >
                                            {`(${tz.offset})`} &nbsp;
                                          </span>
                                          <span
                                            className={`block ${
                                              selected
                                                ? "font-medium"
                                                : "font-normal"
                                            }`}
                                          >
                                            {tz.fullName}
                                          </span>
                                          {selected && (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                              <CheckIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                              />
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        </div>
                      </div>
                    </div>
                  </div>
                  {times.map((t, timeIndex) => {
                    const time = t.time;
                    const value = `${time}.${defaultTimes[timeIndex]}`;
                    const isChecked = selectedTime === value;

                    return (
                      <div
                        className="self-center relative flex justify-center items-center"
                        key={timeIndex}
                      >
                        <input
                          type="radio"
                          id={`time`}
                          name={`time`}
                          onChange={(e) => handleRadioChange(e)}
                          value={value}
                          className={`cursor-pointer absolute top-0 bottom-0 w-60 h-11 text-center mx-auto mt-6 border appearance-none checked:border-2 checked:border-yellow checked:text-black checked:font-semibold border-gray-600 text-gray-2 rounded-md focus:outline-none hover:border-yellow`}
                        />
                        <label
                          htmlFor={`time`}
                          className={`mt-8 ${
                            isChecked
                              ? "text-black font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {time}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-x-32 my-4 w-full">
              <button
                onClick={() => {
                  if (activeTab > 0) {
                    handleCourseSelection(activeTab - 1);
                  } else {
                    props.prev();
                  }
                }}
                className="bg-yellow w-245 h-48 border-solid rounded-md font-bold"
              >
                {props.selectedLocale.registerPage.back}
              </button>
              <button
                onClick={() => {
                  handleNextFreq();
                }}
                className="bg-yellow w-245 h-48 border-solid rounded-md font-bold"
              >
                {props.selectedLocale.registerPage.checkout}
              </button>
            </div>
          </>
        )}
      </div>
      <Toaster/>
      {selectedTap === 2 && (
        <Frequency
          prev={prevPage}
          next={nextPage}
          selectedLocale={selectedLocale}
        />
      )}
    </>
  );
}