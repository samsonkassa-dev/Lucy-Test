import { Fragment, useEffect, useState } from "react";
import { DatePicker } from "@mantine/dates";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import state from "../../feature/studentRegistration/store";
import { toast, Toaster } from "react-hot-toast";
import axios from "../../api/axios";
import { useRouter } from "next/router";
import { usePostFrequencyInfo } from "../../hooks/usePostFrequencyInfo";
import moment from "moment";
import { useGetTimezone } from "../../hooks/useGetTimezone";
import { timeZones } from "../../data/timezones";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import timeParser from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(timeParser);
dayjs.tz.setDefault("America/New_York");


const defaultTimes = [
  "10:00 AM - 11:30 AM",
  "12:00 PM - 1:30 PM",
  "02:00 PM - 3:30 PM",
  "11:00 PM - 5:30 PM",
];
const availableTimes = [
  {
    time: "3:00 PM", // This is a time in UTC
    utcTimeStamp: "1650142800000", // C
  },
  {
    time: "7:00 PM", //
    utcTimeStamp: "1650157200000", //
  },
  {
    time: "8:00 PM", //
    utcTimeStamp: "1650160800000", //
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
  const trainingFrequency = state.getState()?.studentTrainingFrequency;
  const router = useRouter();
  const minDate = addDays(new Date(), 2);
  const [selectedTime, setSelectedTime] = useState([]);
  const [students, setStudents] = useState([]);
  const { userOffset, userTimeZone } = useGetTimezone();
  const [times, setTimes] = useState(availableTimes || []);
  const [originalTimes, setOriginalTimes] = useState(availableTimes);
  // const [selectedDate, setSelectedDate] = useState(null);

  const [userDefaultTimezone, setUserDefaultTimezone] = useState(
    "AddisAbaba/Ethiopia"
  );
  const recommendationArray = state.getState().studentRecommendation;
  const [activeTab, setActiveTab] = useState(0);
  const selectedSession = state.getState().selectedSession;
  const [clickedPrice, setClickedPrice] = useState("");

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

  const userId =
    state.getState()?.students?.userId || state.getState()?.students?._id;
  const studentIds = state.getState()?.students?.studentIds;

  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);

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
    setTimes(newTimes);
    setUserDefaultTimezone(e.ianaTimeZone);
  };

 

  const handleNext = () => {


    const data = state.getState().studentsDateData.map((student) => {
      return {
        UserId: userId,
        StudentId: student.time.split(".")[3],
        CourseId: student.time.split(".")[2],
        Time: student.time.split(".")[0],
        timeIndex: student.time.split(".")[1],
        Timezone: userDefaultTimezone,
        StartDate: dayjs(student.selectedDate).utc().format(),
        PaymentId: "1234",
      };
    });
    // merge data with trainingFrequency
    const mergedData = data.map((item) => {
      const found = trainingFrequency.find(
        (element) =>
          element.studentId === item.StudentId &&
          element.courseId === item.CourseId
      );
      return { ...item, TrainingFrequency: found?.trainingFrequency };
    });
    console.log(mergedData);
    toast
      .promise(
        usePostFrequencyInfo(mergedData),
        // new Promise((resolve, reject) => setTimeout(() => resolve("Success"), 1000000)),
        {
          loading: "Updating Information user",
          success: "Success",
          error: {
            render({ data }) {
              return `${
                data?.response?.data?.message ?? "Something went wrong "
              }`;
            },
          },
        }
      )
      .then((_) => {
        createCheckOutSession();
      });
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
    console.log(newValues);

    // Update the students state
    const updatedStudents = newValues.map((newValue, index) => {
      return {
        ...students[index], // Ensure that students state is properly initialized
        time: newValue,
      };
    });

    setStudents(updatedStudents);
    // console.log(updatedStudents)

    state.getState().actions.setStudentsDateData(updatedStudents);
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

  const createCheckOutSession = async () => {
    const recommendationArray = state.getState().studentRecommendation;

    const courseData = recommendationArray.map((item) => ({
      name: item.name,
      price: item.prices[0].unitAmount / 100,
      quantity: 1,
      image: item.images[0],
      courseId: item._id,
      RecommendedFor: item.RecommendedFor,
    }));

    const trainingFrequencyArr = trainingFrequency.map((item) => {
      const found = courseData.find(
        (element) => element.courseId === item.courseId
      );
      let newPrice;
      if (found.price === 100) {
        newPrice = 360;
        setClickedPrice("360");
      } else if (found.price === 280) {
        newPrice = 360;
        setClickedPrice("360");
      }
      return { ...item, ...found, newPrice };
    });

    console.log(clickedPrice);

    state.getState().actions.setCheckoutSession(trainingFrequencyArr);

    {
      /* to call the checkout page for any changes the below can be used

      check out is called for the first session which was once a week

       if (selectedSession.startsWith("Session1")) {
      props.next();
    } else if (selectedSession.startsWith("Session2")) {
      
    const { data } = await axios.post("/v1/order/createCheckout", {
      items: trainingFrequencyArr,
    });

    router.push(data?.url);
    }
  
  */
    }

    try {
      const { data } = await axios.post("/v1/order/createCheckout", {
        items: trainingFrequencyArr,
      });
      router.push(data?.url);
    } catch (error) {
      // Handle error
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center mx-auto max-w-screen-lg justify-center">
      {/* <h1 className="text-2xl mt-6">{props.selectedLocale.registerPage.date.title}</h1> */}
      <h3 className="text-2xl text-center mx-auto font-normal mt-6">
        {props.selectedLocale.registerPage.date.title}{" "}
      </h3>
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
        <div className="flex sm:flex-row flex-col mt-10 sm:gap-x-32 justify-center items-center mb-10 w-full">
          <DatePicker
            value={students.selectedDate}
            onChange={(value) => handleDateChange(value)}
            minDate={minDate}
            excludeDate={(date) => {
              const day = date.getDay();
              return day !== 2 && day !== 4 && day !== 6;
            }}
          />
          <div className="">
            <h3 className="font-semibold">TimeZone</h3>
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
                                        selected ? "font-medium" : "font-normal"
                                      }`}
                                    >
                                      {tz.abbreviation}
                                    </span>
                                    <span
                                      className={`block ${
                                        selected ? "font-medium" : "font-normal"
                                      }`}
                                    >
                                      {`(${tz.offset})`} &nbsp;
                                    </span>
                                    <span
                                      className={`block ${
                                        selected ? "font-medium" : "font-normal"
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
                      isChecked ? "text-black font-semibold" : "text-gray-700"
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
          {props.selectedLocale.registerPage.back}{" "}
        </button>{" "}
        <button
          onClick={() => {
            handleNext();
            if (typeof gtag === "function") {
              gtag("event", "click", {
                event_category: "Button",
                event_label: "Next Button",
              });
            }
          }}
          className="bg-yellow w-245 h-48 border-solid rounded-md font-bold"
        >
          {props.selectedLocale.registerPage.checkout}
        </button>{" "}
      </div>
      <Toaster/>
    </div>
  );
}
