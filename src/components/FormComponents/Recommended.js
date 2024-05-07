import React, { useState, useEffect } from "react";
import state from "../../feature/studentRegistration/store";

import courseData from "../../i18n/course.json";
import Image from "next/image";
import { toast } from "react-toastify";

export default function Recommended(props) {
  const [isAmharic, setIsAmharic] = useState(
    props.selectedLocale.locale === "am-ET"
  );
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
  const [recommendationArray, setRecommendationArray] = useState(
    state.getState().studentRecommendation
  );
  const [exploreCoursesArray, setExploreCoursesArray] = useState(
    state.getState().allCourses
  );

  const [activeTab, setActiveTab] = useState(0);
  const [isExploreCourse, setIsExploreCourse] = useState(false);
  const [originalCourse, setOriginalCourse] = useState(null);
  const actions = state.getState().actions;
  const selectedCourse = state.getState().studentRecommendation;


  if (recommendationArray.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <h1> No course found </h1>{" "}
      </div>
    );
  }

  useEffect(() => {
    const recommendationArray = state.getState().studentRecommendation;
    if (recommendationArray.length > 0) {
      setOriginalCourse(recommendationArray);
    }
  }, []);

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

  useEffect(() => {
    if (props.selectedLocale.locale === "am-ET") {
      setIsAmharic(true);
    } else {
      setIsAmharic(false);
    }
  }, [props.selectedLocale.locale]);

  const handleCourseSelection = (index) => {
    setActiveTab(index);
    setSelectedCourseIndex(index);
  };

  const findTranslatedCourse = (courseId) =>
    courseData.courses.find((course) => course._id === courseId);

  const calculatePricing = () => {
    const course = recommendationArray[selectedCourseIndex];
    const price = course.prices[0].unitAmount / 100;
    const session = course.Sessions;
    return (price / session).toFixed(2);
  };

  const arrStingToArray = (str) => {
    if (!str) return null;
    const arr = str.replace("[", "").replace("]", "").split(",").map(String);
    const r = arr
      .map((str) => str.replace(/['"]/g, ""))
      .sort((a, b) => a.length - b.length);
    return r;
  };

  const handleCardClick = (clickedCourse) => {
    // Get the current state
    const currentCourses = state.getState().studentRecommendation;

    // Create a new course object by merging the properties of the current course and the clicked course
    const updatedCourse = {
      ...currentCourses[selectedCourseIndex],
      name: clickedCourse.name,
      description: clickedCourse.description,
      images: clickedCourse.images,
      id: clickedCourse.id,
      _id: clickedCourse._id,
      prices: clickedCourse.prices,
      SkillsGained: clickedCourse.SkillsGained,
      TopicsCovered: clickedCourse.TopicsCovered,
      Prerequisite: clickedCourse.Prerequisite,
      TrainingFrequency: clickedCourse.TrainingFrequency,
      GradeLevel: clickedCourse.GradeLevel,
      CodingExperiance: clickedCourse.CodingExperiance,
      Sessions: clickedCourse.Sessions,
      // Add more properties here as needed...
    };

    // Create a new array with the updated course
    const updatedCourses = currentCourses.map((course, index) => {
      if (index !== selectedCourseIndex) {
        return course;
      }
      return updatedCourse;
    });

    // Update the global state with the new array
    state.getState().actions.setStudentRecommendation(updatedCourses);

    setIsExploreCourse(true);
    toast.success("You have switched to an explore course");

    window.scrollTo({
      top: 0,
      behavior: "smooth", // if you want a smooth scrolling effect
    });
  };

  const parseJSON = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing JSON string:", error);
      return null;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center mx-auto max-w-screen-md justify-center">
        <h3 className="text-2xl text-center mx-auto font-normal mt-6">
          {props.selectedLocale.registerPage.below}{" "}
          {isExploreCourse ? (
            <span className="">
              {props.selectedLocale.registerPage.explorec}{" "}
              <span
                className="text-md text-purple  cursor-pointer"
                onClick={() => {
                  setIsExploreCourse(false);
                  actions.setStudentRecommendation(originalCourse);
                  console.log(originalCourse);
                  toast.success(
                    "You have switched back to the original recommended course"
                  );
                }}
              >
                {" "}
               {props.selectedLocale.registerPage.click}<br /> {props.selectedLocale.registerPage.rec}{" "}
              </span>
            </span>
          ) : (
            props.selectedLocale.registerPage.course
          )}{" "}
        </h3>
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
        </div>
        {recommendationArray.map((course, index) => (
          <div
            key={index}
            className={`${
              selectedCourseIndex === index ? "flex" : "hidden"
            } flex-col items-center mx-auto max-w-screen-md justify-center mt-8`}
          >
            <div className="flex flex-col md:flex-row gap-x-12 mx-auto items-center my-4 ">
              {console.log({ course })}
              {/*left */}
              <div className="items-center justify-center h-auto mt-4">
                <img
                  src="/images/Vector.png"
                  alt="List icon"
                  className="w-245 h-29 -mb-9"
                />
                <h3 className=" text-3xl font-black font-indie ">
                  {" "}
                  {isAmharic
                  ? findTranslatedCourse(course._id)?.name ?? 
                  course.name : course.name}{" "}
                </h3>{" "}
                <div className="pb-2 w-335 justify-center items-center flex  mt-6 mb-7">
                  <img
                    className="sm:w-[70%] "
                    style={{ objectFit: "contain" }}
                    alt=""
                    src={course?.images[0] ?? ""}
                  />
                </div>{" "}
                <div className="flex">
                  <h3 className="pb-2 font-semibold bg-yellow-2 w-115 h-33 mt-5  border-solid pl-5 pt-1 rounded-md">
                    {" "}
                    {isAmharic
                      ? findTranslatedCourse(course._id)?.GradeLevel ??
                        course.GradeLevel
                      : course.GradeLevel}{" "}
                  </h3>{" "}
                  <h3 className="pb-2 font-semibold bg-yellow-2 w-36 h-33 mt-5 ml-8 border-solid pl-5 pt-1 rounded-md">
                    {" "}
                    {props.selectedLocale.registerPage.recommended.session}{" "}
                  </h3>{" "}
                </div>{" "}
                <div className="flex">
                  <h3 className="pb-2 font-semibold bg-yellow-2 w-128 h-33 mt-6 border-solid pl-5 pt-1 rounded-md ">
                    {" "}
                    {course.Sessions}{" "}
                    {props.selectedLocale.registerPage.recommended.sessions}{" "}
                  </h3>{" "}
                  <h3 className="pb-2 font-semibold  bg-yellow-2 w-163 h-33 mt-6 ml-8 border-solid pl-5 pt-1 rounded-md">
                    {" "}
                    {
                      props.selectedLocale.registerPage.recommended
                        .moneyPerSession
                    }{" "}
                  </h3>{" "}
                </div>
                <h2 className="text-3xl w-232 font-bold text-left mb-0 mt-6 ">
                  {" "}
                  {
                    props.selectedLocale.registerPage.recommended.skillsGained
                  }{" "}
                </h2>{" "}
                <div className="">
                  <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
                    {" "}
                    {(isAmharic
                      ? arrStingToArray(
                          findTranslatedCourse(course._id)?.SkillsGained[0]
                        ) ?? arrStingToArray(course.SkillsGained[0])
                      : arrStingToArray(course.SkillsGained[0])
                    ).map((skill, index) => {
                      return (
                        <li
                          className="flex items-start b-3 text-left text-lg capitalize"
                          key={index}
                        >
                          <img
                            src="/images/Icon.png"
                            alt="List icon"
                            className="w-5 h-5 mr-2 mt-1"
                          />
                          <span className="text-black"> {skill} </span>{" "}
                        </li>
                      );
                    })}{" "}
                  </ul>{" "}
                </div>{" "}
              </div>
              {/* right */}{" "}
              <div className=" mt-4 ">
                <p className="text-left text-xl font-normal ">
                  {" "}
                  {isAmharic
                    ? findTranslatedCourse(course._id)?.description ??
                      course.description
                    : course.description}{" "}
                </p>{" "}
                <ul className="mt-5 md:list-disc">
                  <p className="text-left mb-2 text-3xl font-bold ">
                    {props.selectedLocale.registerPage.PrerequisiteDesc}
                  </p>
                  <li className="flex items-start b-3 text-left text-lg pb-3">
                    <img
                      src="/images/icon2.png"
                      alt="List icon"
                      className="w-5 h-5 mr-3 mt-1"
                    />
                    <span className="">
                      <p className="text-left">
                        {isAmharic
                          ? findTranslatedCourse(course._id)?.Prerequisite ??
                            course.Prerequisite
                          : course.Prerequisite}
                      </p>
                    </span>
                  </li>
                </ul>
                <h2 className="text-left text-3xl font-bold mb-7 mt-4">
                  {" "}
                  {
                    props.selectedLocale.registerPage.recommended.topicsCovered
                  }{" "}
                </h2>{" "}
                <ul className="mt-5 md:list-disc">
                  {(() => {
                    try {
                      let topics;
                      if (isAmharic) {
                        topics =
                          findTranslatedCourse(course._id)?.TopicsCovered[0] ??
                          course.TopicsCovered[0];
                      } else {
                        topics = course.TopicsCovered[0];
                      }

                      // Try to parse JSON, if it fails, split the string by comma
                      try {
                        topics = JSON.parse(topics);
                      } catch (error) {
                        topics = topics.replace(/[\[\]"]/g, "").split(",");
                      }

                      return topics.map((topic, index) => (
                        <li
                          className="flex items-start b-3 text-left text-lg pb-3 mt-1"
                          key={index}
                        >
                          <img
                            src="/images/Icon3.png"
                            alt="List icon"
                            className="w-5 h-5 mr-3"
                          />
                          <span className="text-black">{topic}</span>
                        </li>
                      ));
                    } catch (error) {
                      console.error(error);
                      return <li>Error: Unable to parse topics</li>;
                    }
                  })()}
                </ul>
              </div>{" "}
            </div>{" "}
          </div>
        ))}
        <div className="flex items-center justify-center gap-x-32 my-4 w-full">
          <button
            onClick={() => {
              if (activeTab > 0) {
                handleCourseSelection(activeTab - 1);
                window.scrollTo({
                  top: 0,
                  behavior: "smooth", // if you want a smooth scrolling effect
                });
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
              if (activeTab < recommendationArray.length - 1) {
                // If it's not the last tab, go to the next tab
                handleCourseSelection(activeTab + 1);
                window.scrollTo({
                  top: 0,
                  behavior: "smooth", // if you want a smooth scrolling effect
                });
              } else {
                // If it's the last tab, go to the next page
                props.next();
              }
            }}
            className="bg-yellow w-245 h-48 border-solid rounded-md font-bold"
          >
            {props.selectedLocale.registerPage.next}{" "}
          </button>{" "}
        </div>{" "}
      </div>

      <section className="flex flex-col justify-center py-10">
        <div className="sm:self-center sm:justify-self-center sm:-mt-0 flex flex-col items-center justify-center text-center mx-10">
          <h3 className="font-indie lg:text-4xl text-3xl font-extrabold text-black">
          {props.selectedLocale.registerPage.explore}
          </h3>
          <div className="flex pb-10 justify-center sm:-mt-16 -mt-10 ">
            <img
              className="sm:w-[70%] "
              style={{ objectFit: "contain" }}
              alt=""
              src="/explore1.png"
            />
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1  gap-4">
            {exploreCoursesArray.map((course, index) => (
              <button
                key={index}
                className="max-w-sm bg-white rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:border-yellow"
                onClick={() => handleCardClick(course)}
              >
                <div style={{ height: "200px" }}>
                  <img
                    className="w-full rounded-t-lg"
                    style={{ objectFit: "contain", maxHeight: "100%" }}
                    src={course.images}
                    alt={course.name}
                  />
                </div>

                <div className="p-2 flex-grow">
                <h3 className=" text-center text-gray-900 font-bold  text-lg mb-3 mt-3">
                {isAmharic
                  ? findTranslatedCourse(course._id)?.name ?? 
                  course.name : course.name}
                </h3>
                <p class="mb-3 font-normal text-sm text-gray-700 dark:text-gray-400">
                  {isAmharic
                    ? findTranslatedCourse(course._id)?.description ??
                  course.description: course.description}
                </p>
              </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
