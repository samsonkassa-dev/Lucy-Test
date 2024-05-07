import axios from "../api/axios";
import state from "../feature/studentRegistration/store";

export const usePostStudentRecommendation = async (studentInfo, shouldUpdateState) => {
  const actions = state.getState().actions;
  console.log(state.getState().studentRecommendation)
  const initialRecommendation = state.getState().studentRecommendation;
  console.log(initialRecommendation)
  
  try {
    const getRecommendationData = await axios.post(
      "/v1/user/recommend",
      studentInfo
    );

    // Update the state with the server response
    console.log("the data", studentInfo)
    actions.setStudentRecommendation(getRecommendationData.data);


    // If shouldUpdateState is true, update specific properties from the original state
    if (shouldUpdateState) {
      const currentRecommendation = state.getState().studentRecommendation[0];
      const updatedRecommendation = {
        ...currentRecommendation,
        name: initialRecommendation[0].name,
        description: initialRecommendation[0].description,
        images: initialRecommendation[0].images,
        id: initialRecommendation[0].id,
        _id: initialRecommendation[0]._id,
        prices: initialRecommendation[0].prices,
    
      };

      actions.setStudentRecommendation([updatedRecommendation]);
    }

    console.log(state.getState().studentRecommendation)
    console.log(initialRecommendation)


    // Fetch all the courses
    const getAllCoursesData = await axios.get("/v1/course");
    console.log('All courses:', getAllCoursesData.data.products); // Replace with your actual API endpoint
    actions.setAllCourses(getAllCoursesData.data.products);

    // Filter out the recommended courses
      const exploreCoursesData = getAllCoursesData.data.products.filter((course) => {
        const match = getRecommendationData.data.some((rec) => {
          // console.log('Comparing:', rec._id, course._id);
          return rec._id === course._id;
        });
        return !match;
      });
    
    
    console.log('Explore courses:', exploreCoursesData);
    actions.setExploreCourses(exploreCoursesData);
  } catch (error) {
    console.error('Something went wrong:', error);
    console.log(error)
    console.log(error.response)
    console.log(error.header)
    
    // Set all state variables to empty arrays
    actions.setStudentRecommendation([]);
    actions.setAllCourses([]);
    actions.setExploreCourses([]);
  }
};
