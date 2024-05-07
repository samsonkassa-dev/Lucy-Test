import React, { useState, useEffect, useRef } from "react";
import state from "../../feature/studentRegistration/store";
import courseData from "../../i18n/course.json";
import { toast } from "react-toastify";
import axios from "../../api/axios";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import localeData from "../../i18n/index.json";

export default function CheckOut(props) {
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  let [selectedTap, setSelectedTap] = useState(true);
  const router = useRouter();
  const actions = state.getState().actions;
  const sliderRef = useRef(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [selectedLocale, setselectedLocale] = useState(localeData.labels[0]);

  const handleSubscribeClick = () => {
    if (selectedTap == true) {
      createCheckOutSession();
    } else{
      createCheckOutSessionSubscribe()
    }
  };

  const [recommendationArray, setRecommendationArray] = useState(
    state.getState().checkoutSession
  );

  // console.log(recommendationArray);

  const [isAmharic, setIsAmharic] = useState(
    props.selectedLocale.locale === "am-ET"
  );

  const findTranslatedCourse = (courseId) =>
  courseData.courses.find((course) => course._id === courseId);
  

  useEffect(() => {
    setselectedLocale(
      localeData.labels.filter((l) => l.locale === router.locale)[0]
    );
  }, [router.locale]);


  useEffect(() => {
    // Function to update local state when global state changes
    const updateRecommendationArray = () => {
      setRecommendationArray(state.getState().studentRecommendation);
    };

    // Subscribe to changes in studentRecommendation
    const unsubscribe = state.subscribe(
      updateRecommendationArray,
      (state) => state.studentRecommendation
    );

    // Clean up subscription
    return () => unsubscribe();
  }, []);


  const parseJSON = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing JSON string:", error);
      return null;
    }
  };

  const createCheckOutSession = async () => {
    const trainingFrequencyArr = state.getState().checkoutSession;

    try {
      const { data } = await axios.post("/v1/order/createCheckout", {
        items: trainingFrequencyArr,
      });

      router.push(data?.url);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const createCheckOutSessionSubscribe = async () => {
    const trainingFrequencyArr = state.getState().checkoutSession;
    console.log(trainingFrequencyArr)

    // Create a new array with only the properties you need
    const itemsForSubscription = trainingFrequencyArr.map((item) => ({
      parentId: item.userId,
      product_id: item.courseId
    }));
    console.log("items" + {itemsForSubscription});

    try {
      const { data } = await axios.post(
        "/v1/subscription/create-checkout-session",
        itemsForSubscription
      );
      console.log(data);
      router.push(data?.url);
    } catch (error) {
      console.error(error);
      console.log(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <h3 className="text-3xl text-center mx-auto font-bold text-purple mt-20 mb-">
        {selectedLocale.checkoutPage.Title}
      </h3>
      <div className="flex pt-10 flex-col  items-center mx-auto max-w-screen-lg justify-center">
        <div className="flex items-center bg-[#cab7f6] rounded-full">
          {/* Left button */}
          <button
            className={`md:w-1/2 w-full md:min-w-[18rem] min-w-[10rem] text-[12px] md:text-lg font-semibold h-14 rounded-full flex items-center justify-center cursor-pointer ${
              selectedTap == true
                ? "bg-[#6743EE] text-white"
                : "bg-[#cab7f6] text-[#a37ff9]"
            }`}
            onClick={() => setSelectedTap(true)}
          >
            {console.log("selectedTap", selectedTap)}
            {selectedLocale.checkoutPage.payOnce}
          </button>

          {/* Right button */}
          <button
            className={`md:w-1/2 w-full md:min-w-[18rem] min-w-[10rem] text-[12px] md:text-lg font-semibold h-14 rounded-full flex items-center justify-center cursor-pointer ${
              selectedTap == false
                ? "bg-[#6743EE] text-white"
                : "bg-[#cab7f6] text-[#a37ff9]"
            }`}
            onClick={() => setSelectedTap(false)}
          >
            {console.log("selectedTap", selectedTap)}
            {selectedLocale.checkoutPage.payInstallment}
          </button>
        </div>

        <div className="flex flex-row items-center  mx-auto md:max-w-screen-sm max-w-500px  justify-center">
          <div className="">
            {recommendationArray.length > 1 && (
              <button
                onClick={() =>
                  setCurrentCourseIndex((prevIndex) =>
                    prevIndex === 0
                      ? recommendationArray.length - 1
                      : prevIndex - 1
                  )
                }
                className="bg-purple text-white w-8 h-8 rounded-full"
              >
                {"<"}
              </button>
            )}
          </div>

          <div>
            {recommendationArray.map((course, index) => (
              <div
                key={index}
                className={`${
                  index === currentCourseIndex ? "block" : "hidden"
                } flex-col items-center  mx-auto max-w-screen-sm mt-8 justify-center `}
              >
                {console.log(course)}

                <div className="flex flex-col md:flex-row gap-y-10 items-center ">
                  <div className="items-center justify-center h-auto mt-4">
                    <img
                      src="/images/Vector.png"
                      alt="List icon"
                      className="w-245 h-29 -mb-9"
                    />
                    <h3 className="text-3xl font-black font-indie">
                      {course?.name ?? "Starter package"}
                    </h3>
                    <div style={{ height: "200px" }}>
                      <img
                        className="w-full rounded-t-lg"
                        style={{ objectFit: "contain", maxHeight: "100%" }}
                        src={course?.image ?? ""}
                        alt={course.name}
                      />
                    </div>
                    <ul className="mt-5 md:list-disc">
                      <li
                        className="flex items-start b-3 text-left text-lg pb-3 mt-1"
                        key={index}
                      >
                        <img
                          src="/images/Icon3.png"
                          alt="List icon"
                          className="w-5 h-5 mr-3"
                        />
                        <span className="text-black -mt-[2px]">
                          {" "}
                          <span className="font-bold text-lg">
                            {selectedLocale.checkoutPage.student} :{" "}
                          </span>{" "}
                          {course.RecommendedFor}
                        </span>
                      </li>

                      <li
                        className="flex items-start b-3 text-left text-lg pb-3 mt-1"
                        key={index}
                      >
                        <img
                          src="/images/Icon3.png"
                          alt="List icon"
                          className="w-5 h-5 mr-3"
                        />
                        <span className="text-black -mt-[2px]">
                          <span className="font-bold text-lg">
                            {selectedLocale.checkoutPage.trainingFrequency} :{" "}
                          </span>
                          {selectedLocale.checkoutPage.once}
                        </span>
                      </li>
                      <li
                        className="flex items-start b-3 text-left text-lg pb-3 mt-1"
                        key={index}
                      >
                        <img
                          src="/images/Icon3.png"
                          alt="List icon"
                          className="w-5 h-5 mr-3"
                        />
                        <span className="text-black -mt-[2px]">
                          {" "}
                          <span className="font-bold text-lg">
                            {selectedLocale.checkoutPage.pay} :{" "}
                          </span>{" "}
                          {course.clickedPrice}
                        </span>
                      </li>

                      <li
                        className="flex items-start text-left text-lg mt-1"
                        key={index}
                      >
                        <img
                          src="/images/Icon3.png"
                          alt="List icon"
                          className="w-5 h-5 mr-3"
                        />
                        <span className="text-black -mt-[2px]">
                          {" "}
                          <span className="font-bold text-lg">
                            {selectedLocale.checkoutPage.quantity} :{" "}
                          </span>{" "}
                          {course.quantity}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            {recommendationArray.length > 1 && (
              <button
                onClick={() =>
                  setCurrentCourseIndex((prevIndex) =>
                    prevIndex === recommendationArray.length - 1
                      ? 0
                      : prevIndex + 1
                  )
                }
                className="bg-purple text-white w-8 h-8 rounded-full"
              >
                {">"}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-x-10 my-4 w-[70%]">
          <button
            type="button"
            className="w-[30%] bg-yellow text-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 "
            onClick={props.prev}
          >
            {selectedLocale.checkoutPage.back}
          </button>

          <button
            type="button"
            onClick={handleSubscribeClick}
            className="w-[30%] bg-yellow text-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 "
          >
            {selectedLocale.checkoutPage.pay}
          </button>
        </div>
      </div>
    </>
  );
}
