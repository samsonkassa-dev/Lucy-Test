import React, { useState, useEffect } from "react";
import state from "../../feature/studentRegistration/store";
import { useAllCourses } from "../../hooks/useAllCourses";
import dynamic from "next/dynamic";
import courseData from "../../i18n/course.json";

function Explore(props) {
  const { fetchAllCourses } = useAllCourses();
  const [exploreCoursesArray, setExploreCoursesArray] = useState([]);
  const resetSelectedCourse = state.getState().actions.resetSelectedCourse;
  const [isAmharic, setIsAmharic] = useState(
    props.selectedLocale.locale === "am-ET"
  );

  useEffect(() => {
    if (props.selectedLocale.locale === "am-ET") {
      setIsAmharic(true);
    } else {
      setIsAmharic(false);
    }
  }, [props.selectedLocale.locale]);

  const findTranslatedCourse = (courseId) =>
  courseData.courses.find((course) => course._id === courseId);
  

  useEffect(() => {
    // Reset the studentRecommendation array in the global state
    resetSelectedCourse();
  
    fetchAllCourses().then((courses) => {
      if (Array.isArray(courses)) {
        setExploreCoursesArray(courses);
      } else {
        console.error('Invalid value for courses:', courses);
      }
    });
  
    const updateExploreCoursesArray = () => {
      const courses = state.getState().allCourses;
      if (Array.isArray(courses)) {
        setExploreCoursesArray(courses);
      } else {
        console.error('Invalid value for allCourses:', courses);
      }
    };
  
    const unsubscribe = state.subscribe(
      updateExploreCoursesArray,
      (state) => state.allCourses
    );
  
    return () => unsubscribe();
  }, []);

  
  
  const handleCardClick = (clickedCourse) => {
    // Create a new course object with the clicked course details

    state.getState().actions.setChosenCourse(true)
    // console.log("we clicked")
    const newCourse = {
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

    console.log(newCourse)
  
    // Get the current state
    const currentCourses = state.getState().studentRecommendation;

    

  
    // Update the global state with the new course added to the recommendations
    state
      .getState()
      .actions.setStudentRecommendation([newCourse]);


  
    
    props.next();
  };
  
  return (
    <section className="flex flex-col justify-center py-28">
      <div className="sm:self-center sm:justify-self-center sm:-mt-0 flex flex-col items-center  text-center ">
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
  );
}

export default dynamic(() => Promise.resolve(Explore), { ssr: false });
