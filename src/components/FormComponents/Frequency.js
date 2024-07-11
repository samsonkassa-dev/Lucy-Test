import { useState, useEffect } from "react";
import state from "../../feature/studentRegistration/store";
import { toast, Toaster } from "react-hot-toast";

function Frequency(props) {
  const recommendationArray = state.getState().studentRecommendation;
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
  const userId = state.getState()?.students?.userId;
  const studentIds = state.getState()?.students?.studentIds;
  const [courseData, setCourseData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [clickedPrice, setClickedPrice] = useState("");

  const setStudentTrainingFrequency =
    state.getState()?.actions?.setStudentTrainingFrequency;

  const handleCourseSelection = (index) => {
    setActiveTab(index);
    setSelectedCourseIndex(index);
  };

  useEffect(() => {
    setCourseData(
      recommendationArray.map((item) => ({
        name: item.name,
        price: item.prices[0].unitAmount / 100,
        quantity: 1,
        image: item.images[0],
        courseId: item._id,
        
      }))
    );
  }, [recommendationArray]);

  const handleRadioChange = (e, index) => {
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

  const handleNext = async (e) => {
    const cleanArray = (arr) =>
      Array.isArray(arr) && arr.filter((item) => item);
    if (cleanArray(selectedValues).length !== recommendationArray.length) {
      return toast.error("Make sure you selected all fields");
    }
    const dataToSend = selectedValues?.map((value) => {
      return {
        trainingFrequency: value.split(".")[0],
        courseId: value.split(".")[1],
        studentId: value.split(".")[2],
        userId,
        clickedPrice: clickedPrice

      };
    });
    setStudentTrainingFrequency(dataToSend);
    console.log(dataToSend);
    toast
      .promise(
        // usePostFrequencyInfo(dataToSend),
        new Promise((resolve, reject) =>
          setTimeout(() => resolve("Success"), 1000)
        ),
        {
          loading: "Updating Information user",
          success: "Success",
          error: {
            render({ data }) {
              // When the promise reject, data will contains the error
              return `${
                data?.response?.data?.message ?? "something went wrong "
              }`;
            },
          },
        }
      )
      .then((res) => {
        props.next();
      });
  };

  const handleRadioClick = (e) => {
    // Update selectedSession in your global state
    state.getState().actions.setSelectedSession(e.target.id);
  };


  

  const renderFrequencySelectionCard = () => {

    return (
      
      <div className={`h-auto mx-auto w-full`}>
        <div className=" h-auto flex flex-col mx-auto mt-5">
          <div className="self-center relative flex justify-center items-center">
            <input
              type="radio"
              id={`Session1`}
              name={`Session`}
              onChange={(e) => {
                handleRadioChange(e);
                setClickedPrice("365$");
              }}
              onClick={(e) => handleRadioClick(e)}
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
                    props.selectedLocale.registerPage.frequency.sessionEnroll[0]
                      .title
                  }
                </p>
                <p className="text-sm text-yellow font-semibold">
                  {
                    props.selectedLocale.registerPage.frequency.sessionEnroll[0]
                      .time
                  }
                </p>
                <div className="flex items-center flex-wrap">
                  <p>
                    {
                      props.selectedLocale.registerPage.frequency
                        .sessionEnroll[0].price
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
              onChange={(e) => {
                handleRadioChange(e);
                setClickedPrice("365$");
              }}
              onClick={(e) => handleRadioClick(e)}
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
                    props.selectedLocale.registerPage.frequency.sessionEnroll[1]
                      .title
                  }
                </p>
                <p className="text-sm text-yellow font-semibold">
                  {
                    props.selectedLocale.registerPage.frequency.sessionEnroll[1]
                      .time
                  }
                </p>
                <div className="flex items-center flex-wrap">
                  <p>
                    {
                      props.selectedLocale.registerPage.frequency
                        .sessionEnroll[1].price
                    }
                    &nbsp;{" "}
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>
        <Toaster/>
      </div>

    );
  };

  return (
    <div className="flex flex-col items-center mx-auto max-w-screen-md justify-center">
      {/* 
      <div className="flex flex-wrap justify-center mt-6">
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

      <div className="w-full">{renderFrequencySelectionCard()}</div>

      <div className="flex pt-10 items-center justify-center gap-x-32 my-4 w-full">
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
            
          }}
          className="bg-yellow w-245 h-48 border-solid rounded-md font-bold"
        >
          {props.selectedLocale.registerPage.chooseDate}
        </button>{" "}
      </div>
    </div>
  );
}

export default Frequency;
