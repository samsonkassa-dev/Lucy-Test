import React from "react";
import state from "../../feature/studentRegistration/store";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import localeData from "../../i18n/index.json";
import courseData from "../../i18n/course.json";

const FeaturedCourseCard = (props) => {
  const router = useRouter();
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

  const handleCardClick = () => {
    // Create a new course object with the clicked course details

    state.getState().actions.setChosenCourse(true);
    // console.log("we clicked")
    const newCourse = {
      name: props.course.name,
      description: props.course.description,
      images: props.course.images,
      id: props.course.id,
      _id: props.course._id,
      prices: props.course.prices,
      SkillsGained: props.course.SkillsGained,
      TopicsCovered: props.course.TopicsCovered,
      Prerequisite: props.course.Prerequisite,
      TrainingFrequency: props.course.TrainingFrequency,
      GradeLevel: props.course.GradeLevel,
      CodingExperiance: props.course.CodingExperiance,
      Sessions: props.course.Sessions,
    };

    console.log(newCourse);
    router.push({
      pathname: "/formEnroll",
      query: {
        courseSelected: props.course?._id,
      },
    });
  };

  return (
    <div
      className="flex flex-col cursor-pointer gap-2 bg-white rounded-xl shadow-2xl border border-cyan-950 max-w-[25rem] lg:h-[34rem] mx-5"
      onClick={() => {
        handleCardClick();
      }}
    >
      <div
        className={`flex flex-col py-8 lg:text-xl font-bold gap-2 justify-center items-center bg-opacity-20`}
        style={{
          backgroundColor:
            props.titleColor == "blue" ? "#0052B426" : "#FF70021A",
        }}
      >
        <h3
          className={`font-sans text-center text-${props.titleColor}`}
          style={{
            color: props.titleColor == "blue" ? "#0052B4FF" : "#FF7002FF",
          }}
        >
          {isAmharic
            ? findTranslatedCourse(props.course?._id)?.name ??
              props.course?.name
            : props.course?.name}
        </h3>
        <img src={props.course?.images} alt="" className="w-1/3" />
      </div>
      <div className="p-4 text-center max-md:text-sm max-sm:text-xs font-sans">
        {isAmharic
          ? findTranslatedCourse(props.course?._id)?.description ??
            props.course?.description
          : props.course?.description}

        <h2 className="text-left max-md:text-md max-sm:text-sm font-extrabold -mb-2 mt-4 font-sans">
          {isAmharic ? "የሚሸፈኑ ርዕሶች" : "Topics Covered"}
        </h2>
        <ul className="mt-5 md:list-disc">
          {(() => {
            try {
              let topics;
              if (isAmharic) {
                topics =
                  findTranslatedCourse(props.course._id)?.TopicsCovered[0] ??
                  props.course.TopicsCovered[0];
              } else {
                topics = props.course.TopicsCovered[0];
              }

              // Try to parse JSON, if it fails, split the string by comma
              try {
                topics = JSON.parse(topics);
              } catch (error) {
                topics = topics.replace(/[\[\]"]/g, "").split(",");
              }

              return topics.slice(0, 3).map((topic, index) => (
                <li
                  className="flex items-center text-left text-lg pb-2 mt-1"
                  key={index}
                >
                  <img
                    src="/featured_icon.svg"
                    alt="List icon"
                    className="w-5 h-5 mr-3"
                  />
                  <span className="text-black max-md:text-sm max-sm:text-xs">
                    {topic}
                  </span>
                </li>
              ));
            } catch (error) {
              console.error(error);
              return <li>Error: Unable to parse topics</li>;
            }
          })()}
        </ul>

        {/* <div className="text-left font-extrabold lg:text-xl mt-5">
          Topics Covered
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <div className="flex flex-row gap-5">
            <img src="/featured_icon.svg" alt="icon" />
            <span className="lg:text-lg">Algorithms</span>
          </div>

          <div className="flex flex-row gap-5">
            <img src="/featured_icon.svg" alt="icon" />
            <span className="lg:text-lg">Block based learning</span>
          </div>
          <div className="flex flex-row gap-5">
            <img src="/featured_icon.svg" alt="icon" />
            <span className="lg:text-lg">Programming</span>
          </div>
          <div className="flex flex-row gap-5">
            <img src="/featured_icon.svg" alt="icon" />
            <span className="lg:text-lg">intellectual thinking</span>
          </div>
          <div className="flex flex-row gap-5">
            <img src="/featured_icon.svg" alt="icon" />
            <span className="lg:text-lg">Loops</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default FeaturedCourseCard;
